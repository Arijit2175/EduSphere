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
        if (answers[q.id] === q.correctAnswer) correct += 1;
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

  const resetDialog = () => {
    setStep(0);
    setAnswers({});
    setSubmitted(false);
    setScore(0);
  };

  return (
    <Dialog
      open={open}
      onClose={() => {
        if (!submitted) {
          resetDialog();
          onClose();
        }
      }}
      maxWidth="sm"
      fullWidth
      fullScreen={isMobile}
      PaperProps={{
        sx: {
          bgcolor: "#1a1a2e",
          color: "#fff",
          borderRadius: isMobile ? 0 : 3,
          border: "1px solid rgba(255,255,255,0.08)",
        },
      }}
    >
      <DialogTitle sx={{ borderBottom: "1px solid rgba(255,255,255,0.08)", pb: 2 }}>
        <Stack direction="row" alignItems="center" spacing={1}>
          <AssignmentIcon sx={{ color: "#e53935" }} />
          <Typography variant="h6" fontWeight={700}>Final Assessment</Typography>
        </Stack>
      </DialogTitle>
      <DialogContent sx={{ py: 3 }}>
        {!submitted ? (
          <Box>
            <Stack direction="row" spacing={0.5} justifyContent="center" mb={3}>
              {questions.map((_, i) => (
                <Box
                  key={i}
                  sx={{
                    width: 10,
                    height: 10,
                    borderRadius: "50%",
                    bgcolor:
                      i === step
                        ? "#e53935"
                        : answers[questions[i]?.id] !== undefined
                          ? "#66bb6a"
                          : "rgba(255,255,255,0.15)",
                    transition: "all 0.2s",
                  }}
                />
              ))}
            </Stack>

            <Alert severity="info" sx={{ mb: 3, bgcolor: "rgba(33,150,243,0.1)", color: "#90caf9" }}>
              You need <strong>70%</strong> to pass and earn the certificate
            </Alert>

            <Typography variant="subtitle1" fontWeight={700} mb={2}>
              {step + 1}. {currentQ?.question}
            </Typography>

            <RadioGroup
              value={answers[currentQ?.id]?.toString() ?? ""}
              onChange={(e) => handleAnswer(e.target.value)}
            >
              {currentQ?.options.map((opt, i) => (
                <Paper
                  key={i}
                  sx={{
                    mb: 1,
                    p: 1.5,
                    borderRadius: 2,
                    bgcolor: answers[currentQ.id] === i ? "rgba(229,57,53,0.15)" : "rgba(255,255,255,0.03)",
                    border: answers[currentQ.id] === i ? "1px solid #e53935" : "1px solid rgba(255,255,255,0.08)",
                    cursor: "pointer",
                    transition: "all 0.2s",
                    "&:hover": { bgcolor: "rgba(255,255,255,0.06)" },
                  }}
                  onClick={() => handleAnswer(i.toString())}
                >
                  <FormControlLabel
                    value={i.toString()}
                    control={<Radio sx={{ color: "rgba(255,255,255,0.3)", "&.Mui-checked": { color: "#e53935" } }} />}
                    label={<Typography variant="body2" color="#e0e0e0">{opt}</Typography>}
                    sx={{ m: 0, width: "100%" }}
                  />
                </Paper>
              ))}
            </RadioGroup>
          </Box>
        ) : (
          <Stack alignItems="center" spacing={3} py={3}>
            <Box
              sx={{
                width: 100,
                height: 100,
                borderRadius: "50%",
                bgcolor: passed ? "rgba(102,187,106,0.15)" : "rgba(255,167,38,0.15)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Typography variant="h3" fontWeight={800} color={passed ? "#66bb6a" : "#ffa726"}>
                {score.toFixed(0)}%
              </Typography>
            </Box>
            <Typography variant="h6" fontWeight={700}>
              {passed ? "🎉 Congratulations!" : "Almost there!"}
            </Typography>
            <Typography variant="body2" color="rgba(255,255,255,0.6)" textAlign="center">
              {passed
                ? "You passed! Your certificate has been generated."
                : `You scored ${score.toFixed(0)}%. You need 70% to pass. Review the lessons and try again.`}
            </Typography>
          </Stack>
        )}
      </DialogContent>
      <DialogActions sx={{ borderTop: "1px solid rgba(255,255,255,0.08)", p: 2 }}>
        {!submitted ? (
          <>
            <Button onClick={handlePrev} disabled={step === 0} sx={{ color: "rgba(255,255,255,0.5)" }}>
              Previous
            </Button>
            <Box sx={{ flex: 1 }} />
            <Chip
              label={`${step + 1} / ${totalQ}`}
              size="small"
              sx={{ bgcolor: "rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.5)", mr: 1 }}
            />
            <Button
              variant="contained"
              onClick={handleNext}
              disabled={answers[currentQ?.id] === undefined}
              sx={{
                bgcolor: "#e53935",
                "&:hover": { bgcolor: "#c62828" },
                "&:disabled": { bgcolor: "rgba(255,255,255,0.08)" },
              }}
            >
              {isLast ? "Submit" : "Next"}
            </Button>
          </>
        ) : (
          <>
            {passed ? (
              <Button
                fullWidth
                variant="contained"
                onClick={() => {
                  resetDialog();
                  onGoToDashboard();
                }}
                sx={{ bgcolor: "#e53935", "&:hover": { bgcolor: "#c62828" } }}
              >
                Go to Dashboard
              </Button>
            ) : (
              <Button
                fullWidth
                variant="contained"
                onClick={() => {
                  resetDialog();
                  onRetry();
                }}
                sx={{ bgcolor: "#e53935", "&:hover": { bgcolor: "#c62828" } }}
              >
                Review & Retry
              </Button>
            )}
          </>
        )}
      </DialogActions>
    </Dialog>
  );
};


export default function NonFormalLearner() {
  const { isOpen } = useSidebar();
  const { user } = useAuth();
  const { courseId } = useParams();
  const { courses, getCourseProgress, updateLessonProgress, updateAssessmentScore, resetCourseProgress, earnCertificate, enrollments, progress, isLoading } = useNonFormal();
  const navigate = useNavigate();

  // Debug logging after all hooks/vars
  console.log('DEBUG: courseId param:', courseId);
  console.log('DEBUG: courses array:', courses);
  console.log('DEBUG: enrollments:', enrollments);
  console.log('DEBUG: progress:', progress);

  const course = courses.find((c) => String(c.id) === String(courseId));
  const userProgress = getCourseProgress(user?.id, courseId);
  const [currentLessonIdx, setCurrentLessonIdx] = useState(userProgress?.currentLessonIndex || 0);
  const [openQuiz, setOpenQuiz] = useState(false);
  const quizQuestions = course?.assessmentQuestions && Array.isArray(course.assessmentQuestions) && course.assessmentQuestions.length > 0
    ? course.assessmentQuestions
    : [];

  // Show loading state while context is loading OR if we don't have courses/enrollments data yet
  const isDataPending = isLoading || !courses || courses.length === 0 || !enrollments;
  
  if (isDataPending) {
    return (
      <Box sx={{ display: "flex", minHeight: "100vh" }}>
        <Sidebar />
        <Box sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}>
          <Navbar />
          <Box sx={{ flexGrow: 1, ml: { xs: 0, md: isOpen ? 25 : 8.75 }, transition: "margin-left 0.3s ease", p: 4, display: "flex", justifyContent: "center", alignItems: "center" }}>
            <Typography variant="h5">Loading course...</Typography>
          </Box>
        </Box>
      </Box>
    );
  }

  // Only show error if data is fully loaded but course/progress not found
  if (!course || !userProgress) {
    return (
      <Box sx={{ display: "flex", minHeight: "100vh" }}>
        <Sidebar />
        <Box sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}>
          <Navbar />
          <Box sx={{ flexGrow: 1, ml: { xs: 0, md: isOpen ? 25 : 8.75 }, transition: "margin-left 0.3s ease", p: 4 }}>
            <Typography variant="h5">Course not found or not enrolled</Typography>
            <Button onClick={() => navigate("/nonformal") } sx={{ mt: 2 }}>
              Back to Courses
            </Button>
          </Box>
        </Box>
      </Box>
    );
  }

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
                <Grid item xs={12} lg={9}>
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

                <Grid item xs={12} lg={3}>
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
