from fastapi import APIRouter, HTTPException, Request
from app.db import get_db_connection
from passlib.context import CryptContext

router = APIRouter(prefix="/auth", tags=["auth"])

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def get_password_hash(password):
    return pwd_context.hash(password)

@router.post("/forgot-password")
async def forgot_password(request: Request):
    data = await request.json()
    email = data.get("email")
    new_password = data.get("new_password")
    if not email or not new_password:
        raise HTTPException(status_code=400, detail="Email and new password required")
    conn = get_db_connection()
    if not conn:
        raise HTTPException(status_code=500, detail="DB connection error")
    cursor = conn.cursor()
    cursor.execute("SELECT id FROM users WHERE email=%s", (email,))
    user = cursor.fetchone()
    if not user:
        cursor.close()
        conn.close()
        raise HTTPException(status_code=404, detail="User not found")
    hashed = get_password_hash(new_password)
    cursor.execute("UPDATE users SET password_hash=%s WHERE email=%s", (hashed, email))
    conn.commit()
    cursor.close()
    conn.close()
    return {"success": True, "message": "Password updated"}
