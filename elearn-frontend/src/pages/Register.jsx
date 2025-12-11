import { Box, Container, Button, Typography, Card, CardContent, Link } from "@mui/material";
import { motion } from "framer-motion";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import FormInput from "../components/FormInput";
import PageHeader from "../components/PageHeader";
import { useState } from "react";

const MotionCard = motion(Card);

export default function Register() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => setLoading(false), 2000);
  };

  return (
    <Box sx={{ display: "flex" }}>
      <Sidebar />
      <Box
        sx={{
          flexGrow: 1,
          ml: { xs: 0, md: 25 },
          mt: { xs: 6, md: 8 },
          background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
          minHeight: "100vh",
          py: 4,
        }}
      >
        <Navbar />

        <Container maxWidth="sm" sx={{ mt: 4 }}>
          <PageHeader
            title="Join Us"
            subtitle="Create your account and start learning today"
            backgroundGradient="linear-gradient(135deg, #f093fb 0%, #f5576c 100%)"
          />

          <MotionCard
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            sx={{
              borderRadius: 3,
              boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
              background: "white",
            }}
          >
            <CardContent sx={{ p: 4 }}>
              {/* Logo */}
              <Box sx={{ textAlign: "center", mb: 3 }}>
                <Box sx={{ fontSize: "3rem", mb: 1 }}>🚀</Box>
                <Typography variant="h6" sx={{ color: "#2c3e50", fontWeight: 700 }}>
                  Create Your Account
                </Typography>
              </Box>

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

                {/* Terms */}
                <Typography variant="caption" sx={{ color: "#666", mb: 2, display: "block" }}>
                  <input type="checkbox" id="terms" required />
                  <label htmlFor="terms" style={{ marginLeft: 6 }}>
                    I agree to the{" "}
                    <Link href="#" sx={{ color: "#667eea" }}>
                      Terms of Service
                    </Link>{" "}
                    and{" "}
                    <Link href="#" sx={{ color: "#667eea" }}>
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
                      background: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
                      color: "white",
                      fontWeight: 700,
                      py: 1.5,
                      borderRadius: 2,
                      mb: 2,
                      transition: "all 0.3s ease",
                      "&:hover": {
                        boxShadow: "0 8px 24px rgba(245, 87, 108, 0.3)",
                        transform: "translateY(-2px)",
                      },
                    }}
                  >
                    {loading ? "Creating Account..." : "Create Account"}
                  </Button>
                </motion.div>

                {/* Login Link */}
                <Box sx={{ textAlign: "center" }}>
                  <Typography variant="body2" sx={{ color: "#666" }}>
                    Already have an account?{" "}
                    <Link href="/login" sx={{ color: "#667eea", fontWeight: 700 }}>
                      Sign in here
                    </Link>
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </MotionCard>
        </Container>
      </Box>
    </Box>
  );
}