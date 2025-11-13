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
import sha256 from "crypto-js/sha256";
import { CircularProgress } from "@mui/material";
import type { ForgotPasswordProps } from "../common/types";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

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
  const [loadingSend, setLoadingSend] = React.useState(false);
  const [loadingVerify, setLoadingVerify] = React.useState(false);
  const [loadingReset, setLoadingReset] = React.useState(false);

  const sendOtp = async () => {
    setLoadingSend(true);
    try {
      await axios.post(`${API_BASE_URL}/v-1/application/auth/send-otp`, {
        email,
      });

      setMessage("OTP sent to your email");
      setStep(2);
    } catch (err: any) {
      setMessage(err.response?.data?.detail || "Error sending OTP");
    } finally {
      setLoadingSend(false);
    }
  };

  const verifyOtp = async () => {
    setLoadingVerify(true);
    try {
      await axios.post(`${API_BASE_URL}/v-1/application/auth/verify-otp`, {
        email,
        otp,
      });
      setMessage("OTP Verified");
      setStep(3);
    } catch (err: any) {
      setMessage("Invalid OTP");
    } finally {
      setLoadingVerify(false);
    }
  };

  const resetPassword = async () => {
    if (newPassword !== confirmPassword) {
      setMessage("Passwords do not match");
      return;
    }
    setLoadingReset(true);
    try {
      const shaHashedPassword = sha256(newPassword).toString();
      await axios.post(`${API_BASE_URL}/v-1/application/auth/reset-password`, {
        email,
        newPassword: shaHashedPassword,
      });
      setMessage("Password reset successful");
      setTimeout(() => {
        handleClose();
        setStep(1);
      }, 1500);
    } catch (err) {
      setMessage("Error resetting password");
    } finally {
      setLoadingReset(false);
    }
  };

  const resetAll = () => {
    setStep(1);
    setEmail("");
    setOtp("");
    setNewPassword("");
    setConfirmPassword("");
    setMessage("");
    setLoadingSend(false);
    setLoadingVerify(false);
    setLoadingReset(false);
  };

  const onCancel = () => {
    resetAll();
    handleClose();
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
            sx={{ width: 400, mt: 1 }}
          />
        )}

        {step === 2 && (
          <TextField
            label="Enter OTP"
            fullWidth
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            sx={{ width: 400, mt: 1 }}
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
              sx={{ width: 400, mt: 1 }}
            />
            <TextField
              type="password"
              label="Confirm Password"
              fullWidth
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              sx={{ width: 400, mt: 1 }}
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
        <Button onClick={onCancel}>Cancel</Button>
        {step === 1 && (
          <Button onClick={sendOtp} disabled={loadingSend}>
            {loadingSend ? <CircularProgress size={20} /> : "Send OTP"}
          </Button>
        )}

        {step === 2 && (
          <Button onClick={verifyOtp} disabled={loadingVerify}>
            {loadingVerify ? <CircularProgress size={20} /> : "Verify OTP"}
          </Button>
        )}

        {step === 3 && (
          <Button onClick={resetPassword} disabled={loadingReset}>
            {loadingReset ? <CircularProgress size={20} /> : "Reset Password"}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
}
