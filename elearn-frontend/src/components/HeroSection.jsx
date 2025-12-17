import { Box, Button, Container, Typography } from "@mui/material";
import { motion } from "framer-motion";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";

const MotionBox = motion(Box);

const letterColors = ["#ffffff", "#e0e7ff", "#c7d2fe", "#a5b4fc", "#c4b5fd"];

export default function HeroSection({ title, subtitle }) {
  const displayTitle = title || "Welcome to EduSphere";
  const letters = displayTitle.split("");

  return (
    <MotionBox
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      sx={{
        minHeight: { xs: "46vh", md: "54vh" },
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        background: "linear-gradient(135deg, #5b7bff 0%, #7a5bff 45%, #f38ff3 100%)",
        color: "white",
        borderRadius: "22px",
        p: { xs: 3, md: 5 },
        mx: { xs: 2, sm: 3, md: 4 },
        mt: 2,
        mb: 4,
        position: "relative",
        overflow: "hidden",
        boxShadow: 'var(--shadow-lg)',
      }}
    >
      {/* Animated Background Elements */}
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          opacity: 0.1,
          zIndex: 0,
        }}
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          style={{
            position: "absolute",
            width: "400px",
            height: "400px",
            borderRadius: "50%",
            background: "radial-gradient(circle, white, transparent)",
            top: "-100px",
            right: "-100px",
          }}
        />
      </Box>

      <Container maxWidth="md" sx={{ position: "relative", zIndex: 1 }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          style={{ display: "flex", justifyContent: "center", gap: 4, flexWrap: "wrap" }}
        >
          <Typography
            component="h1"
            variant="h2"
            sx={{
              fontWeight: 800,
              mb: 2,
              fontSize: { xs: "1.9rem", sm: "2.4rem", md: "3rem" },
              textAlign: "center",
              textShadow: "0 2px 10px rgba(0,0,0,0.2)",
              letterSpacing: 0.35,
              display: "flex",
              gap: 1,
              flexWrap: "nowrap",
              justifyContent: "center",
              whiteSpace: "nowrap",
            }}
          >
            {letters.map((char, i) => (
              <motion.span
                key={i + char}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 * i, duration: 0.35, ease: "easeOut" }}
                style={{
                  background: `linear-gradient(135deg, ${letterColors[i % letterColors.length]} 0%, #ffffff 100%)`,
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  display: "inline-block",
                }}
              >
                {char === " " ? "\u00A0" : char}
              </motion.span>
            ))}
          </Typography>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          <Typography
            variant="h6"
            sx={{
              fontSize: { xs: "1rem", md: "1.3rem" },
              mb: 3,
              textAlign: "center",
              opacity: 0.95,
              fontWeight: 300,
              letterSpacing: 0.5,
            }}
          >
            {subtitle || "Formal, non-formal, and informal learning — all in one platform."}
          </Typography>
        </motion.div>

        <Box sx={{ display: "flex", gap: 2, justifyContent: "center", flexWrap: "wrap" }}>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.4 }}
          >
            <Button
              variant="contained"
              href="/register"
              size="large"
              endIcon={<ArrowRightIcon />}
              sx={{
                background: "white",
                color: "#667eea",
                fontWeight: 700,
                px: 4,
                py: 1.5,
                fontSize: "1rem",
                boxShadow: 'var(--shadow-md)',
                transition: "all 180ms ease-out",
                "&:hover": {
                  background: "#f9fafb",
                  transform: "translateY(-2px)",
                  boxShadow: 'var(--shadow-lg)',
                },
              }}
            >
              Get Started
            </Button>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.4 }}
          >
            <Button
              variant="outlined"
              href="/explore"
              size="large"
              sx={{
                borderColor: "white",
                color: "white",
                fontWeight: 700,
                px: 4,
                py: 1.5,
                fontSize: "1rem",
                transition: "all 0.3s ease",
                "&:hover": {
                  background: "rgba(255,255,255,0.1)",
                  borderColor: "white",
                },
              }}
            >
              Explore
            </Button>
          </motion.div>
        </Box>
      </Container>
    </MotionBox>
  );
}
