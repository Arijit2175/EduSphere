from fastapi import APIRouter, HTTPException, Depends, Request
from pydantic import BaseModel
from slowapi import Limiter
from slowapi.util import get_remote_address
from app.db import get_db_connection, return_db_connection
from app.api.auth import get_current_user
from app.core.security import sanitize_string, check_teacher_role
from app.core.config import RATE_LIMIT_PER_MINUTE

limiter = Limiter(key_func=get_remote_address)

class AttendanceRequest(BaseModel):
    schedule_id: int
    student_id: int
    status: str

router = APIRouter(prefix="/attendance", tags=["attendance"])

@router.get("/")
@limiter.limit(f"{RATE_LIMIT_PER_MINUTE}/minute")
async def list_attendance(request: Request, user=Depends(get_current_user), schedule_id: int = None, student_id: int = None):
    """Authenticated endpoint - teachers see all, students see own"""
    conn = get_db_connection()
    if not conn:
        raise HTTPException(status_code=500, detail="DB connection error")
    cursor = conn.cursor()
    
    if user["role"] == "student":
        cursor.execute("SELECT student_id FROM users WHERE id=%s", (user["id"],))
        user_row = cursor.fetchone()
        if not user_row or not user_row.get("student_id"):
            cursor.close()
            return_db_connection(conn)
            return []
        student_id = user_row["student_id"]
        cursor.execute("SELECT * FROM attendance WHERE student_id=%s", (student_id,))
    else:
        if schedule_id and student_id:
            cursor.execute("SELECT * FROM attendance WHERE schedule_id=%s AND student_id=%s", (schedule_id, student_id))
        elif schedule_id:
            cursor.execute("SELECT * FROM attendance WHERE schedule_id=%s", (schedule_id,))
        elif student_id:
            cursor.execute("SELECT * FROM attendance WHERE student_id=%s", (student_id,))
        else:
            cursor.execute("SELECT * FROM attendance")
    
    records = cursor.fetchall()
    cursor.close()
    return_db_connection(conn)
    return records

@router.post("/")
@limiter.limit(f"{RATE_LIMIT_PER_MINUTE}/minute")
async def mark_attendance(request: Request, data: AttendanceRequest, user=Depends(get_current_user)):
    """Teacher-only endpoint - mark attendance"""
    check_teacher_role(user)
    
    schedule_id = data.schedule_id
    student_id = data.student_id
    status = sanitize_string(data.status, max_length=20)
    
    if status not in ("present", "absent"):
        raise HTTPException(status_code=400, detail="Invalid status")
    
    conn = get_db_connection()
    if not conn:
        raise HTTPException(status_code=500, detail="DB connection error")
    cursor = conn.cursor()
    
    cursor.execute("""
        SELECT s.*, c.instructor_id 
        FROM class_schedules s 
        JOIN courses c ON s.course_id = c.id 
        WHERE s.id=%s
    """, (schedule_id,))
    schedule = cursor.fetchone()
    if not schedule:
        cursor.close()
        return_db_connection(conn)
        raise HTTPException(status_code=404, detail="Schedule not found")
    if schedule["instructor_id"] != user.get("teacher_id"):
        cursor.close()
        return_db_connection(conn)
        raise HTTPException(status_code=403, detail="Not authorized to mark attendance for this schedule")
    
    cursor.execute("SELECT id FROM attendance WHERE schedule_id=%s AND student_id=%s", (schedule_id, student_id))
    if cursor.fetchone():
        cursor.close()
        return_db_connection(conn)
        raise HTTPException(status_code=400, detail="Attendance already marked")
    cursor.execute(
        "INSERT INTO attendance (schedule_id, student_id, status) VALUES (%s, %s, %s) RETURNING id",
        (schedule_id, student_id, status)
    )
    attendance_id = cursor.fetchone()['id']
    conn.commit()
    cursor.close()
    return_db_connection(conn)
    return {"id": attendance_id, "schedule_id": schedule_id, "student_id": student_id, "status": status}

@router.put("/{attendance_id}")
@limiter.limit(f"{RATE_LIMIT_PER_MINUTE}/minute")
async def update_attendance(request: Request, attendance_id: int, status: str, user=Depends(get_current_user)):
    """Teacher-only endpoint - update attendance"""
    check_teacher_role(user)
    
    status = sanitize_string(status, max_length=20)
    if status not in ("present", "absent"):
        raise HTTPException(status_code=400, detail="Invalid status")
    
    conn = get_db_connection()
    if not conn:
        raise HTTPException(status_code=500, detail="DB connection error")
    cursor = conn.cursor()
    
    cursor.execute("""
        SELECT a.*, c.instructor_id 
        FROM attendance a 
        JOIN class_schedules s ON a.schedule_id = s.id 
        JOIN courses c ON s.course_id = c.id 
        WHERE a.id=%s
    """, (attendance_id,))
    attendance = cursor.fetchone()
    if not attendance:
        cursor.close()
        return_db_connection(conn)
        raise HTTPException(status_code=404, detail="Attendance record not found")
    if attendance["instructor_id"] != user.get("teacher_id"):
        cursor.close()
        return_db_connection(conn)
        raise HTTPException(status_code=403, detail="Not authorized to update this attendance record")
    
    cursor.execute("UPDATE attendance SET status=%s WHERE id=%s", (status, attendance_id))
    conn.commit()
    cursor.close()
    return_db_connection(conn)
    return {"id": attendance_id, "updated": True}

@router.delete("/{attendance_id}")
@limiter.limit(f"{RATE_LIMIT_PER_MINUTE}/minute")
async def delete_attendance(request: Request, attendance_id: int, user=Depends(get_current_user)):
    """Teacher-only endpoint - delete attendance record"""
    check_teacher_role(user)
    
    conn = get_db_connection()
    if not conn:
        raise HTTPException(status_code=500, detail="DB connection error")
    cursor = conn.cursor()
    
    cursor.execute("""
        SELECT a.*, c.instructor_id 
        FROM attendance a 
        JOIN class_schedules s ON a.schedule_id = s.id 
        JOIN courses c ON s.course_id = c.id 
        WHERE a.id=%s
    """, (attendance_id,))
    attendance = cursor.fetchone()
    if not attendance:
        cursor.close()
        return_db_connection(conn)
        raise HTTPException(status_code=404, detail="Attendance record not found")
    if attendance["instructor_id"] != user.get("teacher_id"):
        cursor.close()
        return_db_connection(conn)
        raise HTTPException(status_code=403, detail="Not authorized to delete this attendance record")
    
    cursor.execute("DELETE FROM attendance WHERE id=%s", (attendance_id,))
    conn.commit()
    cursor.close()
    return_db_connection(conn)
    return {"id": attendance_id, "deleted": True}
