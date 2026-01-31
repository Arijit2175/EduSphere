-- Insert courses
INSERT INTO courses (id, title, description, type, category, level, duration, instructor_id, thumbnail, rating, reviews, paid)
VALUES
  (1, 'Python Basics for Beginners', 'Learn Python fundamentals from scratch', 'non-formal', 'Tech Skills', 'Beginner', '4 weeks', NULL, '🐍', 4.8, 342, 0),
  (2, 'Digital Marketing 101', 'Master the basics of digital marketing', 'non-formal', 'Career Skills', 'Beginner', '3 weeks', NULL, '📢', 4.6, 215, 0),
  (3, 'UI/UX Design Fundamentals', 'Create stunning user interfaces and experiences', 'non-formal', 'Creative Skills', 'Beginner', '5 weeks', NULL, '🎨', 4.7, 298, 0),
  (4, 'English Conversation Skills', 'Improve your spoken English fluency', 'non-formal', 'Language Skills', 'Intermediate', '6 weeks', NULL, '🗣️', 4.5, 189, 0),
  (5, 'JavaScript Essentials', 'Master JavaScript from zero to hero', 'non-formal', 'Tech Skills', 'Beginner', '4 weeks', NULL, '⚙️', 4.9, 512, 0),
  (6, 'Startup Essentials', 'Turn your idea into a successful startup', 'non-formal', 'Entrepreneurship', 'Intermediate', '3 weeks', NULL, '🚀', 4.4, 156, 0),
  (7, 'Meditation & Mindfulness', 'Reduce stress and improve mental clarity', 'non-formal', 'Personal Growth', 'Beginner', '2 weeks', NULL, '🧘', 4.7, 278, 0);

-- Insert resources
INSERT INTO resources (course_id, name, url, type) VALUES
  (1, 'Python_Cheatsheet.pdf', '#', 'pdf'),
  (2, 'Marketing_Toolkit.pdf', '#', 'pdf'),
  (3, 'Design_Resources.pdf', '#', 'pdf'),
  (4, 'Speaking_Guide.pdf', '#', 'pdf'),
  (5, 'JS_Cheatsheet.pdf', '#', 'pdf'),
  (6, 'Startup_Guide.pdf', '#', 'pdf'),
  (7, 'Mindfulness_Guide.pdf', '#', 'pdf');

-- Insert lessons
INSERT INTO lessons (course_id, title, content, video_url, order_index) VALUES
  (1, 'Introduction to Python', 'Intro to Python basics', 'https://www.youtube.com/embed/xkZMUX_oQX4', 1),
  (1, 'Variables & Data Types', 'Learn about variables and data types', 'https://www.youtube.com/embed/LKFrQXaoSMQ', 2),
  (1, 'Control Flow', 'Control flow in Python', 'https://www.youtube.com/embed/FvMPfrgGeKs', 3),

  (2, 'What is Digital Marketing?', 'Overview of digital marketing', 'https://www.youtube.com/embed/RNh8VHc8qkk', 1),
  (2, 'SEO Fundamentals', 'SEO basics', 'https://www.youtube.com/embed/MYE6T_gd7H0', 2),
  (2, 'Social Media Strategy', 'Social media for marketing', 'https://www.youtube.com/embed/VS0Sao1oHlw', 3),

  (3, 'Design Principles', 'UI/UX design principles', 'https://www.youtube.com/embed/9EPTM91TBDU', 1),
  (3, 'Wireframing & Prototyping', 'Wireframing and prototyping in Figma', 'https://www.youtube.com/embed/qpH7-KFWZRI', 2),
  (3, 'Typography & Color', 'Typography and color in design', 'https://www.youtube.com/embed/9-oefwZ6Z74', 3),

  (4, 'Pronunciation Basics', 'Improve pronunciation', 'https://www.youtube.com/embed/ugppjNn8uIE', 1),
  (4, 'Common Phrases', 'Common English phrases', 'https://www.youtube.com/embed/bj5btO2nvt8', 2),
  (4, 'Fluent Speaking', 'Fluency in English', 'https://www.youtube.com/embed/dWmUsWorYh0', 3),

  (5, 'JS Basics', 'JavaScript basics', 'https://www.youtube.com/embed/VoKFyB1q4fc', 1),
  (5, 'DOM Manipulation', 'Manipulating the DOM', 'https://www.youtube.com/embed/y17RuWkWdn8', 2),
  (5, 'Async JavaScript', 'Asynchronous JS', 'https://www.youtube.com/embed/9j1dZwFEJ-c', 3),

  (6, 'Ideation & Validation', 'Startup ideation and validation', 'https://www.youtube.com/embed/Th8JoIan4dg', 1),
  (6, 'Business Model', 'Business model basics', 'https://www.youtube.com/embed/IP0cUBWTgpY', 2),
  (6, 'Pitching Your Idea', 'How to pitch your idea', 'https://www.youtube.com/embed/l0hVIH3EnlQ', 3),

  (7, 'Introduction to Meditation', 'Intro to meditation', 'https://www.youtube.com/embed/o-kMJBWk9E0', 1),
  (7, 'Daily Mindfulness', 'Daily mindfulness practices', 'https://www.youtube.com/embed/7CBfCW67xT8', 2),
  (7, 'Advanced Techniques', 'Advanced meditation techniques', 'https://www.youtube.com/embed/5yfIOtOBMBo', 3);

UPDATE courses SET instructor = 'Tech Academy' WHERE id = 1;
UPDATE courses SET instructor = 'Marketing Masters' WHERE id = 2;
UPDATE courses SET instructor = 'Design School' WHERE id = 3;
UPDATE courses SET instructor = 'English Plus' WHERE id = 4;
UPDATE courses SET instructor = 'Code Academy' WHERE id = 5;
UPDATE courses SET instructor = 'Startup Hub' WHERE id = 6;
UPDATE courses SET instructor = 'Wellness Academy' WHERE id = 7;

INSERT INTO topics (name) VALUES
  ('Tech'),
  ('Arts'),
  ('Science'),
  ('Soft skills'),
  ('Daily learning tips');