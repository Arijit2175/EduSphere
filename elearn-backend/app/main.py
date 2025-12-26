from fastapi import FastAPI
from app.api import auth, courses

app = FastAPI()

app.include_router(auth.router)
app.include_router(courses.router)

@app.get("/")
def read_root():
    return {"message": "EduSphere Backend API is running!"}
