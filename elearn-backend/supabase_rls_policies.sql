-- Enable RLS on all tables
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE teachers ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE assignment_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE certificates ENABLE ROW LEVEL SECURITY;
ALTER TABLE quizzes ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE class_schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_tutor_chats ENABLE ROW LEVEL SECURITY;
ALTER TABLE informal_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE topics ENABLE ROW LEVEL SECURITY;
ALTER TABLE followed_topics ENABLE ROW LEVEL SECURITY;
-- Create permissive policies for backend access
-- Since your FastAPI backend handles all authentication and authorization,
-- these policies allow service role access (your backend connection)
-- Students policies
CREATE POLICY "Allow service role full access" ON students FOR ALL USING (true);
-- Teachers policies
CREATE POLICY "Allow service role full access" ON teachers FOR ALL USING (true);
-- Users policies
CREATE POLICY "Allow service role full access" ON users FOR ALL USING (true);
-- Courses policies
CREATE POLICY "Allow service role full access" ON courses FOR ALL USING (true);
-- Enrollments policies
CREATE POLICY "Allow service role full access" ON enrollments FOR ALL USING (true);
-- Lessons policies
CREATE POLICY "Allow service role full access" ON lessons FOR ALL USING (true);
-- Resources policies
CREATE POLICY "Allow service role full access" ON resources FOR ALL USING (true);
-- Assignments policies
CREATE POLICY "Allow service role full access" ON assignments FOR ALL USING (true);
-- Assignment Submissions policies
CREATE POLICY "Allow service role full access" ON assignment_submissions FOR ALL USING (true);
-- Certificates policies
CREATE POLICY "Allow service role full access" ON certificates FOR ALL USING (true);
-- Quizzes policies
CREATE POLICY "Allow service role full access" ON quizzes FOR ALL USING (true);
-- Quiz Questions policies
CREATE POLICY "Allow service role full access" ON quiz_questions FOR ALL USING (true);
-- Quiz Submissions policies
CREATE POLICY "Allow service role full access" ON quiz_submissions FOR ALL USING (true);
-- Class Schedules policies
CREATE POLICY "Allow service role full access" ON class_schedules FOR ALL USING (true);
-- Attendance policies
CREATE POLICY "Allow service role full access" ON attendance FOR ALL USING (true);
-- Contact Messages policies
CREATE POLICY "Allow service role full access" ON contact_messages FOR ALL USING (true);
-- AI Tutor Chats policies
CREATE POLICY "Allow service role full access" ON ai_tutor_chats FOR ALL USING (true);
-- Informal Posts policies
CREATE POLICY "Allow service role full access" ON informal_posts FOR ALL USING (true);
-- Topics policies
CREATE POLICY "Allow service role full access" ON topics FOR ALL USING (true);
-- Followed Topics policies
CREATE POLICY "Allow service role full access" ON followed_topics FOR ALL USING (true);