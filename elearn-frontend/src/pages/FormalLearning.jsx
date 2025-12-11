import { Box, Grid, Container } from "@mui/material";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import PageHeader from "../components/PageHeader";
import Section from "../components/Section";
import SectionTitle from "../components/SectionTitle";
import CourseCardAdvanced from "../components/CourseCardAdvanced";

export default function FormalLearning() {
  const formalCourses = [
    {
      title: "Complete Web Development Bootcamp",
      description: "Learn HTML, CSS, JavaScript, React & more from scratch",
      icon: "🌐",
      level: "Beginner",
      duration: "12 weeks",
      category: "Formal Learning",
      rating: 4.8,
      students: "3,450",
    },
    {
      title: "Data Science Masterclass",
      description: "Python, Machine Learning, and Data Analysis",
      icon: "📊",
      level: "Intermediate",
      duration: "10 weeks",
      category: "Formal Learning",
      rating: 4.9,
      students: "5,200",
    },
    {
      title: "Advanced Python Programming",
      description: "Deep dive into Python for professionals",
      icon: "🐍",
      level: "Advanced",
      duration: "8 weeks",
      category: "Formal Learning",
      rating: 4.7,
      students: "2,100",
    },
    {
      title: "Cloud Computing with AWS",
      description: "Master AWS services and cloud architecture",
      icon: "☁️",
      level: "Intermediate",
      duration: "10 weeks",
      category: "Formal Learning",
      rating: 4.6,
      students: "3,800",
    },
    {
      title: "Mobile App Development",
      description: "React Native & Flutter for iOS & Android",
      icon: "📱",
      level: "Intermediate",
      duration: "12 weeks",
      category: "Formal Learning",
      rating: 4.8,
      students: "2,900",
    },
    {
      title: "DevOps & CI/CD Pipeline",
      description: "Docker, Kubernetes, Jenkins & more",
      icon: "🔧",
      level: "Advanced",
      duration: "8 weeks",
      category: "Formal Learning",
      rating: 4.5,
      students: "1,650",
    },
    {
      title: "Database Design & SQL",
      description: "SQL, NoSQL, and Database Architecture",
      icon: "🗄️",
      level: "Beginner",
      duration: "6 weeks",
      category: "Formal Learning",
      rating: 4.7,
      students: "4,100",
    },
    {
      title: "Cybersecurity Fundamentals",
      description: "Network security, encryption & ethical hacking",
      icon: "🔐",
      level: "Intermediate",
      duration: "10 weeks",
      category: "Formal Learning",
      rating: 4.6,
      students: "2,450",
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
          background: "linear-gradient(135deg, #f8f9fa 0%, #f0f2f5 100%)",
          minHeight: "100vh",
        }}
      >
        <Navbar />

        {/* Page Header */}
        <Section background="transparent" pt={4} pb={2} animated={false}>
          <PageHeader
            title="Formal Learning"
            subtitle="Structured, curriculum-driven courses with certifications"
            backgroundGradient="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
          />
        </Section>

        {/* Courses Grid */}
        <Section background="transparent" py={{ xs: 4, md: 6 }}>
          <SectionTitle
            title="Available Formal Courses"
            subtitle="Choose from our comprehensive collection of formal learning programs"
            centered
          />
          
          <Container maxWidth="lg">
            <Grid container spacing={3}>
              {formalCourses.map((course, i) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={i}>
                  <CourseCardAdvanced
                    title={course.title}
                    description={course.description}
                    icon={course.icon}
                    category={course.category}
                    level={course.level}
                    duration={course.duration}
                    rating={course.rating}
                    students={course.students}
                    actionText="Enroll Now"
                  />
                </Grid>
              ))}
            </Grid>
          </Container>
        </Section>
      </Box>
    </Box>
  );
}