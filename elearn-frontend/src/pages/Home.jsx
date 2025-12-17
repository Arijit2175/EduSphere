import Navbar from "../components/Navbar";
import HeroSection from "../components/HeroSection";
import CourseCard from "../components/CourseCard";
import AnimatedButton from "../components/AnimatedButton";
import StatsSection from "../components/StatsSection";
import FeaturedCourses from "../components/FeaturedCourses";
import Footer from "../components/Footer";
import { Box, Grid, Container, Typography } from "@mui/material";
import { motion } from "framer-motion";

export default function Home() {
  const learningPaths = [
    {
      title: "Formal Learning",
      link: "/formal",
      description: "Structured, accredited coursework with assessments and certifications.",
      icon: "📚",
    },
    {
      title: "Non-Formal Learning",
      link: "/nonformal",
      description: "Workshops and bootcamps focused on skills with hands-on projects and mentors.",
      icon: "🎯",
    },
    {
      title: "Informal Learning",
      link: "/informal",
      description: "Post your doubts and tips, learn from community opinions, and use AI explanations to understand faster.",
      icon: "💡",
    },
    {
      title: "AI Tutor",
      link: "/ai",
      description: "24/7 AI tutor for instant answers, summaries, and practice guidance.",
      icon: "🤖",
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  return (
    <Box>
      {/* Navbar */}
      <Navbar />

      {/* Main content */}
      <Box
        sx={{
          background: 'var(--color-bg)',
          minHeight: "100vh",
          pt: { xs: 8, md: 10 },
        }}
      >

        {/* Hero Section */}
        <HeroSection
          title="Welcome to EduSphere"
          subtitle="Learn anytime, anywhere. Choose your path to success"
        />

        {/* Main Container */}
        <Container maxWidth="lg" className="section">
          {/* Learning Paths Section */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <Typography
              variant="h4"
              sx={{
                fontWeight: 700,
                mb: 2,
                textAlign: "center",
                color: 'var(--color-text)',
                fontSize: { xs: "1.5rem", md: "2rem" },
              }}
            >
              Choose Your Learning Path
            </Typography>
            <Typography
              variant="body1"
              sx={{
                textAlign: "center",
                color: 'var(--color-muted)',
                mb: 4,
                fontSize: { xs: "0.9rem", md: "1rem" },
              }}
            >
              Select the learning method that works best for you
            </Typography>

            <Grid container spacing={3} sx={{ mt: 1 }}>
              {learningPaths.map((course, index) => (
                <motion.div key={index} variants={itemVariants} style={{ width: "100%" }}>
                  <Grid item xs={12} sm={6} md={3} sx={{ width: "100%" }}>
                    <CourseCard
                      title={course.title}
                      description={course.description}
                      icon={course.icon}
                      sx={{
                        minHeight: 260,
                        borderStyle: "dashed",
                        borderColor: "var(--color-border)",
                        background: "var(--color-surface)",
                        boxShadow: "var(--shadow-sm)",
                        textAlign: "left",
                        alignItems: "flex-start",
                        justifyContent: "flex-start",
                        padding: "20px",
                      }}
                    >
                      <Box sx={{ mt: 1, color: "var(--color-muted)", fontSize: "0.9rem", textAlign: "left" }}>
                        {course.description}
                      </Box>
                    </CourseCard>
                  </Grid>
                </motion.div>
              ))}
            </Grid>
          </motion.div>

          {/* Stats Section */}
          <Box sx={{ mt: 8 }}>
            <StatsSection />
          </Box>

          {/* Featured Courses */}
          <Box sx={{ mt: 8, mb: 8 }}>
            <FeaturedCourses />
          </Box>
        </Container>

        {/* Footer */}
        <Footer />
      </Box>
    </Box>
  );
}

