import { Drawer, List, ListItem, ListItemText } from "@mui/material";
import { Link } from "react-router-dom";

export default function Sidebar() {
  return (
    <Drawer variant="permanent" anchor="left">
      <List sx={{ width: 200, mt: 8 }}>
        <ListItem button component={Link} to="/dashboard">
          <ListItemText primary="Dashboard" />
        </ListItem>
        <ListItem button component={Link} to="/formal">
          <ListItemText primary="Formal Learning" />
        </ListItem>
        <ListItem button component={Link} to="/nonformal">
          <ListItemText primary="Non-Formal Learning" />
        </ListItem>
        <ListItem button component={Link} to="/informal">
          <ListItemText primary="Informal Learning" />
        </ListItem>
        <ListItem button component={Link} to="/ai">
          <ListItemText primary="AI Tutor" />
        </ListItem>
      </List>
    </Drawer>
  );
}
