from fastapi import APIRouter, HTTPException, Depends
from app.db import get_db_connection

router = APIRouter(prefix="/courses", tags=["courses"])

@router.get("/")
def list_courses():
    conn = get_db_connection()
    if not conn:
        raise HTTPException(status_code=500, detail="DB connection error")
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT * FROM courses")
    courses = cursor.fetchall()
    cursor.close()
    conn.close()
    return courses

@router.get("/{course_id}")
def get_course(course_id: int):
    conn = get_db_connection()
    if not conn:
        raise HTTPException(status_code=500, detail="DB connection error")
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT * FROM courses WHERE id=%s", (course_id,))
    course = cursor.fetchone()
    cursor.close()
    conn.close()
    if not course:
        raise HTTPException(status_code=404, detail="Course not found")
    return course

@router.post("/")
def create_course(title: str, description: str = "", type: str = "formal", category: str = None, level: str = None, duration: str = None, instructor_id: int = None):
    conn = get_db_connection()
    if not conn:
        raise HTTPException(status_code=500, detail="DB connection error")
    cursor = conn.cursor()
    cursor.execute(
        "INSERT INTO courses (title, description, type, category, level, duration, instructor_id) VALUES (%s, %s, %s, %s, %s, %s, %s)",
        (title, description, type, category, level, duration, instructor_id)
    )
    conn.commit()
    course_id = cursor.lastrowid
    cursor.close()
    conn.close()
    return {"id": course_id, "title": title}

@router.put("/{course_id}")
def update_course(course_id: int, title: str = None, description: str = None, category: str = None, level: str = None, duration: str = None):
    conn = get_db_connection()
    if not conn:
        raise HTTPException(status_code=500, detail="DB connection error")
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM courses WHERE id=%s", (course_id,))
    if not cursor.fetchone():
        cursor.close()
        conn.close()
        raise HTTPException(status_code=404, detail="Course not found")
    update_fields = []
    params = []
    if title is not None:
        update_fields.append("title=%s")
        params.append(title)
    if description is not None:
        update_fields.append("description=%s")
        params.append(description)
    if category is not None:
        update_fields.append("category=%s")
        params.append(category)
    if level is not None:
        update_fields.append("level=%s")
        params.append(level)
    if duration is not None:
        update_fields.append("duration=%s")
        params.append(duration)
    if not update_fields:
        cursor.close()
        conn.close()
        raise HTTPException(status_code=400, detail="No fields to update")
    params.append(course_id)
    cursor.execute(f"UPDATE courses SET {', '.join(update_fields)} WHERE id=%s", tuple(params))
    conn.commit()
    cursor.close()
    conn.close()
    return {"id": course_id, "updated": True}

@router.delete("/{course_id}")
def delete_course(course_id: int):
    conn = get_db_connection()
    if not conn:
        raise HTTPException(status_code=500, detail="DB connection error")
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM courses WHERE id=%s", (course_id,))
    if not cursor.fetchone():
        cursor.close()
        conn.close()
        raise HTTPException(status_code=404, detail="Course not found")
    cursor.execute("DELETE FROM courses WHERE id=%s", (course_id,))
    conn.commit()
    cursor.close()
    conn.close()
    return {"id": course_id, "deleted": True}
