// src/pages/DashboardLayout.tsx
import React, { useState, useEffect } from "react";
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
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import SyncAltIcon from "@mui/icons-material/SyncAlt";
import { useNavigate, useLocation } from "react-router-dom";

import AllEmployees from "./AllEmployees";
import Developers from "./Developers";
import Testers from "./Testers";
import AWSTeam from "./AWSTeam";
import Projects from "./Projects";
import Statistics from "./Statistics";
import Logs from "./Logs";

const drawerWidth = 260;

const menuItems = [
  { text: "All Employees", icon: <AccountCircleIcon />, path: "/llmgarden/all-employees" },
  { text: "Developers", icon: <AccountCircleIcon />, path: "/llmgarden/developers" },
  { text: "Testers", icon: <AccountCircleIcon />, path: "/llmgarden/testers" },
  { text: "AWS Team", icon: <AccountCircleIcon />, path: "/llmgarden/aws" },
  { text: "Projects", icon: <AccountCircleIcon />, path: "/llmgarden/projects" },
  { text: "Statistics", icon: <AccountCircleIcon />, path: "/llmgarden/statistics" },
  { text: "Logs", icon: <AccountCircleIcon />, path: "/llmgarden/logs" },
];

const DashboardLayout: React.FC = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorElLeft, setAnchorElLeft] = useState<null | HTMLElement>(null);
  const [anchorElRight, setAnchorElRight] = useState<null | HTMLElement>(null);
  const navigate = useNavigate();
  const location = useLocation();

  const currentPath = location.pathname;
  const defaultPath = "/llmgarden/all-employees";

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleMenuClick = (path: string) => {
    navigate(path);
  };

  const openMenuLeft = Boolean(anchorElLeft);
  const openMenuRight = Boolean(anchorElRight);

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

  const handleCompareClick = () => {
    const hasData = localStorage.getItem("employeeData");

    if (hasData) {
      localStorage.removeItem("employeeData");
      navigate("/");
    } else {
      localStorage.setItem("employeeData", "true");
      navigate("/");
    }
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
        {menuItems.map(({ text, icon, path }) => (
          <ListItem
            button
            key={text}
            selected={currentPath === path}
            onClick={() => handleMenuClick(path)}
            sx={{
              borderRadius: 1,
              mb: 0.5,
              color: currentPath === path ? "#906aff" : "#666",
            }}
          >
            <ListItemIcon
              sx={{
                color: currentPath === path ? "#906aff" : "#666",
                minWidth: 40,
              }}
            >
              {icon}
            </ListItemIcon>
            <ListItemText
              primary={text}
              primaryTypographyProps={{
                fontWeight: currentPath === path ? "bold" : "normal",
                fontSize: 15,
                color: currentPath === path ? "#906aff" : "#666",
              }}
            />
          </ListItem>
        ))}
      </List>
    </Box>
  );

  const renderPage = () => {
    switch (currentPath) {
      case "/llmgarden/all-employees":
        return <AllEmployees />;
      case "/llmgarden/developers":
        return <Developers />;
      case "/llmgarden/testers":
        return <Testers />;
      case "/llmgarden/aws":
        return <AWSTeam />;
      case "/llmgarden/projects":
        return <Projects />;
      case "/llmgarden/statistics":
        return <Statistics />;
      case "/llmgarden/logs":
        return <Logs />;
      default:
        return <AllEmployees />;
    }
  };

  useEffect(() => {
    if (currentPath === "/llm-garden/Admin") {
      navigate(defaultPath);
    }
  }, [currentPath, navigate]);

  return (
    <Box sx={{ display: "flex", height: "100vh", bgcolor: "#f5f7fb" }}>
      {/* AppBar */}
      <AppBar
        position="fixed"
        sx={{ bgcolor: "#906aff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
      >
        <Toolbar sx={{ display: "flex", justifyContent: "space-between", px: 2 }}>
          {/* Left */}
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
              sx={{ display: "flex", alignItems: "center", gap: 1, cursor: "pointer", color: "#fff" }}
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

          {/* Right */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <IconButton
              sx={{ color: "white" }}
              size="large"
              aria-label="sync"
              onClick={handleCompareClick}
            >
              <SyncAltIcon />
            </IconButton>

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

      {/* Drawer for mobile */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: "block", sm: "none" },
          "& .MuiDrawer-paper": { boxSizing: "border-box", width: drawerWidth },
        }}
      >
        {drawer}
      </Drawer>

      {/* Drawer for desktop */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: "none", sm: "block" },
          "& .MuiDrawer-paper": {
            boxSizing: "border-box",
            width: drawerWidth,
            borderRight: "none",
            bgcolor: "#fff",
          },
        }}
        open
      >
        {drawer}
      </Drawer>

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          mt: 8,
          bgcolor: "#f5f7fb",
          minHeight: "100vh",
          overflowY: "auto",
        }}
      >
        {renderPage()}
      </Box>
    </Box>
  );
};

export default DashboardLayout;
