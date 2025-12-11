import { Box, Container, Grid, Card, CardContent, Typography, Chip, Button } from "@mui/material";
import { motion } from "framer-motion";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import PageHeader from "../components/PageHeader";
import LocalFireDepartmentIcon from "@mui/icons-material/LocalFireDepartment";

const MotionCard = motion(Card);

export default function InformalLearning() {
  const dailyLessons = [
    {
      title: "5-Minute Python Tip",
      category: "Programming",
      difficulty: "Beginner",
      views: 2450,
      icon: "💡",
    },
    {
      title: "Design Principle: Contrast",
      category: "Design",
      difficulty: "Intermediate",
      views: 1820,
      icon: "🎨",
    },
    {
      title: "Quick English Grammar",
      category: "Languages",
      difficulty: "Beginner",
      views: 3200,
      icon: "📚",
    },
    {
      title: "Mental Health: Stress Management",
      category: "Wellness",
      difficulty: "All Levels",
      views: 4100,
      icon: "🧘",
    },
    {
      title: "Productivity Hack of the Day",
      category: "Self-Help",
      difficulty: "Beginner",
      views: 2890,
      icon: "⚡",
    },
    {
      title: "Spanish Word of the Day",
      category: "Languages",
      difficulty: "Beginner",
      views: 3450,
      icon: "🌍",
    },
    {
      title: "Quick History Facts",
      category: "Education",
      difficulty: "All Levels",
      views: 2100,
      icon: "📖",
    },
    {
      title: "Business Strategy Tips",
      category: "Business",
      difficulty: "Intermediate",
      views: 1650,
      icon: "💼",
    },
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
    visible: { opacity: 1, y: 0 },
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
            title="Informal Learning"
            subtitle="Self-paced, curiosity-driven learning with daily lessons and quick tips"
            backgroundGradient="linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)"
          />

          {/* Daily Streak */}
          <MotionCard
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            sx={{
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              color: "white",
              mb: 4,
              borderRadius: 3,
            }}
          >
            <CardContent sx={{ py: 3 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <LocalFireDepartmentIcon sx={{ fontSize: "2.5rem" }} />
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>
                    Keep Your Learning Streak!
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    You're on a 7-day streak. Complete today's lesson to continue!
                  </Typography>
                </Box>
                <Button
                  variant="contained"
                  sx={{
                    background: "white",
                    color: "#667eea",
                    fontWeight: 700,
                    ml: "auto",
                  }}
                >
                  Today's Lesson
                </Button>
              </Box>
            </CardContent>
          </MotionCard>

          {/* Daily Lessons */}
          <Typography variant="h5" sx={{ fontWeight: 700, mb: 2, color: "#2c3e50" }}>
            Daily Learning Feed
          </Typography>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <Grid container spacing={3}>
              {dailyLessons.map((lesson, i) => (
                <Grid item xs={12} sm={6} md={4} key={i}>
                  <motion.div variants={itemVariants}>
                    <MotionCard
                      whileHover={{ y: -8 }}
                      sx={{
                        borderRadius: 3,
                        boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
                        height: "100%",
                        display: "flex",
                        flexDirection: "column",
                        border: "1px solid rgba(0,0,0,0.08)",
                      }}
                    >
                      <CardContent sx={{ pb: 0 }}>
                        <Box sx={{ fontSize: "2.5rem", mb: 1 }}>{lesson.icon}</Box>
                        <Typography variant="h6" sx={{ fontWeight: 700, color: "#2c3e50", mb: 0.5 }}>
                          {lesson.title}
                        </Typography>
                        <Chip
                          label={lesson.category}
                          size="small"
                          sx={{
                            background: "#667eea20",
                            color: "#667eea",
                            fontWeight: 600,
                            mb: 1.5,
                          }}
                        />
                      </CardContent>

                      <CardContent sx={{ pt: 1, mt: "auto" }}>
                        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
                          <Typography variant="caption" sx={{ color: "#666" }}>
                            {lesson.difficulty}
                          </Typography>
                          <Typography variant="caption" sx={{ color: "#666" }}>
                            👁️ {lesson.views}
                          </Typography>
                        </Box>

                        <Button fullWidth variant="outlined" size="small">
                          Start Learning
                        </Button>
                      </CardContent>
                    </MotionCard>
                  </motion.div>
                </Grid>
              ))}
            </Grid>
          </motion.div>

          {/* Features */}
          <Box sx={{ mt: 8, mb: 4 }}>
            <Typography variant="h5" sx={{ fontWeight: 700, mb: 3, color: "#2c3e50" }}>
              Why Choose Informal Learning?
            </Typography>

            <Grid container spacing={3}>
              {[
                { icon: "⏱️", title: "5-Minute Lessons", desc: "Learn at your own pace with short, digestible content" },
                { icon: "🎯", title: "Personalized Path", desc: "AI recommends topics based on your interests" },
                { icon: "🎖️", title: "Badges & Streaks", desc: "Earn badges and maintain daily learning streaks" },
                { icon: "🔄", title: "Flexible Schedule", desc: "Learn anytime, anywhere, on any device" },
              ].map((feature, i) => (
                <Grid item xs={12} sm={6} md={3} key={i}>
                  <Box
                    sx={{
                      p: 3,
                      background: "white",
                      borderRadius: 2,
                      textAlign: "center",
                      boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
                    }}
                  >
                    <Box sx={{ fontSize: "2rem", mb: 1 }}>{feature.icon}</Box>
                    <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 0.5 }}>
                      {feature.title}
                    </Typography>
                    <Typography variant="caption" sx={{ color: "#666" }}>
                      {feature.desc}
                    </Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Box>
        </Container>
      </Box>
    </Box>
  );
}