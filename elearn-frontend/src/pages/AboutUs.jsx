import { Box, Container, Typography, Grid, Card, CardContent } from "@mui/material";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { motion } from "framer-motion";

const MotionBox = motion(Box);

export default function AboutUs() {
  return (
    <Box sx={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Navbar />
      
      {/* Hero Section */}
      <Box
        sx={{
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          color: "white",
          py: 8,
          mt: 8,
        }}
      >
        <Container maxWidth="lg">
          <MotionBox
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Typography variant="h2" sx={{ fontWeight: 800, mb: 2, textAlign: "center" }}>
              About EduSphere
            </Typography>
            <Typography variant="h6" sx={{ textAlign: "center", opacity: 0.9 }}>
              Empowering learners worldwide with accessible, high-quality education
            </Typography>
          </MotionBox>
        </Container>
      </Box>

      {/* Content Section */}
      <Container maxWidth="lg" sx={{ py: 8, flex: 1 }}>
        <Grid container spacing={4}>
          <Grid item xs={12}>
            <MotionBox
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <Typography variant="h4" sx={{ fontWeight: 700, mb: 3 }}>
                Our Mission
              </Typography>
              <Typography variant="body1" sx={{ mb: 4, lineHeight: 1.8, color: "#555" }}>
                At EduSphere, we believe that education is a fundamental right and should be accessible to everyone, 
                regardless of their location, background, or financial situation. Our platform combines formal, 
                non-formal, and informal learning pathways to provide a comprehensive educational experience that 
                adapts to your unique learning style and goals.
              </Typography>
            </MotionBox>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card sx={{ height: "100%", boxShadow: 3 }}>
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, color: "#667eea" }}>
                  📚 Formal Learning
                </Typography>
                <Typography variant="body2" sx={{ color: "#666" }}>
                  Structured, curriculum-driven courses with assessments, certifications, and comprehensive learning paths 
                  designed by expert educators.
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card sx={{ height: "100%", boxShadow: 3 }}>
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, color: "#667eea" }}>
                  🎯 Non-Formal Learning
                </Typography>
                <Typography variant="body2" sx={{ color: "#666" }}>
                  Flexible workshops, bootcamps, and skill-based programs with hands-on projects and mentorship 
                  opportunities.
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card sx={{ height: "100%", boxShadow: 3 }}>
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, color: "#667eea" }}>
                  💡 Informal Learning
                </Typography>
                <Typography variant="body2" sx={{ color: "#666" }}>
                  Community-driven discussions, peer learning, and AI-powered assistance for self-directed 
                  exploration and growth.
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12}>
            <MotionBox
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              sx={{ mt: 4 }}
            >
              <Typography variant="h4" sx={{ fontWeight: 700, mb: 3 }}>
                Our Values
              </Typography>
              <Typography variant="body1" sx={{ mb: 2, lineHeight: 1.8, color: "#555" }}>
                <strong>Accessibility:</strong> We make education available to learners everywhere, breaking down barriers 
                of cost, location, and technology.
              </Typography>
              <Typography variant="body1" sx={{ mb: 2, lineHeight: 1.8, color: "#555" }}>
                <strong>Quality:</strong> We partner with experienced educators and industry professionals to ensure 
                our content meets the highest standards.
              </Typography>
              <Typography variant="body1" sx={{ mb: 2, lineHeight: 1.8, color: "#555" }}>
                <strong>Innovation:</strong> We leverage cutting-edge technology, including AI tutoring and adaptive 
                learning, to enhance the educational experience.
              </Typography>
              <Typography variant="body1" sx={{ lineHeight: 1.8, color: "#555" }}>
                <strong>Community:</strong> We foster a supportive learning environment where students can connect, 
                collaborate, and grow together.
              </Typography>
            </MotionBox>
          </Grid>
        </Grid>
      </Container>

      <Footer />
    </Box>
  );
}
