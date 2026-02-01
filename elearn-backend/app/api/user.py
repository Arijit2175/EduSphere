
from fastapi import APIRouter, Depends, HTTPException, status, Request
from app.db import get_db_connection
from app.api.auth import get_current_user

router = APIRouter(prefix="/users", tags=["users"])

@router.get("/me")
async def get_user_me(current_user: dict = Depends(get_current_user)):
    user_id = current_user["id"]
    conn = get_db_connection()
    if not conn:
        raise HTTPException(status_code=500, detail="DB connection error")
    cursor = conn.cursor()
    cursor.execute("SELECT id, email, first_name, last_name, phone, gender, state, city, bio, linkedin, github, avatar, role, teacher_id, student_id FROM users WHERE id=%s", (user_id,))
    user = cursor.fetchone()
    cursor.close()
    conn.close()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

@router.put("/me")
async def update_user(request: Request, current_user: dict = Depends(get_current_user)):
    data = await request.json()
    user_id = current_user["id"]
    allowed_fields = ["first_name", "last_name", "phone", "gender", "state", "city", "bio", "linkedin", "github", "avatar"]
    updates = {k: v for k, v in data.items() if k in allowed_fields}
    if not updates:
        raise HTTPException(status_code=400, detail="No valid fields to update")
    set_clause = ", ".join([f"{k}=%s" for k in updates.keys()])
    values = list(updates.values())
    values.append(user_id)
    conn = get_db_connection()
    if not conn:
        raise HTTPException(status_code=500, detail="DB connection error")
    cursor = conn.cursor()
    cursor.execute(f"UPDATE users SET {set_clause} WHERE id=%s", values)
    conn.commit()
    cursor.close()
    conn.close()
    return {"success": True, "updated": updates}
