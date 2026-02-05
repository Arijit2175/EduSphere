from fastapi import APIRouter, HTTPException
from app.db import get_db_connection, return_db_connection

router = APIRouter(prefix="/certificates", tags=["certificates"])

@router.get("/")
def list_certificates(student_id: int = None, course_id: int = None):
    conn = get_db_connection()
    if not conn:
        raise HTTPException(status_code=500, detail="DB connection error")
    cursor = conn.cursor()
    if student_id and course_id:
        cursor.execute("SELECT * FROM certificates WHERE student_id=%s AND course_id=%s", (student_id, course_id))
    elif student_id:
        cursor.execute("SELECT * FROM certificates WHERE student_id=%s", (student_id,))
    elif course_id:
        cursor.execute("SELECT * FROM certificates WHERE course_id=%s", (course_id,))
    else:
        cursor.execute("SELECT * FROM certificates")
    certificates = cursor.fetchall()
    cursor.close()
    return_db_connection(conn)
    return certificates

@router.post("/")
def create_certificate(student_id: int, course_id: int, certificate_id: str = None):
    conn = get_db_connection()
    if not conn:
        raise HTTPException(status_code=500, detail="DB connection error")
    cursor = conn.cursor()
    cursor.execute("SELECT id FROM certificates WHERE student_id=%s AND course_id=%s", (student_id, course_id))
    if cursor.fetchone():
        cursor.close()
        return_db_connection(conn)
        raise HTTPException(status_code=400, detail="Certificate already issued")
    cursor.execute(
        "INSERT INTO certificates (student_id, course_id, certificate_id) VALUES (%s, %s, %s) RETURNING id",
        (student_id, course_id, certificate_id)
    )
    cert_id = cursor.fetchone()['id']
    conn.commit()
    cursor.close()
    return_db_connection(conn)
    return {"id": cert_id, "student_id": student_id, "course_id": course_id, "certificate_id": certificate_id}

@router.get("/{certificate_id}")
def get_certificate_by_code(certificate_id: str):
    conn = get_db_connection()
    if not conn:
        raise HTTPException(status_code=500, detail="DB connection error")
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM certificates WHERE certificate_id=%s", (certificate_id,))
    cert = cursor.fetchone()
    cursor.close()
    return_db_connection(conn)
    if not cert:
        raise HTTPException(status_code=404, detail="Certificate not found")
    return cert
