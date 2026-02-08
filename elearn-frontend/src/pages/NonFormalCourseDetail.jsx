import { useMemo, useState } from "react";
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
import MagicBento from "../components/MagicBento";
import ShinyText from "../components/ShinyText";
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

  const heroBubbles = useMemo(() => {
    const rand = (min, max) => Math.random() * (max - min) + min;
    return Array.from({ length: 5 }, (_, i) => ({
      id: `hero-bubble-${i}`,
      size: Math.round(rand(38, 80)),
      left: `${Math.round(rand(6, 88))}%`,
      top: `${Math.round(rand(10, 78))}%`,
      delay: `${rand(0, 2).toFixed(2)}s`,
      duration: `${rand(10, 18).toFixed(1)}s`,
    }));
  }, []);

  const bentoItems = useMemo(() => {
    const outcomes = course.outcomes ?? [];
    const lessons = course.lessons ?? [];
    const attachments = course.attachments ?? [];

    return [
      {
        id: "outcomes",
        label: "Outcomes",
        title: "📚 What you'll learn",
        description: `${outcomes.length} key outcomes`,
        glowColor: "16, 185, 129",
        className: "magic-bento-card--wide",
        content: (
          <Stack spacing={1}>
            {outcomes.length > 0 ? (
              outcomes.map((outcome, idx) => (
                <Stack key={idx} direction="row" spacing={1} alignItems="flex-start">
                  <Typography sx={{ fontWeight: 700, color: "#0f172a" }}>✓</Typography>
                  <Typography variant="body2" sx={{ color: "#334155" }}>
                    {outcome}
                  </Typography>
                </Stack>
              ))
            ) : (
              <Typography variant="body2" sx={{ color: "#64748b" }}>
                Outcomes will appear here once the course is finalized.
              </Typography>
            )}
          </Stack>
        ),
      },
      {
        id: "content",
        label: "Content",
        title: "🎬 Course Content",
        description: `${lessons.length} lessons`,
        glowColor: "59, 130, 246",
        className: "magic-bento-card--wide magic-bento-card--tall",
        content: (
          <Table size="small">
            <TableHead>
              <TableRow sx={{ background: "rgba(148, 163, 184, 0.12)" }}>
                <TableCell sx={{ fontWeight: 700, color: "#0f172a" }}>Lesson</TableCell>
                <TableCell align="right" sx={{ fontWeight: 700, color: "#0f172a" }}>
                  Duration
                </TableCell>
                <TableCell align="right" sx={{ fontWeight: 700, color: "#0f172a" }}>
                  Action
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {lessons.map((lesson) => (
                <TableRow key={lesson.id}>
                  <TableCell sx={{ color: "#334155" }}>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <PlayCircleOutlineIcon fontSize="small" />
                      <Typography variant="body2" sx={{ color: "inherit" }}>
                        {lesson.title}
                      </Typography>
                    </Stack>
                  </TableCell>
                  <TableCell align="right" sx={{ color: "#475569" }}>
                    <Typography variant="body2" sx={{ color: "inherit" }}>
                      {lesson.duration}
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Button
                      size="small"
                      variant="outlined"
                      onClick={() => {
                        setPreviewLesson(lesson);
                        setOpenPreview(true);
                      }}
                      sx={{
                        color: "#1e293b",
                        borderColor: "rgba(148, 163, 184, 0.6)",
                      }}
                    >
                      Preview
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ),
      },
      {
        id: "resources",
        label: "Resources",
        title: "📎 Downloadable Files",
        description: attachments.length > 0 ? `${attachments.length} resources` : "No downloads",
        glowColor: "234, 88, 12",
        content: attachments.length > 0 ? (
          <Stack spacing={1}>
            {attachments.map((file, idx) => (
              <Button
                key={idx}
                fullWidth
                variant="outlined"
                href={file.url}
                download
                sx={{
                  color: "#1e293b",
                  borderColor: "rgba(148, 163, 184, 0.6)",
                }}
              >
                ⬇️ {file.name}
              </Button>
            ))}
          </Stack>
        ) : (
          <Typography variant="body2" sx={{ color: "#64748b" }}>
            Resources will appear here when available.
          </Typography>
        ),
      },
      {
        id: "instructor",
        label: "Instructor",
        title: `👨‍🏫 ${course.instructor}`,
        description: "Top-rated mentor",
        glowColor: "168, 85, 247",
        content: (
          <Stack direction="row" spacing={2} alignItems="center">
            <Box sx={{ fontSize: 40 }}>👤</Box>
            <Box>
              <Typography variant="subtitle2" sx={{ fontWeight: 700, color: "#0f172a" }}>
                {course.instructor}
              </Typography>
              <Stack direction="row" spacing={0.5} alignItems="center">
                <StarIcon sx={{ fontSize: 16, color: "#fbbf24" }} />
                <Typography variant="caption" sx={{ fontWeight: 600, color: "#475569" }}>
                  {course.rating}
                </Typography>
              </Stack>
            </Box>
          </Stack>
        ),
      },
      {
        id: "info",
        label: "Course Info",
        title: "🧾 Details",
        description: course.category,
        glowColor: "14, 165, 233",
        content: (
          <Stack spacing={1.5}>
            <Stack>
              <Typography variant="caption" sx={{ color: "#64748b" }}>
                Category
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 600, color: "#0f172a" }}>
                {course.category}
              </Typography>
            </Stack>
            <Stack>
              <Typography variant="caption" sx={{ color: "#64748b" }}>
                Duration
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 600, color: "#0f172a" }}>
                {course.duration}
              </Typography>
            </Stack>
            <Stack>
              <Typography variant="caption" sx={{ color: "#64748b" }}>
                Level
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 600, color: "#0f172a" }}>
                {course.level}
              </Typography>
            </Stack>
            <Stack>
              <Typography variant="caption" sx={{ color: "#64748b" }}>
                Price
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 600, color: "#0f172a" }}>
                {course.paid ? "Paid" : "Free"}
              </Typography>
            </Stack>
          </Stack>
        ),
      },
      {
        id: "enroll",
        label: "Enrollment",
        title: hasCertificate ? "✅ Completed" : enrolled ? "🚀 Continue Learning" : "🧭 Enroll Now",
        description: hasCertificate ? "Certificate unlocked" : "Start the journey",
        glowColor: "34, 197, 94",
        content: (
          <Stack spacing={1.5}>
            <Button
              fullWidth
              variant="contained"
              size="large"
              onClick={handleEnroll}
              disabled={hasCertificate}
              sx={{
                background: hasCertificate ? "#e2e8f0" : "#2563eb",
                color: hasCertificate ? "#94a3b8" : "#ffffff",
                fontWeight: 700,
                "&:hover": {
                  background: hasCertificate ? "#e2e8f0" : "#1d4ed8",
                },
              }}
            >
              {hasCertificate ? "Completed" : enrolled ? "Continue Learning" : "Enroll Now"}
            </Button>
            <Typography variant="caption" sx={{ color: "#64748b" }}>
              {enrolled ? "Access all lessons and materials" : "Get started with this course"}
            </Typography>
          </Stack>
        ),
      },
    ];
  }, [course, enrolled, hasCertificate]);

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
          <Card
            sx={{
              mb: 3,
              background: "linear-gradient(135deg, #6d28d9 0%, #2563eb 45%, #22d3ee 100%)",
              backgroundSize: "200% 200%",
              animation: "gradientShift 14s ease infinite",
              color: "white",
              width: { xs: "100%", md: "92%" },
              ml: 0,
              mr: "auto",
              position: "relative",
              overflow: "hidden",
            }}
          >
            <Box
              sx={{
                position: "absolute",
                inset: 0,
                zIndex: 1,
                pointerEvents: "none",
              }}
            >
              {heroBubbles.map((bubble) => (
                <Box
                  key={bubble.id}
                  sx={{
                    position: "absolute",
                    left: bubble.left,
                    top: bubble.top,
                    width: bubble.size,
                    height: bubble.size,
                    borderRadius: "50%",
                    background: "rgba(255, 255, 255, 0.22)",
                    border: "1px solid rgba(255, 255, 255, 0.35)",
                    boxShadow: "0 18px 40px rgba(15, 23, 42, 0.18)",
                    animation: `bubbleFloat ${bubble.duration} ease-in-out ${bubble.delay} infinite`,
                  }}
                />
              ))}
            </Box>
            <CardContent sx={{ p: 4, position: "relative", zIndex: 2 }}>
              <Grid container spacing={{ xs: 2, md: 5 }} alignItems="flex-start">
                <Grid item xs={12} md={8}>
                  <Typography variant="h3" sx={{ fontWeight: 700, mb: 1, color: "#ffffff" }}>
                    <ShinyText
                      text={course.title}
                      speed={2}
                      delay={0}
                      color="#c4b5fd"
                      shineColor="#ffffff"
                      spread={120}
                      direction="left"
                      yoyo
                      pauseOnHover={false}
                      disabled={false}
                    />
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 2, opacity: 0.9, color: "#ffffff" }}>
                    {course.description}
                  </Typography>
                  <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
                    <Stack direction="row" spacing={0.5} alignItems="center">
                      <StarIcon sx={{ color: "#ffffff" }} />
                      <Typography variant="body2" sx={{ fontWeight: 600, color: "#ffffff" }}>
                        {course.rating}
                      </Typography>
                      <Typography variant="body2" sx={{ color: "#ffffff" }}>
                        ({course.reviews} reviews)
                      </Typography>
                    </Stack>
                    <Chip
                      label={course.level}
                      sx={{ color: "#ffffff", borderColor: "rgba(255,255,255,0.6)" }}
                      variant="outlined"
                    />
                    <Chip
                      label={course.duration}
                      icon={<AccessTimeIcon sx={{ color: "#ffffff" }} />}
                      sx={{
                        color: "#ffffff",
                        borderColor: "rgba(255,255,255,0.6)",
                        "& .MuiChip-icon": { color: "#ffffff" },
                      }}
                      variant="outlined"
                    />
                  </Stack>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <VerifiedIcon sx={{ color: "#ffffff" }} />
                    <Typography variant="body2" sx={{ color: "#ffffff" }}>
                      Certificate included
                    </Typography>
                  </Stack>
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
            <MagicBento
              items={bentoItems}
              textAutoHide
              enableStars={false}
              enableSpotlight
              enableBorderGlow
              enableTilt={false}
              enableMagnetism={false}
              clickEffect
              spotlightRadius={240}
              particleCount={10}
              glowColor="16, 185, 129"
              disableAnimations={false}
            />
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
