from fastapi import FastAPI
from app.api import auth, courses, enrollments, assignments, lessons, attendance, quizzes, resources, certificates, ai_tutor_chats, class_schedules, contact_messages

app = FastAPI()

app.include_router(auth.router)
app.include_router(courses.router)
app.include_router(enrollments.router)
app.include_router(assignments.router)
app.include_router(lessons.router)
app.include_router(attendance.router)
app.include_router(quizzes.router)
app.include_router(resources.router)
app.include_router(certificates.router)
app.include_router(ai_tutor_chats.router)
app.include_router(class_schedules.router)
app.include_router(contact_messages.router)

@app.get("/")
def read_root():
    return {"message": "EduSphere Backend API is running!"}
