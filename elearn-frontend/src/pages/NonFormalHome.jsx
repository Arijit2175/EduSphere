import { useEffect, useMemo, useRef, useState } from "react";
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
  TextField,
  InputAdornment,
  Alert,
  Snackbar,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import PageHeader from "../components/PageHeader";
import Section from "../components/Section";
import { useSidebar } from "../contexts/SidebarContext";
import { useAuth } from "../contexts/AuthContext";
import { useNonFormal } from "../contexts/NonFormalContext";
import SearchIcon from "@mui/icons-material/Search";
import CodeIcon from "@mui/icons-material/Code";
import BrushIcon from "@mui/icons-material/Brush";
import BusinessIcon from "@mui/icons-material/Business";
import TranslateIcon from "@mui/icons-material/Translate";
import PsychologyIcon from "@mui/icons-material/Psychology";
import LightbulbIcon from "@mui/icons-material/Lightbulb";
import StarIcon from "@mui/icons-material/Star";
import { InteractiveHoverButton } from "../components/ui/interactive-hover-button";

const CATEGORIES = [
  { id: "tech", label: "Tech Skills", icon: <CodeIcon /> },
  { id: "creative", label: "Creative Skills", icon: <BrushIcon /> },
  { id: "career", label: "Career Skills", icon: <BusinessIcon /> },
  { id: "language", label: "Language Skills", icon: <TranslateIcon /> },
  { id: "personal", label: "Personal Growth", icon: <PsychologyIcon /> },
  { id: "entrepreneurship", label: "Entrepreneurship", icon: <LightbulbIcon /> },
];

export default function NonFormalHome() {
  const { isOpen } = useSidebar();
  const { user } = useAuth();
  const { courses, certificates } = useNonFormal();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const resultsRef = useRef(null);

  const isFiltering = searchQuery.length > 0 || selectedCategory !== null;

  useEffect(() => {
    if (isFiltering && resultsRef.current) {
      resultsRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [searchQuery, selectedCategory, isFiltering]);

  // Build a set of certified course IDs for the current user
  const certifiedIds = useMemo(
    () => new Set((certificates || []).filter(c => c.student_id === user?.id).map(c => c.course_id)),
    [certificates, user?.id]
  );

  const categoryMap = {
    tech: "Tech Skills",
    creative: "Creative Skills",
    career: "Career Skills",
    language: "Language Skills",
    personal: "Personal Growth",
    entrepreneurship: "Entrepreneurship",
  };

  const courseCardSx = {
    cursor: "pointer",
    borderRadius: 3,
    transition: "all 0.25s ease",
    border: "1px solid rgba(226,232,240,0.9)",
    background: "linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)",
    boxShadow: "0 10px 24px rgba(15, 23, 42, 0.08)",
    "&:hover": {
      boxShadow: "0 18px 36px rgba(15, 23, 42, 0.14)",
      transform: "translateY(-6px)",
      borderColor: "rgba(14, 165, 233, 0.45)",
    },
  };

  const chipSx = {
    borderColor: "rgba(148,163,184,0.4)",
    color: "#475569",
    fontWeight: 600,
    backgroundColor: "rgba(248,250,252,0.8)",
  };

  const titleSx = { fontWeight: 700, mb: 1, letterSpacing: "-0.01em", color: "#0f172a" };
  const descSx = { color: "#64748b", mb: 1.5 };

  const filtered = useMemo(() => {
    return courses.filter((c) => {
      const matchesSearch =
        c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = !selectedCategory || c.category === categoryMap[selectedCategory];
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory, courses]);

  const recommended = useMemo(() => {
    return [...courses].sort(() => Math.random() - 0.5).slice(0, 3);
  }, [courses]);

  const topInstructors = useMemo(() => {
    const instructorMap = {};
    courses.forEach((c) => {
      if (!instructorMap[c.instructor]) {
        instructorMap[c.instructor] = { name: c.instructor, courseCount: 0, rating: c.rating };
      }
      instructorMap[c.instructor].courseCount += 1;
    });
    return Object.values(instructorMap).sort((a, b) => b.rating - a.rating).slice(0, 4);
  }, [courses]);

  const isTeacher = user?.role === "teacher";

  const handleCourseClick = (courseId) => {
    if (certifiedIds.has(courseId)) {
      setSnackbarOpen(true);
    } else {
      navigate(`/nonformal/course/${courseId}`);
    }
  };

  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      <Sidebar />
      <Box
        sx={{
          flexGrow: 1,
          backgroundImage: "url('/images/nonformalbg.gif')",
          backgroundPosition: "center top",
          backgroundRepeat: "no-repeat",
          backgroundSize: "contain",
          backgroundColor: "#f8fafc",
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
          <Container maxWidth="lg" sx={{ mt: 4, pb: 6 }}>
            {isTeacher && (
              <Alert severity="info" sx={{ mt: 4 }}>
                <Box sx={{ display: "flex", alignItems: "center", flexWrap: "wrap" }}>
                  <Typography variant="body2" sx={{ mr: 2 }}>
                    Non-formal courses are only available for students. Teachers can manage formal courses in their dashboard.
                  </Typography>
                  <Button variant="text" onClick={() => navigate("/dashboard")}>Go to Dashboard</Button>
                </Box>
              </Alert>
            )}

            {!isTeacher && (
              <>
                <PageHeader
                  title="Certificate Courses"
                  subtitle="Flexible, skill-focused micro-courses and workshops"
                  backgroundGradient="linear-gradient(135deg, rgba(56,189,248,0.95) 0%, rgba(45,212,191,0.9) 50%, rgba(34,197,94,0.9) 100%)"
                  useSplitTextTitle
                />

                <Section delay={0.05}>
                  <Card
                    sx={{
                      borderRadius: 3,
                      boxShadow: "0 12px 30px rgba(15, 23, 42, 0.08)",
                      border: "1px solid rgba(226,232,240,0.7)",
                    }}
                  >
                    <CardContent>
                      <TextField
                        fullWidth
                        placeholder="Search courses by skill or topic..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <SearchIcon />
                            </InputAdornment>
                          ),
                        }}
                        sx={{
                          "& .MuiInputBase-root": {
                            backgroundColor: "rgba(248,250,252,0.8)",
                            borderRadius: 3,
                          },
                        }}
                      />
                    </CardContent>
                  </Card>
                </Section>

                <Section title="Explore by Category" delay={0.1}>
                  <Grid container spacing={2.5}>
                    {CATEGORIES.map((cat) => (
                      <Grid item xs={4} sm={4} md={2} key={cat.id}>
                        <Card
                          onClick={() => setSelectedCategory(selectedCategory === cat.id ? null : cat.id)}
                          sx={{
                            cursor: "pointer",
                            borderRadius: 3,
                            border: selectedCategory === cat.id ? "2px solid rgba(14,165,233,0.7)" : "1px solid rgba(226,232,240,0.8)",
                            background: selectedCategory === cat.id ? "rgba(14,165,233,0.08)" : "white",
                            transition: "all 0.25s ease",
                            boxShadow: selectedCategory === cat.id
                              ? "0 12px 24px rgba(14, 165, 233, 0.18)"
                              : "0 10px 18px rgba(15, 23, 42, 0.06)",
                            "&:hover": {
                              boxShadow: "0 16px 28px rgba(15, 23, 42, 0.12)",
                              transform: "translateY(-4px)",
                            },
                          }}
                        >
                          <CardContent sx={{ textAlign: "center", py: 2.5 }}>
                            <Box
                              sx={{
                                width: 44,
                                height: 44,
                                borderRadius: "50%",
                                margin: "0 auto 8px",
                                display: "grid",
                                placeItems: "center",
                                background: "rgba(15, 23, 42, 0.06)",
                                color: "rgba(15, 23, 42, 0.75)",
                              }}
                            >
                              {cat.icon}
                            </Box>
                            <Typography variant="body2" sx={{ fontWeight: 600 }}>
                              {cat.label}
                            </Typography>
                          </CardContent>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                </Section>

                <Box ref={resultsRef} sx={{ scrollMarginTop: 32 }}>
                  <Section
                    title={`All Courses${selectedCategory ? ` in ${categoryMap[selectedCategory]}` : ""}`}
                    delay={0.12}
                  >
                    {filtered.length === 0 ? (
                      <Card sx={{ p: 4, textAlign: "center", borderRadius: 3 }}>
                        <Typography variant="body1" sx={{ color: "#64748b" }}>
                          No courses found. Try a different search or category.
                        </Typography>
                      </Card>
                    ) : (
                      <Grid container spacing={3}>
                        {filtered.map((course) => (
                          <Grid item xs={12} sm={6} md={4} lg={3} key={course.id}>
                            <Card
                              onClick={() => handleCourseClick(course.id)}
                              sx={courseCardSx}
                            >
                              <CardContent>
                                <Box sx={{ fontSize: 30, mb: 1 }}>{course.thumbnail}</Box>
                                <Typography variant="subtitle1" sx={titleSx}>
                                  {course.title}
                                </Typography>
                                <Typography variant="body2" sx={descSx}>
                                  {course.description}
                                </Typography>
                                <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1.5 }}>
                                  <StarIcon sx={{ fontSize: 16, color: "#f59e0b" }} />
                                  <Typography variant="caption" sx={{ fontWeight: 700 }}>
                                    {course.rating}
                                  </Typography>
                                  <Typography variant="caption" sx={{ color: "#94a3b8" }}>
                                    ({course.reviews})
                                  </Typography>
                                </Stack>
                                <Stack direction="row" spacing={1} sx={{ mb: 2, flexWrap: "wrap" }}>
                                  <Chip label={course.level} size="small" variant="outlined" sx={chipSx} />
                                  <Chip label={course.duration} size="small" variant="outlined" sx={chipSx} />
                                </Stack>
                                <InteractiveHoverButton style={{ width: "100%" }}>
                                  Explore
                                </InteractiveHoverButton>
                              </CardContent>
                            </Card>
                          </Grid>
                        ))}
                      </Grid>
                    )}
                  </Section>
                </Box>

                <Section title="Recommended For You" delay={0.15}>
                  <Grid container spacing={3}>
                    {recommended.map((course) => (
                      <Grid item xs={12} sm={6} md={4} key={course.id}>
                        <Card
                          onClick={() => handleCourseClick(course.id)}
                          sx={courseCardSx}
                        >
                          <CardContent>
                            <Box sx={{ fontSize: 30, mb: 1 }}>{course.thumbnail}</Box>
                            <Typography variant="subtitle1" sx={titleSx}>
                              {course.title}
                            </Typography>
                            <Typography variant="body2" sx={descSx}>
                              {course.description}
                            </Typography>
                            <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1.5 }}>
                              <StarIcon sx={{ fontSize: 16, color: "#f59e0b" }} />
                              <Typography variant="caption" sx={{ fontWeight: 700 }}>
                                {course.rating}
                              </Typography>
                              <Typography variant="caption" sx={{ color: "#94a3b8" }}>
                                ({course.reviews})
                              </Typography>
                            </Stack>
                            <Stack direction="row" spacing={1} sx={{ mb: 2, flexWrap: "wrap" }}>
                              <Chip label={course.level} size="small" variant="outlined" sx={chipSx} />
                              <Chip label={course.duration} size="small" variant="outlined" sx={chipSx} />
                            </Stack>
                            <InteractiveHoverButton style={{ width: "100%" }}>
                              View Course
                            </InteractiveHoverButton>
                          </CardContent>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                </Section>

                <Section title="Top-Rated Instructors" delay={0.2}>
                  <Grid container spacing={2.5}>
                    {topInstructors.map((instructor) => (
                      <Grid item xs={6} md={3} key={instructor.name}>
                        <Card
                          sx={{
                            borderRadius: 3,
                            border: "1px solid rgba(226,232,240,0.9)",
                            background: "linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)",
                            boxShadow: "0 10px 22px rgba(15, 23, 42, 0.08)",
                          }}
                        >
                          <CardContent sx={{ textAlign: "center" }}>
                            <Box sx={{ fontSize: 30, mb: 1 }}>🙂</Box>
                            <Typography variant="subtitle1" sx={titleSx}>
                              {instructor.name}
                            </Typography>
                            <Stack direction="row" spacing={0.5} justifyContent="center" sx={{ mb: 1 }}>
                              {[...Array(5)].map((_, i) => (
                                <StarIcon
                                  key={i}
                                  sx={{
                                    fontSize: 16,
                                    color: i < Math.floor(instructor.rating) ? "#f59e0b" : "#e2e8f0",
                                  }}
                                />
                              ))}
                            </Stack>
                            <Typography variant="caption" sx={{ color: "#94a3b8" }}>
                              {instructor.courseCount} courses
                            </Typography>
                          </CardContent>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                </Section>

                <Box sx={{ mt: 6, mb: 2 }}>
                  <Typography variant="body2" sx={{ color: "#64748b", textAlign: "center", fontWeight: 500 }}>
                    © 2025 EduSphere. All rights reserved.
                  </Typography>
                </Box>
              </>
            )}
          </Container>
        </Box>
      </Box>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        message="Already certified for this course"
      />
    </Box>
  );
}