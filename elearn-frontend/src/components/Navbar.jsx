

import { AppBar, Toolbar, Button, Typography, Box, IconButton, Fade } from "@mui/material";
import { AccountCircle, Menu as MenuIcon } from "@mui/icons-material";
import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import ProfileMenu from "./ProfileMenu";
import { useSidebar } from "../contexts/SidebarContext";

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const [anchorEl, setAnchorEl] = useState(null);
  const displayName = user?.name || `${user?.firstName || ""} ${user?.lastName || ""}`.trim() || user?.email;
  const { toggleSidebar, setIsOpen } = useSidebar();

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    setIsOpen(false); // Close sidebar on logout
    handleClose();
    window.location.href = "/";
  };

  const handleHomeClick = () => {
    window.location.href = "/home";
  };

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        background: "linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.9) 100%)",
        backdropFilter: "saturate(180%) blur(12px)",
        borderBottom: "1px solid rgba(102, 126, 234, 0.1)",
        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
      }}
    >
      <Toolbar
        sx={{
          position: "relative",
          minHeight: { xs: 56, sm: 64 },
          px: { xs: 2, sm: 3 },
        }}
      >

        {/* Centered EduSphere title */}
        <Fade in timeout={600}>
          <Typography
            variant="h6"
            sx={{
              position: "absolute",
              left: "50%",
              transform: "translateX(-50%)",
              fontWeight: 700,
              fontSize: { xs: "1.1rem", sm: "1.25rem" },
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 1,
              color: "#1a1a2e",
              letterSpacing: "0.5px",
              transition: "all 0.3s ease",
              "&:hover": {
                color: "#667eea",
              },
            }}
            onClick={handleHomeClick}
          >
            <Box
              component="span"
              sx={{
                fontSize: { xs: "1.5rem", sm: "1.8rem" },
                display: "flex",
                alignItems: "center",
                transition: "transform 0.3s ease",
                "&:hover": {
                  transform: "rotate(-10deg) scale(1.1)",
                },
              }}
            >
              🎓
            </Box>
            EduSphere
          </Typography>
        </Fade>

        {/* Right side actions */}
        <Box sx={{ flexGrow: 1 }} />
        {isAuthenticated ? (
          <Fade in timeout={800}>
            <Box sx={{ display: "flex", alignItems: "center", gap: { xs: 1, sm: 2 } }}>
              <Button
                onClick={handleHomeClick}
                sx={{
                  color: "#1a1a2e",
                  fontWeight: 600,
                  fontSize: "0.95rem",
                  borderRadius: "10px",
                  px: 2,
                  py: 0.8,
                  textTransform: "none",
                  transition: "all 0.3s ease",
                  position: "relative",
                  overflow: "hidden",
                  "&::before": {
                    content: '""',
                    position: "absolute",
                    bottom: 6,
                    left: "50%",
                    transform: "translateX(-50%) scaleX(0)",
                    width: "60%",
                    height: 2,
                    background: "linear-gradient(90deg, #667eea, #764ba2)",
                    borderRadius: 1,
                    transition: "transform 0.3s ease",
                  },
                  "&:hover": {
                    background: "rgba(102, 126, 234, 0.08)",
                    "&::before": {
                      transform: "translateX(-50%) scaleX(1)",
                    },
                  },
                }}
              >
                Home
              </Button>

              <Typography
                variant="body2"
                sx={{
                  color: "#1a1a2e",
                  fontWeight: 500,
                  display: { xs: "none", sm: "block" },
                  fontSize: "0.95rem",
                }}
              >
                {displayName}
              </Typography>

              <IconButton
                size="large"
                onClick={handleMenu}
                sx={{
                  color: "#667eea",
                  borderRadius: "10px",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    background: "rgba(102, 126, 234, 0.1)",
                    transform: "scale(1.05)",
                  },
                }}
              >
                <AccountCircle sx={{ fontSize: 28 }} />
              </IconButton>
              <ProfileMenu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose} />
            </Box>
          </Fade>
        ) : (
          <Fade in timeout={800}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
              <Button
                href="/login"
                sx={{
                  color: "#1a1a2e",
                  fontWeight: 600,
                  borderRadius: "10px",
                  px: 2.5,
                  py: 0.8,
                  textTransform: "none",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    background: "rgba(102, 126, 234, 0.1)",
                  },
                }}
              >
                Login
              </Button>
              <Button
                href="/register"
                sx={{
                  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  color: "#ffffff",
                  fontWeight: 700,
                  borderRadius: "10px",
                  px: 3,
                  py: 0.8,
                  textTransform: "none",
                  boxShadow: "0 4px 14px rgba(102, 126, 234, 0.4)",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    transform: "translateY(-2px)",
                    boxShadow: "0 6px 20px rgba(102, 126, 234, 0.5)",
                  },
                }}
              >
                Register
              </Button>
            </Box>
          </Fade>
        )}
      </Toolbar>
    </AppBar>
  );
}
