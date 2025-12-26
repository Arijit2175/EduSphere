import React from "react";
import { Box, Grid, Card, CardContent, Typography, Button, Stack, Chip, Avatar, Dialog, DialogTitle, DialogContent, DialogActions, TextField, IconButton, Divider, Tooltip } from "@mui/material";
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import EditIcon from '@mui/icons-material/Edit';
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import PageHeader from "../components/PageHeader";
import { useAuth } from "../contexts/AuthContext";
import { useSidebar } from "../contexts/SidebarContext";



export default function Profile() {
  const { user, updateUser: updateUserRaw } = useAuth();
  const updateUser = updateUserRaw || (() => {});
  // Avatar state is synced with user context
  const [avatar, setAvatar] = React.useState(user?.avatar || null);
  const { isOpen } = useSidebar();
  const displayName = user?.name || `${user?.first_name || ""} ${user?.last_name || ""}`.trim() || "Learner";

  // Form state is only updated when Save is clicked
  const [editOpen, setEditOpen] = React.useState(false);
  const [form, setForm] = React.useState({
    first_name: user?.first_name || "",
    last_name: user?.last_name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    gender: user?.gender || "",
    state: user?.state || "",
    city: user?.city || "",
    bio: user?.bio || "",
    linkedin: user?.linkedin || "",
    github: user?.github || "",
    avatar: user?.avatar || null,
  });
  // Handle avatar upload
  const handleAvatarChange = (fileOrBase64) => {
    if (typeof fileOrBase64 === 'string') {
      setAvatar(fileOrBase64);
      setForm((prev) => ({ ...prev, avatar: fileOrBase64 }));
      updateUser({ avatar: fileOrBase64 });
    } else if (fileOrBase64 && fileOrBase64.target && fileOrBase64.target.files && fileOrBase64.target.files[0]) {
      const file = fileOrBase64.target.files[0];
      if (file && file.type.startsWith('image/')) {
        const reader = new window.FileReader();
        reader.onloadend = () => {
          setAvatar(reader.result);
          setForm((prev) => ({ ...prev, avatar: reader.result }));
          updateUser({ avatar: reader.result });
        };
        reader.readAsDataURL(file);
      }
    }
  };

  // Temp state for editing
  const [editForm, setEditForm] = React.useState(form);

  // Keep editForm in sync with form/user when opening the edit dialog
  React.useEffect(() => {
    setEditForm(form);
  }, [form, user]);

  const handleEditOpen = () => {
    setEditForm(form); // Start editing with current values
    setEditOpen(true);
  };
  const handleEditClose = () => setEditOpen(false);
  const handleEditFormChange = (e) => {
    // Map camelCase to snake_case for first_name and last_name
    let { name, value } = e.target;
    if (name === "firstName") name = "first_name";
    if (name === "lastName") name = "last_name";
    setEditForm({ ...editForm, [name]: value });
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

        {/* GeeksforGeeks-style Profile Layout */}
        <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 4 }}>
          {/* Top Card: Avatar, Name, Email, Edit */}
          <Card sx={{ width: '100%', maxWidth: 700, borderRadius: 3, boxShadow: 3, mb: 2, p: 0, overflow: 'visible', position: 'relative' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', p: 3, pb: 2 }}>
              <label htmlFor="profile-avatar-upload" style={{ position: 'relative', marginRight: 24 }}>
                <input
                  id="profile-avatar-upload"
                  type="file"
                  accept="image/*"
                  style={{ display: 'none' }}
                  onChange={handleAvatarChange}
                />
                <Tooltip title="Change profile picture">
                  <span>
                    <Avatar
                      src={avatar || undefined}
                      sx={{ bgcolor: '#667eea', width: 90, height: 90, fontSize: 40, border: '4px solid #fff', boxShadow: 2, cursor: 'pointer', position: 'relative' }}
                      alt={displayName}
                    >
                      {(!avatar && displayName) ? displayName.slice(0, 1).toUpperCase() : ''}
                    </Avatar>
                    <Box sx={{ position: 'absolute', bottom: 6, right: 6, bgcolor: 'white', borderRadius: '50%', p: '2px', boxShadow: 1 }}>
                      <PhotoCameraIcon sx={{ fontSize: 20, color: '#667eea' }} />
                    </Box>
                  </span>
                </Tooltip>
              </label>
              <Box sx={{ flex: 1 }}>
                <Typography variant="h5" sx={{ fontWeight: 700 }}>{displayName}</Typography>
                <Typography variant="body1" sx={{ color: '#6b7280', fontSize: 15 }}>{form.email}</Typography>
                {user?.role && <Chip label={user.role} size="small" sx={{ mt: 1 }} />}
              </Box>
              <Button onClick={handleEditOpen} variant="contained" sx={{ ml: 2, borderRadius: 2, textTransform: 'none', fontWeight: 600 }} startIcon={<EditIcon />}>Edit</Button>
            </Box>
          </Card>

          {/* Details Card: Vertical, Sectioned */}
          <Card sx={{ width: '100%', maxWidth: 700, borderRadius: 3, boxShadow: 2, p: 0 }}>
            <CardContent sx={{ p: 3 }}>
              {/* About Me Section */}
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 1, color: '#333' }}>About Me</Typography>
              <Box sx={{ mb: 2, ml: 1 }}>
                <Typography variant="body2" sx={{ color: '#444' }}>{form.bio || 'No bio provided.'}</Typography>
              </Box>
              <Divider sx={{ mb: 2 }} />

              {/* Details Grid */}
              <Grid container spacing={2} sx={{ mb: 2 }}>
                {/* First Name & Last Name */}
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" sx={{ color: '#666' }}>First Name</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>{form.first_name}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" sx={{ color: '#666' }}>Last Name</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>{form.last_name}</Typography>
                </Grid>
                {/* Country Code, Phone & Gender */}
                <Grid item xs={12} sm={4}>
                  <Typography variant="subtitle2" sx={{ color: '#666' }}>Country Code</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>{form.countryCode || '+91'}</Typography>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Typography variant="subtitle2" sx={{ color: '#666' }}>Phone</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>{form.phone}</Typography>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Typography variant="subtitle2" sx={{ color: '#666' }}>Gender</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>{form.gender}</Typography>
                </Grid>
                {/* State & City */}
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" sx={{ color: '#666' }}>State</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>{form.state}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" sx={{ color: '#666' }}>City</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>{form.city}</Typography>
                </Grid>
              </Grid>

              {/* Links Section */}
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 1, color: '#333' }}>Links</Typography>
              <Box sx={{ mb: 2, ml: 1, display: 'flex', flexDirection: 'row', gap: 4, alignItems: 'center' }}>
                <Typography variant="subtitle2" sx={{ color: '#666' }}>LinkedIn</Typography>
                {form.linkedin ? (
                  <a
                    href={form.linkedin.startsWith('http') ? form.linkedin : `https://www.linkedin.com/in/${form.linkedin}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: '#1976d2', textDecoration: 'underline', wordBreak: 'break-all', fontWeight: 500 }}
                  >
                    {form.linkedin}
                  </a>
                ) : (
                  <Typography variant="body2" sx={{ fontWeight: 500, wordBreak: 'break-all' }}>Not provided</Typography>
                )}
                <Typography variant="subtitle2" sx={{ color: '#666' }}>GitHub</Typography>
                {form.github ? (
                  <a
                    href={form.github.startsWith('http') ? form.github : `https://github.com/${form.github}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: '#1976d2', textDecoration: 'underline', wordBreak: 'break-all', fontWeight: 500 }}
                  >
                    {form.github}
                  </a>
                ) : (
                  <Typography variant="body2" sx={{ fontWeight: 500, wordBreak: 'break-all' }}>Not provided</Typography>
                )}
              </Box>
            </CardContent>
          </Card>
        </Box>


          {/* Edit Modal */}
          <Dialog open={editOpen} onClose={handleEditClose} maxWidth="md" fullWidth PaperProps={{ sx: { minHeight: 520 } }}>
            <DialogTitle>Edit Profile</DialogTitle>
            <DialogContent sx={{ minHeight: 400, mt: 3 }}>
              <Grid container spacing={3} sx={{ mt: 2 }}>
                <Grid item xs={12} sm={6}><TextField label="First Name" name="firstName" value={editForm.first_name} onChange={handleEditFormChange} fullWidth /></Grid>
                <Grid item xs={12} sm={6}><TextField label="Last Name" name="lastName" value={editForm.last_name} onChange={handleEditFormChange} fullWidth /></Grid>
                <Grid item xs={12} sm={6}><TextField label="Email" name="email" value={editForm.email} onChange={handleEditFormChange} fullWidth /></Grid>
                <Grid item xs={6} sm={3}>
                  <TextField
                    select
                    label="Country Code"
                    name="countryCode"
                    value={editForm.countryCode || '+91'}
                    onChange={e => setEditForm({ ...editForm, countryCode: e.target.value })}
                    fullWidth
                    SelectProps={{ native: true }}
                  >
                    <option value="+1">+1 US</option>
                    <option value="+44">+44 UK</option>
                    <option value="+91">+91 IN</option>
                    <option value="+61">+61 AU</option>
                    <option value="+81">+81 JP</option>
                    <option value="+49">+49 DE</option>
                    <option value="+86">+86 CN</option>
                    <option value="+971">+971 AE</option>
                    <option value="+880">+880 BD</option>
                    <option value="+92">+92 PK</option>
                    <option value="+7">+7 RU</option>
                    <option value="+33">+33 FR</option>
                    <option value="+39">+39 IT</option>
                    <option value="+34">+34 ES</option>
                    <option value="+62">+62 ID</option>
                    <option value="+63">+63 PH</option>
                    <option value="+234">+234 NG</option>
                    <option value="+55">+55 BR</option>
                    <option value="+20">+20 EG</option>
                    <option value="+27">+27 ZA</option>
                  </TextField>
                </Grid>
                <Grid item xs={6} sm={3}><TextField label="Phone" name="phone" value={editForm.phone} onChange={handleEditFormChange} fullWidth /></Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    select
                    label="Gender"
                    name="gender"
                    value={editForm.gender}
                    onChange={handleEditFormChange}
                    fullWidth
                    SelectProps={{ native: true }}
                    InputLabelProps={{ shrink: true }}
                  >
                    <option value="">Select</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </TextField>
                </Grid>
                <Grid item xs={12} sm={6}><TextField label="State" name="state" value={editForm.state} onChange={handleEditFormChange} fullWidth /></Grid>
                <Grid item xs={12} sm={6}><TextField label="City" name="city" value={editForm.city} onChange={handleEditFormChange} fullWidth /></Grid>
                <Grid item xs={12} sm={6}><TextField label="GitHub" name="github" value={editForm.github} onChange={handleEditFormChange} fullWidth /></Grid>
                <Grid item xs={12} sm={6}><TextField label="LinkedIn" name="linkedin" value={editForm.linkedin} onChange={handleEditFormChange} fullWidth /></Grid>
                <Grid item xs={12}>
                  <TextField
                    label="About/Bio"
                    name="bio"
                    value={editForm.bio}
                    onChange={handleEditFormChange}
                    fullWidth
                    multiline
                    minRows={3}
                    maxRows={6}
                  />
                </Grid>
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