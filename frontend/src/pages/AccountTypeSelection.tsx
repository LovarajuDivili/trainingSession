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
  Paper,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { type SelectChangeEvent } from "@mui/material/Select";
import { roles } from "../common/dropdowns";
import { AccountSelection, LogoutDialog } from "../common/labelConstants";
import Header from "../components/Header";
import "../components/Header.scss";

const HEADER_HEIGHT = 64;

const pillFieldSx = {
  borderRadius: "50px",
  backgroundColor: "#ffffff",
  height: 52,
  "& .MuiOutlinedInput-notchedOutline": {
    borderColor: "#e0e0e0",
  },
  "&:hover .MuiOutlinedInput-notchedOutline": {
    borderColor: "#e0e0e0",
  },
  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
    borderColor: "#906aff",
  },
  "& .MuiSelect-icon": {
    color: "#906aff",
  },
};

const AccountTypeSelection: React.FC = () => {
  const [accountType, setAccountType] = useState("Admin");
  const [logoutConfirmOpen, setLogoutConfirmOpen] = useState(false);

  const navigate = useNavigate();

  const handleLogout = () => setLogoutConfirmOpen(true);
  const cancelLogout = () => setLogoutConfirmOpen(false);

  const confirmLogout = () => {
    setLogoutConfirmOpen(false);
    navigate("/logged-out");
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
          px: 2,
        }}
      >
        <Paper
          elevation={3}
          sx={{
            maxWidth: 420,
            width: "100%",
            p: 4,
            borderRadius: 4,
            textAlign: "center",
          }}
        >
          <Typography variant="body1" mb={1}>
            {AccountSelection.WELCOME}{" "}
            <Typography
              component="span"
              sx={{ fontWeight: 700, color: "#906aff" }}
            >
              {AccountSelection.PLATFORM_NAME}
            </Typography>
          </Typography>

          <Typography variant="body2" mb={3} sx={{ color: "text.secondary" }}>
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
              sx={pillFieldSx}
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
              height: 52,
              borderRadius: "50px",
              fontWeight: 700,
              backgroundColor: "#906aff",
              "&:hover": {
                backgroundColor: "#ac8fff",
              },
            }}
          >
            {AccountSelection.PROCEED_BUTTON}
          </Button>
        </Paper>
      </Box>

      <Dialog open={logoutConfirmOpen} onClose={cancelLogout}>
        <DialogTitle>{LogoutDialog.CONFIRM_TITLE}</DialogTitle>
        <DialogContent>
          <DialogContentText>{LogoutDialog.CONFIRM_MESSAGE}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={cancelLogout}
            sx={{ color: "#906aff", fontWeight: 700 }}
          >
            {LogoutDialog.CANCEL_BUTTON}
          </Button>
          <Button onClick={confirmLogout} variant="contained" color="error">
            {LogoutDialog.LOGOUT_BUTTON}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default AccountTypeSelection;
