import API_URL from "../config";
import { Box, Container, Typography, TextField, Button, Grid, Card, CardContent } from "@mui/material";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import HeroSection from "../components/HeroSection";
import BackgroundVideo from "../components/BackgroundVideo";
import { motion } from "framer-motion";
import { useState } from "react";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import LocationOnIcon from "@mui/icons-material/LocationOn";

export default function ContactUs() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_URL}/contact-messages/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        alert("Thank you for contacting us! We'll get back to you soon.");
        setFormData({ name: "", email: "", subject: "", message: "" });
      } else {
        alert("Failed to send message. Please try again.");
      }
    } catch (err) {
      alert("Error sending message. Please try again.");
    }
  };

  return (
    <Box sx={{ position: "relative", width: "100%", minHeight: "100vh" }}>
      {/* Background Video - Optimized for fast loading */}
      <BackgroundVideo src="/videos/bg-video.mp4" blur="2px" overlay={0.08} />

      {/* All Content - On Top */}
      <Box sx={{ position: "relative", zIndex: 1 }}>
      <Navbar />
      
      {/* Hero Section */}
      <HeroSection
        title="Contact Us"
        subtitle="We're here to help! Get in touch with our team"
      />

      {/* Content */}
      <Container maxWidth="lg" sx={{ py: 8, flex: 1 }}>
        {/* Contact Information Cards in a Row */}
        <Grid container spacing={3} sx={{ mb: 6, justifyContent: "center" }}>
          <Grid item xs={12} md={4}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card sx={{ boxShadow: 3, background: "rgba(255, 255, 255, 0.1)", backdropFilter: "blur(10px)", height: "100%" }}>
                <CardContent sx={{ textAlign: "center", py: 4 }}>
                  <EmailIcon sx={{ fontSize: 48, color: "#667eea", mb: 2 }} />
                  <Typography variant="h6" sx={{ fontWeight: 700, mb: 1, color: "#ffffff" }}>
                    Email Us
                  </Typography>
                  <Typography variant="body2" sx={{ color: "#ffffff" }}>
                    support@edusphere.com
                  </Typography>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>

          <Grid item xs={12} md={4}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card sx={{ boxShadow: 3, background: "rgba(255, 255, 255, 0.1)", backdropFilter: "blur(10px)", height: "100%" }}>
                <CardContent sx={{ textAlign: "center", py: 4 }}>
                  <PhoneIcon sx={{ fontSize: 48, color: "#667eea", mb: 2 }} />
                  <Typography variant="h6" sx={{ fontWeight: 700, mb: 1, color: "#ffffff" }}>
                    Call Us
                  </Typography>
                  <Typography variant="body2" sx={{ color: "#ffffff" }}>
                    +91 1234567890
                  </Typography>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>

          <Grid item xs={12} md={4}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card sx={{ boxShadow: 3, background: "rgba(255, 255, 255, 0.1)", backdropFilter: "blur(10px)", height: "100%" }}>
                <CardContent sx={{ textAlign: "center", py: 4 }}>
                  <LocationOnIcon sx={{ fontSize: 48, color: "#667eea", mb: 2 }} />
                  <Typography variant="h6" sx={{ fontWeight: 700, mb: 1, color: "#ffffff" }}>
                    Visit Us
                  </Typography>
                  <Typography variant="body2" sx={{ color: "#ffffff" }}>
                    123 Education Colony<br />
                    Hyderabad, HY 502032<br />
                    India
                  </Typography>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>
        </Grid>

        {/* Contact Form */}
        <Grid container spacing={4}>
          <Grid item xs={12}>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card sx={{ boxShadow: 3, background: "rgba(255, 255, 255, 0.1)", backdropFilter: "blur(10px)" }}>
                <CardContent sx={{ p: 4 }}>
                  <Typography variant="h5" sx={{ fontWeight: 700, mb: 3, color: "#ffffff" }}>
                    Send Us a Message
                  </Typography>
                  <form onSubmit={handleSubmit}>
                    <TextField
                      fullWidth
                      label="Your Name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                      sx={{ 
                        mb: 3,
                        '& .MuiInputBase-input': { color: '#ffffff' },
                        '& .MuiInputLabel-root': { color: '#ffffff' },
                        '& .MuiOutlinedInput-root': {
                          '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.3)' },
                          '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.5)' },
                          '&.Mui-focused fieldset': { borderColor: '#667eea' }
                        }
                      }}
                    />
                    <TextField
                      fullWidth
                      label="Your Email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                      sx={{ 
                        mb: 3,
                        '& .MuiInputBase-input': { color: '#ffffff' },
                        '& .MuiInputLabel-root': { color: '#ffffff' },
                        '& .MuiOutlinedInput-root': {
                          '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.3)' },
                          '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.5)' },
                          '&.Mui-focused fieldset': { borderColor: '#667eea' }
                        }
                      }}
                    />
                    <TextField
                      fullWidth
                      label="Subject"
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      required
                      sx={{ 
                        mb: 3,
                        '& .MuiInputBase-input': { color: '#ffffff' },
                        '& .MuiInputLabel-root': { color: '#ffffff' },
                        '& .MuiOutlinedInput-root': {
                          '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.3)' },
                          '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.5)' },
                          '&.Mui-focused fieldset': { borderColor: '#667eea' }
                        }
                      }}
                    />
                    <TextField
                      fullWidth
                      label="Message"
                      multiline
                      rows={6}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      required
                      sx={{ 
                        mb: 3,
                        '& .MuiInputBase-input': { color: '#ffffff' },
                        '& .MuiInputLabel-root': { color: '#ffffff' },
                        '& .MuiOutlinedInput-root': {
                          '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.3)' },
                          '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.5)' },
                          '&.Mui-focused fieldset': { borderColor: '#667eea' }
                        }
                      }}
                    />
                    <Button
                      type="submit"
                      variant="contained"
                      size="large"
                      fullWidth
                      sx={{
                        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                        py: 1.5,
                        fontSize: "1.1rem",
                        fontWeight: 700,
                        "&:hover": {
                          background: "linear-gradient(135deg, #5568d3 0%, #653a8a 100%)",
                        },
                      }}
                    >
                      Send Message
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>
        </Grid>

        {/* Office Hours */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Box sx={{ mt: 6, textAlign: "center" }}>
            <Typography variant="h5" sx={{ fontWeight: 700, mb: 2, color: "#ffffff" }}>
              Office Hours
            </Typography>
            <Typography variant="body1" sx={{ color: "#ffffff", lineHeight: 1.8 }}>
              Monday - Friday: 9:00 AM - 6:00 PM (EST)<br />
              Saturday: 10:00 AM - 4:00 PM (EST)<br />
              Sunday: Closed
            </Typography>
          </Box>
        </motion.div>
      </Container>

      <Footer sticky={false} />
      </Box>
    </Box>
  );
}
