import { Box, Container, Grid, Typography, Link, Button } from "@mui/material";
import { motion } from "framer-motion";
import FacebookIcon from "@mui/icons-material/Facebook";
import TwitterIcon from "@mui/icons-material/Twitter";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import InstagramIcon from "@mui/icons-material/Instagram";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";

const MotionBox = motion(Box);

export default function Footer() {
  const footerLinks = {
    Company: ["About Us", "Careers", "Blog", "Press"],
    Learning: ["Browse Courses", "Scholarships", "Help Center", "Accessibility"],
    Legal: ["Privacy Policy", "Terms of Service", "Cookie Policy", "Contact Us"],
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <Box
      sx={{
        background: "linear-gradient(135deg, #2c3e50 0%, #34495e 100%)",
        color: "white",
        pt: 6,
        pb: 3,
        mt: 8,
      }}
    >
      <Container maxWidth="lg">
        {/* Footer Content */}
        <Grid container spacing={4} sx={{ mb: 4 }}>
          {/* About Section */}
          <Grid item xs={12} md={4}>
            <MotionBox
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, fontSize: "1.3rem" }}>
                E-Learning Platform
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.8, mb: 3, lineHeight: 1.6 }}>
                Empowering learners worldwide with accessible, affordable, and high-quality
                education through formal, non-formal, and informal learning pathways.
              </Typography>
              <Box sx={{ display: "flex", gap: 2 }}>
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
                        width: 40,
                        height: 40,
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
          </Grid>

          {/* Links Sections */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <Grid item xs={12} sm={6} md={2.67} key={category}>
              <MotionBox
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
              >
                <Typography
                  variant="subtitle1"
                  sx={{ fontWeight: 700, mb: 2, fontSize: "1rem" }}
                >
                  {category}
                </Typography>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
                  {links.map((link) => (
                    <Link
                      key={link}
                      href="#"
                      sx={{
                        color: "rgba(255,255,255,0.7)",
                        textDecoration: "none",
                        fontSize: "0.9rem",
                        transition: "all 0.3s ease",
                        "&:hover": {
                          color: "#667eea",
                          ml: 1,
                        },
                      }}
                    >
                      {link}
                    </Link>
                  ))}
                </Box>
              </MotionBox>
            </Grid>
          ))}
        </Grid>

        {/* Divider */}
        <Box sx={{ my: 4, height: "1px", background: "rgba(255,255,255,0.1)" }} />

        {/* Bottom Section */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 2,
          }}
        >
          <Typography variant="body2" sx={{ opacity: 0.7 }}>
            © 2025 E-Learning Platform. All rights reserved. Made with ❤️ by Arijit
          </Typography>

          <motion.div
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              onClick={scrollToTop}
              sx={{
                minWidth: 40,
                height: 40,
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
    </Box>
  );
}
