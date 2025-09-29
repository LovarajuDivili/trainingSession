import React, { useState } from "react";
import {
  Drawer,
  Toolbar,
  List,
  ListItemButton,
  ListItemText,
  ListItemIcon,
  Box,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { sidebarSections } from "../common/utilitys";

const drawerWidth = 255;

const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const [selectedPath, setSelectedPath] = useState("");
  const handleClick = (path: string) => {
    setSelectedPath(path);
    navigate(`/dashboard/${path}`);
  };

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: {
          width: drawerWidth,
          boxSizing: "border-box",
          borderRight: 0,
          backgroundColor: "#f7f8fc",
          color: "#6c757d",
        },
      }}
    >
      <Toolbar />
      <Box sx={{ overflow: "auto", pt: 2 }}>
        <List>
          {sidebarSections.map(({ label, path, icon }) => {
            const selected = selectedPath === path;

            return (
              <ListItemButton
                key={label}
                selected={selected}
                onClick={() => handleClick(path)}
                sx={{
                  py: 1,
                  px: 3,
                  borderRadius: 10,
                  width: 240,
                  mb: 0.25,
                  color: selected ? "#fff" : "#6c757d",
                  bgcolor: selected ? "#906aff !important" : "transparent",
                  "&.Mui-selected": {
                    bgcolor: "#906aff !important",
                    color: "#fff !important",
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    color: selected ? "#fff !important" : "#6c757d",
                    minWidth: 36,
                  }}
                >
                  {icon}
                </ListItemIcon>
                <ListItemText primary={label} />
              </ListItemButton>
            );
          })}
        </List>
      </Box>
    </Drawer>
  );
};

export default Sidebar;
