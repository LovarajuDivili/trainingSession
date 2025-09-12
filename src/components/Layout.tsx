// src/components/Layout.tsx
import React, { useState } from "react";
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  IconButton,
  AppBar,
  Toolbar,
  Typography,
  InputBase,
  Button,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import { useNavigate, useLocation } from "react-router-dom";

const drawerWidth = 240;

const menuItems = [
  { label: "General Configuration", path: "/admin/general-configuration" },
  { label: "LLM Garden", path: "/admin/llm-garden" },
  { label: "Database", path: "/admin/database" },
  { label: "Storage Provider", path: "/admin/storage-provider" },
  { label: "Projects", path: "/admin/projects" },
  { label: "Statistics", path: "/admin/statistics" },
  { label: "Logs", path: "/admin/logs" },
];

interface LayoutProps {
  children: React.ReactNode;
  pageTitle: string;
}

const Layout: React.FC<LayoutProps> = ({ children, pageTitle }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawer = (
    <Box sx={{ width: drawerWidth, p: 2 }}>
      {/* Logo & Title */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          mb: 4,
          fontWeight: "bold",
          fontSize: 18,
          color: "#6c63ff",
        }}
      >
        <img
          src="/path-to-logo.png" // replace with actual logo path or remove
          alt="Logo"
          style={{ width: 32, height: 32, marginRight: 8 }}
        />
        Cerebro SASA
      </Box>

      <List>
        {menuItems.map(({ label, path }) => (
          <ListItem key={label} disablePadding>
            <ListItemButton
              selected={location.pathname === path}
              onClick={() => {
                navigate(path);
                setMobileOpen(false);
              }}
            >
              <ListItemText primary={label} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: "flex" }}>
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
          backgroundColor: "#906aff",
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: "none" } }}
            aria-label="open drawer"
          >
            <MenuIcon />
          </IconButton>
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ flexGrow: 1, fontWeight: "bold" }}
          >
            Cerebro SASA
          </Typography>
          {/* You can add user icon or other right side items here */}
        </Toolbar>
      </AppBar>

      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        aria-label="sidebar navigation"
      >
        {/* Mobile drawer */}
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
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

        {/* Desktop drawer */}
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: "none", sm: "block" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          mt: 8,
        }}
      >
        {/* Heading + Search + Add New Row */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 3,
          }}
        >
          <Typography variant="h5" sx={{ color: "#906aff", fontWeight: "bold" }}>
            {pageTitle}
          </Typography>

          <Box sx={{ display: "flex", gap: 2 }}>
            <Box
              sx={{
                position: "relative",
                borderRadius: 1,
                backgroundColor: "#f1ecff",
                display: "flex",
                alignItems: "center",
                px: 1,
              }}
            >
              <SearchIcon color="disabled" />
              <InputBase
                placeholder="Search…"
                inputProps={{ "aria-label": "search" }}
                sx={{ ml: 1, flex: 1 }}
              />
            </Box>

            <Button
              variant="contained"
              sx={{ backgroundColor: "#906aff" }}
              onClick={() => alert("Add new clicked")}
            >
              Add New +
            </Button>
          </Box>
        </Box>

        {/* Render page content */}
        {children}
      </Box>
    </Box>
  );
};

export default Layout;
