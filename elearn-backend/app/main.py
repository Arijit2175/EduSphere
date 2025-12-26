from fastapi import FastAPI
from app.api import auth, courses, enrollments, assignments, lessons, attendance, quizzes, resources

app = FastAPI()

app.include_router(auth.router)
app.include_router(courses.router)
app.include_router(enrollments.router)
app.include_router(assignments.router)
app.include_router(lessons.router)
app.include_router(attendance.router)
app.include_router(quizzes.router)
app.include_router(resources.router)

@app.get("/")
def read_root():
    return {"message": "EduSphere Backend API is running!"}
