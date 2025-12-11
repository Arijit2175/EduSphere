import { Box, Grid, Card, CardContent, Typography, Button, Stack, LinearProgress, Chip, Tab, Tabs } from "@mui/material";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import Section from "../components/Section";
import SectionTitle from "../components/SectionTitle";
import StatsGrid from "../components/StatsGrid";
import EnrolledCoursesList from "../components/EnrolledCoursesList";
import PageHeader from "../components/PageHeader";
import { useCourses } from "../contexts/CoursesContext";
import { useNonFormal } from "../contexts/NonFormalContext";
import { useAuth } from "../contexts/AuthContext";
import { useSidebar } from "../contexts/SidebarContext";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import StarIcon from "@mui/icons-material/Star";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

export default function Dashboard() {
  const { enrolledCourses } = useCourses();
  const { getEnrolledCourses: getNonFormalCourses, getCourseProgress: getNonFormalProgress, certificates } = useNonFormal();
  const { user } = useAuth();
  const { isOpen } = useSidebar();
  const navigate = useNavigate();
  const [tabValue, setTabValue] = useState(0);

  const displayName = user?.name || `${user?.firstName || ""} ${user?.lastName || ""}`.trim() || "Learner";
  const formalCourses = enrolledCourses || [];
  const nonFormalCourses = getNonFormalCourses(user?.id) || [];
  const userCertificates = certificates?.filter((c) => c.userId === user?.id) || [];

  // Calculate total learning hours
  const totalHours = formalCourses.reduce((acc, course) => {
    const weeks = parseInt(course.duration) || 0;
    return acc + weeks;
  }, 0);

  // Count completed courses
  const completedFormal = formalCourses.filter((c) => c.progress >= 100).length;
  const completedNonFormal = nonFormalCourses.filter((c) => {
    const progress = getNonFormalProgress(user?.id, c.id);
    return progress?.completedLessons?.length === c.lessons?.length;
  }).length;
  const completedCourses = completedFormal + completedNonFormal;

  // Stats data
  const statsData = [
    {
      icon: "📚",
      value: (formalCourses.length + nonFormalCourses.length).toString(),
      label: "Courses Enrolled",
      color: "#667eea",
      actionText: "Browse More",
    },
    {
      icon: "⏱️",
      value: `${totalHours}h+`,
      label: "Learning Hours",
      color: "#f093fb",
      actionText: "View Stats",
    },
    {
      icon: "🏆",
      value: (completedCourses + userCertificates.length).toString(),
      label: "Certificates Earned",
      color: "#4facfe",
      actionText: "Share",
    },
  ];

  return (
    <Box sx={{ display: "flex" }}>
      <Sidebar />
      <Box
        sx={{
          flexGrow: 1,
          ml: { xs: 0, md: isOpen ? 25 : 8.75 },
          mt: { xs: 6, md: 8 },
          background: "linear-gradient(135deg, #f8f9fa 0%, #f0f2f5 100%)",
          minHeight: "100vh",
          transition: "margin-left 0.3s ease",
        }}
      >
        <Navbar />

        {/* Page Header Section */}
        <Section background="transparent" pt={4} pb={2} animated={false}>
          <PageHeader
            title={`Welcome back, ${displayName}!`}
            subtitle="Track your learning progress and achievements"
            backgroundGradient="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
          />
        </Section>

        {/* Stats Section */}
        <Section background="transparent" py={{ xs: 4, md: 5 }}>
          <SectionTitle
            title="Your Progress"
            subtitle="Keep track of your learning journey"
            centered
          />
          <StatsGrid stats={statsData} />
        </Section>

        {/* Enrolled Courses Section */}
        <Section background="white" py={{ xs: 4, md: 5 }}>
          <SectionTitle
            title="My Courses"
            subtitle="Continue learning from where you left off"
            centered
          />

          {/* Tabs for Formal and Non-Formal */}
          <Tabs
            value={tabValue}
            onChange={(e, newValue) => setTabValue(newValue)}
            sx={{ borderBottom: "1px solid #e0e0e0", mb: 3 }}
          >
            <Tab label={`📖 Formal Learning (${formalCourses.length})`} />
            <Tab label={`🎯 Non-Formal Learning (${nonFormalCourses.length})`} />
          </Tabs>

          {/* Formal Courses Tab */}
          {tabValue === 0 && (
            <>
              {formalCourses.length === 0 ? (
                <Card sx={{ p: 4, textAlign: "center" }}>
                  <Typography variant="body1" sx={{ color: "#999", mb: 2 }}>
                    You haven't enrolled in any formal courses yet.
                  </Typography>
                  <Button variant="contained" onClick={() => navigate("/formal")}>
                    Explore Formal Courses
                  </Button>
                </Card>
              ) : (
                <EnrolledCoursesList courses={formalCourses} />
              )}
            </>
          )}

          {/* Non-Formal Courses Tab */}
          {tabValue === 1 && (
            <>
              {nonFormalCourses.length === 0 ? (
                <Card sx={{ p: 4, textAlign: "center" }}>
                  <Typography variant="body1" sx={{ color: "#999", mb: 2 }}>
                    You haven't enrolled in any non-formal courses yet.
                  </Typography>
                  <Button variant="contained" onClick={() => navigate("/nonformal")}>
                    Explore Non-Formal Courses
                  </Button>
                </Card>
              ) : (
                <Grid container spacing={3}>
                  {nonFormalCourses.map((course) => {
                    const progress = getNonFormalProgress(user?.id, course.id);
                    const progressPercent = progress?.completedLessons
                      ? (progress.completedLessons.length / (course.lessons?.length || 1)) * 100
                      : 0;
                    const hasCertificate = userCertificates.some((c) => c.courseId === course.id);

                    return (
                      <Grid item xs={12} md={6} key={course.id}>
                        <Card sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
                          <CardContent sx={{ flex: 1 }}>
                            <Stack direction="row" spacing={2} alignItems="flex-start" sx={{ mb: 2 }}>
                              <Box sx={{ fontSize: 40 }}>{course.thumbnail}</Box>
                              <Box sx={{ flex: 1 }}>
                                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                                  {course.title}
                                </Typography>
                                <Stack direction="row" spacing={0.5} alignItems="center">
                                  <StarIcon sx={{ fontSize: 14, color: "#fbbf24" }} />
                                  <Typography variant="caption" sx={{ fontWeight: 600 }}>
                                    {course.rating}
                                  </Typography>
                                </Stack>
                              </Box>
                              {hasCertificate && (
                                <Chip icon={<CheckCircleIcon />} label="Certified" color="success" />
                              )}
                            </Stack>

                            <Typography variant="body2" sx={{ color: "#6b7280", mb: 2 }}>
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
                              <Chip label={course.level} size="small" variant="outlined" />
                              <Chip label={course.duration} size="small" variant="outlined" />
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
            </>
          )}
        </Section>
      </Box>
    </Box>
  );
}