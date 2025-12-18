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
    <Box sx={{ position: "relative", width: "100%", minHeight: "100vh" }}>
      {/* Background Video - Behind Everything */}
      <Box
        sx={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundColor: "#1a1a2e",
          zIndex: -10,
          pointerEvents: "none",
        }}
      >
        <video
          autoPlay
          loop
          muted
          playsInline
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            display: "block",
            filter: "blur(2px)",
          }}
          onError={(e) => console.error("Video error:", e)}
        >
          <source src="/videos/bg-video.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>

        {/* Dark Overlay */}
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            background: "rgba(0, 0, 0, 0.08)",
            zIndex: 1,
            pointerEvents: "none",
          }}
        />
      </Box>

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

            <Grid container spacing={3} sx={{ mt: 1 }} justifyContent="center">
              {learningPaths.map((course, index) => (
                <motion.div key={index} variants={itemVariants} style={{ width: "100%" }}>
                  <Grid item xs={12} sm={6} md={3} sx={{ width: "100%" }}>
                    <CourseCard
                      title={course.title}
                      icon={course.icon}
                      sx={{
                        minHeight: 180,
                        borderStyle: "dashed",
                        borderColor: "var(--color-border)",
                        background: "linear-gradient(135deg, #ffffff 0%, #e8dff5 100%)",
                        boxShadow: "var(--shadow-sm)",
                        textAlign: "left",
                        alignItems: "flex-start",
                        justifyContent: "flex-start",
                        padding: "16px",
                        position: "relative",
                        overflow: "hidden",
                        transition: "transform 180ms ease-out, box-shadow 180ms ease-out, border-color 180ms ease-out",
                        "&::after": {
                          content: '""',
                          position: "absolute",
                          inset: 0,
                          background: "radial-gradient(120px 80px at 85% 15%, rgba(255,255,255,0.25), transparent)",
                          opacity: 0.6,
                          pointerEvents: "none",
                          transition: "opacity 180ms ease-out, transform 180ms ease-out",
                        },
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
                          transform: "translateY(-4px) rotate(-0.25deg)",
                          boxShadow: "var(--shadow-lg)",
                          borderColor: "#7a5bff55",
                        },
                        "&:hover::after": {
                          opacity: 1,
                          transform: "translate3d(-2px, -2px, 0)",
                        },
                        "& .MuiCardContent-root": {
                          p: 2.25,
                          gap: 1.25,
                        },
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
        <Footer disableAnimations />
        </Box>
      </Box>
    </Box>
  );
}

