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
//import { colors } from "../common/colorConstants";
import { useThemeColors } from "../hooks/useThemeColors";


const SideBar = () => {
  const navigate = useNavigate();
  const location = useLocation();
   const colors = useThemeColors();

  return (
    <Box
      sx={{
        width: 240,
        height: "100vh",
        bgcolor: colors.background.white,
        borderRight: `1px solid ${colors.border.light}`,
        position: "fixed",
        top: 50,
        left: 0,
      }}
    >
      <List>
        {sidebarItems.map((item) => {
          const isSelected = location.pathname.startsWith(item.route);

          return (
            <ListItem key={item.label} disablePadding>
              <ListItemButton
                onClick={() => navigate(item.route)}
                sx={{
                  bgcolor: isSelected ? colors.primary.main : "transparent",
                  color: isSelected ? colors.text.white : colors.text.primary,
                  "&:hover": {
                    bgcolor: isSelected ? colors.primary.main : colors.state.hoverLight,
                  },
                  borderRadius: 10,
                  mx: 1,
                  my: 0.5,
                }}
              >
                <ListItemIcon sx={{ 
                  color: isSelected ? colors.text.white : colors.text.primary,
                  minWidth: 40 
                }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText 
                  primary={item.label} 
                  primaryTypographyProps={{
                    fontWeight: isSelected ? 600 : 400
                  }}
                />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>
    </Box>
  );
};

export default SideBar;