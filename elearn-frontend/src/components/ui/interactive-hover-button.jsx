import { Box } from "@mui/material";

const defaultStyles = {
  position: "relative",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  gap: 8,
  padding: "10px 18px",
  borderRadius: 12,
  border: "none",
  color: "#ffffff",
  cursor: "pointer",
  fontWeight: 700,
  fontSize: "0.9rem",
  letterSpacing: "0.01em",
  textTransform: "none",
  background: "linear-gradient(135deg, #0ea5e9 0%, #22c55e 100%)",
  boxShadow: "0 12px 26px rgba(14, 165, 233, 0.24)",
  overflow: "hidden",
  transition: "transform 0.2s ease, box-shadow 0.2s ease",
  "&::before": {
    content: '""',
    position: "absolute",
    top: "50%",
    left: "-60%",
    width: "140%",
    height: "140%",
    background: "radial-gradient(circle at center, rgba(255,255,255,0.4), transparent 60%)",
    transform: "translateY(-50%)",
    transition: "left 0.35s ease",
  },
  "&::after": {
    content: '""',
    position: "absolute",
    inset: 2,
    borderRadius: 10,
    border: "1px solid rgba(255,255,255,0.25)",
    opacity: 0,
    transition: "opacity 0.25s ease",
  },
  "&:hover": {
    transform: "translateY(-1px)",
    boxShadow: "0 16px 32px rgba(14, 165, 233, 0.3)",
  },
  "&:hover::before": {
    left: "10%",
  },
  "&:hover::after": {
    opacity: 1,
  },
  "&:disabled": {
    opacity: 0.6,
    cursor: "not-allowed",
    boxShadow: "none",
    transform: "none",
  },
};

export function InteractiveHoverButton({ children, sx = {}, ...props }) {
  return (
    <Box component="button" type="button" sx={{ ...defaultStyles, ...sx }} {...props}>
      <Box component="span" sx={{ position: "relative", zIndex: 1 }}>
        {children}
      </Box>
    </Box>
  );
}
