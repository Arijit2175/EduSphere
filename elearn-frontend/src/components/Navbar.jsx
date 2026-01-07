

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
      <Toolbar sx={{ position: 'relative', minHeight: 64 }}>
        {/* Hamburger menu (left) */}
        <IconButton
          color="inherit"
          edge="start"
          onClick={toggleSidebar}
          sx={{ mr: 2, display: { md: 'none' }, zIndex: 2 }}
        >
          <MenuIcon />
        </IconButton>

        {/* Centered EduSphere title */}
        <Typography
          variant="h6"
          sx={{
            position: 'absolute',
            left: 0,
            right: 0,
            top: 0,
            bottom: 0,
            m: 'auto',
            width: 'fit-content',
            height: 'fit-content',
            fontWeight: 600,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            justifyContent: 'center',
            pointerEvents: 'auto',
            zIndex: 1,
          }}
          onClick={handleHomeClick}
        >
          <Box sx={{ fontSize: '1.8rem' }}>🎓</Box>
          EduSphere
        </Typography>

        {/* Right side actions */}
        {isAuthenticated ? (
          <Box sx={{ display: 'flex', alignItems: 'center', ml: 'auto', gap: 1 }}>
            <Button onClick={handleHomeClick} color="inherit" sx={{ borderRadius: 'var(--radius-sm)' }}>Home</Button>
            <Typography variant="body2" sx={{ mr: 1, display: { xs: 'none', sm: 'block' } }}>
              {displayName}
            </Typography>
            <IconButton size="large" onClick={handleMenu} color="inherit" sx={{ borderRadius: 'var(--radius-sm)' }}>
              <AccountCircle />
            </IconButton>
            <ProfileMenu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose} />
          </Box>
        ) : (
          <Box sx={{ display: 'flex', alignItems: 'center', ml: 'auto', gap: 1 }}>
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
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
}
