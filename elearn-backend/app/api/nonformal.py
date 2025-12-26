from fastapi import APIRouter, HTTPException, Depends
from app.db import get_db_connection
from app.api.auth import get_current_user

router = APIRouter(prefix="/nonformal", tags=["nonformal"])

# --- Courses ---
@router.get("/courses/")
def list_nonformal_courses():
    conn = get_db_connection()
    if not conn:
        raise HTTPException(status_code=500, detail="DB connection error")
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT * FROM courses WHERE type = 'non-formal'")
    courses = cursor.fetchall()
    cursor.close()
    conn.close()
    return courses

# --- Enrollments ---
@router.get("/enrollments/")
def list_nonformal_enrollments(user=Depends(get_current_user)):
    conn = get_db_connection()
    if not conn:
        raise HTTPException(status_code=500, detail="DB connection error")
    cursor = conn.cursor(dictionary=True)
    # Find enrollments for courses where type = 'non-formal'
    cursor.execute("""
        SELECT e.* FROM enrollments e
        JOIN courses c ON e.course_id = c.id
        WHERE e.student_id = %s AND c.type = 'non-formal'""", (user["id"],))
    enrollments = cursor.fetchall()
    cursor.close()
    conn.close()
    return enrollments

@router.post("/enrollments/")
def enroll_nonformal_course(course_id: int, user=Depends(get_current_user)):
    conn = get_db_connection()
    if not conn:
        raise HTTPException(status_code=500, detail="DB connection error")
    cursor = conn.cursor()
    # Check if course is non-formal
    cursor.execute("SELECT id FROM courses WHERE id=%s AND type='non-formal'", (course_id,))
    if not cursor.fetchone():
        cursor.close()
        conn.close()
        raise HTTPException(status_code=400, detail="Course is not non-formal or does not exist")
    # Check if already enrolled
    cursor.execute("SELECT id FROM enrollments WHERE student_id=%s AND course_id=%s", (user["id"], course_id))
    if cursor.fetchone():
        cursor.close()
        conn.close()
        raise HTTPException(status_code=400, detail="Already enrolled")
    cursor.execute(
        "INSERT INTO enrollments (student_id, course_id) VALUES (%s, %s)",
        (user["id"], course_id)
    )
    conn.commit()
    cursor.close()
    conn.close()
    return {"message": "Enrolled successfully"}

# --- Progress ---
@router.get("/progress/")
def get_nonformal_progress(user=Depends(get_current_user)):
    conn = get_db_connection()
    if not conn:
        raise HTTPException(status_code=500, detail="DB connection error")
    cursor = conn.cursor(dictionary=True)
    # Return progress for non-formal courses from enrollments table
    cursor.execute("""
        SELECT e.id, e.course_id, e.progress, c.title FROM enrollments e
        JOIN courses c ON e.course_id = c.id
        WHERE e.student_id = %s AND c.type = 'non-formal'""", (user["id"],))
    progress = cursor.fetchall()
    cursor.close()
    conn.close()
    return progress

# --- Certificates ---
@router.get("/certificates/")
def get_nonformal_certificates(user=Depends(get_current_user)):
    conn = get_db_connection()
    if not conn:
        raise HTTPException(status_code=500, detail="DB connection error")
    cursor = conn.cursor(dictionary=True)
    # Get certificates for non-formal courses
    cursor.execute("""
        SELECT cert.* FROM certificates cert
        JOIN courses c ON cert.course_id = c.id
        WHERE cert.student_id = %s AND c.type = 'non-formal'""", (user["id"],))
    certificates = cursor.fetchall()
    cursor.close()
    conn.close()
    return certificates
