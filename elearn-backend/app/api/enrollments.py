from fastapi import APIRouter, HTTPException, Depends
from app.api.auth import get_current_user
from app.db import get_db_connection

router = APIRouter(prefix="/enrollments", tags=["enrollments"])

@router.get("/me")
def get_my_enrollments(user=Depends(get_current_user)):
    conn = get_db_connection()
    if not conn:
        raise HTTPException(status_code=500, detail="DB connection error")
    cursor = conn.cursor(dictionary=True)
    # Use user_id instead of student_id
    cursor.execute("SELECT * FROM enrollments WHERE user_id=%s", (user["id"],))
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
def enroll_student(student_id: int, course_id: int):
    conn = get_db_connection()
    if not conn:
        raise HTTPException(status_code=500, detail="DB connection error")
    cursor = conn.cursor()
    # Check if already enrolled
    cursor.execute("SELECT id FROM enrollments WHERE user_id=%s AND course_id=%s", (student_id, course_id))
    if cursor.fetchone():
        cursor.close()
        conn.close()
        raise HTTPException(status_code=400, detail="Already enrolled")
    cursor.execute(
        "INSERT INTO enrollments (user_id, course_id) VALUES (%s, %s)",
        (student_id, course_id)
    )
    conn.commit()
    enrollment_id = cursor.lastrowid
    cursor.close()
    conn.close()
    return {"id": enrollment_id, "user_id": student_id, "course_id": course_id}

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
