import { Box, CircularProgress } from "@mui/material";

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
      <CircularProgress />
    </Box>
  );
}
