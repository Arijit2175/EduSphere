from fastapi import APIRouter, HTTPException
from app.db import get_db_connection

router = APIRouter(prefix="/ai-tutor-chats", tags=["ai_tutor_chats"])

@router.get("/")
def list_chats(student_id: int = None):
    conn = get_db_connection()
    if not conn:
        raise HTTPException(status_code=500, detail="DB connection error")
    cursor = conn.cursor(dictionary=True)
    if student_id:
        cursor.execute("SELECT * FROM ai_tutor_chats WHERE student_id=%s ORDER BY last_updated DESC", (student_id,))
    else:
        cursor.execute("SELECT * FROM ai_tutor_chats ORDER BY last_updated DESC")
    chats = cursor.fetchall()
    cursor.close()
    conn.close()
    return chats

@router.post("/")
def create_chat(student_id: int, chat_title: str, messages: str):
    conn = get_db_connection()
    if not conn:
        raise HTTPException(status_code=500, detail="DB connection error")
    cursor = conn.cursor()
    cursor.execute(
        "INSERT INTO ai_tutor_chats (student_id, chat_title, messages) VALUES (%s, %s, %s)",
        (student_id, chat_title, messages)
    )
    conn.commit()
    chat_id = cursor.lastrowid
    cursor.close()
    conn.close()
    return {"id": chat_id, "student_id": student_id, "chat_title": chat_title}

@router.get("/{chat_id}")
def get_chat(chat_id: int):
    conn = get_db_connection()
    if not conn:
        raise HTTPException(status_code=500, detail="DB connection error")
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT * FROM ai_tutor_chats WHERE id=%s", (chat_id,))
    chat = cursor.fetchone()
    cursor.close()
    conn.close()
    if not chat:
        raise HTTPException(status_code=404, detail="Chat not found")
    return chat

@router.put("/{chat_id}")
def update_chat(chat_id: int, messages: str = None, chat_title: str = None):
    conn = get_db_connection()
    if not conn:
        raise HTTPException(status_code=500, detail="DB connection error")
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM ai_tutor_chats WHERE id=%s", (chat_id,))
    if not cursor.fetchone():
        cursor.close()
        conn.close()
        raise HTTPException(status_code=404, detail="Chat not found")
    update_fields = []
    params = []
    if messages is not None:
        update_fields.append("messages=%s")
        params.append(messages)
    if chat_title is not None:
        update_fields.append("chat_title=%s")
        params.append(chat_title)
    if not update_fields:
        cursor.close()
        conn.close()
        raise HTTPException(status_code=400, detail="No fields to update")
    params.append(chat_id)
    cursor.execute(f"UPDATE ai_tutor_chats SET {', '.join(update_fields)} WHERE id=%s", tuple(params))
    conn.commit()
    cursor.close()
    conn.close()
    return {"id": chat_id, "updated": True}

@router.delete("/{chat_id}")
def delete_chat(chat_id: int):
    conn = get_db_connection()
    if not conn:
        raise HTTPException(status_code=500, detail="DB connection error")
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM ai_tutor_chats WHERE id=%s", (chat_id,))
    if not cursor.fetchone():
        cursor.close()
        conn.close()
        raise HTTPException(status_code=404, detail="Chat not found")
    cursor.execute("DELETE FROM ai_tutor_chats WHERE id=%s", (chat_id,))
    conn.commit()
    cursor.close()
    conn.close()
    return {"id": chat_id, "deleted": True}
