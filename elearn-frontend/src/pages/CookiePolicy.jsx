import { Box, Container, Typography, Divider } from "@mui/material";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { motion } from "framer-motion";

export default function CookiePolicy() {
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
              Cookie Policy
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
            This Cookie Policy explains how EduSphere uses cookies and similar technologies to recognize you when 
            you visit our platform. It explains what these technologies are and why we use them, as well as your 
            rights to control our use of them.
          </Typography>

          <Typography variant="h5" sx={{ fontWeight: 700, mb: 2, mt: 4 }}>
            1. What Are Cookies?
          </Typography>
          <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.8, color: "#555" }}>
            Cookies are small data files that are placed on your computer or mobile device when you visit a website. 
            Cookies are widely used by website owners to make their websites work, or to work more efficiently, 
            as well as to provide reporting information.
          </Typography>

          <Divider sx={{ my: 4 }} />

          <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>
            2. Why We Use Cookies
          </Typography>
          <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.8, color: "#555" }}>
            We use cookies for several reasons:
          </Typography>
          <Typography variant="body1" component="ul" sx={{ mb: 3, lineHeight: 1.8, color: "#555", pl: 4 }}>
            <li><strong>Essential cookies:</strong> Required for the platform to function properly (e.g., maintaining your login session)</li>
            <li><strong>Performance cookies:</strong> Help us understand how visitors interact with our platform</li>
            <li><strong>Functionality cookies:</strong> Remember your preferences and personalize your experience</li>
            <li><strong>Analytics cookies:</strong> Collect information about how you use our platform to help us improve</li>
          </Typography>

          <Divider sx={{ my: 4 }} />

          <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>
            3. Types of Cookies We Use
          </Typography>
          
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 1, mt: 3 }}>
            Session Cookies
          </Typography>
          <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.8, color: "#555" }}>
            These are temporary cookies that remain in your browser until you close it. They help us maintain 
            your session as you navigate through our platform.
          </Typography>

          <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
            Persistent Cookies
          </Typography>
          <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.8, color: "#555" }}>
            These remain on your device for a set period or until you manually delete them. They help us remember 
            your preferences and settings for future visits.
          </Typography>

          <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
            Third-Party Cookies
          </Typography>
          <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.8, color: "#555" }}>
            Some cookies are placed by third-party services that appear on our pages, such as:
          </Typography>
          <Typography variant="body1" component="ul" sx={{ mb: 3, lineHeight: 1.8, color: "#555", pl: 4 }}>
            <li>Google Analytics (for usage statistics)</li>
            <li>Video players (for embedded course content)</li>
            <li>Payment processors (for secure transactions)</li>
          </Typography>

          <Divider sx={{ my: 4 }} />

          <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>
            4. How to Control Cookies
          </Typography>
          <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.8, color: "#555" }}>
            You have the right to decide whether to accept or reject cookies. You can exercise your cookie rights 
            by setting your preferences in our cookie consent manager or through your browser settings.
          </Typography>
          <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.8, color: "#555" }}>
            Most web browsers allow you to control cookies through their settings. However, if you limit the ability 
            of websites to set cookies, you may worsen your overall user experience, as some features may not 
            function properly.
          </Typography>

          <Divider sx={{ my: 4 }} />

          <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>
            5. Browser Settings
          </Typography>
          <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.8, color: "#555" }}>
            You can manage or delete cookies through your browser settings:
          </Typography>
          <Typography variant="body1" component="ul" sx={{ mb: 3, lineHeight: 1.8, color: "#555", pl: 4 }}>
            <li><strong>Chrome:</strong> Settings → Privacy and security → Cookies and other site data</li>
            <li><strong>Firefox:</strong> Options → Privacy & Security → Cookies and Site Data</li>
            <li><strong>Safari:</strong> Preferences → Privacy → Manage Website Data</li>
            <li><strong>Edge:</strong> Settings → Cookies and site permissions</li>
          </Typography>

          <Divider sx={{ my: 4 }} />

          <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>
            6. Updates to This Policy
          </Typography>
          <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.8, color: "#555" }}>
            We may update this Cookie Policy from time to time to reflect changes in our practices or for other 
            operational, legal, or regulatory reasons. Please check this page periodically for updates.
          </Typography>

          <Divider sx={{ my: 4 }} />

          <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>
            7. Contact Us
          </Typography>
          <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.8, color: "#555" }}>
            If you have questions about our use of cookies, please contact us at cookies@edusphere.com
          </Typography>
        </motion.div>
      </Container>

      <Footer />
    </Box>
  );
}
