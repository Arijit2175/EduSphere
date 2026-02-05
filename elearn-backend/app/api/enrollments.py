from fastapi import APIRouter, HTTPException, Depends, Query
from pydantic import BaseModel
from app.api.auth import get_current_user
from app.db import get_db_connection, return_db_connection, cache_get, cache_set, cache_clear


router = APIRouter(prefix="/enrollments", tags=["enrollments"])

@router.get("/course/{course_id}/students")
def get_course_students(course_id: int, skip: int = Query(0, ge=0), limit: int = Query(50, ge=1, le=200)):
    """Get paginated list of students enrolled in a course"""
    cache_key = f"course_students:{course_id}:{skip}:{limit}"
    cached_result = cache_get(cache_key)
    if cached_result:
        return cached_result
    
    conn = get_db_connection()
    if not conn:
        raise HTTPException(status_code=500, detail="DB connection error")
    
    try:
        cursor = conn.cursor()
        
        # Get total count
        cursor.execute("SELECT COUNT(*) as count FROM enrollments WHERE course_id = %s", (course_id,))
        total = cursor.fetchone()['count']
        
        # Get paginated results with JOIN optimized
        cursor.execute('''
            SELECT e.id, e.user_id, e.course_id, e.enrolled_at, e.progress, e.status,
                   u.first_name, u.last_name, u.student_id, u.email
            FROM enrollments e
            JOIN users u ON e.user_id = u.id
            WHERE e.course_id = %s
            ORDER BY e.enrolled_at DESC
            LIMIT %s OFFSET %s
        ''', (course_id, limit, skip))
        students = cursor.fetchall()
        
        result = {"data": students, "total": total, "skip": skip, "limit": limit}
        cache_set(cache_key, result, ttl_seconds=300)
        return result
    finally:
        cursor.close()
        return_db_connection(conn)

class EnrollRequest(BaseModel):
    student_id: int
    course_id: int

@router.get("/me")
def get_my_enrollments(user=Depends(get_current_user)):
    """Get enrollments for current user with caching"""
    cache_key = f"enrollments:user:{user['id']}"
    cached_result = cache_get(cache_key)
    if cached_result:
        return cached_result
    
    conn = get_db_connection()
    if not conn:
        raise HTTPException(status_code=500, detail="DB connection error")
    
    try:
        cursor = conn.cursor()
        cursor.execute("""
            SELECT e.id, e.user_id, e.course_id, e.enrolled_at, e.progress, e.status,
                   c.id as course_id, c.title, c.description, c.duration, c.instructor_id, c.type
            FROM enrollments e
            JOIN courses c ON e.course_id = c.id
            WHERE e.user_id=%s
            ORDER BY e.enrolled_at DESC
        """, (user["id"],))
        enrollments = cursor.fetchall()
        
        # Cache for 10 minutes (longer for user data)
        cache_set(cache_key, enrollments, ttl_seconds=600)
        return enrollments
    finally:
        cursor.close()
        return_db_connection(conn)

@router.get("/")
def list_enrollments(skip: int = Query(0, ge=0), limit: int = Query(100, ge=1, le=500)):
    """Get paginated list of all enrollments"""
    cache_key = f"enrollments:all:{skip}:{limit}"
    cached_result = cache_get(cache_key)
    if cached_result:
        return cached_result
    
    conn = get_db_connection()
    if not conn:
        raise HTTPException(status_code=500, detail="DB connection error")
    
    try:
        cursor = conn.cursor()
        
        # Get total count
        cursor.execute("SELECT COUNT(*) as count FROM enrollments")
        total = cursor.fetchone()['count']
        
        # Get paginated results
        cursor.execute("SELECT * FROM enrollments ORDER BY enrolled_at DESC LIMIT %s OFFSET %s", (limit, skip))
        enrollments = cursor.fetchall()
        
        result = {"data": enrollments, "total": total, "skip": skip, "limit": limit}
        cache_set(cache_key, result, ttl_seconds=300)
        return result
    finally:
        cursor.close()
        return_db_connection(conn)

@router.post("/")
def enroll_student(data: EnrollRequest):
    """Enroll a student in a course"""
    student_id = data.student_id
    course_id = data.course_id
    conn = get_db_connection()
    if not conn:
        raise HTTPException(status_code=500, detail="DB connection error")
    
    try:
        cursor = conn.cursor()
        
        # Check if already enrolled
        cursor.execute("SELECT id FROM enrollments WHERE user_id=%s AND course_id=%s", (student_id, course_id))
        existing = cursor.fetchone()
        if existing:
            raise HTTPException(status_code=400, detail="Student already enrolled")
        
        # Insert enrollment
        cursor.execute(
            "INSERT INTO enrollments (user_id, course_id) VALUES (%s, %s) RETURNING id",
            (student_id, course_id)
        )
        enrollment_id = cursor.fetchone()['id']
        conn.commit()
        
        # Fetch the created enrollment
        cursor.execute("SELECT * FROM enrollments WHERE id=%s", (enrollment_id,))
        enrollment = cursor.fetchone()
        
        # Clear cache
        cache_clear("enrollments")
        
        return enrollment
    finally:
        cursor.close()
        return_db_connection(conn)

@router.delete("/{enrollment_id}")
def remove_enrollment(enrollment_id: int):
    """Remove an enrollment"""
    conn = get_db_connection()
    if not conn:
        raise HTTPException(status_code=500, detail="DB connection error")
    
    try:
        cursor = conn.cursor()
        cursor.execute("SELECT id FROM enrollments WHERE id=%s", (enrollment_id,))
        if not cursor.fetchone():
            raise HTTPException(status_code=404, detail="Enrollment not found")
        
        cursor.execute("DELETE FROM enrollments WHERE id=%s", (enrollment_id,))
        conn.commit()
        
        # Clear cache
        cache_clear("enrollments")
        
        return {"id": enrollment_id, "deleted": True}
    finally:
        cursor.close()
        return_db_connection(conn)