import { Drawer, List, ListItem, ListItemText } from "@mui/material";

export default function Sidebar() {
  return (
    <Drawer variant="permanent" anchor="left">
      <List sx={{ width: 200, mt: 8 }}>
        <ListItem button component="a" href="/dashboard">
          <ListItemText primary="Dashboard" />
        </ListItem>
        <ListItem button component="a" href="/formal">
          <ListItemText primary="Formal Learning" />
        </ListItem>
        <ListItem button component="a" href="/nonformal">
          <ListItemText primary="Non-Formal Learning" />
        </ListItem>
        <ListItem button component="a" href="/informal">
          <ListItemText primary="Informal Learning" />
        </ListItem>
        <ListItem button component="a" href="/ai">
          <ListItemText primary="AI Tutor" />
        </ListItem>
      </List>
    </Drawer>
  );
}
