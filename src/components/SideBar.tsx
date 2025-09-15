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

const Sidebar = ({ selectedItem, setSelectedItem }: { selectedItem: string; setSelectedItem: (item: string) => void }) => {
  return (
    <Box
      sx={{
        width: 240,
        height: "100vh",
        bgcolor: "white",
        borderRight: "1px solid #ddd",
        position: "fixed",
        top: 50,
        left: 0,
      }}
    >
      <List>
        {sidebarItems.map((item) => (
          <ListItem key={item.label} disablePadding>
            <ListItemButton onClick={() => setSelectedItem(item.label)}>
              <ListItemText
                primary={item.label}
                primaryTypographyProps={{
                  sx: {
                    color: selectedItem === item.label ? "primary.main" : "grey.700",
                    fontWeight: selectedItem === item.label ? "bold" : "normal",
                  },
                }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default Sidebar;
