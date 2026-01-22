import { Card, CardContent, Box, Typography, Chip, Button, LinearProgress, Snackbar, Alert, Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useCourses } from "../contexts/CoursesContext";
import { useAuth } from "../contexts/AuthContext";
import { useState } from "react";
import StarIcon from "@mui/icons-material/Star";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

const MotionCard = motion(Card);

export default function CourseCardAdvanced({
  id,
  title,
  description,
  icon,
  category,
  level,
  duration,
  students,
  rating,
  progress,
  instructor,
  showProgress = false,
  actionText = "Enroll Now",
  onEnroll,
  enrolledOverride,
}) {
  const { enrollCourse, isEnrolled } = useCourses();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
  const [confirmDialog, setConfirmDialog] = useState({ open: false });
  const enrolled = enrolledOverride !== undefined ? enrolledOverride : isEnrolled(id);

  const handleEnrollClick = () => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    // If parent supplied onEnroll, let parent handle confirmation/UI and do not open local dialog
    if (onEnroll) {
      const result = onEnroll({ id, title, description, icon, category, level, duration, instructor, rating });
      // Parent handled UI (e.g., opened its own confirm) and returned nothing
      if (result === undefined) return;
      setSnackbar({
        open: true,
        message: result?.message || (result?.success ? "Enrolled" : "Unable to enroll"),
        severity: result?.success ? "success" : "info",
      });
      if (result?.success) {
        setTimeout(() => navigate("/formal"), 1200);
      }
      return;
    }
    // Default local confirmation dialog
    setConfirmDialog({ open: true });
  };

  const handleConfirmEnroll = async () => {
    setConfirmDialog({ open: false });
    
    // Only reaches here when no onEnroll is provided (local confirm)

    const courseData = { id, title, description, icon, category, level, duration, instructor, rating };
    const result = enrollCourse(courseData);
    
    setSnackbar({
      open: true,
      message: result.message,
      severity: result.success ? "success" : "info",
    });

    if (result.success) {
      setTimeout(() => navigate("/dashboard"), 1500);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };
  const getLevelColor = (level) => {
    switch (level?.toLowerCase()) {
      case "beginner":
        return "#10b981";
      case "intermediate":
        return "#f59e0b";
      case "advanced":
        return "#ef4444";
      default:
        return "#667eea";
    }
  };

  const categoryGradients = {
    formal: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    nonformal: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
    informal: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
  };

  const getBg = (cat) => {
    if (cat?.toLowerCase().includes("formal")) return categoryGradients.formal;
    if (cat?.toLowerCase().includes("non")) return categoryGradients.nonformal;
    return categoryGradients.informal;
  };

  return (
    <MotionCard
      whileHover={{ y: -12, boxShadow: "0 20px 40px rgba(102, 126, 234, 0.2)" }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        borderRadius: "16px",
        overflow: "hidden",
        border: "1px solid #e5e7eb",
        background: "#ffffff",
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
        position: "relative",
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "3px",
          background: getBg(category),
        },
      }}
    >
      {/* Header with Icon */}
      <Box
        sx={{
          background: getBg(category),
          py: 5,
          px: 3,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "3.5rem",
          position: "relative",
          overflow: "hidden",
          "&::after": {
            content: '""',
            position: "absolute",
            top: "-50%",
            right: "-50%",
            width: "200px",
            height: "200px",
            background: "rgba(255,255,255,0.1)",
            borderRadius: "50%",
          },
        }}
      >
        <Box sx={{ position: "relative", zIndex: 1, filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.1))" }}>{icon}</Box>
      </Box>

      <CardContent sx={{ flexGrow: 1, display: "flex", flexDirection: "column", gap: 2.5, p: 3 }}>
        {/* Category & Level */}
        <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
          <Chip
            label={category}
            size="small"
            sx={{
              fontWeight: 700,
              background: "rgba(102, 126, 234, 0.1)",
              color: "#667eea",
              fontSize: "0.75rem",
            }}
          />
          <Chip
            label={level}
            size="small"
            sx={{
              fontWeight: 700,
              background: `${getLevelColor(level)}20`,
              color: getLevelColor(level),
              fontSize: "0.75rem",
            }}
          />
        </Box>

        {/* Title & Description */}
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 800, color: "#1f2937", mb: 1, lineHeight: 1.3 }}>
            {title}
          </Typography>
          <Typography variant="body2" sx={{ color: "#6b7280", lineHeight: 1.6, minHeight: "3em" }}>
            {description}
          </Typography>
        </Box>

        {/* Course Meta */}
        {instructor && (
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, pt: 1 }}>
            <Typography variant="body2" sx={{ fontSize: "1.2rem" }}>👨‍🏫</Typography>
            <Typography variant="caption" sx={{ color: "#667eea", fontWeight: 700 }}>
              {instructor}
            </Typography>
          </Box>
        )}

        {/* Progress Bar (for enrolled courses) */}
        {showProgress && progress !== undefined && (
          <Box sx={{ pt: 1 }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
              <Typography variant="caption" sx={{ color: "#6b7280", fontWeight: 600 }}>
                Progress
              </Typography>
              <Typography variant="caption" sx={{ fontWeight: 800, color: "#667eea" }}>
                {progress}%
              </Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={progress}
              sx={{
                height: 8,
                borderRadius: 8,
                background: "#e5e7eb",
                "& .MuiLinearProgress-bar": {
                  background: "linear-gradient(90deg, #667eea 0%, #764ba2 100%)",
                  borderRadius: 8,
                },
              }}
            />
          </Box>
        )}

        {/* Stats */}
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", pt: 2, borderTop: "1px solid #f3f4f6" }}>
          <Box sx={{ display: "flex", gap: 2, fontSize: "0.9rem", color: "#6b7280" }}>
            {students && <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>👥 <span>{students}</span></Box>}
            {duration && <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>⏱️ <span>{duration}</span></Box>}
          </Box>
          {rating && (
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, background: "#fef3c720", px: 1.5, py: 0.5, borderRadius: 2 }}>
              <StarIcon sx={{ fontSize: "1rem", color: "#fbbf24" }} />
              <Typography variant="caption" sx={{ fontWeight: 800, color: "#1f2937" }}>
                {rating}
              </Typography>
            </Box>
          )}
        </Box>
      </CardContent>

      {/* Action Button */}
      <CardContent sx={{ pt: 0, p: 3, pt: 0 }}>
        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <Button
            fullWidth
            variant="contained"
            onClick={handleEnrollClick}
            disabled={enrolled}
            startIcon={enrolled ? <CheckCircleIcon /> : null}
            sx={{
              background: enrolled 
                ? "linear-gradient(135deg, #10b981 0%, #059669 100%)" 
                : "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              color: "white",
              fontWeight: 800,
              py: 1.3,
              fontSize: "0.95rem",
              borderRadius: 2,
              textTransform: "none",
              boxShadow: "0 4px 12px rgba(102, 126, 234, 0.3)",
              transition: "all 0.3s ease",
              "&:hover": {
                boxShadow: "0 8px 20px rgba(102, 126, 234, 0.4)",
                transform: "translateY(-2px)",
              },
              "&:disabled": {
                color: "white",
                opacity: 1,
                boxShadow: "0 2px 8px rgba(16, 185, 129, 0.2)",
              },
            }}
          >
            {enrolled ? "Enrolled" : actionText}
          </Button>
        </motion.div>
      </CardContent>

      {/* Enrollment Confirmation Dialog */}
      <Dialog open={confirmDialog.open} onClose={() => setConfirmDialog({ open: false })}>
        <DialogTitle>Confirm Enrollment</DialogTitle>
        <DialogContent>
          <Typography sx={{ mt: 2 }}>
            Are you sure you want to enroll in <strong>{title}</strong>?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDialog({ open: false })}>Cancel</Button>
          <Button onClick={handleConfirmEnroll} variant="contained" color="primary">
            Confirm Enroll
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: "100%" }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </MotionCard>
  );
}
