import { Box, Typography } from "@mui/material";
import AnimationPlayer from "./AnimationPlayer";

export default function FullPageLoader({ open, label = "Loading..." }) {
  if (!open) return null;

  return (
    <Box
      sx={{
        position: "fixed",
        inset: 0,
        zIndex: 2000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        background: "rgba(255,255,255,0.85)",
        backdropFilter: "blur(4px)",
      }}
    >
      <AnimationPlayer path="/Spinnerdots.json" style={{ width: 120, height: 120 }} />
      <Typography sx={{ mt: 1, fontWeight: 600, color: "#4b5563" }}>{label}</Typography>
    </Box>
  );
}
