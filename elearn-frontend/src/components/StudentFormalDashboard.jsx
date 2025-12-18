import { Box, Card, CardContent, Button, Grid, Typography, LinearProgress, Chip, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from "@mui/material";
import { useState } from "react";
import { useFormalEducation } from "../contexts/FormalEducationContext";
import { useAuth } from "../contexts/AuthContext";
import Section from "./Section";
import SectionTitle from "./SectionTitle";
import { Download, Description, Quiz, CheckCircle, CalendarMonth, VideoCall, Link } from "@mui/icons-material";

export default function StudentFormalDashboard({ onExploreCourses }) {
  const { user } = useAuth();
  const { enrollments, courses, getStudentEnrollments, getCourseById, submitAssignment, uploadMaterial } = useFormalEducation();
  const [openAssignment, setOpenAssignment] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [submission, setSubmission] = useState("");
  
  const studentEnrollments = getStudentEnrollments(user?.id);

  const handleSubmitAssignment = () => {
    if (submission.trim() && selectedAssignment) {
      submitAssignment(
        studentEnrollments.find(e => e.courseId === selectedAssignment.courseId)?.id,
        selectedAssignment.id,
        { content: submission }
      );
      setSubmission("");
      setOpenAssignment(false);
      alert("Assignment submitted successfully!");
    }
  };

  return (
    <Box>
      <Section background="transparent">
        <SectionTitle 
          title="My Formal Courses" 
          subtitle={`${studentEnrollments.length} courses enrolled`}
          centered={false}
        />

        {studentEnrollments.length === 0 ? (
          <Card sx={{ p: 4, textAlign: "center" }}>
            <Typography variant="body1" sx={{ color: "#999", mb: 2 }}>
              You haven't enrolled in any formal courses yet.
            </Typography>
            <Button variant="contained" onClick={onExploreCourses} sx={{ background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" }}>
              Explore Courses
            </Button>
          </Card>
        ) : (
          <Grid container spacing={3}>
            {studentEnrollments.map((enrollment) => {
              const course = getCourseById(enrollment.courseId);
              if (!course) return null;

              return (
                <Grid item xs={12} md={6} key={enrollment.id}>
                  <Card sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
                    <CardContent>
                      {/* Course Header */}
                      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "start", mb: 2 }}>
                        <Box>
                          <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5 }}>
                            {course.title}
                          </Typography>
                          <Typography variant="caption" sx={{ color: "#666" }}>
                            By {course.teacherName}
                          </Typography>
                        </Box>
                        {enrollment.progress === 100 && (
                          <Chip
                            icon={<CheckCircle />}
                            label="Completed"
                            color="success"
                            size="small"
                          />
                        )}
                      </Box>

                      {/* Progress */}
                      <Box sx={{ mb: 2 }}>
                        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                          <Typography variant="caption" sx={{ fontWeight: 600 }}>
                            Progress
                          </Typography>
                          <Typography variant="caption" sx={{ fontWeight: 600, color: "#667eea" }}>
                            {enrollment.progress}%
                          </Typography>
                        </Box>
                        <LinearProgress
                          variant="determinate"
                          value={enrollment.progress}
                          sx={{
                            height: 8,
                            borderRadius: 4,
                            background: "#e0e0e0",
                            "& .MuiLinearProgress-bar": {
                              background: "linear-gradient(90deg, #667eea 0%, #764ba2 100%)",
                              borderRadius: 4,
                            },
                          }}
                        />
                      </Box>

                      {/* Stats */}
                      <Grid container spacing={2} sx={{ mb: 2 }}>
                        <Grid item xs={6}>
                          <Box sx={{ p: 1, background: "#f0f2f5", borderRadius: 1 }}>
                            <Typography variant="caption" sx={{ color: "#666" }}>
                              Attendance
                            </Typography>
                            <Typography variant="h6" sx={{ fontWeight: 700 }}>
                              {enrollment.attendance}/{course.schedules?.length || 0}
                            </Typography>
                          </Box>
                        </Grid>
                        <Grid item xs={6}>
                          <Box sx={{ p: 1, background: "#f0f2f5", borderRadius: 1 }}>
                            <Typography variant="caption" sx={{ color: "#666" }}>
                              Assignments
                            </Typography>
                            <Typography variant="h6" sx={{ fontWeight: 700 }}>
                              {enrollment.completedAssignments.length}/{course.assignments?.length || 0}
                            </Typography>
                          </Box>
                        </Grid>
                      </Grid>

                      {/* Study Materials */}
                      {course.materials && course.materials.length > 0 && (
                        <Box sx={{ mb: 3 }}>
                          <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>
                            📚 Study Materials
                          </Typography>
                          {course.materials.map((material) => (
                            <Button
                              key={material.id}
                              fullWidth
                              variant="outlined"
                              size="small"
                              startIcon={<Download />}
                              sx={{ mb: 0.5, justifyContent: "flex-start" }}
                            >
                              {material.title}
                            </Button>
                          ))}
                        </Box>
                      )}

                      {/* Live Classes */}
                      {course.schedules && course.schedules.length > 0 && (
                        <Box sx={{ mb: 3 }}>
                          <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>
                            🎥 Live Classes
                          </Typography>
                          {course.schedules.map((session) => (
                            <Box
                              key={session.id}
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                                border: "1px solid #eee",
                                borderRadius: 1,
                                p: 1,
                                mb: 0.5,
                              }}
                            >
                              <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
                                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                  <VideoCall fontSize="small" />
                                  <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                                    {session.title || "Live Session"}
                                  </Typography>
                                </Box>
                                <Box sx={{ display: "flex", alignItems: "center", gap: 1, color: "#666" }}>
                                  <CalendarMonth fontSize="small" />
                                  <Typography variant="caption">
                                    {session.startTime ? new Date(session.startTime).toLocaleString() : "TBD"}
                                  </Typography>
                                </Box>
                              </Box>
                              {session.meetLink ? (
                                <Button
                                  size="small"
                                  variant="outlined"
                                  href={session.meetLink}
                                  target="_blank"
                                  startIcon={<Link />}
                                >
                                  Join
                                </Button>
                              ) : (
                                <Typography variant="caption" sx={{ color: "#999" }}>Link coming soon</Typography>
                              )}
                            </Box>
                          ))}
                        </Box>
                      )}

                      {/* Pending Assignments */}
                      {course.assignments && course.assignments.length > 0 && (
                        <Box sx={{ mb: 3 }}>
                          <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>
                            📝 Assignments
                          </Typography>
                          {course.assignments.map((assignment) => {
                            const isSubmitted = enrollment.completedAssignments.includes(assignment.id);
                            return (
                              <Button
                                key={assignment.id}
                                fullWidth
                                variant={isSubmitted ? "outlined" : "contained"}
                                size="small"
                                onClick={() => {
                                  if (!isSubmitted) {
                                    setSelectedAssignment({ ...assignment, courseId: course.id });
                                    setOpenAssignment(true);
                                  }
                                }}
                                sx={{
                                  mb: 0.5,
                                  justifyContent: "flex-start",
                                  background: isSubmitted ? "transparent" : "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                                  color: isSubmitted ? "#667eea" : "white",
                                }}
                              >
                                {isSubmitted ? "✓ " : ""}{assignment.title}
                              </Button>
                            );
                          })}
                        </Box>
                      )}

                      {/* Quizzes */}
                      {course.quizzes && course.quizzes.length > 0 && (
                        <Box>
                          <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>
                            <Quiz sx={{ verticalAlign: "middle", mr: 0.5, fontSize: "1.2rem" }} />
                            Quizzes
                          </Typography>
                          {course.quizzes.map((quiz) => {
                            const hasScore = enrollment.quizScores?.find(q => q.quizId === quiz.id);
                            return (
                              <Button
                                key={quiz.id}
                                fullWidth
                                variant="outlined"
                                size="small"
                                sx={{ mb: 0.5, justifyContent: "flex-start" }}
                              >
                                {quiz.title} {hasScore && `- Score: ${hasScore.score}%`}
                              </Button>
                            );
                          })}
                        </Box>
                      )}
                    </CardContent>
                  </Card>
                </Grid>
              );
            })}
          </Grid>
        )}
      </Section>

      {/* Assignment Submission Dialog */}
      <Dialog open={openAssignment} onClose={() => setOpenAssignment(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{selectedAssignment?.title}</DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <Typography variant="body2" sx={{ mb: 2, color: "#666" }}>
            {selectedAssignment?.description}
          </Typography>
          <TextField
            fullWidth
            label="Your Submission"
            multiline
            rows={5}
            value={submission}
            onChange={(e) => setSubmission(e.target.value)}
            placeholder="Write your answer or upload your work..."
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenAssignment(false)}>Cancel</Button>
          <Button onClick={handleSubmitAssignment} variant="contained">
            Submit Assignment
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
