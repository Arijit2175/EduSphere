import { useState, useMemo } from "react";
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
} from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { useSidebar } from "../contexts/SidebarContext";
import { useAuth } from "../contexts/AuthContext";
import { useNonFormal } from "../contexts/NonFormalContext";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import AssignmentIcon from "@mui/icons-material/Assignment";

const SAMPLE_QUIZ = [
  { id: "q1", question: "What is the primary purpose of this course?", options: ["Option A", "Option B", "Option C", "Option D"] },
  { id: "q2", question: "Which concept is most important?", options: ["Concept 1", "Concept 2", "Concept 3", "Concept 4"] },
  { id: "q3", question: "How would you apply this?", options: ["Apply A", "Apply B", "Apply C", "Apply D"] },
];

export default function NonFormalLearner() {
  const { isOpen } = useSidebar();
  const { user } = useAuth();
  const { courseId } = useParams();
  const { courses, getCourseProgress, updateLessonProgress, updateAssessmentScore, resetCourseProgress, earnCertificate } = useNonFormal();
  const navigate = useNavigate();

  const course = courses.find((c) => c.id === courseId);
  const progress = getCourseProgress(user?.id, courseId);
  const [currentLessonIdx, setCurrentLessonIdx] = useState(progress?.currentLessonIndex || 0);
  const [openQuiz, setOpenQuiz] = useState(false);
  const [quizAnswers, setQuizAnswers] = useState({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState(0);

  if (!course || !progress) {
    return (
      <Box sx={{ display: "flex", minHeight: "100vh" }}>
        <Sidebar />
        <Box sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}>
          <Navbar />
          <Box sx={{ flexGrow: 1, ml: { xs: 0, md: isOpen ? 25 : 8.75 }, transition: "margin-left 0.3s ease", p: 4 }}>
            <Typography variant="h5">Course not found or not enrolled</Typography>
            <Button onClick={() => navigate("/nonformal")} sx={{ mt: 2 }}>
              Back to Courses
            </Button>
          </Box>
        </Box>
      </Box>
    );
  }

  const currentLesson = course.lessons[currentLessonIdx];
  const progressPercentage = ((progress.completedLessons?.length || 0) / (course.lessons?.length || 1)) * 100;
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

  const handleSubmitQuiz = () => {
    // Only allow assessment if all lessons are completed (100%)
    if (progressPercentage < 100) {
      alert("⚠️ You must complete all lessons before taking the assessment!");
      return;
    }

    let score = 0;
    SAMPLE_QUIZ.forEach((q, idx) => {
      if (quizAnswers[q.id] === idx.toString()) score += 1;
    });
    const percentage = (score / SAMPLE_QUIZ.length) * 100;
    
    setQuizScore(percentage);
    setQuizSubmitted(true);
    updateAssessmentScore(user?.id, courseId, percentage);
    
    // If passed, earn certificate
    if (percentage >= 70) {
      earnCertificate(user?.id, courseId);
    }
    
    // If failed, reset course to first lesson
    if (percentage < 70) {
      resetCourseProgress(user?.id, courseId);
      setCurrentLessonIdx(0);
      setQuizAnswers({});
    }
  };

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
        <Container maxWidth="lg" sx={{ mt: 2 }}>
          <Grid container spacing={2}>
            {/* Main Player */}
            <Grid item xs={12} md={8}>
              <Card sx={{ mb: 2 }}>
                <CardContent sx={{ p: 0 }}>
                  {/* Video Player */}
                  <Box
                    sx={{
                      position: "relative",
                      paddingBottom: "56.25%",
                      height: 0,
                      overflow: "hidden",
                      background: "#000",
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
                      src={currentLesson?.videoUrl}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      title={currentLesson?.title}
                    ></iframe>
                  </Box>

                  {/* Video Info */}
                  <Box sx={{ p: 3 }}>
                    <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
                      {currentLesson?.title}
                    </Typography>
                    <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
                      <Typography variant="body2" sx={{ color: "#6b7280" }}>
                        Duration: {currentLesson?.duration}
                      </Typography>
                      <Typography variant="body2" sx={{ color: "#6b7280" }}>
                        Lesson {currentLessonIdx + 1} of {course.lessons.length}
                      </Typography>
                    </Stack>

                    {/* Progress Bar */}
                    <LinearProgress
                      variant="determinate"
                      value={progressPercentage}
                      sx={{ mb: 2, height: 8, borderRadius: 1 }}
                    />

                    {/* Navigation */}
                    <Stack direction="row" spacing={2} justifyContent="space-between">
                      <Button variant="outlined" onClick={handlePrevLesson} disabled={currentLessonIdx === 0}>
                        ← Previous Lesson
                      </Button>
                      <Button variant="contained" onClick={handleNextLesson}>
                        {isLastLesson ? "Take Assessment →" : "Next Lesson →"}
                      </Button>
                    </Stack>
                  </Box>
                </CardContent>
              </Card>

              {/* Description */}
              <Card>
                <CardContent>
                  <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                    📝 About this lesson
                  </Typography>
                  <Typography variant="body2" sx={{ color: "#6b7280", mb: 2 }}>
                    This lesson covers important concepts and skills. Pay attention to the key points and try to apply them in practice.
                  </Typography>

                  {course.attachments?.length > 0 && (
                    <>
                      <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>
                        📎 Resources
                      </Typography>
                      <Stack spacing={1}>
                        {course.attachments.map((file, idx) => (
                          <Button key={idx} fullWidth variant="outlined" href={file.url} download startIcon={<AssignmentIcon />}>
                            {file.name}
                          </Button>
                        ))}
                      </Stack>
                    </>
                  )}
                </CardContent>
              </Card>
            </Grid>

            {/* Sidebar - Lessons List */}
            <Grid item xs={12} md={4}>
              <Card>
                <CardContent>
                  <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                    📚 Course Content
                  </Typography>
                  <Typography variant="caption" sx={{ color: "#6b7280", mb: 2, display: "block" }}>
                    {Math.round(progressPercentage)}% Complete
                  </Typography>
                  <LinearProgress variant="determinate" value={progressPercentage} sx={{ mb: 2 }} />

                  <Stack spacing={1}>
                    {course.lessons?.map((lesson, idx) => (
                      <Button
                        key={lesson.id}
                        fullWidth
                        variant={currentLessonIdx === idx ? "contained" : "outlined"}
                        onClick={() => setCurrentLessonIdx(idx)}
                        startIcon={
                          progress.completedLessons?.includes(idx) ? (
                            <CheckCircleIcon />
                          ) : (
                            <RadioButtonUncheckedIcon />
                          )
                        }
                        sx={{
                          justifyContent: "flex-start",
                          textAlign: "left",
                          textTransform: "none",
                        }}
                      >
                        <Box>
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            {idx + 1}. {lesson.title}
                          </Typography>
                          <Typography variant="caption" sx={{ color: "#9ca3af" }}>
                            {lesson.duration}
                          </Typography>
                        </Box>
                      </Button>
                    ))}
                  </Stack>

                  {isLastLesson && (
                    <Button
                      fullWidth
                      variant="contained"
                      color="success"
                      onClick={() => setOpenQuiz(true)}
                      disabled={progressPercentage < 100}
                      sx={{ mt: 2 }}
                      startIcon={<AssignmentIcon />}
                    >
                      {progressPercentage < 100 
                        ? `Take Final Assessment (${Math.round(progressPercentage)}% Complete)` 
                        : "Take Final Assessment"}
                    </Button>
                  )}
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Container>

        {/* Quiz Dialog */}
        <Dialog open={openQuiz} onClose={() => !quizSubmitted && setOpenQuiz(false)} maxWidth="md" fullWidth>
          <DialogTitle>📋 Final Assessment</DialogTitle>
          <DialogContent>
            {!quizSubmitted ? (
              <Stack spacing={3} sx={{ mt: 2 }}>
                <Alert severity="info">
                  📊 You need <strong>70%</strong> to pass and earn the certificate
                </Alert>
                {SAMPLE_QUIZ.map((q, idx) => (
                  <Stack key={q.id}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>
                      {idx + 1}. {q.question}
                    </Typography>
                    <RadioGroup value={quizAnswers[q.id] || ""} onChange={(e) => setQuizAnswers({ ...quizAnswers, [q.id]: e.target.value })}>
                      {q.options.map((option, optIdx) => (
                        <FormControlLabel key={optIdx} value={optIdx.toString()} control={<Radio />} label={option} />
                      ))}
                    </RadioGroup>
                  </Stack>
                ))}
              </Stack>
            ) : (
              <Stack spacing={2} sx={{ mt: 2 }}>
                <Alert severity={quizScore >= 70 ? "success" : "warning"}>
                  {quizScore >= 70
                    ? "🎉 Congratulations! You passed the assessment!"
                    : `⚠️ Score: ${quizScore.toFixed(0)}% - You need 70% to earn the certificate. Try again!`}
                </Alert>
                <Typography variant="h4" sx={{ fontWeight: 700, textAlign: "center" }}>
                  {quizScore.toFixed(0)}%
                </Typography>
                <Typography variant="body2" sx={{ textAlign: "center", color: "#6b7280" }}>
                  {quizScore >= 70
                    ? `Your certificate has been generated. Download it from your dashboard!`
                    : `Review the lessons and try again to improve your score.`}
                </Typography>
              </Stack>
            )}
          </DialogContent>
          <DialogActions>
            {!quizSubmitted ? (
              <>
                <Button onClick={() => setOpenQuiz(false)}>Cancel</Button>
                <Button 
                  variant="contained" 
                  onClick={handleSubmitQuiz}
                  disabled={progressPercentage < 100}
                >
                  Submit Assessment
                </Button>
              </>
            ) : (
              <>
                <Button
                  onClick={() => {
                    setOpenQuiz(false);
                    setQuizSubmitted(false);
                    setQuizAnswers({});
                    if (quizScore >= 70) {
                      navigate("/nonformal");
                    } else {
                      setCurrentLessonIdx(0);
                    }
                  }}
                >
                  {quizScore >= 70 ? "Go to Dashboard" : "Review Lessons"}
                </Button>
              </>
            )}
          </DialogActions>
        </Dialog>
        </Container>
        </Box>
      </Box>
    </Box>
  );
}
