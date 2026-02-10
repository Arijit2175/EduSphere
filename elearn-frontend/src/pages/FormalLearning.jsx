import { Box, Container, Tabs, Tab, Typography, Dialog, DialogTitle, DialogContent, DialogActions, Button, CircularProgress } from "@mui/material";
import { useMemo, useState } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import PageHeader from "../components/PageHeader";
import Section from "../components/Section";
import SectionTitle from "../components/SectionTitle";
import CourseCardAdvanced from "../components/CourseCardAdvanced";

import { useSidebar } from "../contexts/SidebarContext";
import { useAuth } from "../contexts/AuthContext";
import TeacherDashboard from "../components/TeacherDashboard";
import StudentFormalDashboard from "../components/StudentFormalDashboard";
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
      <Box sx={{ display: "flex" }}>
        <Sidebar />
        <Box
          sx={{
            flexGrow: 1,
            background: "linear-gradient(135deg, #f8f9fa 0%, #f0f2f5 100%)",
            minHeight: "100vh",
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
    } else {
      setEnrollmentMessage({ type: "error", message: result.message || "Enrollment failed" });
      // Keep dialog open on error
    }
  };

  // Student view
  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      <Sidebar />
      <Box
        sx={{
          flexGrow: 1,
          background: "linear-gradient(135deg, #f8f9fa 0%, #f0f2f5 100%)",
          minHeight: "100vh",
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
          <Tabs
            value={tabValue}
            onChange={(_, newValue) => setTabValue(newValue)}
            sx={{ mb: 2 }}
            variant="scrollable"
            scrollButtons="auto"
          >
            <Tab label="My Classes" />
            <Tab label="Browse Classes" />
          </Tabs>
          {tabValue === 0 && <StudentFormalDashboard onExploreCourses={() => setTabValue(1)} />}
          {tabValue === 1 && (
            <>
              <Section background="transparent" pt={4} pb={2} animated={false}>
                <PageHeader
                  title="Classes Catalog"
                  subtitle="Structured, curriculum-driven courses for students"
                  backgroundGradient="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                  disableAnimation
                />
              </Section>
              <Section background="transparent" py={{ xs: 4, md: 6 }}>
                <SectionTitle
                  title="Available Classes"
                  subtitle="Choose from our comprehensive collection of formal learning programs"
                  centered
                  variant="h3"
                  titleColor="gradient"
                  subtitleColor="#7f8c8d"
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
            borderTop: "1px solid #e5e7eb",
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
