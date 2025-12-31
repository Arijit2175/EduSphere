from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
class AttendanceRequest(BaseModel):
    schedule_id: int
    student_id: int
    status: str
from app.db import get_db_connection

router = APIRouter(prefix="/attendance", tags=["attendance"])

@router.get("/")
def list_attendance(schedule_id: int = None, student_id: int = None):
    conn = get_db_connection()
    if not conn:
        raise HTTPException(status_code=500, detail="DB connection error")
    cursor = conn.cursor(dictionary=True)
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
    conn.close()
    return records

@router.post("/")
def mark_attendance(data: AttendanceRequest):
    schedule_id = data.schedule_id
    student_id = data.student_id
    status = data.status
    if status not in ("present", "absent"):
        raise HTTPException(status_code=400, detail="Invalid status")
    conn = get_db_connection()
    if not conn:
        raise HTTPException(status_code=500, detail="DB connection error")
    cursor = conn.cursor()
    # Check if already marked
    cursor.execute("SELECT id FROM attendance WHERE schedule_id=%s AND student_id=%s", (schedule_id, student_id))
    if cursor.fetchone():
        cursor.close()
        conn.close()
        raise HTTPException(status_code=400, detail="Attendance already marked")
    cursor.execute(
        "INSERT INTO attendance (schedule_id, student_id, status) VALUES (%s, %s, %s)",
        (schedule_id, student_id, status)
    )
    conn.commit()
    attendance_id = cursor.lastrowid
    cursor.close()
    conn.close()
    return {"id": attendance_id, "schedule_id": schedule_id, "student_id": student_id, "status": status}

@router.put("/{attendance_id}")
def update_attendance(attendance_id: int, status: str):
    if status not in ("present", "absent"):
        raise HTTPException(status_code=400, detail="Invalid status")
    conn = get_db_connection()
    if not conn:
        raise HTTPException(status_code=500, detail="DB connection error")
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM attendance WHERE id=%s", (attendance_id,))
    if not cursor.fetchone():
        cursor.close()
        conn.close()
        raise HTTPException(status_code=404, detail="Attendance record not found")
    cursor.execute("UPDATE attendance SET status=%s WHERE id=%s", (status, attendance_id))
    conn.commit()
    cursor.close()
    conn.close()
    return {"id": attendance_id, "updated": True}

@router.delete("/{attendance_id}")
def delete_attendance(attendance_id: int):
    conn = get_db_connection()
    if not conn:
        raise HTTPException(status_code=500, detail="DB connection error")
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM attendance WHERE id=%s", (attendance_id,))
    if not cursor.fetchone():
        cursor.close()
        conn.close()
        raise HTTPException(status_code=404, detail="Attendance record not found")
    cursor.execute("DELETE FROM attendance WHERE id=%s", (attendance_id,))
    conn.commit()
    cursor.close()
    conn.close()
    return {"id": attendance_id, "deleted": True}
