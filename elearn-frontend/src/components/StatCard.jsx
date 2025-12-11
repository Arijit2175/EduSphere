import { Card, CardContent, Box, Typography, Button } from "@mui/material";
import { motion } from "framer-motion";

const MotionCard = motion(Card);

export default function StatCard({ icon, value, label, color = "#667eea", actionText = null, onAction = null }) {
  return (
    <MotionCard
      whileHover={{ y: -12, boxShadow: "0 20px 40px rgba(0,0,0,0.15)" }}
      sx={{
        background: `linear-gradient(135deg, ${color}15 0%, ${color}05 100%)`,
        border: `2px solid ${color}20`,
        borderRadius: 3,
        overflow: "hidden",
        position: "relative",
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "4px",
          background: `linear-gradient(90deg, ${color}, transparent)`,
        },
      }}
    >
      <CardContent sx={{ py: 3 }}>
        <Box sx={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", mb: 2 }}>
          <Box
            sx={{
              fontSize: "2.5rem",
              p: 1.5,
              background: `${color}20`,
              borderRadius: 2,
              lineHeight: 1,
            }}
          >
            {icon}
          </Box>
          {actionText && (
            <Button size="small" variant="text" onClick={onAction} sx={{ color }}>
              {actionText}
            </Button>
          )}
        </Box>
        <Typography
          variant="h4"
          sx={{
            fontWeight: 800,
            color,
            mb: 0.5,
          }}
        >
          {value}
        </Typography>
        <Typography variant="body2" sx={{ color: "#7f8c8d", fontWeight: 500 }}>
          {label}
        </Typography>
      </CardContent>
    </MotionCard>
  );
}
