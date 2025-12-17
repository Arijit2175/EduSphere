import { Box, Grid, Typography, Container, Button, Chip } from "@mui/material";
import { motion } from "framer-motion";
import { useNonFormal } from "../contexts/NonFormalContext";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import StarIcon from "@mui/icons-material/Star";

const MotionBox = motion(Box);

export default function FeaturedCourses() {
  const { courses = [] } = useNonFormal();
  const featuredCourses = courses.slice(0, 4);

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
    const palette = {
      "Tech Skills": "#2563eb",
      "Creative Skills": "#f472b6",
      "Career Skills": "#f59e0b",
      "Language Skills": "#10b981",
      "Personal Growth": "#8b5cf6",
      Entrepreneurship: "#22c55e",
    };
    return palette[category] || "#2563eb";
  };

  return (
    <Box>
      <Typography
        variant="h4"
        sx={{
          fontWeight: 800,
          textAlign: "center",
          mb: 1,
          color: '#ffffff',
          fontSize: { xs: "1.5rem", md: "2rem" },
        }}
      >
        Non-Formal Courses
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
        Explore the exact non-formal modules available right now
      </Typography>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <Grid container spacing={2.5} justifyContent="center">
          {featuredCourses.map((course) => (
            <Grid item xs={12} sm={6} md={3} lg={3} key={course.id}>
              <motion.div variants={itemVariants}>
                <MotionBox
                  whileHover={{ y: -4, boxShadow: 'var(--shadow-lg)' }}
                  transition={{ duration: 0.18, ease: "easeOut" }}
                  sx={{
                    height: "100%",
                    borderRadius: 'var(--radius-lg)',
                    background: 'var(--color-surface)',
                    border: '1px solid var(--color-border)',
                    overflow: "hidden",
                    transition: "all 180ms ease-out",
                    display: "flex",
                    flexDirection: "column",
                    boxShadow: 'var(--shadow-sm)',
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
                    {course.thumbnail || course.image || "📚"}
                  </Box>

                  {/* Course Content */}
                  <Box sx={{ p: 2.5, flexGrow: 1, display: "flex", flexDirection: "column" }}>
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
                        color: 'var(--color-text)',
                        mb: 1.5,
                        fontSize: "1.1rem",
                        lineHeight: 1.4,
                      }}
                    >
                      {course.title}
                    </Typography>

                    {/* Course Meta */}
                    <Box sx={{ mb: 2, flexGrow: 1 }}>
                      <Box sx={{ display: "flex", gap: 2, mb: 1, fontSize: "0.85rem", color: 'var(--color-muted)' }}>
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
                        <Typography sx={{ fontSize: "0.85rem", color: 'var(--color-muted)' }}>
                          {course.rating} ({course.reviews?.toLocaleString?.() || course.reviews || 0})
                        </Typography>
                      </Box>
                    </Box>

                    {/* Showcase only - no enroll action on home */}
                    <Box sx={{ mt: 1, color: 'var(--color-muted)', fontSize: "0.85rem", fontWeight: 600 }}>
                      Non-formal module preview
                    </Box>
                  </Box>
                </MotionBox>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      </motion.div>

      {/* View All Button */}
      <Box sx={{ textAlign: "center", mt: 6 }}>
        <Button
          href="/nonformal"
          size="large"
          sx={{
            background: "#7a5bff",
            color: "#ffffff",
            fontWeight: 700,
            px: 4,
            py: 1.5,
            borderRadius: 2,
            transition: "all 0.3s ease",
            "&:hover": {
              background: "#6b4cdd",
              transform: "translateY(-2px)",
              boxShadow: "0 6px 20px rgba(122, 91, 255, 0.3)",
            },
          }}
        >
          View All Non-Formal Courses →
        </Button>
      </Box>
    </Box>
  );
}
