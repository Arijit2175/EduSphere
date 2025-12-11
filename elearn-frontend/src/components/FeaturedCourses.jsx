import { Box, Grid, Typography, Container, Button, Chip } from "@mui/material";
import { motion } from "framer-motion";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import StarIcon from "@mui/icons-material/Star";

const MotionBox = motion(Box);

export default function FeaturedCourses() {
  const featuredCourses = [
    {
      id: 1,
      title: "Advanced Web Development",
      category: "Formal Learning",
      level: "Advanced",
      students: 3450,
      rating: 4.8,
      image: "🌐",
      duration: "12 weeks",
    },
    {
      id: 2,
      title: "Python for Data Science",
      category: "Formal Learning",
      level: "Intermediate",
      students: 5200,
      rating: 4.9,
      image: "📊",
      duration: "10 weeks",
    },
    {
      id: 3,
      title: "UI/UX Design Bootcamp",
      category: "Non-Formal Learning",
      level: "Beginner",
      students: 2100,
      rating: 4.7,
      image: "🎨",
      duration: "8 weeks",
    },
    {
      id: 4,
      title: "AI & Machine Learning Basics",
      category: "Informal Learning",
      level: "Advanced",
      students: 6800,
      rating: 4.9,
      image: "🤖",
      duration: "6 weeks",
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
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

  const getCategoryColor = (category) => {
    switch (category) {
      case "Formal Learning":
        return "#667eea";
      case "Non-Formal Learning":
        return "#f093fb";
      case "Informal Learning":
        return "#4facfe";
      default:
        return "#667eea";
    }
  };

  return (
    <Box>
      <Typography
        variant="h4"
        sx={{
          fontWeight: 700,
          textAlign: "center",
          mb: 1,
          color: "#2c3e50",
          fontSize: { xs: "1.5rem", md: "2rem" },
        }}
      >
        Featured Courses
      </Typography>
      <Typography
        variant="body1"
        sx={{
          textAlign: "center",
          color: "#666",
          mb: 4,
          fontSize: { xs: "0.9rem", md: "1rem" },
        }}
      >
        Start learning from our most popular courses
      </Typography>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <Grid container spacing={3}>
          {featuredCourses.map((course) => (
            <Grid item xs={12} sm={6} md={6} lg={3} key={course.id}>
              <motion.div variants={itemVariants}>
                <MotionBox
                  whileHover={{ y: -8 }}
                  sx={{
                    height: "100%",
                    borderRadius: 3,
                    background: "white",
                    border: "1px solid rgba(0,0,0,0.08)",
                    overflow: "hidden",
                    transition: "all 0.3s ease",
                    display: "flex",
                    flexDirection: "column",
                    boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
                    "&:hover": {
                      boxShadow: "0 12px 40px rgba(102, 126, 234, 0.2)",
                      borderColor: "rgba(102, 126, 234, 0.2)",
                    },
                  }}
                >
                  {/* Course Image Area */}
                  <Box
                    sx={{
                      background: `linear-gradient(135deg, ${getCategoryColor(
                        course.category
                      )}20 0%, ${getCategoryColor(course.category)}10 100%)`,
                      height: 180,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "3.5rem",
                      borderBottom: `3px solid ${getCategoryColor(course.category)}`,
                    }}
                  >
                    {course.image}
                  </Box>

                  {/* Course Content */}
                  <Box sx={{ p: 3, flexGrow: 1, display: "flex", flexDirection: "column" }}>
                    <Chip
                      label={course.category}
                      size="small"
                      sx={{
                        background: `${getCategoryColor(course.category)}20`,
                        color: getCategoryColor(course.category),
                        fontWeight: 600,
                        width: "fit-content",
                        mb: 1.5,
                      }}
                    />

                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: 700,
                        color: "#2c3e50",
                        mb: 1.5,
                        fontSize: "1.1rem",
                        lineHeight: 1.4,
                      }}
                    >
                      {course.title}
                    </Typography>

                    {/* Course Meta */}
                    <Box sx={{ mb: 2, flexGrow: 1 }}>
                      <Box sx={{ display: "flex", gap: 2, mb: 1, fontSize: "0.85rem", color: "#666" }}>
                        <span>📚 {course.level}</span>
                        <span>⏱️ {course.duration}</span>
                      </Box>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                          {[...Array(5)].map((_, i) => (
                            <StarIcon
                              key={i}
                              sx={{
                                fontSize: "1rem",
                                color: i < Math.floor(course.rating) ? "#ffc107" : "#ddd",
                              }}
                            />
                          ))}
                        </Box>
                        <Typography sx={{ fontSize: "0.85rem", color: "#666" }}>
                          {course.rating} ({course.students.toLocaleString()})
                        </Typography>
                      </Box>
                    </Box>

                    {/* Enroll Button */}
                    <Button
                      fullWidth
                      variant="contained"
                      endIcon={<ArrowRightIcon />}
                      sx={{
                        background: `linear-gradient(135deg, ${getCategoryColor(
                          course.category
                        )} 0%, ${getCategoryColor(course.category)}dd 100%)`,
                        color: "white",
                        fontWeight: 600,
                        py: 1.2,
                        "&:hover": {
                          transform: "translateY(-2px)",
                          boxShadow: `0 8px 20px ${getCategoryColor(course.category)}40`,
                        },
                        transition: "all 0.3s ease",
                      }}
                    >
                      Enroll Now
                    </Button>
                  </Box>
                </MotionBox>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      </motion.div>

      {/* View All Button */}
      <Box sx={{ textAlign: "center", mt: 4 }}>
        <Button
          size="large"
          sx={{
            color: "#667eea",
            fontWeight: 700,
            "&:hover": {
              background: "rgba(102, 126, 234, 0.1)",
            },
          }}
        >
          View All Courses →
        </Button>
      </Box>
    </Box>
  );
}
