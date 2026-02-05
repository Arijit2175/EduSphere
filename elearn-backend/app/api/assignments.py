
from fastapi import APIRouter, HTTPException, Body, Depends, Request, Query
from pydantic import BaseModel
from slowapi import Limiter
from slowapi.util import get_remote_address
from app.db import get_db_connection, return_db_connection, cache_get, cache_set
from app.api.auth import get_current_user
from app.core.security import sanitize_string, check_teacher_role
from app.core.config import RATE_LIMIT_PER_MINUTE

limiter = Limiter(key_func=get_remote_address)

router = APIRouter(prefix="/assignments", tags=["assignments"])

@router.get("/assignment_submissions/")
@limiter.limit(f"{RATE_LIMIT_PER_MINUTE}/minute")
async def list_all_assignment_submissions(request: Request, user=Depends(get_current_user), skip: int = Query(0, ge=0), limit: int = Query(100, ge=1, le=500)):
    """Teachers: all submissions; Students: only their submissions with pagination"""
    conn = get_db_connection()
    if not conn:
        raise HTTPException(status_code=500, detail="DB connection error")
    
    try:
        cursor = conn.cursor()
        if user.get("role") == "teacher":
            cursor.execute("SELECT COUNT(*) as count FROM assignment_submissions")
            total = cursor.fetchone()['count']
            cursor.execute("SELECT * FROM assignment_submissions ORDER BY submitted_at DESC LIMIT %s OFFSET %s", (limit, skip))
            submissions = cursor.fetchall()
            return {"data": submissions, "total": total, "skip": skip, "limit": limit}
        
        # Student logic - fetch only their submissions
        cursor.execute("SELECT student_id FROM users WHERE id=%s", (user["id"],))
        user_row = cursor.fetchone()
        if not user_row or not user_row.get("student_id"):
            return []
        student_id = user_row["student_id"]
        cursor.execute("SELECT * FROM assignment_submissions WHERE student_id=%s", (student_id,))
        submissions = cursor.fetchall()
        return submissions
    finally:
        cursor.close()
        return_db_connection(conn)

@router.get("/")
@limiter.limit(f"{RATE_LIMIT_PER_MINUTE}/minute")
async def list_assignments(request: Request, course_id: int = None):
    """Public endpoint - accessible to students and teachers"""
    conn = get_db_connection()
    if not conn:
        raise HTTPException(status_code=500, detail="DB connection error")
    cursor = conn.cursor()
    if course_id:
        cursor.execute("SELECT * FROM assignments WHERE course_id=%s", (course_id,))
    else:
        cursor.execute("SELECT * FROM assignments")
    assignments = cursor.fetchall()
    cursor.close()
    return_db_connection(conn)
    return assignments

@router.post("/")
@limiter.limit(f"{RATE_LIMIT_PER_MINUTE}/minute")
async def create_assignment(request: Request, data: dict = Body(...), user=Depends(get_current_user)):
    """Teacher-only endpoint"""
    check_teacher_role(user)
    
    course_id = data.get("course_id")
    title = sanitize_string(data.get("title"), max_length=200)
    description = sanitize_string(data.get("description", ""), max_length=2000)
    due_date = data.get("due_date")
    
    conn = get_db_connection()
    if not conn:
        raise HTTPException(status_code=500, detail="DB connection error")
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM courses WHERE id=%s", (course_id,))
    course = cursor.fetchone()
    if not course:
        cursor.close()
        return_db_connection(conn)
        raise HTTPException(status_code=404, detail="Course not found")
    if course["instructor_id"] != user.get("teacher_id"):
        cursor.close()
        return_db_connection(conn)
        raise HTTPException(status_code=403, detail="Not authorized to create assignments for this course")
    
    cursor.execute(
        "INSERT INTO assignments (course_id, title, description, due_date) VALUES (%s, %s, %s, %s) RETURNING id",
        (course_id, title, description, due_date)
    )
    assignment_id = cursor.fetchone()['id']
    conn.commit()
    cursor.execute("SELECT * FROM assignments WHERE id=%s", (assignment_id,))
    new_assignment = cursor.fetchone()
    cursor.close()
    return_db_connection(conn)
    if not new_assignment:
        raise HTTPException(status_code=500, detail="Failed to fetch new assignment after insert")
    return new_assignment

@router.put("/{assignment_id}")
@limiter.limit(f"{RATE_LIMIT_PER_MINUTE}/minute")
async def update_assignment(request: Request, assignment_id: int, user=Depends(get_current_user), title: str = None, description: str = None, due_date: str = None):
    """Teacher-only endpoint - can only update assignments in own courses"""
    check_teacher_role(user)
    
    conn = get_db_connection()
    if not conn:
        raise HTTPException(status_code=500, detail="DB connection error")
    cursor = conn.cursor()
    cursor.execute("SELECT a.*, c.instructor_id FROM assignments a JOIN courses c ON a.course_id = c.id WHERE a.id=%s", (assignment_id,))
    assignment = cursor.fetchone()
    if not assignment:
        cursor.close()
        return_db_connection(conn)
        raise HTTPException(status_code=404, detail="Assignment not found")
    
    if assignment["instructor_id"] != user.get("teacher_id"):
        cursor.close()
        return_db_connection(conn)
        raise HTTPException(status_code=403, detail="Not authorized to update this assignment")
    
    update_fields = []
    params = []
    if title is not None:
        update_fields.append("title=%s")
        params.append(sanitize_string(title, max_length=200))
    if description is not None:
        update_fields.append("description=%s")
        params.append(sanitize_string(description, max_length=2000))
    if due_date is not None:
        update_fields.append("due_date=%s")
        params.append(due_date)
    if not update_fields:
        cursor.close()
        return_db_connection(conn)
        raise HTTPException(status_code=400, detail="No fields to update")
    params.append(assignment_id)
    cursor.execute(f"UPDATE assignments SET {', '.join(update_fields)} WHERE id=%s", tuple(params))
    conn.commit()
    cursor.close()
    return_db_connection(conn)
    return {"id": assignment_id, "updated": True}

@router.delete("/{assignment_id}")
@limiter.limit(f"{RATE_LIMIT_PER_MINUTE}/minute")
async def delete_assignment(request: Request, assignment_id: int, user=Depends(get_current_user)):
    """Teacher-only endpoint - can only delete assignments in own courses"""
    check_teacher_role(user)
    
    conn = get_db_connection()
    if not conn:
        raise HTTPException(status_code=500, detail="DB connection error")
    cursor = conn.cursor()
    cursor.execute("SELECT a.*, c.instructor_id FROM assignments a JOIN courses c ON a.course_id = c.id WHERE a.id=%s", (assignment_id,))
    assignment = cursor.fetchone()
    if not assignment:
        cursor.close()
        return_db_connection(conn)
        raise HTTPException(status_code=404, detail="Assignment not found")
    
    if assignment["instructor_id"] != user.get("teacher_id"):
        cursor.close()
        return_db_connection(conn)
        raise HTTPException(status_code=403, detail="Not authorized to delete this assignment")
    
    cursor.execute("DELETE FROM assignments WHERE id=%s", (assignment_id,))
    conn.commit()
    cursor.close()
    return_db_connection(conn)
    return {"id": assignment_id, "deleted": True}

@router.get("/{assignment_id}/submissions")
@limiter.limit(f"{RATE_LIMIT_PER_MINUTE}/minute")
async def list_submissions(request: Request, assignment_id: int, user=Depends(get_current_user)):
    """Teacher-only endpoint - view submissions for own course assignments"""
    check_teacher_role(user)
    
    conn = get_db_connection()
    if not conn:
        raise HTTPException(status_code=500, detail="DB connection error")
    cursor = conn.cursor()
    cursor.execute("SELECT a.*, c.instructor_id FROM assignments a JOIN courses c ON a.course_id = c.id WHERE a.id=%s", (assignment_id,))
    assignment = cursor.fetchone()
    if not assignment:
        cursor.close()
        return_db_connection(conn)
        raise HTTPException(status_code=404, detail="Assignment not found")
    if assignment["instructor_id"] != user.get("teacher_id"):
        cursor.close()
        return_db_connection(conn)
        raise HTTPException(status_code=403, detail="Not authorized to view submissions for this assignment")
    
    cursor.execute("SELECT * FROM assignment_submissions WHERE assignment_id=%s", (assignment_id,))
    submissions = cursor.fetchall()
    cursor.close()
    return_db_connection(conn)
    return submissions

@router.post("/{assignment_id}/submit")
@limiter.limit(f"{RATE_LIMIT_PER_MINUTE}/minute")
async def submit_assignment(request: Request, assignment_id: int, user=Depends(get_current_user)):
    """Student endpoint - submit assignment"""
    from datetime import datetime
    data = await request.json()
    enrollment_id = data.get("enrollment_id")
    content = sanitize_string(data.get("content"), max_length=10000)
    
    conn = get_db_connection()
    if not conn:
        raise HTTPException(status_code=500, detail="DB connection error")
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM assignments WHERE id=%s", (assignment_id,))
    assignment = cursor.fetchone()
    if not assignment:
        cursor.close()
        return_db_connection(conn)
        raise HTTPException(status_code=404, detail="Assignment not found")
    
    # Check if assignment due date has passed
    if assignment.get("due_date"):
        try:
            due_date = assignment["due_date"]
            if isinstance(due_date, str):
                due_date = datetime.fromisoformat(due_date.replace('Z', '+00:00'))
            if datetime.now(due_date.tzinfo if due_date.tzinfo else None) > due_date:
                cursor.close()
                return_db_connection(conn)
                raise HTTPException(status_code=400, detail="Assignment submission deadline has passed")
        except ValueError:
            pass
    
    cursor.execute("SELECT * FROM enrollments WHERE id=%s", (enrollment_id,))
    enrollment_row = cursor.fetchone()
    if not enrollment_row:
        cursor.close()
        return_db_connection(conn)
        raise HTTPException(status_code=404, detail="Enrollment not found")
    
    if enrollment_row.get("user_id") != user["id"]:
        cursor.close()
        return_db_connection(conn)
        raise HTTPException(status_code=403, detail="Not authorized to submit for this enrollment")
    
    user_id = enrollment_row.get("user_id")
    cursor.execute("SELECT student_id FROM users WHERE id=%s", (user_id,))
    user_row = cursor.fetchone()
    if not user_row or not user_row.get("student_id"):
        cursor.close()
        return_db_connection(conn)
        raise HTTPException(status_code=400, detail="Student profile not found for this enrollment")
    student_id = user_row.get("student_id")
    cursor.execute("SELECT id FROM assignment_submissions WHERE assignment_id=%s AND enrollment_id=%s", (assignment_id, enrollment_id))
    if cursor.fetchone():
        cursor.close()
        return_db_connection(conn)
        raise HTTPException(status_code=400, detail="Already submitted")
    cursor.execute(
        "INSERT INTO assignment_submissions (assignment_id, enrollment_id, student_id, content) VALUES (%s, %s, %s, %s) RETURNING id",
        (assignment_id, enrollment_id, student_id, content)
    )
    submission_id = cursor.fetchone()['id']
    conn.commit()
    cursor.close()
    return_db_connection(conn)
    return {"id": submission_id, "assignment_id": assignment_id, "enrollment_id": enrollment_id, "student_id": student_id}

class ReviewSubmissionRequest(BaseModel):
    status: str = "graded"
    grade: str = None
    feedback: str = None

@router.put("/submissions/{submission_id}/review")
@limiter.limit(f"{RATE_LIMIT_PER_MINUTE}/minute")
async def review_submission(request: Request, submission_id: int, review: ReviewSubmissionRequest, user=Depends(get_current_user)):
    """Teacher-only endpoint - review submissions in own courses"""
    check_teacher_role(user)
    
    conn = get_db_connection()
    if not conn:
        raise HTTPException(status_code=500, detail="DB connection error")
    cursor = conn.cursor()
    cursor.execute("""
        SELECT sub.*, c.instructor_id 
        FROM assignment_submissions sub 
        JOIN assignments a ON sub.assignment_id = a.id 
        JOIN courses c ON a.course_id = c.id 
        WHERE sub.id=%s
    """, (submission_id,))
    submission = cursor.fetchone()
    if not submission:
        cursor.close()
        return_db_connection(conn)
        raise HTTPException(status_code=404, detail="Submission not found")
    if submission["instructor_id"] != user.get("teacher_id"):
        cursor.close()
        return_db_connection(conn)
        raise HTTPException(status_code=403, detail="Not authorized to review this submission")
    
    update_fields = []
    params = []
    if review.status is not None:
        update_fields.append("status=%s")
        params.append(sanitize_string(review.status, max_length=50))
    if review.grade is not None:
        update_fields.append("grade=%s")
        params.append(sanitize_string(review.grade, max_length=10))
    if review.feedback is not None:
        update_fields.append("feedback=%s")
        params.append(sanitize_string(review.feedback, max_length=2000))
    if not update_fields:
        cursor.close()
        return_db_connection(conn)
        raise HTTPException(status_code=400, detail="No fields to update")
    params.append(submission_id)
    cursor.execute(f"UPDATE assignment_submissions SET {', '.join(update_fields)} WHERE id=%s", tuple(params))
    conn.commit()
    cursor.close()
    return_db_connection(conn)
    return {"id": submission_id, "reviewed": True}
