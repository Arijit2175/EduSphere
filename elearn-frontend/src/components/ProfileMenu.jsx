
import { useState } from "react";
import { Menu, MenuItem, Divider, Box, Typography, Avatar, Button, Stack, Grid, Chip, Card, CardContent } from "@mui/material";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

export default function ProfileMenu({ anchorEl, open, onClose }) {
  const { user, logout } = useAuth();
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
    onClose();
    navigate("/");
  };

  const handleFillDetails = () => {
    setShowDetailsPrompt(false);
    navigate("/profile");
  };

  // Prepare details for grid
  const detailItems = [
    { label: "Email", value: user?.email || "-" },
    { label: "Role", value: user?.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : "-" },
    { label: "Joined", value: user?.joinedDate ? new Date(user.joinedDate).toLocaleDateString() : "-" },
  ];

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
      <Card elevation={0} sx={{ m: 0, boxShadow: 'none', background: 'transparent' }}>
        <CardContent sx={{ p: 0, pb: 0 }}>
          <Stack direction={{ xs: "column", sm: "row" }} spacing={2} alignItems="center" sx={{ mb: 2 }}>
            <Avatar sx={{ bgcolor: "#667eea", width: 56, height: 56, fontSize: 22 }}>
              {user?.firstName ? user.firstName[0].toUpperCase() : (user?.email ? user.email[0].toUpperCase() : "U")}
            </Avatar>
            <Box sx={{ textAlign: { xs: "center", sm: "left" } }}>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>{user?.firstName && user?.lastName ? `${user.firstName} ${user.lastName}` : user?.email || "User"}</Typography>
              <Typography variant="body2" sx={{ color: "#6b7280" }}>{user?.email}</Typography>
              <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                {user?.role && <Chip label={user.role} size="small" />}
              </Stack>
            </Box>
          </Stack>
          <Grid container spacing={2} sx={{ mb: 1 }}>
            {detailItems.map((item) => (
              <Grid item xs={12} sm={6} key={item.label}>
                <Typography variant="subtitle2" sx={{ color: "#6b7280" }}>
                  {item.label}
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 600 }}>
                  {item.value}
                </Typography>
              </Grid>
            ))}
          </Grid>
          {missingDetails && (
            <Box sx={{ mt: 1, mb: 1 }}>
              <Typography variant="body2" color="error">
                Please complete your profile details.
              </Typography>
              <Button variant="outlined" size="small" onClick={handleFillDetails} sx={{ mt: 1 }}>
                Fill Details
              </Button>
            </Box>
          )}
        </CardContent>
      </Card>
      <Divider />
      <MenuItem onClick={handleDashboard}>Dashboard</MenuItem>
      <MenuItem onClick={handleProfile}>Profile</MenuItem>
      <MenuItem onClick={handleLogout}>Logout</MenuItem>
    </Menu>
  );
}
