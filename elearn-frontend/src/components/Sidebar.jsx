import { useSidebar } from "../contexts/SidebarContext";
import {
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  IconButton,
  Box,
  Typography,
  Avatar,
  Fade,
  Slide,
} from "@mui/material";
import { useLocation } from "react-router-dom";
import {
  Menu,
  Close,
  Dashboard,
  School,
  MenuBook,
  Groups,
  SchoolOutlined,
  SmartToy,
  Code,
} from "@mui/icons-material";
  // (removed duplicate import)
import { useAuth } from "../contexts/AuthContext";

function Sidebar() {
  const { user } = useAuth();
  const location = useLocation();
  const { isOpen, setIsOpen } = useSidebar();
  const drawerWidth = 260;

  // Build links as before, but keep icons as MUI icons
  const links = [
    { to: "/dashboard", label: "Dashboard", icon: Dashboard },
    { to: "/formal", label: "Classes", icon: School },
    // Non-formal only for students
    ...(user?.role === "teacher" ? [] : [{ to: "/nonformal", label: "Courses", icon: MenuBook }]),
    { to: "/informal", label: "Community", icon: Groups },
    { to: "/ai", label: "Lumina", icon: SmartToy },
    { to: "/codehub", label: "CodeHub", icon: Code },
  ];

  return (
    <>
      {/* Floating open button when closed */}
      <Fade in={!isOpen}>
        <IconButton
          onClick={() => setIsOpen(true)}
          sx={{
            position: "fixed",
            left: 16,
            top: 8,
            zIndex: 1300,
            bgcolor: "#667eea",
            color: "#fff",
            borderRadius: "12px",
            boxShadow: 3,
            p: 1.5,
            "&:hover": {
              bgcolor: "#5a6fd6",
              transform: "scale(1.05)",
            },
            transition: "all 0.2s ease-out",
          }}
        >
          <Menu />
        </IconButton>
      </Fade>

      <Drawer
        variant="permanent"
        anchor="left"
        sx={{
          width: isOpen ? drawerWidth : 0,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: isOpen ? drawerWidth : 0,
            boxSizing: "border-box",
            transition:
              "width 0.8s cubic-bezier(0.22, 1, 0.36, 1), padding 0.8s cubic-bezier(0.22, 1, 0.36, 1)",
            overflowX: "hidden",
            borderTopRightRadius: 0,
            borderBottomRightRadius: "24px",
            borderTopLeftRadius: 0,
            borderBottomLeftRadius: 0,
            margin: 0,
            minHeight: "100vh",
            background: "#fff",
            boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            p: isOpen ? 2 : 0,
          },
        }}
      >
        {/* Top: Logo and Close */}
        <Fade in={isOpen} timeout={400}>
          <Box sx={{ display: "flex", alignItems: "center", mb: 2, mt: 1 }}>
            <Box
              sx={{
                bgcolor: "#667eea",
                borderRadius: "12px",
                p: 1,
                mr: 1,
                display: "flex",
                alignItems: "center",
                transition: "transform 0.3s ease",
                "&:hover": {
                  transform: "scale(1.1)",
                },
              }}
            >
              <svg
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M12 3L2 8.5L12 14L22 8.5L12 3Z" fill="#fff" />
                <path
                  d="M2 8.5V10.5C2 15.1944 6.02944 19 12 19C17.9706 19 22 15.1944 22 10.5V8.5"
                  stroke="#fff"
                  strokeWidth="2"
                  strokeLinejoin="round"
                />
              </svg>
            </Box>
            <Typography
              variant="h6"
              sx={{
                flexGrow: 1,
                fontWeight: 700,
                color: "#667eea",
                letterSpacing: 1,
              }}
            >
              EduSphere
            </Typography>
            <IconButton
              onClick={() => setIsOpen(false)}
              sx={{
                ml: 1,
                color: "grey.500",
                transition: "all 0.2s ease",
                "&:hover": {
                  color: "#667eea",
                  bgcolor: "rgba(102,126,234,0.1)",
                },
                "&:active": {
                  transform: "scale(0.95)",
                },
              }}
            >
              <Close />
            </IconButton>
          </Box>
        </Fade>

        {/* Navigation */}
        <List sx={{ flexGrow: 1 }}>
          {links.map((item, index) => {
            const isActive = location.pathname === item.to;
            const Icon = item.icon;

            return (
              <Slide
                key={item.to}
                direction="right"
                in={isOpen}
                timeout={300 + index * 50}
              >
                <ListItemButton
                  component="a"
                  href={item.to}
                  sx={{
                    cursor: "pointer",
                    borderRadius: 2,
                    mb: 1,
                    position: "relative",
                    border: isActive ? "2px solid #667eea" : "2px solid transparent",
                    background: isActive
                      ? "rgba(102,126,234,0.08)"
                      : "transparent",
                    "&:hover": {
                      background: "rgba(102,126,234,0.06)",
                    },
                    transition: "all 0.2s ease-out",
                    textDecoration: "none",
                    overflow: "hidden",
                  }}
                  selected={isActive}
                >
                  <ListItemIcon
                    sx={{
                      color: "#667eea",
                      minWidth: 36,
                      transition: "transform 0.2s ease",
                      transform: isActive ? "scale(1.1)" : "scale(1)",
                    }}
                  >
                    <Icon />
                  </ListItemIcon>
                  <ListItemText
                    primary={item.label}
                    sx={{
                      "& .MuiListItemText-primary": {
                        fontWeight: isActive ? 600 : 500,
                        color: isActive ? "#667eea" : "grey.700",
                        transition: "all 0.2s ease",
                      },
                    }}
                  />
                  {/* Active indicator */}
                  <Box
                    sx={{
                      position: "absolute",
                      right: 8,
                      top: "50%",
                      transform: "translateY(-50%)",
                      width: 4,
                      height: isActive ? 20 : 0,
                      borderRadius: 2,
                      bgcolor: "#667eea",
                      opacity: isActive ? 1 : 0,
                      transition: "all 0.3s ease-out",
                    }}
                  />
                </ListItemButton>
              </Slide>
            );
          })}
        </List>

        {/* Bottom: User Name */}
        <Fade in={isOpen} timeout={600}>
          <Box
            sx={{
              background: "linear-gradient(90deg, #f3f4f6 0%, #fff 100%)",
              borderRadius: 3,
              p: 2,
              display: "flex",
              alignItems: "center",
              mt: 2,
              minHeight: 56,
              transition: "all 0.3s ease",
              "&:hover": {
                boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
              },
            }}
          >
            <Avatar
              sx={{
                width: 40,
                height: 40,
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                mr: 1.5,
                fontSize: "0.9rem",
                fontWeight: 600,
                transition: "transform 0.2s ease",
                "&:hover": {
                  transform: "scale(1.05)",
                },
              }}
            >
              {(user?.firstName || user?.name || 'U').charAt(0).toUpperCase()}
            </Avatar>
            <Typography fontWeight={600} sx={{ color: "#667eea" }}>
              {user?.firstName || user?.name || 'User'}
            </Typography>
          </Box>
        </Fade>
      </Drawer>
    </>
  );
}

export default Sidebar;