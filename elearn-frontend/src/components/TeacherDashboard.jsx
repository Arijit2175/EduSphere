import { Box, Card, CardContent, Button, TextField, Typography, Dialog, DialogTitle, DialogContent, DialogActions, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Grid, Chip, Stack, MenuItem } from "@mui/material";
import { useState, useMemo } from "react";
import { useFormalEducation } from "../contexts/FormalEducationContext";
import { useAuth } from "../contexts/AuthContext";
import Section from "./Section";
import SectionTitle from "./SectionTitle";
import { Add, Edit, VideoCall, People, CalendarMonth, Link } from "@mui/icons-material";

export default function TeacherDashboard() {
  const { user } = useAuth();
  const { courses, getTeacherCourses, createCourse, scheduleClass, getCourseStudents, markAttendanceForClass } = useFormalEducation();
  const [openDialog, setOpenDialog] = useState(false);
  const [formData, setFormData] = useState({ title: "", description: "", duration: "", schedule: "" });
  const [openScheduleDialog, setOpenScheduleDialog] = useState(false);
  const [scheduleForm, setScheduleForm] = useState({ title: "", startTime: "", duration: 60, meetLink: "", courseId: "" });
  const [attendanceDialog, setAttendanceDialog] = useState({ open: false, courseId: "", scheduleId: "" });
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
    const startIso = (() => {
      const d = new Date(scheduleForm.startTime);
      return isNaN(d.getTime()) ? new Date().toISOString() : d.toISOString();
    })();
    scheduleClass(scheduleForm.courseId, { ...scheduleForm, startTime: startIso });
    setScheduleForm({ title: "", startTime: "", duration: 60, meetLink: "", courseId: "" });
    setOpenScheduleDialog(false);
  };

  const handleMarkAttendance = (studentId) => {
    const { courseId, scheduleId } = attendanceDialog;
    if (!courseId || !scheduleId) return;
    markAttendanceForClass(courseId, scheduleId, studentId);
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
                      <Button size="small" variant="outlined" startIcon={<Edit />}>
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
                  <TableCell sx={{ fontWeight: 700 }}>Attendees</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {liveClasses.map((session) => (
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
                      <Chip icon={<People />} label={`${session.attendees?.length || 0}`} size="small" />
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
                ))}
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
          sx={{ mb: 2 }}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setOpenScheduleDialog(false)}>Cancel</Button>
        <Button onClick={handleScheduleClass} variant="contained">Save</Button>
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
                    <Button size="small" variant="outlined" onClick={() => handleMarkAttendance(student.studentId || student.id)}>
                      Present
                    </Button>
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
    </>
  );
}
