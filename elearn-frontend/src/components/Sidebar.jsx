import { Drawer, List, ListItem, ListItemText, IconButton, Box } from "@mui/material";
import { Link } from "react-router-dom";
import { Menu } from "@mui/icons-material";
import { useSidebar } from "../contexts/SidebarContext";

export default function Sidebar() {
  const { isOpen, toggleSidebar } = useSidebar();

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
          mt: 8,
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
        <ListItem button component={Link} to="/dashboard" title="Dashboard">
          <ListItemText 
            primary="Dashboard"
            sx={{
              opacity: isOpen ? 1 : 0,
              transition: "opacity 0.3s ease",
            }}
          />
        </ListItem>
        <ListItem button component={Link} to="/formal" title="Formal Learning">
          <ListItemText 
            primary="Formal Learning"
            sx={{
              opacity: isOpen ? 1 : 0,
              transition: "opacity 0.3s ease",
            }}
          />
        </ListItem>
        <ListItem button component={Link} to="/nonformal" title="Non-Formal Learning">
          <ListItemText 
            primary="Non-Formal Learning"
            sx={{
              opacity: isOpen ? 1 : 0,
              transition: "opacity 0.3s ease",
            }}
          />
        </ListItem>
        <ListItem button component={Link} to="/informal" title="Informal Learning">
          <ListItemText 
            primary="Informal Learning"
            sx={{
              opacity: isOpen ? 1 : 0,
              transition: "opacity 0.3s ease",
            }}
          />
        </ListItem>
        <ListItem button component={Link} to="/ai" title="AI Tutor">
          <ListItemText 
            primary="AI Tutor"
            sx={{
              opacity: isOpen ? 1 : 0,
              transition: "opacity 0.3s ease",
            }}
          />
        </ListItem>
      </List>
    </Drawer>
  );
}
