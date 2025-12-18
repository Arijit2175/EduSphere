import React, { useState } from "react";
import {
  Box,
  Container,
  Card,
  CardContent,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Tab,
  Tabs,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Grid,
  Alert,
  LinearProgress,
} from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Download as DownloadIcon,
  Upload as UploadIcon,
  Description as FileTextIcon,
  Grade as GradeIcon,
} from "@mui/icons-material";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { useSidebar } from "../contexts/SidebarContext";
import { useFormalEducation } from "../contexts/FormalEducationContext";
import { useAuth } from "../contexts/AuthContext";
import { useParams } from "react-router-dom";

export default function CourseDetailPage() {
  const { courseId } = useParams();
  const { isOpen } = useSidebar();
  const { user } = useAuth();
  const { getCourseById, uploadMaterial, createAssignment, deleteAssignment, reviewSubmission, getStudentEnrollments } = useFormalEducation();
  
  const course = getCourseById(courseId);
  const [tabValue, setTabValue] = useState(0);
  const [openMaterialDialog, setOpenMaterialDialog] = useState(false);
  const [openAssignmentDialog, setOpenAssignmentDialog] = useState(false);
  const [materialForm, setMaterialForm] = useState({ title: "", type: "document", url: "" });
  const [assignmentForm, setAssignmentForm] = useState({ title: "", description: "", dueDate: "" });
  const [openGradeDialog, setOpenGradeDialog] = useState(false);
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [grade, setGrade] = useState("");
  const [feedback, setFeedback] = useState("");

  if (!course) {
    return (
      <Box sx={{ display: "flex", minHeight: "100vh" }}>
        <Sidebar />
        <Box sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}>
          <Navbar />
          <Box sx={{ flexGrow: 1, ml: { xs: 0, md: isOpen ? 25 : 8.75 }, transition: "margin-left 0.3s ease", p: 4 }}>
            <Alert severity="error">Course not found</Alert>
          </Box>
        </Box>
      </Box>
    );
  }

  const isTeacher = course.teacherId === user?.id;
  const students = course.enrolledStudents || [];

  const handleUploadMaterial = () => {
    if (materialForm.title && materialForm.url) {
      uploadMaterial(courseId, materialForm);
      setMaterialForm({ title: "", type: "document", url: "" });
      setOpenMaterialDialog(false);
    }
  };

  const handleCreateAssignment = () => {
    if (assignmentForm.title && assignmentForm.description) {
      createAssignment(courseId, assignmentForm);
      setAssignmentForm({ title: "", description: "", dueDate: "" });
      setOpenAssignmentDialog(false);
    }
  };

  const handleGradeSubmission = () => {
    if (grade && selectedSubmission) {
      reviewSubmission(selectedSubmission.enrollmentId, selectedSubmission.id, {
        score: parseInt(grade),
        feedback,
      });
      setGrade("");
      setFeedback("");
      setOpenGradeDialog(false);
      setSelectedSubmission(null);
    }
  };

  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      <Sidebar />
      <Box
        sx={{
          flexGrow: 1,
          background: "linear-gradient(135deg, #f8f9fa 0%, #f0f2f5 100%)",
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
          <Container maxWidth="lg" sx={{ py: 4 }}>
          {/* Course Header */}
          <Card
            sx={{
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              color: "white",
              mb: 4,
              borderRadius: "15px",
            }}
          >
            <CardContent>
              <Typography variant="h3" sx={{ fontWeight: "bold", mb: 1 }}>
                {course.title}
              </Typography>
              <Typography variant="body1" sx={{ mb: 2, opacity: 0.9 }}>
                {course.description}
              </Typography>
              <Grid container spacing={3} sx={{ mt: 1 }}>
                <Grid item xs={12} sm={6} md={3}>
                  <Typography variant="caption" sx={{ opacity: 0.8 }}>
                    Duration
                  </Typography>
                  <Typography variant="h6">{course.duration || "TBD"}</Typography>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Typography variant="caption" sx={{ opacity: 0.8 }}>
                    Schedule
                  </Typography>
                  <Typography variant="h6">{course.schedule || "Not scheduled"}</Typography>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Typography variant="caption" sx={{ opacity: 0.8 }}>
                    Students Enrolled
                  </Typography>
                  <Typography variant="h6">{students.length}</Typography>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Typography variant="caption" sx={{ opacity: 0.8 }}>
                    Total Materials
                  </Typography>
                  <Typography variant="h6">{course.materials?.length || 0}</Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          {/* Tabs */}
          <Card sx={{ mb: 3, borderRadius: "15px" }}>
            <Tabs
              value={tabValue}
              onChange={(e, newValue) => setTabValue(newValue)}
              sx={{ borderBottom: "1px solid #e0e0e0" }}
            >
              <Tab label="Overview" />
              <Tab label="Materials" />
              <Tab label="Assignments" />
              {isTeacher && <Tab label="Students" />}
            </Tabs>
          </Card>

          {/* Overview Tab */}
          {tabValue === 0 && (
            <Card sx={{ borderRadius: "15px", mb: 3 }}>
              <CardContent>
                <Typography variant="h5" sx={{ fontWeight: "bold", mb: 2 }}>
                  Course Overview
                </Typography>
                <Typography variant="body2" sx={{ color: "textSecondary", mb: 3 }}>
                  {course.description}
                </Typography>
                <Grid container spacing={2}>
                  {course.materials && course.materials.length > 0 && (
                    <Grid item xs={12}>
                      <Typography variant="subtitle2" sx={{ fontWeight: "bold", mb: 2 }}>
                        Recent Materials
                      </Typography>
                      <Box>
                        {course.materials.slice(0, 3).map((material, idx) => (
                          <Chip
                            key={idx}
                            icon={<FileTextIcon />}
                            label={material.title}
                            variant="outlined"
                            sx={{ mr: 1, mb: 1 }}
                          />
                        ))}
                      </Box>
                    </Grid>
                  )}
                </Grid>
              </CardContent>
            </Card>
          )}

          {/* Materials Tab */}
          {tabValue === 1 && (
            <Card sx={{ borderRadius: "15px" }}>
              <CardContent>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
                  <Typography variant="h5" sx={{ fontWeight: "bold" }}>
                    Study Materials
                  </Typography>
                  {isTeacher && (
                    <Button
                      variant="contained"
                      startIcon={<UploadIcon />}
                      onClick={() => setOpenMaterialDialog(true)}
                      sx={{
                        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                      }}
                    >
                      Upload Material
                    </Button>
                  )}
                </Box>

                {course.materials && course.materials.length > 0 ? (
                  <Grid container spacing={2}>
                    {course.materials.map((material, idx) => (
                      <Grid item xs={12} sm={6} md={4} key={idx}>
                        <Card sx={{ borderRadius: "10px", cursor: "pointer" }}>
                          <CardContent>
                            <Box sx={{ display: "flex", alignItems: "flex-start", mb: 2 }}>
                              <FileTextIcon sx={{ mr: 2, color: "#667eea" }} />
                              <Box sx={{ flex: 1 }}>
                                <Typography variant="subtitle2" sx={{ fontWeight: "bold" }}>
                                  {material.title}
                                </Typography>
                                <Typography variant="caption" sx={{ color: "textSecondary" }}>
                                  {material.type}
                                </Typography>
                              </Box>
                            </Box>
                            <Button
                              size="small"
                              startIcon={<DownloadIcon />}
                              fullWidth
                              variant="outlined"
                            >
                              Download
                            </Button>
                          </CardContent>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                ) : (
                  <Typography variant="body2" sx={{ color: "textSecondary", py: 4, textAlign: "center" }}>
                    No materials uploaded yet
                  </Typography>
                )}
              </CardContent>
            </Card>
          )}

          {/* Assignments Tab */}
          {tabValue === 2 && (
            <Card sx={{ borderRadius: "15px" }}>
              <CardContent>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
                  <Typography variant="h5" sx={{ fontWeight: "bold" }}>
                    Assignments
                  </Typography>
                  {isTeacher && (
                    <Button
                      variant="contained"
                      startIcon={<AddIcon />}
                      onClick={() => setOpenAssignmentDialog(true)}
                      sx={{
                        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                      }}
                    >
                      Create Assignment
                    </Button>
                  )}
                </Box>

                {course.assignments && course.assignments.length > 0 ? (
                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
                          <TableCell sx={{ fontWeight: "bold" }}>Title</TableCell>
                          <TableCell sx={{ fontWeight: "bold" }}>Due Date</TableCell>
                          <TableCell sx={{ fontWeight: "bold" }}>Submissions</TableCell>
                          {isTeacher && <TableCell sx={{ fontWeight: "bold" }}>Actions</TableCell>}
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {course.assignments.map((assignment) => (
                          <TableRow key={assignment.id}>
                            <TableCell>
                              <Typography variant="subtitle2" sx={{ fontWeight: "bold" }}>
                                {assignment.title}
                              </Typography>
                              <Typography variant="caption" sx={{ color: "textSecondary" }}>
                                {assignment.description?.substring(0, 50)}...
                              </Typography>
                            </TableCell>
                            <TableCell>{assignment.dueDate || "No deadline"}</TableCell>
                            <TableCell>
                              <Chip
                                label={`${assignment.submissions?.length || 0} submitted`}
                                color={assignment.submissions?.length ? "success" : "default"}
                                size="small"
                              />
                            </TableCell>
                            {isTeacher && (
                              <TableCell>
                                <Button
                                  size="small"
                                  startIcon={<GradeIcon />}
                                  onClick={() => setSelectedSubmission(assignment)}
                                  variant="outlined"
                                >
                                  Grade
                                </Button>
                              </TableCell>
                            )}
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                ) : (
                  <Typography variant="body2" sx={{ color: "textSecondary", py: 4, textAlign: "center" }}>
                    No assignments created yet
                  </Typography>
                )}
              </CardContent>
            </Card>
          )}

          {/* Students Tab (Teacher Only) */}
          {isTeacher && tabValue === 3 && (
            <Card sx={{ borderRadius: "15px" }}>
              <CardContent>
                <Typography variant="h5" sx={{ fontWeight: "bold", mb: 3 }}>
                  Enrolled Students ({students.length})
                </Typography>

                {students.length > 0 ? (
                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
                          <TableCell sx={{ fontWeight: "bold" }}>Student Name</TableCell>
                          <TableCell sx={{ fontWeight: "bold" }}>Email</TableCell>
                          <TableCell sx={{ fontWeight: "bold" }}>Progress</TableCell>
                          <TableCell sx={{ fontWeight: "bold" }}>Status</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {students.map((student) => (
                          <TableRow key={student.id}>
                            <TableCell>
                              <Typography variant="subtitle2">{student.name}</Typography>
                            </TableCell>
                            <TableCell>{student.email}</TableCell>
                            <TableCell>
                              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                                <LinearProgress
                                  variant="determinate"
                                  value={student.progress || 0}
                                  sx={{ flex: 1, borderRadius: "5px" }}
                                />
                                <Typography variant="caption" sx={{ minWidth: "40px" }}>
                                  {student.progress || 0}%
                                </Typography>
                              </Box>
                            </TableCell>
                            <TableCell>
                              <Chip
                                label={student.completionStatus || "In Progress"}
                                color={student.completionStatus === "Completed" ? "success" : "default"}
                                size="small"
                              />
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                ) : (
                  <Typography variant="body2" sx={{ color: "textSecondary", py: 4, textAlign: "center" }}>
                    No students enrolled yet
                  </Typography>
                )}
              </CardContent>
            </Card>
          )}
        {/* Container continues below; dialogs are part of the same layout */}

        {/* Upload Material Dialog */}
        <Dialog open={openMaterialDialog} onClose={() => setOpenMaterialDialog(false)} maxWidth="sm" fullWidth>
          <DialogTitle sx={{ fontWeight: "bold", color: "#667eea" }}>Upload Study Material</DialogTitle>
          <DialogContent sx={{ pt: 3 }}>
            <TextField
              fullWidth
              label="Material Title"
              value={materialForm.title}
              onChange={(e) => setMaterialForm({ ...materialForm, title: e.target.value })}
              variant="outlined"
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Material Type (e.g., PDF, Video, Article)"
              value={materialForm.type}
              onChange={(e) => setMaterialForm({ ...materialForm, type: e.target.value })}
              variant="outlined"
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="URL / File Path"
              value={materialForm.url}
              onChange={(e) => setMaterialForm({ ...materialForm, url: e.target.value })}
              variant="outlined"
            />
          </DialogContent>
          <DialogActions sx={{ p: 2 }}>
            <Button onClick={() => setOpenMaterialDialog(false)} variant="outlined">
              Cancel
            </Button>
            <Button
              onClick={handleUploadMaterial}
              variant="contained"
              sx={{
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              }}
            >
              Upload
            </Button>
          </DialogActions>
        </Dialog>

        {/* Create Assignment Dialog */}
        <Dialog open={openAssignmentDialog} onClose={() => setOpenAssignmentDialog(false)} maxWidth="sm" fullWidth>
          <DialogTitle sx={{ fontWeight: "bold", color: "#667eea" }}>Create Assignment</DialogTitle>
          <DialogContent sx={{ pt: 3 }}>
            <TextField
              fullWidth
              label="Assignment Title"
              value={assignmentForm.title}
              onChange={(e) => setAssignmentForm({ ...assignmentForm, title: e.target.value })}
              variant="outlined"
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Description"
              value={assignmentForm.description}
              onChange={(e) => setAssignmentForm({ ...assignmentForm, description: e.target.value })}
              variant="outlined"
              multiline
              rows={4}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Due Date"
              type="datetime-local"
              value={assignmentForm.dueDate}
              onChange={(e) => setAssignmentForm({ ...assignmentForm, dueDate: e.target.value })}
              variant="outlined"
              InputLabelProps={{ shrink: true }}
            />
          </DialogContent>
          <DialogActions sx={{ p: 2 }}>
            <Button onClick={() => setOpenAssignmentDialog(false)} variant="outlined">
              Cancel
            </Button>
            <Button
              onClick={handleCreateAssignment}
              variant="contained"
              sx={{
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              }}
            >
              Create
            </Button>
          </DialogActions>
        </Dialog>

        {/* Grade Dialog */}
        <Dialog open={openGradeDialog} onClose={() => setOpenGradeDialog(false)} maxWidth="sm" fullWidth>
          <DialogTitle sx={{ fontWeight: "bold", color: "#667eea" }}>Grade Submission</DialogTitle>
          <DialogContent sx={{ pt: 3 }}>
            <TextField
              fullWidth
              label="Score (out of 100)"
              type="number"
              value={grade}
              onChange={(e) => setGrade(e.target.value)}
              variant="outlined"
              sx={{ mb: 2 }}
              inputProps={{ min: 0, max: 100 }}
            />
            <TextField
              fullWidth
              label="Feedback"
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              variant="outlined"
              multiline
              rows={4}
            />
          </DialogContent>
          <DialogActions sx={{ p: 2 }}>
            <Button onClick={() => setOpenGradeDialog(false)} variant="outlined">
              Cancel
            </Button>
            <Button
              onClick={handleGradeSubmission}
              variant="contained"
              sx={{
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              }}
            >
              Submit Grade
            </Button>
          </DialogActions>
        </Dialog>
        </Container>
      </Box>
    </Box>
  </Box>
  );
}
