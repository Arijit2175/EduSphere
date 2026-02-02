import { Box, Typography, CircularProgress } from "@mui/material";

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
      <CircularProgress />
      <Typography sx={{ mt: 1, fontWeight: 600, color: "#4b5563" }}>{label}</Typography>
    </Box>
  );
}
