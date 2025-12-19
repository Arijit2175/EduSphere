import { Card, CardContent, Typography, Box, Chip, Stack } from "@mui/material";
import { motion } from "framer-motion";
import { Star } from "@mui/icons-material";

const MotionCard = motion(Card);

export default function CourseCard({ children, title, description, icon, sx }) {
  return (
    <MotionCard
      whileHover={{ scale: 1.05, y: -8 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      sx={{
        minHeight: 320,
        borderRadius: "16px",
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
        display: "flex",
        flexDirection: "column",
        alignItems: "stretch",
        justifyContent: "flex-start",
        background: "linear-gradient(135deg, #ffffff 0%, #f8f9ff 100%)",
        border: "1px solid #e5e7eb",
        transition: "transform 0.2s ease-out, box-shadow 0.2s ease-out",
        cursor: "pointer",
        position: "relative",
        overflow: "hidden",
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "4px",
          background: "linear-gradient(90deg, #667eea 0%, #764ba2 100%)",
        },
        "&:hover": {
          boxShadow: "0 12px 32px rgba(102, 126, 234, 0.15)",
          borderColor: "#667eea",
        },
        ...sx,
      }}
    >
      {/* Icon Background */}
      <Box
        sx={{
          background: "linear-gradient(135deg, #667eea15 0%, #764ba215 100%)",
          py: 3,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {icon && (
          <Box
            sx={{
              fontSize: "4rem",
              textShadow: "0 2px 4px rgba(102, 126, 234, 0.1)",
            }}
          >
            {icon}
          </Box>
        )}
      </Box>

      <CardContent
        sx={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
          gap: 1.5,
          p: 2.5,
          flex: 1,
          textAlign: "center",
        }}
      >
        {title && (
          <Typography
            variant="h6"
            sx={{
              fontWeight: 800,
              color: "#1f2937",
              fontSize: "1.15rem",
              lineHeight: 1.3,
            }}
          >
            {title}
          </Typography>
        )}

        {description && (
          <Typography
            variant="body2"
            sx={{
              color: "#6b7280",
              fontSize: "0.9rem",
              lineHeight: 1.6,
              minHeight: "2.7em",
            }}
          >
            {description}
          </Typography>
        )}

        {/* Rating Section */}
        <Stack direction="row" spacing={0.5} alignItems="center" justifyContent="center">
          <Star sx={{ fontSize: "1rem", color: "#fbbf24" }} />
          <Typography variant="caption" sx={{ fontWeight: 600, color: "#374151" }}>
            4.8
          </Typography>
          <Typography variant="caption" sx={{ color: "#9ca3af" }}>
            (248)
          </Typography>
        </Stack>

        {children && (
          <Box sx={{ mt: "auto", pt: 1 }}>
            {children}
          </Box>
        )}
      </CardContent>
    </MotionCard>
  );
}
