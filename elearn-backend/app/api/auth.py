from fastapi import APIRouter, HTTPException, status, Depends, Request
from fastapi.security import OAuth2PasswordRequestForm
from passlib.context import CryptContext
from jose import jwt, JWTError
from datetime import datetime, timedelta
from slowapi import Limiter
from slowapi.util import get_remote_address
from app.db import get_db_connection, return_db_connection, cache_get, cache_set
from app.core.config import SECRET_KEY, ALGORITHM, RATE_LIMIT_AUTH_PER_MINUTE
from app.core.security import (
    sanitize_string, 
    validate_email, 
    validate_password
)
from fastapi.security import OAuth2PasswordBearer

limiter = Limiter(key_func=get_remote_address)

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")
def get_current_user(token: str = Depends(oauth2_scheme)):
    credentials_exception = HTTPException(
        status_code=401,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: str = payload.get("sub")
        if user_id is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception

    if payload.get("role") and ("student_id" in payload) and ("teacher_id" in payload):
        return {
            "id": int(user_id),
            "role": payload.get("role"),
            "student_id": payload.get("student_id"),
            "teacher_id": payload.get("teacher_id"),
            "email": payload.get("email"),
            "first_name": payload.get("first_name"),
            "last_name": payload.get("last_name"),
        }

    cache_key = f"auth_user:{user_id}"
    cached_user = cache_get(cache_key)
    if cached_user:
        return cached_user

    conn = get_db_connection()
    if not conn:
        raise HTTPException(status_code=500, detail="DB connection error")
    cursor = conn.cursor()
    try:
        cursor.execute("SELECT * FROM users WHERE id=%s", (user_id,))
        user = cursor.fetchone()
    finally:
        cursor.close()
        return_db_connection(conn)

    if user is None:
        raise credentials_exception

    cache_set(cache_key, user, ttl_seconds=60)
    return user
router = APIRouter(prefix="/auth", tags=["auth"])

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    return pwd_context.hash(password[:72])

def create_access_token(data: dict, expires_delta: timedelta = timedelta(hours=2)):
    to_encode = data.copy()
    expire = datetime.utcnow() + expires_delta
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)



from fastapi import Request

@router.post("/register")
@limiter.limit(f"{RATE_LIMIT_AUTH_PER_MINUTE}/minute")
async def register(request: Request):
    data = await request.json()
    first_name = sanitize_string(data.get("first_name", ""), max_length=100)
    last_name = sanitize_string(data.get("last_name", ""), max_length=100)
    email = validate_email(data.get("email", ""))
    password = validate_password(data.get("password", ""))
    role = data.get("role", "student")
    
    if not all([first_name, last_name, email, password]):
        raise HTTPException(status_code=400, detail="All fields are required")
    
    if role not in ["student", "teacher"]:
        raise HTTPException(status_code=400, detail="Invalid role")
    
    conn = get_db_connection()
    if not conn:
        raise HTTPException(status_code=500, detail="DB connection error")
    cursor = conn.cursor()
    cursor.execute("SELECT id FROM users WHERE email=%s", (email,))
    if cursor.fetchone():
        cursor.close()
        return_db_connection(conn)
        raise HTTPException(status_code=400, detail="Email already registered")
    print(f"[DEBUG] Received password: {password!r} (length: {len(password)})")
    if len(password) > 72:
        raise HTTPException(status_code=400, detail="Password must be 72 characters or fewer.")
    hashed = get_password_hash(password)
    student_id = None
    teacher_id = None
    if role == "student":
        cursor.execute(
            "INSERT INTO students (first_name, last_name, email, password_hash) VALUES (%s, %s, %s, %s) RETURNING id",
            (first_name, last_name, email, hashed)
        )
        student_id = cursor.fetchone()['id']
    elif role == "teacher":
        cursor.execute(
            "INSERT INTO teachers (first_name, last_name, email, password_hash) VALUES (%s, %s, %s, %s) RETURNING id",
            (first_name, last_name, email, hashed)
        )
        teacher_id = cursor.fetchone()['id']
    cursor.execute(
        "INSERT INTO users (email, password_hash, role, student_id, teacher_id, first_name, last_name) VALUES (%s, %s, %s, %s, %s, %s, %s) RETURNING id",
        (email, hashed, role, student_id, teacher_id, first_name, last_name)
    )
    user_id = cursor.fetchone()['id']
    conn.commit()
    cursor.close()
    return_db_connection(conn)
    return {"id": user_id, "email": email, "role": role}

from fastapi import Request


@router.post("/login")
@limiter.limit(f"{RATE_LIMIT_AUTH_PER_MINUTE}/minute")
async def login(request: Request):
    data = await request.json()
    email = validate_email(data.get("email", ""))
    password = data.get("password", "")
    role = data.get("role", "")
    
    if not email or not password or not role:
        raise HTTPException(status_code=400, detail="Email, password, and role required")
    
    if role not in ["student", "teacher"]:
        raise HTTPException(status_code=400, detail="Invalid role")
    
    conn = get_db_connection()
    if not conn:
        raise HTTPException(status_code=500, detail="DB connection error")
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM users WHERE email=%s", (email,))
    user = cursor.fetchone()
    cursor.close()
    return_db_connection(conn)
    if not user or not verify_password(password, user["password_hash"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    if user["role"] != role:
        raise HTTPException(status_code=403, detail=f"No {role} account found with these credentials.")
    access_token = create_access_token({
        "sub": str(user["id"]),
        "role": user["role"],
        "student_id": user.get("student_id"),
        "teacher_id": user.get("teacher_id"),
        "email": user.get("email"),
        "first_name": user.get("first_name"),
        "last_name": user.get("last_name"),
    })
    return {"access_token": access_token, "token_type": "bearer"}