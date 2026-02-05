from fastapi import APIRouter, Depends, HTTPException, Body, Query
from typing import Optional
from app.db import get_db_connection, return_db_connection, cache_get, cache_set, cache_clear
from app.api.auth import get_current_user

router = APIRouter(prefix="/informal-posts", tags=["Informal Posts"])

@router.delete("/{post_id}/comment/{comment_id}")
def delete_comment(post_id: int, comment_id: str, user=Depends(get_current_user)):
    conn = get_db_connection()
    if not conn:
        raise HTTPException(status_code=500, detail="DB connection error")
    cursor = conn.cursor()
    cursor.execute("SELECT comments FROM informal_posts WHERE id=%s", (post_id,))
    post = cursor.fetchone()
    if not post:
        cursor.close()
        conn.close()
        raise HTTPException(status_code=404, detail="Post not found")
    import json
    comments = post.get("comments")
    try:
        comment_list = json.loads(comments) if comments else []
    except Exception:
        comment_list = []
    new_comments = [c for c in comment_list if not (c["id"] == comment_id and c["author"] == user.get("email"))]
    cursor.execute("UPDATE informal_posts SET comments=%s WHERE id=%s", (json.dumps(new_comments), post_id))
    conn.commit()
    cursor.close()
    conn.close()
    return {"success": True, "comments": new_comments}
@router.post("/{post_id}/like")
def like_informal_post(post_id: int, user=Depends(get_current_user)):
    conn = get_db_connection()
    if not conn:
        raise HTTPException(status_code=500, detail="DB connection error")
    cursor = conn.cursor()
    cursor.execute("SELECT likers, likes FROM informal_posts WHERE id=%s", (post_id,))
    post = cursor.fetchone()
    if not post:
        cursor.close()
        conn.close()
        raise HTTPException(status_code=404, detail="Post not found")
    likers = post.get("likers") or ""
    likes = post.get("likes")
    liker_list = [int(x) for x in likers.split(",") if x.strip().isdigit()]
    if user["id"] in liker_list:
        liker_list.remove(user["id"])
        likes = max(0, (likes or 1) - 1)
    else:
        liker_list.append(user["id"])
        likes = (likes or 0) + 1
    new_likers = ",".join(str(x) for x in liker_list)
    cursor.execute("UPDATE informal_posts SET likers=%s, likes=%s WHERE id=%s", (new_likers, likes, post_id))
    conn.commit()
    cursor.close()
    conn.close()
    return {"success": True, "likes": likes, "likers": liker_list}

@router.post("/{post_id}/comment")
def comment_informal_post(post_id: int, text: str = Body(...), user=Depends(get_current_user)):
    conn = get_db_connection()
    if not conn:
        raise HTTPException(status_code=500, detail="DB connection error")
    cursor = conn.cursor()
    cursor.execute("SELECT comments FROM informal_posts WHERE id=%s", (post_id,))
    post = cursor.fetchone()
    if not post:
        cursor.close()
        conn.close()
        raise HTTPException(status_code=404, detail="Post not found")
    import json
    comments = post.get("comments")
    try:
        comment_list = json.loads(comments) if comments else []
    except Exception:
        comment_list = []
    new_comment = {
        "id": f"c-{user['id']}-{int(__import__('time').time())}",
        "author": user.get("email", "Anonymous"),
        "text": text
    }
    comment_list.append(new_comment)
    cursor.execute("UPDATE informal_posts SET comments=%s WHERE id=%s", (json.dumps(comment_list), post_id))
    conn.commit()
    cursor.close()
    conn.close()
    return {"success": True, "comments": comment_list}

@router.post("/{post_id}/save")
def save_informal_post(post_id: int, user=Depends(get_current_user)):
    conn = get_db_connection()
    if not conn:
        raise HTTPException(status_code=500, detail="DB connection error")
    cursor = conn.cursor()
    cursor.execute("SELECT savers FROM informal_posts WHERE id=%s", (post_id,))
    post = cursor.fetchone()
    if not post:
        cursor.close()
        conn.close()
        raise HTTPException(status_code=404, detail="Post not found")
    savers = post.get("savers") or ""
    saver_list = [int(x) for x in savers.split(",") if x.strip().isdigit()]
    if user["id"] in saver_list:
        saver_list.remove(user["id"])
    else:
        saver_list.append(user["id"])
    new_savers = ",".join(str(x) for x in saver_list)
    cursor.execute("UPDATE informal_posts SET savers=%s WHERE id=%s", (new_savers, post_id))
    conn.commit()
    cursor.close()
    conn.close()
    return {"success": True, "savers": saver_list}



@router.delete("/{post_id}")
def delete_informal_post(post_id: int, user=Depends(get_current_user)):
    conn = get_db_connection()
    if not conn:
        raise HTTPException(status_code=500, detail="DB connection error")
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM informal_posts WHERE id=%s", (post_id,))
    post = cursor.fetchone()
    if not post:
        cursor.close()
        conn.close()
        raise HTTPException(status_code=404, detail="Post not found")
    if post["author_id"] != user["id"]:
        cursor.close()
        conn.close()
        raise HTTPException(status_code=403, detail="Not authorized to delete this post")
    cursor.execute("DELETE FROM informal_posts WHERE id=%s", (post_id,))
    conn.commit()
    cursor.close()
    conn.close()
    return {"success": True}

@router.post("/")
def create_informal_post(post: dict, user=Depends(get_current_user)):
    conn = get_db_connection()
    if not conn:
        raise HTTPException(status_code=500, detail="DB connection error")
    cursor = conn.cursor()
    sql = """
        INSERT INTO informal_posts
        (title, content, tags, topic, type, media_url, creator, author_id, role)
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
    """
    creator = user.get("username") or user.get("email") or str(user.get("id"))
    values = (
        post.get("title"),
        post.get("content"),
        post.get("tags"),
        post.get("topic"),
        post.get("type"),
        post.get("media_url"),
        creator,
        user["id"],
        user["role"]
    )
    
    try:
        cursor.execute(sql + " RETURNING id", values)
        post_id = cursor.fetchone()['id']
        conn.commit()
        cursor.execute("SELECT * FROM informal_posts WHERE id=%s", (post_id,))
        new_post = cursor.fetchone()
        
        # Clear cache when new post is created
        cache_clear("informal_posts")
        
        return new_post
    finally:
        cursor.close()
        return_db_connection(conn)

@router.get("/")
def get_informal_posts(skip: int = Query(0, ge=0), limit: int = Query(50, ge=1, le=200), topic: str = None):
    """Get informal posts with pagination and caching"""
    cache_key = f"informal_posts:{skip}:{limit}:{topic}"
    cached_result = cache_get(cache_key)
    if cached_result:
        return cached_result
    
    conn = get_db_connection()
    if not conn:
        raise HTTPException(status_code=500, detail="DB connection error")
    
    try:
        cursor = conn.cursor()
        import json
        
        # Build query with optional topic filter
        where_clause = ""
        params = []
        if topic:
            where_clause = "WHERE p.topic = %s"
            params.append(topic)
        
        # Get total count
        cursor.execute(f"SELECT COUNT(*) as count FROM informal_posts p {where_clause}", params)
        total = cursor.fetchone()['count']
        
        # Get paginated results
        query = f"""
            SELECT p.*, u.email AS creator_email, u.role AS creator_role
            FROM informal_posts p
            JOIN users u ON p.author_id = u.id
            {where_clause}
            ORDER BY p.created_at DESC
            LIMIT %s OFFSET %s
        """
        params.extend([limit, skip])
        cursor.execute(query, params)
        posts = cursor.fetchall()
        
        # Process savers field
        for post in posts:
            savers = post.get("savers")
            if savers is None or savers == "":
                post["savers"] = []
            else:
                try:
                    if savers.startswith("["):
                        post["savers"] = json.loads(savers)
                    else:
                        post["savers"] = [int(x) for x in savers.split(",") if x.strip().isdigit()]
                except Exception:
                    post["savers"] = []
        
        result = {"data": posts, "total": total, "skip": skip, "limit": limit}
        cache_set(cache_key, result, ttl_seconds=120)  # 2 min cache for dynamic content
        return result
    finally:
        cursor.close()
        return_db_connection(conn)
