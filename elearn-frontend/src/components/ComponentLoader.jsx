import { Box } from "@mui/material";
import AnimationPlayer from "./AnimationPlayer";

export default function ComponentLoader({ loading }) {
  if (!loading) return null;

  return (
    <Box
      sx={{
        position: "fixed",
        inset: 0,
        zIndex: 1500,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "rgba(255,255,255,0.9)",
        backdropFilter: "blur(4px)",
      }}
    >
      <AnimationPlayer path="/Spinnerdots.json" style={{ width: 120, height: 120 }} />
    </Box>
  );
}
