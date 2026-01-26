from fastapi import APIRouter, HTTPException, Body, Depends, Request
from pydantic import BaseModel
from slowapi import Limiter
from slowapi.util import get_remote_address
from app.db import get_db_connection
from app.api.auth import get_current_user
from app.core.security import sanitize_string
from app.core.config import RATE_LIMIT_PER_MINUTE
# Initialize rate limiter
limiter = Limiter(key_func=get_remote_address)

class ChatCreate(BaseModel):
    chat_title: str
    messages: str

class ChatUpdate(BaseModel):
    messages: str = None
    chat_title: str = None

router = APIRouter(prefix="/ai-tutor-chats", tags=["ai_tutor_chats"])

@router.get("/")
@limiter.limit(f"{RATE_LIMIT_PER_MINUTE}/minute")
async def list_chats(request: Request, user=Depends(get_current_user)):
    """Get all chats for the authenticated user only"""
    conn = get_db_connection()
    if not conn:
        raise HTTPException(status_code=500, detail="DB connection error")
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT * FROM ai_tutor_chats WHERE student_id=%s ORDER BY last_updated DESC", (user["id"],))
    chats = cursor.fetchall()
    cursor.close()
    conn.close()
    return chats

@router.post("/")
@limiter.limit(f"{RATE_LIMIT_PER_MINUTE}/minute")
async def create_chat(request: Request, chat: ChatCreate = Body(...), user=Depends(get_current_user)):
    """Create a chat for the authenticated user"""
    chat_title = sanitize_string(chat.chat_title, max_length=200)
    messages = sanitize_string(chat.messages, max_length=50000)
    
    conn = get_db_connection()
    if not conn:
        raise HTTPException(status_code=500, detail="DB connection error")
    cursor = conn.cursor()
    cursor.execute(
        "INSERT INTO ai_tutor_chats (student_id, chat_title, messages) VALUES (%s, %s, %s)",
        (user["id"], chat_title, messages)
    )
    conn.commit()
    chat_id = cursor.lastrowid
    cursor.close()
    conn.close()
    return {"id": chat_id, "student_id": user["id"], "chat_title": chat_title}

@router.get("/{chat_id}")
@limiter.limit(f"{RATE_LIMIT_PER_MINUTE}/minute")
async def get_chat(request: Request, chat_id: int, user=Depends(get_current_user)):
    """Get a specific chat - only if it belongs to the authenticated user"""
    conn = get_db_connection()
    if not conn:
        raise HTTPException(status_code=500, detail="DB connection error")
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT * FROM ai_tutor_chats WHERE id=%s AND student_id=%s", (chat_id, user["id"]))
    chat = cursor.fetchone()
    cursor.close()
    conn.close()
    if not chat:
        raise HTTPException(status_code=404, detail="Chat not found")
    return chat

@router.put("/{chat_id}")
@limiter.limit(f"{RATE_LIMIT_PER_MINUTE}/minute")
async def update_chat(request: Request, chat_id: int, update: ChatUpdate = Body(...), user=Depends(get_current_user)):
    """Update a chat - only if it belongs to the authenticated user"""
    conn = get_db_connection()
    if not conn:
        raise HTTPException(status_code=500, detail="DB connection error")
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM ai_tutor_chats WHERE id=%s AND student_id=%s", (chat_id, user["id"]))
    if not cursor.fetchone():
        cursor.close()
        conn.close()
        raise HTTPException(status_code=404, detail="Chat not found")
    update_fields = []
    params = []
    if update.messages is not None:
        sanitized_messages = sanitize_string(update.messages, max_length=50000)
        update_fields.append("messages=%s")
        params.append(sanitized_messages)
    if update.chat_title is not None:
        sanitized_title = sanitize_string(update.chat_title, max_length=200)
        update_fields.append("chat_title=%s")
        params.append(sanitized_title)
    if not update_fields:
        cursor.close()
        conn.close()
        raise HTTPException(status_code=400, detail="No fields to update")
    params.append(chat_id)
    cursor.execute(f"UPDATE ai_tutor_chats SET {', '.join(update_fields)} WHERE id=%s AND student_id=%s", tuple(params) + (user["id"],))
    conn.commit()
    cursor.close()
    conn.close()
    return {"id": chat_id, "updated": True}

@router.delete("/{chat_id}")
@limiter.limit(f"{RATE_LIMIT_PER_MINUTE}/minute")
async def delete_chat(request: Request, chat_id: int, user=Depends(get_current_user)):
    """Delete a chat - only if it belongs to the authenticated user"""
    conn = get_db_connection()
    if not conn:
        raise HTTPException(status_code=500, detail="DB connection error")
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM ai_tutor_chats WHERE id=%s AND student_id=%s", (chat_id, user["id"]))
    if not cursor.fetchone():
        cursor.close()
        conn.close()
        raise HTTPException(status_code=404, detail="Chat not found")
    cursor.execute("DELETE FROM ai_tutor_chats WHERE id=%s AND student_id=%s", (chat_id, user["id"]))
    conn.commit()
    cursor.close()
    conn.close()
    return {"id": chat_id, "deleted": True}
