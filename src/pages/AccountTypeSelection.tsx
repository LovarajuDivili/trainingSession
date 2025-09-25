import React, { useState } from "react";
import {
  Box,
  Button,
  Select,
  MenuItem,
  FormControl,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Typography,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { type SelectChangeEvent } from "@mui/material/Select";
import { roles } from "../common/dropdowns";
import { AccountSelection, LogoutDialog } from "../common/labelConstants";
import Header from "../components/Header"; // ✅ Import Header
import "../components/Header.scss"; // Header styles

const HEADER_HEIGHT = 64;

const AccountTypeSelection: React.FC = () => {
  const [accountType, setAccountType] = useState("Admin");
  const [logoutConfirmOpen, setLogoutConfirmOpen] = useState(false);

  const navigate = useNavigate();

  const handleLogout = () => {
    setLogoutConfirmOpen(true);
  };

  const confirmLogout = () => {
    setLogoutConfirmOpen(false);
    navigate("/logged-out");
  };

  const cancelLogout = () => {
    setLogoutConfirmOpen(false);
  };

  const handleChange = (event: SelectChangeEvent) => {
    setAccountType(event.target.value as string);
  };

  const handleProceed = () => {
    localStorage.setItem("accountType", accountType);
    navigate(`/dashboard/${accountType.toLowerCase()}`);
  };

  return (
    <>
      {/* Header */}
      <Header onMenuClick={handleLogout} />

      {/* Main Content Area with scroll and padding to accommodate header */}
      <Box
        sx={{
          mt: `${HEADER_HEIGHT}px`, // Push content below fixed header
          minHeight: `calc(100vh - ${HEADER_HEIGHT}px)`,
          backgroundColor: "#f8f9fa",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          px: 3,
          overflowY: "auto",
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

          <Typography
            variant="subtitle2"
            sx={{ textAlign: "left", mb: 1, fontWeight: 600 }}
          >
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
              "&:hover": {
                bgcolor: "#ac8fff",
              },
              borderRadius: 10,
            }}
          >
            {AccountSelection.PROCEED_BUTTON}
          </Button>
        </Box>
      </Box>

      {/* Logout Confirmation Dialog */}
      <Dialog open={logoutConfirmOpen} onClose={cancelLogout}>
        <DialogTitle>{LogoutDialog.CONFIRM_TITLE}</DialogTitle>
        <DialogContent>
          <DialogContentText>{LogoutDialog.CONFIRM_MESSAGE}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={cancelLogout} sx={{ color: "#906aff", fontWeight: "bold" }}>
            {LogoutDialog.CANCEL_BUTTON}
          </Button>
          <Button onClick={confirmLogout} color="error" variant="contained">
            {LogoutDialog.LOGOUT_BUTTON}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default AccountTypeSelection;
