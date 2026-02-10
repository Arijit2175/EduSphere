import { Box, Container, Tabs, Tab, Typography, Dialog, DialogTitle, DialogContent, DialogActions, Button, CircularProgress } from "@mui/material";
import { useMemo, useState } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import PageHeader from "../components/PageHeader";
import BlurText from "../components/BlurText";
import Section from "../components/Section";
import SectionTitle from "../components/SectionTitle";
import CourseCardAdvanced from "../components/CourseCardAdvanced";
import AuroraText from "../components/AuroraText";

import { useSidebar } from "../contexts/SidebarContext";
import { useAuth } from "../contexts/AuthContext";
import TeacherDashboard from "../components/TeacherDashboard";
import StudentFormalDashboard from "../components/StudentFormalDashboard";

// Animated Background Component (shared)
import { Box as MuiBox } from "@mui/material";
const AnimatedBackground = () => (
  <MuiBox
    sx={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      width: '100vw',
      height: '100vh',
      overflow: 'hidden',
      zIndex: 0,
      pointerEvents: 'none',
    }}
  >
    {[...Array(5)].map((_, i) => (
      <MuiBox
        key={i}
        sx={{
          position: 'absolute',
          width: 450 + i * 150,
          height: 450 + i * 150,
          borderRadius: '50%',
          background: `radial-gradient(circle, ${
            ['rgba(139, 92, 246, 0.15)', 'rgba(99, 102, 241, 0.12)', 'rgba(167, 139, 250, 0.1)', 'rgba(79, 70, 229, 0.08)', 'rgba(196, 181, 253, 0.12)'][i]
          } 0%, transparent 70%)`,
          left: `${[10, 60, 30, 70, 20][i]}%`,
          top: `${[20, 60, 80, 10, 50][i]}%`,
          transform: 'translate(-50%, -50%)',
          animation: `float${i} ${8 + i * 2}s ease-in-out infinite`,
          [`@keyframes float${i}`]: {
            '0%, 100%': { transform: `translate(-50%, -50%) scale(1)` },
            '50%': { transform: `translate(${-50 + (i % 2 === 0 ? 10 : -10)}%, ${-50 + (i % 2 === 0 ? -10 : 10)}%) scale(1.1)` },
          },
        }}
      />
    ))}
    {[...Array(20)].map((_, i) => (
      <MuiBox
        key={`particle-${i}`}
        sx={{
          position: 'absolute',
          width: 4 + (i % 3) * 2,
          height: 4 + (i % 3) * 2,
          borderRadius: '50%',
          bgcolor: ['rgba(139, 92, 246, 0.4)', 'rgba(167, 139, 250, 0.5)', 'rgba(99, 102, 241, 0.4)'][i % 3],
          left: `${(i * 5) % 100}%`,
          top: `${(i * 7) % 100}%`,
          animation: `particle${i} ${10 + (i % 5) * 2}s linear infinite`,
          [`@keyframes particle${i}`]: {
            '0%': { transform: 'translateY(0) rotate(0deg)', opacity: 0.6 },
            '50%': { opacity: 1 },
            '100%': { transform: `translateY(-${100 + i * 10}px) rotate(360deg)`, opacity: 0 },
          },
        }}
      />
    ))}
  </MuiBox>
);
import { useFormalEducation } from "../contexts/FormalEducationContext";

export default function FormalLearning() {
  const { isOpen } = useSidebar();
  const { user } = useAuth();
  const { courses, enrollStudent, getStudentEnrollments, loading } = useFormalEducation();
  const [tabValue, setTabValue] = useState(0);
  const [confirmDialog, setConfirmDialog] = useState({ open: false, course: null });
  const [enrollmentMessage, setEnrollmentMessage] = useState({ type: "", message: "" });

  // Only show formal courses with an instructor_id - memoized to prevent re-renders
  const catalogCourses = useMemo(() => 
    courses.filter(course => course.type === 'formal' && !!course.instructor_id), 
    [courses]
  );
  // Recompute on every render so new enrollments are immediately reflected
  const studentEnrollments = getStudentEnrollments(user?.id);

  // Detect if user is a teacher based on explicit role
  const isTeacher = user?.role === "teacher";
  
  if (loading) {
    return (
      <Box sx={{ display: "flex" }}>
        <Sidebar />
        <Box sx={{ flexGrow: 1, minHeight: "100vh", display: "flex", flexDirection: "column" }}>
          <Navbar />
          <Box sx={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <CircularProgress />
          </Box>
        </Box>
      </Box>
    );
  }
  if (isTeacher) {
    return (
      <Box sx={{ display: "flex", position: 'relative', minHeight: '100vh' }}>
        <AnimatedBackground />
        <Sidebar />
        <Box
          sx={{
            flexGrow: 1,
            background: "linear-gradient(135deg, #f8f9fa 0%, #f0f2f5 100%)",
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column"
          }}
        >
          <Navbar />
          <Box
            sx={{
              flexGrow: 1,
              ml: { xs: 0, md: isOpen ? 25 : 8.75 },
              transition: "margin-left 0.3s ease"
            }}
          >
            <TeacherDashboard />
          </Box>
        </Box>
      </Box>
    );
  }

  const handleEnroll = (course) => {
    // Reset any prior enrollment status when opening dialog
    setEnrollmentMessage({ type: "", message: "" });
    setConfirmDialog({ open: true, course });
  };

  const handleConfirmEnroll = async () => {
    console.log("handleConfirmEnroll invoked", { course: confirmDialog.course, userId: user?.id });
    const course = confirmDialog.course;
    const result = await enrollStudent(user?.id, course.id);
    console.log("handleConfirmEnroll result", result);
    if (result.success) {
      setEnrollmentMessage({ type: "success", message: "Successfully enrolled in the course!" });
      setConfirmDialog({ open: false, course: null });
      setTimeout(() => setEnrollmentMessage({ type: "", message: "" }), 3000);
    return (
      <Box sx={{ display: "flex", position: 'relative', minHeight: "100vh" }}>
        <AnimatedBackground />
        <Sidebar />
        <Box
          sx={{
            flexGrow: 1,
            background: "linear-gradient(135deg, #f8f9fa 0%, #f0f2f5 100%)",
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column"
          }}
        >
          <Navbar />
          <Box
            sx={{
              flexGrow: 1,
              ml: { xs: 0, md: isOpen ? 25 : 8.75 },
              transition: "margin-left 0.3s ease"
            }}
          >
            <Tabs
          sx={{
            flexGrow: 1,
            ml: { xs: 0, md: isOpen ? 25 : 8.75 },
            transition: "margin-left 0.3s ease",
          }}
        >
          <Tabs
            value={tabValue}
            onChange={(_, newValue) => setTabValue(newValue)}
            variant="scrollable"
            scrollButtons="auto"
            sx={{
              mt: 2,
              mb: 2,
              "& .MuiTabs-flexContainer": { gap: 1.5 },
              "& .MuiTabs-indicator": { display: "none" },
            }}
          >
            <Tab
              label="My Classes"
              disableRipple
              sx={{
                px: 2.5,
                py: 1,
                minHeight: "auto",
                textTransform: "none",
                fontWeight: 600,
                borderRadius: 1.5,
                bgcolor: "#4f46e5",
                color: "#fff",
                boxShadow: "3px 3px 0 #000",
                transition: "all 0.2s ease",
                "&:hover": {
                  boxShadow: "none",
                  transform: "translate(3px, 3px)",
                  bgcolor: "#4f46e5",
                },
                "&.Mui-selected": {
                  color: "#fff",
                  boxShadow: "none",
                  transform: "translate(3px, 3px)",
                  bgcolor: "#4f46e5",
                },
              }}
            />
            <Tab
              label="Browse Classes"
              disableRipple
              sx={{
                px: 2.5,
                py: 1,
                minHeight: "auto",
                textTransform: "none",
                fontWeight: 600,
                borderRadius: 1.5,
                bgcolor: "#4f46e5",
                color: "#fff",
                boxShadow: "3px 3px 0 #000",
                transition: "all 0.2s ease",
                "&:hover": {
                  boxShadow: "none",
                  transform: "translate(3px, 3px)",
                  bgcolor: "#4f46e5",
                },
                "&.Mui-selected": {
                  color: "#fff",
                  boxShadow: "none",
                  transform: "translate(3px, 3px)",
                  bgcolor: "#4f46e5",
                },
              }}
            />
          </Tabs>
          {tabValue === 0 && <StudentFormalDashboard onExploreCourses={() => setTabValue(1)} />}
          {tabValue === 1 && (
            <>
              <Section background="transparent" pt={4} pb={2} animated={false}>
                <PageHeader
                  title="Classes Catalog"
                  subtitle="Structured, curriculum-driven courses for students"
                  backgroundGradient="linear-gradient(120deg, #667eea 0%, #764ba2 40%, #667eea 70%, #764ba2 100%)"
                  disableAnimation
                  titleComponent={
                    <BlurText
                      text="Classes Catalog"
                      delay={140}
                      animateBy="words"
                      direction="top"
                      className="page-header-title"
                      style={{
                        fontWeight: 800,
                        marginBottom: "12px",
                        fontSize: "clamp(2rem, 3.4vw, 3.1rem)",
                        letterSpacing: "-0.03em",
                        textShadow: "0 6px 24px rgba(0,0,0,0.15)",
                        color: "#ffffff",
                        fontFamily: '"Space Grotesk", "Segoe UI", "Helvetica Neue", Arial, sans-serif',
                      }}
                    />
                  }
                />
              </Section>
              <Section background="transparent" py={{ xs: 4, md: 6 }}>
                <SectionTitle
                  title="Available Classes"
                  subtitle="Choose from our comprehensive collection of formal learning programs"
                  centered
                  variant="h3"
                  titleColor="#1f2937"
                  subtitleColor="#7f8c8d"
                    titleComponent={
                      <AuroraText>
                        <span style={{ color: '#ff9800', fontWeight: 700 }}>Available</span> Classes
                      </AuroraText>
                    }
                />
                <Container maxWidth="lg">
                  <Box sx={{
                    display: "grid",
                    gridTemplateColumns: {
                      xs: "1fr",
                      sm: "repeat(2, 1fr)",
                      md: "repeat(3, 1fr)",
                      lg: "repeat(4, 1fr)",
                    },
                    gap: 3,
                  }}>
                    {catalogCourses.length === 0 ? (
                      <Box sx={{ width: "100%", textAlign: "center", py: 4 }}>
                        <Typography variant="body1" sx={{ color: "#999" }}>
                          No classes available yet. Your teacher will assign classes.
                        </Typography>
                      </Box>
                    ) : (
                      catalogCourses.map((course, i) => {
                        const alreadyEnrolled = studentEnrollments.some((e) => e.courseId === course.id);
                        return (
                          <Box key={i}>
                            <CourseCardAdvanced
                              id={course.id}
                              title={course.title}
                              description={course.description}
                              icon={course.icon}
                              category={course.category}
                              level={course.level}
                              duration={course.duration}
                              rating={course.rating}
                              students={course.students}
                              instructor={course.instructor}
                              actionText={"Enroll"}
                              enrolledOverride={alreadyEnrolled}
                              onEnroll={() => {
                                if (alreadyEnrolled) {
                                  return { success: false, message: "Already enrolled" };
                                }
                                return handleEnroll(course);
                              }}
                            />
                          </Box>
                        );
                      })
                    )}
                  </Box>
                </Container>
              </Section>
            </>
          )}
        </Box>
        {/* Footer */}
        <Box
          sx={{
            mt: "auto",
            py: 3,
            textAlign: "center",
          }}
        >
          <Typography variant="body2" sx={{ color: "#6b7280" }}>
            © 2025 EduSphere. All rights reserved.
          </Typography>
        </Box>
      </Box>

      {/* Enrollment Confirmation Dialog */}
      <Dialog open={confirmDialog.open} onClose={() => setConfirmDialog({ open: false, course: null })}>
        <DialogTitle>Confirm Enrollment</DialogTitle>
        <DialogContent>
          <Typography sx={{ mt: 2, mb: 2 }}>
            Are you sure you want to enroll in <strong>{confirmDialog.course?.title}</strong>?
          </Typography>
          {enrollmentMessage.message && (
            <Typography 
              sx={{ 
                color: enrollmentMessage.type === 'error' ? '#dc2626' : '#16a34a',
                mb: 2,
                fontWeight: 500
              }}
            >
              {enrollmentMessage.message}
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDialog({ open: false, course: null })}>Cancel</Button>
          <Button onClick={handleConfirmEnroll} variant="contained" color="primary">
            Confirm Enroll
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
