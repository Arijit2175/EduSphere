import React from "react";
import { Box, Grid, Card, CardContent, Typography, Button, Stack, Chip, Avatar, Dialog, DialogTitle, DialogContent, DialogActions, TextField, IconButton } from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import PageHeader from "../components/PageHeader";
import { useAuth } from "../contexts/AuthContext";
import { useSidebar } from "../contexts/SidebarContext";



export default function Profile() {
  const { user, updateUser: updateUserRaw } = useAuth();
  const updateUser = updateUserRaw || (() => {});
  const { isOpen } = useSidebar();
  const displayName = user?.name || `${user?.firstName || ""} ${user?.lastName || ""}`.trim() || "Learner";

  // Form state is only updated when Save is clicked
  const [editOpen, setEditOpen] = React.useState(false);
  const [form, setForm] = React.useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    email: user?.email || "",
    phone: user?.phone || "",
    gender: user?.gender || "",
    state: user?.state || "",
    city: user?.city || "",
    bio: user?.bio || "",
    linkedin: user?.linkedin || "",
    github: user?.github || "",
  });

  // Temp state for editing
  const [editForm, setEditForm] = React.useState(form);

  const handleEditOpen = () => {
    setEditForm(form); // Start editing with current values
    setEditOpen(true);
  };
  const handleEditClose = () => setEditOpen(false);
  const handleEditFormChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };
  const handleFormSubmit = () => {
    setForm(editForm);
    updateUser(editForm);
    setEditOpen(false);
  };


  return (
    <Box sx={{ display: "flex", height: "100vh", minHeight: 0, m: 0, p: 0 }}>
      <Sidebar />
      <Box
        sx={{
          flexGrow: 1,
          ml: 0,
          minHeight: 0,
          height: "100vh",
          background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
          transition: "margin-left 0.3s ease",
          display: "flex",
          flexDirection: "column",
          p: 0,
          m: 0,
        }}
      >
        <Navbar />
        <Box sx={{ flex: 1, display: "flex", flexDirection: "column", p: 0, m: 0 }}>
          <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center', mt: 3, mb: 2 }}>
            <Box sx={{ width: '100%', maxWidth: 700 }}>
              <PageHeader
                title="Profile"
                subtitle={`You are logged in as ${displayName}`}
                backgroundGradient="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                sx={{ m: 0, p: 0 }}
              />
            </Box>
          </Box>
          <Box sx={{
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            mt: 0,
            mb: 0,
          }}>
            <Box sx={{
              display: 'flex',
              flexDirection: { xs: 'column', md: 'row' },
              justifyContent: 'center',
              alignItems: 'stretch',
              gap: 3,
              width: '100%',
              maxWidth: 900,
            }}>
              {/* Left: Avatar and Edit */}
              <Box sx={{ width: { xs: '100%', md: 220 }, flexShrink: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', mb: { xs: 2, md: 0 } }}>
                <Card sx={{ width: '100%', maxWidth: 220, p: 2, borderRadius: 2, boxShadow: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', minHeight: 320 }}>
                  <Avatar sx={{ bgcolor: "#667eea", width: 80, height: 80, fontSize: 32, mb: 1.5 }}>
                    {displayName?.slice(0, 1).toUpperCase() || "U"}
                  </Avatar>
                  <Typography variant="h6" sx={{ fontWeight: 700, textAlign: 'center', mb: 0.5 }}>{displayName}</Typography>
                  <Typography variant="body2" sx={{ color: "#6b7280", textAlign: 'center', fontSize: 13 }}>{form.email}</Typography>
                  <Stack direction="row" spacing={1} sx={{ mt: 1, justifyContent: 'center', width: '100%' }}>
                    {user?.role && <Chip label={user.role} size="small" />}
                  </Stack>
                  <Button onClick={handleEditOpen} variant="outlined" sx={{ mt: 2, width: '100%' }} startIcon={<EditIcon />}>Edit</Button>
                </Card>
              </Box>
              {/* Right: Details */}
              <Box sx={{ flex: 1, minWidth: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Card sx={{ borderRadius: 2, boxShadow: 2, m: 0, p: 0, width: '100%', maxWidth: 420 }}>
                  <CardContent sx={{ m: 0, p: 2 }}>
                    <Grid container spacing={1.5}>
                      {/* First Name | Last Name */}
                      <Grid item xs={6}>
                        <Typography variant="subtitle2" sx={{ fontSize: 13 }}>First Name</Typography>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>{form.firstName}</Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="subtitle2" sx={{ fontSize: 13 }}>Last Name</Typography>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>{form.lastName}</Typography>
                      </Grid>
                      {/* Phone | Gender */}
                      <Grid item xs={6}>
                        <Typography variant="subtitle2" sx={{ fontSize: 13 }}>Phone</Typography>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>{form.phone}</Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="subtitle2" sx={{ fontSize: 13 }}>Gender</Typography>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>{form.gender}</Typography>
                      </Grid>
                      {/* State | City */}
                      <Grid item xs={6}>
                        <Typography variant="subtitle2" sx={{ fontSize: 13 }}>State</Typography>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>{form.state}</Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="subtitle2" sx={{ fontSize: 13 }}>City</Typography>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>{form.city}</Typography>
                      </Grid>
                      {/* About/Bio */}
                      <Grid item xs={12}>
                        <Typography variant="subtitle2" sx={{ fontSize: 13 }}>About/Bio</Typography>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>{form.bio}</Typography>
                      </Grid>
                      {/* LinkedIn */}
                      <Grid item xs={12}>
                        <Typography variant="subtitle2" sx={{ fontSize: 13 }}>LinkedIn</Typography>
                        <Typography variant="body2" sx={{ fontWeight: 500, wordBreak: 'break-all' }}>{form.linkedin}</Typography>
                      </Grid>
                      {/* GitHub */}
                      <Grid item xs={12}>
                        <Typography variant="subtitle2" sx={{ fontSize: 13 }}>GitHub</Typography>
                        <Typography variant="body2" sx={{ fontWeight: 500, wordBreak: 'break-all' }}>{form.github}</Typography>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Box>
            </Box>
          </Box>

          {/* Edit Modal */}
          <Dialog open={editOpen} onClose={handleEditClose} maxWidth="sm" fullWidth>
            <DialogTitle>Edit Profile</DialogTitle>
            <DialogContent>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}><TextField label="First Name" name="firstName" value={editForm.firstName} onChange={handleEditFormChange} fullWidth /></Grid>
                <Grid item xs={12} sm={6}><TextField label="Last Name" name="lastName" value={editForm.lastName} onChange={handleEditFormChange} fullWidth /></Grid>
                <Grid item xs={12} sm={6}><TextField label="Email" name="email" value={editForm.email} onChange={handleEditFormChange} fullWidth /></Grid>
                <Grid item xs={12} sm={6}><TextField label="Phone" name="phone" value={editForm.phone} onChange={handleEditFormChange} fullWidth /></Grid>
                <Grid item xs={12} sm={6}><TextField label="Gender" name="gender" value={editForm.gender} onChange={handleEditFormChange} fullWidth /></Grid>
                <Grid item xs={12} sm={6}><TextField label="State" name="state" value={editForm.state} onChange={handleEditFormChange} fullWidth /></Grid>
                <Grid item xs={12} sm={6}><TextField label="City" name="city" value={editForm.city} onChange={handleEditFormChange} fullWidth /></Grid>
                <Grid item xs={12} sm={12}><TextField label="About/Bio" name="bio" value={editForm.bio} onChange={handleEditFormChange} fullWidth multiline rows={2} /></Grid>
                <Grid item xs={12} sm={6}><TextField label="LinkedIn" name="linkedin" value={editForm.linkedin} onChange={handleEditFormChange} fullWidth /></Grid>
                <Grid item xs={12} sm={6}><TextField label="GitHub" name="github" value={editForm.github} onChange={handleEditFormChange} fullWidth /></Grid>
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleEditClose}>Cancel</Button>
              <Button onClick={handleFormSubmit} variant="contained">Save</Button>
            </DialogActions>
          </Dialog>
        </Box>
      </Box>
    </Box>
  );
}