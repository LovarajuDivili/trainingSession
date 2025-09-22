import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import { sidebarItems } from "../common/sidebarItems";

const SideBar = () => {
  const navigate = useNavigate();
  const location = useLocation();

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
        {sidebarItems.map((item) => {
          const isSelected = location.pathname === item.route;

          return (
            <ListItem key={item.label} disablePadding>
              <ListItemButton
                onClick={() => navigate(item.route)}
                sx={{
                  bgcolor: isSelected ? "#906aff" : "transparent",
                  color: isSelected ? "white" : "black",
                  "&:hover": {
                    bgcolor: isSelected ? "#906aff" : "#f0f0f0",
                  },
                  borderRadius: 10,
                  mx: 1,
                  my: 0.5,
                }}
              >
                <ListItemIcon sx={{ color: isSelected ? "white" : "black" }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText primary={item.label} />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>
    </Box>
  );
};

export default SideBar;
