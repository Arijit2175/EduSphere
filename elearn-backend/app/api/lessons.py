from fastapi import APIRouter, HTTPException
from app.db import get_db_connection

router = APIRouter(prefix="/lessons", tags=["lessons"])

@router.get("/")
def list_lessons(course_id: int = None):
    conn = get_db_connection()
    if not conn:
        raise HTTPException(status_code=500, detail="DB connection error")
    cursor = conn.cursor(dictionary=True)
    if course_id:
        cursor.execute("SELECT * FROM lessons WHERE course_id=%s ORDER BY order_index ASC", (course_id,))
    else:
        cursor.execute("SELECT * FROM lessons ORDER BY order_index ASC")
    lessons = cursor.fetchall()
    cursor.close()
    conn.close()
    return lessons

@router.post("/")
def create_lesson(course_id: int, title: str, content: str = "", video_url: str = None, order_index: int = 0):
    conn = get_db_connection()
    if not conn:
        raise HTTPException(status_code=500, detail="DB connection error")
    cursor = conn.cursor()
    cursor.execute(
        "INSERT INTO lessons (course_id, title, content, video_url, order_index) VALUES (%s, %s, %s, %s, %s)",
        (course_id, title, content, video_url, order_index)
    )
    conn.commit()
    lesson_id = cursor.lastrowid
    cursor.close()
    conn.close()
    return {"id": lesson_id, "course_id": course_id, "title": title}

@router.put("/{lesson_id}")
def update_lesson(lesson_id: int, title: str = None, content: str = None, video_url: str = None, order_index: int = None):
    conn = get_db_connection()
    if not conn:
        raise HTTPException(status_code=500, detail="DB connection error")
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM lessons WHERE id=%s", (lesson_id,))
    if not cursor.fetchone():
        cursor.close()
        conn.close()
        raise HTTPException(status_code=404, detail="Lesson not found")
    update_fields = []
    params = []
    if title is not None:
        update_fields.append("title=%s")
        params.append(title)
    if content is not None:
        update_fields.append("content=%s")
        params.append(content)
    if video_url is not None:
        update_fields.append("video_url=%s")
        params.append(video_url)
    if order_index is not None:
        update_fields.append("order_index=%s")
        params.append(order_index)
    if not update_fields:
        cursor.close()
        conn.close()
        raise HTTPException(status_code=400, detail="No fields to update")
    params.append(lesson_id)
    cursor.execute(f"UPDATE lessons SET {', '.join(update_fields)} WHERE id=%s", tuple(params))
    conn.commit()
    cursor.close()
    conn.close()
    return {"id": lesson_id, "updated": True}

@router.delete("/{lesson_id}")
def delete_lesson(lesson_id: int):
    conn = get_db_connection()
    if not conn:
        raise HTTPException(status_code=500, detail="DB connection error")
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM lessons WHERE id=%s", (lesson_id,))
    if not cursor.fetchone():
        cursor.close()
        conn.close()
        raise HTTPException(status_code=404, detail="Lesson not found")
    cursor.execute("DELETE FROM lessons WHERE id=%s", (lesson_id,))
    conn.commit()
    cursor.close()
    conn.close()
    return {"id": lesson_id, "deleted": True}
