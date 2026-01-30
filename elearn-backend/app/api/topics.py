from fastapi import APIRouter, Depends, HTTPException, Body
from app.db import get_db_connection
from app.api.auth import get_current_user

router = APIRouter(prefix="/topics", tags=["Topics"])

@router.get("/", summary="List all topics")
def list_topics():
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM topics")
    topics = cursor.fetchall()
    cursor.close()
    conn.close()
    return topics

@router.get("/followed", summary="List topics followed by current user")
def get_followed_topics(user=Depends(get_current_user)):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("""
        SELECT t.* FROM topics t
        JOIN followed_topics f ON t.id = f.topic_id
        WHERE f.user_id = %s
    """, (user["id"],))
    topics = cursor.fetchall()
    cursor.close()
    conn.close()
    return topics

@router.post("/follow", summary="Follow a topic")
def follow_topic(topic_id: int = Body(...), user=Depends(get_current_user)):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT 1 FROM followed_topics WHERE user_id=%s AND topic_id=%s", (user["id"], topic_id))
    if cursor.fetchone():
        cursor.close()
        conn.close()
        raise HTTPException(status_code=400, detail="Already following this topic")
    cursor.execute("INSERT INTO followed_topics (user_id, topic_id) VALUES (%s, %s)", (user["id"], topic_id))
    conn.commit()
    cursor.close()
    conn.close()
    return {"success": True}

@router.post("/unfollow", summary="Unfollow a topic")
def unfollow_topic(topic_id: int = Body(...), user=Depends(get_current_user)):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM followed_topics WHERE user_id=%s AND topic_id=%s", (user["id"], topic_id))
    conn.commit()
    cursor.close()
    conn.close()
    return {"success": True}
