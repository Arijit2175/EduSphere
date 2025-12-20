import { Box, Card, CardContent, Button, TextField, Typography, Dialog, DialogTitle, DialogContent, DialogActions, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Grid, Chip, Stack, MenuItem } from "@mui/material";
import { useState, useMemo } from "react";
import { useFormalEducation } from "../contexts/FormalEducationContext";
import { useAuth } from "../contexts/AuthContext";
import Section from "./Section";
import SectionTitle from "./SectionTitle";
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
  const { user } = useAuth();
  const { courses, getTeacherCourses, createCourse, scheduleClass, getCourseStudents, markAttendanceForClass, getAssignmentSubmissions, reviewSubmission, deleteMaterial } = useFormalEducation();
  const [openDialog, setOpenDialog] = useState(false);
  const [formData, setFormData] = useState({ title: "", description: "", duration: "", schedule: "" });
  const [openScheduleDialog, setOpenScheduleDialog] = useState(false);
  const [scheduleForm, setScheduleForm] = useState({ title: "", startTime: "", duration: 60, meetLink: "", courseId: "" });
  const [attendanceDialog, setAttendanceDialog] = useState({ open: false, courseId: "", scheduleId: "" });
  const [attendanceDetailsDialog, setAttendanceDetailsDialog] = useState({ open: false, students: [], type: "" });
  const [manageDialog, setManageDialog] = useState({ open: false, course: null });
  const [materialForm, setMaterialForm] = useState({ name: "", file: null });
  const [assignmentForm, setAssignmentForm] = useState({ title: "", description: "", dueDate: "" });
  const [gradeDialog, setGradeDialog] = useState({ open: false, submission: null });
  const [gradeForm, setGradeForm] = useState({ grade: "", feedback: "" });
  const teacherCourses = getTeacherCourses(user?.id);

  const liveClasses = useMemo(() => {
    return teacherCourses.flatMap((course) =>
      (course.schedules || []).map((s) => ({
        ...s,
        courseTitle: course.title,
        courseId: course.id,
      }))
    ).sort((a, b) => new Date(a.startTime) - new Date(b.startTime));
  }, [teacherCourses]);

  const handleCreate = () => {
    if (formData.title && formData.description) {
      createCourse({
        ...formData,
        teacherId: user?.id,
        teacherName: `${user?.firstName} ${user?.lastName}`,
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

  const handleMarkAttendance = (studentId, status) => {
    const { courseId, scheduleId } = attendanceDialog;
    if (!courseId || !scheduleId) return;
    
    // Find and update the session's attendees
    const course = teacherCourses.find(c => c.id === courseId);
    if (course && course.schedules) {
      const schedule = course.schedules.find(s => s.id === scheduleId);
      if (schedule) {
        // Initialize attendees array if it doesn't exist
        if (!schedule.attendees) {
          schedule.attendees = [];
        }
        
        // Check if student is already marked
        const existingAttendance = schedule.attendees.find(a => a.studentId === studentId || a.id === studentId);
        
        if (existingAttendance) {
          // Update existing attendance
          existingAttendance.status = status;
        } else {
          // Add new attendance record
          schedule.attendees.push({
            id: studentId,
            studentId: studentId,
            studentName: getCourseStudents(courseId).find(s => (s.studentId || s.id) === studentId)?.studentName || 
                         getCourseStudents(courseId).find(s => (s.studentId || s.id) === studentId)?.name || 
                         "Student",
            status: status
          });
        }
      }
    }
    
    markAttendanceForClass(courseId, scheduleId, studentId);
    // Trigger re-render by updating state
    setAttendanceDialog({ ...attendanceDialog });
  };

  return (
    <>
    <Box>
      <Section background="transparent">
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
          <Box>
            <SectionTitle title="Teacher Dashboard" subtitle={`Welcome, ${user?.firstName}!`} centered={false} />
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
            <Card sx={{ background: "#f093fb20", border: "1px solid #f093fb" }}>
              <CardContent sx={{ textAlign: "center" }}>
                <Typography variant="h4" sx={{ fontWeight: 700, color: "#f093fb" }}>
                  {teacherCourses.reduce((acc, c) => acc + c.students.length, 0)}
                </Typography>
                <Typography variant="body2" sx={{ color: "#666" }}>
                  Total Students
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ background: "#4facfe20", border: "1px solid #4facfe" }}>
              <CardContent sx={{ textAlign: "center" }}>
                <Typography variant="h4" sx={{ fontWeight: 700, color: "#4facfe" }}>
                  {teacherCourses.reduce((acc, c) => acc + c.materials.length, 0)}
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
                  {teacherCourses.reduce((acc, c) => acc + c.assignments.length, 0)}
                </Typography>
                <Typography variant="body2" sx={{ color: "#666" }}>
                  Assignments Created
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* My Courses */}
        <SectionTitle title="My Courses" subtitle="Manage your courses and students" centered={false} />
        
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
                  <TableCell sx={{ fontWeight: 700 }}>Students</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Materials</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Assignments</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {teacherCourses.map((course) => (
                  <TableRow key={course.id} sx={{ "&:hover": { background: "#f9f9f9" } }}>
                    <TableCell sx={{ fontWeight: 600 }}>{course.title}</TableCell>
                    <TableCell>{course.description.substring(0, 30)}...</TableCell>
                    <TableCell>{course.students.length}</TableCell>
                    <TableCell>{course.materials.length}</TableCell>
                    <TableCell>{course.assignments.length}</TableCell>
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
          <SectionTitle title="Live Classes" subtitle="Schedule sessions and track attendance" centered={false} />
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
                  const presentCount = session.attendees?.filter(a => a.status === "present")?.length || 0;
                  const absentCount = session.attendees?.filter(a => a.status === "absent")?.length || 0;
                  const presentStudents = session.attendees?.filter(a => a.status === "present") || [];
                  const absentStudents = session.attendees?.filter(a => a.status === "absent") || [];
                  return (
                  <TableRow key={session.id} sx={{ "&:hover": { background: "#f9f9f9" } }}>
                    <TableCell sx={{ fontWeight: 600 }}>{session.title}</TableCell>
                    <TableCell>{session.courseTitle}</TableCell>
                    <TableCell>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <CalendarMonth fontSize="small" />
                        <Typography variant="body2">
                          {session.startTime ? new Date(session.startTime).toLocaleString() : "TBD"}
                        </Typography>
                      </Stack>
                    </TableCell>
                    <TableCell>
                      {session.meetLink ? (
                        <Button href={session.meetLink} target="_blank" size="small" startIcon={<Link />}>
                          Join
                        </Button>
                      ) : (
                        <Typography variant="caption" sx={{ color: "#999" }}>No link</Typography>
                      )}
                    </TableCell>
                    <TableCell>
                      <Chip
                        icon={<Check />}
                        label={presentCount}
                        size="small"
                        color="success"
                        variant="outlined"
                        onClick={() => setAttendanceDetailsDialog({ open: true, students: presentStudents, type: "Present" })}
                        sx={{ cursor: "pointer" }}
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        icon={<Close />}
                        label={absentCount}
                        size="small"
                        color="error"
                        variant="outlined"
                        onClick={() => setAttendanceDetailsDialog({ open: true, students: absentStudents, type: "Absent" })}
                        sx={{ cursor: "pointer" }}
                      />
                    </TableCell>
                    <TableCell>
                      <Button
                        size="small"
                        variant="outlined"
                        onClick={() => setAttendanceDialog({ open: true, courseId: session.courseId, scheduleId: session.id })}
                      >
                        Mark Attendance
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
              {attendanceDetailsDialog.students.map((student, idx) => (
                <TableRow key={idx}>
                  <TableCell>{student.studentName || student.name || "Student"}</TableCell>
                </TableRow>
              ))}
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
              {getCourseStudents(attendanceDialog.courseId).map((student) => (
                <TableRow key={student.id}>
                  <TableCell>{student.studentName || student.name || student.email}</TableCell>
                  <TableCell align="right">
                    <Stack direction="row" spacing={1} justifyContent="flex-end">
                      <Button 
                        size="small" 
                        variant="contained" 
                        color="success"
                        startIcon={<Check />}
                        onClick={() => handleMarkAttendance(student.studentId || student.id, "present")}
                        sx={{ minWidth: 100 }}
                      >
                        Present
                      </Button>
                      <Button 
                        size="small" 
                        variant="contained" 
                        color="error"
                        startIcon={<Close />}
                        onClick={() => handleMarkAttendance(student.studentId || student.id, "absent")}
                        sx={{ minWidth: 100 }}
                      >
                        Absent
                      </Button>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))}
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
                  <Grid item xs={6}>
                    <Typography variant="caption" sx={{ color: "#6b7280" }}>Duration</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>{manageDialog.course.duration} weeks</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="caption" sx={{ color: "#6b7280" }}>Schedule</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>{manageDialog.course.schedule}</Typography>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>

            {/* Enrolled Students */}
            <Box sx={{ mb: 3 }}>
              {(() => {
                const courseEnrollments = getCourseStudents(manageDialog.course.id);
                return (
                  <>
                    <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>📚 Enrolled Students ({courseEnrollments?.length || 0})</Typography>
                    {courseEnrollments && courseEnrollments.length > 0 ? (
                      <TableContainer component={Paper} sx={{ maxHeight: 200 }}>
                        <Table size="small">
                          <TableHead>
                            <TableRow sx={{ background: "#f3f4f6" }}>
                              <TableCell sx={{ fontWeight: 700 }}>Student Name</TableCell>
                              <TableCell sx={{ fontWeight: 700 }}>Enrolled Date</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {courseEnrollments.map((enrollment, idx) => (
                              <TableRow key={idx}>
                                <TableCell>{enrollment.studentName || "Student"}</TableCell>
                                <TableCell>{enrollment.enrolledDate ? new Date(enrollment.enrolledDate).toLocaleDateString() : "N/A"}</TableCell>
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
              {manageDialog.course.materials?.length > 0 && (
                <Stack spacing={1} sx={{ mb: 2 }}>
                  {manageDialog.course.materials.map((material, idx) => (
                    <Paper key={idx} sx={{ p: 2, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <Stack direction="row" spacing={1} alignItems="center" sx={{ flex: 1 }}>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>{material.name}</Typography>
                        {material.file && (
                          <Typography variant="caption" sx={{ color: "#6b7280" }}>
                            ({(material.file.size / 1024).toFixed(2)} KB)
                          </Typography>
                        )}
                      </Stack>
                      <Stack direction="row" spacing={1}>
                        <Button 
                          size="small" 
                          variant="outlined"
                          href={material.fileUrl}
                          download={material.name}
                        >
                          Download
                        </Button>
                        <Button 
                          size="small" 
                          variant="outlined"
                          color="error"
                          onClick={() => {
                            if (window.confirm('Are you sure you want to delete this material?')) {
                              deleteMaterial(manageDialog.course.id, material.id);
                              // Update the dialog course to reflect the deletion
                              const updatedCourse = courses.find(c => c.id === manageDialog.course.id);
                              setManageDialog({ open: true, course: updatedCourse });
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
              <Card sx={{ background: "#f0fdf4", border: "1px solid #10b981" }}>
                <CardContent>
                  <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 2 }}>Add New Material</Typography>
                  <TextField
                    fullWidth
                    size="small"
                    label="Material Name"
                    value={materialForm.name}
                    onChange={(e) => setMaterialForm({ ...materialForm, name: e.target.value })}
                    sx={{ mb: 2 }}
                  />
                  <Box sx={{ mb: 2 }}>
                    <input
                      type="file"
                      id="material-upload"
                      hidden
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          setMaterialForm({ ...materialForm, file });
                        }
                      }}
                    />
                    <Button
                      fullWidth
                      variant="outlined"
                      component="label"
                      htmlFor="material-upload"
                    >
                      {materialForm.file ? `✓ ${materialForm.file.name}` : "Choose File"}
                    </Button>
                  </Box>
                  <Button 
                    variant="contained" 
                    size="small"
                    fullWidth
                    onClick={() => {
                      if (materialForm.name && materialForm.file) {
                        // Create a file URL using FileReader
                        const reader = new FileReader();
                        reader.onload = (e) => {
                          manageDialog.course.materials.push({
                            id: Date.now(),
                            name: materialForm.name,
                            file: materialForm.file,
                            fileUrl: e.target?.result,
                            fileSize: materialForm.file.size
                          });
                          setMaterialForm({ name: "", file: null });
                        };
                        reader.readAsDataURL(materialForm.file);
                      }
                    }}
                  >
                    Add Material
                  </Button>
                </CardContent>
              </Card>
            </Box>

            {/* Assignments Section */}
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>📝 Assignments ({manageDialog.course.assignments?.length || 0})</Typography>
              {manageDialog.course.assignments?.length > 0 && (
                <Stack spacing={2} sx={{ mb: 2 }}>
                  {manageDialog.course.assignments.map((assignment) => {
                    const submissions = getAssignmentSubmissions(assignment.id);
                    return (
                      <Paper key={assignment.id} sx={{ p: 2 }}>
                        <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 0.5 }}>{assignment.title}</Typography>
                        <Typography variant="caption" sx={{ color: "#6b7280", display: "block", mb: 1 }}>{assignment.description}</Typography>
                        <Typography variant="caption" sx={{ display: "block", mb: 2, color: "#ef4444" }}>Due: {assignment.dueDate}</Typography>
                        
                        {/* Submissions */}
                        {submissions.length > 0 ? (
                          <Box sx={{ mt: 2, background: "#f9fafb", p: 2, borderRadius: 1 }}>
                            <Typography variant="caption" sx={{ fontWeight: 700, display: "block", mb: 1 }}>
                              📬 Submissions ({submissions.length})
                            </Typography>
                            <Stack spacing={1}>
                              {submissions.map((submission) => {
                                const enrollment = manageDialog.course.students?.find(s => s.id === submission.enrollmentId);
                                const studentEnrollment = getCourseStudents(manageDialog.course.id).find(e => e.id === submission.enrollmentId);
                                return (
                                  <Box key={submission.id} sx={{ p: 1.5, background: "white", borderRadius: 1, border: "1px solid #e5e7eb" }}>
                                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                                      <Box sx={{ flex: 1 }}>
                                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                          {studentEnrollment?.studentName || "Student"}
                                        </Typography>
                                        <Typography variant="caption" sx={{ color: "#6b7280" }}>
                                          Submitted: {new Date(submission.submittedAt).toLocaleString()}
                                        </Typography>
                                        {submission.status === "graded" && (() => {
                                          const gradeColors = getGradeColor(submission.grade);
                                          return (
                                            <Typography variant="caption" sx={{ display: "block", color: gradeColors.color, fontWeight: 600 }}>
                                              Grade: {submission.grade} | {submission.feedback}
                                            </Typography>
                                          );
                                        })()}
                                      </Box>
                                      <Stack direction="row" spacing={1}>
                                        <Button
                                          size="small"
                                          variant="outlined"
                                          onClick={() => {
                                            setGradeDialog({ open: true, submission });
                                            setGradeForm({ grade: submission.grade || "", feedback: submission.feedback || "" });
                                          }}
                                        >
                                          {submission.status === "graded" ? "Edit Grade" : "Grade"}
                                        </Button>
                                      </Stack>
                                    </Stack>
                                    <Typography variant="body2" sx={{ mt: 1, p: 1, background: "#f3f4f6", borderRadius: 1, fontSize: "0.85rem" }}>
                                      {submission.content}
                                    </Typography>
                                  </Box>
                                );
                              })}
                            </Stack>
                          </Box>
                        ) : (
                          <Typography variant="caption" sx={{ color: "#9ca3af", fontStyle: "italic" }}>No submissions yet</Typography>
                        )}
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
                    onClick={() => {
                      if (assignmentForm.title && assignmentForm.dueDate) {
                        manageDialog.course.assignments.push({ id: Date.now(), ...assignmentForm });
                        setAssignmentForm({ title: "", description: "", dueDate: "" });
                      }
                    }}
                  >
                    Create Assignment
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

    {/* Grade Submission Dialog */}
    <Dialog open={gradeDialog.open} onClose={() => setGradeDialog({ open: false, submission: null })} maxWidth="sm" fullWidth>
      <DialogTitle>Grade Submission</DialogTitle>
      <DialogContent sx={{ pt: 2 }}>
        {gradeDialog.submission && (
          <Box>
            <Typography variant="body2" sx={{ mb: 2, color: "#6b7280" }}>
              <strong>Submission:</strong> {gradeDialog.submission.content}
            </Typography>
            <Typography variant="caption" sx={{ display: "block", mb: 2, color: "#9ca3af" }}>
              Submitted: {new Date(gradeDialog.submission.submittedAt).toLocaleString()}
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
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setGradeDialog({ open: false, submission: null })}>Cancel</Button>
        <Button 
          variant="contained" 
          onClick={() => {
            if (gradeDialog.submission && gradeForm.grade) {
              reviewSubmission(gradeDialog.submission.id, gradeForm.grade, gradeForm.feedback);
              setGradeDialog({ open: false, submission: null });
              setGradeForm({ grade: "", feedback: "" });
            }
          }}
          sx={{ background: "linear-gradient(135deg, #10b981 0%, #059669 100%)" }}
        >
          Save Grade
        </Button>
      </DialogActions>
    </Dialog>
    </>
  );
}
