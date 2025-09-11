import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import LogoutIcon from "@mui/icons-material/Logout";
import { GoArrowSwitch } from "react-icons/go";
import Divider from "@mui/material/Divider";

interface NavbarProps {
  accountType: string;
}

const Navbar: React.FC<NavbarProps> = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const navigate = useNavigate();

  const handleOpenMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    setAnchorEl(null);
    setOpenDialog(true);
  };

  const handleConfirmLogout = () => {
    setOpenDialog(false);
    navigate("/logout-success");
  };

  const handleCancelLogout = () => {
    setOpenDialog(false);
  };

  return (
    <>
      <AppBar
        position="static"
        sx={{
          background: "linear-gradient(90deg, #906aff, #ac8fff)",
          boxShadow: "none",
        }}
      >
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            <img
              src="/aifalogo.svg"
              style={{ width: 120, display: "flex" }}
              alt="AIFA Logo"
            />
          </Typography>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 22,
            }}
          >
            <GoArrowSwitch style={{ fontSize: 24 }} />
            <Divider
              orientation="vertical"
              variant="middle"
              flexItem
              sx={{ borderColor: "white" }}
            />
            <Box
              sx={{
                display: "flex",
                gap: 1.1,
                background: "white",
                borderRadius: 28,
                padding: 0.7,
                alignItems: "center",
              }}
            >
              <img
                src="/aifa_clr_logo.svg"
                alt="AIFA Color Logo"
                style={{ width: 105 }}
              />
              <IconButton onClick={handleOpenMenu} sx={{ p: 0 }}>
                <Box
                  sx={{
                    width: 35,
                    height: 35,
                    padding: 2.2,
                    bgcolor: "#906aff",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <AccountCircleIcon sx={{ fontSize: 28, color: "#fff" }} />
                </Box>
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleCloseMenu}
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                transformOrigin={{ vertical: "top", horizontal: "right" }}
                PaperProps={{
                  sx: {
                    bgcolor: "#f3f0ff",
                    color: "#4b2db7",
                    borderRadius: 2,
                    minWidth: 150,
                    boxShadow: "0px 5px 15px rgba(0, 0, 0, 0.2)",
                  },
                }}
              >
                <MenuItem
                  onClick={handleLogout}
                  sx={{
                    "&:hover": {
                      bgcolor: "#d8c9ff",
                    },
                    borderRadius: 1,
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                  }}
                >
                  <LogoutIcon fontSize="small" style={{ color: "black" }} />
                  Logout
                </MenuItem>
              </Menu>
            </Box>
          </div>
        </Toolbar>
      </AppBar>

      <Dialog
        open={openDialog}
        onClose={handleCancelLogout}
        sx={{
          "& .MuiPaper-root": {
            borderRadius: 3,
            padding: 2,
          },
        }}
      >
        <DialogTitle sx={{ fontWeight: 600, textAlign: "center" }}>
          Confirm Logout
        </DialogTitle>
        <DialogContent sx={{ textAlign: "center" }}>
          Are you sure you want to logout?
        </DialogContent>
        <DialogActions sx={{ justifyContent: "center" }}>
          <Button
            onClick={handleCancelLogout}
            sx={{ color: "#4b2db7", fontWeight: 600 }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirmLogout}
            variant="contained"
            sx={{
              background: "linear-gradient(90deg, #906aff, #ac8fff)",
              color: "#fff",
              fontWeight: 600,
              "&:hover": { opacity: 0.9 },
            }}
          >
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Navbar;
