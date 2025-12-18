import React, { useState, useEffect } from "react";
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import { useNavigate, useLocation, useParams } from "react-router-dom";

import { menuItems } from "../common/utility";

interface SidebarProps {
  mobileOpen: boolean;
  handleDrawerToggle: () => void;
  drawerWidth: number;
}

const Sidebar: React.FC<SidebarProps> = ({
  mobileOpen,
  handleDrawerToggle,
  drawerWidth,
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { role = "" } = useParams();

  const [selectedLabel, setSelectedLabel] = useState<string | null>(null);

  useEffect(() => {
    const currentItem = menuItems.find((item) =>
      location.pathname.endsWith(item.route)
    );
    if (currentItem) {
      setSelectedLabel(currentItem.text);
    }
  }, [location.pathname]);

  const drawer = (
    <Box sx={{ width: drawerWidth }}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          py: 3,
        }}
      >
        <img
          src="/assets/cerebro-logo.png"
          alt="Logo"
          style={{ width: 32, height: 32, marginRight: 8 }}
        />
        <Box sx={{ fontWeight: "bold", fontSize: 18, color: "#6c63ff" }}>
          Cerebro SASA
        </Box>
      </Box>

      <List>
        {menuItems.map(({ text, icon, getPath }) => {
          const path = getPath(role);
          const isSelected = selectedLabel === text;

          return (
            <ListItem key={text} disablePadding>
              <ListItemButton
                selected={isSelected}
                onClick={() => {
                  setSelectedLabel(text);
                  navigate(path);
                  handleDrawerToggle();
                }}
                sx={{
                  mx: 1,
                  my: 0.5,
                  px: 2,
                  py: 1.2,
                  borderRadius: "50px",
                  "&.Mui-selected": {
                    backgroundColor: "#906aff",
                    color: "#ffffff",
                    "& .MuiListItemIcon-root, & .MuiListItemText-primary": {
                      color: "#ffffff",
                    },
                  },
                  "&.Mui-selected:hover": {
                    backgroundColor: "#7c58e1",
                  },
                  "&:hover": {
                    backgroundColor: "#f0f0f0",
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 36,
                    color: isSelected ? "#ffffff" : "inherit",
                  }}
                >
                  {icon}
                </ListItemIcon>
                <ListItemText primary={text} />
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
      sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
    >
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
          },
        }}
      >
        {drawer}
      </Drawer>

      <Drawer
        variant="permanent"
        sx={{
          display: { xs: "none", sm: "block" },
          "& .MuiDrawer-paper": {
            boxSizing: "border-box",
            width: drawerWidth,
            borderRight: "none",
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
