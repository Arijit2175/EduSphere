from fastapi import APIRouter, HTTPException
from app.db import get_db_connection

router = APIRouter(prefix="/resources", tags=["resources"])

@router.get("/")
def list_resources(course_id: int = None):
    conn = get_db_connection()
    if not conn:
        raise HTTPException(status_code=500, detail="DB connection error")
    cursor = conn.cursor(dictionary=True)
    if course_id:
        cursor.execute("SELECT * FROM resources WHERE course_id=%s", (course_id,))
    else:
        cursor.execute("SELECT * FROM resources")
    resources = cursor.fetchall()
    cursor.close()
    conn.close()
    return resources

@router.post("/")
def create_resource(course_id: int, name: str, url: str, type: str = None):
    conn = get_db_connection()
    if not conn:
        raise HTTPException(status_code=500, detail="DB connection error")
    cursor = conn.cursor()
    cursor.execute(
        "INSERT INTO resources (course_id, name, url, type) VALUES (%s, %s, %s, %s)",
        (course_id, name, url, type)
    )
    conn.commit()
    resource_id = cursor.lastrowid
    cursor.close()
    conn.close()
    return {"id": resource_id, "course_id": course_id, "name": name}

@router.put("/{resource_id}")
def update_resource(resource_id: int, name: str = None, url: str = None, type: str = None):
    conn = get_db_connection()
    if not conn:
        raise HTTPException(status_code=500, detail="DB connection error")
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM resources WHERE id=%s", (resource_id,))
    if not cursor.fetchone():
        cursor.close()
        conn.close()
        raise HTTPException(status_code=404, detail="Resource not found")
    update_fields = []
    params = []
    if name is not None:
        update_fields.append("name=%s")
        params.append(name)
    if url is not None:
        update_fields.append("url=%s")
        params.append(url)
    if type is not None:
        update_fields.append("type=%s")
        params.append(type)
    if not update_fields:
        cursor.close()
        conn.close()
        raise HTTPException(status_code=400, detail="No fields to update")
    params.append(resource_id)
    cursor.execute(f"UPDATE resources SET {', '.join(update_fields)} WHERE id=%s", tuple(params))
    conn.commit()
    cursor.close()
    conn.close()
    return {"id": resource_id, "updated": True}

@router.delete("/{resource_id}")
def delete_resource(resource_id: int):
    conn = get_db_connection()
    if not conn:
        raise HTTPException(status_code=500, detail="DB connection error")
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM resources WHERE id=%s", (resource_id,))
    if not cursor.fetchone():
        cursor.close()
        conn.close()
        raise HTTPException(status_code=404, detail="Resource not found")
    cursor.execute("DELETE FROM resources WHERE id=%s", (resource_id,))
    conn.commit()
    cursor.close()
    conn.close()
    return {"id": resource_id, "deleted": True}
