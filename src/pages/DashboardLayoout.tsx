import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Box,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Menu,
  MenuItem,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import FolderOpenIcon from "@mui/icons-material/FolderOpen";
import SettingsIcon from "@mui/icons-material/Settings";
import StorageIcon from "@mui/icons-material/Storage";
import LayersIcon from "@mui/icons-material/Layers";
import BarChartIcon from "@mui/icons-material/BarChart";
import ReceiptIcon from "@mui/icons-material/Receipt";
import SyncAltIcon from "@mui/icons-material/SyncAlt";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";

import LLMGarden from "./LLMGarden";

const drawerWidth = 260;

const menuItems = [
  { text: "General Configuration", icon: <SettingsIcon /> },
  { text: "LLM Garden", icon: <FolderOpenIcon /> },
  { text: "Database", icon: <StorageIcon /> },
  { text: "Storage Provider", icon: <LayersIcon /> },
  { text: "Projects", icon: <ReceiptIcon /> },
  { text: "Statistics", icon: <BarChartIcon /> },
  { text: "Logs", icon: <ReceiptIcon /> },
];

const DashboardLayout: React.FC = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [selectedMenu, setSelectedMenu] = useState("LLM Garden");
  const [anchorElLeft, setAnchorElLeft] = useState<null | HTMLElement>(null);
  const [anchorElRight, setAnchorElRight] = useState<null | HTMLElement>(null);

  const openMenuLeft = Boolean(anchorElLeft);
  const openMenuRight = Boolean(anchorElRight);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleMenuClick = (label: string) => {
    setSelectedMenu(label);
  };

  const handleProfileClickLeft = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElLeft(event.currentTarget);
  };

  const handleCloseMenuLeft = () => {
    setAnchorElLeft(null);
  };

  const handleProfileClickRight = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElRight(event.currentTarget);
  };

  const handleCloseMenuRight = () => {
    setAnchorElRight(null);
  };

  const drawer = (
    <Box sx={{ width: drawerWidth }}>
      <Toolbar />
      <Divider />
      <List
        sx={{
          "&& .Mui-selected, && .Mui-selected:hover": {
            bgcolor: "#906aff",
            color: "#fff",
            "& .MuiListItemIcon-root": {
              color: "#fff",
            },
          },
          "& .MuiListItem:hover": {
            bgcolor: "rgba(144,106,255,0.1)",
            color: "#000",
            "& .MuiListItemIcon-root": {
              color: "#906aff",
            },
          },
        }}
      >
        {menuItems.map(({ text, icon }) => (
          <ListItem
            button
            key={text}
            selected={selectedMenu === text}
            onClick={() => handleMenuClick(text)}
            sx={{
              borderRadius: 1,
              mb: 0.5,
              color: selectedMenu === text ? "#906aff" : "#666",
            }}
          >
            <ListItemIcon
              sx={{
                color: selectedMenu === text ? "#906aff" : "#666",
                minWidth: 40,
              }}
            >
              {icon}
            </ListItemIcon>
            <ListItemText
              primary={text}
              primaryTypographyProps={{
                fontWeight: selectedMenu === text ? "bold" : "normal",
                fontSize: 15,
                color: selectedMenu === text ? "#906aff" : "#666",
              }}
            />
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: "flex", height: "100vh", bgcolor: "#f5f7fb" }}>
      {/* AppBar */}
      <AppBar
        position="fixed"
        sx={{ bgcolor: "#906aff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
      >
        <Toolbar sx={{ display: "flex", justifyContent: "space-between", px: 2 }}>
          {/* Left section */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <IconButton onClick={handleDrawerToggle} sx={{ color: "#fff" }}>
              <MenuIcon />
            </IconButton>

            <img src="/chat.svg" alt="Chat Icon" style={{ width: 25, height: 25 }} />
            <Typography variant="h6" sx={{ fontWeight: "600", color: "#fff", ml: 0.5 }}>
              Cerebro SASA
            </Typography>

            <Divider
              orientation="vertical"
              sx={{ bgcolor: "rgba(255,255,255,0.6)", height: 28, mx: 2 }}
              flexItem
            />

            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                cursor: "pointer",
                color: "#fff",
              }}
              onClick={handleProfileClickLeft}
              aria-controls={openMenuLeft ? "left-profile-menu" : undefined}
              aria-haspopup="true"
              aria-expanded={openMenuLeft ? "true" : undefined}
            >
              <AccountCircleIcon sx={{ fontSize: 30 }} />
              <Typography variant="body1" sx={{ fontWeight: "600" }}>
                Admin
              </Typography>
            </Box>

            <Menu
              id="left-profile-menu"
              anchorEl={anchorElLeft}
              open={openMenuLeft}
              onClose={handleCloseMenuLeft}
              PaperProps={{
                elevation: 8,
                sx: { borderRadius: 3, mt: 1, minWidth: 150 },
              }}
              anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
              transformOrigin={{ vertical: "top", horizontal: "left" }}
            >
              <MenuItem onClick={handleCloseMenuLeft} sx={{ fontWeight: 600, px: 3, py: 1.5 }}>
                Logout
              </MenuItem>
            </Menu>
          </Box>

          {/* Right section */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <IconButton sx={{ color: "white" }} size="large" aria-label="sync">
              <SyncAltIcon />
            </IconButton>

            {/* White container for AiFA logo + profile */}
            <Box
              sx={{
                bgcolor: "#fff",
                borderRadius: "40px",
                display: "flex",
                alignItems: "center",
                px: 2,
                py: 0.5,
                gap: 1.5,
              }}
            >
              <img
                src="/aifa_clr_logo.svg"
                alt="AiFA Logo"
                style={{ height: 28, objectFit: "contain" }}
              />
              <IconButton
                onClick={handleProfileClickRight}
                sx={{
                  bgcolor: "#fff",
                  borderRadius: "50%",
                  p: 0.5,
                  "&:hover": { bgcolor: "#f0f0f0" },
                }}
              >
                <AccountCircleIcon sx={{ fontSize: 30, color: "#906aff" }} />
              </IconButton>
            </Box>

            <Menu
              anchorEl={anchorElRight}
              open={openMenuRight}
              onClose={handleCloseMenuRight}
              PaperProps={{
                elevation: 8,
                sx: { borderRadius: 3, mt: 1, minWidth: 150 },
              }}
              anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
              transformOrigin={{ vertical: "top", horizontal: "right" }}
            >
              <MenuItem onClick={handleCloseMenuRight} sx={{ fontWeight: 600, px: 3, py: 1.5 }}>
                Logout
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Drawers */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: "block", sm: "none" },
          "& .MuiDrawer-paper": { width: drawerWidth },
        }}
      >
        {drawer}
      </Drawer>

      <Drawer
        variant="permanent"
        sx={{
          display: { xs: "none", sm: "block" },
          "& .MuiDrawer-paper": { width: drawerWidth, boxSizing: "border-box", bgcolor: "#fff" },
        }}
        open
      >
        {drawer}
      </Drawer>

      {/* Main content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          mt: 8,
          ml: { sm: `${drawerWidth}px` },
          overflowY: "auto",
          bgcolor: "#f5f7fb",
        }}
      >
        {selectedMenu === "LLM Garden" ? (
          <LLMGarden />
        ) : (
          <Box
            sx={{
              p: 4,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "80vh",
              color: "#888",
            }}
          >
            <Typography variant="h5">
              Content for "{selectedMenu}" coming soon...
            </Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default DashboardLayout;
