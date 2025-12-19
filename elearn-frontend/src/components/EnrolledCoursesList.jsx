import { Box, Grid, Card, CardContent, Typography, Button, LinearProgress, Stack, Chip } from "@mui/material";
import VideocamIcon from "@mui/icons-material/Videocam";
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
          <Grid item xs={12} sm={6} md={4} lg={3} key={i}>
            <motion.div variants={itemVariants}>
              <MotionCard
                whileHover={{ y: -12, boxShadow: "0 20px 40px rgba(102, 126, 234, 0.25)" }}
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  borderRadius: 4,
                  border: "1px solid #e5e7eb",
                  background: "white",
                  overflow: "hidden",
                  transition: "all 0.3s ease",
                  position: "relative",
                  "&::before": {
                    content: '""',
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    height: "4px",
                    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  },
                }}
              >
                {/* Gradient Header */}
                <Box sx={{ 
                  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  p: 3,
                  position: "relative",
                  overflow: "hidden",
                  "&::after": {
                    content: '""',
                    position: "absolute",
                    top: "-50%",
                    right: "-30%",
                    width: "150px",
                    height: "150px",
                    background: "rgba(255,255,255,0.1)",
                    borderRadius: "50%",
                  }
                }}>
                  <Typography variant="h6" sx={{ 
                    fontWeight: 800, 
                    color: "white", 
                    mb: 1,
                    lineHeight: 1.3,
                    minHeight: "2.6em",
                    position: "relative",
                    zIndex: 1
                  }}>
                    {course.title}
                  </Typography>
                  <Typography variant="caption" sx={{ 
                    color: "rgba(255,255,255,0.95)", 
                    fontWeight: 600,
                    position: "relative",
                    zIndex: 1,
                    display: "block"
                  }}>
                    👨‍🏫 {course.instructor}
                  </Typography>
                  {course.duration && (
                    <Typography variant="caption" sx={{ 
                      color: "rgba(255,255,255,0.85)", 
                      fontWeight: 500,
                      position: "relative",
                      zIndex: 1,
                      display: "block",
                      mt: 0.5
                    }}>
                      ⏱️ {course.duration}
                    </Typography>
                  )}
                </Box>

                <CardContent sx={{ flexGrow: 1, p: 2.5, display: "flex", flexDirection: "column" }}>
                  {/* Meeting Links */}
                  {course.schedules && course.schedules.length > 0 && (
                    <Box sx={{ mb: 2.5, flexGrow: 1 }}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 800, mb: 1.5, color: "#1f2937", fontSize: "0.85rem" }}>
                        🎥 Live Classes
                      </Typography>
                      <Stack spacing={1}>
                        {course.schedules.slice(0, 2).map((schedule) => (
                          <Box 
                            key={schedule.id} 
                            sx={{ 
                              p: 1.5,
                              background: schedule.meetLink ? "linear-gradient(135deg, #667eea15 0%, #764ba225 100%)" : "#f9fafb",
                              border: schedule.meetLink ? "1px solid #667eea30" : "1px solid #e5e7eb",
                              borderRadius: 2,
                              display: "flex",
                              flexDirection: "column",
                              gap: 0.5
                            }}
                          >
                            <Typography variant="caption" sx={{ fontWeight: 700, color: "#1f2937" }}>
                              {schedule.title || "Live Class"}
                            </Typography>
                            <Typography variant="caption" sx={{ color: "#6b7280", fontSize: "0.7rem" }}>
                              {new Date(schedule.startTime).toLocaleString()}
                            </Typography>
                            {schedule.meetLink && (
                              <Button
                                fullWidth
                                size="small"
                                variant="contained"
                                href={schedule.meetLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                startIcon={<VideocamIcon />}
                                sx={{ 
                                  mt: 0.5,
                                  textTransform: "none",
                                  background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                                  fontWeight: 700,
                                  fontSize: "0.75rem"
                                }}
                              >
                                Join Now
                              </Button>
                            )}
                          </Box>
                        ))}
                      </Stack>
                    </Box>
                  )}
                </CardContent>
              </MotionCard>
            </motion.div>
          </Grid>
        ))}
      </Grid>
    </motion.div>
  );
}
