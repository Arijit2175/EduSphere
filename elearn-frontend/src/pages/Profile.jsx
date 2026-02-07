import React from "react";
import { Box, Grid, Card, CardContent, Typography, Button, Stack, Chip, Avatar, Dialog, DialogTitle, DialogContent, DialogActions, TextField, IconButton, Divider, Tooltip } from "@mui/material";
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import EditIcon from '@mui/icons-material/Edit';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import GitHubIcon from '@mui/icons-material/GitHub';
import PhoneIcon from '@mui/icons-material/Phone';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import EmailIcon from '@mui/icons-material/Email';
import PersonIcon from '@mui/icons-material/Person';
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import PageHeader from "../components/PageHeader";
import Iridescence from "../components/Iridescence";
import { useAuth } from "../contexts/AuthContext";
import { useSidebar } from "../contexts/SidebarContext";

function InfoItem({ label, value, icon }) {
  return (
    <Box sx={{ space: 1 }}>
      <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 0.5 }}>
        {label}
      </Typography>
      <Typography variant="body2" sx={{ fontWeight: 500, display: 'flex', alignItems: 'center', gap: 1 }}>
        {icon}
        {value || "Not provided"}
      </Typography>
    </Box>
  );
}

function SocialLink({ icon, label, value, baseUrl }) {
  if (!value) {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'text.secondary' }}>
        {icon}
        <Typography variant="caption">{label}: Not provided</Typography>
      </Box>
    );
  }
  const url = value.startsWith("http") ? value : `${baseUrl}${value}`;
  return (
    <Box
      component="a"
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      sx={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 1.5,
        px: 2,
        py: 1,
        borderRadius: 2,
        backgroundColor: 'action.hover',
        transition: 'all 0.3s ease',
        textDecoration: 'none',
        color: 'text.primary',
        '&:hover': {
          backgroundColor: 'primary.main',
          color: 'primary.contrastText',
        }
      }}
    >
      {icon}
      <Typography variant="body2" sx={{ fontWeight: 500 }}>{value}</Typography>
    </Box>
  );
}

export default function Profile() {
  const { user, updateUser: updateUserRaw } = useAuth();
  const updateUser = updateUserRaw || (() => {});
  const [avatar, setAvatar] = React.useState(user?.avatar || null);
  const { isOpen } = useSidebar();
  const displayName = user?.name || `${user?.first_name || ""} ${user?.last_name || ""}`.trim() || "Learner";

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
    countryCode: user?.countryCode || "+91",
  });

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

  const [editForm, setEditForm] = React.useState(form);

  React.useEffect(() => {
    setEditForm(form);
  }, [form, user]);

  const handleEditOpen = () => {
    setEditForm(form);
    setEditOpen(true);
  };

  const handleEditClose = () => setEditOpen(false);

  const handleEditFormChange = (e) => {
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
          background: "transparent",
          transition: "margin-left 0.3s ease",
          display: "flex",
          flexDirection: "column",
          p: 0,
          m: 0,
          position: "relative",
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            zIndex: 0,
          }}
        >
          <Iridescence
            color={[0.4, 0.3, 0.7]}
            mouseReact
            amplitude={0.1}
            speed={1}
          />
        </Box>
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            zIndex: 1,
            background: "linear-gradient(180deg, rgba(245,247,250,0.18) 0%, rgba(195,207,226,0.28) 100%)",
            pointerEvents: "none",
          }}
        />
        <Navbar />
        <Box sx={{ flex: 1, display: "flex", flexDirection: "column", p: 0, m: 0, overflowY: 'auto', position: "relative", zIndex: 2 }}>
          <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', py: 4, px: 2 }}>

            {/* Profile Header Card */}
            <Card 
              sx={{ 
                width: '100%', 
                maxWidth: 700, 
                borderRadius: 3, 
                boxShadow: 3, 
                mb: 3,
                background: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(10px)',
                transition: 'all 0.3s ease',
                '&:hover': {
                  boxShadow: 4,
                }
              }}
            >
              <CardContent sx={{ pt: 4, pb: 3 }}>
                <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, alignItems: { xs: 'center', sm: 'flex-start' }, gap: 3 }}>
                  {/* Avatar Section */}
                  <Box sx={{ position: 'relative', display: 'flex', justifyContent: 'center' }}>
                    <label htmlFor="profile-avatar-upload" style={{ position: 'relative', cursor: 'pointer' }}>
                      <input
                        id="profile-avatar-upload"
                        type="file"
                        accept="image/*"
                        style={{ display: 'none' }}
                        onChange={handleAvatarChange}
                      />
                      <Tooltip title="Change profile picture">
                        <Box
                          sx={{
                            position: 'relative',
                            transition: 'transform 0.3s ease',
                            '&:hover': { transform: 'scale(1.05)' }
                          }}
                        >
                          <Avatar
                            src={avatar || undefined}
                            sx={{
                              width: 100,
                              height: 100,
                              fontSize: 40,
                              border: '4px solid #fff',
                              boxShadow: 3,
                              cursor: 'pointer',
                              position: 'relative',
                              bgcolor: 'primary.main'
                            }}
                            alt={displayName}
                          >
                            {(!avatar && displayName) ? displayName.slice(0, 1).toUpperCase() : ''}
                          </Avatar>
                          <Box 
                            sx={{ 
                              position: 'absolute', 
                              bottom: 0, 
                              right: 0, 
                              bgcolor: 'white', 
                              borderRadius: '50%', 
                              p: '8px',
                              boxShadow: 2,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              transition: 'all 0.3s ease',
                            }}
                          >
                            <PhotoCameraIcon sx={{ fontSize: 20, color: 'primary.main' }} />
                          </Box>
                        </Box>
                      </Tooltip>
                    </label>
                  </Box>

                  {/* Name and Info Section */}
                  <Box sx={{ flex: 1, textAlign: { xs: 'center', sm: 'left' } }}>
                    <Typography variant="h5" sx={{ fontWeight: 700, mb: 0.5 }}>
                      {displayName}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary', display: 'flex', alignItems: 'center', gap: 1, justifyContent: { xs: 'center', sm: 'flex-start' }, mb: 1 }}>
                      <EmailIcon sx={{ fontSize: 18 }} />
                      {form.email}
                    </Typography>
                    {user?.role && (
                      <Chip 
                        label={user.role} 
                        size="small" 
                        sx={{ mt: 1 }}
                        variant="outlined"
                      />
                    )}
                  </Box>

                  {/* Edit Button */}
                  <Button 
                    onClick={handleEditOpen} 
                    variant="contained" 
                    sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 600, gap: 1 }}
                    startIcon={<EditIcon />}
                  >
                    Edit Profile
                  </Button>
                </Box>
              </CardContent>
            </Card>

            {/* Details Card */}
            <Card 
              sx={{ 
                width: '100%', 
                maxWidth: 700, 
                borderRadius: 3, 
                boxShadow: 2,
                background: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(10px)',
                transition: 'all 0.3s ease',
                '&:hover': {
                  boxShadow: 3,
                }
              }}
            >
              <CardContent sx={{ p: 4 }}>
                {/* About Me Section */}
                <Box sx={{ mb: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                    <PersonIcon sx={{ color: 'primary.main', fontSize: 24 }} />
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      About Me
                    </Typography>
                  </Box>
                  <Typography variant="body2" sx={{ color: 'text.secondary', pl: 4, lineHeight: 1.6 }}>
                    {form.bio || "No bio provided."}
                  </Typography>
                </Box>

                <Divider sx={{ my: 3 }} />

                {/* Personal Details Section */}
                <Box sx={{ mb: 3 }}>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                    Personal Details
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <InfoItem label="First Name" value={form.first_name} />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <InfoItem label="Last Name" value={form.last_name} />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <InfoItem 
                        label="Phone" 
                        value={form.phone ? `${form.countryCode} ${form.phone}` : undefined}
                        icon={<PhoneIcon sx={{ fontSize: 18 }} />}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <InfoItem 
                        label="Gender" 
                        value={form.gender ? form.gender.charAt(0).toUpperCase() + form.gender.slice(1) : undefined}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <InfoItem 
                        label="State" 
                        value={form.state}
                        icon={<LocationOnIcon sx={{ fontSize: 18 }} />}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <InfoItem label="City" value={form.city} />
                    </Grid>
                  </Grid>
                </Box>

                <Divider sx={{ my: 3 }} />

                {/* Social Links Section */}
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                    Social Links
                  </Typography>
                  <Stack direction="row" spacing={2} sx={{ flexWrap: 'wrap' }}>
                    <SocialLink 
                      icon={<LinkedInIcon sx={{ fontSize: 20 }} />}
                      label="LinkedIn" 
                      value={form.linkedin} 
                      baseUrl="https://linkedin.com/in/" 
                    />
                    <SocialLink 
                      icon={<GitHubIcon sx={{ fontSize: 20 }} />}
                      label="GitHub" 
                      value={form.github} 
                      baseUrl="https://github.com/" 
                    />
                  </Stack>
                </Box>
              </CardContent>
            </Card>

          </Box>
        </Box>
      </Box>

      {/* Edit Dialog */}
      <Dialog open={editOpen} onClose={handleEditClose} maxWidth="md" fullWidth PaperProps={{ sx: { borderRadius: 3, boxShadow: "0 24px 80px rgba(0, 0, 0, 0.12)" } }}>
        <DialogTitle sx={{ fontWeight: 700, fontSize: "1.2rem", pb: 1 }}>Edit Profile</DialogTitle>
        <DialogContent sx={{ pt: 1, pb: 0, maxHeight: "90vh", overflowY: "auto" }}>
          <Box sx={{ display: "grid", gap: 2, py: 1 }}>
            <Box sx={{ display: "grid", gap: 2, gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" } }}>
              <TextField
                label="First Name"
                name="firstName"
                value={editForm.first_name}
                onChange={handleEditFormChange}
                fullWidth
                variant="outlined"
                size="small"
              />
              <TextField
                label="Last Name"
                name="lastName"
                value={editForm.last_name}
                onChange={handleEditFormChange}
                fullWidth
                variant="outlined"
                size="small"
              />
            </Box>

            <TextField
              label="Email"
              name="email"
              value={editForm.email}
              onChange={handleEditFormChange}
              fullWidth
              variant="outlined"
              size="small"
              type="email"
            />

            <Box sx={{ display: "grid", gap: 2, gridTemplateColumns: { xs: "1fr", sm: "1fr 2fr" } }}>
              <TextField
                select
                label="Country Code"
                name="countryCode"
                value={editForm.countryCode || "+91"}
                onChange={(e) => setEditForm({ ...editForm, countryCode: e.target.value })}
                fullWidth
                variant="outlined"
                size="small"
                SelectProps={{ native: true }}
              >
                <option value="+1">+1 US</option>
                <option value="+44">+44 UK</option>
                <option value="+91">+91 IN</option>
                <option value="+61">+61 AU</option>
                <option value="+81">+81 JP</option>
                <option value="+49">+49 DE</option>
              </TextField>
              <TextField
                label="Phone"
                name="phone"
                value={editForm.phone}
                onChange={handleEditFormChange}
                fullWidth
                variant="outlined"
                size="small"
              />
            </Box>

            <Box sx={{ display: "grid", gap: 2, gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" } }}>
              <TextField
                select
                label="Gender"
                name="gender"
                value={editForm.gender}
                onChange={handleEditFormChange}
                fullWidth
                variant="outlined"
                size="small"
                SelectProps={{ native: true }}
                InputLabelProps={{ shrink: true }}
              >
                <option value="">Select</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </TextField>
            </Box>

            <Box sx={{ display: "grid", gap: 2, gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" } }}>
              <TextField
                label="State"
                name="state"
                value={editForm.state}
                onChange={handleEditFormChange}
                fullWidth
                variant="outlined"
                size="small"
              />
              <TextField
                label="City"
                name="city"
                value={editForm.city}
                onChange={handleEditFormChange}
                fullWidth
                variant="outlined"
                size="small"
              />
            </Box>

            <Box sx={{ display: "grid", gap: 2, gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" } }}>
              <TextField
                label="LinkedIn"
                name="linkedin"
                value={editForm.linkedin}
                onChange={handleEditFormChange}
                fullWidth
                variant="outlined"
                size="small"
                placeholder="username"
              />
              <TextField
                label="GitHub"
                name="github"
                value={editForm.github}
                onChange={handleEditFormChange}
                fullWidth
                variant="outlined"
                size="small"
                placeholder="username"
              />
            </Box>

            <Box sx={{ width: "100%", maxWidth: 640 }}>
              <TextField
                label="About / Bio"
                name="bio"
                value={editForm.bio}
                onChange={handleEditFormChange}
                fullWidth
                multiline
                minRows={3}
                maxRows={4}
                variant="outlined"
                placeholder="Tell us about yourself..."
                sx={{
                  "& textarea": {
                    resize: "vertical",
                    minHeight: 84,
                    maxHeight: 140,
                  }
                }}
              />
            </Box>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2, pt: 1, gap: 1 }}>
          <Button onClick={handleEditClose} variant="outlined">Cancel</Button>
          <Button onClick={handleFormSubmit} variant="contained">Save Changes</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}