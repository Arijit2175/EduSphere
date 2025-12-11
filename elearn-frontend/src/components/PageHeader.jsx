import { Box, Container, Typography } from "@mui/material";
import { motion } from "framer-motion";

const MotionBox = motion(Box);

export default function PageHeader({ title, subtitle, backgroundGradient }) {
  return (
    <MotionBox
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      sx={{
        background: backgroundGradient || "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        color: "white",
        py: { xs: 4, md: 6 },
        mb: 4,
        borderRadius: 3,
        boxShadow: "0 8px 32px rgba(102, 126, 234, 0.2)",
      }}
    >
      <Container maxWidth="lg">
        <Typography
          variant="h3"
          sx={{
            fontWeight: 800,
            mb: 1,
            fontSize: { xs: "2rem", md: "2.8rem" },
          }}
        >
          {title}
        </Typography>
        {subtitle && (
          <Typography
            variant="h6"
            sx={{
              fontWeight: 300,
              opacity: 0.95,
              fontSize: { xs: "0.95rem", md: "1.1rem" },
            }}
          >
            {subtitle}
          </Typography>
        )}
      </Container>
    </MotionBox>
  );
}
