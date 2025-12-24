import React, { useState, useContext } from "react";
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Box,
  Menu,
  MenuItem,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import SyncAltIcon from "@mui/icons-material/SyncAlt";
import { Outlet, useNavigate } from "react-router-dom";

import Sidebar from "../components/Sidebar";
import { UserContext } from "../components/UserContext";

const drawerWidth = 10;

const DashboardLayout: React.FC = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const navigate = useNavigate();
  const { setUser, setToken } = useContext(UserContext);

  const handleDrawerToggle = () => setMobileOpen(!mobileOpen);

  const handleProfileClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    localStorage.removeItem("accountType");
    localStorage.removeItem("employeeData");
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setToken("");

    setAnchorEl(null);
    navigate("/logged-out");
  };

  const handleCompareClick = () => {
    const hasData = localStorage.getItem("employeeData");

    if (hasData) {
      localStorage.removeItem("employeeData");
    } else {
      localStorage.setItem("employeeData", "true");
    }

    navigate(".", { replace: true });
  };

  return (
    <Box sx={{ display: "flex", height: "100vh", bgcolor: "#f5f7fb" }}>
      <AppBar
        position="fixed"
        sx={{ bgcolor: "#906aff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
      >
        <Toolbar sx={{ display: "flex", justifyContent: "space-between", px: 2 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <IconButton onClick={handleDrawerToggle} sx={{ color: "#fff" }}>
              <MenuIcon />
            </IconButton>

            <img src="/chat.svg" alt="Chat Icon" style={{ width: 25, height: 25 }} />
            <Typography variant="h6" sx={{ fontWeight: "600", color: "#fff", ml: 0.5 }}>
              Cerebro SASA
            </Typography>
          </Box>

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
                onClick={handleProfileClick}
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
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleCloseMenu}
              PaperProps={{
                elevation: 8,
                sx: { borderRadius: 3, mt: 1, minWidth: 150 },
              }}
              anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
              transformOrigin={{ vertical: "top", horizontal: "right" }}
            >
              <MenuItem onClick={handleLogout} sx={{ fontWeight: 600, px: 3, py: 1.5 }}>
                Logout
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>

      <Sidebar
        mobileOpen={mobileOpen}
        handleDrawerToggle={handleDrawerToggle}
        drawerWidth={drawerWidth}
      />

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
        <Outlet />
      </Box>
    </Box>
  );
};

export default DashboardLayout;
