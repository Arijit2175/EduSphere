from fastapi import APIRouter, HTTPException
from app.db import get_db_connection

router = APIRouter(prefix="/quizzes", tags=["quizzes"])

# Quizzes
@router.get("/")
def list_quizzes(course_id: int = None):
    conn = get_db_connection()
    if not conn:
        raise HTTPException(status_code=500, detail="DB connection error")
    cursor = conn.cursor(dictionary=True)
    if course_id:
        cursor.execute("SELECT * FROM quizzes WHERE course_id=%s", (course_id,))
    else:
        cursor.execute("SELECT * FROM quizzes")
    quizzes = cursor.fetchall()
    cursor.close()
    conn.close()
    return quizzes

@router.post("/")
def create_quiz(course_id: int, title: str = None, description: str = None):
    conn = get_db_connection()
    if not conn:
        raise HTTPException(status_code=500, detail="DB connection error")
    cursor = conn.cursor()
    cursor.execute(
        "INSERT INTO quizzes (course_id, title, description) VALUES (%s, %s, %s)",
        (course_id, title, description)
    )
    conn.commit()
    quiz_id = cursor.lastrowid
    cursor.close()
    conn.close()
    return {"id": quiz_id, "course_id": course_id, "title": title}

@router.delete("/{quiz_id}")
def delete_quiz(quiz_id: int):
    conn = get_db_connection()
    if not conn:
        raise HTTPException(status_code=500, detail="DB connection error")
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM quizzes WHERE id=%s", (quiz_id,))
    if not cursor.fetchone():
        cursor.close()
        conn.close()
        raise HTTPException(status_code=404, detail="Quiz not found")
    cursor.execute("DELETE FROM quizzes WHERE id=%s", (quiz_id,))
    conn.commit()
    cursor.close()
    conn.close()
    return {"id": quiz_id, "deleted": True}

# Quiz Questions
@router.get("/{quiz_id}/questions")
def list_questions(quiz_id: int):
    conn = get_db_connection()
    if not conn:
        raise HTTPException(status_code=500, detail="DB connection error")
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT * FROM quiz_questions WHERE quiz_id=%s", (quiz_id,))
    questions = cursor.fetchall()
    cursor.close()
    conn.close()
    return questions

@router.post("/{quiz_id}/questions")
def create_question(quiz_id: int, question: str, options: str, correct_answer: str):
    conn = get_db_connection()
    if not conn:
        raise HTTPException(status_code=500, detail="DB connection error")
    cursor = conn.cursor()
    cursor.execute(
        "INSERT INTO quiz_questions (quiz_id, question, options, correct_answer) VALUES (%s, %s, %s, %s)",
        (quiz_id, question, options, correct_answer)
    )
    conn.commit()
    question_id = cursor.lastrowid
    cursor.close()
    conn.close()
    return {"id": question_id, "quiz_id": quiz_id}

@router.delete("/questions/{question_id}")
def delete_question(question_id: int):
    conn = get_db_connection()
    if not conn:
        raise HTTPException(status_code=500, detail="DB connection error")
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM quiz_questions WHERE id=%s", (question_id,))
    if not cursor.fetchone():
        cursor.close()
        conn.close()
        raise HTTPException(status_code=404, detail="Question not found")
    cursor.execute("DELETE FROM quiz_questions WHERE id=%s", (question_id,))
    conn.commit()
    cursor.close()
    conn.close()
    return {"id": question_id, "deleted": True}

# Quiz Submissions
@router.get("/{quiz_id}/submissions")
def list_submissions(quiz_id: int):
    conn = get_db_connection()
    if not conn:
        raise HTTPException(status_code=500, detail="DB connection error")
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT * FROM quiz_submissions WHERE quiz_id=%s", (quiz_id,))
    submissions = cursor.fetchall()
    cursor.close()
    conn.close()
    return submissions

@router.post("/{quiz_id}/submit")
def submit_quiz(quiz_id: int, student_id: int, score: float):
    conn = get_db_connection()
    if not conn:
        raise HTTPException(status_code=500, detail="DB connection error")
    cursor = conn.cursor()
    # Check if already submitted
    cursor.execute("SELECT id FROM quiz_submissions WHERE quiz_id=%s AND student_id=%s", (quiz_id, student_id))
    if cursor.fetchone():
        cursor.close()
        conn.close()
        raise HTTPException(status_code=400, detail="Already submitted")
    cursor.execute(
        "INSERT INTO quiz_submissions (quiz_id, student_id, score) VALUES (%s, %s, %s)",
        (quiz_id, student_id, score)
    )
    conn.commit()
    submission_id = cursor.lastrowid
    cursor.close()
    conn.close()
    return {"id": submission_id, "quiz_id": quiz_id, "student_id": student_id}
