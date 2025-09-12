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
  Divider,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import LogoutIcon from "@mui/icons-material/Logout";
import { GoArrowSwitch } from "react-icons/go";

interface NavbarProps {
  accountType: string;
}

const Navbar: React.FC<NavbarProps> = ({ accountType }) => {
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
    document.activeElement instanceof HTMLElement &&
      document.activeElement.blur();

    setOpenDialog(false);
    navigate("/logout-success");
  };

  const handleCancelLogout = () => {
    setOpenDialog(false);
  };

  return (
    <>
      <AppBar
        position="fixed"
        sx={{
          background: "linear-gradient(90deg, #906aff, #ac8fff)",
          boxShadow: "none",
          zIndex: (theme) => theme.zIndex.drawer + 1,
        }}
      >
        <Toolbar
          sx={{ display: "flex", justifyContent: "space-between", height: 56 }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 3 }}>
            <img src="/aifalogo.svg" alt="AIFA Labs" style={{ height: 32 }} />
            <Divider
              orientation="vertical"
              flexItem
              sx={{ borderColor: "rgba(255,255,255,0.6)" }}
            />
            <Typography
              variant="subtitle1"
              sx={{
                color: "white",
                fontSize: 15,
                fontWeight: 600,
                letterSpacing: 0.2,
              }}
            >
              {accountType}
            </Typography>
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <IconButton sx={{ color: "white" }}>
              <GoArrowSwitch style={{ fontSize: 24, color: "white" }} />
            </IconButton>
            <Divider
              orientation="vertical"
              flexItem
              sx={{ borderColor: "white" }}
            />

            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                background: "white",
                borderRadius: "28px",
                padding: "4px 8px",
              }}
            >
              <img
                src="/aifa_clr_logo.svg"
                alt="AIFA Color Logo"
                style={{ height: 24 }}
              />

              <IconButton onClick={handleOpenMenu} sx={{ p: 0 }}>
                <Box
                  sx={{
                    width: 35,
                    height: 35,
                    bgcolor: "#906aff",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <AccountCircleIcon sx={{ color: "white", fontSize: 28 }} />
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
                    "&:hover": { bgcolor: "#d8c9ff" },
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
          </Box>
        </Toolbar>
      </AppBar>

      <Dialog
        open={openDialog}
        onClose={handleCancelLogout}
        closeAfterTransition={false}
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
