from fastapi import APIRouter, HTTPException, Body, Depends, Request
from pydantic import BaseModel
from slowapi import Limiter
from slowapi.util import get_remote_address
from app.db import get_db_connection
from app.api.auth import get_current_user
from app.core.security import sanitize_string, validate_url, check_teacher_role
from app.core.config import RATE_LIMIT_PER_MINUTE

limiter = Limiter(key_func=get_remote_address)

router = APIRouter(prefix="/resources", tags=["resources"])

@router.get("/")
@limiter.limit(f"{RATE_LIMIT_PER_MINUTE}/minute")
async def list_resources(request: Request, course_id: int = None):
    """Public endpoint - accessible to students and teachers"""
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

class ResourceCreate(BaseModel):
    course_id: int
    name: str
    url: str
    type: str = None

@router.post("/")
@limiter.limit(f"{RATE_LIMIT_PER_MINUTE}/minute")
async def create_resource(request: Request, resource: ResourceCreate = Body(...), user=Depends(get_current_user)):
    """Teacher-only endpoint - create resources for own courses"""
    check_teacher_role(user)
    
    name = sanitize_string(resource.name, max_length=200)
    url = validate_url(resource.url)
    resource_type = sanitize_string(resource.type, max_length=50) if resource.type else None
    
    conn = get_db_connection()
    if not conn:
        raise HTTPException(status_code=500, detail="DB connection error")
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT * FROM courses WHERE id=%s", (resource.course_id,))
    course = cursor.fetchone()
    if not course:
        cursor.close()
        conn.close()
        raise HTTPException(status_code=404, detail="Course not found")
    if course["instructor_id"] != user["id"]:
        cursor.close()
        conn.close()
        raise HTTPException(status_code=403, detail="Not authorized to create resources for this course")
    
    cursor.execute(
        "INSERT INTO resources (course_id, name, url, type) VALUES (%s, %s, %s, %s)",
        (resource.course_id, name, url, resource_type)
    )
    conn.commit()
    resource_id = cursor.lastrowid
    cursor.execute("SELECT * FROM resources WHERE id=%s", (resource_id,))
    new_resource = cursor.fetchone()
    cursor.close()
    conn.close()
    if not new_resource:
        raise HTTPException(status_code=500, detail="Failed to fetch new resource after insert")
    return new_resource

@router.put("/{resource_id}")
@limiter.limit(f"{RATE_LIMIT_PER_MINUTE}/minute")
async def update_resource(request: Request, resource_id: int, user=Depends(get_current_user), name: str = None, url: str = None, type: str = None):
    """Teacher-only endpoint - update resources in own courses"""
    check_teacher_role(user)
    
    conn = get_db_connection()
    if not conn:
        raise HTTPException(status_code=500, detail="DB connection error")
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT r.*, c.instructor_id FROM resources r JOIN courses c ON r.course_id = c.id WHERE r.id=%s", (resource_id,))
    resource = cursor.fetchone()
    if not resource:
        cursor.close()
        conn.close()
        raise HTTPException(status_code=404, detail="Resource not found")
    
    if resource["instructor_id"] != user["id"]:
        cursor.close()
        conn.close()
        raise HTTPException(status_code=403, detail="Not authorized to update this resource")
    
    update_fields = []
    params = []
    if name is not None:
        update_fields.append("name=%s")
        params.append(sanitize_string(name, max_length=200))
    if url is not None:
        update_fields.append("url=%s")
        params.append(validate_url(url))
    if type is not None:
        update_fields.append("type=%s")
        params.append(sanitize_string(type, max_length=50))
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
@limiter.limit(f"{RATE_LIMIT_PER_MINUTE}/minute")
async def delete_resource(request: Request, resource_id: int, user=Depends(get_current_user)):
    """Teacher-only endpoint - delete resources in own courses"""
    check_teacher_role(user)
    
    conn = get_db_connection()
    if not conn:
        raise HTTPException(status_code=500, detail="DB connection error")
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT r.*, c.instructor_id FROM resources r JOIN courses c ON r.course_id = c.id WHERE r.id=%s", (resource_id,))
    resource = cursor.fetchone()
    if not resource:
        cursor.close()
        conn.close()
        raise HTTPException(status_code=404, detail="Resource not found")
    
    if resource["instructor_id"] != user["id"]:
        cursor.close()
        conn.close()
        raise HTTPException(status_code=403, detail="Not authorized to delete this resource")
    
    cursor.execute("DELETE FROM resources WHERE id=%s", (resource_id,))
    conn.commit()
    cursor.close()
    conn.close()
    return {"id": resource_id, "deleted": True}
