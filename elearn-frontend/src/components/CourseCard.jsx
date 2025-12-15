import { Card, CardContent, Typography, Box } from "@mui/material";
import { motion } from "framer-motion";

const MotionCard = motion(Card);

export default function CourseCard({ children, title, description, icon, sx }) {
  return (
    <MotionCard
      whileHover={{ scale: 1.01, y: -2 }}
      transition={{ duration: 0.18, ease: "easeOut" }}
      sx={{
        minHeight: 280,
        borderRadius: 'var(--radius-lg)',
        boxShadow: 'var(--shadow-sm)',
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: 'var(--color-surface)',
        border: '1px solid var(--color-border)',
        transition: "transform 180ms ease-out, box-shadow 180ms ease-out",
        cursor: "pointer",
        position: "relative",
        overflow: "hidden",
        "&:hover": {
          boxShadow: 'var(--shadow-lg)',
        },
        ...sx,
      }}
    >
      <CardContent
        sx={{
          width: "100%",
          textAlign: "center",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 2,
          p: 3,
        }}
      >
        {icon && (
          <Box
            sx={{
              fontSize: "3rem",
              mb: 1,
            }}
          >
            {icon}
          </Box>
        )}

        {title && (
          <Typography
            variant="h6"
            sx={{
              fontWeight: 700,
              color: "var(--color-text)",
              fontSize: "1.1rem",
            }}
          >
            {title}
          </Typography>
        )}

        {description && (
          <Typography
            variant="body2"
            sx={{
              color: "var(--color-muted)",
              fontSize: "0.9rem",
              lineHeight: 1.5,
            }}
          >
            {description}
          </Typography>
        )}

        {children}
      </CardContent>
    </MotionCard>
  );
}
