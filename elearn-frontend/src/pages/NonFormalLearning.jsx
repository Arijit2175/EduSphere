import { Box, Container } from "@mui/material";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import PageHeader from "../components/PageHeader";
import CourseGrid from "../components/CourseGrid";

export default function NonFormalLearning() {
  const nonFormalCourses = [
    {
      title: "UI/UX Design Bootcamp",
      description: "Become a professional designer in 8 weeks",
      icon: "🎨",
      level: "Beginner",
      duration: "8 weeks",
    },
    {
      title: "Digital Marketing Masterclass",
      description: "SEO, Social Media, and Content Marketing",
      icon: "📢",
      level: "Beginner",
      duration: "6 weeks",
    },
    {
      title: "Entrepreneurship Intensive",
      description: "From idea to market in 4 weeks",
      icon: "🚀",
      level: "All Levels",
      duration: "4 weeks",
    },
    {
      title: "Video Production Workshop",
      description: "Create professional videos from scratch",
      icon: "🎬",
      level: "Beginner",
      duration: "5 weeks",
    },
    {
      title: "Graphic Design Bootcamp",
      description: "Adobe Creative Suite mastery",
      icon: "✏️",
      level: "Beginner",
      duration: "8 weeks",
    },
    {
      title: "Content Writing Intensive",
      description: "Master copywriting and storytelling",
      icon: "📝",
      level: "Beginner",
      duration: "6 weeks",
    },
    {
      title: "SEO & SEM Workshop",
      description: "Organic and paid search optimization",
      icon: "🔍",
      level: "Intermediate",
      duration: "4 weeks",
    },
    {
      title: "Email Marketing Bootcamp",
      description: "Build and optimize email campaigns",
      icon: "📧",
      level: "Beginner",
      duration: "3 weeks",
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
            title="Non-Formal Learning"
            subtitle="Flexible, skill-focused workshops and bootcamps"
            backgroundGradient="linear-gradient(135deg, #f093fb 0%, #f5576c 100%)"
          />

          <CourseGrid
            courses={nonFormalCourses}
            title="Available Workshops & Bootcamps"
            subtitle="Quick skills, quick results. Learn in intensive workshops"
          />
        </Container>
      </Box>
    </Box>
  );
}