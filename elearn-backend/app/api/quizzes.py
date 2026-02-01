from fastapi import APIRouter, HTTPException, Depends, Request
from slowapi import Limiter
from slowapi.util import get_remote_address
from app.db import get_db_connection
from app.api.auth import get_current_user
from app.core.security import sanitize_string, check_teacher_role
from app.core.config import RATE_LIMIT_PER_MINUTE

limiter = Limiter(key_func=get_remote_address)

router = APIRouter(prefix="/quizzes", tags=["quizzes"])

@router.get("/")
@limiter.limit(f"{RATE_LIMIT_PER_MINUTE}/minute")
async def list_quizzes(request: Request, course_id: int = None):
    """Public endpoint - accessible to students and teachers"""
    conn = get_db_connection()
    if not conn:
        raise HTTPException(status_code=500, detail="DB connection error")
    cursor = conn.cursor()
    if course_id:
        cursor.execute("SELECT * FROM quizzes WHERE course_id=%s", (course_id,))
    else:
        cursor.execute("SELECT * FROM quizzes")
    quizzes = cursor.fetchall()
    cursor.close()
    conn.close()
    return quizzes

@router.post("/")
@limiter.limit(f"{RATE_LIMIT_PER_MINUTE}/minute")
async def create_quiz(request: Request, course_id: int, user=Depends(get_current_user), title: str = None, description: str = None):
    """Teacher-only endpoint - create quiz for own courses"""
    check_teacher_role(user)
    
    title = sanitize_string(title, max_length=200) if title else None
    description = sanitize_string(description, max_length=2000) if description else None
    
    conn = get_db_connection()
    if not conn:
        raise HTTPException(status_code=500, detail="DB connection error")
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM courses WHERE id=%s", (course_id,))
    course = cursor.fetchone()
    if not course:
        cursor.close()
        conn.close()
        raise HTTPException(status_code=404, detail="Course not found")
    if course["instructor_id"] != user.get("teacher_id"):
        cursor.close()
        conn.close()
        raise HTTPException(status_code=403, detail="Not authorized to create quizzes for this course")
    
    cursor.execute(
        "INSERT INTO quizzes (course_id, title, description) VALUES (%s, %s, %s) RETURNING id",
        (course_id, title, description)
    )
    quiz_id = cursor.fetchone()['id']
    conn.commit()
    cursor.close()
    conn.close()
    return {"id": quiz_id, "course_id": course_id, "title": title}

@router.delete("/{quiz_id}")
@limiter.limit(f"{RATE_LIMIT_PER_MINUTE}/minute")
async def delete_quiz(request: Request, quiz_id: int, user=Depends(get_current_user)):
    """Teacher-only endpoint - delete quizzes in own courses"""
    check_teacher_role(user)
    
    conn = get_db_connection()
    if not conn:
        raise HTTPException(status_code=500, detail="DB connection error")
    cursor = conn.cursor()
    cursor.execute("SELECT q.*, c.instructor_id FROM quizzes q JOIN courses c ON q.course_id = c.id WHERE q.id=%s", (quiz_id,))
    quiz = cursor.fetchone()
    if not quiz:
        cursor.close()
        conn.close()
        raise HTTPException(status_code=404, detail="Quiz not found")
    
    if quiz["instructor_id"] != user.get("teacher_id"):
        cursor.close()
        conn.close()
        raise HTTPException(status_code=403, detail="Not authorized to delete this quiz")
    
    cursor.execute("DELETE FROM quizzes WHERE id=%s", (quiz_id,))
    conn.commit()
    cursor.close()
    conn.close()
    return {"id": quiz_id, "deleted": True}

@router.get("/{quiz_id}/questions")
@limiter.limit(f"{RATE_LIMIT_PER_MINUTE}/minute")
async def list_questions(request: Request, quiz_id: int):
    """Public endpoint - accessible to students and teachers"""
    conn = get_db_connection()
    if not conn:
        raise HTTPException(status_code=500, detail="DB connection error")
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM quiz_questions WHERE quiz_id=%s", (quiz_id,))
    questions = cursor.fetchall()
    cursor.close()
    conn.close()
    return questions

@router.post("/{quiz_id}/questions")
@limiter.limit(f"{RATE_LIMIT_PER_MINUTE}/minute")
async def create_question(request: Request, quiz_id: int, question: str, options: str, correct_answer: str, user=Depends(get_current_user)):
    """Teacher-only endpoint - create questions for quizzes in own courses"""
    check_teacher_role(user)
    
    question = sanitize_string(question, max_length=500)
    options = sanitize_string(options, max_length=1000)
    correct_answer = sanitize_string(correct_answer, max_length=200)
    
    conn = get_db_connection()
    if not conn:
        raise HTTPException(status_code=500, detail="DB connection error")
    cursor = conn.cursor()
    cursor.execute("SELECT q.*, c.instructor_id FROM quizzes q JOIN courses c ON q.course_id = c.id WHERE q.id=%s", (quiz_id,))
    quiz = cursor.fetchone()
    if not quiz:
        cursor.close()
        conn.close()
        raise HTTPException(status_code=404, detail="Quiz not found")
    if quiz["instructor_id"] != user.get("teacher_id"):
        cursor.close()
        conn.close()
        raise HTTPException(status_code=403, detail="Not authorized to create questions for this quiz")
    
    cursor.execute(
        "INSERT INTO quiz_questions (quiz_id, question, options, correct_answer) VALUES (%s, %s, %s, %s) RETURNING id",
        (quiz_id, question, options, correct_answer)
    )
    question_id = cursor.fetchone()['id']
    conn.commit()
    cursor.close()
    conn.close()
    return {"id": question_id, "quiz_id": quiz_id}

@router.delete("/questions/{question_id}")
@limiter.limit(f"{RATE_LIMIT_PER_MINUTE}/minute")
async def delete_question(request: Request, question_id: int, user=Depends(get_current_user)):
    """Teacher-only endpoint - delete questions from quizzes in own courses"""
    check_teacher_role(user)
    
    conn = get_db_connection()
    if not conn:
        raise HTTPException(status_code=500, detail="DB connection error")
    cursor = conn.cursor()
    cursor.execute("""
        SELECT qq.*, c.instructor_id 
        FROM quiz_questions qq 
        JOIN quizzes q ON qq.quiz_id = q.id 
        JOIN courses c ON q.course_id = c.id 
        WHERE qq.id=%s
    """, (question_id,))
    question = cursor.fetchone()
    if not question:
        cursor.close()
        conn.close()
        raise HTTPException(status_code=404, detail="Question not found")
    
    if question["instructor_id"] != user.get("teacher_id"):
        cursor.close()
        conn.close()
        raise HTTPException(status_code=403, detail="Not authorized to delete this question")
    
    cursor.execute("DELETE FROM quiz_questions WHERE id=%s", (question_id,))
    conn.commit()
    cursor.close()
    conn.close()
    return {"id": question_id, "deleted": True}

@router.get("/{quiz_id}/submissions")
@limiter.limit(f"{RATE_LIMIT_PER_MINUTE}/minute")
async def list_submissions(request: Request, quiz_id: int, user=Depends(get_current_user)):
    """Teacher-only endpoint - view submissions for quizzes in own courses"""
    check_teacher_role(user)
    
    conn = get_db_connection()
    if not conn:
        raise HTTPException(status_code=500, detail="DB connection error")
    cursor = conn.cursor()
    cursor.execute("SELECT q.*, c.instructor_id FROM quizzes q JOIN courses c ON q.course_id = c.id WHERE q.id=%s", (quiz_id,))
    quiz = cursor.fetchone()
    if not quiz:
        cursor.close()
        conn.close()
        raise HTTPException(status_code=404, detail="Quiz not found")
    if quiz["instructor_id"] != user.get("teacher_id"):
        cursor.close()
        conn.close()
        raise HTTPException(status_code=403, detail="Not authorized to view submissions for this quiz")
    
    cursor.execute("SELECT * FROM quiz_submissions WHERE quiz_id=%s", (quiz_id,))
    submissions = cursor.fetchall()
    cursor.close()
    conn.close()
    return submissions

@router.post("/{quiz_id}/submit")
@limiter.limit(f"{RATE_LIMIT_PER_MINUTE}/minute")
async def submit_quiz(request: Request, quiz_id: int, score: float, user=Depends(get_current_user)):
    """Student endpoint - submit quiz"""
    conn = get_db_connection()
    if not conn:
        raise HTTPException(status_code=500, detail="DB connection error")
    cursor = conn.cursor()
    
    cursor.execute("SELECT student_id FROM users WHERE id=%s", (user["id"],))
    user_row = cursor.fetchone()
    if not user_row or not user_row.get("student_id"):
        cursor.close()
        conn.close()
        raise HTTPException(status_code=400, detail="Student profile not found")
    student_id = user_row["student_id"]
    
    cursor.execute("SELECT id FROM quiz_submissions WHERE quiz_id=%s AND student_id=%s", (quiz_id, student_id))
    if cursor.fetchone():
        cursor.close()
        conn.close()
        raise HTTPException(status_code=400, detail="Already submitted")
    cursor.execute(
        "INSERT INTO quiz_submissions (quiz_id, student_id, score) VALUES (%s, %s, %s) RETURNING id",
        (quiz_id, student_id, score)
    )
    submission_id = cursor.fetchone()['id']
    conn.commit()
    cursor.close()
    conn.close()
    return {"id": submission_id, "quiz_id": quiz_id, "student_id": student_id}
