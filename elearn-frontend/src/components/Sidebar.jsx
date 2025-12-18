import { Drawer, List, ListItem, ListItemText, IconButton, Box } from "@mui/material";
import { Link } from "react-router-dom";
import { Menu } from "@mui/icons-material";
import { useSidebar } from "../contexts/SidebarContext";
import { useAuth } from "../contexts/AuthContext";

export default function Sidebar() {
  const { isOpen, toggleSidebar } = useSidebar();
  const { user } = useAuth();

  const links = [
    { to: "/dashboard", label: "Dashboard" },
    { to: "/formal", label: "Formal Learning" },
    // Non-formal only for students
    ...(user?.role === "teacher" ? [] : [{ to: "/nonformal", label: "Non-Formal Learning" }]),
    { to: "/informal", label: "Informal Learning" },
    { to: "/ai", label: "AI Tutor" },
  ];

  return (
    <Drawer 
      variant="permanent" 
      anchor="left"
      sx={{
        width: isOpen ? 200 : 70,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: isOpen ? 200 : 70,
          boxSizing: "border-box",
          transition: "width 0.3s ease",
          overflowX: "hidden",
        },
      }}
    >
      {/* Hamburger Menu Button - Centered */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          p: 1,
          mt: 1,
          minHeight: 50,
        }}
      >
        <IconButton
          onClick={toggleSidebar}
          size="small"
          sx={{
            color: "#667eea",
            "&:hover": {
              background: "#667eea20",
            },
          }}
        >
          <Menu />
        </IconButton>
      </Box>

      {/* Navigation Items */}
      <List sx={{ mt: 2 }}>
        {links.map((item) => (
          <ListItem key={item.to} component={Link} to={item.to} title={item.label} sx={{ cursor: "pointer" }}>
            <ListItemText
              primary={item.label}
              sx={{
                opacity: isOpen ? 1 : 0,
                transition: "opacity 0.3s ease",
              }}
            />
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
}
