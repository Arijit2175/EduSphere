import { Box, Container, Typography, Divider } from "@mui/material";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { motion } from "framer-motion";

export default function TermsOfService() {
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
              Terms of Service
            </Typography>
            <Typography variant="body1" sx={{ textAlign: "center", opacity: 0.9 }}>
              Last updated: December 20, 2025
            </Typography>
          </motion.div>
        </Container>
      </Box>

      {/* Content */}
      <Container maxWidth="md" sx={{ py: 8, flex: 1 }}>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <Typography variant="body1" sx={{ mb: 4, lineHeight: 1.8, color: "#555" }}>
            Welcome to EduSphere. By accessing or using our platform, you agree to be bound by these Terms of Service. 
            Please read them carefully.
          </Typography>

          <Typography variant="h5" sx={{ fontWeight: 700, mb: 2, mt: 4 }}>
            1. Acceptance of Terms
          </Typography>
          <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.8, color: "#555" }}>
            By creating an account or using EduSphere's services, you acknowledge that you have read, understood, 
            and agree to these Terms of Service and our Privacy Policy. If you do not agree, you may not use our services.
          </Typography>

          <Divider sx={{ my: 4 }} />

          <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>
            2. User Accounts
          </Typography>
          <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.8, color: "#555" }}>
            To access certain features, you must create an account. You agree to:
          </Typography>
          <Typography variant="body1" component="ul" sx={{ mb: 3, lineHeight: 1.8, color: "#555", pl: 4 }}>
            <li>Provide accurate and complete information</li>
            <li>Maintain the security of your password</li>
            <li>Notify us immediately of any unauthorized access</li>
            <li>Be responsible for all activities under your account</li>
            <li>Not share your account credentials with others</li>
          </Typography>

          <Divider sx={{ my: 4 }} />

          <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>
            3. Use of Services
          </Typography>
          <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.8, color: "#555" }}>
            You agree to use EduSphere's services only for lawful purposes. You may not:
          </Typography>
          <Typography variant="body1" component="ul" sx={{ mb: 3, lineHeight: 1.8, color: "#555", pl: 4 }}>
            <li>Violate any applicable laws or regulations</li>
            <li>Infringe on intellectual property rights</li>
            <li>Transmit harmful or malicious code</li>
            <li>Harass, abuse, or harm other users</li>
            <li>Attempt to gain unauthorized access to our systems</li>
            <li>Share or redistribute course materials without permission</li>
          </Typography>

          <Divider sx={{ my: 4 }} />

          <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>
            4. Course Enrollment and Access
          </Typography>
          <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.8, color: "#555" }}>
            When you enroll in a course:
          </Typography>
          <Typography variant="body1" component="ul" sx={{ mb: 3, lineHeight: 1.8, color: "#555", pl: 4 }}>
            <li>You receive a limited, non-exclusive license to access course materials</li>
            <li>Course availability and content may change without notice</li>
            <li>Completion certificates are awarded based on course requirements</li>
            <li>Refund policies vary by course and are specified at enrollment</li>
          </Typography>

          <Divider sx={{ my: 4 }} />

          <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>
            5. Intellectual Property
          </Typography>
          <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.8, color: "#555" }}>
            All content on EduSphere, including text, graphics, logos, and course materials, is owned by EduSphere 
            or our content providers and is protected by copyright and intellectual property laws. You may not 
            reproduce, distribute, or create derivative works without explicit permission.
          </Typography>

          <Divider sx={{ my: 4 }} />

          <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>
            6. User-Generated Content
          </Typography>
          <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.8, color: "#555" }}>
            By posting content on EduSphere (comments, forum posts, etc.), you grant us a non-exclusive, 
            royalty-free license to use, modify, and display that content. You retain ownership of your content 
            but are responsible for ensuring it does not violate any laws or third-party rights.
          </Typography>

          <Divider sx={{ my: 4 }} />

          <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>
            7. Disclaimers and Limitations
          </Typography>
          <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.8, color: "#555" }}>
            EduSphere is provided "as is" without warranties of any kind. We do not guarantee:
          </Typography>
          <Typography variant="body1" component="ul" sx={{ mb: 3, lineHeight: 1.8, color: "#555", pl: 4 }}>
            <li>Uninterrupted or error-free service</li>
            <li>Specific learning outcomes or job placement</li>
            <li>Accuracy of all content or third-party materials</li>
          </Typography>

          <Divider sx={{ my: 4 }} />

          <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>
            8. Termination
          </Typography>
          <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.8, color: "#555" }}>
            We reserve the right to suspend or terminate your account if you violate these Terms of Service or 
            engage in conduct that we deem harmful to our platform or other users.
          </Typography>

          <Divider sx={{ my: 4 }} />

          <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>
            9. Changes to Terms
          </Typography>
          <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.8, color: "#555" }}>
            We may update these Terms of Service from time to time. Continued use of our services after changes 
            are posted constitutes acceptance of the updated terms.
          </Typography>

          <Divider sx={{ my: 4 }} />

          <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>
            10. Contact Information
          </Typography>
          <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.8, color: "#555" }}>
            For questions about these Terms of Service, please contact us at legal@edusphere.com
          </Typography>
        </motion.div>
      </Container>

      <Footer />
    </Box>
  );
}
