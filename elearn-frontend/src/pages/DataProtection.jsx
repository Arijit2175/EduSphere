import { Box, Container, Typography, Divider } from "@mui/material";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import HeroSection from "../components/HeroSection";
import BackgroundVideo from "../components/BackgroundVideo";
import { motion } from "framer-motion";

export default function DataProtection() {
  return (
    <Box sx={{ position: "relative", width: "100%", minHeight: "100vh" }}>
      {/* Background Video - Optimized for fast loading */}
      <BackgroundVideo src="/videos/bg-video.mp4" blur="2px" overlay={0.08} />

      {/* All Content - On Top */}
      <Box sx={{ position: "relative", zIndex: 1 }}>
      <Navbar />
      
      {/* Hero Section */}
      <HeroSection
        title="Privacy Policy"
        subtitle="Last updated: December 20, 2025"
      />

      {/* Content */}
      <Container maxWidth="md" sx={{ py: 8, flex: 1 }}>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <Typography variant="body1" sx={{ mb: 4, lineHeight: 1.8, color: "#ffffff" }}>
            At EduSphere, we take your privacy seriously. This Privacy Policy explains how we collect, use, 
            disclose, and safeguard your information when you use our platform.
          </Typography>

          <Typography variant="h5" sx={{ fontWeight: 700, mb: 2, mt: 4, color: "#ffffff" }}>
            1. Information We Collect
          </Typography>
          <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.8, color: "#ffffff" }}>
            We collect information that you provide directly to us, including:
          </Typography>
          <Typography variant="body1" component="ul" sx={{ mb: 3, lineHeight: 1.8, color: "#ffffff", pl: 4 }}>
            <li>Account information (name, email address, password)</li>
            <li>Profile information (educational background, interests, goals)</li>
            <li>Course enrollment and progress data</li>
            <li>Payment information (processed securely through third-party providers)</li>
            <li>Communications with us (support requests, feedback)</li>
          </Typography>

          <Divider sx={{ my: 4 }} />

          <Typography variant="h5" sx={{ fontWeight: 700, mb: 2, color: "#ffffff" }}>
            2. How We Use Your Information
          </Typography>
          <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.8, color: "#ffffff" }}>
            We use the information we collect to:
          </Typography>
          <Typography variant="body1" component="ul" sx={{ mb: 3, lineHeight: 1.8, color: "#ffffff", pl: 4 }}>
            <li>Provide, maintain, and improve our educational services</li>
            <li>Personalize your learning experience</li>
            <li>Process transactions and send related information</li>
            <li>Send administrative messages, updates, and security alerts</li>
            <li>Respond to your comments and questions</li>
            <li>Analyze usage patterns to enhance platform functionality</li>
          </Typography>

          <Divider sx={{ my: 4 }} />

          <Typography variant="h5" sx={{ fontWeight: 700, mb: 2, color: "#ffffff" }}>
            3. Information Sharing and Disclosure
          </Typography>
          <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.8, color: "#ffffff" }}>
            We do not sell your personal information. We may share your information only in the following circumstances:
          </Typography>
          <Typography variant="body1" component="ul" sx={{ mb: 3, lineHeight: 1.8, color: "#ffffff", pl: 4 }}>
            <li>With your consent or at your direction</li>
            <li>With service providers who assist in our operations</li>
            <li>To comply with legal obligations</li>
            <li>To protect our rights, privacy, safety, or property</li>
          </Typography>

          <Divider sx={{ my: 4 }} />

          <Typography variant="h5" sx={{ fontWeight: 700, mb: 2, color: "#ffffff" }}>
            4. Data Security
          </Typography>
          <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.8, color: "#ffffff" }}>
            We implement appropriate technical and organizational measures to protect your personal information 
            against unauthorized access, alteration, disclosure, or destruction. However, no internet transmission 
            is completely secure, and we cannot guarantee absolute security.
          </Typography>

          <Divider sx={{ my: 4 }} />

          <Typography variant="h5" sx={{ fontWeight: 700, mb: 2, color: "#ffffff" }}>
            5. Your Rights and Choices
          </Typography>
          <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.8, color: "#ffffff" }}>
            You have the right to:
          </Typography>
          <Typography variant="body1" component="ul" sx={{ mb: 3, lineHeight: 1.8, color: "#ffffff", pl: 4 }}>
            <li>Access and update your personal information</li>
            <li>Request deletion of your account and data</li>
            <li>Opt-out of marketing communications</li>
            <li>Export your data in a portable format</li>
          </Typography>

          <Divider sx={{ my: 4 }} />

          <Typography variant="h5" sx={{ fontWeight: 700, mb: 2, color: "#ffffff" }}>
            6. Contact Us
          </Typography>
          <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.8, color: "#ffffff" }}>
            If you have questions about this Privacy Policy, please contact us at privacy@edusphere.com
          </Typography>
        </motion.div>
      </Container>

      <Footer sticky={false} />
      </Box>
    </Box>
  );
}
