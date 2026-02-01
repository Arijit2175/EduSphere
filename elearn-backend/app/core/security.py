"""
Security utilities for input validation and sanitization
Following OWASP best practices
"""
import re
import bleach
from fastapi import HTTPException
from typing import Optional

ALLOWED_TAGS = []
ALLOWED_ATTRIBUTES = {}

def sanitize_string(text: str, max_length: int = 10000) -> str:
    """
    Sanitize string input to prevent XSS attacks
    """
    if not text:
        return text
    
    if len(text) > max_length:
        raise HTTPException(status_code=400, detail=f"Input too long (max {max_length} characters)")
    
    sanitized = bleach.clean(text, tags=ALLOWED_TAGS, attributes=ALLOWED_ATTRIBUTES, strip=True)
    
    return sanitized.strip()

def validate_email(email: str) -> str:
    """
    Validate email format
    """
    email_regex = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    if not re.match(email_regex, email):
        raise HTTPException(status_code=400, detail="Invalid email format")
    return email.lower().strip()

def validate_url(url: str) -> str:
    """
    Validate URL format and prevent SSRF attacks
    """
    if not url:
        return url

    url = url.strip()

    if url.startswith("data:"):
        if len(url) > 10_000_000:
            raise HTTPException(status_code=400, detail="Data URL too large")
        data_url_regex = r'^data:(application/pdf|image/(png|jpeg|jpg|gif));base64,[A-Za-z0-9+/=\s]+$'
        if not re.match(data_url_regex, url):
            raise HTTPException(status_code=400, detail="Invalid data URL format")
        return url

    url_regex = r'^https?://[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}(/.*)?$'
    if not re.match(url_regex, url):
        raise HTTPException(status_code=400, detail="Invalid URL format")
    
    dangerous_patterns = [
        r'localhost',
        r'127\.0\.0\.1',
        r'0\.0\.0\.0',
        r'192\.168\.',
        r'10\.',
        r'172\.(1[6-9]|2[0-9]|3[01])\.'
    ]
    
    for pattern in dangerous_patterns:
        if re.search(pattern, url.lower()):
            raise HTTPException(status_code=400, detail="URL points to internal network")

    return url

def validate_course_id(course_id: int) -> int:
    """
    Validate course ID is positive integer
    """
    if course_id <= 0:
        raise HTTPException(status_code=400, detail="Invalid course ID")
    return course_id

def validate_user_id(user_id: int) -> int:
    """
    Validate user ID is positive integer
    """
    if user_id <= 0:
        raise HTTPException(status_code=400, detail="Invalid user ID")
    return user_id

def validate_password(password: str) -> str:
    """
    Validate password strength
    """
    if len(password) < 8:
        raise HTTPException(status_code=400, detail="Password must be at least 8 characters")
    
    if len(password) > 128:
        raise HTTPException(status_code=400, detail="Password too long (max 128 characters)")
    
    if not re.search(r'[0-9]', password):
        raise HTTPException(status_code=400, detail="Password must contain at least one number")
    
    if not re.search(r'[a-zA-Z]', password):
        raise HTTPException(status_code=400, detail="Password must contain at least one letter")
    
    return password

def validate_username(username: str) -> str:
    """
    Validate username format
    """
    if len(username) < 3:
        raise HTTPException(status_code=400, detail="Username must be at least 3 characters")
    
    if len(username) > 50:
        raise HTTPException(status_code=400, detail="Username too long (max 50 characters)")
    
    if not re.match(r'^[a-zA-Z0-9_-]+$', username):
        raise HTTPException(status_code=400, detail="Username can only contain letters, numbers, underscores, and hyphens")
    
    return username.strip()

def check_teacher_role(user: dict):
    """
    Verify user has teacher role
    """
    if user.get("role") != "teacher":
        raise HTTPException(status_code=403, detail="Only teachers can perform this action")

def check_student_role(user: dict):
    """
    Verify user has student role
    """
    if user.get("role") != "student":
        raise HTTPException(status_code=403, detail="Only students can perform this action")
