import Navbar from "../components/Navbar";
import HeroSection from "../components/HeroSection";
import CourseCard from "../components/CourseCard";
import AnimatedButton from "../components/AnimatedButton";
import StatsSection from "../components/StatsSection";
import FeaturedCourses from "../components/FeaturedCourses";
import Footer from "../components/Footer";
import BackgroundVideo from "../components/BackgroundVideo";
import { Box, Grid, Container, Typography } from "@mui/material";
import { motion } from "framer-motion";

export default function Home() {
  const learningPaths = [
    {
      title: "Formal Learning",
      link: "/formal",
      description: "Structured, accredited coursework with assessments and attendance monitoring.",
      icon: "📚",
    },
    {
      title: "Non-Formal Learning",
      link: "/nonformal",
      description: "Workshops and courses focused on skills with hands-on lessons and certifications.",
      icon: "🎯",
    },
    {
      title: "Informal Learning",
      link: "/informal",
      description: "Post your doubts, tips and learn from community opinions to understand faster.",
      icon: "💡",
    },
    {
      title: "Lumina",
      link: "/ai",
      description: "24/7 AI tutor for instant answers, summaries and practice guidance.",
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
    <Box sx={{ position: "relative", width: "100%", minHeight: "100vh" }}>
      {/* Background Video - Optimized for fast loading */}
      <BackgroundVideo src="/videos/bg-video.mp4" blur="2px" overlay={0.08} />

      {/* All Content - On Top */}
      <Box sx={{ position: "relative", zIndex: 1 }}>
        {/* Navbar */}
        <Navbar />

        {/* Main content */}
        <Box
          sx={{
            background: 'transparent',
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
        <Container maxWidth="lg" className="section" sx={{ backdropFilter: "blur(3px)", py: 4, borderRadius: 2 }}>
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
                fontWeight: 800,
                mb: 2,
                textAlign: "center",
                color: '#ffffff',
                fontSize: { xs: "1.5rem", md: "2rem" },
              }}
            >
              Choose Your Learning Path
            </Typography>
            <Typography
              variant="body1"
              sx={{
                textAlign: "center",
                color: '#ffffff',
                mb: 4,
                fontSize: { xs: "0.9rem", md: "1rem" },
                fontWeight: 600,
              }}
            >
              Select the learning method that works best for you
            </Typography>

            <Grid container spacing={3} sx={{ mt: 1, maxWidth: "900px", mx: "auto" }} justifyContent="center">
              {learningPaths.map((course, index) => (
                <motion.div key={index} variants={itemVariants} style={{ width: "100%" }}>
                  <Grid item xs={12} sm={6} md={3} sx={{ width: "100%" }}>
                    <CourseCard
                      title={course.title}
                      description={course.description}
                      icon={course.icon}
                      sx={{
                        minHeight: 180,
                        borderStyle: "dashed",
                        borderColor: "rgba(102, 126, 234, 0.3)",
                        background: "linear-gradient(135deg, #ffffff 0%, #e8dff5 100%)",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                        textAlign: "center",
                        alignItems: "center",
                        justifyContent: "center",
                        position: "relative",
                        overflow: "hidden",
                        transition: "all 0.25s ease-out",
                        willChange: "transform",
                        backfaceVisibility: "hidden",
                        transform: "translateZ(0)",
                        "&::before": {
                          content: '""',
                          position: "absolute",
                          top: 0,
                          left: 0,
                          right: 0,
                          height: "3px",
                          background: "linear-gradient(90deg, #667eea 0%, #7a5bff 50%, transparent 100%)",
                          opacity: 0.75,
                        },
                        "&:hover": {
                          transform: "translateY(-6px) translateZ(0)",
                          boxShadow: "0 12px 24px rgba(102, 126, 234, 0.2)",
                          borderColor: "rgba(122, 91, 255, 0.5)",
                        },
                        "& .MuiCardContent-root": {
                          p: 2.25,
                          gap: 1.25,
                          alignItems: "center",
                          justifyContent: "center",
                        },
                      }}
                    />
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
        <Footer disableAnimations />
        </Box>
      </Box>
    </Box>
  );
}

