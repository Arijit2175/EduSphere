-- Database Indexes for Performance Optimization
-- Based on actual table structure from your Supabase database
-- =====================================================
-- FOREIGN KEY INDEXES (Critical for joins)
-- =====================================================
-- Courses table
CREATE INDEX IF NOT EXISTS idx_courses_instructor_id ON courses(instructor_id);
CREATE INDEX IF NOT EXISTS idx_courses_type ON courses(type);
CREATE INDEX IF NOT EXISTS idx_courses_category ON courses(category);
CREATE INDEX IF NOT EXISTS idx_courses_created_at ON courses(created_at DESC);
-- Enrollments table
CREATE INDEX IF NOT EXISTS idx_enrollments_user_id ON enrollments(user_id);
CREATE INDEX IF NOT EXISTS idx_enrollments_course_id ON enrollments(course_id);
CREATE INDEX IF NOT EXISTS idx_enrollments_status ON enrollments(status);
CREATE INDEX IF NOT EXISTS idx_enrollments_enrolled_at ON enrollments(enrolled_at);
-- Lessons table
CREATE INDEX IF NOT EXISTS idx_lessons_course_id ON lessons(course_id);
CREATE INDEX IF NOT EXISTS idx_lessons_order ON lessons(course_id, order_index);
-- Certificates table
CREATE INDEX IF NOT EXISTS idx_certificates_student_id ON certificates(student_id);
CREATE INDEX IF NOT EXISTS idx_certificates_course_id ON certificates(course_id);
CREATE INDEX IF NOT EXISTS idx_certificates_earned_at ON certificates(earned_at);
-- Quiz Questions table
CREATE INDEX IF NOT EXISTS idx_quiz_questions_quiz_id ON quiz_questions(quiz_id);
-- Assignments table
CREATE INDEX IF NOT EXISTS idx_assignments_course_id ON assignments(course_id);
CREATE INDEX IF NOT EXISTS idx_assignments_due_date ON assignments(due_date);
CREATE INDEX IF NOT EXISTS idx_assignments_created_at ON assignments(created_at);
-- Assignment Submissions table
CREATE INDEX IF NOT EXISTS idx_assignment_submissions_assignment_id ON assignment_submissions(assignment_id);
CREATE INDEX IF NOT EXISTS idx_assignment_submissions_enrollment_id ON assignment_submissions(enrollment_id);
CREATE INDEX IF NOT EXISTS idx_assignment_submissions_student_id ON assignment_submissions(student_id);
CREATE INDEX IF NOT EXISTS idx_assignment_submissions_status ON assignment_submissions(status);
CREATE INDEX IF NOT EXISTS idx_assignment_submissions_submitted_at ON assignment_submissions(submitted_at);
-- Attendance table
CREATE INDEX IF NOT EXISTS idx_attendance_schedule_id ON attendance(schedule_id);
CREATE INDEX IF NOT EXISTS idx_attendance_student_id ON attendance(student_id);
CREATE INDEX IF NOT EXISTS idx_attendance_status ON attendance(status);
CREATE INDEX IF NOT EXISTS idx_attendance_marked_at ON attendance(marked_at);
-- AI Tutor Chats table
CREATE INDEX IF NOT EXISTS idx_ai_tutor_chats_student_id ON ai_tutor_chats(student_id);
CREATE INDEX IF NOT EXISTS idx_ai_tutor_chats_started_at ON ai_tutor_chats(started_at);
CREATE INDEX IF NOT EXISTS idx_ai_tutor_chats_last_updated ON ai_tutor_chats(last_updated);
-- Class Schedules table
CREATE INDEX IF NOT EXISTS idx_class_schedules_course_id ON class_schedules(course_id);
CREATE INDEX IF NOT EXISTS idx_class_schedules_start_time ON class_schedules(start_time);
CREATE INDEX IF NOT EXISTS idx_class_schedules_created_at ON class_schedules(created_at);
-- Contact Messages table
CREATE INDEX IF NOT EXISTS idx_contact_messages_email ON contact_messages(email);
CREATE INDEX IF NOT EXISTS idx_contact_messages_created_at ON contact_messages(created_at);
-- Informal Posts table
CREATE INDEX IF NOT EXISTS idx_informal_posts_author_id ON informal_posts(author_id);
CREATE INDEX IF NOT EXISTS idx_informal_posts_created_at ON informal_posts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_informal_posts_updated_at ON informal_posts(updated_at);
CREATE INDEX IF NOT EXISTS idx_informal_posts_topic ON informal_posts(topic);
CREATE INDEX IF NOT EXISTS idx_informal_posts_category ON informal_posts(category);
CREATE INDEX IF NOT EXISTS idx_informal_posts_type ON informal_posts(type);
-- Followed Topics table
CREATE INDEX IF NOT EXISTS idx_followed_topics_user_id ON followed_topics(user_id);
CREATE INDEX IF NOT EXISTS idx_followed_topics_topic_id ON followed_topics(topic_id);
CREATE INDEX IF NOT EXISTS idx_followed_topics_created_at ON followed_topics(created_at);
-- =====================================================
-- COMPOSITE INDEXES (For common query patterns)
-- =====================================================
-- Enrollment lookup by user and course
CREATE INDEX IF NOT EXISTS idx_enrollments_user_course ON enrollments(user_id, course_id);
-- Course with type and category
CREATE INDEX IF NOT EXISTS idx_courses_type_category ON courses(type, category);
-- Informal posts by topic and time
CREATE INDEX IF NOT EXISTS idx_informal_posts_topic_time ON informal_posts(topic, created_at DESC);
-- Assignment submissions by assignment and student
CREATE INDEX IF NOT EXISTS idx_assignment_submissions_assignment_student ON assignment_submissions(assignment_id, student_id);
-- =====================================================
-- TEXT SEARCH INDEXES (For search functionality)
-- =====================================================
-- Course search
CREATE INDEX IF NOT EXISTS idx_courses_title ON courses(title);
-- Contact messages search
CREATE INDEX IF NOT EXISTS idx_contact_messages_name ON contact_messages(name);
-- Informal posts search
CREATE INDEX IF NOT EXISTS idx_informal_posts_title ON informal_posts(title);
-- =====================================================
-- ANALYZE TABLE STATISTICS
-- =====================================================
-- Run these to update table statistics for query optimizer
ANALYZE courses;
ANALYZE enrollments;
ANALYZE lessons;
ANALYZE certificates;
ANALYZE quiz_questions;
ANALYZE assignments;
ANALYZE assignment_submissions;
ANALYZE attendance;
ANALYZE ai_tutor_chats;
ANALYZE class_schedules;
ANALYZE contact_messages;
ANALYZE informal_posts;
ANALYZE followed_topics;