import { Box, Container, Grid, Card, CardContent, Typography, Button, Stack, Chip, LinearProgress, CircularProgress } from "@mui/material";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import PageHeader from "../components/PageHeader";
import Section from "../components/Section";

import { useSidebar } from "../contexts/SidebarContext";
import { useAuth } from "../contexts/AuthContext";
import { useNonFormal } from "../contexts/NonFormalContext";
import StarIcon from "@mui/icons-material/Star";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

export default function NonFormalLearning() {
  const { isOpen } = useSidebar();
  const { user } = useAuth();
  const { courses, getEnrolledCourses, getCourseProgress, certificates, resetAllData, isLoading } = useNonFormal();
  const navigate = useNavigate();

  const getCertUserId = (cert) => cert?.user_id ?? cert?.userId ?? cert?.student_id;
  const getCertCourseId = (cert) => cert?.course_id ?? cert?.courseId;

  const enrolledCourses = getEnrolledCourses(user?.id);
  const userCertificates = certificates.filter((c) => getCertUserId(c) === user?.id);
  
  const inProgressCourses = enrolledCourses.filter(
    (course) => !userCertificates.some((cert) => String(getCertCourseId(cert)) === String(course.id))
  );

  if (isLoading) {
    return (
      <Box sx={{ display: "flex", minHeight: "100vh" }}>
        <Sidebar />
        <Box sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}>
          <Navbar />
          <Box sx={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <CircularProgress />
          </Box>
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      <Sidebar />
      <Box
        sx={{
          flexGrow: 1,
          background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Navbar />
        <Box
          sx={{
            flexGrow: 1,
            ml: { xs: 0, md: isOpen ? 25 : 8.75 },
            transition: "margin-left 0.3s ease",
          }}
        >
          <Container maxWidth="lg" sx={{ mt: 4 }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
              <PageHeader
                title="My Non-Formal Learning"
                subtitle="Continue your skill development journey"
                backgroundGradient="linear-gradient(135deg, #f093fb 0%, #f5576c 100%)"
                disableAnimation={true}
              />
              <Button 
                variant="outlined" 
                color="error" 
                size="small"
                onClick={() => {
                  if (window.confirm("⚠️ This will reset ALL non-formal learning data (enrollments, progress, certificates). Continue?")) {
                    resetAllData();
                    window.location.reload();
                  }
                }}
              >
                Reset All Data
              </Button>
            </Stack>

            <Grid container spacing={3} sx={{ mt: 2 }}>
              <Grid item xs={12} sm={6} md={3}>
                <Card sx={{ background: "#667eea20", border: "1px solid #667eea" }}>
                  <CardContent sx={{ textAlign: "center" }}>
                    <Typography variant="h4" sx={{ fontWeight: 700, color: "#667eea" }}>
                      {inProgressCourses.length}
                    </Typography>
                    <Typography variant="body2" sx={{ color: "#666" }}>
                      Courses Enrolled
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid item xs={12} sm={6} md={3}>
                <Card sx={{ background: "#10b98120", border: "1px solid #10b981" }}>
                  <CardContent sx={{ textAlign: "center" }}>
                    <Typography variant="h4" sx={{ fontWeight: 700, color: "#10b981" }}>
                      {userCertificates.length}
                    </Typography>
                    <Typography variant="body2" sx={{ color: "#666" }}>
                      Certificates Earned
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid item xs={12} sm={6} md={3}>
                <Card sx={{ background: "#f59e0b20", border: "1px solid #f59e0b" }}>
                  <CardContent sx={{ textAlign: "center" }}>
                    <Typography variant="h4" sx={{ fontWeight: 700, color: "#f59e0b" }}>
                      {inProgressCourses.reduce((acc, c) => acc + (c.lessons?.length || 0), 0)}
                    </Typography>
                    <Typography variant="body2" sx={{ color: "#666" }}>
                      Total Lessons
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid item xs={12} sm={6} md={3}>
                <Card sx={{ background: "#3b82f620", border: "1px solid #3b82f6" }}>
                  <CardContent sx={{ textAlign: "center" }}>
                    <Button fullWidth variant="contained" size="small" onClick={() => navigate("/nonformal")}>
                      Browse More
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>

            <Section background="transparent">
              <Typography variant="h5" sx={{ fontWeight: 700, mb: 3 }}>
                📚 My Learning Path
              </Typography>

              {inProgressCourses.length === 0 ? (
                <Card sx={{ p: 4, textAlign: "center" }}>
                  <Typography variant="body1" sx={{ color: "#999", mb: 2 }}>
                    {userCertificates.length > 0 
                      ? "All courses completed! Browse more courses to continue learning." 
                      : "You haven't enrolled in any courses yet."}
                  </Typography>
                  <Button variant="contained" onClick={() => navigate("/nonformal")}>
                    Explore Courses
                  </Button>
                </Card>
              ) : (
                <Grid container spacing={3}>
                  {inProgressCourses.map((course) => {
                    const progress = getCourseProgress(user?.id, course.id);
                    const progressPercent = progress?.completedLessons
                      ? (progress.completedLessons.length / (course.lessons?.length || 1)) * 100
                      : 0;
                    const hasCertificate = userCertificates.some(
                      (c) => String(getCertCourseId(c)) === String(course.id)
                    );

                    return (
                      <Grid item xs={12} md={6} key={course.id}>
                        <Card sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
                          <CardContent sx={{ flex: 1 }}>
                            <Stack direction="row" spacing={2} alignItems="flex-start" sx={{ mb: 2 }}>
                              <Box sx={{ fontSize: 40 }}>{course.thumbnail}</Box>
                              <Box sx={{ flex: 1 }}>
                                <Typography variant="h6" sx={{ fontWeight: 700, color: 'white !important' }}>
                                  {course.title}
                                </Typography>
                                <Stack direction="row" spacing={0.5} alignItems="center">
                                  <StarIcon sx={{ fontSize: 14, color: "#fbbf24" }} />
                                  <Typography variant="caption" sx={{ fontWeight: 600, color: 'white !important' }}>
                                    {course.rating}
                                  </Typography>
                                </Stack>
                              </Box>
                              {hasCertificate && (
                                <Chip icon={<CheckCircleIcon />} label="Certified" color="success" />
                              )}
                            </Stack>

                            <Typography variant="body2" sx={{ color: 'white !important', mb: 2 }}>
                              {course.description}
                            </Typography>

                            <Stack spacing={1} sx={{ mb: 2 }}>
                              <Stack direction="row" justifyContent="space-between" alignItems="center">
                                <Typography variant="caption" sx={{ fontWeight: 600 }}>
                                  Progress
                                </Typography>
                                <Typography variant="caption" sx={{ color: "#9ca3af" }}>
                                  {Math.round(progressPercent)}%
                                </Typography>
                              </Stack>
                              <LinearProgress variant="determinate" value={progressPercent} />
                            </Stack>

                            <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
                              <Chip label={course.level} size="small" variant="outlined" sx={{ color: 'white !important', borderColor: 'white !important' }} />
                              <Chip label={course.duration} size="small" variant="outlined" sx={{ color: 'white !important', borderColor: 'white !important' }} />
                            </Stack>
                          </CardContent>

                          <CardContent sx={{ pt: 0 }}>
                            <Stack direction="row" spacing={1}>
                              <Button
                                fullWidth
                                variant="contained"
                                onClick={() => navigate(`/nonformal/learn/${course.id}`)}
                              >
                                Continue Learning
                              </Button>
                              <Button
                                fullWidth
                                variant="outlined"
                                onClick={() => navigate(`/nonformal/course/${course.id}`)}
                              >
                                Details
                              </Button>
                            </Stack>
                          </CardContent>
                        </Card>
                      </Grid>
                    );
                  })}
                </Grid>
              )}
            </Section>

            {userCertificates.length > 0 && (
              <Section background="transparent">
                <Typography variant="h5" sx={{ fontWeight: 700, mb: 3 }}>
                  🏆 Your Certificates
                </Typography>
                <Grid container spacing={3}>
                  {userCertificates.map((cert) => (
                    <Grid item xs={12} md={6} key={cert.id}>
                      <Card sx={{ background: "linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)", color: "white" }}>
                        <CardContent>
                          <CheckCircleIcon sx={{ fontSize: 48, mb: 1 }} />
                          <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                            Certificate of Completion
                          </Typography>
                          <Typography variant="body2" sx={{ mb: 2 }}>
                            🎓 {cert.courseName}
                          </Typography>
                          <Typography variant="caption" sx={{ opacity: 0.9, mb: 2, display: "block" }}>
                            Instructed by {cert.instructor}
                          </Typography>
                          <Typography variant="caption" sx={{ opacity: 0.8, display: "block", mb: 2 }}>
                            ID: {cert.certificateId}
                          </Typography>
                          <Typography variant="caption" sx={{ opacity: 0.8 }}>
                            Earned on {new Date(cert.earnedAt).toLocaleDateString()}
                          </Typography>
                          <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
                            <Button size="small" variant="contained" sx={{ background: "white", color: "#f59e0b" }}>
                              Download
                            </Button>
                            <Button size="small" variant="outlined" sx={{ color: "white", borderColor: "white" }}>
                              Share
                            </Button>
                          </Stack>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </Section>
            )}

            <Box sx={{ mt: 6, mb: 2 }}>
              <Typography
                variant="body2"
                sx={{ color: "#6b7280", textAlign: "center", fontWeight: 500 }}
              >
                © 2025 EduSphere. All rights reserved.
              </Typography>
            </Box>
          </Container>
        </Box>
      </Box>
    </Box>
  );
}
