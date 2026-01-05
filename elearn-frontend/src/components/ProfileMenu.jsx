
import { useState } from "react";
import { Menu, MenuItem, Divider, Box, Typography, Avatar, Button, Stack, Grid, Chip, Card, CardContent } from "@mui/material";
import { useAuth } from "../contexts/AuthContext";
import { useSidebar } from "../contexts/SidebarContext";
import { useNavigate } from "react-router-dom";

export default function ProfileMenu({ anchorEl, open, onClose }) {
  const { user, logout } = useAuth();
  const { setIsOpen } = useSidebar();
  const navigate = useNavigate();
  const [showDetailsPrompt, setShowDetailsPrompt] = useState(false);

  // Check if student/teacher details are missing (customize as needed)
  const missingDetails = !user?.firstName || !user?.lastName || !user?.email || !user?.role;

  const handleDashboard = () => {
    onClose();
    navigate("/dashboard");
  };

  const handleProfile = () => {
    onClose();
    navigate("/profile");
  };

  const handleLogout = () => {
    logout();
    setIsOpen(false); // Close sidebar on logout
    onClose();
    navigate("/");
  };

  const handleFillDetails = () => {
    setShowDetailsPrompt(false);
    navigate("/profile");
  };



  return (
    <Menu
      anchorEl={anchorEl}
      open={open}
      onClose={onClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      PaperProps={{
        sx: {
          p: 0,
          m: 0,
          minWidth: 320,
          borderRadius: 3,
          boxShadow: 6,
          background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
        }
      }}
    >
      <Stack direction={{ xs: "column", sm: "row" }} spacing={2} alignItems="center" sx={{ mb: 2, mt: 2, px: 3 }}>
        <Avatar src={user?.avatar || undefined} sx={{ bgcolor: "#667eea", width: 80, height: 80, fontSize: 32 }}>
          {!user?.avatar && (user?.firstName ? user.firstName[0].toUpperCase() : (user?.email ? user.email[0].toUpperCase() : "U"))}
        </Avatar>
        <Box sx={{ textAlign: { xs: "center", sm: "left" } }}>
          <Typography variant="h6" sx={{ fontWeight: 700 }}>{user?.firstName && user?.lastName ? `${user.firstName} ${user.lastName}` : user?.email || "User"}</Typography>
          <Typography variant="body2" sx={{ color: "#6b7280" }}>{user?.email}</Typography>
          <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
            {user?.role && <Chip label={user.role} size="small" />}
          </Stack>
        </Box>
      </Stack>
      <Divider />
      <MenuItem onClick={handleDashboard}>Dashboard</MenuItem>
      <MenuItem onClick={handleProfile}>Profile</MenuItem>
      <MenuItem onClick={handleLogout}>Logout</MenuItem>
    </Menu>
  );
}
