import { useState } from "react";
import {
  Box,
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Chip,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Snackbar,
  Alert,
} from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import Section from "../components/Section";
import { useSidebar } from "../contexts/SidebarContext";
import { useAuth } from "../contexts/AuthContext";
import { useNonFormal } from "../contexts/NonFormalContext";
import StarIcon from "@mui/icons-material/Star";
import PlayCircleOutlineIcon from "@mui/icons-material/PlayCircleOutline";
import VerifiedIcon from "@mui/icons-material/Verified";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";

export default function NonFormalCourseDetail() {
  const { isOpen } = useSidebar();
  const { user } = useAuth();
  const { courseId } = useParams();
  const { courses, enrollCourse, isEnrolled, certificates } = useNonFormal();
  const navigate = useNavigate();
  const [openPreview, setOpenPreview] = useState(false);
  const [previewLesson, setPreviewLesson] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "info" });

  const course = courses.find((c) => String(c.id) === String(courseId));
  const enrolled = isEnrolled(user?.id, courseId);
  const hasCertificate = certificates?.some((c) => c.userId === user?.id && c.courseId === courseId);

  if (!course) {
    return (
      <Box sx={{ display: "flex", minHeight: "100vh" }}>
        <Sidebar />
        <Box sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}>
          <Navbar />
          <Box sx={{ flexGrow: 1, ml: { xs: 0, md: isOpen ? 25 : 8.75 }, transition: "margin-left 0.3s ease", p: 4 }}>
            <Typography variant="h5">Course not found</Typography>
          </Box>
        </Box>
      </Box>
    );
  }

  const handleEnroll = async () => {
    const result = await enrollCourse(user?.id, courseId);
    if (result?.success) {
      navigate(`/nonformal/learn/${courseId}`);
    } else {
      setSnackbar({ open: true, message: result?.message || "Unable to enroll", severity: "info" });
    }
  };

  const handleCloseSnackbar = () => setSnackbar({ ...snackbar, open: false });

  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      <Sidebar />
      <Box
        sx={{
          flexGrow: 1,
          background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
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
          <Container maxWidth="lg" sx={{ mt: 4 }}>
          <Box sx={{ maxWidth: 1000, mx: "auto" }}>
          {/* Feedback Snackbar */}
          <Snackbar
            open={snackbar.open}
            autoHideDuration={3000}
            onClose={handleCloseSnackbar}
            anchorOrigin={{ vertical: "top", horizontal: "center" }}
          >
            <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: "100%" }}>
              {snackbar.message}
            </Alert>
          </Snackbar>
          <Box
            sx={{
              width: { xs: "100%", md: "92%" },
              ml: 0,
              mr: "auto",
              mb: 2,
              display: "flex",
              alignItems: "center",
            }}
          >
            <Button
              variant="text"
              startIcon={<ArrowBackIosNewIcon />}
              onClick={() => navigate("/nonformal")}
              sx={{ color: "#374151", textTransform: "none", px: 0, fontWeight: 600 }}
            >
              Back
            </Button>
          </Box>
          {/* Hero Section */}
          <Card sx={{ mb: 3, background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)", color: "white", width: { xs: "100%", md: "92%" }, ml: 0, mr: "auto" }}>
            <CardContent sx={{ p: 4 }}>
              <Grid container spacing={{ xs: 2, md: 5 }} alignItems="flex-start">
                <Grid item xs={12} md={8}>
                  <Typography variant="h3" sx={{ fontWeight: 700, mb: 1 }}>
                    {course.title}
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 2, opacity: 0.9 }}>
                    {course.description}
                  </Typography>
                  <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
                    <Stack direction="row" spacing={0.5} alignItems="center">
                      <StarIcon />
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {course.rating}
                      </Typography>
                      <Typography variant="body2">({course.reviews} reviews)</Typography>
                    </Stack>
                    <Chip label={course.level} />
                    <Chip label={course.duration} icon={<AccessTimeIcon />} />
                  </Stack>
                  {course.certificate && (
                    <Stack direction="row" spacing={1} alignItems="center">
                      <VerifiedIcon />
                      <Typography variant="body2">Certificate included</Typography>
                    </Stack>
                  )}
                </Grid>
                <Grid
                  item 
                  xs={12} 
                  md={4} 
                  sx={{ 
                    textAlign: { xs: "center", md: "right" },
                    display: "flex",
                    flexDirection: "column",
                    alignItems: { xs: "center", md: "flex-end" },
                    justifyContent: "flex-start",
                    ml: { md: "auto" },
                    pr: { md: 0 },
                  }}
                >
                  <Box sx={{ fontSize: 80, mb: 2, alignSelf: { xs: "center", md: "flex-end" } }}>
                    {course.thumbnail}
                  </Box>
                  <Stack spacing={1} sx={{ width: { xs: "100%", md: "auto" }, alignItems: { xs: "stretch", md: "flex-end" } }}>
                    {hasCertificate && (
                      <Chip color="success" label="Certified" />
                    )}
                    <Button
                      variant="contained"
                      size="large"
                      onClick={handleEnroll}
                      disabled={hasCertificate}
                      sx={{ 
                        width: { xs: "100%", md: "auto" },
                        background: hasCertificate ? "#e5e7eb" : "white", 
                        color: hasCertificate ? "#9ca3af" : "#667eea", 
                        fontWeight: 700 
                      }}
                    >
                      {hasCertificate ? "Completed" : enrolled ? "Continue Learning" : "Enroll Now"}
                    </Button>
                  </Stack>
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          <Box sx={{ width: { xs: "100%", md: "92%" }, mx: "auto", transform: { md: "translateX(55px)" } }}>
          <Grid container spacing={3}>
            {/* Main Content */}
            <Grid item xs={12} md={8}>
              {/* Expected Outcomes */}
              <Card sx={{ mb: 3 }}>
                <CardContent>
                  <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                    📚 What you'll learn
                  </Typography>
                  <Stack spacing={1}>
                    {course.outcomes?.map((outcome, idx) => (
                      <Stack key={idx} direction="row" spacing={1} alignItems="flex-start">
                        <Typography sx={{ fontWeight: 700 }}>✓</Typography>
                        <Typography variant="body2">{outcome}</Typography>
                      </Stack>
                    ))}
                  </Stack>
                </CardContent>
              </Card>

              {/* Course Content */}
              <Card sx={{ mb: 3 }}>
                <CardContent>
                  <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                    📖 Course Content ({course.lessons?.length} lessons)
                  </Typography>
                  <Table>
                    <TableHead>
                      <TableRow sx={{ background: "#f3f4f6" }}>
                        <TableCell sx={{ fontWeight: 700 }}>Lesson</TableCell>
                        <TableCell align="right" sx={{ fontWeight: 700 }}>
                          Duration
                        </TableCell>
                        <TableCell align="right" sx={{ fontWeight: 700 }}>
                          Action
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {course.lessons?.map((lesson, idx) => (
                        <TableRow key={lesson.id}>
                          <TableCell>
                            <Stack direction="row" spacing={1} alignItems="center">
                              <PlayCircleOutlineIcon fontSize="small" />
                              <Typography variant="body2">{lesson.title}</Typography>
                            </Stack>
                          </TableCell>
                          <TableCell align="right">
                            <Typography variant="body2">{lesson.duration}</Typography>
                          </TableCell>
                          <TableCell align="right">
                            <Button
                              size="small"
                              variant="outlined"
                              onClick={() => {
                                setPreviewLesson(lesson);
                                setOpenPreview(true);
                              }}
                            >
                              Preview
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>

              {/* Attachments */}
              {course.attachments?.length > 0 && (
                <Card sx={{ mb: 3 }}>
                  <CardContent>
                    <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                      📎 Downloadable Resources
                    </Typography>
                    <Stack spacing={1}>
                      {course.attachments.map((file, idx) => (
                        <Button key={idx} fullWidth variant="outlined" href={file.url} download>
                          ⬇️ {file.name}
                        </Button>
                      ))}
                    </Stack>
                  </CardContent>
                </Card>
              )}
            </Grid>

            {/* Sidebar */}
            <Grid item xs={12} md={4}>
              {/* Instructor Info */}
              <Card sx={{ mb: 3 }}>
                <CardContent>
                  <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                    👨‍🏫 Instructor
                  </Typography>
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Box sx={{ fontSize: 40 }}>👤</Box>
                    <Box>
                      <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                        {course.instructor}
                      </Typography>
                      <Stack direction="row" spacing={0.5}>
                        <StarIcon sx={{ fontSize: 16, color: "#fbbf24" }} />
                        <Typography variant="caption" sx={{ fontWeight: 600 }}>
                          {course.rating}
                        </Typography>
                      </Stack>
                    </Box>
                  </Stack>
                </CardContent>
              </Card>

              {/* Course Info */}
              <Card sx={{ mb: 3 }}>
                <CardContent>
                  <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                    ℹ️ Course Info
                  </Typography>
                  <Stack spacing={2}>
                    <Stack>
                      <Typography variant="caption" sx={{ color: "#6b7280" }}>
                        Category
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {course.category}
                      </Typography>
                    </Stack>
                    <Stack>
                      <Typography variant="caption" sx={{ color: "#6b7280" }}>
                        Duration
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {course.duration}
                      </Typography>
                    </Stack>
                    <Stack>
                      <Typography variant="caption" sx={{ color: "#6b7280" }}>
                        Level
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {course.level}
                      </Typography>
                    </Stack>
                    <Stack>
                      <Typography variant="caption" sx={{ color: "#6b7280" }}>
                        Price
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {course.paid ? "Paid" : "Free"}
                      </Typography>
                    </Stack>
                  </Stack>
                </CardContent>
              </Card>

              {/* Enrollment Button */}
              <Card>
                <CardContent>
                  <Button
                    fullWidth
                    variant="contained"
                    size="large"
                    onClick={handleEnroll}
                    sx={{ mb: 1 }}
                  >
                    {enrolled ? "Continue Learning" : "Enroll Now"}
                  </Button>
                  <Typography variant="caption" sx={{ color: "#6b7280", textAlign: "center", display: "block" }}>
                    {enrolled ? "Access all lessons and materials" : "Get started with this course"}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            </Grid>
          </Box>

          {/* Preview Dialog */}
          <Dialog open={openPreview} onClose={() => setOpenPreview(false)} maxWidth="md" fullWidth>
            <DialogTitle>{previewLesson?.title}</DialogTitle>
            <DialogContent>
              {previewLesson?.videoUrl && (
                <Box
                  sx={{
                    position: "relative",
                    paddingBottom: "56.25%",
                    height: 0,
                    overflow: "hidden",
                    background: "#000",
                    borderRadius: 1,
                    mt: 2,
                  }}
                >
                  <iframe
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: "100%",
                      height: "100%",
                    }}
                    src={previewLesson.videoUrl}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    title={previewLesson.title}
                  ></iframe>
                </Box>
              )}
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setOpenPreview(false)}>Close</Button>
              {enrolled && (
                <Button
                  variant="contained"
                  onClick={() => {
                    setOpenPreview(false);
                    navigate(`/nonformal/learn/${courseId}`);
                  }}
                >
                  Open in Player
                </Button>
              )}
            </DialogActions>
          </Dialog>
          </Box>
          </Container>

          <Box sx={{ mt: 6, mb: 2, textAlign: "center" }}>
            <Typography
              variant="body2"
              sx={{ color: "#6b7280", fontWeight: 500 }}
            >
              © 2025 EduSphere. All rights reserved.
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
