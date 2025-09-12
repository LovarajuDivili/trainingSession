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
    alert(`Proceeding as: ${accountType}`);
  };

  return (
    <>
      {/* Header */}
      <AppBar position="static" sx={{ bgcolor: "#906aff", borderRadius: 0 }}>
        <Toolbar
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            paddingLeft: 2,
            paddingRight: 2,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <img src="/chat.svg" alt="Chat Icon" style={{ width: 20, height: 20 }} />
            <Typography variant="h6" sx={{ fontWeight: "600", color: "#fff" }}>
              AiFA
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
              >
                <AccountCircleIcon sx={{ fontSize: 32, color: "#906aff" }} />
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
                minWidth: 150,
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
                fontWeight: "600",
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
              color: "#906aff",
              fontWeight: "bold",
              textTransform: "none",
              border: "1px solid #906aff",
              borderRadius: 2,
              px: 2,
              "&:hover": {
                backgroundColor: "#f1ecff",
                borderColor: "#ac8fff",
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
          backgroundColor: "#f8f9fa",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          px: 3,
        }}
      >
        <Box sx={{ maxWidth: 400, width: "100%" }}>
          <Typography variant="body1" mb={1} sx={{ color: "#000000" }}>
            {AccountSelection.WELCOME}{" "}
            <Typography component="span" sx={{ fontWeight: 600, color: "#906aff" }}>
              {AccountSelection.PLATFORM_NAME}
            </Typography>
          </Typography>

          <Typography variant="body2" mb={2} sx={{ color: "#000000" }}>
            {AccountSelection.SELECT_PROMPT}
          </Typography>

          <Typography variant="subtitle2" sx={{ textAlign: "left", mb: 1, fontWeight: 600 }}>
            {AccountSelection.ACCOUNT_TYPE_LABEL}
          </Typography>

          <FormControl fullWidth sx={{ mb: 3 }}>
            <Select
              value={accountType}
              onChange={handleChange}
              sx={{
                borderRadius: 2,
                border: "2px solid #906aff",
                backgroundColor: "#fff",
                ".MuiOutlinedInput-notchedOutline": { border: "none" },
                "&:hover .MuiOutlinedInput-notchedOutline": { border: "none" },
                "& .MuiSelect-icon": { color: "#906aff" },
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
              bgcolor: "#906aff",
              color: "#fff",
              fontWeight: "bold",
              "&:hover": { bgcolor: "#ac8fff" },
              borderRadius: 10,
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
