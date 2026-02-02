import { Box, Button, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import AnimationPlayer from "../components/AnimationPlayer";


export default function NotFound() {
  const navigate = useNavigate();

  return (
    <Box sx={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Navbar />
      <Box
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          px: 2,
        }}
      >
        <AnimationPlayer 
          path="/404.json" 
          style={{ width: 400, maxWidth: "90%", height: 400 }} 
        />
        <Typography variant="h4" sx={{ fontWeight: 800, mt: 2 }}>
          Page not found
        </Typography>
        <Typography sx={{ color: "#6b7280", mt: 1, mb: 3 }}>
          The page you're looking for doesn't exist or was moved.
        </Typography>
        <Button
          variant="contained"
          onClick={() => navigate("/")}
          sx={{ background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" }}
        >
          Go Home
        </Button>
      </Box>
    </Box>
  );
}
