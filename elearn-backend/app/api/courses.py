
from fastapi import APIRouter, HTTPException, Depends, Request, Query
from pydantic import BaseModel
from slowapi import Limiter
from slowapi.util import get_remote_address
from app.db import get_db_connection, return_db_connection, cache_get, cache_set, cache_clear
from app.api.auth import get_current_user
from app.core.security import sanitize_string, check_teacher_role
from app.core.config import RATE_LIMIT_PER_MINUTE

limiter = Limiter(key_func=get_remote_address)

class CourseCreate(BaseModel):
    title: str
    description: str = ""
    type: str = "formal"
    category: str = None
    level: str = None
    duration: str = None
    instructor_id: int = None

router = APIRouter(prefix="/courses", tags=["courses"])

@router.get("/")
@limiter.limit(f"{RATE_LIMIT_PER_MINUTE}/minute")
async def list_courses(
    request: Request,
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    type: str = Query(None),
    category: str = Query(None)
):
    """
    Public endpoint - Get paginated list of courses
    - skip: number of courses to skip (default 0)
    - limit: number of courses to return (default 20, max 100)
    - type: filter by course type (formal, non-formal, informal)
    - category: filter by category
    """
    # Create cache key based on parameters
    cache_key = f"courses:{skip}:{limit}:{type}:{category}"
    cached_result = cache_get(cache_key)
    if cached_result:
        return cached_result
    
    conn = get_db_connection()
    if not conn:
        raise HTTPException(status_code=500, detail="DB connection error")
    
    try:
        cursor = conn.cursor()
        
        # Build query dynamically
        where_clauses = []
        params = []
        
        if type:
            where_clauses.append("type=%s")
            params.append(type)
        
        if category:
            where_clauses.append("category=%s")
            params.append(category)
        
        where_clause = " WHERE " + " AND ".join(where_clauses) if where_clauses else ""
        
        # Get total count
        cursor.execute(f"SELECT COUNT(*) as count FROM courses{where_clause}", params)
        total = cursor.fetchone()['count']
        
        # Get paginated results
        query = f"SELECT id, title, description, type, category, level, duration, instructor_id, created_at FROM courses{where_clause} ORDER BY created_at DESC LIMIT %s OFFSET %s"
        params.extend([limit, skip])
        cursor.execute(query, params)
        courses = cursor.fetchall()
        
        result = {
            "data": courses,
            "total": total,
            "skip": skip,
            "limit": limit
        }
        
        # Cache for 5 minutes
        cache_set(cache_key, result, ttl_seconds=300)
        return result
    finally:
        cursor.close()
        return_db_connection(conn)

@router.get("/{course_id}")
@limiter.limit(f"{RATE_LIMIT_PER_MINUTE}/minute")
async def get_course(request: Request, course_id: int):
    """Public endpoint - Get a single course by ID"""
    cache_key = f"course:{course_id}"
    cached_result = cache_get(cache_key)
    if cached_result:
        return cached_result
    
    conn = get_db_connection()
    if not conn:
        raise HTTPException(status_code=500, detail="DB connection error")
    
    try:
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM courses WHERE id=%s", (course_id,))
        course = cursor.fetchone()
        if not course:
            raise HTTPException(status_code=404, detail="Course not found")
        
        # Cache for 5 minutes
        cache_set(cache_key, course, ttl_seconds=300)
        return course
    finally:
        cursor.close()
        return_db_connection(conn)

@router.post("/")
@limiter.limit(f"{RATE_LIMIT_PER_MINUTE}/minute")
async def create_course(request: Request, course: CourseCreate, user=Depends(get_current_user)):
    """Teacher-only endpoint"""
    check_teacher_role(user)
    teacher_id = user.get("teacher_id")
    if not teacher_id:
        raise HTTPException(status_code=400, detail="Teacher profile not found")
    
    title = sanitize_string(course.title, max_length=200)
    description = sanitize_string(course.description, max_length=2000)
    course_type = sanitize_string(course.type, max_length=50)
    category = sanitize_string(course.category, max_length=100) if course.category else None
    level = sanitize_string(course.level, max_length=50) if course.level else None
    duration = sanitize_string(course.duration, max_length=50) if course.duration else None
    
    conn = get_db_connection()
    if not conn:
        raise HTTPException(status_code=500, detail="DB connection error")
    
    try:
        cursor = conn.cursor()
        cursor.execute(
            "INSERT INTO courses (title, description, type, category, level, duration, instructor_id) VALUES (%s, %s, %s, %s, %s, %s, %s) RETURNING id",
            (title, description, course_type, category, level, duration, teacher_id)
        )
        course_id = cursor.fetchone()['id']
        conn.commit()
        
        # Clear cache when new course is created
        cache_clear("courses")
        
        return {"id": course_id, "title": title}
    finally:
        cursor.close()
        return_db_connection(conn)

@router.put("/{course_id}")
@limiter.limit(f"{RATE_LIMIT_PER_MINUTE}/minute")
async def update_course(request: Request, course_id: int, user=Depends(get_current_user), title: str = None, description: str = None, category: str = None, level: str = None, duration: str = None):
    """Teacher-only endpoint - can only update own courses"""
    check_teacher_role(user)
    
    conn = get_db_connection()
    if not conn:
        raise HTTPException(status_code=500, detail="DB connection error")
    
    try:
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM courses WHERE id=%s", (course_id,))
        course = cursor.fetchone()
        if not course:
            raise HTTPException(status_code=404, detail="Course not found")
        
        if course["instructor_id"] != user.get("teacher_id"):
            raise HTTPException(status_code=403, detail="Not authorized to update this course")
        
        update_fields = []
        params = []
        if title is not None:
            update_fields.append("title=%s")
            params.append(sanitize_string(title, max_length=200))
        if description is not None:
            update_fields.append("description=%s")
            params.append(sanitize_string(description, max_length=2000))
        if category is not None:
            update_fields.append("category=%s")
            params.append(sanitize_string(category, max_length=100))
        if level is not None:
            update_fields.append("level=%s")
            params.append(sanitize_string(level, max_length=50))
        if duration is not None:
            update_fields.append("duration=%s")
            params.append(sanitize_string(duration, max_length=50))
        if not update_fields:
            raise HTTPException(status_code=400, detail="No fields to update")
        params.append(course_id)
        cursor.execute(f"UPDATE courses SET {', '.join(update_fields)} WHERE id=%s", tuple(params))
        conn.commit()
        
        # Clear cache when course is updated
        cache_clear("courses")
        cache_clear(f"course:{course_id}")
        
        return {"id": course_id, "updated": True}
    finally:
        cursor.close()
        return_db_connection(conn)

@router.delete("/{course_id}")
@limiter.limit(f"{RATE_LIMIT_PER_MINUTE}/minute")
async def delete_course(request: Request, course_id: int, user=Depends(get_current_user)):
    """Teacher-only endpoint - can only delete own courses"""
    check_teacher_role(user)
    
    conn = get_db_connection()
    if not conn:
        raise HTTPException(status_code=500, detail="DB connection error")
    
    try:
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM courses WHERE id=%s", (course_id,))
        course = cursor.fetchone()
        if not course:
            raise HTTPException(status_code=404, detail="Course not found")
        
        if course["instructor_id"] != user.get("teacher_id"):
            raise HTTPException(status_code=403, detail="Not authorized to delete this course")
        
        cursor.execute("DELETE FROM courses WHERE id=%s", (course_id,))
        conn.commit()
        
        # Clear cache when course is deleted
        cache_clear("courses")
        cache_clear(f"course:{course_id}")
        
        return {"id": course_id, "deleted": True}
    finally:
        cursor.close()
        return_db_connection(conn)
    return {"id": course_id, "deleted": True}
