import { Box, Container, Button, Typography, Card, CardContent, Link, Alert } from "@mui/material";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import FormInput from "../components/FormInput";
import PageHeader from "../components/PageHeader";
import { useAuth } from "../contexts/AuthContext";
import { useSidebar } from "../contexts/SidebarContext";
import { useState, useEffect } from "react";

const MotionCard = motion(Card);

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [role, setRole] = useState("student");
  const { login, isAuthenticated } = useAuth();
  const { setIsOpen } = useSidebar();
  const navigate = useNavigate();

  // Redirect if already logged in
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, navigate]);

  const validateEmail = (email) => {
    // Simple email regex for validation
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (!validateEmail(email)) {
      setError("Please enter a valid email address");
      return;
    }

    setLoading(true);

    // Simulate API call
    setTimeout(() => {
      if (email && password) {
        login(email, password, role);
        setIsOpen(false); // Close sidebar after login
        setLoading(false);
        navigate("/dashboard");
      } else {
        setError("Please enter valid credentials");
        setLoading(false);
      }
    }, 1000);
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
        <Box
          sx={{
            flex: 1,
            py: 4,
            pt: { xs: 10, md: 12 },
            display: "flex",
            alignItems: "center",
          }}
        >
          <Container maxWidth="xl">
            <Box sx={{ display: "flex", gap: 8, alignItems: "center", flexDirection: { xs: "column", md: "row" } }}>
              {/* Left Side - Image and Text */}
              <Box sx={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                {/* Image */}
                <Box
                  component="img"
                  src="/images/login-image.png"
                  alt="EduSphere Learning"
                  sx={{
                    width: "100%",
                    maxWidth: 500,
                    height: "auto",
                    borderRadius: 4,
                    mb: 4,
                    boxShadow: "0 10px 30px rgba(0,0,0,0.3)",
                  }}
                />

                {/* Text Section */}
                <Box sx={{ maxWidth: 500, textAlign: "center" }}>
                  <Typography
                    variant="h4"
                    sx={{
                      fontWeight: 800,
                      color: "#ffffff",
                      mb: 2,
                      textShadow: "0 2px 10px rgba(0,0,0,0.3)",
                    }}
                  >
                    Did you know?
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{
                      color: "#ffffff",
                      fontSize: "1.1rem",
                      lineHeight: 1.8,
                      fontWeight: 500,
                      textShadow: "0 2px 10px rgba(0,0,0,0.3)",
                    }}
                  >
                    Regardless of who you are, mastering even just one more skill on EduSphere results in learning gains. Start your journey today and unlock your potential!
                  </Typography>
                </Box>
              </Box>

              {/* Right Side - Login Form */}
              <Box sx={{ flex: 1, display: "flex", justifyContent: "center", width: "100%" }}>
                <Box sx={{ width: "100%", maxWidth: 500 }}>
                  <Box sx={{ textAlign: "center", mb: 4 }}>
                    <Typography
                      variant="h3"
                      sx={{
                        fontWeight: 800,
                        color: "#ffffff",
                        mb: 1,
                        textShadow: "0 2px 10px rgba(0,0,0,0.3)",
                      }}
                    >
                      Welcome Back
                    </Typography>
                    <Typography
                      variant="body1"
                      sx={{
                        color: "#ffffff",
                        opacity: 0.95,
                        fontWeight: 500,
                      }}
                    >
                      Sign in to your account to continue learning
                    </Typography>
                  </Box>

          <MotionCard
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            sx={{
              borderRadius: 'var(--radius-lg)',
              boxShadow: "0 20px 60px rgba(0,0,0,0.4)",
              background: "rgba(255, 255, 255, 0.95)",
              backdropFilter: "blur(10px)",
              border: "1px solid rgba(255, 255, 255, 0.3)",
            }}
          >
            <CardContent sx={{ p: 4 }}>
              {/* Logo */}
              <Box sx={{ textAlign: "center", mb: 4 }}>
                <Box sx={{ fontSize: "3rem", mb: 1 }}>🎓</Box>
                <Typography variant="h5" sx={{ color: "#2c3e50", fontWeight: 800 }}>
                  Login to EduSphere
                </Typography>
              </Box>

              {/* Error Alert */}
              {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {error}
                </Alert>
              )}

              {/* Form */}
              <Box component="form" onSubmit={handleSubmit}>
                <FormInput
                  label="Email Address"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />

                <FormInput
                  label="Password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />

                <Box sx={{ display: "flex", gap: 1, mb: 3 }}>
                  <Button
                    variant={role === "student" ? "contained" : "outlined"}
                    onClick={() => setRole("student")}
                    sx={{
                      flex: 1,
                      background: role === "student" ? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" : "transparent",
                      color: role === "student" ? "#ffffff" : "#667eea",
                      borderColor: "#667eea",
                      fontWeight: 600,
                      "&:hover": {
                        background: role === "student" ? "linear-gradient(135deg, #5a6dd8 0%, #6a4190 100%)" : "rgba(102, 126, 234, 0.1)",
                      },
                    }}
                  >
                    Student
                  </Button>
                  <Button
                    variant={role === "teacher" ? "contained" : "outlined"}
                    onClick={() => setRole("teacher")}
                    sx={{
                      flex: 1,
                      background: role === "teacher" ? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" : "transparent",
                      color: role === "teacher" ? "#ffffff" : "#667eea",
                      borderColor: "#667eea",
                      fontWeight: 600,
                      "&:hover": {
                        background: role === "teacher" ? "linear-gradient(135deg, #5a6dd8 0%, #6a4190 100%)" : "rgba(102, 126, 234, 0.1)",
                      },
                    }}
                  >
                    Teacher
                  </Button>
                </Box>

                {/* Remember & Forgot */}
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: 3,
                    fontSize: "0.9rem",
                  }}
                >
                  <Typography variant="caption">
                    <input type="checkbox" id="remember" />
                    <label htmlFor="remember" style={{ marginLeft: 6 }}>
                      Remember me
                    </label>
                  </Typography>
                  <Link 
                    href="/forgot-password" 
                    sx={{ 
                      color: "#667eea", 
                      textDecoration: "none",
                      cursor: "pointer",
                      fontWeight: 600,
                      "&:hover": { textDecoration: "underline", color: "#764ba2" }
                    }}
                  >
                    Forgot Password?
                  </Link>
                </Box>

                {/* Login Button */}
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button
                    fullWidth
                    variant="contained"
                    size="large"
                    type="submit"
                    disabled={loading}
                    sx={{
                      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                      color: "white",
                      fontWeight: 700,
                      py: 1.5,
                      borderRadius: 2,
                      mb: 2,
                      transition: "all 0.3s ease",
                      "&:hover": {
                        boxShadow: "0 8px 24px rgba(102, 126, 234, 0.3)",
                        transform: "translateY(-2px)",
                      },
                    }}
                  >
                    {loading ? "Signing in..." : "Sign In"}
                  </Button>
                </motion.div>

                {/* Signup Link */}
                <Box sx={{ textAlign: "center" }}>
                  <Typography variant="body2" sx={{ color: "#555" }}>
                    Don't have an account?{" "}
                    <Link href="/register" sx={{ color: "#667eea", fontWeight: 700, textDecoration: "none", "&:hover": { color: "#764ba2", textDecoration: "underline" } }}>
                      Sign up here
                    </Link>
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </MotionCard>

          {/* Features */}
          <Box sx={{ mt: 4, textAlign: "center" }}>
            <Typography variant="body2" sx={{ color: "#ffffff", mb: 2, fontWeight: 600, textShadow: "0 2px 10px rgba(0,0,0,0.3)" }}>
              Need help?
            </Typography>
            <Link href="/contact" sx={{ color: "#ffffff", mr: 3, textDecoration: "none", fontWeight: 600, textShadow: "0 2px 10px rgba(0,0,0,0.3)", "&:hover": { color: "#667eea" } }}>
              Contact Support
            </Link>
            <Link href="/" sx={{ color: "#ffffff", textDecoration: "none", fontWeight: 600, textShadow: "0 2px 10px rgba(0,0,0,0.3)", "&:hover": { color: "#667eea" } }}>
              Back to Home
            </Link>
          </Box>
                </Box>
              </Box>
            </Box>
          </Container>
        </Box>

        {/* Center Footer - At bottom of page */}
        <Box sx={{ textAlign: "center", py: 2, px: 2 }}>
          <Typography variant="caption" sx={{ color: "#ffffff", opacity: 0.9 }}>
            © 2025 EduSphere
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}

export default Login;