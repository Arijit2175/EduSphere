import { Box, Container, Typography, TextField, Button, Grid, Card, CardContent } from "@mui/material";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
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

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Thank you for contacting us! We'll get back to you soon.");
    setFormData({ name: "", email: "", subject: "", message: "" });
  };

  return (
    <Box sx={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Navbar />
      
      {/* Hero Section */}
      <Box
        sx={{
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          color: "white",
          py: 8,
          mt: 8,
        }}
      >
        <Container maxWidth="lg">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Typography variant="h2" sx={{ fontWeight: 800, mb: 2, textAlign: "center" }}>
              Contact Us
            </Typography>
            <Typography variant="h6" sx={{ textAlign: "center", opacity: 0.9 }}>
              We're here to help! Get in touch with our team
            </Typography>
          </motion.div>
        </Container>
      </Box>

      {/* Content */}
      <Container maxWidth="lg" sx={{ py: 8, flex: 1 }}>
        <Grid container spacing={4}>
          {/* Contact Information */}
          <Grid item xs={12} md={4}>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card sx={{ mb: 3, boxShadow: 3 }}>
                <CardContent sx={{ textAlign: "center", py: 4 }}>
                  <EmailIcon sx={{ fontSize: 48, color: "#667eea", mb: 2 }} />
                  <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                    Email Us
                  </Typography>
                  <Typography variant="body2" sx={{ color: "#666" }}>
                    support@edusphere.com
                  </Typography>
                </CardContent>
              </Card>

              <Card sx={{ mb: 3, boxShadow: 3 }}>
                <CardContent sx={{ textAlign: "center", py: 4 }}>
                  <PhoneIcon sx={{ fontSize: 48, color: "#667eea", mb: 2 }} />
                  <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                    Call Us
                  </Typography>
                  <Typography variant="body2" sx={{ color: "#666" }}>
                    +1 (555) 123-4567
                  </Typography>
                </CardContent>
              </Card>

              <Card sx={{ boxShadow: 3 }}>
                <CardContent sx={{ textAlign: "center", py: 4 }}>
                  <LocationOnIcon sx={{ fontSize: 48, color: "#667eea", mb: 2 }} />
                  <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                    Visit Us
                  </Typography>
                  <Typography variant="body2" sx={{ color: "#666" }}>
                    123 Education Street<br />
                    Learning City, LC 12345<br />
                    United States
                  </Typography>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>

          {/* Contact Form */}
          <Grid item xs={12} md={8}>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card sx={{ boxShadow: 3 }}>
                <CardContent sx={{ p: 4 }}>
                  <Typography variant="h5" sx={{ fontWeight: 700, mb: 3 }}>
                    Send Us a Message
                  </Typography>
                  <form onSubmit={handleSubmit}>
                    <TextField
                      fullWidth
                      label="Your Name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                      sx={{ mb: 3 }}
                    />
                    <TextField
                      fullWidth
                      label="Your Email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                      sx={{ mb: 3 }}
                    />
                    <TextField
                      fullWidth
                      label="Subject"
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      required
                      sx={{ mb: 3 }}
                    />
                    <TextField
                      fullWidth
                      label="Message"
                      multiline
                      rows={6}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      required
                      sx={{ mb: 3 }}
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
            <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>
              Office Hours
            </Typography>
            <Typography variant="body1" sx={{ color: "#666", lineHeight: 1.8 }}>
              Monday - Friday: 9:00 AM - 6:00 PM (EST)<br />
              Saturday: 10:00 AM - 4:00 PM (EST)<br />
              Sunday: Closed
            </Typography>
          </Box>
        </motion.div>
      </Container>

      <Footer />
    </Box>
  );
}
