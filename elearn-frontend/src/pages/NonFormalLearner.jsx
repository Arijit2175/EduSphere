import { useState, useMemo, useEffect } from "react";
import {
  Box,
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Stack,
  LinearProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  RadioGroup,
  FormControlLabel,
  Radio,
  Alert,
  Chip,
  useMediaQuery,
  Paper,
} from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { useSidebar } from "../contexts/SidebarContext";
import { useAuth } from "../contexts/AuthContext";
import { useNonFormal } from "../contexts/NonFormalContext";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import AssignmentIcon from "@mui/icons-material/Assignment";
import DownloadIcon from "@mui/icons-material/Download";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";

const AssessmentDialog = ({ open, onClose, questions, onSubmit, onRetry, onGoToDashboard }) => {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const isMobile = useMediaQuery("(max-width:600px)");

  const currentQ = questions[step];
  const totalQ = questions.length;
  const isLast = step === totalQ - 1;
  const passed = score >= 70;

  const handleAnswer = (val) => {
    if (currentQ) setAnswers((prev) => ({ ...prev, [currentQ.id]: parseInt(val, 10) }));
  };

  const handleNext = () => {
    if (isLast) {
      let correct = 0;
      questions.forEach((q) => {
        const selectedIndex = answers[q.id];
        if (selectedIndex === undefined) return;
        const selectedOption = q.options[selectedIndex];
        if (selectedOption === q.correctAnswer) {
          correct += 1;
        }
      });
      const pct = totalQ > 0 ? (correct / totalQ) * 100 : 0;
      setScore(pct);
      setSubmitted(true);
      onSubmit(pct);
    } else {
      setStep((s) => s + 1);
    }
  };

  const handlePrev = () => setStep((s) => Math.max(0, s - 1));


  const currentLesson = course.lessons[currentLessonIdx];
  const progressPercentage = ((userProgress.completedLessons?.length || 0) / (course.lessons?.length || 1)) * 100;
  const isLastLesson = currentLessonIdx === course.lessons.length - 1;

  const handleNextLesson = () => {
    // Mark current lesson as complete before moving to next
    updateLessonProgress(user?.id, courseId, currentLessonIdx);
    
    if (!isLastLesson) {
      setCurrentLessonIdx(currentLessonIdx + 1);
    } else {
      setOpenQuiz(true);
    }
  };

  const handlePrevLesson = () => {
    if (currentLessonIdx > 0) {
      setCurrentLessonIdx(currentLessonIdx - 1);
    }
  };

  const darkBg = "#0f0f1a";
  const cardBg = "#1a1a2e";
  const borderColor = "rgba(255,255,255,0.08)";
  const red = "#e53935";

  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      <Sidebar />
      <Box
        sx={{
          flexGrow: 1,
          background: darkBg,
          color: "#ffffff",
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
          <Box
            sx={{
              position: "sticky",
              top: 0,
              zIndex: 40,
              bgcolor: "rgba(15,15,26,0.8)",
              backdropFilter: "blur(12px)",
              height: 56,
              display: "flex",
              alignItems: "center",
              px: { xs: 2, md: 4 },
            }}
          >
            <Button
              startIcon={<ChevronLeftIcon />}
              onClick={() => navigate("/dashboard")}
              sx={{
                borderRadius: "16px",
                border: "2px dashed #e53935",
                bgcolor: "transparent",
                px: 2,
                py: 0.75,
                fontWeight: 700,
                textTransform: "uppercase",
                color: "#fff",
                fontSize: 12,
                transition: "all 0.3s ease",
                "&:hover": {
                  transform: "translate(-4px, -4px)",
                  borderRadius: "6px",
                  boxShadow: "4px 4px 0 #e53935",
                  bgcolor: "transparent",
                },
                "&:active": {
                  transform: "translate(0, 0)",
                  borderRadius: "16px",
                  boxShadow: "none",
                },
              }}
            >
              Back
            </Button>
            <Typography variant="subtitle2" fontWeight={600} noWrap sx={{ ml: 2 }}>
              {course.title}
            </Typography>
          </Box>

          <Container maxWidth={false} sx={{ py: 3, px: { xs: 2, md: 4 } }}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={9}>
                  <Box sx={{ borderRadius: 3, overflow: "hidden", bgcolor: cardBg, border: `1px solid ${borderColor}` }}>
                  <Box sx={{ aspectRatio: "16 / 9", minHeight: 450, bgcolor: "#000" }}>
                    <iframe
                      style={{ width: "100%", height: "100%" }}
                      src={currentLesson?.videoUrl}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      title={currentLesson?.title}
                    ></iframe>
                  </Box>

                  <Box sx={{ p: { xs: 2, md: 3 } }}>
                    <Typography variant="h6" fontWeight={700} mb={0.5}>
                      {currentLesson?.title}
                    </Typography>
                    <Stack direction="row" spacing={2} alignItems="center" mb={2}>
                      <Typography variant="caption" color="rgba(255,255,255,0.5)">
                        <AccessTimeIcon sx={{ fontSize: 14, mr: 0.5, verticalAlign: "middle" }} />
                        {currentLesson?.duration}
                      </Typography>
                      <Typography variant="caption" color="rgba(255,255,255,0.5)">
                        Lesson {currentLessonIdx + 1} of {course.lessons.length}
                      </Typography>
                    </Stack>

                    <Stack direction="row" justifyContent="space-between" mb={0.5}>
                      <Typography variant="caption" color="rgba(255,255,255,0.5)">
                        Course progress
                      </Typography>
                      <Typography variant="caption" fontWeight={700} color={red}>
                        {Math.round(progressPercentage)}%
                      </Typography>
                    </Stack>
                    <LinearProgress
                      variant="determinate"
                      value={progressPercentage}
                      sx={{
                        mb: 2,
                        height: 8,
                        borderRadius: 4,
                        bgcolor: "rgba(255,255,255,0.08)",
                        "& .MuiLinearProgress-bar": { bgcolor: red, borderRadius: 4 },
                      }}
                    />

                    <Stack direction="row" spacing={1.5}>
                      <Button
                        fullWidth
                        variant="outlined"
                        onClick={handlePrevLesson}
                        disabled={currentLessonIdx === 0}
                        sx={{
                          borderColor: borderColor,
                          color: "rgba(255,255,255,0.7)",
                          "&:hover": { bgcolor: "rgba(255,255,255,0.05)" },
                          "&:disabled": { opacity: 0.4, borderColor: borderColor },
                        }}
                      >
                        ← Previous
                      </Button>
                      <Button
                        fullWidth
                        variant="contained"
                        onClick={handleNextLesson}
                        sx={{ bgcolor: red, "&:hover": { bgcolor: "#c62828" }, fontWeight: 700 }}
                      >
                        {isLastLesson ? "Take Assessment →" : "Next Lesson →"}
                      </Button>
                    </Stack>

                    {course.attachments?.length > 0 && (
                      <Box sx={{ mt: 3, pt: 2, borderTop: `1px solid ${borderColor}` }}>
                        <Typography
                          variant="caption"
                          fontWeight={700}
                          color="rgba(255,255,255,0.5)"
                          sx={{ textTransform: "uppercase", letterSpacing: 1, mb: 1, display: "block" }}
                        >
                          Resources
                        </Typography>
                        <Stack spacing={1}>
                          {course.attachments.map((file, idx) => (
                            <Button
                              key={idx}
                              fullWidth
                              href={file.url}
                              download
                              startIcon={<DownloadIcon sx={{ color: red }} />}
                              sx={{
                                justifyContent: "flex-start",
                                textTransform: "none",
                                color: "rgba(255,255,255,0.7)",
                                bgcolor: "rgba(255,255,255,0.03)",
                                border: `1px solid ${borderColor}`,
                                borderRadius: 2,
                                "&:hover": { bgcolor: "rgba(255,255,255,0.06)" },
                              }}
                            >
                              {file.name}
                            </Button>
                          ))}
                        </Stack>
                      </Box>
                    )}
                  </Box>
                </Box>
              </Grid>

                <Grid item xs={12} md={3}>
                  <Box
                    sx={{
                      borderRadius: 3,
                      bgcolor: cardBg,
                      border: `1px solid ${borderColor}`,
                      position: { lg: "sticky" },
                      top: { lg: 72 },
                    }}
                  >
                  <Box sx={{ p: 2, borderBottom: `1px solid ${borderColor}` }}>
                    <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1}>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <MenuBookIcon sx={{ fontSize: 18, color: red }} />
                        <Typography variant="subtitle2" fontWeight={700}>Course Content</Typography>
                      </Stack>
                      <Chip
                        label={`${Math.round(progressPercentage)}%`}
                        size="small"
                        sx={{ bgcolor: "rgba(229,57,53,0.15)", color: red, fontWeight: 700, fontSize: 11 }}
                      />
                    </Stack>
                    <LinearProgress
                      variant="determinate"
                      value={progressPercentage}
                      sx={{
                        height: 6,
                        borderRadius: 3,
                        bgcolor: "rgba(255,255,255,0.08)",
                        "& .MuiLinearProgress-bar": { bgcolor: red, borderRadius: 3 },
                      }}
                    />
                    <Typography variant="caption" color="rgba(255,255,255,0.4)" mt={0.5} display="block">
                      {(userProgress.completedLessons?.length || 0)} of {course.lessons.length} lessons completed
                    </Typography>
                  </Box>

                  <Box sx={{ p: 1, maxHeight: { xs: "40vh", lg: "60vh" }, overflowY: "auto" }}>
                    {course.lessons.map((lesson, idx) => {
                      const isActive = currentLessonIdx === idx;
                      const isCompleted = userProgress.completedLessons?.includes(idx);
                      return (
                        <Button
                          key={lesson.id}
                          fullWidth
                          onClick={() => setCurrentLessonIdx(idx)}
                          sx={{
                            justifyContent: "flex-start",
                            textTransform: "none",
                            borderRadius: 2,
                            mb: 0.5,
                            py: 1.5,
                            px: 1.5,
                            bgcolor: isActive ? "rgba(229,57,53,0.1)" : "transparent",
                            border: isActive ? "1px solid rgba(229,57,53,0.3)" : "1px solid transparent",
                            "&:hover": { bgcolor: isActive ? "rgba(229,57,53,0.15)" : "rgba(255,255,255,0.04)" },
                          }}
                        >
                          <Stack direction="row" spacing={1.5} alignItems="flex-start" width="100%">
                            {isCompleted ? (
                              <Box
                                sx={{
                                  width: 24,
                                  height: 24,
                                  borderRadius: "50%",
                                  bgcolor: "rgba(102,187,106,0.2)",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  flexShrink: 0,
                                }}
                              >
                                <CheckCircleIcon sx={{ fontSize: 16, color: "#66bb6a" }} />
                              </Box>
                            ) : isActive ? (
                              <Box
                                sx={{
                                  width: 24,
                                  height: 24,
                                  borderRadius: "50%",
                                  bgcolor: "rgba(229,57,53,0.2)",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  flexShrink: 0,
                                }}
                              >
                                <PlayArrowIcon sx={{ fontSize: 14, color: red }} />
                              </Box>
                            ) : (
                              <Box
                                sx={{
                                  width: 24,
                                  height: 24,
                                  borderRadius: "50%",
                                  border: "1px solid rgba(255,255,255,0.2)",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  flexShrink: 0,
                                }}
                              >
                                <Typography variant="caption" color="rgba(255,255,255,0.4)" fontSize={10}>
                                  {idx + 1}
                                </Typography>
                              </Box>
                            )}
                            <Box sx={{ textAlign: "left", minWidth: 0 }}>
                              <Typography
                                variant="body2"
                                fontWeight={500}
                                noWrap
                                color={isActive ? "#fff" : "rgba(255,255,255,0.7)"}
                              >
                                {lesson.title}
                              </Typography>
                              <Stack direction="row" spacing={0.5} alignItems="center" mt={0.25}>
                                <AccessTimeIcon sx={{ fontSize: 12, color: "rgba(255,255,255,0.35)" }} />
                                <Typography variant="caption" color="rgba(255,255,255,0.35)">
                                  {lesson.duration}
                                </Typography>
                              </Stack>
                            </Box>
                          </Stack>
                        </Button>
                      );
                    })}
                  </Box>

                  {isLastLesson && (
                    <Box sx={{ p: 1.5, borderTop: `1px solid ${borderColor}` }}>
                      <Button
                        fullWidth
                        variant="contained"
                        onClick={() => setOpenQuiz(true)}
                        disabled={progressPercentage < 100}
                        startIcon={<EmojiEventsIcon />}
                        sx={{
                          bgcolor: progressPercentage >= 100 ? red : "rgba(255,255,255,0.08)",
                          color: progressPercentage >= 100 ? "#fff" : "rgba(255,255,255,0.4)",
                          fontWeight: 700,
                          py: 1.5,
                          borderRadius: 2,
                          "&:hover": { bgcolor: progressPercentage >= 100 ? "#c62828" : "rgba(255,255,255,0.08)" },
                          "&:disabled": { bgcolor: "rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.4)" },
                        }}
                      >
                        {progressPercentage < 100
                          ? `Complete all lessons (${Math.round(progressPercentage)}%)`
                          : "Take Final Assessment"}
                      </Button>
                    </Box>
                  )}
                  </Box>
                </Grid>
              </Grid>
          </Container>

          <AssessmentDialog
            open={openQuiz}
            onClose={() => setOpenQuiz(false)}
            questions={quizQuestions}
            onSubmit={(score) => {
              if (score < 70) {
                updateAssessmentScore(user?.id, courseId, score);
              }
              if (score >= 70) {
                earnCertificate(user?.id, courseId);
              } else {
                resetCourseProgress(user?.id, courseId);
                setCurrentLessonIdx(0);
              }
            }}
            onRetry={() => {
              setOpenQuiz(false);
              setCurrentLessonIdx(0);
            }}
            onGoToDashboard={() => {
              setOpenQuiz(false);
              navigate("/nonformal");
            }}
          />
        </Box>
      </Box>
    </Box>
  );
}
