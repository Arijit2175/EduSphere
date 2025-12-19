import { Box, Card, CardContent, Button, Grid, Typography, LinearProgress, Chip, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from "@mui/material";
import { useState } from "react";
import { useFormalEducation } from "../contexts/FormalEducationContext";
import { useAuth } from "../contexts/AuthContext";
import Section from "./Section";
import SectionTitle from "./SectionTitle";
import { Download, Description, Quiz, CheckCircle, CalendarMonth, VideoCall, Link } from "@mui/icons-material";

export default function StudentFormalDashboard({ onExploreCourses }) {
  const { user } = useAuth();
  const { enrollments, courses, getStudentEnrollments, getCourseById, submitAssignment, uploadMaterial, getSubmission } = useFormalEducation();
  const [openAssignment, setOpenAssignment] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [submission, setSubmission] = useState("");
  const [gradeViewDialog, setGradeViewDialog] = useState({ open: false, submission: null });
  
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
                <Grid item xs={12} sm={6} md={4} lg={3} key={enrollment.id}>
                  <Card 
                    sx={{ 
                      height: "100%", 
                      display: "flex", 
                      flexDirection: "column",
                      borderRadius: 3,
                      overflow: "hidden",
                      border: "1px solid #e5e7eb",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                      transition: "all 0.3s ease",
                      position: "relative",
                      "&::before": {
                        content: '""',
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        height: "4px",
                        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                      },
                      "&:hover": {
                        transform: "translateY(-8px)",
                        boxShadow: "0 12px 24px rgba(102, 126, 234, 0.2)",
                      }
                    }}
                  >
                    {/* Course Header with Gradient Background */}
                    <Box sx={{ 
                      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                      p: 2.5,
                      color: "white"
                    }}>
                      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "start", mb: 1 }}>
                        <Typography variant="h6" sx={{ fontWeight: 800, fontSize: "1.1rem", lineHeight: 1.3 }}>
                          {course.title}
                        </Typography>
                        {enrollment.progress === 100 && (
                          <CheckCircle sx={{ color: "#10b981", background: "white", borderRadius: "50%", fontSize: "1.3rem" }} />
                        )}
                      </Box>
                      <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.9)", fontWeight: 600 }}>
                        👨‍🏫 {course.teacherName}
                      </Typography>
                    </Box>

                    <CardContent sx={{ flexGrow: 1, p: 2.5 }}>
                      {/* Stats */}
                      <Grid container spacing={1.5} sx={{ mb: 2.5 }}>
                        <Grid item xs={6}>
                          <Box sx={{ 
                            p: 1.5, 
                            background: "linear-gradient(135deg, #667eea15 0%, #764ba225 100%)", 
                            borderRadius: 2,
                            border: "1px solid #667eea30"
                          }}>
                            <Typography variant="caption" sx={{ color: "#667eea", fontWeight: 700, fontSize: "0.7rem" }}>
                              ATTENDANCE
                            </Typography>
                            <Typography variant="h6" sx={{ fontWeight: 800, color: "#1f2937" }}>
                              {enrollment.attendance}/{course.schedules?.length || 0}
                            </Typography>
                          </Box>
                        </Grid>
                        <Grid item xs={6}>
                          <Box sx={{ 
                            p: 1.5, 
                            background: "linear-gradient(135deg, #10b98115 0%, #059e6925 100%)", 
                            borderRadius: 2,
                            border: "1px solid #10b98130"
                          }}>
                            <Typography variant="caption" sx={{ color: "#10b981", fontWeight: 700, fontSize: "0.7rem" }}>
                              ASSIGNMENTS
                            </Typography>
                            <Typography variant="h6" sx={{ fontWeight: 800, color: "#1f2937" }}>
                              {enrollment.completedAssignments.length}/{course.assignments?.length || 0}
                            </Typography>
                          </Box>
                        </Grid>
                      </Grid>

                      {/* Study Materials */}
                      {course.materials && course.materials.length > 0 && (
                        <Box sx={{ mb: 2.5 }}>
                          <Typography variant="subtitle2" sx={{ fontWeight: 800, mb: 1.5, color: "#1f2937", fontSize: "0.9rem" }}>
                            📚 Materials ({course.materials.length})
                          </Typography>
                          <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                            {course.materials.slice(0, 2).map((material) => (
                              <Button
                                key={material.id}
                                fullWidth
                                variant="outlined"
                                size="small"
                                startIcon={<Download />}
                                href={material.fileUrl}
                                download={material.name}
                                sx={{
                                  justifyContent: "flex-start",
                                  textTransform: "none",
                                  borderColor: "#e5e7eb",
                                  color: "#667eea",
                                  fontWeight: 600,
                                  "&:hover": {
                                    borderColor: "#667eea",
                                    background: "#667eea10"
                                  }
                                }}
                              >
                                {material.name.length > 15 ? material.name.substring(0, 15) + "..." : material.name}
                              </Button>
                            ))}
                          </Box>
                        </Box>
                      )}

                      {/* Live Classes */}
                      {course.schedules && course.schedules.length > 0 && (
                        <Box sx={{ mb: 2.5 }}>
                          <Typography variant="subtitle2" sx={{ fontWeight: 800, mb: 1.5, color: "#1f2937", fontSize: "0.9rem" }}>
                            🎥 Live Classes
                          </Typography>
                          <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                            {course.schedules.slice(0, 1).map((session) => (
                              <Button
                                key={session.id}
                                fullWidth
                                variant="contained"
                                size="small"
                                startIcon={<VideoCall />}
                                href={session.meetLink}
                                target="_blank"
                                disabled={!session.meetLink}
                                sx={{
                                  justifyContent: "flex-start",
                                  textTransform: "none",
                                  background: session.meetLink ? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" : "#e5e7eb",
                                  color: "white",
                                  fontWeight: 600,
                                  "&:hover": {
                                    background: session.meetLink ? "linear-gradient(135deg, #5568d3 0%, #63398e 100%)" : "#e5e7eb"
                                  }
                                }}
                              >
                                {session.title || "Join Session"}
                              </Button>
                            ))}
                          </Box>
                        </Box>
                      )}

                      {/* Assignments & Quizzes in Grid */}
                      <Grid container spacing={1.5}>
                        {course.assignments && course.assignments.length > 0 && (
                          <Grid item xs={6}>
                            <Box sx={{
                              p: 1.5,
                              background: "#f9fafb",
                              borderRadius: 2,
                              border: "1px solid #e5e7eb",
                              textAlign: "center",
                            }}>
                              <Typography variant="h5" sx={{ fontWeight: 800, color: "#667eea" }}>
                                {enrollment.completedAssignments.length}
                              </Typography>
                              <Typography variant="caption" sx={{ color: "#6b7280", fontWeight: 600, display: "block" }}>
                                /{course.assignments.length} Done
                              </Typography>
                              <Typography variant="caption" sx={{ color: "#667eea", fontWeight: 700, fontSize: "0.65rem", display: "block", mb: 1 }}>
                                📝 ASSIGNMENTS
                              </Typography>
                              <Button
                                fullWidth
                                size="small"
                                variant="outlined"
                                onClick={() => {
                                  const pending = course.assignments.find(a => !enrollment.completedAssignments.includes(a.id));
                                  if (pending) {
                                    setSelectedAssignment({ ...pending, courseId: course.id, enrollmentId: enrollment.id });
                                    setOpenAssignment(true);
                                  }
                                }}
                                sx={{ fontSize: "0.7rem", py: 0.5 }}
                              >
                                Submit
                              </Button>
                            </Box>
                          </Grid>
                        )}
                        
                        {course.quizzes && course.quizzes.length > 0 && (
                          <Grid item xs={6}>
                            <Box sx={{
                              p: 1.5,
                              background: "#f9fafb",
                              borderRadius: 2,
                              border: "1px solid #e5e7eb",
                              textAlign: "center",
                              cursor: "pointer",
                              transition: "all 0.2s",
                              "&:hover": {
                                borderColor: "#f59e0b",
                                background: "#f59e0b10",
                                transform: "translateY(-2px)"
                              }
                            }}>
                              <Typography variant="h5" sx={{ fontWeight: 800, color: "#f59e0b" }}>
                                {enrollment.quizScores?.length || 0}
                              </Typography>
                              <Typography variant="caption" sx={{ color: "#6b7280", fontWeight: 600, display: "block" }}>
                                /{course.quizzes.length} Taken
                              </Typography>
                              <Typography variant="caption" sx={{ color: "#f59e0b", fontWeight: 700, fontSize: "0.65rem" }}>
                                📋 QUIZZES
                              </Typography>
                            </Box>
                          </Grid>
                        )}
                      </Grid>
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
          
          {(() => {
            if (!selectedAssignment) return null;
            const existingSubmission = getSubmission(selectedAssignment.enrollmentId, selectedAssignment.id);
            
            if (existingSubmission) {
              return (
                <Box sx={{ mb: 2, p: 2, background: "#f0fdf4", border: "1px solid #10b981", borderRadius: 2 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1, color: "#10b981" }}>
                    ✓ Already Submitted
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    <strong>Your Answer:</strong> {existingSubmission.content}
                  </Typography>
                  <Typography variant="caption" sx={{ color: "#6b7280", display: "block", mb: 1 }}>
                    Submitted: {new Date(existingSubmission.submittedAt).toLocaleString()}
                  </Typography>
                  {existingSubmission.status === "graded" && (
                    <Box sx={{ mt: 2, p: 2, background: "#fff7ed", border: "1px solid #f59e0b", borderRadius: 1 }}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 700, color: "#f59e0b", mb: 0.5 }}>
                        Grade: {existingSubmission.grade}
                      </Typography>
                      <Typography variant="body2" sx={{ color: "#6b7280" }}>
                        <strong>Feedback:</strong> {existingSubmission.feedback || "No feedback provided"}
                      </Typography>
                    </Box>
                  )}
                  {existingSubmission.status === "submitted" && (
                    <Chip label="Pending Review" size="small" color="warning" sx={{ mt: 1 }} />
                  )}
                </Box>
              );
            }
            
            return (
              <TextField
                fullWidth
                label="Your Submission"
                multiline
                rows={5}
                value={submission}
                onChange={(e) => setSubmission(e.target.value)}
                placeholder="Write your answer or upload your work..."
              />
            );
          })()}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenAssignment(false)}>Close</Button>
          {(() => {
            if (!selectedAssignment) return null;
            const existingSubmission = getSubmission(selectedAssignment.enrollmentId, selectedAssignment.id);
            if (!existingSubmission) {
              return (
                <Button onClick={handleSubmitAssignment} variant="contained">
                  Submit Assignment
                </Button>
              );
            }
            return null;
          })()}
        </DialogActions>
      </Dialog>
    </Box>
  );
}
