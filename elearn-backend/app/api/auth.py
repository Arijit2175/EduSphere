from fastapi import APIRouter, HTTPException, status, Depends, Request
from fastapi.security import OAuth2PasswordRequestForm
from passlib.context import CryptContext
from jose import jwt, JWTError
from datetime import datetime, timedelta
from app.db import get_db_connection
from app.core.config import SECRET_KEY, ALGORITHM
from fastapi.security import OAuth2PasswordBearer

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
    conn = get_db_connection()
    if not conn:
        raise HTTPException(status_code=500, detail="DB connection error")
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT * FROM users WHERE id=%s", (user_id,))
    user = cursor.fetchone()
    cursor.close()
    conn.close()
    if user is None:
        raise credentials_exception
    return user
router = APIRouter(prefix="/auth", tags=["auth"])

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Utility functions

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    return pwd_context.hash(password)

def create_access_token(data: dict, expires_delta: timedelta = timedelta(hours=2)):
    to_encode = data.copy()
    expire = datetime.utcnow() + expires_delta
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)


# Registration endpoint

from fastapi import Request

@router.post("/register")
async def register(request: Request):
    data = await request.json()
    first_name = data.get("first_name")
    last_name = data.get("last_name")
    email = data.get("email")
    password = data.get("password")
    role = data.get("role", "student")
    if not all([first_name, last_name, email, password]):
        raise HTTPException(status_code=400, detail="All fields are required")
    conn = get_db_connection()
    if not conn:
        raise HTTPException(status_code=500, detail="DB connection error")
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT id FROM users WHERE email=%s", (email,))
    if cursor.fetchone():
        raise HTTPException(status_code=400, detail="Email already registered")
    hashed = get_password_hash(password)
    student_id = None
    teacher_id = None
    if role == "student":
        cursor.execute(
            "INSERT INTO students (first_name, last_name, email, password_hash) VALUES (%s, %s, %s, %s)",
            (first_name, last_name, email, hashed)
        )
        student_id = cursor.lastrowid
    elif role == "teacher":
        cursor.execute(
            "INSERT INTO teachers (first_name, last_name, email, password_hash) VALUES (%s, %s, %s, %s)",
            (first_name, last_name, email, hashed)
        )
        teacher_id = cursor.lastrowid
    else:
        raise HTTPException(status_code=400, detail="Invalid role")
    cursor.execute(
        "INSERT INTO users (email, password_hash, role, student_id, teacher_id) VALUES (%s, %s, %s, %s, %s)",
        (email, hashed, role, student_id, teacher_id)
    )
    user_id = cursor.lastrowid
    conn.commit()
    cursor.close()
    conn.close()
    return {"id": user_id, "email": email, "role": role}

# Login endpoint
from fastapi import Request


@router.post("/login")
async def login(request: Request):
    data = await request.json()
    email = data.get("email")
    password = data.get("password")
    role = data.get("role")
    if not email or not password or not role:
        raise HTTPException(status_code=400, detail="Email, password, and role required")
    conn = get_db_connection()
    if not conn:
        raise HTTPException(status_code=500, detail="DB connection error")
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT * FROM users WHERE email=%s", (email,))
    user = cursor.fetchone()
    cursor.close()
    conn.close()
    if not user or not verify_password(password, user["password_hash"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    if user["role"] != role:
        raise HTTPException(status_code=403, detail=f"No {role} account found with these credentials.")
    access_token = create_access_token({"sub": str(user["id"]), "role": user["role"]})
    return {"access_token": access_token, "token_type": "bearer"}
