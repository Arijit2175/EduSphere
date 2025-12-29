import { Box, Container, Tabs, Tab, Typography } from "@mui/material";
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
  const { courses, enrollStudent, getStudentEnrollments } = useFormalEducation();
  const [tabValue, setTabValue] = useState(0);

  // Detect if user is a teacher based on explicit role
  const isTeacher = user?.role === "teacher";
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

  // Only show formal courses with an instructor_id
  const catalogCourses = courses.filter(course => course.type === 'formal' && !!course.instructor_id);
  const studentEnrollments = getStudentEnrollments(user?.id);

  const handleEnroll = (course) => {
    const result = enrollStudent(user?.id, course.id);
    return result;
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
            sx={{ mb: 2, borderBottom: 1, borderColor: "divider" }}
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
                      catalogCourses
                        .filter(course => !studentEnrollments.some((e) => e.courseId === course.id))
                        .map((course, i) => (
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
                              enrolledOverride={false}
                              onEnroll={handleEnroll}
                            />
                          </Box>
                        ))
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
    </Box>
  );
}
