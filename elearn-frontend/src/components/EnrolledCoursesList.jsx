import { Box, Grid, Card, CardContent, Typography, Button, LinearProgress } from "@mui/material";
import { motion } from "framer-motion";

const MotionCard = motion(Card);

export default function EnrolledCoursesList({ courses = [] }) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.08 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
    >
      <Grid container spacing={3}>
        {courses.map((course, i) => (
          <Grid item xs={12} key={i}>
            <motion.div variants={itemVariants}>
              <MotionCard
                whileHover={{ scale: 1.01, boxShadow: "0 12px 32px rgba(0,0,0,0.1)" }}
                sx={{
                  borderRadius: 3,
                  border: "1px solid rgba(0,0,0,0.08)",
                  background: "white",
                  overflow: "hidden",
                  transition: "all 0.3s ease",
                }}
              >
                <CardContent>
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 2 }}>
                    <Box>
                      <Typography variant="h6" sx={{ fontWeight: 700, color: "#2c3e50", mb: 0.5 }}>
                        {course.title}
                      </Typography>
                      <Typography variant="caption" sx={{ color: "#7f8c8d" }}>
                        {course.instructor} • {course.duration}
                      </Typography>
                    </Box>
                    <Button variant="contained" size="small" sx={{ background: "#667eea" }}>
                      Continue
                    </Button>
                  </Box>

                  {/* Progress Bar */}
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
            </motion.div>
          </Grid>
        ))}
      </Grid>
    </motion.div>
  );
}
