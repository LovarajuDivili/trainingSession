import { useState } from "react";
import { Box, Typography, IconButton, Button } from "@mui/material";
import AccountCircle from "@mui/icons-material/AccountCircle";
//import SmartToy from "@mui/icons-material/SmartToy";
import LogoutIcon from "@mui/icons-material/Logout";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz"; // Using a Material icon for arrows
//import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const Header = () => {
  const [showLogout, setShowLogout] = useState(false);

  const handleIconClick = () => {
    setShowLogout((prev) => !prev);
  };

  const handleLogout = () => {
    console.log("Logged out");
  };

  return (
    <Box
      sx={{
        position: "fixed", 
        top: 0,
        left: 0,
        right: 0,
        backgroundColor: "#906aff",
        width: "100%",
        height: "50px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        
        zIndex: 1000,
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <Box
          component="img"
          src="/chat.svg"
          alt="Custom Icon"
          sx={{
            width: 35,
            height: 35,
          }}
        />
        <Typography variant="h6" component="div" sx={{ color: "white" }}>
          <strong>Aifa</strong>
        </Typography>
      </Box>

      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1,
          position: "relative",
        }}
      >
        <IconButton sx={{ color: "white" }}>
          <SwapHorizIcon />
        </IconButton>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            backgroundColor: "white",
            borderRadius: "100px",
            padding: "1px 1px",
            height: "42px",
          }}
        >
          <Box
            sx={{
              width: "125px",
              height: "35px",
              borderRadius: "50%",

              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Box
              component="img"
              src="/aifa_clr_logo.svg"
              alt="Custom Icon"
              sx={{
                width: 100,
                height: 30,
                backgroundColor: "white",
              }}
            />
          </Box>

          <Box sx={{ position: "relative" }}>
            <IconButton onClick={handleIconClick} sx={{ color: "#906aff" }}>
              <AccountCircle sx={{ fontSize: 43 }} />
            </IconButton>

            {showLogout && (
              <Box
                sx={{
                  position: "absolute",
                  top: "55px",
                  right: 0,
                  backgroundColor: "white",
                  boxShadow: 3,
                  borderRadius: 20,
                }}
              >
                <Button
                  onClick={handleLogout}
                  startIcon={<LogoutIcon sx={{ fontSize: 20 }} />}
                  sx={{
                    width: "120px",
                    height: "40px",
                    borderRadius: "20px",
                    backgroundColor: "white",
                    color: "#000",
                    boxShadow: 3,
                    textTransform: "none",
                    "&:hover": {
                      backgroundColor: "#f0f0f0",
                    },
                  }}
                >
                  Logout
                </Button>
              </Box>
            )}
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Header;
