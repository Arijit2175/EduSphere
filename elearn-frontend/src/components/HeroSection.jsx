import { Button } from "@mui/material";

export default function HeroSection() {
  return (
    <div
      style={{
        height: "60vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: "40px",
        background:
          "linear-gradient(135deg, #4f46e5, #6d28d9, #a855f7)",
        color: "white",
        borderRadius: "20px",
        marginTop: "20px",
        animation: "fadeIn 1s ease",
      }}
    >
      <h1 style={{ fontSize: "3rem" }}>Learn. Grow. Evolve.</h1>
      <p style={{ fontSize: "1.2rem", marginTop: "10px" }}>
        Formal, non-formal, and informal learning — all in one platform.
      </p>

      <Button
        variant="contained"
        href="/register"
        sx={{
          marginTop: "20px",
          background: "white",
          color: "#4f46e5",
          fontWeight: "600",
          ":hover": { background: "#eaeaea" },
        }}
      >
        Get Started
      </Button>
    </div>
  );
}
