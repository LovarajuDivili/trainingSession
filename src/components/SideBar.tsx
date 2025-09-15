import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
} from "@mui/material";

const sidebarItems = [
  { label: "All Employees" },
  { label: "Developers" },
  { label: "Testers" },
  { label: "AWS Team" },
  { label: "Projects" },
  { label: "Statistics" },
  { label: "Logs" },
];

const Sidebar = () => {
  return (
    <Box
      sx={{
        width: 240,
        height: "100vh",
        bgcolor: "white",
        borderRight: "1px solid #ddd",
        position: "fixed",
        top: 50,
        left: -7,
      }}
    >
      <List>
        {sidebarItems.map((item) => (
          <ListItem key={item.label} disablePadding>
            <ListItemButton>
              <ListItemText
                primary={item.label}
                primaryTypographyProps={{ sx: { color: "grey.700" } }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default Sidebar;
