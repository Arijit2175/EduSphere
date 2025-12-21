import { Box, Container, Typography, Divider } from "@mui/material";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { motion } from "framer-motion";

export default function PrivacyPolicy() {
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
              Privacy Policy
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
            At EduSphere, we take your privacy seriously. This Privacy Policy explains how we collect, use, 
            disclose, and safeguard your information when you use our platform.
          </Typography>

          <Typography variant="h5" sx={{ fontWeight: 700, mb: 2, mt: 4 }}>
            1. Information We Collect
          </Typography>
          <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.8, color: "#555" }}>
            We collect information that you provide directly to us, including:
          </Typography>
          <Typography variant="body1" component="ul" sx={{ mb: 3, lineHeight: 1.8, color: "#555", pl: 4 }}>
            <li>Account information (name, email address, password)</li>
            <li>Profile information (educational background, interests, goals)</li>
            <li>Course enrollment and progress data</li>
            <li>Payment information (processed securely through third-party providers)</li>
            <li>Communications with us (support requests, feedback)</li>
          </Typography>

          <Divider sx={{ my: 4 }} />

          <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>
            2. How We Use Your Information
          </Typography>
          <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.8, color: "#555" }}>
            We use the information we collect to:
          </Typography>
          <Typography variant="body1" component="ul" sx={{ mb: 3, lineHeight: 1.8, color: "#555", pl: 4 }}>
            <li>Provide, maintain, and improve our educational services</li>
            <li>Personalize your learning experience</li>
            <li>Process transactions and send related information</li>
            <li>Send administrative messages, updates, and security alerts</li>
            <li>Respond to your comments and questions</li>
            <li>Analyze usage patterns to enhance platform functionality</li>
          </Typography>

          <Divider sx={{ my: 4 }} />

          <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>
            3. Information Sharing and Disclosure
          </Typography>
          <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.8, color: "#555" }}>
            We do not sell your personal information. We may share your information only in the following circumstances:
          </Typography>
          <Typography variant="body1" component="ul" sx={{ mb: 3, lineHeight: 1.8, color: "#555", pl: 4 }}>
            <li>With your consent or at your direction</li>
            <li>With service providers who assist in our operations</li>
            <li>To comply with legal obligations</li>
            <li>To protect our rights, privacy, safety, or property</li>
          </Typography>

          <Divider sx={{ my: 4 }} />

          <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>
            4. Data Security
          </Typography>
          <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.8, color: "#555" }}>
            We implement appropriate technical and organizational measures to protect your personal information 
            against unauthorized access, alteration, disclosure, or destruction. However, no internet transmission 
            is completely secure, and we cannot guarantee absolute security.
          </Typography>

          <Divider sx={{ my: 4 }} />

          <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>
            5. Your Rights and Choices
          </Typography>
          <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.8, color: "#555" }}>
            You have the right to:
          </Typography>
          <Typography variant="body1" component="ul" sx={{ mb: 3, lineHeight: 1.8, color: "#555", pl: 4 }}>
            <li>Access and update your personal information</li>
            <li>Request deletion of your account and data</li>
            <li>Opt-out of marketing communications</li>
            <li>Export your data in a portable format</li>
          </Typography>

          <Divider sx={{ my: 4 }} />

          <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>
            6. Contact Us
          </Typography>
          <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.8, color: "#555" }}>
            If you have questions about this Privacy Policy, please contact us at privacy@edusphere.com
          </Typography>
        </motion.div>
      </Container>

      <Footer />
    </Box>
  );
}
