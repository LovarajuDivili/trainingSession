import React from "react";
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
} from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";

import { menuItems as llmGardenMenu } from "../common/utility"; // centralized menus

const drawerWidth = 240;

interface SidebarProps {
  mobileOpen: boolean;
  handleDrawerToggle: () => void;
  isLLMGardenPage?: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({
  mobileOpen,
  handleDrawerToggle,
  isLLMGardenPage = false,
}) => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = isLLMGardenPage ? llmGardenMenu : [];

  const drawer = (
    <Box
      sx={{
        width: drawerWidth,
        height: "100%",
        p: 2,
        textAlign: "center",
        overflow: "hidden", // Prevent scrollbars
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          mb: 4,
          fontWeight: "bold",
          fontSize: 18,
          color: "#6c63ff",
          justifyContent: "center",
        }}
      >
        <img
          src="/assets/cerebro-logo.png"
          alt="Logo"
          style={{ width: 32, height: 32, marginRight: 8 }}
        />
        Cerebro SASA
      </Box>

      <List sx={{ overflow: "hidden" }}>
        {menuItems.map(({ text, path, icon }) => {
          // Check if current menu item is "All Employees"
          const isAllEmployees = text === "All Employees";

          // Check if current path matches or starts with All Employees path
          const isSelected = isAllEmployees
            ? location.pathname.startsWith("/llmgarden/all-employees")
            : location.pathname === path;

          return (
            <ListItem key={text} disablePadding>
              <ListItemButton
                selected={isSelected}
                onClick={() => {
                  navigate(path);
                  handleDrawerToggle();
                }}
                sx={{
                  "&.Mui-selected": {
                    backgroundColor: "#906aff",
                    color: "#ffffff",
                  },
                  "&.Mui-selected:hover": {
                    backgroundColor: "#7c58e1",
                  },
                  "&:hover": {
                    backgroundColor: "#f0f0f0",
                  },
                }}
              >
                {icon}
                <ListItemText
                  primary={text}
                  sx={{ textAlign: "center", ml: 1 }}
                />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>
    </Box>
  );

  return (
    <Box
      component="nav"
      sx={{
        width: { sm: drawerWidth },
        flexShrink: { sm: 0 },
      }}
    >
      {/* Mobile Drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: "block", sm: "none" },
          "& .MuiDrawer-paper": {
            boxSizing: "border-box",
            width: drawerWidth,
            overflow: "hidden",
          },
        }}
      >
        {drawer}
      </Drawer>

      {/* Desktop Drawer */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: "none", sm: "block" },
          "& .MuiDrawer-paper": {
            boxSizing: "border-box",
            width: drawerWidth,
            overflow: "hidden",
          },
        }}
        open
      >
        {drawer}
      </Drawer>
    </Box>
  );
};

export default Sidebar;
