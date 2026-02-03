import API_URL from "../config";
import { Box, Grid, Card, CardContent, Typography, Button, Stack, LinearProgress, Chip, Tab, Tabs, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, CircularProgress } from "@mui/material";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import Section from "../components/Section";
import SectionTitle from "../components/SectionTitle";
import StatsGrid from "../components/StatsGrid";
import EnrolledCoursesList from "../components/EnrolledCoursesList";
import PageHeader from "../components/PageHeader";
import { useCourses } from "../contexts/CoursesContext";
import { useNonFormal } from "../contexts/NonFormalContext";
import { useFormalEducation } from "../contexts/FormalEducationContext";
import { useAuth } from "../contexts/AuthContext";
import { useSidebar } from "../contexts/SidebarContext";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import StarIcon from "@mui/icons-material/Star";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import VideocamIcon from "@mui/icons-material/Videocam";
import EditIcon from "@mui/icons-material/Edit";

export default function Dashboard() {
  const { enrolledCourses } = useCourses();
  const { getEnrolledCourses: getNonFormalCourses, getCourseProgress: getNonFormalProgress, certificates, courses: nonFormalCoursesList, isLoading: nonFormalLoading } = useNonFormal();
  const { getStudentEnrollments, getCourseById, getCourseSchedules, getTeacherCourses, getCourseStudents, scheduleClass, loading: formalLoading } = useFormalEducation();
  const { user } = useAuth();
  const { isOpen } = useSidebar();
  const navigate = useNavigate();
  
  // Show loading screen until both formal and non-formal data are loaded
  const isLoading = formalLoading || nonFormalLoading;
  
  if (isLoading) {
    return (
      <Box sx={{ display: "flex", minHeight: "100vh" }}>
        <Sidebar />
        <Box sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}>
          <Navbar />
          <Box sx={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Box sx={{ textAlign: "center" }}>
              <CircularProgress sx={{ mb: 2 }} />
              <Typography variant="h6" sx={{ color: "#666" }}>
                Loading your dashboard...
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>
    );
  }
  const [tabValue, setTabValue] = useState(0);
  const [statsModalOpen, setStatsModalOpen] = useState(false);
  const [certModalOpen, setCertModalOpen] = useState(false);
  const [studentsModalOpen, setStudentsModalOpen] = useState(false);
  // Store enrolled students for each course (id -> array of students)
  const [enrolledStudentsByCourse, setEnrolledStudentsByCourse] = useState({});
  // Teacher: schedule dialog state
  const [scheduleOpen, setScheduleOpen] = useState(false);
  const [scheduleCourseId, setScheduleCourseId] = useState("");
  const [scheduleForm, setScheduleForm] = useState({ title: "Live Class", startTime: "", duration: 60, meetLink: "" });
  // Certificate view dialog state
  const [viewCert, setViewCert] = useState(null);

  const displayName = user?.name || `${user?.first_name || ""} ${user?.last_name || ""}`.trim() || "Learner";
  // Only show formal courses assigned by a teacher (from enrollments)
  const studentFormalEnrollments = user?.id ? getStudentEnrollments(user.id) : [];
  // Only show formal courses assigned by a teacher (from enrollments) and with at least one live class
  const formalCourses = studentFormalEnrollments
    .map((enr) => {
      const course = getCourseById(enr.courseId) || {};
      const schedules = getCourseSchedules(enr.courseId) || [];
      return {
        id: enr.courseId,
        title: course.title || "Course",
        instructor: course.instructor || course.teacherName || "Instructor",
        duration: course.duration || "",
        progress: enr.progress ?? 0,
        schedules,
      };
    })
    .filter((c) => c.id && c.title && c.instructor && Array.isArray(c.schedules) && c.schedules.length > 0); // Only show if assigned by teacher and has live class
  // Map backend certificate fields to camelCase for display, and add courseName/instructor
  let userCertificates = (certificates || []).map((c) => {
    const course = (nonFormalCoursesList || []).find(course => String(course.id) === String(c.course_id));
    return {
      ...c,
      userId: c.student_id, 
      courseId: c.course_id,
      earnedAt: c.earned_at,
      certificateId: c.certificate_id,
      courseName: course?.title || "Course",
      instructor: course?.instructor || "Instructor",
    };
  }).filter((c) => c.userId === user?.id);
  // Deduplicate by courseId, keeping the latest earnedAt
  userCertificates = Object.values(
    userCertificates.reduce((acc, cert) => {
      if (!acc[cert.courseId] || new Date(cert.earnedAt) > new Date(acc[cert.courseId].earnedAt)) {
        acc[cert.courseId] = cert;
      }
      return acc;
    }, {})
  );
  const certifiedIds = new Set(userCertificates.map(c => c.courseId));
  const nonFormalCourses = (getNonFormalCourses(user?.id) || []).filter(c => !certifiedIds.has(c.id));

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

  // Teacher-specific data
  const teacherCourses = user?.role === "teacher" && (user?.teacher_id || user?.id)
    ? getTeacherCourses(user.teacher_id || user.id)
    : [];
  const teacherStudentsCount = teacherCourses.reduce((acc, c) => acc + (getCourseStudents(c.id)?.length || 0), 0);
  const teacherUpcomingClasses = teacherCourses.reduce((acc, c) => acc + ((c.schedules || []).filter(s => new Date(s.startTime) > new Date()).length), 0);

  // Handler functions for stats actions
  const handleBrowseMore = () => {
    navigate(user?.role === "teacher" ? "/formal" : "/formal");
  };

  const handleViewStats = () => {
    setStatsModalOpen(true);
  };

  const shareCertificate = (cert) => {
    const certificateText = `I earned a certificate for ${cert.courseName || "a course"} on EduSphere! Certificate ID: ${cert.certificateId}`;
    if (navigator.share) {
      navigator.share({
        title: "My EduSphere Certificate",
        text: certificateText,
      }).catch(() => {});
    } else if (navigator.clipboard) {
      navigator.clipboard.writeText(certificateText);
      alert("Certificate details copied to clipboard!");
    }
  };

  const handleShareCertificates = () => {
    setCertModalOpen(true);
  };

  const handleCreateCourse = () => {
    navigate("/formal");
  };

  // When opening students modal, fetch enrolled students for each course
  const handleViewStudents = async () => {
    if (user?.role === "teacher") {
      const newEnrolled = {};
      await Promise.all(
        teacherCourses.map(async (course) => {
          try {
            const res = await fetch(`${API_URL}/enrollments/course/${course.id}/students`);
            if (res.ok) {
              const students = await res.json();
              newEnrolled[course.id] = students;
            } else {
              newEnrolled[course.id] = [];
            }
          } catch {
            newEnrolled[course.id] = [];
          }
        })
      );
      setEnrolledStudentsByCourse(newEnrolled);
      setStudentsModalOpen(true);
    } else {
      setTabValue(1); // Switch to view students for regular users
    }
  };

  const handleScheduleClass = () => {
    if (teacherCourses.length > 0) {
      setScheduleCourseId(teacherCourses[0].id);
      setScheduleForm({ title: "Live Class", startTime: "", duration: 60, meetLink: "" });
      setScheduleOpen(true);
    }
  };

  const handleAddAssignment = () => {
    navigate("/formal");
  };

  // Stats data (role-aware)
  const statsData = user?.role === "teacher"
    ? [
        { icon: "📘", value: teacherCourses.length.toString(), label: "Courses Taught", color: "#667eea", actionText: "Create", onAction: handleCreateCourse },
        { icon: "👩‍🎓", value: teacherStudentsCount.toString(), label: "Enrolled Students", color: "#10b981", actionText: "View", onAction: handleViewStudents },
        { icon: "📅", value: teacherUpcomingClasses.toString(), label: "Upcoming Classes", color: "#f59e0b", actionText: "Schedule", onAction: handleScheduleClass },
        { icon: "🧪", value: (teacherCourses.reduce((acc,c)=> acc + (c.assignments?.length||0),0)).toString(), label: "Assignments", color: "#f093fb", actionText: "Add", onAction: handleAddAssignment },
      ]
    : [
        { icon: "📚", value: (formalCourses.length + nonFormalCourses.length).toString(), label: "Courses Enrolled", color: "#667eea", actionText: "Browse More", onAction: handleBrowseMore },
        { icon: "⏱️", value: `${totalHours}h+`, label: "Learning Hours", color: "#f093fb", actionText: "View Stats", onAction: handleViewStats },
        { icon: "🏆", value: userCertificates.length.toString(), label: "Certificates Earned", color: "#4facfe", actionText: "Share", onAction: handleShareCertificates },
      ];

  return (
    <Box sx={{ display: "flex" }}>
      <Sidebar />
      <Box
        sx={{
          flexGrow: 1,
          background: "transparent",
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Background Video with Blur */}
        <Box
          sx={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            zIndex: -2,
            overflow: "hidden",
          }}
        >
          <video
            autoPlay
            loop
            muted
            playsInline
            style={{
              width: "100vw",
              height: "100vh",
              objectFit: "cover",
              filter: "blur(6px) brightness(0.8)",
              position: "absolute",
              top: 0,
              left: 0,
              zIndex: -2,
            }}
          >
            <source src="/videos/webpage-video.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </Box>
        {/* Transparent blurred background overlay for extra softness */}
        <Box
          sx={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            zIndex: -1,
            pointerEvents: "none",
            background: "transparent",
            backdropFilter: "blur(2px)",
          }}
        />
        <Navbar />
        <Box
          sx={{
            flexGrow: 1,
            ml: { xs: 0, md: isOpen ? 25 : 8.75 },
            transition: "margin-left 0.3s ease",
            position: "relative",
            zIndex: 1,
          }}
        >

        {/* Page Header Section */}
        <Section background="transparent" pt={4} pb={2} animated={false}>
          <PageHeader
            title={`Welcome back, ${displayName}!`}
            subtitle="Track your learning progress and achievements"
            backgroundGradient="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
            showAvatar={true}
            userName={displayName}
            avatarSrc={user?.avatar || null}
          />
        </Section>

        {/* Stats Section */}
        <Section background="transparent" py={{ xs: 4, md: 5 }}>
          <SectionTitle
            title="Your Progress"
            subtitle="Keep track of your learning journey"
            centered
          />
          <StatsGrid stats={statsData.filter(stat => stat.label !== "Upcoming Classes")} />
        </Section>

        {/* Teacher Dashboard override */}
        {user?.role === "teacher" ? (
          <Section background="transparent" py={{ xs: 2, md: 3 }} noContainer>
            <Box
              sx={{
                maxWidth: { xs: '100%', md: 1100 },
                mx: 'auto',
                background: 'white',
                borderRadius: '28px',
                border: '1px solid #e0e7ff',
                boxShadow: '0 4px 24px rgba(102,126,234,0.10)',
                px: { xs: 1, md: 4 },
                py: { xs: 2, md: 3 },
              }}
            >
              <SectionTitle
                title="Teacher Dashboard"
                subtitle={`Welcome, ${displayName}!`}
                centered
                variant="h3"
                titleColor="gradient"
                subtitleColor="#7f8c8d"
              />

              {teacherCourses.length === 0 ? (
                <Card sx={{ p: 4, textAlign: "center" }}>
                  <Typography variant="body1" sx={{ color: "#999", mb: 2 }}>
                    You haven't created any courses yet.
                  </Typography>
                  <Button variant="contained" onClick={() => navigate("/formal")}>Create Course</Button>
                </Card>
              ) : (
                <Grid container spacing={3}>
                  {teacherCourses.map((course) => (
                    <Grid key={course.id}>
                      <Card>
                        <CardContent>
                          <Stack direction="row" alignItems="flex-start">
                            <Box sx={{ flex: 1 }}>
                              <Typography variant="h6" sx={{ fontWeight: 700 }}>{course.title}</Typography>
                              <Typography variant="caption" sx={{ color: "#6b7280" }}>
                                {course.students?.length || getCourseStudents(course.id)?.length || 0} students
                              </Typography>
                            </Box>
                            <Stack direction="row" spacing={2} sx={{ ml: 2 }}>
                              <Button 
                                size="small" 
                                variant="outlined"
                                startIcon={<EditIcon />}
                                onClick={() => navigate("/formal")}
                              >
                                Manage
                              </Button>
                            </Stack>
                          </Stack>

                          {(course.schedules && course.schedules.length > 0) && (
                            <Box sx={{ mt: 2 }}>
                              <Typography variant="subtitle2" sx={{ mb: 1 }}>Scheduled Class</Typography>
                              <Stack spacing={1}>
                                <Stack key={course.schedules[0].id} direction="row" spacing={1} alignItems="center">
                                  <Chip icon={<VideocamIcon />} label={course.schedules[0].title} size="small" />
                                  {course.schedules[0].meetLink && (
                                    <Button size="small" href={course.schedules[0].meetLink} target="_blank" rel="noopener noreferrer">Open</Button>
                                  )}
                                </Stack>
                              </Stack>
                            </Box>
                          )}
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              )}

              {/* Schedule Class Dialog */}
              <Dialog open={scheduleOpen} onClose={() => setScheduleOpen(false)} maxWidth="sm" fullWidth>
                <DialogTitle>Schedule a Class</DialogTitle>
                <DialogContent>
                  <Stack spacing={2} sx={{ mt: 1 }}>
                    <TextField 
                      label="Title" 
                      value={scheduleForm.title}
                      onChange={(e)=> setScheduleForm({ ...scheduleForm, title: e.target.value })}
                      fullWidth
                    />
                    <TextField 
                      label="Start Time (ISO or yyyy-mm-ddThh:mm)"
                      placeholder="2025-12-11T19:30"
                      value={scheduleForm.startTime}
                      onChange={(e)=> setScheduleForm({ ...scheduleForm, startTime: e.target.value })}
                      fullWidth
                    />
                    <TextField 
                      label="Duration (minutes)"
                      type="number"
                      value={scheduleForm.duration}
                      onChange={(e)=> setScheduleForm({ ...scheduleForm, duration: Number(e.target.value||60) })}
                      fullWidth
                    />
                    <TextField 
                      label="Meeting Link"
                      placeholder="https://meet.google.com/xxx-xxxx-xxx"
                      value={scheduleForm.meetLink}
                      onChange={(e)=> setScheduleForm({ ...scheduleForm, meetLink: e.target.value })}
                      helperText="Enter a valid meeting link (Google Meet, Zoom, Teams, Whereby, or Webex)"
                      fullWidth
                    />
                  </Stack>
                </DialogContent>
                <DialogActions>
                  <Button onClick={()=> setScheduleOpen(false)}>Cancel</Button>
                  <Button 
                    variant="contained" 
                    onClick={()=>{
                      if (!scheduleCourseId) return;
                      
                      // Validate meet link if provided
                      if (scheduleForm.meetLink && scheduleForm.meetLink.trim()) {
                        const validPatterns = [
                          /^https?:\/\/(meet\.google\.com|zoom\.us|teams\.microsoft\.com|whereby\.com|webex\.com)/i,
                        ];
                        const isValid = validPatterns.some(pattern => pattern.test(scheduleForm.meetLink));
                        if (!isValid) {
                          alert('Please enter a valid meeting link from Google Meet, Zoom, Microsoft Teams, Whereby, or Webex');
                          return;
                        }
                      }
                      
                      const start = scheduleForm.startTime && !isNaN(new Date(scheduleForm.startTime)) ? new Date(scheduleForm.startTime).toISOString() : new Date().toISOString();
                      scheduleClass(scheduleCourseId, { ...scheduleForm, startTime: start });
                      setScheduleOpen(false);
                    }}
                  >
                    Save
                  </Button>
                </DialogActions>
              </Dialog>
            </Box>
          </Section>
        ) : (
        
        /* Enrolled Courses Section */
        <Box sx={{ px: { xs: 2, md: 0 }, pb: 4 }}>
          <Box
            sx={{
              maxWidth: { xs: '100%', md: 1100 },
              mx: 'auto',
              background: 'white',
              borderRadius: '28px',
              border: '1px solid #e0e7ff',
              boxShadow: '0 4px 20px rgba(102, 126, 234, 0.08)',
              p: { xs: 3, md: 4 },
            }}
          >
            <SectionTitle
              title="My Courses"
              subtitle="Continue learning from where you left off"
              centered
              variant="h3"
              titleColor="gradient"
              subtitleColor="#7f8c8d"
            />

          {/* Tabs for Formal and Non-Formal */}
          <Tabs
            value={tabValue}
            onChange={(e, newValue) => setTabValue(newValue)}
            sx={{ borderBottom: "1px solid #e0e0e0", mb: 3 }}
          >
            <Tab label={`📖 Classes (${formalCourses.length})`} />
            {user?.role !== "teacher" && (
              <Tab label={`🎯 Courses (${nonFormalCourses.length})`} />
            )}
          </Tabs>

          {/* Formal Courses Tab */}
          {tabValue === 0 && (
            <>
              {formalCourses.length === 0 ? (
                <Card sx={{ p: 4, textAlign: "center" }}>
                  <Typography variant="body1" sx={{ color: "#999", mb: 2 }}>
                    You haven't enrolled in any classes yet.
                  </Typography>
                  <Button variant="contained" onClick={() => navigate("/formal")}>
                    Explore Classes
                  </Button>
                </Card>
              ) : (
                <EnrolledCoursesList courses={formalCourses} />
              )}
            </>
          )}

          {/* Non-Formal Courses Tab */}
          {tabValue === 1 && user?.role !== "teacher" && (
            <>
              {nonFormalCourses.length === 0 ? (
                <Card sx={{ p: 4, textAlign: "center" }}>
                  <Typography variant="body1" sx={{ color: "#999", mb: 2 }}>
                    You haven't enrolled in any courses yet.
                  </Typography>
                  <Button variant="contained" onClick={() => navigate("/nonformal")}>
                    Explore Courses
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
                      <Grid key={course.id}>
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
                              {!certifiedIds.has(course.id) && (
                                <Button
                                  fullWidth
                                  variant="contained"
                                  onClick={() => navigate(`/nonformal/learn/${course.id}`)}
                                >
                                  Continue Learning
                                </Button>
                              )}
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
          </Box>
        </Box>
        )}

        {/* Page Footer */}
        <Box sx={{ py: 2, textAlign: "center", mt: 4 }}>
          <Typography variant="body2" sx={{ color: "#f5f7fa", fontSize: "0.9rem" }}>
            © 2025 EduSphere. All rights reserved.
          </Typography>
        {/* Stats Modal */}
        <Dialog open={statsModalOpen} onClose={() => setStatsModalOpen(false)} maxWidth="sm" fullWidth>
          <DialogTitle sx={{ fontWeight: 700, fontSize: "1.3rem" }}>📊 Your Learning Statistics</DialogTitle>
          <DialogContent sx={{ mt: 2 }}>
            <Grid container spacing={2}>
              <Grid>
                <Box sx={{ p: 2, background: "#f5f7fa", borderRadius: 2 }}>
                  <Typography variant="body2" sx={{ color: "#666", mb: 0.5 }}>Total Courses Enrolled</Typography>
                  <Typography variant="h5" sx={{ fontWeight: 700, color: "#667eea" }}>
                    {formalCourses.length + nonFormalCourses.length}
                  </Typography>
                </Box>
              </Grid>
              <Grid>
                <Box sx={{ p: 2, background: "#f5f7fa", borderRadius: 2 }}>
                  <Typography variant="body2" sx={{ color: "#666", mb: 0.5 }}>Formal Courses</Typography>
                  <Typography variant="h5" sx={{ fontWeight: 700, color: "#667eea" }}>
                    {formalCourses.length}
                  </Typography>
                </Box>
              </Grid>
              <Grid>
                <Box sx={{ p: 2, background: "#f5f7fa", borderRadius: 2 }}>
                  <Typography variant="body2" sx={{ color: "#666", mb: 0.5 }}>Non-Formal Courses</Typography>
                  <Typography variant="h5" sx={{ fontWeight: 700, color: "#667eea" }}>
                    {nonFormalCourses.length}
                  </Typography>
                </Box>
              </Grid>
              <Grid>
                <Box sx={{ p: 2, background: "#f5f7fa", borderRadius: 2 }}>
                  <Typography variant="body2" sx={{ color: "#666", mb: 0.5 }}>Total Learning Hours</Typography>
                  <Typography variant="h5" sx={{ fontWeight: 700, color: "#f093fb" }}>
                    {totalHours}+ hours
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12}>
                <Box sx={{ p: 2, background: "#f5f7fa", borderRadius: 2 }}>
                  <Typography variant="body2" sx={{ color: "#666", mb: 0.5 }}>Certificates Earned</Typography>
                  <Typography variant="h5" sx={{ fontWeight: 700, color: "#4facfe" }}>
                    {userCertificates.length}
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setStatsModalOpen(false)} variant="contained" sx={{ background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" }}>
              Close
            </Button>
          </DialogActions>
        </Dialog>

        {/* Certificates Modal */}
        <Dialog open={certModalOpen} onClose={() => setCertModalOpen(false)} maxWidth="sm" fullWidth>
          <DialogTitle sx={{ fontWeight: 700, fontSize: "1.2rem" }}>🏆 Share Your Certificates</DialogTitle>
          <DialogContent sx={{ mt: 1.5 }}>
            {userCertificates.length === 0 ? (
              <Typography variant="body2" sx={{ color: "#666" }}>
                You have not earned any certificates yet.
              </Typography>
            ) : (
              <Grid container spacing={2}>
                {userCertificates.map((cert) => (
                  <Grid key={cert.certificateId}>
                    <Box sx={{ p: 2, border: "1px solid #e5e7eb", borderRadius: 2, background: "#f8fafc" }}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 0.5 }}>
                        {cert.courseName || "Course"}
                      </Typography>
                      <Typography variant="body2" sx={{ color: "#6b7280", mb: 0.5 }}>
                        Certificate ID: {cert.certificateId}
                      </Typography>
                      <Typography variant="caption" sx={{ color: "#9ca3af" }}>
                        Earned on {new Date(cert.earnedAt).toLocaleDateString()}
                      </Typography>
                      <Box sx={{ mt: 1.5, display: "flex", gap: 1, justifyContent: "flex-end" }}>
                        <Button
                          size="small"
                          variant="outlined"
                          onClick={() => setViewCert(cert)}
                        >
                          View
                        </Button>
                        <Button
                          size="small"
                          variant="contained"
                          onClick={() => shareCertificate(cert)}
                          sx={{ background: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)" }}
                        >
                          Share
                        </Button>
                      </Box>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setCertModalOpen(false)} variant="outlined">Close</Button>
          </DialogActions>
        </Dialog>

        {/* Certificate View Dialog (should be at root, not inside map or modal) */}
        <Dialog open={!!viewCert} onClose={() => setViewCert(null)} maxWidth="sm" fullWidth>
          <DialogTitle sx={{ fontWeight: 700, fontSize: "1.2rem" }}>🎓 Certificate Preview</DialogTitle>
          <DialogContent>
            {viewCert && (
              <Box sx={{ p: 2, textAlign: "center" }}>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>{viewCert.courseName}</Typography>
                <Typography variant="body2" sx={{ mb: 1 }}>Instructor: {viewCert.instructor}</Typography>
                <Typography variant="body2" sx={{ mb: 1 }}>Date: {new Date(viewCert.earnedAt).toLocaleDateString()}</Typography>
                <Typography variant="body2" sx={{ mb: 1 }}>Certificate ID: {viewCert.certificateId}</Typography>
              </Box>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setViewCert(null)} variant="outlined">Close</Button>
            {viewCert && (
              <Button
                variant="contained"
                onClick={() => {
                  const printWindow = window.open('', '_blank');
                  printWindow.document.write(`
                    <html><head><title>Certificate</title></head><body style="margin:0;padding:0;">
                    <div style="font-family:sans-serif;padding:40px;text-align:center;background:linear-gradient(135deg,#fbbf24 0%,#f59e0b 100%);color:white;border-radius:24px;width:700px;margin:40px auto;">
                      <h1 style="font-size:2.5rem;font-weight:800;margin-bottom:24px;">Certificate of Completion</h1>
                      <h2 style="margin-bottom:8px;">This certifies that</h2>
                      <h2 style="font-size:2rem;font-weight:700;margin-bottom:24px;">${user?.name || user?.firstName || "Student"}</h2>
                      <div style="font-size:1.2rem;margin-bottom:16px;">has successfully completed the course</div>
                      <h2 style="font-size:1.5rem;font-weight:700;margin-bottom:16px;">${viewCert.courseName}</h2>
                      <div style="margin-bottom:8px;">Instructor: ${viewCert.instructor}</div>
                      <div style="margin-bottom:8px;">Date: ${new Date(viewCert.earnedAt).toLocaleDateString()}</div>
                      <div style="margin-bottom:8px;">Certificate ID: ${viewCert.certificateId}</div>
                    </div>
                    </body></html>
                  `);
                  printWindow.document.close();
                  printWindow.print();
                }}
              >
                Download
              </Button>
            )}
          </DialogActions>
        </Dialog>

        {/* Enrolled Students Modal (Teacher) */}
        <Dialog open={studentsModalOpen} onClose={() => setStudentsModalOpen(false)} maxWidth="md" fullWidth>
          <DialogTitle sx={{ fontWeight: 700, fontSize: "1.2rem" }}>
            👩‍🎓 All Enrolled Students
          </DialogTitle>
          <DialogContent sx={{ mt: 1.5 }}>
            {teacherCourses.length === 0 ? (
              <Typography variant="body2" sx={{ color: "#666", textAlign: "center", py: 3 }}>
                No courses created yet.
              </Typography>
            ) : (
              <Box>
                {teacherCourses.map((course) => {
                  const students = enrolledStudentsByCourse[course.id] || [];
                  return (
                    <Box key={course.id} sx={{ mb: 3 }}>
                      <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, color: "#667eea" }}>
                        {course.title}
                      </Typography>
                      {students.length > 0 ? (
                        <TableContainer component={Paper} sx={{ mb: 2 }}>
                          <Table size="small">
                            <TableHead>
                              <TableRow sx={{ background: "#f3f4f6" }}>
                                <TableCell sx={{ fontWeight: 700 }}>Student Name</TableCell>
                                <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {students.map((student, idx) => (
                                <TableRow key={student.id || idx} sx={{ "&:hover": { background: "#f9fafb" } }}>
                                  <TableCell>{(student.first_name && student.last_name) ? `${student.first_name} ${student.last_name}` : (student.name || student.studentName || student.email || "Student")}</TableCell>
                                  <TableCell>
                                    <Chip label="Enrolled" size="small" color="success" variant="outlined" />
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </TableContainer>
                      ) : (
                        <Typography variant="body2" sx={{ color: "#9ca3af", fontStyle: "italic", mb: 2 }}>
                          No students enrolled in this course yet.
                        </Typography>
                      )}
                    </Box>
                  );
                })}
              </Box>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setStudentsModalOpen(false)} variant="contained" sx={{ background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" }}>
              Close
            </Button>
          </DialogActions>
        </Dialog>
        </Box>
        </Box>
      </Box>
    </Box>
  );
}