from fastapi import APIRouter, HTTPException
from app.db import get_db_connection

router = APIRouter(prefix="/contact-messages", tags=["contact_messages"])

@router.get("/")
def list_messages():
    conn = get_db_connection()
    if not conn:
        raise HTTPException(status_code=500, detail="DB connection error")
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT * FROM contact_messages ORDER BY created_at DESC")
    messages = cursor.fetchall()
    cursor.close()
    conn.close()
    return messages

@router.post("/")
def create_message(name: str, email: str, subject: str = None, message: str = None):
    conn = get_db_connection()
    if not conn:
        raise HTTPException(status_code=500, detail="DB connection error")
    cursor = conn.cursor()
    cursor.execute(
        "INSERT INTO contact_messages (name, email, subject, message) VALUES (%s, %s, %s, %s)",
        (name, email, subject, message)
    )
    conn.commit()
    msg_id = cursor.lastrowid
    cursor.close()
    conn.close()
    return {"id": msg_id, "name": name, "email": email, "subject": subject}
