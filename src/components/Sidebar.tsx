import React, { useState } from "react";
import {
  Drawer,
  Toolbar,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Box,
} from "@mui/material";
import SettingsIcon from "@mui/icons-material/Settings";
import StorageIcon from "@mui/icons-material/Storage";
import FolderIcon from "@mui/icons-material/Folder";
import InsightsIcon from "@mui/icons-material/Insights";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import LibraryBooksIcon from "@mui/icons-material/LibraryBooks";

const drawerWidth = 245;

const Sidebar: React.FC = () => {
  const [selectedIndex, setSelectedIndex] = useState(1);

  const menuItems = [
    { text: "General Configuration", icon: <SettingsIcon /> },
    { text: "LLM Garden", icon: <LibraryBooksIcon />, hoverStyle: true },
    { text: "Database", icon: <StorageIcon /> },
    { text: "Storage Provider", icon: <StorageIcon /> },
    { text: "Projects", icon: <FolderIcon /> },
    { text: "Statistics", icon: <InsightsIcon /> },
    { text: "Logs", icon: <ReceiptLongIcon /> },
  ];

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
          {menuItems.map((item, index) => {
            const selected = selectedIndex === index;
            const isLLMHover = item.hoverStyle;

            return (
              <ListItemButton
                key={item.text}
                selected={selected && !isLLMHover}
                onClick={() => setSelectedIndex(index)}
                sx={{
                  py: 1,
                  px: 3,
                  borderRadius: 2,
                  mb: 0.25,
                  color: "#6c757d",
                  bgcolor: isLLMHover
                    ? "#f1eefd"
                    : selected
                    ? "transparent"
                    : "transparent",
                  "&:hover": {
                    bgcolor: "#f1eefd",
                    color: "#6c757d",
                    "& .MuiListItemIcon-root": {
                      color: "#6c757d",
                    },
                  },
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 32,
                    mr: 1.5,
                    color: "#6c757d",
                    transition: "color 0.3s",
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItemButton>
            );
          })}
        </List>
      </Box>
    </Drawer>
  );
};

export default Sidebar;
