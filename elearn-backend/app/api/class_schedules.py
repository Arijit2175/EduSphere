from fastapi import APIRouter, HTTPException
from app.db import get_db_connection

router = APIRouter(prefix="/class-schedules", tags=["class_schedules"])

@router.get("/")
def list_schedules(course_id: int = None):
    conn = get_db_connection()
    if not conn:
        raise HTTPException(status_code=500, detail="DB connection error")
    cursor = conn.cursor(dictionary=True)
    if course_id:
        cursor.execute("SELECT * FROM class_schedules WHERE course_id=%s ORDER BY start_time ASC", (course_id,))
    else:
        cursor.execute("SELECT * FROM class_schedules ORDER BY start_time ASC")
    schedules = cursor.fetchall()
    cursor.close()
    conn.close()
    return schedules

@router.post("/")
def create_schedule(course_id: int, title: str, start_time: str, duration: int = 60, meet_link: str = None):
    conn = get_db_connection()
    if not conn:
        raise HTTPException(status_code=500, detail="DB connection error")
    cursor = conn.cursor()
    cursor.execute(
        "INSERT INTO class_schedules (course_id, title, start_time, duration, meet_link) VALUES (%s, %s, %s, %s, %s)",
        (course_id, title, start_time, duration, meet_link)
    )
    conn.commit()
    schedule_id = cursor.lastrowid
    cursor.close()
    conn.close()
    return {"id": schedule_id, "course_id": course_id, "title": title}

@router.put("/{schedule_id}")
def update_schedule(schedule_id: int, title: str = None, start_time: str = None, duration: int = None, meet_link: str = None):
    conn = get_db_connection()
    if not conn:
        raise HTTPException(status_code=500, detail="DB connection error")
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM class_schedules WHERE id=%s", (schedule_id,))
    if not cursor.fetchone():
        cursor.close()
        conn.close()
        raise HTTPException(status_code=404, detail="Schedule not found")
    update_fields = []
    params = []
    if title is not None:
        update_fields.append("title=%s")
        params.append(title)
    if start_time is not None:
        update_fields.append("start_time=%s")
        params.append(start_time)
    if duration is not None:
        update_fields.append("duration=%s")
        params.append(duration)
    if meet_link is not None:
        update_fields.append("meet_link=%s")
        params.append(meet_link)
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
def delete_schedule(schedule_id: int):
    conn = get_db_connection()
    if not conn:
        raise HTTPException(status_code=500, detail="DB connection error")
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM class_schedules WHERE id=%s", (schedule_id,))
    if not cursor.fetchone():
        cursor.close()
        conn.close()
        raise HTTPException(status_code=404, detail="Schedule not found")
    cursor.execute("DELETE FROM class_schedules WHERE id=%s", (schedule_id,))
    conn.commit()
    cursor.close()
    conn.close()
    return {"id": schedule_id, "deleted": True}
