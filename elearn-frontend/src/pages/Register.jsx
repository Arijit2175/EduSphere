import { Box, Container, Button, Typography, Card, CardContent, Link, Alert } from "@mui/material";
import { motion } from "framer-motion";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import Navbar from "../components/Navbar";
import FormInput from "../components/FormInput";
import PageHeader from "../components/PageHeader";
import BackgroundVideo from "../components/BackgroundVideo";
import { useAuth } from "../contexts/AuthContext";
import { useState, useEffect } from "react";

const MotionCard = motion(Card);

export default function Register() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "student",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { register, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Redirect if already logged in
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const validateEmail = (email) => {
    // Simple email regex for validation
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!validateEmail(formData.email)) {
      setError("Please enter a valid email address");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }
    if (formData.password.length > 72) {
      setError("Password must be 72 characters or fewer");
      return;
    }

    setLoading(true);
    try {
      // Map frontend fields to backend expected fields
      const payload = {
        ...formData,
        first_name: formData.firstName,
        last_name: formData.lastName,
      };
      delete payload.firstName;
      delete payload.lastName;
      await register(payload);
      navigate("/dashboard");
    } catch (err) {
      setError(err.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ position: "relative", minHeight: "100vh" }}>
      {/* Background Video - Optimized for fast loading */}
      <BackgroundVideo src="/videos/bg-video.mp4" blur="2px" overlay={0.5} />

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
              {/* Left Side - Registration Form */}
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
                      Join Us
                    </Typography>
                    <Typography
                      variant="body1"
                      sx={{
                        color: "#ffffff",
                        opacity: 0.95,
                        fontWeight: 500,
                      }}
                    >
                      Create your account and start learning today
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
                          Create Your Account
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
                        <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 1.5, mb: 2 }}>
                          <FormInput
                            label="First Name"
                            placeholder="John"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleChange}
                            required
                          />
                          <FormInput
                            label="Last Name"
                            placeholder="Doe"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleChange}
                            required
                          />
                        </Box>

                        <FormInput
                          label="Email Address"
                          type="email"
                          placeholder="you@example.com"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                        />

                        <FormInput
                          label="Password"
                          type="password"
                          placeholder="••••••••"
                          name="password"
                          value={formData.password}
                          onChange={handleChange}
                          required
                        />

                        <FormInput
                          label="Confirm Password"
                          type="password"
                          placeholder="••••••••"
                          name="confirmPassword"
                          value={formData.confirmPassword}
                          onChange={handleChange}
                          required
                        />

                        <Box sx={{ display: "flex", gap: 1.5, mb: 2 }}>
                          <Button
                            variant={formData.role === "student" ? "contained" : "outlined"}
                            onClick={() => setFormData({ ...formData, role: "student" })}
                            sx={{
                              flex: 1,
                              background: formData.role === "student" ? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" : "transparent",
                              color: formData.role === "student" ? "#ffffff" : "#667eea",
                              borderColor: "#667eea",
                              fontWeight: 600,
                              "&:hover": {
                                background: formData.role === "student" ? "linear-gradient(135deg, #5a6dd8 0%, #6a4190 100%)" : "rgba(102, 126, 234, 0.1)",
                              },
                            }}
                          >
                            Student
                          </Button>
                          <Button
                            variant={formData.role === "teacher" ? "contained" : "outlined"}
                            onClick={() => setFormData({ ...formData, role: "teacher" })}
                            sx={{
                              flex: 1,
                              background: formData.role === "teacher" ? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" : "transparent",
                              color: formData.role === "teacher" ? "#ffffff" : "#667eea",
                              borderColor: "#667eea",
                              fontWeight: 600,
                              "&:hover": {
                                background: formData.role === "teacher" ? "linear-gradient(135deg, #5a6dd8 0%, #6a4190 100%)" : "rgba(102, 126, 234, 0.1)",
                              },
                            }}
                          >
                            Teacher
                          </Button>
                        </Box>

                        {/* Terms */}
                        <Typography variant="caption" sx={{ color: "#555", mb: 2, display: "block" }}>
                          <input type="checkbox" id="terms" required />
                          <label htmlFor="terms" style={{ marginLeft: 6 }}>
                            I agree to the{" "}
                            <Link component={RouterLink} to="/terms" sx={{ color: "#667eea", fontWeight: 600, "&:hover": { color: "#764ba2" } }}>
                              Terms of Service
                            </Link>{" "}
                            and{" "}
                            <Link component={RouterLink} to="/data-protection" sx={{ color: "#667eea", fontWeight: 600, "&:hover": { color: "#764ba2" } }}>
                              Privacy Policy
                            </Link>
                          </label>
                        </Typography>

                        {/* Register Button */}
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
                            {loading ? "Creating Account..." : "Create Account"}
                          </Button>
                        </motion.div>

                        {/* Login Link */}
                        <Box sx={{ textAlign: "center" }}>
                          <Typography variant="body2" sx={{ color: "#555" }}>
                            Already have an account?{" "}
                            <Link href="/login" sx={{ color: "#667eea", fontWeight: 700, textDecoration: "none", "&:hover": { color: "#764ba2", textDecoration: "underline" } }}>
                              Sign in here
                            </Link>
                          </Typography>
                        </Box>
                      </Box>
                    </CardContent>
                  </MotionCard>
                </Box>
              </Box>

              {/* Right Side - Image and Text */}
              <Box sx={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                {/* Image */}
                <Box
                  component="img"
                  src="/images/register-image.png"
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
                    Start Your Learning Journey
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
                    Join thousands of learners on EduSphere and unlock your potential. Access world-class courses, connect with expert instructors, and achieve your goals!
                  </Typography>
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