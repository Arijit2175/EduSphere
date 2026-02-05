from fastapi import APIRouter, HTTPException, Query
from app.db import get_db_connection, return_db_connection, cache_get, cache_set

router = APIRouter(prefix="/lessons", tags=["lessons"])

@router.get("/")
def list_lessons(course_id: int = None, skip: int = Query(0, ge=0), limit: int = Query(100, ge=1, le=500)):
    """Get lessons with pagination and caching"""
    cache_key = f"lessons:{course_id}:{skip}:{limit}"
    cached_result = cache_get(cache_key)
    if cached_result:
        return cached_result
    
    conn = get_db_connection()
    if not conn:
        raise HTTPException(status_code=500, detail="DB connection error")
    
    try:
        cursor = conn.cursor()
        if course_id:
            cursor.execute("SELECT COUNT(*) as count FROM lessons WHERE course_id=%s", (course_id,))
            total = cursor.fetchone()['count']
            cursor.execute("SELECT * FROM lessons WHERE course_id=%s ORDER BY order_index ASC LIMIT %s OFFSET %s", (course_id, limit, skip))
        else:
            cursor.execute("SELECT COUNT(*) as count FROM lessons")
            total = cursor.fetchone()['count']
            cursor.execute("SELECT * FROM lessons ORDER BY order_index ASC LIMIT %s OFFSET %s", (limit, skip))
        lessons = cursor.fetchall()
        
        result = {"data": lessons, "total": total, "skip": skip, "limit": limit}
        cache_set(cache_key, result, ttl_seconds=600)
        return result
    finally:
        cursor.close()
        return_db_connection(conn)

@router.post("/")
def create_lesson(course_id: int, title: str, content: str = "", video_url: str = None, order_index: int = 0):
    conn = get_db_connection()
    if not conn:
        raise HTTPException(status_code=500, detail="DB connection error")
    
    try:
        cursor = conn.cursor()
        cursor.execute(
            "INSERT INTO lessons (course_id, title, content, video_url, order_index) VALUES (%s, %s, %s, %s, %s) RETURNING id",
            (course_id, title, content, video_url, order_index)
        )
        lesson_id = cursor.fetchone()['id']
        conn.commit()
        
        # Clear cache when new lesson is created
        cache_clear("lessons")
        
        return {"id": lesson_id, "course_id": course_id, "title": title}
    finally:
        cursor.close()
        return_db_connection(conn)

@router.put("/{lesson_id}")
def update_lesson(lesson_id: int, title: str = None, content: str = None, video_url: str = None, order_index: int = None):
    conn = get_db_connection()
    if not conn:
        raise HTTPException(status_code=500, detail="DB connection error")
    
    try:
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM lessons WHERE id=%s", (lesson_id,))
        if not cursor.fetchone():
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
            raise HTTPException(status_code=400, detail="No fields to update")
        params.append(lesson_id)
        cursor.execute(f"UPDATE lessons SET {', '.join(update_fields)} WHERE id=%s", tuple(params))
        conn.commit()
        
        # Clear cache when lesson is updated
        cache_clear("lessons")
        
        return {"id": lesson_id, "updated": True}
    finally:
        cursor.close()
        return_db_connection(conn)

@router.delete("/{lesson_id}")
def delete_lesson(lesson_id: int):
    conn = get_db_connection()
    if not conn:
        raise HTTPException(status_code=500, detail="DB connection error")
    
    try:
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM lessons WHERE id=%s", (lesson_id,))
        if not cursor.fetchone():
            raise HTTPException(status_code=404, detail="Lesson not found")
        cursor.execute("DELETE FROM lessons WHERE id=%s", (lesson_id,))
        conn.commit()
        
        # Clear cache when lesson is deleted
        cache_clear("lessons")
        
        return {"id": lesson_id, "deleted": True}
    finally:
        cursor.close()
        return_db_connection(conn)
        raise HTTPException(status_code=404, detail="Lesson not found")
    cursor.execute("DELETE FROM lessons WHERE id=%s", (lesson_id,))
    conn.commit()
    cursor.close()
    conn.close()
    return {"id": lesson_id, "deleted": True}
