import React, { useState } from "react";
import { Box, Typography, InputBase, Button } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import PeopleIcon from "@mui/icons-material/People";

import Header from "./Header";
import Sidebar from "./Sidebar";

interface LayoutProps {
  children: React.ReactNode;
  isLLMGardenPage?: boolean;
  employeeCount?: number;
  hideControls?: boolean; // To optionally hide search/add/count controls
}

const Layout: React.FC<LayoutProps> = ({
  children,
  isLLMGardenPage = false,
  employeeCount = 0,
  hideControls = false,
}) => {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      {/* Sidebar */}
      <Sidebar
        mobileOpen={mobileOpen}
        handleDrawerToggle={handleDrawerToggle}
        isLLMGardenPage={isLLMGardenPage}
      />

      {/* Main content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          boxSizing: "border-box",
          bgcolor: "#f5f7fb",
        }}
      >
        <Header onMenuClick={handleDrawerToggle} />

        <Box sx={{ p: 3, mt: 8 }}>
          {/* Conditionally render controls */}
          {!hideControls && (
            <>
              {/* Search + Add New + All Employees header */}
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 2,
                  flexWrap: "wrap",
                  gap: 2,
                }}
              >
                <Typography
                  variant="h5"
                  sx={{
                    color: "black",
                    fontWeight: "bold",
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                  }}
                >
                  <PeopleIcon sx={{ color: "black" }} />
                  All Employees
                </Typography>

                <Box
                  sx={{
                    display: "flex",
                    gap: 2,
                    flexWrap: "wrap",
                    justifyContent: "flex-end",
                    flexGrow: 1,
                  }}
                >
                  <Box
                    sx={{
                      position: "relative",
                      borderRadius: 1,
                      backgroundColor: "#f1ecff",
                      display: "flex",
                      alignItems: "center",
                      px: 1,
                      minWidth: 240,
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

              {/* Black banner with white text for All Employees (count) */}
              {isLLMGardenPage && (
                <Box
                  sx={{
                    width: "100%",
                    backgroundColor: "#000",
                    color: "#fff",
                    py: 1,
                    px: 2,
                    borderRadius: 1,
                    mb: 2,
                  }}
                >
                  <Typography
                    variant="body2"
                    sx={{
                      fontWeight: 500,
                      fontSize: "0.875rem",
                    }}
                  >
                    All Employees {employeeCount > 0 ? `(${employeeCount})` : ""}
                  </Typography>
                </Box>
              )}
            </>
          )}

          {/* Render children */}
          {children}
        </Box>
      </Box>
    </Box>
  );
};

export default Layout;
