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
        background:
          backgroundGradient ||
          "linear-gradient(180deg, rgba(37, 99, 235, 0.08), transparent)",
        color: "var(--color-text)",
        py: { xs: 4, md: 6 },
        mb: 4,
        borderBottom: '1px solid var(--color-border)',
      }}
    >
      <Container maxWidth="lg" className="page-header">
        <Typography
          variant="h3"
          sx={{
            fontWeight: 800,
            mb: 1,
            fontSize: { xs: "2rem", md: "2.6rem" },
          }}
        >
          {title}
        </Typography>
        {subtitle && (
          <Typography
            variant="h6"
            sx={{
              fontWeight: 400,
              opacity: 0.9,
              fontSize: { xs: "0.95rem", md: "1.05rem" },
            }}
          >
            {subtitle}
          </Typography>
        )}
      </Container>
    </MotionBox>
  );
}
