

import { AppBar, Toolbar, Button, Typography, Box, IconButton } from "@mui/material";
import { AccountCircle, Menu as MenuIcon } from "@mui/icons-material";
import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import ProfileMenu from "./ProfileMenu";
import { useSidebar } from "../contexts/SidebarContext";

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const displayName = user?.name || `${user?.firstName || ""} ${user?.lastName || ""}`.trim() || user?.email;
  const { toggleSidebar } = useSidebar();

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    handleClose();
    navigate("/");
  };

  const handleHomeClick = () => {
    navigate("/home");
  };


  return (
    <AppBar
      position="sticky"
      elevation={0}
      color="transparent"
      sx={{
        backdropFilter: 'saturate(180%) blur(8px)',
        borderBottom: '1px solid var(--color-border)',
        background: 'color-mix(in oklab, var(--color-surface) 88%, transparent)',
      }}
    >
      <Toolbar>

        {/* Hamburger menu for sidebar */}
        <IconButton
          color="inherit"
          edge="start"
          onClick={toggleSidebar}
          sx={{ mr: 2, display: { md: 'none' } }}
        >
          <MenuIcon />
        </IconButton>
        <Typography 
          variant="h6" 
          sx={{ 
            flexGrow: 1, 
            fontWeight: "600",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: 1,
          }}
          onClick={handleHomeClick}
        >
          <Box sx={{ fontSize: "1.8rem" }}>🎓</Box>
          EduSphere
        </Typography>

        <Button onClick={handleHomeClick} color="inherit" sx={{ borderRadius: 'var(--radius-sm)' }}>Home</Button>

        {isAuthenticated ? (
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Typography variant="body2" sx={{ mr: 1, display: { xs: 'none', sm: 'block' } }}>
              {displayName}
            </Typography>
            <IconButton size="large" onClick={handleMenu} color="inherit" sx={{ borderRadius: 'var(--radius-sm)' }}>
              <AccountCircle />
            </IconButton>
            <ProfileMenu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose} />
          </Box>
        ) : (
          <>
            <Button 
              href="/login" 
              color="inherit" 
              sx={{ 
                borderRadius: 'var(--radius-sm)',
                transition: "all 0.3s ease",
                "&:hover": {
                  background: "rgba(122, 91, 255, 0.1)",
                }
              }}
            >
              Login
            </Button>
            <Button 
              href="/register" 
              color="inherit"
              sx={{ 
                borderRadius: 'var(--radius-sm)',
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                color: "#ffffff",
                fontWeight: 700,
                px: 2.5,
                transition: "all 0.3s ease",
                "&:hover": {
                  transform: "translateY(-2px)",
                  boxShadow: "0 6px 20px rgba(122, 91, 255, 0.4)",
                }
              }}
            >
              Register
            </Button>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
}
