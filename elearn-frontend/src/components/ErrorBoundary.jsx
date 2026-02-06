import { Component } from "react";
import { Box, Typography } from "@mui/material";

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    // Keep console output minimal but useful for diagnosis.
    console.error("[error-boundary]", error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <Box sx={{ p: 3, m: 2, border: "1px solid #fecaca", background: "#fff1f2", borderRadius: 2 }}>
          <Typography variant="h6" sx={{ color: "#b91c1c", fontWeight: 700, mb: 1 }}>
            Something went wrong while rendering this page.
          </Typography>
          <Typography variant="body2" sx={{ color: "#7f1d1d" }}>
            {this.state.error?.message || "Unknown render error"}
          </Typography>
        </Box>
      );
    }

    return this.props.children;
  }
}
