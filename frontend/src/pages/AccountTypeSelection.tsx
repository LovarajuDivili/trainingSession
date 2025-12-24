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
import Header from "../components/Header";
import "../components/Header.scss";

const HEADER_HEIGHT = 64;
const selectFieldSx = {
  "& .MuiOutlinedInput-root": {
    "& fieldset": { borderColor: "#e0e0e0" },
    "&:hover fieldset": { borderColor: "#e0e0e0" },
    "&.Mui-focused fieldset": { borderColor: "#e0e0e0" },
  },
};

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

    if (accountType === "Accountant") {
      navigate("/accountant");
      return;
    }
    if (accountType === "AI Tools") {
      navigate("/dashboard/ai-tools/dashboard");
      return;
    }

    navigate(`/dashboard/${accountType.toLowerCase()}/dashboard`);
  };

  return (
    <>
      <Header onMenuClick={handleLogout} />

      <Box
        sx={{
          mt: `${HEADER_HEIGHT}px`,
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
            <Typography
              component="span"
              sx={{ fontWeight: 600, color: "#906aff" }}
            >
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
              displayEmpty
              sx={{
                borderRadius: "16px",
                backgroundColor: "#ffffff",
                ...selectFieldSx,
                "& .MuiSelect-icon": { color: "#906aff" },
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#e0e0e0",
                },
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#e0e0e0",
                },
                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#e0e0e0",
                },
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
              borderRadius: 2,
            }}
          >
            {AccountSelection.PROCEED_BUTTON}
          </Button>
        </Box>
      </Box>

      <Dialog open={logoutConfirmOpen} onClose={cancelLogout}>
        <DialogTitle>{LogoutDialog.CONFIRM_TITLE}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {LogoutDialog.CONFIRM_MESSAGE}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={cancelLogout}
            sx={{ color: "#906aff", fontWeight: "bold" }}
          >
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
