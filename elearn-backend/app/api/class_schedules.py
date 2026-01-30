from fastapi import APIRouter, HTTPException, Body, Depends, Request
from pydantic import BaseModel
from slowapi import Limiter
from slowapi.util import get_remote_address
from app.db import get_db_connection
from app.api.auth import get_current_user
from app.core.security import sanitize_string, validate_url, check_teacher_role
from app.core.config import RATE_LIMIT_PER_MINUTE

limiter = Limiter(key_func=get_remote_address)

router = APIRouter(prefix="/class-schedules", tags=["class_schedules"])

class ScheduleCreate(BaseModel):
    course_id: int
    title: str
    start_time: str
    duration: int = 60
    meet_link: str = None

@router.get("/")
@limiter.limit(f"{RATE_LIMIT_PER_MINUTE}/minute")
async def list_schedules(request: Request, course_id: int = None):
    """Public endpoint - accessible to students and teachers"""
    conn = get_db_connection()
    if not conn:
        raise HTTPException(status_code=500, detail="DB connection error")
    cursor = conn.cursor()
    if course_id:
        cursor.execute("SELECT * FROM class_schedules WHERE course_id=%s ORDER BY start_time ASC", (course_id,))
    else:
        cursor.execute("SELECT * FROM class_schedules ORDER BY start_time ASC")
    schedules = cursor.fetchall()
    cursor.close()
    conn.close()
    return schedules

@router.post("/")
@limiter.limit(f"{RATE_LIMIT_PER_MINUTE}/minute")
async def create_schedule(request: Request, data: ScheduleCreate = Body(...), user=Depends(get_current_user)):
    """Teacher-only endpoint - create schedule for own courses"""
    check_teacher_role(user)
    
    title = sanitize_string(data.title, max_length=200)
    meet_link = None
    if data.meet_link:
        meet_link = validate_url(data.meet_link)
    
    conn = get_db_connection()
    if not conn:
        raise HTTPException(status_code=500, detail="DB connection error")
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM courses WHERE id=%s", (data.course_id,))
    course = cursor.fetchone()
    if not course:
        cursor.close()
        conn.close()
        raise HTTPException(status_code=404, detail="Course not found")
    if course["instructor_id"] != user["id"]:
        cursor.close()
        conn.close()
        raise HTTPException(status_code=403, detail="Not authorized to create schedules for this course")
    
    from datetime import datetime
    def iso_to_mysql(dt_str):
        try:
            if dt_str.endswith('Z'):
                dt_str = dt_str[:-1]
            dt = datetime.fromisoformat(dt_str)
            return dt.strftime('%Y-%m-%d %H:%M:%S')
        except Exception:
            return dt_str  

    start_time_mysql = iso_to_mysql(data.start_time)
    cursor.execute(
        "INSERT INTO class_schedules (course_id, title, start_time, duration, meet_link) VALUES (%s, %s, %s, %s, %s) RETURNING id",
        (data.course_id, title, start_time_mysql, data.duration, meet_link)
    )
    schedule_id = cursor.fetchone()['id']
    conn.commit()
    cursor.execute("SELECT * FROM class_schedules WHERE id=%s", (schedule_id,))
    schedule = cursor.fetchone()
    cursor.close()
    conn.close()
    return schedule

@router.put("/{schedule_id}")
@limiter.limit(f"{RATE_LIMIT_PER_MINUTE}/minute")
async def update_schedule(request: Request, schedule_id: int, user=Depends(get_current_user), title: str = None, start_time: str = None, duration: int = None, meet_link: str = None):
    """Teacher-only endpoint - update schedules in own courses"""
    check_teacher_role(user)
    
    conn = get_db_connection()
    if not conn:
        raise HTTPException(status_code=500, detail="DB connection error")
    cursor = conn.cursor()
    cursor.execute("SELECT s.*, c.instructor_id FROM class_schedules s JOIN courses c ON s.course_id = c.id WHERE s.id=%s", (schedule_id,))
    schedule = cursor.fetchone()
    if not schedule:
        cursor.close()
        conn.close()
        raise HTTPException(status_code=404, detail="Schedule not found")
    
    if schedule["instructor_id"] != user["id"]:
        cursor.close()
        conn.close()
        raise HTTPException(status_code=403, detail="Not authorized to update this schedule")
    
    update_fields = []
    params = []
    if title is not None:
        update_fields.append("title=%s")
        params.append(sanitize_string(title, max_length=200))
    if start_time is not None:
        update_fields.append("start_time=%s")
        params.append(start_time)
    if duration is not None:
        update_fields.append("duration=%s")
        params.append(duration)
    if meet_link is not None:
        update_fields.append("meet_link=%s")
        params.append(validate_url(meet_link))
    if not update_fields:
        cursor.close()
        conn.close()
        raise HTTPException(status_code=400, detail="No fields to update")
    params.append(schedule_id)
    cursor.execute(f"UPDATE class_schedules SET {', '.join(update_fields)} WHERE id=%s", tuple(params))
    conn.commit()
    cursor.close()
    conn.close()
    return {"id": schedule_id, "updated": True}

@router.delete("/{schedule_id}")
@limiter.limit(f"{RATE_LIMIT_PER_MINUTE}/minute")
async def delete_schedule(request: Request, schedule_id: int, user=Depends(get_current_user)):
    """Teacher-only endpoint - delete schedules in own courses"""
    check_teacher_role(user)
    
    conn = get_db_connection()
    if not conn:
        raise HTTPException(status_code=500, detail="DB connection error")
    cursor = conn.cursor()
    cursor.execute("SELECT s.*, c.instructor_id FROM class_schedules s JOIN courses c ON s.course_id = c.id WHERE s.id=%s", (schedule_id,))
    schedule = cursor.fetchone()
    if not schedule:
        cursor.close()
        conn.close()
        raise HTTPException(status_code=404, detail="Schedule not found")
    
    if schedule["instructor_id"] != user["id"]:
        cursor.close()
        conn.close()
        raise HTTPException(status_code=403, detail="Not authorized to delete this schedule")
    
    cursor.execute("DELETE FROM class_schedules WHERE id=%s", (schedule_id,))
    conn.commit()
    cursor.close()
    conn.close()
    return {"id": schedule_id, "deleted": True}
