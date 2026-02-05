
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
from starlette.middleware.base import BaseHTTPMiddleware

from app.api import auth, courses, enrollments, assignments, lessons, attendance, quizzes, resources, certificates, ai_tutor_chats, ai_tutor, class_schedules, contact_messages, nonformal, user, forgot_password, informal_posts, topics, code_execution
from app.core.config import RATE_LIMIT_PER_MINUTE
from app.db import get_db_connection, close_pool

limiter = Limiter(key_func=get_remote_address)

app = FastAPI()

app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)


class SecurityHeadersMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        response = await call_next(request)
        
        response.headers["X-Content-Type-Options"] = "nosniff"
        response.headers["X-Frame-Options"] = "DENY"
        response.headers["X-XSS-Protection"] = "1; mode=block"
        response.headers["Strict-Transport-Security"] = "max-age=31536000; includeSubDomains"
        response.headers["Content-Security-Policy"] = "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:;"
        response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
        response.headers["Permissions-Policy"] = "geolocation=(), microphone=(), camera=()"
        
        return response

app.add_middleware(SecurityHeadersMiddleware)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:5174",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:5174",
        "https://edu-sphere-iota.vercel.app",
    ],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["Content-Type", "Authorization"],
    expose_headers=["Content-Type", "X-Process-Time"]
)

app.include_router(auth.router)
app.include_router(user.router)
app.include_router(forgot_password.router)
app.include_router(courses.router)
app.include_router(enrollments.router)
app.include_router(assignments.router)
app.include_router(lessons.router)
app.include_router(attendance.router)
app.include_router(quizzes.router)
app.include_router(resources.router)
app.include_router(certificates.router)
app.include_router(ai_tutor_chats.router)
app.include_router(ai_tutor.router)
app.include_router(class_schedules.router)
app.include_router(contact_messages.router)
app.include_router(nonformal.router)
app.include_router(informal_posts.router)
app.include_router(code_execution.router)

app.include_router(topics.router)

def reset_sequences():
    """Reset all primary key sequences to prevent duplicate key errors"""
    conn = get_db_connection()
    if not conn:
        print("Warning: Could not reset sequences - DB connection failed")
        return
    cursor = conn.cursor()
    try:
        sequences = [
            ("courses", "courses_id_seq"),
            ("enrollments", "enrollments_id_seq"),
            ("assignments", "assignments_id_seq"),
            ("quizzes", "quizzes_id_seq"),
            ("lessons", "lessons_id_seq"),
            ("resources", "resources_id_seq"),
            ("informal_posts", "informal_posts_id_seq"),
        ]
        for table_name, seq_name in sequences:
            cursor.execute(f"SELECT setval('{seq_name}', (SELECT COALESCE(MAX(id), 0) FROM {table_name}) + 1)")
        conn.commit()
        print("✓ Database sequences reset successfully")
    except Exception as e:
        print(f"Warning: Error resetting sequences: {e}")
    finally:
        cursor.close()
        conn.close()

@app.on_event("startup")
async def startup_event():
    """Initialize sequences on app startup"""
    reset_sequences()

@app.on_event("shutdown")
async def shutdown_event():
    """Close database pool on shutdown"""
    close_pool()

@app.get("/")
@limiter.limit(f"{RATE_LIMIT_PER_MINUTE}/minute")
async def read_root(request: Request):
    return {"message": "EduSphere Backend API is running!"}

