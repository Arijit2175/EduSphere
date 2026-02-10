import API_URL from "../config";
import { Box, Card, CardContent, Button, TextField, Typography, Dialog, DialogTitle, DialogContent, DialogActions, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Grid, Chip, Stack, MenuItem } from "@mui/material";
import { useState, useMemo, useEffect } from "react";
import { useFormalEducation } from "../contexts/FormalEducationContext";
import { useAuth } from "../contexts/AuthContext";
import Section from "./Section";
import SectionTitle from "./SectionTitle";
import AuroraText from "./AuroraText";
import { Add, Edit, VideoCall, People, CalendarMonth, Link, Check, Close } from "@mui/icons-material";

// Helper function to get grade color
const getGradeColor = (grade) => {
  if (!grade) return { color: "#6b7280", background: "#f3f4f6", border: "#e5e7eb" };
  
  const gradeStr = String(grade).toUpperCase().trim();
  
  // Letter grades
  if (/^A[+]?$/.test(gradeStr)) return { color: "#047857", background: "#d1fae5", border: "#10b981" };
  if (/^B[+]?$/.test(gradeStr)) return { color: "#16a34a", background: "#dcfce7", border: "#22c55e" };
  if (/^C[+]?$/.test(gradeStr)) return { color: "#ca8a04", background: "#fef9c3", border: "#eab308" };
  if (/^D[+]?$/.test(gradeStr)) return { color: "#ea580c", background: "#fed7aa", border: "#f97316" };
  if (/^F$/.test(gradeStr)) return { color: "#dc2626", background: "#fecaca", border: "#ef4444" };
  
  // Numeric grades (0-100)
  const numericGrade = parseFloat(gradeStr);
  if (!isNaN(numericGrade)) {
    if (numericGrade >= 90) return { color: "#047857", background: "#d1fae5", border: "#10b981" };
    if (numericGrade >= 80) return { color: "#16a34a", background: "#dcfce7", border: "#22c55e" };
    if (numericGrade >= 70) return { color: "#ca8a04", background: "#fef9c3", border: "#eab308" };
    if (numericGrade >= 60) return { color: "#ea580c", background: "#fed7aa", border: "#f97316" };
    return { color: "#dc2626", background: "#fecaca", border: "#ef4444" };
  }
  
  // Pass/Fail
  if (/^PASS(ED)?$/i.test(gradeStr)) return { color: "#047857", background: "#d1fae5", border: "#10b981" };
  if (/^FAIL(ED)?$/i.test(gradeStr)) return { color: "#dc2626", background: "#fecaca", border: "#ef4444" };
  
  // Default
  return { color: "#6b7280", background: "#f3f4f6", border: "#e5e7eb" };
};

export default function TeacherDashboard() {
    // Show/hide assignments list in Manage dialog
    const [showAssignmentsList, setShowAssignmentsList] = useState(false);
  // For attendance confirmation dialog
  const [confirmDialog, setConfirmDialog] = useState({ open: false, student: null, status: "" });
  // All useState declarations at the top
  const [openDialog, setOpenDialog] = useState(false);
  const [formData, setFormData] = useState({ title: "", description: "", duration: "", schedule: "" });
  const [openScheduleDialog, setOpenScheduleDialog] = useState(false);
  const [scheduleForm, setScheduleForm] = useState({ title: "", startTime: "", duration: 60, meetLink: "", courseId: "" });
  const [attendanceDialog, setAttendanceDialog] = useState({ open: false, courseId: "", scheduleId: "" });
  const [attendanceDetailsDialog, setAttendanceDetailsDialog] = useState({ open: false, students: [], type: "" });
  const [attendanceDetailsEnrolledStudents, setAttendanceDetailsEnrolledStudents] = useState([]); // For present/absent dialog
  const [manageDialog, setManageDialog] = useState({ open: false, course: null });
  const [enrolledStudents, setEnrolledStudents] = useState([]);
  const [materialForm, setMaterialForm] = useState({ name: "", file: null });
  const [assignmentForm, setAssignmentForm] = useState({ title: "", description: "", dueDate: "" });
  const [gradeDialog, setGradeDialog] = useState({ open: false, submission: null });
  const [gradeForm, setGradeForm] = useState({ grade: "", feedback: "" });
  // Show/hide materials list in Manage dialog
  const [showMaterialsList, setShowMaterialsList] = useState(false);
  // Fetch enrolled students for present/absent dialog when it opens
  useEffect(() => {
    const fetchEnrolled = async () => {
      if (attendanceDetailsDialog.open) {
        // Try to get courseId from the first student (they have schedule/course info)
        const first = attendanceDetailsDialog.students?.[0];
        const courseId = first?.courseId || first?.course_id;
        if (courseId) {
          try {
            const res = await fetch(`${API_URL}/enrollments/course/${courseId}/students`);
            if (res.ok) {
              const response = await res.json();
              const students = response.data || response || [];
              setAttendanceDetailsEnrolledStudents(Array.isArray(students) ? students : []);
            } else {
              setAttendanceDetailsEnrolledStudents([]);
            }
          } catch {
            setAttendanceDetailsEnrolledStudents([]);
          }
        } else {
          setAttendanceDetailsEnrolledStudents([]);
        }
      } else {
        setAttendanceDetailsEnrolledStudents([]);
      }
    };
    fetchEnrolled();
  }, [attendanceDetailsDialog.open]);

  // Now all logic and hooks
  const { user } = useAuth();
  const { courses, getTeacherCourses, createCourse, scheduleClass, getCourseStudents, markAttendanceForClass, updateAttendanceForClass, getAssignmentSubmissions, reviewSubmission, deleteMaterial, addMaterial, createAssignment } = useFormalEducation();

  useEffect(() => {
    if (attendanceDialog.open && attendanceDialog.courseId) {
      fetch(`${API_URL}/enrollments/course/${attendanceDialog.courseId}/students`)
        .then(res => res.ok ? res.json() : [])
        .then(response => {
          const data = response.data || response || [];
          setEnrolledStudents(Array.isArray(data) ? data : []);
        })
        .catch(() => setEnrolledStudents([]));
    } else {
      setEnrolledStudents([]);
    }
  }, [attendanceDialog.open, attendanceDialog.courseId]);

  // Delete assignment helper
  async function handleDeleteAssignment(courseId, assignmentId) {
    if (!window.confirm('Are you sure you want to delete this assignment?')) return;
    const res = await fetch(`${API_URL}/assignments/${assignmentId}`, {
      method: 'DELETE',
      headers: user?.access_token ? { Authorization: `Bearer ${user.access_token}` } : {}
    });
    if (res.ok) {
      // Fetch latest assignments from backend and update dialog
      try {
        const res2 = await fetch(`${API_URL}/assignments/?course_id=${courseId}`);
        if (res2.ok) {
          const assignments = await res2.json();
          setManageDialog(prev => ({ open: true, course: { ...prev.course, assignments } }));
        }
      } catch {}
    } else {
      alert('Failed to delete assignment.');
    }
  }

  useEffect(() => {
    const fetchEnrolledStudents = async () => {
      if (manageDialog.open && manageDialog.course?.id) {
        try {
          const res = await fetch(`${API_URL}/enrollments/course/${manageDialog.course.id}/students`);
          if (res.ok) {
            const response = await res.json();
            const students = response.data || response || [];
            setEnrolledStudents(students);
          } else {
            setEnrolledStudents([]);
          }
        } catch {
          setEnrolledStudents([]);
        }
      } else {
        setEnrolledStudents([]);
      }
    };
    fetchEnrolledStudents();
  }, [manageDialog.open, manageDialog.course?.id]);

  const teacherCourses = useMemo(() => getTeacherCourses(user?.teacher_id || user?.id), [getTeacherCourses, user?.teacher_id, user?.id]);

  const [liveClasses, setLiveClasses] = useState([]);

  // Fetch live classes and attendance records on mount or when courses change
  useEffect(() => {
    const fetchAttendanceForSessions = async () => {
      if (!user || !user.access_token) return;
      // Build sessions from teacherCourses
      const sessions = teacherCourses.flatMap((course) =>
        (course.schedules || []).map((s) => ({
          ...s,
          courseTitle: course.title,
          courseId: course.id,
        }))
      ).sort((a, b) => new Date(a.startTime) - new Date(b.startTime));

      // For each session, fetch attendance from backend
      const sessionsWithAttendance = await Promise.all(
        sessions.map(async (session) => {
          try {
            const res = await fetch(`${API_URL}/attendance/?schedule_id=${session.id}`, {
              headers: { Authorization: `Bearer ${user.access_token}` }
            });
            if (res.ok) {
              const attendees = await res.json();
              return { ...session, attendees };
            }
          } catch {}
          return { ...session, attendees: [] };
        })
      );
      setLiveClasses(sessionsWithAttendance);
    };
    fetchAttendanceForSessions();
  }, [courses, user?.id, user?.access_token]);

  const handleCreate = () => {
    if (formData.title && formData.description) {
      createCourse({
        ...formData,
        instructor_id: user?.teacher_id || user?.id,
        teacherName: `${user?.first_name || ""} ${user?.last_name || ""}`.trim(),
      });
      setFormData({ title: "", description: "", duration: "", schedule: "" });
      setOpenDialog(false);
    }
  };

  const handleScheduleClass = () => {
    if (!scheduleForm.courseId || !scheduleForm.startTime) return;
    
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
    
    const startIso = (() => {
      const d = new Date(scheduleForm.startTime);
      return isNaN(d.getTime()) ? new Date().toISOString() : d.toISOString();
    })();
    scheduleClass(scheduleForm.courseId, { ...scheduleForm, startTime: startIso });
    setScheduleForm({ title: "", startTime: "", duration: 60, meetLink: "", courseId: "" });
    setOpenScheduleDialog(false);
  };

  // Show confirmation dialog before marking attendance
  const handleMarkAttendance = (studentId, status) => {
    setConfirmDialog({ open: true, student: studentId, status });
  };

  // Actually mark attendance after confirmation
  const confirmMarkAttendance = () => {
    const { student, status } = confirmDialog;
    const { courseId, scheduleId } = attendanceDialog;
    if (!courseId || !scheduleId || !student) return;
    // Find the session in liveClasses
    const session = liveClasses.find(s => s.id === scheduleId);
    let attendanceId = null;
    let alreadyMarked = false;
    if (session && Array.isArray(session.attendees)) {
      const existing = session.attendees.find(a => (a.student_id || a.studentId || a.id) === student);
      if (existing) {
        attendanceId = existing.id;
        alreadyMarked = true;
      }
    }
    if (!alreadyMarked) {
      markAttendanceForClass(courseId, scheduleId, student, status);
    }
    setConfirmDialog({ open: false, student: null, status: "" });
    setAttendanceDialog({ ...attendanceDialog });
  };

  return (
    <>
    <Box>
      <Section background="transparent">
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
          <Box>
            <SectionTitle
              titleComponent={<AuroraText>Teacher Dashboard</AuroraText>}
              subtitle={`Welcome, ${user?.first_name || "Teacher"}!`}
              centered={false}
              titleColor="gradient"
              subtitleColor="#7f8c8d"
            />
          </Box>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => setOpenDialog(true)}
            sx={{
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              color: "white",
            }}
          >
            Create Course
          </Button>
        </Box>

        {/* Course Statistics */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ background: "#667eea20", border: "1px solid #667eea" }}>
              <CardContent sx={{ textAlign: "center" }}>
                <Typography variant="h4" sx={{ fontWeight: 700, color: "#667eea" }}>
                  {teacherCourses.length}
                </Typography>
                <Typography variant="body2" sx={{ color: "#666" }}>
                  Active Courses
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ background: "#4facfe20", border: "1px solid #4facfe" }}>
              <CardContent sx={{ textAlign: "center" }}>
                <Typography variant="h4" sx={{ fontWeight: 700, color: "#4facfe" }}>
                  {teacherCourses.reduce((acc, c) => acc + (Array.isArray(c.materials) ? c.materials.length : 0), 0)}
                </Typography>
                <Typography variant="body2" sx={{ color: "#666" }}>
                  Materials Uploaded
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ background: "#10b98120", border: "1px solid #10b981" }}>
              <CardContent sx={{ textAlign: "center" }}>
                <Typography variant="h4" sx={{ fontWeight: 700, color: "#10b981" }}>
                  {teacherCourses.reduce((acc, c) => acc + (Array.isArray(c.assignments) ? c.assignments.length : 0), 0)}
                </Typography>
                <Typography variant="body2" sx={{ color: "#666" }}>
                  Assignments Created
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* My Courses */}
        <SectionTitle
          titleComponent={<AuroraText>My Courses</AuroraText>}
          subtitle="Manage your courses and students"
          centered={false}
          titleColor="gradient"
          subtitleColor="#7f8c8d"
        />
        
        {teacherCourses.length === 0 ? (
          <Card sx={{ p: 4, textAlign: "center" }}>
            <Typography variant="body1" sx={{ color: "#999" }}>
              You haven't created any courses yet. Click "Create Course" to get started!
            </Typography>
          </Card>
        ) : (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow sx={{ background: "#f0f2f5" }}>
                  <TableCell sx={{ fontWeight: 700 }}>Course Name</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Description</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {teacherCourses.map((course) => (
                  <TableRow key={course.id} sx={{ "&:hover": { background: "#f9f9f9" } }}>
                    <TableCell sx={{ fontWeight: 600 }}>{course.title}</TableCell>
                    <TableCell>{course.description.substring(0, 30)}...</TableCell>
                    <TableCell>
                      <Button 
                        size="small" 
                        variant="outlined" 
                        startIcon={<Edit />}
                        onClick={() => setManageDialog({ open: true, course })}
                      >
                        Manage
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Section>

      {/* Live Classes & Attendance */}
      <Section background="transparent">
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
          <SectionTitle
            titleComponent={<AuroraText>Live Classes</AuroraText>}
            subtitle="Schedule sessions and track attendance"
            centered={false}
            titleColor="gradient"
            subtitleColor="#7f8c8d"
          />
          <Button
            variant="contained"
            startIcon={<VideoCall />}
            onClick={() => setOpenScheduleDialog(true)}
            sx={{ background: "linear-gradient(135deg, #10b981 0%, #4facfe 100%)", color: "white" }}
          >
            Schedule Class
          </Button>
        </Box>

        {liveClasses.length === 0 ? (
          <Card sx={{ p: 4, textAlign: "center" }}>
            <Typography variant="body1" sx={{ color: "#999" }}>
              No live classes scheduled yet.
            </Typography>
          </Card>
        ) : (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow sx={{ background: "#f0f2f5" }}>
                  <TableCell sx={{ fontWeight: 700 }}>Session</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Course</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Start Time</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Meet Link</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Present</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Absent</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {liveClasses.map((session) => {
                  // Defensive: ensure schedules is always an array
                  const schedules = Array.isArray(session.schedules) ? session.schedules : [];
                  const presentCount = session.attendees?.filter(a => a.status === "present")?.length || 0;
                  const absentCount = session.attendees?.filter(a => a.status === "absent")?.length || 0;
                  // Helper to get student name from enrolled students for this course
                  const getStudentName = (studentId) => {
                    // Use attendanceDetailsEnrolledStudents if dialog is open for this course, else fallback
                    const stu = attendanceDetailsEnrolledStudents.find(s => s.id === studentId || s.studentId === studentId || s.user_id === studentId);
                    return stu ? (stu.first_name && stu.last_name ? `${stu.first_name} ${stu.last_name}` : (stu.name || stu.email || "Student")) : "Student";
                  };
                  // For present/absent dialogs, only show names if dialog is open for this course
                  const presentStudents = (session.attendees?.filter(a => a.status === "present") || []).map(a => ({ ...a, displayName: getStudentName(a.student_id || a.studentId || a.id), courseId: session.courseId }));
                  const absentStudents = (session.attendees?.filter(a => a.status === "absent") || []).map(a => ({ ...a, displayName: getStudentName(a.student_id || a.studentId || a.id), courseId: session.courseId }));
                  return (
                  <TableRow key={session.id} sx={{ "&:hover": { background: "#f9f9f9" }, height: 72 }}>
                    <TableCell sx={{ fontWeight: 600, fontSize: 16 }}>{session.title}</TableCell>
                    <TableCell sx={{ fontSize: 15 }}>{session.courseTitle}</TableCell>
                    <TableCell sx={{ fontSize: 15 }}>
                      {(() => {
                        // Try both start_time and startTime for compatibility
                        const rawDate = session.start_time || session.startTime;
                        if (!rawDate) return "N/A";
                        const d = new Date(rawDate);
                        return isNaN(d.getTime()) ? "N/A" : d.toLocaleString();
                      })()}
                    </TableCell>
                    <TableCell sx={{ fontSize: 15 }}>
                      {session.meet_link || session.meetLink || "-"}
                    </TableCell>
                    <TableCell>
                      <Chip
                        icon={<Check />}
                        label={presentCount}
                        size="medium"
                        color="success"
                        variant="outlined"
                        onClick={() => setAttendanceDetailsDialog({ open: true, students: presentStudents, type: "Present" })}
                        sx={{ cursor: "pointer", fontSize: 15, height: 32 }}
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        icon={<Close />}
                        label={absentCount}
                        size="medium"
                        color="error"
                        variant="outlined"
                        onClick={() => setAttendanceDetailsDialog({ open: true, students: absentStudents, type: "Absent" })}
                        sx={{ cursor: "pointer", fontSize: 15, height: 32 }}
                      />
                    </TableCell>
                    <TableCell>
                      <Button
                        size="medium"
                        variant="outlined"
                        onClick={() => setAttendanceDialog({ open: true, courseId: session.courseId, scheduleId: session.id })}
                        sx={{ fontSize: 15, height: 36 }}
                      >
                        Attendance
                      </Button>
                    </TableCell>
                  </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Section>

      {/* Create Course Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Create New Course</DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <TextField
            fullWidth
            label="Course Title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Description"
            multiline
            rows={3}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Duration (weeks)"
            type="number"
            value={formData.duration}
            onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Schedule (e.g., Mon, Wed, Fri 10:00 AM)"
            value={formData.schedule}
            onChange={(e) => setFormData({ ...formData, schedule: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button onClick={handleCreate} variant="contained">
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </Box>

    {/* Schedule Class Dialog */}
    <Dialog open={openScheduleDialog} onClose={() => setOpenScheduleDialog(false)} maxWidth="sm" fullWidth>
      <DialogTitle>Schedule Live Class</DialogTitle>
      <DialogContent sx={{ pt: 2 }}>
        <TextField
          select
          fullWidth
          label="Course"
          value={scheduleForm.courseId}
          onChange={(e) => setScheduleForm({ ...scheduleForm, courseId: e.target.value })}
          sx={{ mb: 2 }}
          placeholder="Select course"
        >
          {teacherCourses.map((c) => (
            <MenuItem key={c.id} value={c.id}>
              {c.title}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          fullWidth
          label="Session Title"
          value={scheduleForm.title}
          onChange={(e) => setScheduleForm({ ...scheduleForm, title: e.target.value })}
          sx={{ mb: 2 }}
        />
        <TextField
          fullWidth
          type="datetime-local"
          label="Start Time"
          value={scheduleForm.startTime}
          onChange={(e) => setScheduleForm({ ...scheduleForm, startTime: e.target.value })}
          sx={{ mb: 2 }}
          InputLabelProps={{ shrink: true }}
        />
        <TextField
          fullWidth
          type="number"
          label="Duration (minutes)"
          value={scheduleForm.duration}
          onChange={(e) => setScheduleForm({ ...scheduleForm, duration: Number(e.target.value) })}
          sx={{ mb: 2 }}
        />
        <TextField
          fullWidth
          label="Meet Link"
          value={scheduleForm.meetLink}
          onChange={(e) => setScheduleForm({ ...scheduleForm, meetLink: e.target.value })}
          placeholder="https://meet.google.com/xxx-xxxx-xxx"
          helperText="Enter a valid meeting link (Google Meet, Zoom, Teams, Whereby, or Webex)"
          sx={{ mb: 2 }}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setOpenScheduleDialog(false)}>Cancel</Button>
        <Button onClick={handleScheduleClass} variant="contained">Save</Button>
      </DialogActions>
    </Dialog>

    {/* Attendance Details Dialog - Show Present/Absent Students */}
    <Dialog 
      open={attendanceDetailsDialog.open} 
      onClose={() => setAttendanceDetailsDialog({ open: false, students: [], type: "" })} 
      maxWidth="sm" 
      fullWidth
    >
      <DialogTitle>
        {attendanceDetailsDialog.type} Students ({attendanceDetailsDialog.students?.length || 0})
      </DialogTitle>
      <DialogContent sx={{ pt: 2 }}>
        {attendanceDetailsDialog.students?.length > 0 ? (
          <Table size="small">
            <TableHead>
              <TableRow sx={{ background: "#f3f4f6" }}>
                <TableCell sx={{ fontWeight: 700 }}>Student</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {attendanceDetailsDialog.students.map((student, idx) => {
                // Robustly join with enrolled students to get name fields
                const match = attendanceDetailsEnrolledStudents.find(s =>
                  s.id === student.student_id ||
                  s.user_id === student.student_id ||
                  s.studentId === student.student_id ||
                  s.id === student.studentId ||
                  s.user_id === student.studentId ||
                  s.studentId === student.studentId
                );
                const first_name = match?.first_name || student.first_name;
                const last_name = match?.last_name || student.last_name;
                const name = match?.name || student.name;
                const email = match?.email || student.email;
                return (
                  <TableRow key={idx}>
                    <TableCell>{(first_name && last_name) ? `${first_name} ${last_name}` : (name || email || "Student")}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        ) : (
          <Typography variant="body2" sx={{ color: "#9ca3af", textAlign: "center", py: 2 }}>
            No {attendanceDetailsDialog.type?.toLowerCase()} students yet
          </Typography>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setAttendanceDetailsDialog({ open: false, students: [], type: "" })}>Close</Button>
      </DialogActions>
    </Dialog>

    {/* Attendance Dialog */}
    <Dialog open={attendanceDialog.open} onClose={() => setAttendanceDialog({ open: false, courseId: "", scheduleId: "" })} maxWidth="sm" fullWidth>
      <DialogTitle>Mark Attendance</DialogTitle>
      <DialogContent sx={{ pt: 2 }}>
        {attendanceDialog.courseId ? (
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Student</TableCell>
                <TableCell align="right">Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {enrolledStudents.length > 0 ? (
                enrolledStudents.map((student) => {
                  // Check if already marked in liveClasses for this session
                  let alreadyMarked = false;
                  const session = liveClasses.find(s => s.id === attendanceDialog.scheduleId);
                  if (session && Array.isArray(session.attendees)) {
                    const existing = session.attendees.find(a => (a.student_id || a.studentId || a.id) === (student.user_id || student.id));
                    if (existing) alreadyMarked = true;
                  }
                  return (
                    <TableRow key={student.id}>
                      <TableCell>{(student.first_name && student.last_name) ? `${student.first_name} ${student.last_name}` : (student.name || student.studentName || student.email || "Student")}</TableCell>
                      <TableCell align="right">
                        <Stack direction="row" spacing={1} justifyContent="flex-end">
                          <Button
                            size="small"
                            variant="contained"
                            color="success"
                            startIcon={<Check />}
                            onClick={() => handleMarkAttendance(student.user_id || student.id, "present")}
                            sx={{ minWidth: 100 }}
                            disabled={alreadyMarked}
                          >
                            Present
                          </Button>
                          <Button
                            size="small"
                            variant="contained"
                            color="error"
                            startIcon={<Close />}
                            onClick={() => handleMarkAttendance(student.user_id || student.id, "absent")}
                            sx={{ minWidth: 100 }}
                            disabled={alreadyMarked}
                          >
                            Absent
                          </Button>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={2} align="center">No students enrolled.</TableCell>
                </TableRow>
              )}
                  {/* Attendance Confirmation Dialog */}
                  <Dialog open={confirmDialog.open} onClose={() => setConfirmDialog({ open: false, student: null, status: "" })}>
                    <DialogTitle>Confirm Attendance</DialogTitle>
                    <DialogContent>
                      <Typography>
                        Are you sure you want to mark this student as <b>{confirmDialog.status === "present" ? "Present" : "Absent"}</b>? This cannot be changed.
                      </Typography>
                    </DialogContent>
                    <DialogActions>
                      <Button onClick={() => setConfirmDialog({ open: false, student: null, status: "" })}>Cancel</Button>
                      <Button onClick={confirmMarkAttendance} color={confirmDialog.status === "present" ? "success" : "error"} variant="contained">
                        Confirm
                      </Button>
                    </DialogActions>
                  </Dialog>
            </TableBody>
          </Table>
        ) : (
          <Typography variant="body2" sx={{ color: "#999" }}>No course selected.</Typography>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setAttendanceDialog({ open: false, courseId: "", scheduleId: "" })}>Close</Button>
      </DialogActions>
    </Dialog>

    {/* Manage Course Dialog */}
    <Dialog 
      open={manageDialog.open} 
      onClose={() => {
        setManageDialog({ open: false, course: null });
        setMaterialForm({ name: "", file: null });
        setAssignmentForm({ title: "", description: "", dueDate: "" });
      }} 
      maxWidth="md" 
      fullWidth
    >
      <DialogTitle>
        Manage Course: {manageDialog.course?.title}
      </DialogTitle>
      <DialogContent sx={{ pt: 2 }}>
        {manageDialog.course && (
          <Box>
            {/* Course Info */}
            <Card sx={{ mb: 3, background: "#f9fafb" }}>
              <CardContent>
                <Typography variant="subtitle2" sx={{ color: "#6b7280", mb: 1 }}>Description</Typography>
                <Typography variant="body2" sx={{ mb: 2 }}>{manageDialog.course.description}</Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Typography variant="caption" sx={{ color: "#6b7280" }}>Duration</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>{manageDialog.course.duration} weeks</Typography>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>

            {/* Enrolled Students */}
            <Box sx={{ mb: 3 }}>
              {(() => {
                return (
                  <>
                    <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>📚 Enrolled Students ({enrolledStudents?.length || 0})</Typography>
                    {enrolledStudents && enrolledStudents.length > 0 ? (
                      <TableContainer component={Paper} sx={{ maxHeight: 200 }}>
                        <Table size="small">
                          <TableHead>
                            <TableRow sx={{ background: "#f3f4f6" }}>
                              <TableCell sx={{ fontWeight: 700 }}>Student Name</TableCell>
                              <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {enrolledStudents.map((student, idx) => (
                              <TableRow key={idx}>
                                <TableCell>{
                                  (student.first_name && student.last_name)
                                    ? `${student.first_name} ${student.last_name}`
                                    : (student.name ? student.name : (student.studentName || student.email || "Student"))
                                }</TableCell>
                                <TableCell>{student.status || "-"}</TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </TableContainer>
                    ) : (
                      <Typography variant="body2" sx={{ color: "#9ca3af", fontStyle: "italic" }}>No students enrolled yet</Typography>
                    )}
                  </>
                );
              })()}
            </Box>

            {/* Materials Section */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>📄 Course Materials ({manageDialog.course.materials?.length || 0})</Typography>
              <Button
                variant="outlined"
                size="small"
                sx={{ mb: 2 }}
                onClick={() => setShowMaterialsList((prev) => !prev)}
              >
                {showMaterialsList ? 'Hide Materials List' : 'Show Materials List'}
              </Button>
              {showMaterialsList && manageDialog.course.materials?.length > 0 && (
                <Stack spacing={1} sx={{ mb: 2 }}>
                  {manageDialog.course.materials.map((material, idx) => (
                    <Paper key={material.id || idx} sx={{ p: 2, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span>{material.name}</span>
                      <Stack direction="row" spacing={0.5}>
                        <Button
                          size="small"
                          color="primary"
                          variant="outlined"
                          onClick={() => {
                            const url = material.fileUrl || material.url;
                            if (url) {
                              const link = document.createElement('a');
                              link.href = url;
                              link.download = material.name || 'material.pdf';
                              document.body.appendChild(link);
                              link.click();
                              document.body.removeChild(link);
                            } else {
                              alert('No file URL available for download.');
                            }
                          }}
                        >
                          Download
                        </Button>
                        <Button
                          size="small"
                          color="error"
                          variant="outlined"
                          onClick={async () => {
                            await deleteMaterial(manageDialog.course.id, material.id);
                            // Optionally refresh materials list after deletion
                            const res = await fetch(`${API_URL}/resources/?course_id=${manageDialog.course.id}`);
                            if (res.ok) {
                              const materials = await res.json();
                              setManageDialog((prev) => ({
                                ...prev,
                                course: { ...prev.course, materials },
                              }));
                            }
                          }}
                        >
                          Delete
                        </Button>
                      </Stack>
                    </Paper>
                  ))}
                </Stack>
              )}
              <TextField
                fullWidth
                size="small"
                label="Material Name"
                value={materialForm.name}
                onChange={e => setMaterialForm(f => ({ ...f, name: e.target.value }))}
                sx={{ mb: 2 }}
              />
              <input
                type="file"
                accept="application/pdf"
                style={{ display: "block", marginBottom: 16 }}
                onChange={e => {
                  const file = e.target.files[0];
                  setMaterialForm(f => ({ ...f, file }));
                }}
              />
              <Button
                variant="contained"
                size="small"
                fullWidth
                onClick={async () => {
                  if (manageDialog.course?.id && materialForm.name && materialForm.file) {
                    await addMaterial(manageDialog.course.id, {
                      name: materialForm.name,
                      file: materialForm.file,
                      type: "pdf"
                    });
                    setMaterialForm({ name: "", file: null });
                    // Fetch latest materials from backend and update dialog
                    try {
                      const res = await fetch(`${API_URL}/resources/?course_id=${manageDialog.course.id}`);
                      if (res.ok) {
                        const materials = await res.json();
                        setManageDialog(prev => ({ open: true, course: { ...prev.course, materials } }));
                      }
                    } catch {}
                  } else {
                    alert("Please provide a name and a PDF file.");
                  }
                }}
              >
                Add Material
              </Button>
            </Box>

            {/* Assignments Section */}
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>📝 Assignments ({manageDialog.course.assignments?.length || 0})</Typography>
              <Button
                variant="outlined"
                size="small"
                sx={{ mb: 2 }}
                onClick={() => setShowAssignmentsList((prev) => !prev)}
              >
                {showAssignmentsList ? 'Hide Assignments List' : 'Show Assignments List'}
              </Button>
              {showAssignmentsList && manageDialog.course.assignments?.length > 0 && (
                <Stack spacing={1} sx={{ mb: 2 }}>
                  {manageDialog.course.assignments.map((assignment, idx) => {
                    // Get submissions for this assignment
                    const submissions = getAssignmentSubmissions(assignment.id) || [];
                    return (
                      <Paper key={assignment.id || idx} sx={{ p: 2, mb: 2 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Box>
                            <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 0.5 }}>{assignment.title}</Typography>
                            <Typography variant="caption" sx={{ color: "#6b7280", display: "block", mb: 1 }}>{assignment.description}</Typography>
                            <Typography variant="caption" sx={{ display: "block", mb: 2, color: "#ef4444" }}>Due: {assignment.dueDate ? new Date(assignment.dueDate).toLocaleDateString() : (assignment.due_date ? new Date(assignment.due_date).toLocaleDateString() : 'N/A')}</Typography>
                            <Typography
                              variant="caption"
                              sx={{ color: "#6366f1", display: "block", mt: 1, cursor: submissions.length > 0 ? 'pointer' : 'default', textDecoration: submissions.length > 0 ? 'underline' : 'none' }}
                              onClick={() => {
                                if (submissions.length > 0) setGradeDialog({ open: true, assignment, submissions });
                              }}
                            >
                              Submissions: {Array.isArray(submissions) ? submissions.length : 0}
                            </Typography>
                          </Box>
                          <Box sx={{ display: 'flex', gap: 1 }}>
                            <Button
                              size="small"
                              color="primary"
                              variant="outlined"
                              onClick={() => {
                                if (submissions.length > 0) setGradeDialog({ open: true, assignment, submissions });
                              }}
                              disabled={submissions.length === 0}
                            >
                              Grade
                            </Button>
                            <Button
                              size="small"
                              color="error"
                              variant="outlined"
                              onClick={async () => {
                                await handleDeleteAssignment(manageDialog.course.id, assignment.id);
                                // Optionally refresh assignments list after deletion
                                const res = await fetch(`${API_URL}/assignments/?course_id=${manageDialog.course.id}`);
                                if (res.ok) {
                                  const assignments = await res.json();
                                  setManageDialog(prev => ({ open: true, course: { ...prev.course, assignments } }));
                                }
                              }}
                              sx={{ ml: 2 }}
                            >
                              Delete
                            </Button>
                          </Box>
                        </Box>
                        {/* Submissions dialog is now opened by clicking the Submissions link */}
                      </Paper>
                    );
                  })}
                </Stack>
              )}
              <Card sx={{ background: "#fef3c7", border: "1px solid #f59e0b" }}>
                <CardContent>
                  <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 2 }}>Create New Assignment</Typography>
                  <TextField
                    fullWidth
                    size="small"
                    label="Assignment Title"
                    value={assignmentForm.title}
                    onChange={(e) => setAssignmentForm({ ...assignmentForm, title: e.target.value })}
                    sx={{ mb: 2 }}
                  />
                  <TextField
                    fullWidth
                    size="small"
                    label="Description"
                    multiline
                    rows={2}
                    value={assignmentForm.description}
                    onChange={(e) => setAssignmentForm({ ...assignmentForm, description: e.target.value })}
                    sx={{ mb: 2 }}
                  />
                  <TextField
                    fullWidth
                    size="small"
                    type="date"
                    label="Due Date"
                    value={assignmentForm.dueDate}
                    onChange={(e) => setAssignmentForm({ ...assignmentForm, dueDate: e.target.value })}
                    InputLabelProps={{ shrink: true }}
                    sx={{ mb: 2 }}
                  />
                  <Button 
                    variant="contained" 
                    size="small"
                    disabled={assignmentForm.submitting}
                    onClick={async (e) => {
                      if (assignmentForm.submitting) return;
                      // Set submitting flag immediately to prevent double submit
                      setAssignmentForm(f => ({ ...f, submitting: true }));
                      e.preventDefault();
                      if (!assignmentForm.title || !assignmentForm.dueDate) {
                        setAssignmentForm(f => ({ ...f, submitting: false }));
                        return;
                      }
                      const result = await createAssignment(manageDialog.course.id, assignmentForm);
                      if (result && result.success) {
                        // Fetch latest assignments from backend and update dialog
                        try {
                          const res = await fetch(`${API_URL}/assignments/?course_id=${manageDialog.course.id}`);
                          if (res.ok) {
                            const assignments = await res.json();
                            setManageDialog(prev => ({ open: true, course: { ...prev.course, assignments } }));
                          }
                        } catch {}
                        setAssignmentForm({ title: "", description: "", dueDate: "", submitting: false });
                      } else {
                        setAssignmentForm(f => ({ ...f, submitting: false }));
                        alert(result && result.message ? result.message : "Failed to create assignment.");
                      }
                    }}
                  >
                    {assignmentForm.submitting ? "Creating..." : "Create Assignment"}
                  </Button>
                </CardContent>
              </Card>
            </Box>
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={() => {
          setManageDialog({ open: false, course: null });
          setMaterialForm({ name: "", url: "" });
          setAssignmentForm({ title: "", description: "", dueDate: "" });
        }}>Close</Button>
      </DialogActions>
    </Dialog>

    {/* Submissions List & Grade Dialog */}
    <Dialog open={gradeDialog.open} onClose={() => setGradeDialog({ open: false, assignment: null, submissions: [], gradeSub: null })} maxWidth="md" fullWidth>
      <DialogTitle>Student Submissions</DialogTitle>
      <DialogContent>
        {gradeDialog.assignment && enrolledStudents && (
          <TableContainer component={Paper}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Student ID</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>Content</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Grade</TableCell>
                  <TableCell>Feedback</TableCell>
                  <TableCell>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {enrolledStudents.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} align="center">No students enrolled.</TableCell>
                  </TableRow>
                ) : (
                  enrolledStudents.map((student) => {
                    // Find submission for this student
                    const sub = (gradeDialog.submissions || []).find(
                      s => s.student_id === student.student_id || s.student_id === student.user_id || s.student_id === student.id
                    );
                    return (
                      <TableRow key={student.user_id || student.id}>
                        <TableCell>{student.user_id || student.id}</TableCell>
                        <TableCell>{(student.first_name && student.last_name) ? `${student.first_name} ${student.last_name}` : (student.name || student.email || "Student")}</TableCell>
                        <TableCell><pre style={{margin:0, fontFamily:'inherit', whiteSpace:'pre-wrap'}}>{sub ? sub.content : '-'}</pre></TableCell>
                        <TableCell>{sub ? sub.status : '-'}</TableCell>
                        <TableCell>{sub && sub.grade ? sub.grade : '-'}</TableCell>
                        <TableCell>{sub && sub.feedback ? sub.feedback : '-'}</TableCell>
                        <TableCell>
                          <Button
                            size="small"
                            variant="contained"
                            color="primary"
                            onClick={() => sub && setGradeDialog(gd => ({ ...gd, gradeSub: sub }))}
                            disabled={!sub || sub.status === 'graded'}
                          >
                            {!sub ? 'No Submission' : (sub.status === 'graded' ? 'Graded' : 'Grade')}
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}
        {/* Grade form for selected submission */}
        {gradeDialog.gradeSub && (
          <Box sx={{ mt: 3 }}>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>Grade Submission for Student ID: {gradeDialog.gradeSub.student_id}</Typography>
            <Typography variant="body2" sx={{ mb: 2, color: "#6b7280" }}>
              <strong>Submission:</strong> {gradeDialog.gradeSub.content}
            </Typography>
            <Typography variant="caption" sx={{ display: "block", mb: 2, color: "#9ca3af" }}>
              Submitted: {gradeDialog.gradeSub.submittedAt && !isNaN(Date.parse(gradeDialog.gradeSub.submittedAt.replace(' ', 'T'))) ? new Date(gradeDialog.gradeSub.submittedAt.replace(' ', 'T')).toLocaleString() : 'N/A'}
            </Typography>
            <TextField
              fullWidth
              label="Grade (e.g., A+, 95, Pass)"
              value={gradeForm.grade}
              onChange={(e) => setGradeForm({ ...gradeForm, grade: e.target.value })}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Feedback"
              multiline
              rows={3}
              value={gradeForm.feedback}
              onChange={(e) => setGradeForm({ ...gradeForm, feedback: e.target.value })}
              placeholder="Provide feedback to the student..."
            />
            <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
              <Button onClick={() => setGradeDialog(gd => ({ ...gd, gradeSub: null }))}>Cancel</Button>
              <Button
                variant="contained"
                onClick={async () => {
                  if (gradeDialog.gradeSub && gradeForm.grade) {
                    const result = await reviewSubmission(gradeDialog.gradeSub.id, gradeForm.grade, gradeForm.feedback);
                    if (result?.success) {
                      // Fetch latest submissions from backend to ensure up-to-date content/status
                      const assignmentId = gradeDialog.assignment?.id;
                      let latestSubmissions = [];
                      if (assignmentId) {
                        try {
                          const resp = await fetch(`${API_URL}/assignments/${assignmentId}/submissions`, {
                            headers: user?.access_token ? { Authorization: `Bearer ${user.access_token}` } : {}
                          });
                          if (resp.ok) {
                            latestSubmissions = await resp.json();
                          }
                        } catch {}
                      }
                      setGradeDialog(gd => ({ ...gd, submissions: latestSubmissions, gradeSub: null }));
                      setGradeForm({ grade: "", feedback: "" });
                    }
                  }
                }}
                sx={{ background: "linear-gradient(135deg, #10b981 0%, #059669 100%)" }}
              >
                Save Grade
              </Button>
            </Box>
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setGradeDialog({ open: false, assignment: null, submissions: [], gradeSub: null })}>Close</Button>
      </DialogActions>
    </Dialog>

    {/* Footer */}
    <Box
      sx={{
        mt: 8,
        py: 3,
        textAlign: "center",
        borderTop: "1px solid #e5e7eb",
      }}
    >
      <Typography variant="body2" sx={{ color: "#6b7280" }}>
        © 2025 EduSphere. All rights reserved.
      </Typography>
    </Box>
    </>
  );
}