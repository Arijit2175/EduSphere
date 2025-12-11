import { Card, CardContent, Typography, Box } from "@mui/material";
import { motion } from "framer-motion";

const MotionCard = motion(Card);

export default function CourseCard({ children, title, description, icon, sx }) {
  return (
    <MotionCard
      component={MotionCard}
      whileHover={{ scale: 1.05, y: -8 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      sx={{
        minHeight: 280,
        borderRadius: 3,
        boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #ffffff 0%, #f8f9ff 100%)",
        border: "1px solid rgba(102, 126, 234, 0.1)",
        transition: "all 0.3s ease",
        cursor: "pointer",
        position: "relative",
        overflow: "hidden",
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "3px",
          background: "linear-gradient(90deg, #667eea, #764ba2, #f093fb)",
        },
        "&:hover": {
          boxShadow: "0 12px 40px rgba(102, 126, 234, 0.2)",
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
              color: "#2c3e50",
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
              color: "#666",
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
