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
import { useThemeColors } from "../hooks/useThemeColors";
import { useTheme } from "../context/ThemeContext";

const SideBar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const colors = useThemeColors();
  const { themeMode } = useTheme();

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
          
          // For dark mode, reverse the colors when selected
          const bgColor = isSelected 
            ? (themeMode === "dark" ? colors.text.white : colors.primary.main)
            : "transparent";
          
          const textColor = isSelected
            ? (themeMode === "dark" ? colors.primary.main : colors.text.white)
            : colors.text.primary;

          return (
            <ListItem key={item.label} disablePadding>
              <ListItemButton
                onClick={() => navigate(item.route)}
                sx={{
                  bgcolor: bgColor,
                  color: textColor,
                  "&:hover": {
                    bgcolor: isSelected 
                      ? bgColor 
                      : colors.state.hoverLight,
                  },
                  borderRadius: 10,
                  mx: 1,
                  my: 0.5,
                }}
              >
                <ListItemIcon sx={{ 
                  color: textColor,
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