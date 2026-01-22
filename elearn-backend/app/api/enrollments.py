from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from app.api.auth import get_current_user
from app.db import get_db_connection


router = APIRouter(prefix="/enrollments", tags=["enrollments"])

# Endpoint to get all students enrolled in a course, including their full names
@router.get("/course/{course_id}/students")
def get_course_students(course_id: int):
    conn = get_db_connection()
    if not conn:
        raise HTTPException(status_code=500, detail="DB connection error")
    cursor = conn.cursor(dictionary=True)
    cursor.execute('''
        SELECT e.*, u.first_name, u.last_name, u.student_id
        FROM enrollments e
        JOIN users u ON e.user_id = u.id
        WHERE e.course_id = %s
    ''', (course_id,))
    students = cursor.fetchall()
    cursor.close()
    conn.close()
    return students

# Request model for enrollment
class EnrollRequest(BaseModel):
    student_id: int
    course_id: int

@router.get("/me")
def get_my_enrollments(user=Depends(get_current_user)):
    conn = get_db_connection()
    if not conn:
        raise HTTPException(status_code=500, detail="DB connection error")
    cursor = conn.cursor(dictionary=True)
    # Join enrollments with courses to get course details
    cursor.execute("""
        SELECT e.*, c.title, c.description, c.duration, c.instructor_id
        FROM enrollments e
        JOIN courses c ON e.course_id = c.id
        WHERE e.user_id=%s
    """, (user["id"],))
    enrollments = cursor.fetchall()
    cursor.close()
    conn.close()
    return enrollments

@router.get("/")
def list_enrollments():
    conn = get_db_connection()
    if not conn:
        raise HTTPException(status_code=500, detail="DB connection error")
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT * FROM enrollments")
    enrollments = cursor.fetchall()
    cursor.close()
    conn.close()
    return enrollments

@router.post("/")
def enroll_student(data: EnrollRequest):
    student_id = data.student_id
    course_id = data.course_id
    conn = get_db_connection()
    if not conn:
        raise HTTPException(status_code=500, detail="DB connection error")
    cursor = conn.cursor()
    # Check if already enrolled
    cursor.execute("SELECT id FROM enrollments WHERE user_id=%s AND course_id=%s", (student_id, course_id))
    existing = cursor.fetchone()
    if existing:
        cursor.close()
        conn.close()
        # Return the existing enrollment instead of raising an error
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT * FROM enrollments WHERE user_id=%s AND course_id=%s", (student_id, course_id))
        enrollment = cursor.fetchone()
        cursor.close()
        conn.close()
        return enrollment
    cursor.execute(
        "INSERT INTO enrollments (user_id, course_id) VALUES (%s, %s)",
        (student_id, course_id)
    )
    conn.commit()
    enrollment_id = cursor.lastrowid
    # Fetch the full enrollment row
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT * FROM enrollments WHERE id=%s", (enrollment_id,))
    enrollment = cursor.fetchone()
    cursor.close()
    conn.close()
    return enrollment

@router.delete("/{enrollment_id}")
def remove_enrollment(enrollment_id: int):
    conn = get_db_connection()
    if not conn:
        raise HTTPException(status_code=500, detail="DB connection error")
    cursor = conn.cursor()
    cursor.execute("SELECT id FROM enrollments WHERE id=%s", (enrollment_id,))
    if not cursor.fetchone():
        cursor.close()
        conn.close()
        raise HTTPException(status_code=404, detail="Enrollment not found")
    cursor.execute("DELETE FROM enrollments WHERE id=%s", (enrollment_id,))
    conn.commit()
    cursor.close()
    conn.close()
    return {"id": enrollment_id, "deleted": True}