import { Box, Container } from "@mui/material";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import PageHeader from "../components/PageHeader";
import CourseGrid from "../components/CourseGrid";

export default function FormalLearning() {
  const formalCourses = [
    {
      title: "Complete Web Development Bootcamp",
      description: "Learn HTML, CSS, JavaScript, React & more",
      icon: "🌐",
      level: "Beginner",
      duration: "12 weeks",
    },
    {
      title: "Data Science Masterclass",
      description: "Python, Machine Learning, and Data Analysis",
      icon: "📊",
      level: "Intermediate",
      duration: "10 weeks",
    },
    {
      title: "Advanced Python Programming",
      description: "Deep dive into Python for professionals",
      icon: "🐍",
      level: "Advanced",
      duration: "8 weeks",
    },
    {
      title: "Cloud Computing with AWS",
      description: "Master AWS services and cloud architecture",
      icon: "☁️",
      level: "Intermediate",
      duration: "10 weeks",
    },
    {
      title: "Mobile App Development",
      description: "React Native & Flutter for iOS & Android",
      icon: "📱",
      level: "Intermediate",
      duration: "12 weeks",
    },
    {
      title: "DevOps & CI/CD Pipeline",
      description: "Docker, Kubernetes, Jenkins & more",
      icon: "🔧",
      level: "Advanced",
      duration: "8 weeks",
    },
    {
      title: "Database Design & SQL",
      description: "SQL, NoSQL, and Database Architecture",
      icon: "🗄️",
      level: "Beginner",
      duration: "6 weeks",
    },
    {
      title: "Cybersecurity Fundamentals",
      description: "Network security, encryption & ethical hacking",
      icon: "🔐",
      level: "Intermediate",
      duration: "10 weeks",
    },
  ];

  return (
    <Box sx={{ display: "flex" }}>
      <Sidebar />
      <Box
        sx={{
          flexGrow: 1,
          ml: { xs: 0, md: 25 },
          mt: { xs: 6, md: 8 },
          background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
          minHeight: "100vh",
          py: 4,
        }}
      >
        <Navbar />

        <Container maxWidth="lg" sx={{ mt: 4 }}>
          <PageHeader
            title="Formal Learning"
            subtitle="Structured, curriculum-driven courses with certifications"
            backgroundGradient="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
          />

          <CourseGrid
            courses={formalCourses}
            title="Available Formal Courses"
            subtitle="Choose from our comprehensive collection of formal learning programs"
          />
        </Container>
      </Box>
    </Box>
  );
}