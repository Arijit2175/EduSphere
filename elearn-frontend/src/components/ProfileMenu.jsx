
import { useState } from "react";
import { Menu, MenuItem, Divider, Box, Typography, Avatar, Button, Stack, Chip } from "@mui/material";
import { useAuth } from "../contexts/AuthContext";
import { useSidebar } from "../contexts/SidebarContext";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PersonIcon from "@mui/icons-material/Person";
import LogoutIcon from "@mui/icons-material/Logout";

export default function ProfileMenu({ anchorEl, open, onClose }) {
  const { user, logout } = useAuth();
  const { setIsOpen } = useSidebar();
  const navigate = useNavigate();

  const displayName = user?.name || `${user?.first_name || ""} ${user?.last_name || ""}`.trim() || "Learner";

  const handleLogout = () => {
    logout();
    setIsOpen(false);
    onClose();
    navigate("/");
  };

  return (
    <Menu
      anchorEl={anchorEl}
      open={open}
      onClose={onClose}
      disableScrollLock={true}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      PaperProps={{
        sx: {
          p: 0,
          m: 1,
          minWidth: 280,
          maxWidth: 280,
          borderRadius: 2.5,
          boxShadow: '0 10px 40px rgba(0, 0, 0, 0.12)',
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(0, 0, 0, 0.05)',
          animation: 'fadeIn 0.2s ease-in-out',
          '@keyframes fadeIn': {
            '0%': { opacity: 0, transform: 'translateY(-8px)' },
            '100%': { opacity: 1, transform: 'translateY(0)' },
          }
        }
      }}
    >
      {/* User Info Section */}
      <Box sx={{ p: 3, pb: 2 }}>
        <Stack direction="row" spacing={2} alignItems="center">
          <Avatar 
            src={user?.avatar || undefined}
            sx={{ 
              width: 50, 
              height: 50, 
              bgcolor: "primary.main",
              fontSize: 18,
              fontWeight: 600,
              flexShrink: 0,
              border: '2px solid rgba(0, 0, 0, 0.06)'
            }}
          >
            {!user?.avatar && displayName.slice(0, 1).toUpperCase()}
          </Avatar>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography 
              variant="subtitle2" 
              sx={{ 
                fontWeight: 600, 
                color: '#000',
                fontSize: '0.95rem',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap'
              }}
            >
              {displayName}
            </Typography>
            <Typography 
              variant="caption" 
              sx={{ 
                color: '#6b7280',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                display: 'block'
              }}
            >
              {user?.email}
            </Typography>
            {user?.role && (
              <Chip 
                label={user.role} 
                size="small" 
                sx={{ 
                  mt: 0.75,
                  height: 24,
                  fontSize: '0.7rem',
                  fontWeight: 500,
                  background: 'rgba(99, 102, 241, 0.1)',
                  color: 'primary.main'
                }}
                variant="outlined"
              />
            )}
          </Box>
        </Stack>
      </Box>

      <Divider sx={{ my: 1, opacity: 0.5 }} />

      {/* Menu Items */}
      <Box sx={{ p: 1 }}>
        <MenuItem 
          component={RouterLink}
          to="/dashboard"
          onClick={() => {
            console.log("[menu-click]", "/dashboard");
            onClose();
          }}
          sx={{
            borderRadius: 1.5,
            mx: 1,
            mb: 0.5,
            py: 1.5,
            px: 2,
            transition: 'all 0.2s ease',
            color: '#000',
            '&:hover': {
              backgroundColor: 'rgba(99, 102, 241, 0.08)',
              transform: 'translateX(4px)',
            },
            '&:active': {
              backgroundColor: 'rgba(99, 102, 241, 0.15)',
            }
          }}
        >
          <DashboardIcon sx={{ mr: 1.5, fontSize: 20, color: 'primary.main' }} />
          <Typography variant="body2" sx={{ fontWeight: 500 }}>Dashboard</Typography>
        </MenuItem>

        <MenuItem 
          component={RouterLink}
          to="/profile"
          onClick={() => {
            console.log("[menu-click]", "/profile");
            onClose();
          }}
          sx={{
            borderRadius: 1.5,
            mx: 1,
            mb: 0.5,
            py: 1.5,
            px: 2,
            transition: 'all 0.2s ease',
            color: '#000',
            '&:hover': {
              backgroundColor: 'rgba(99, 102, 241, 0.08)',
              transform: 'translateX(4px)',
            },
            '&:active': {
              backgroundColor: 'rgba(99, 102, 241, 0.15)',
            }
          }}
        >
          <PersonIcon sx={{ mr: 1.5, fontSize: 20, color: 'primary.main' }} />
          <Typography variant="body2" sx={{ fontWeight: 500 }}>Profile</Typography>
        </MenuItem>

        <MenuItem 
          onClick={handleLogout}
          sx={{
            borderRadius: 1.5,
            mx: 1,
            py: 1.5,
            px: 2,
            transition: 'all 0.2s ease',
            color: '#dc2626',
            '&:hover': {
              backgroundColor: 'rgba(220, 38, 38, 0.08)',
              transform: 'translateX(4px)',
            },
            '&:active': {
              backgroundColor: 'rgba(220, 38, 38, 0.15)',
            }
          }}
        >
          <LogoutIcon sx={{ mr: 1.5, fontSize: 20, color: '#dc2626' }} />
          <Typography variant="body2" sx={{ fontWeight: 500 }}>Logout</Typography>
        </MenuItem>
      </Box>
    </Menu>
  );
}
