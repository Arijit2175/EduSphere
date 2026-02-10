import { Box, Typography } from "@mui/material";
import { motion } from "framer-motion";

const MotionBox = motion(Box);

export default function SectionTitle({ title, subtitle, centered = true, variant = "h3", titleColor, subtitleColor, titleComponent }) {
  // Support 'gradient' as a special value for titleColor
  const titleSx = titleColor === 'gradient'
    ? {
        fontWeight: 800,
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        backgroundClip: "text",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        mb: 1,
      }
    : {
        fontWeight: 800,
        color: titleColor || '#fff',
        mb: 1,
        textShadow: '0 2px 8px rgba(0,0,0,0.18)'
      };
  const subtitleSx = subtitleColor
    ? {
        color: subtitleColor,
        fontSize: { xs: "0.95rem", md: "1.1rem" },
        maxWidth: 600,
        mx: centered ? "auto" : 0,
        textShadow: '0 2px 8px rgba(0,0,0,0.18)'
      }
    : {
        color: "#fff",
        fontSize: { xs: "0.95rem", md: "1.1rem" },
        maxWidth: 600,
        mx: centered ? "auto" : 0,
        textShadow: '0 2px 8px rgba(0,0,0,0.18)'
      };
  return (
    <MotionBox
      initial={{ opacity: 0, y: -10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      sx={{
        textAlign: centered ? "center" : "left",
        mb: 4,
      }}
    >
      <Typography
        variant={variant}
        component="h2"
        sx={titleSx}
      >
        {titleComponent || title}
      </Typography>
      {subtitle && (
        <Typography
          variant="body1"
          sx={subtitleSx}
        >
          {subtitle}
        </Typography>
      )}
    </MotionBox>
  );
}
