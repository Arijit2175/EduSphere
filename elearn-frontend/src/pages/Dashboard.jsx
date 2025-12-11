import { Box, Container, Grid, Card, CardContent, Typography, LinearProgress, Button } from "@mui/material";
import { motion } from "framer-motion";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import PageHeader from "../components/PageHeader";
import SchoolIcon from "@mui/icons-material/School";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";

const MotionCard = motion(Card);

export default function Dashboard() {
  const userStats = [
    { title: "Courses Enrolled", value: 5, icon: SchoolIcon, color: "#667eea" },
    { title: "Learning Hours", value: 124, icon: TrendingUpIcon, color: "#f093fb" },
    { title: "Certificates Earned", value: 2, icon: EmojiEventsIcon, color: "#4facfe" },
  ];

  const enrolledCourses = [
    { title: "Advanced Python", progress: 65, instructor: "John Doe", duration: "12 weeks" },
    { title: "Web Development Bootcamp", progress: 45, instructor: "Jane Smith", duration: "10 weeks" },
    { title: "Data Science Fundamentals", progress: 82, instructor: "Mike Johnson", duration: "8 weeks" },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  };

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
            title="Your Dashboard"
            subtitle="Track your learning progress and achievements"
            backgroundGradient="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
          />

          {/* Stats Grid */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <Grid container spacing={3} sx={{ mb: 4 }}>
              {userStats.map((stat, i) => {
                const Icon = stat.icon;
                return (
                  <Grid item xs={12} sm={6} md={4} key={i}>
                    <motion.div variants={itemVariants}>
                      <MotionCard
                        whileHover={{ y: -8 }}
                        sx={{
                          background: `linear-gradient(135deg, ${stat.color}20 0%, ${stat.color}10 100%)`,
                          borderRadius: 3,
                          border: `2px solid ${stat.color}30`,
                        }}
                      >
                        <CardContent>
                          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                            <Box
                              sx={{
                                p: 1.5,
                                background: stat.color,
                                borderRadius: 2,
                                color: "white",
                              }}
                            >
                              <Icon />
                            </Box>
                            <Box>
                              <Typography variant="h6" sx={{ fontWeight: 700, color: stat.color }}>
                                {stat.value}+
                              </Typography>
                              <Typography variant="caption" sx={{ color: "#666" }}>
                                {stat.title}
                              </Typography>
                            </Box>
                          </Box>
                        </CardContent>
                      </MotionCard>
                    </motion.div>
                  </Grid>
                );
              })}
            </Grid>
          </motion.div>

          {/* Enrolled Courses */}
          <Typography
            variant="h5"
            sx={{
              fontWeight: 700,
              mb: 2,
              color: "#2c3e50",
            }}
          >
            My Courses
          </Typography>

          <Grid container spacing={3}>
            {enrolledCourses.map((course, i) => (
              <Grid item xs={12} key={i}>
                <MotionCard
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  whileHover={{ scale: 1.01 }}
                  sx={{
                    borderRadius: 3,
                    boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
                  }}
                >
                  <CardContent>
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                      <Box>
                        <Typography variant="h6" sx={{ fontWeight: 700, color: "#2c3e50" }}>
                          {course.title}
                        </Typography>
                        <Typography variant="caption" sx={{ color: "#666" }}>
                          {course.instructor} • {course.duration}
                        </Typography>
                      </Box>
                      <Button variant="outlined" size="small">
                        Continue
                      </Button>
                    </Box>

                    <Box>
                      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                        <Typography variant="caption" sx={{ color: "#666" }}>
                          Progress
                        </Typography>
                        <Typography variant="caption" sx={{ fontWeight: 700, color: "#667eea" }}>
                          {course.progress}%
                        </Typography>
                      </Box>
                      <LinearProgress
                        variant="determinate"
                        value={course.progress}
                        sx={{
                          height: 8,
                          borderRadius: 4,
                          background: "#eee",
                          "& .MuiLinearProgress-bar": {
                            background: "linear-gradient(90deg, #667eea 0%, #764ba2 100%)",
                            borderRadius: 4,
                          },
                        }}
                      />
                    </Box>
                  </CardContent>
                </MotionCard>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>
    </Box>
  );
}