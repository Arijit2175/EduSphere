from fastapi import APIRouter, HTTPException
from app.db import get_db_connection, return_db_connection
from pydantic import BaseModel

router = APIRouter(prefix="/contact-messages", tags=["contact_messages"])

@router.get("/")
def list_messages():
    conn = get_db_connection()
    if not conn:
        raise HTTPException(status_code=500, detail="DB connection error")
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM contact_messages ORDER BY created_at DESC")
    messages = cursor.fetchall()
    cursor.close()
    return_db_connection(conn)
    return messages

class ContactMessageRequest(BaseModel):
    name: str
    email: str
    subject: str = None
    message: str = None

@router.post("/")
def create_message(data: ContactMessageRequest):
    conn = get_db_connection()
    if not conn:
        raise HTTPException(status_code=500, detail="DB connection error")
    cursor = conn.cursor()
    cursor.execute(
        "INSERT INTO contact_messages (name, email, subject, message) VALUES (%s, %s, %s, %s) RETURNING id",
        (data.name, data.email, data.subject, data.message)
    )
    msg_id = cursor.fetchone()['id']
    conn.commit()
    cursor.close()
    return_db_connection(conn)
    return {"id": msg_id, "name": data.name, "email": data.email, "subject": data.subject}
