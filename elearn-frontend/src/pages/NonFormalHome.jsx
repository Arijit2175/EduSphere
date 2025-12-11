import { useState, useMemo } from "react";
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
  const { courses } = useNonFormal();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);

  const categoryMap = {
    tech: "Tech Skills",
    creative: "Creative Skills",
    career: "Career Skills",
    language: "Language Skills",
    personal: "Personal Growth",
    entrepreneurship: "Entrepreneurship",
  };

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
    return [...courses].sort(() => Math.random() - 0.5).slice(0, 4);
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
          {isTeacher && (
            <Alert severity="info" sx={{ mt: 4 }}>
              <Box sx={{ display: "flex", alignItems: "center", flexWrap: "wrap" }}>
                <Typography variant="body2" sx={{ mr: 2 }}>
                  Non-formal courses are only available for students. Teachers can manage formal courses in their dashboard.
                </Typography>
                <Button variant="text" onClick={() => navigate("/dashboard")}>
                  Go to Dashboard
                </Button>
              </Box>
            </Alert>
          )}

          {!isTeacher && (
            <>
              <PageHeader
                title="Non-Formal Learning"
                subtitle="Flexible, skill-focused micro-courses and workshops"
                backgroundGradient="linear-gradient(135deg, #f093fb 0%, #f5576c 100%)"
              />

              <Card sx={{ mb: 3 }}>
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
                  />
                </CardContent>
              </Card>

              <Section background="transparent">
                <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>Explore by Category</Typography>
                <Grid container spacing={2} sx={{ mb: 4 }}>
                  {CATEGORIES.map((cat) => (
                    <Grid item xs={12} sm={6} md={4} lg={2} key={cat.id}>
                      <Card
                        onClick={() => setSelectedCategory(selectedCategory === cat.id ? null : cat.id)}
                        sx={{
                          cursor: "pointer",
                          border: selectedCategory === cat.id ? "2px solid #667eea" : "1px solid #e5e7eb",
                          background: selectedCategory === cat.id ? "#667eea10" : "white",
                          transition: "all 0.3s ease",
                          "&:hover": { boxShadow: 2, transform: "translateY(-4px)" },
                        }}
                      >
                        <CardContent sx={{ textAlign: "center" }}>
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>{cat.label}</Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </Section>

              <Section background="transparent">
                <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>Recommended For You</Typography>
                <Grid container spacing={3} sx={{ mb: 4 }}>
                  {recommended.map((course) => (
                    <Grid item xs={12} sm={6} md={3} key={course.id}>
                      <Card
                        onClick={() => navigate(`/nonformal/course/${course.id}`)}
                        sx={{
                          cursor: "pointer",
                          transition: "all 0.3s ease",
                          "&:hover": { boxShadow: 3, transform: "translateY(-8px)" },
                        }}
                      >
                        <CardContent>
                          <Box sx={{ fontSize: 32, mb: 1 }}>{course.thumbnail}</Box>
                          <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1 }}>
                            {course.title}
                          </Typography>
                          <Typography variant="body2" sx={{ color: "#6b7280", mb: 1.5 }}>
                            {course.description}
                          </Typography>
                          <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1.5 }}>
                            <StarIcon sx={{ fontSize: 16, color: "#fbbf24" }} />
                            <Typography variant="caption" sx={{ fontWeight: 600 }}>
                              {course.rating}
                            </Typography>
                            <Typography variant="caption" sx={{ color: "#9ca3af" }}>
                              ({course.reviews})
                            </Typography>
                          </Stack>
                          <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
                            <Chip label={course.level} size="small" variant="outlined" />
                            <Chip label={course.duration} size="small" variant="outlined" />
                          </Stack>
                          <Button fullWidth variant="contained" size="small">
                            View Course
                          </Button>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </Section>

              <Section background="transparent">
                <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>Top-Rated Instructors</Typography>
                <Grid container spacing={2} sx={{ mb: 4 }}>
                  {topInstructors.map((instructor) => (
                    <Grid item xs={12} sm={6} md={3} key={instructor.name}>
                      <Card>
                        <CardContent sx={{ textAlign: "center" }}>
                          <Box sx={{ fontSize: 32, mb: 1 }}>🙂</Box>
                          <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1 }}>
                            {instructor.name}
                          </Typography>
                          <Stack direction="row" spacing={0.5} justifyContent="center" sx={{ mb: 1 }}>
                            {[...Array(5)].map((_, i) => (
                              <StarIcon
                                key={i}
                                sx={{
                                  fontSize: 16,
                                  color: i < Math.floor(instructor.rating) ? "#fbbf24" : "#e5e7eb",
                                }}
                              />
                            ))}
                          </Stack>
                          <Typography variant="caption" sx={{ color: "#9ca3af" }}>
                            {instructor.courseCount} courses
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </Section>

              <Section background="transparent">
                <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>
                  All Courses {selectedCategory && `in ${categoryMap[selectedCategory]}`}
                </Typography>
                {filtered.length === 0 ? (
                  <Card sx={{ p: 4, textAlign: "center" }}>
                    <Typography variant="body1" sx={{ color: "#999" }}>
                      No courses found. Try a different search or category.
                    </Typography>
                  </Card>
                ) : (
                  <Grid container spacing={3}>
                    {filtered.map((course) => (
                      <Grid item xs={12} sm={6} md={4} lg={3} key={course.id}>
                        <Card
                          onClick={() => navigate(`/nonformal/course/${course.id}`)}
                          sx={{
                            cursor: "pointer",
                            transition: "all 0.3s ease",
                            "&:hover": { boxShadow: 3, transform: "translateY(-8px)" },
                          }}
                        >
                          <CardContent>
                            <Box sx={{ fontSize: 32, mb: 1 }}>{course.thumbnail}</Box>
                            <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>
                              {course.title}
                            </Typography>
                            <Typography variant="body2" sx={{ color: "#6b7280", mb: 1.5, fontSize: "0.85rem" }}>
                              {course.description}
                            </Typography>
                            <Stack direction="row" spacing={0.5} alignItems="center" sx={{ mb: 1.5 }}>
                              <StarIcon sx={{ fontSize: 14, color: "#fbbf24" }} />
                              <Typography variant="caption" sx={{ fontWeight: 600 }}>
                                {course.rating}
                              </Typography>
                              <Typography variant="caption" sx={{ color: "#9ca3af" }}>
                                ({course.reviews})
                              </Typography>
                            </Stack>
                            <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
                              <Chip label={course.level} size="small" variant="outlined" />
                              <Chip label={course.duration} size="small" variant="outlined" />
                            </Stack>
                            <Button fullWidth variant="contained" size="small">
                              Explore
                            </Button>
                          </CardContent>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                )}
              </Section>
            </>
          )}
        </Container>
      </Box>
    </Box>
  );
}