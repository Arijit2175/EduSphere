
from fastapi import APIRouter, HTTPException, Body
from pydantic import BaseModel
from app.db import get_db_connection

router = APIRouter(prefix="/assignments", tags=["assignments"])

# List all assignment submissions (for dashboard count)
@router.get("/assignment_submissions/")
def list_all_assignment_submissions():
    conn = get_db_connection()
    if not conn:
        raise HTTPException(status_code=500, detail="DB connection error")
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT * FROM assignment_submissions")
    submissions = cursor.fetchall()
    cursor.close()
    conn.close()
    return submissions

@router.get("/")
def list_assignments(course_id: int = None):
    conn = get_db_connection()
    if not conn:
        raise HTTPException(status_code=500, detail="DB connection error")
    cursor = conn.cursor(dictionary=True)
    if course_id:
        cursor.execute("SELECT * FROM assignments WHERE course_id=%s", (course_id,))
    else:
        cursor.execute("SELECT * FROM assignments")
    assignments = cursor.fetchall()
    cursor.close()
    conn.close()
    return assignments

@router.post("/")
@router.post("/")
def create_assignment(data: dict = Body(...)):
    course_id = data.get("course_id")
    title = data.get("title")
    description = data.get("description", "")
    due_date = data.get("due_date")
    conn = get_db_connection()
    if not conn:
        raise HTTPException(status_code=500, detail="DB connection error")
    cursor = conn.cursor(dictionary=True)
    cursor.execute(
        "INSERT INTO assignments (course_id, title, description, due_date) VALUES (%s, %s, %s, %s)",
        (course_id, title, description, due_date)
    )
    conn.commit()
    assignment_id = cursor.lastrowid
    cursor.execute("SELECT * FROM assignments WHERE id=%s", (assignment_id,))
    new_assignment = cursor.fetchone()
    cursor.close()
    conn.close()
    if not new_assignment:
        raise HTTPException(status_code=500, detail="Failed to fetch new assignment after insert")
    return new_assignment

@router.put("/{assignment_id}")
def update_assignment(assignment_id: int, title: str = None, description: str = None, due_date: str = None):
    conn = get_db_connection()
    if not conn:
        raise HTTPException(status_code=500, detail="DB connection error")
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM assignments WHERE id=%s", (assignment_id,))
    if not cursor.fetchone():
        cursor.close()
        conn.close()
        raise HTTPException(status_code=404, detail="Assignment not found")
    update_fields = []
    params = []
    if title is not None:
        update_fields.append("title=%s")
        params.append(title)
    if description is not None:
        update_fields.append("description=%s")
        params.append(description)
    if due_date is not None:
        update_fields.append("due_date=%s")
        params.append(due_date)
    if not update_fields:
        cursor.close()
        conn.close()
        raise HTTPException(status_code=400, detail="No fields to update")
    params.append(assignment_id)
    cursor.execute(f"UPDATE assignments SET {', '.join(update_fields)} WHERE id=%s", tuple(params))
    conn.commit()
    cursor.close()
    conn.close()
    return {"id": assignment_id, "updated": True}

# ReviewSubmissionRequest and review_submission are defined later in the file
def delete_assignment(assignment_id: int):
    conn = get_db_connection()
    if not conn:
        raise HTTPException(status_code=500, detail="DB connection error")
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM assignments WHERE id=%s", (assignment_id,))
    if not cursor.fetchone():
        cursor.close()
        conn.close()
        raise HTTPException(status_code=404, detail="Assignment not found")
    cursor.execute("DELETE FROM assignments WHERE id=%s", (assignment_id,))
    conn.commit()
    cursor.close()
    conn.close()
    return {"id": assignment_id, "deleted": True}

# Assignment Submissions
@router.get("/{assignment_id}/submissions")
def list_submissions(assignment_id: int):
    conn = get_db_connection()
    if not conn:
        raise HTTPException(status_code=500, detail="DB connection error")
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT * FROM assignment_submissions WHERE assignment_id=%s", (assignment_id,))
    submissions = cursor.fetchall()
    cursor.close()
    conn.close()
    return submissions

from fastapi import Request

@router.post("/{assignment_id}/submit")
async def submit_assignment(assignment_id: int, request: Request):
    data = await request.json()
    enrollment_id = data.get("enrollment_id")
    content = data.get("content")
    conn = get_db_connection()
    if not conn:
        raise HTTPException(status_code=500, detail="DB connection error")
    cursor = conn.cursor(dictionary=True)
    # Resolve enrollment to get the canonical student id to avoid FK errors
    cursor.execute("SELECT * FROM enrollments WHERE id=%s", (enrollment_id,))
    enrollment_row = cursor.fetchone()
    if not enrollment_row:
        cursor.close()
        conn.close()
        raise HTTPException(status_code=404, detail="Enrollment not found")
    user_id = enrollment_row.get("user_id")
    # Look up the linked student_id from users table
    cursor.execute("SELECT student_id FROM users WHERE id=%s", (user_id,))
    user_row = cursor.fetchone()
    if not user_row or not user_row.get("student_id"):
        cursor.close()
        conn.close()
        raise HTTPException(status_code=400, detail="Student profile not found for this enrollment")
    student_id = user_row.get("student_id")
    # Check if already submitted
    cursor.execute("SELECT id FROM assignment_submissions WHERE assignment_id=%s AND enrollment_id=%s", (assignment_id, enrollment_id))
    if cursor.fetchone():
        cursor.close()
        conn.close()
        raise HTTPException(status_code=400, detail="Already submitted")
    cursor.execute(
        "INSERT INTO assignment_submissions (assignment_id, enrollment_id, student_id, content) VALUES (%s, %s, %s, %s)",
        (assignment_id, enrollment_id, student_id, content)
    )
    conn.commit()
    submission_id = cursor.lastrowid
    cursor.close()
    conn.close()
    return {"id": submission_id, "assignment_id": assignment_id, "enrollment_id": enrollment_id, "student_id": student_id}

from pydantic import BaseModel

class ReviewSubmissionRequest(BaseModel):
    status: str = "graded"
    grade: str = None
    feedback: str = None

@router.put("/submissions/{submission_id}/review")
def review_submission(submission_id: int, review: ReviewSubmissionRequest):
    conn = get_db_connection()
    if not conn:
        raise HTTPException(status_code=500, detail="DB connection error")
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM assignment_submissions WHERE id=%s", (submission_id,))
    if not cursor.fetchone():
        cursor.close()
        conn.close()
        raise HTTPException(status_code=404, detail="Submission not found")
    update_fields = []
    params = []
    if review.status is not None:
        update_fields.append("status=%s")
        params.append(review.status)
    if review.grade is not None:
        update_fields.append("grade=%s")
        params.append(review.grade)
    if review.feedback is not None:
        update_fields.append("feedback=%s")
        params.append(review.feedback)
    if not update_fields:
        cursor.close()
        conn.close()
        raise HTTPException(status_code=400, detail="No fields to update")
    params.append(submission_id)
    cursor.execute(f"UPDATE assignment_submissions SET {', '.join(update_fields)} WHERE id=%s", tuple(params))
    conn.commit()
    cursor.close()
    conn.close()
    return {"id": submission_id, "reviewed": True}
