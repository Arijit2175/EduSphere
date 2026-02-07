import { Box, Button, Container, Typography } from "@mui/material";
import { motion } from "framer-motion";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import GradientText from "./GradientText";

const MotionBox = motion(Box);

export default function HeroSection({ title, subtitle }) {
  const displayTitle = title || "Welcome to EduSphere";

  return (
    <Box sx={{ position: "relative", mt: -6 }}>
      {/* Top badge */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.5 }}
        style={{ display: "flex", justifyContent: "center", marginBottom: "40px", position: "relative", zIndex: 2 }}
      >
        <Box
          sx={{
            backdropFilter: "blur(10px)",
            background: "rgba(255, 255, 255, 0.2)",
            border: "1px solid rgba(255, 255, 255, 0.3)",
            borderRadius: "20px",
            padding: "8px 20px",
            color: "#ffffff",
            fontWeight: 600,
            fontSize: "0.95rem",
            letterSpacing: 0.5,
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
          }}
        >
          🎓 Learn. Grow. Succeed.
        </Box>
      </motion.div>

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
            <GradientText
              colors={["#6c47ff", "#d793fb", "#b4b4b7", "#834efd"]}
              animationSpeed={3}
            >
              {displayTitle}
            </GradientText>
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
      </Container>
    </MotionBox>
    </Box>
  );
}
