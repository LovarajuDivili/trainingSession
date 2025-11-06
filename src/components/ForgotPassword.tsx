/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import * as React from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Typography,
  Box,
} from "@mui/material";
import axios from "axios";

interface ForgotPasswordProps {
  open: boolean;
  handleClose: () => void;
}

export default function ForgotPassword({
  open,
  handleClose,
}: ForgotPasswordProps) {
  const [step, setStep] = React.useState(1);
  const [email, setEmail] = React.useState("");
  const [otp, setOtp] = React.useState("");
  const [newPassword, setNewPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [message, setMessage] = React.useState("");

  const sendOtp = async () => {
    try {
      await axios.post("http://localhost:8000/v-1/application/auth/send-otp", {
        email,
      });

      setMessage("OTP sent to your email");
      setStep(2);
    } catch (err: any) {
      setMessage(err.response?.data?.detail || "Error sending OTP");
    }
  };

  const verifyOtp = async () => {
    try {
      await axios.post(
        "http://localhost:8000/v-1/application/auth/verify-otp",
        { email, otp }
      );
      setMessage("OTP Verified");
      setStep(3);
    } catch (err: any) {
      setMessage("Invalid OTP");
    }
  };

  const resetPassword = async () => {
    if (newPassword !== confirmPassword) {
      setMessage("Passwords do not match");
      return;
    }
    try {
      await axios.post(
        "http://localhost:8000/v-1/application/auth/reset-password",
        { email, newPassword }
      );
      setMessage("Password reset successful");
      setTimeout(() => {
        handleClose();
        setStep(1);
      }, 1500);
    } catch (err) {
      setMessage("Error resetting password");
    }
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Forgot Password</DialogTitle>
      <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        {step === 1 && (
          <TextField
            label="Enter Email"
            fullWidth
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        )}

        {step === 2 && (
          <TextField
            label="Enter OTP"
            fullWidth
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
          />
        )}

        {step === 3 && (
          <Box display="flex" flexDirection="column" gap={2}>
            <TextField
              type="password"
              label="New Password"
              fullWidth
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <TextField
              type="password"
              label="Confirm Password"
              fullWidth
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </Box>
        )}

        {message && (
          <Typography sx={{ color: "#906aff", textAlign: "center" }}>
            {message}
          </Typography>
        )}
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>

        {step === 1 && <Button onClick={sendOtp}>Send OTP</Button>}
        {step === 2 && <Button onClick={verifyOtp}>Verify OTP</Button>}
        {step === 3 && <Button onClick={resetPassword}>Reset Password</Button>}
      </DialogActions>
    </Dialog>
  );
}
