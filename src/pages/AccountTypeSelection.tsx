import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Box,
  Button,
  Select,
  MenuItem,
  FormControl,
  Menu,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import LogoutIcon from "@mui/icons-material/Logout";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
import { roles } from "../common/dropdowns";
import { AccountSelection, LogoutDialog } from "../common/labelConstants";

const AccountTypeSelection: React.FC = () => {
  const [accountType, setAccountType] = useState("Admin");
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [logoutConfirmOpen, setLogoutConfirmOpen] = useState(false);
  const openMenu = Boolean(anchorEl);
  const navigate = useNavigate();

  const handleProfileClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    handleCloseMenu();
    setLogoutConfirmOpen(true);
  };

  const confirmLogout = () => {
    setLogoutConfirmOpen(false);
    navigate("/logged-out");
  };

  const cancelLogout = () => {
    setLogoutConfirmOpen(false);
  };

  const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setAccountType(event.target.value as string);
  };

  const handleProceed = () => {
    // Navigate to dashboard with selected role in lowercase for URL consistency
    navigate(`/dashboard/${accountType.toLowerCase()}`);
  };

  return (
    <>
      {/* Header */}
      <AppBar position="static" sx={{ bgcolor: "#7e57c2", borderRadius: 0 }}>
        <Toolbar
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            px: { xs: 1, sm: 3 },
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <img src="/chat.svg" alt="Chat Icon" style={{ width: 24, height: 24 }} />
            <Typography variant="h6" sx={{ fontWeight: 600, color: "#fff" }}>
              Cerebro SASA
            </Typography>
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <SwapHorizIcon sx={{ color: "#fff", fontSize: 28, cursor: "pointer" }} />

            <Box
              sx={{
                bgcolor: "#fff",
                borderRadius: 3,
                display: "flex",
                alignItems: "center",
                gap: 1,
                px: 2,
                py: 0.5,
              }}
            >
              <img
                src="/aifa_clr_logo.svg"
                alt="AIFA Logo"
                style={{ width: 90, height: 40, objectFit: "contain" }}
              />
              <IconButton
                onClick={handleProfileClick}
                sx={{ bgcolor: "#fff", borderRadius: "50%", p: 0.5, ml: 0.5 }}
                aria-label="profile menu"
              >
                <AccountCircleIcon sx={{ fontSize: 32, color: "#7e57c2" }} />
              </IconButton>
            </Box>
          </Box>

          {/* Profile Menu */}
          <Menu
            anchorEl={anchorEl}
            open={openMenu}
            onClose={handleCloseMenu}
            PaperProps={{
              elevation: 8,
              sx: {
                borderRadius: 3,
                mt: 1,
                minWidth: 160,
              },
            }}
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            transformOrigin={{ vertical: "top", horizontal: "right" }}
          >
            <MenuItem
              onClick={handleLogout}
              sx={{
                borderRadius: 3,
                px: 3,
                py: 1.5,
                display: "flex",
                alignItems: "center",
                gap: 1,
                color: "#000",
                fontWeight: 600,
                fontSize: "1rem",
              }}
            >
              <LogoutIcon fontSize="medium" />
              {LogoutDialog.LOGOUT_BUTTON}
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      {/* Logout Confirmation Dialog */}
      <Dialog open={logoutConfirmOpen} onClose={cancelLogout}>
        <DialogTitle>{LogoutDialog.CONFIRM_TITLE}</DialogTitle>
        <DialogContent>
          <DialogContentText>{LogoutDialog.CONFIRM_MESSAGE}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={cancelLogout}
            sx={{
              color: "#7e57c2",
              fontWeight: "bold",
              textTransform: "none",
              border: "1px solid #7e57c2",
              borderRadius: 2,
              px: 2,
              "&:hover": {
                backgroundColor: "#ede7f6",
                borderColor: "#9575cd",
              },
            }}
          >
            {LogoutDialog.CANCEL_BUTTON}
          </Button>

          <Button onClick={confirmLogout} color="error" variant="contained">
            {LogoutDialog.LOGOUT_BUTTON}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Center Content */}
      <Box
        sx={{
          minHeight: "calc(100vh - 64px)",
          bgcolor: "#f5f5f5",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          px: 3,
        }}
      >
        <Box
          sx={{
            maxWidth: 400,
            width: "100%",
            bgcolor: "#fff",
            p: 4,
            borderRadius: 3,
            boxShadow: 3,
          }}
        >
          <Typography variant="body1" mb={1} color="text.primary">
            {AccountSelection.WELCOME}{" "}
            <Typography component="span" sx={{ fontWeight: 600, color: "#7e57c2" }}>
              {AccountSelection.PLATFORM_NAME}
            </Typography>
          </Typography>

          <Typography variant="body2" mb={2} color="text.primary">
            {AccountSelection.SELECT_PROMPT}
          </Typography>

          <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600, textAlign: "left" }}>
            {AccountSelection.ACCOUNT_TYPE_LABEL}
          </Typography>

          <FormControl fullWidth sx={{ mb: 3 }}>
            <Select
              value={accountType}
              onChange={handleChange}
              sx={{
                borderRadius: 2,
                border: "2px solid #7e57c2",
                bgcolor: "#fff",
                ".MuiOutlinedInput-notchedOutline": { border: "none" },
                "&:hover .MuiOutlinedInput-notchedOutline": { border: "none" },
                "& .MuiSelect-icon": { color: "#7e57c2" },
              }}
            >
              {roles.map((role) => (
                <MenuItem key={role.value} value={role.value}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    {role.icon}
                    {role.label}
                  </Box>
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Button
            fullWidth
            variant="contained"
            onClick={handleProceed}
            sx={{
              bgcolor: "#7e57c2",
              color: "#fff",
              fontWeight: "bold",
              "&:hover": { bgcolor: "#9575cd" },
              borderRadius: 10,
              py: 1.5,
              fontSize: "1rem",
            }}
          >
            {AccountSelection.PROCEED_BUTTON}
          </Button>
        </Box>
      </Box>
    </>
  );
};

export default AccountTypeSelection;
