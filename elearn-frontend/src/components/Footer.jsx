import { Box, Container, Grid, Typography, Link, Button } from "@mui/material";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { Link as RouterLink } from "react-router-dom";
import FacebookIcon from "@mui/icons-material/Facebook";
import TwitterIcon from "@mui/icons-material/Twitter";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import InstagramIcon from "@mui/icons-material/Instagram";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";

const MotionBox = motion(Box);

export default function Footer({ compact = false, disableGutters = false, disableAnimations = false, sticky = false }) {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    if (disableAnimations) return;
    
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [disableAnimations]);

  // Calculate scroll-based transformations (same as PageHeader)
  const scrollProgress = Math.min(scrollY / 200, 1); // Normalize to 0-1 over 200px
  const footerHeight = disableAnimations ? 1 : 1 - (scrollProgress * 0.4); // Shrink slightly
  const footerOpacity = disableAnimations ? 1 : 1 - (scrollProgress * 0.2); // Slight opacity reduction
  const translateY = disableAnimations ? 0 : -(scrollProgress * 20); // Move up by 20px as user scrolls down

  const footerLinks = {
    Company: ["About Us", "Blog"],
    Legal: ["Privacy Policy", "Terms of Service", "Cookie Policy", "Contact Us"],
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <MotionBox
      animate={{ 
        opacity: footerOpacity,
        y: translateY,
        scaleY: footerHeight,
      }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      sx={{
        background: "rgba(44, 62, 80, 0.15)",
        color: "white",
        pt: compact ? 2 : 6,
        pb: compact ? 2 : 3,
        mt: 0,
        backdropFilter: "blur(20px)",
        borderRadius: "24px",
        width: sticky ? "100%" : "80%",
        maxWidth: sticky ? "100%" : "80%",
        ml: sticky ? 0 : "auto",
        mr: sticky ? 0 : "auto",
        transformOrigin: "bottom right",
        ...(sticky && {
          position: "sticky",
          bottom: 0,
          zIndex: 8,
        }),
      }}
    >
      <Container maxWidth="lg" disableGutters={disableGutters} sx={{ px: disableGutters ? 0 : 2 }}>
        {/* Footer Content */}
        <Box sx={{ mb: compact ? 1 : 4 }}>
          {/* About Section */}
          <MotionBox
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            sx={{ mb: 3 }}
          >
            <Typography variant="h6" sx={{ fontWeight: 700, mb: compact ? 1.5 : 2, fontSize: compact ? "1.1rem" : "1.3rem", color: "#ffffff" }}>
              EduSphere
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.8, mb: compact ? 2 : 3, lineHeight: 1.5, color: "#ffffff" }}>
              Empowering learners worldwide with accessible, affordable, and high-quality
              education through formal, non-formal, and informal learning pathways.
            </Typography>
            <Box sx={{ display: "flex", gap: compact ? 1.5 : 2, mb: 3 }}>
              {[FacebookIcon, TwitterIcon, LinkedInIcon, InstagramIcon].map((Icon, i) => (
                <motion.div
                  key={i}
                  whileHover={{ scale: 1.2, rotate: 10 }}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  <Link
                    href="#"
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      width: compact ? 34 : 40,
                      height: compact ? 34 : 40,
                      background: "rgba(255,255,255,0.1)",
                      borderRadius: "50%",
                      color: "white",
                      transition: "all 0.3s ease",
                      "&:hover": {
                        background: "#667eea",
                      },
                    }}
                  >
                    <Icon />
                  </Link>
                </motion.div>
              ))}
            </Box>
          </MotionBox>

          {/* Links Row */}
          <Box sx={{ display: "flex", gap: 4 }}>
            {/* Company Section */}
            <MotionBox
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              sx={{ minWidth: 80, maxWidth: 100 }}
            >
              <Typography
                variant="subtitle1"
                sx={{ fontWeight: 700, mb: compact ? 1.5 : 2, fontSize: compact ? "0.95rem" : "1rem", color: "#ffffff" }}
              >
                Company
              </Typography>
              <Box sx={{ display: "flex", flexDirection: "column", gap: compact ? 1 : 1.5 }}>
                <Link
                  component={RouterLink}
                  to="/about"
                  sx={{
                    color: "#ffffff",
                    textDecoration: "none",
                    fontSize: compact ? "0.85rem" : "0.9rem",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      color: "#667eea",
                      ml: 1,
                    },
                  }}
                >
                  About Us
                </Link>
                <Link
                  component={RouterLink}
                  to="/blog"
                  sx={{
                    color: "#ffffff",
                    textDecoration: "none",
                    fontSize: compact ? "0.85rem" : "0.9rem",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      color: "#667eea",
                      ml: 1,
                    },
                  }}
                >
                  Blog
                </Link>
              </Box>
            </MotionBox>

            {/* Legal Section */}
            <MotionBox
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              sx={{ minWidth: 80, maxWidth: 100 }}
            >
              <Typography
                variant="subtitle1"
                sx={{ fontWeight: 700, mb: compact ? 1.5 : 2, fontSize: compact ? "0.95rem" : "1rem", color: "#ffffff" }}
              >
                Legal
              </Typography>
              <Box sx={{ display: "flex", flexDirection: "column", gap: compact ? 1 : 1.5 }}>
                <Link
                  component={RouterLink}
                  to="/data-protection"
                  sx={{
                    color: "#ffffff",
                    textDecoration: "none",
                    fontSize: compact ? "0.85rem" : "0.9rem",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      color: "#667eea",
                      ml: 1,
                    },
                  }}
                >
                  Privacy Policy
                </Link>
                <Link
                  component={RouterLink}
                  to="/terms"
                  sx={{
                    color: "#ffffff",
                    textDecoration: "none",
                    fontSize: compact ? "0.85rem" : "0.9rem",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      color: "#667eea",
                      ml: 1,
                    },
                  }}
                >
                  Terms of Service
                </Link>
                <Link
                  component={RouterLink}
                  to="/cookie-settings"
                  sx={{
                    color: "#ffffff",
                    textDecoration: "none",
                    fontSize: compact ? "0.85rem" : "0.9rem",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      color: "#667eea",
                      ml: 1,
                    },
                  }}
                >
                  Cookie Policy
                </Link>
                <Link
                  component={RouterLink}
                  to="/contact"
                  sx={{
                    color: "#ffffff",
                    textDecoration: "none",
                    fontSize: compact ? "0.85rem" : "0.9rem",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      color: "#667eea",
                      ml: 1,
                    },
                  }}
                >
                  Contact Us
                </Link>
              </Box>
            </MotionBox>
          </Box>
        </Box>

        {/* Divider */}
        <Box sx={{ my: compact ? 1 : 4, height: "1px", background: "rgba(255,255,255,0.1)" }} />

        {/* Bottom Section */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: compact ? 1 : 2,
          }}
        >
          <Typography variant="body2" sx={{ opacity: 0.7, color: "#ffffff", fontSize: compact ? "0.85rem" : "0.9rem" }}>
            © 2025 EduSphere. All rights reserved. Made with ❤️ by Arijit
          </Typography>

          <motion.div
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              onClick={scrollToTop}
              sx={{
                minWidth: compact ? 34 : 40,
                height: compact ? 34 : 40,
                borderRadius: "50%",
                background: "#667eea",
                color: "white",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "all 0.3s ease",
                "&:hover": {
                  background: "#764ba2",
                  transform: "translateY(-4px)",
                },
              }}
            >
              <ArrowUpwardIcon />
            </Button>
          </motion.div>
        </Box>
      </Container>
    </MotionBox>
  );
}
