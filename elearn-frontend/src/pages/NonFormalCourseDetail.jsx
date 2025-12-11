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

export default function NonFormalCourseDetail() {
  const { isOpen } = useSidebar();
  const { user } = useAuth();
  const { courseId } = useParams();
  const { courses, enrollCourse, isEnrolled } = useNonFormal();
  const navigate = useNavigate();
  const [openPreview, setOpenPreview] = useState(false);
  const [previewLesson, setPreviewLesson] = useState(null);

  const course = courses.find((c) => c.id === courseId);
  const enrolled = isEnrolled(user?.id, courseId);

  if (!course) {
    return (
      <Box sx={{ display: "flex" }}>
        <Sidebar />
        <Box sx={{ flexGrow: 1, ml: { xs: 0, md: isOpen ? 25 : 8.75 }, mt: { xs: 6, md: 8 }, p: 4 }}>
          <Navbar />
          <Typography variant="h5">Course not found</Typography>
        </Box>
      </Box>
    );
  }

  const handleEnroll = () => {
    enrollCourse(user?.id, courseId);
    navigate(`/nonformal/learn/${courseId}`);
  };

  return (
    <Box sx={{ display: "flex" }}>
      <Sidebar />
      <Box
        sx={{
          flexGrow: 1,
          ml: { xs: 0, md: isOpen ? 25 : 8.75 },
          mt: { xs: 6, md: 8 },
          background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
          minHeight: "100vh",
          transition: "margin-left 0.3s ease",
          pb: 4,
        }}
      >
        <Navbar />

        <Container maxWidth="lg" sx={{ mt: 4 }}>
          {/* Hero Section */}
          <Card sx={{ mb: 3, background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)", color: "white" }}>
            <CardContent sx={{ p: 4 }}>
              <Grid container spacing={3} alignItems="center">
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
                <Grid item xs={12} md={4} sx={{ textAlign: "center" }}>
                  <Box sx={{ fontSize: 80, mb: 2 }}>{course.thumbnail}</Box>
                  <Button
                    fullWidth
                    variant="contained"
                    size="large"
                    onClick={handleEnroll}
                    sx={{ background: "white", color: "#667eea", fontWeight: 700 }}
                  >
                    {enrolled ? "Continue Learning" : "Enroll Now"}
                  </Button>
                </Grid>
              </Grid>
            </CardContent>
          </Card>

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
        </Container>
      </Box>
    </Box>
  );
}
