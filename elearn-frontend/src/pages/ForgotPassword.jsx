import API_URL from "../config";

import { Box, Container, Button, Typography, Card, CardContent, Link, Alert } from "@mui/material";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import FormInput from "../components/FormInput";
import { useAuth } from "../contexts/AuthContext";
import { useState, useEffect } from "react";

const MotionCard = motion(Card);

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Redirect if already logged in
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, navigate]);

  // Redirect to login page after successful reset
  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        navigate("/login");
      }, 1200);
      return () => clearTimeout(timer);
    }
  }, [success, navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("handleSubmit called", { email, newPassword, confirmPassword });
    setError("");
    setSuccess(false);
    setLoading(true);

    // Basic validation
    if (!email || !email.includes("@")) {
      setError("Please enter a valid email address");
      setLoading(false);
      return;
    }

    if (!newPassword || newPassword.length < 8) {
      setError("Password must be at least 8 characters long");
      setLoading(false);
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    // Real API call for resetting password
    fetch(`${API_URL}/auth/forgot-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, new_password: newPassword }),
    })
      .then(async (res) => {
        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.detail || "Failed to reset password");
        }
        setSuccess(true);
        setEmail("");
        setNewPassword("");
        setConfirmPassword("");
      })
      .catch((err) => {
        setError(err.message);
      })
      .finally(() => setLoading(false));
  };

  return (
    <Box sx={{ position: "relative", minHeight: "100vh" }}>
      {/* Background Video */}
      <Box
        sx={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundColor: "#1a1a2e",
          zIndex: -10,
          pointerEvents: "none",
        }}
      >
        <video
          autoPlay
          loop
          muted
          playsInline
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            display: "block",
            filter: "blur(2px)",
          }}
        >
          <source src="/videos/bg-video.mp4" type="video/mp4" />
        </video>
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            background: "rgba(0, 0, 0, 0.5)",
            zIndex: 1,
          }}
        />
      </Box>

      {/* Content */}
      <Box sx={{ position: "relative", zIndex: 1, display: "flex", flexDirection: "column", minHeight: "100vh" }}>
        <Navbar />
        <Box sx={{ flex: 1, py: 4, pt: { xs: 10, md: 12 }, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Container maxWidth="sm">
          <MotionCard
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            sx={{
              borderRadius: 3,
              boxShadow: "0 8px 32px rgba(0,0,0,0.25)",
              background: "rgba(255,255,255,0.85)",
              backdropFilter: "blur(8px)",
            }}
          >
            <CardContent sx={{ p: 4 }}>
              {/* Header: Emoji + Title */}
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 1.5,
                  mb: 3,
                }}
              >
                <Box sx={{ fontSize: "2.25rem", lineHeight: 1 }}>🔑</Box>
                <Typography variant="h5" sx={{ fontWeight: 800, color: "#2c3e50" }}>
                  Reset your Password
                </Typography>
              </Box>

              {/* Success Message */}
              {success && (
                <Alert severity="success" sx={{ mb: 3 }}>
                  ✓ Your password has been reset successfully. You can now log in with your new password.
                </Alert>
              )}

              {/* Error Message */}
              {error && (
                <Alert severity="error" sx={{ mb: 3 }}>
                  {error}
                </Alert>
              )}

              {/* Form */}
              {!success ? (
                <form onSubmit={handleSubmit}>
                  <FormInput
                    label="Email Address"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your registered email"
                    fullWidth
                    sx={{ mb: 3 }}
                  />
                  <FormInput
                    label="New Password"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter a new password"
                    fullWidth
                    sx={{ mb: 3 }}
                  />
                  <FormInput
                    label="Confirm New Password"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Re-enter the new password"
                    fullWidth
                    sx={{ mb: 3 }}
                  />

                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    sx={{
                      background: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
                      color: "white",
                      py: 1.5,
                      fontWeight: 700,
                      fontSize: "1rem",
                      borderRadius: 2,
                      textTransform: "none",
                      mb: 2,
                      "&:hover": {
                        background: "linear-gradient(135deg, #2d8fd4 0%, #00c8d8 100%)",
                      },
                    }}
                    disabled={loading}
                  >
                    {loading ? "Updating..." : "Reset Password"}
                  </Button>

                  <Typography variant="body2" sx={{ textAlign: "center", color: "#666", mb: 2 }}>
                    Remember your password?{" "}
                    <Link
                      href="/login"
                      sx={{
                        color: "#4facfe",
                        fontWeight: 600,
                        textDecoration: "none",
                        cursor: "pointer",
                        "&:hover": { textDecoration: "underline" },
                      }}
                    >
                      Back to Login
                    </Link>
                  </Typography>

                  <Typography variant="body2" sx={{ textAlign: "center", color: "#666" }}>
                    Don't have an account?{" "}
                    <Link
                      href="/register"
                      sx={{
                        color: "#4facfe",
                        fontWeight: 600,
                        textDecoration: "none",
                        cursor: "pointer",
                        "&:hover": { textDecoration: "underline" },
                      }}
                    >
                      Sign up here
                    </Link>
                  </Typography>
                </form>
              ) : (
                <Box sx={{ textAlign: "center" }}>
                  <Box sx={{ fontSize: "3rem", mb: 2 }}>✅</Box>
                  <Typography variant="h6" sx={{ fontWeight: 700, mb: 1, color: "#2c3e50" }}>
                    Password Reset Successful
                  </Typography>
                  <Typography variant="body2" sx={{ color: "#666", mb: 3 }}>
                    Your password has been updated. You can now sign in with your new credentials.
                  </Typography>
                  <Typography variant="caption" sx={{ color: "#999", mb: 3 }}>
                    Tip: Keep your password unique and do not share it with anyone.
                  </Typography>

                  <Button
                    fullWidth
                    variant="outlined"
                    component={Link}
                    to="/login"
                    sx={{
                      color: "#4facfe",
                      borderColor: "#4facfe",
                      py: 1.5,
                      fontWeight: 700,
                      fontSize: "1rem",
                      borderRadius: 2,
                      textTransform: "none",
                      mt: 3,
                      "&:hover": {
                        background: "#4facfe20",
                        borderColor: "#4facfe",
                      },
                    }}
                  >
                    Back to Login
                  </Button>
                </Box>
              )}
            </CardContent>
          </MotionCard>
        </Container>
        </Box>

        {/* Center Footer - At bottom of page */}
        <Box sx={{ textAlign: "center", py: 2, px: 2 }}>
          <Typography variant="caption" sx={{ color: "#ffffff", opacity: 0.9 }}>
            © 2025 E-Learning Platform
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}
