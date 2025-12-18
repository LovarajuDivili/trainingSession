import * as React from "react";
import { TextField, Button, Box, Typography, Paper } from "@mui/material";
import { apiRequest } from "../Services/apiService";

interface ForgotPasswordResetProps {
  email: string;
  onResetComplete: () => void;
}

const ForgotPasswordReset: React.FC<ForgotPasswordResetProps> = (props) => {
  const [resetCode, setResetCode] = React.useState("");
  const [newPassword, setNewPassword] = React.useState("");
  const [reenterPassword, setReenterPassword] = React.useState("");
  const [message, setMessage] = React.useState("");
  const [isSuccess, setIsSuccess] = React.useState(false);

  React.useEffect(() => {
    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";
    return () => {
      document.documentElement.style.overflow = "";
      document.body.style.overflow = "";
    };
  }, []);

  const inputSx = {
    fontSize: 14,
    height: 56,
    borderRadius: 2,
    background: "#fff",
    boxSizing: "border-box",
  };

  /* ================= RESET PASSWORD ================= */
  const handleResetPassword = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (newPassword !== reenterPassword) {
      setMessage("Passwords do not match.");
      setIsSuccess(false);
      return;
    }

    try {
      const res = await apiRequest<
        { message?: string },
        {
          email: string;
          resetCode: string;
          newPassword: string;
        }
      >({
        endpoint: "/api/auth/reset-password",
        method: "POST",
        payload: {
          email: props.email,
          resetCode,
          newPassword,
        },
      });

      setMessage(res?.message || "Password reset completed.");
      setIsSuccess(true);

      setTimeout(() => props.onResetComplete(), 2000);
    } catch (err: any) {
      setMessage(err?.message || "Password reset failed.");
      setIsSuccess(false);
    }
  };

  const isFormComplete =
    resetCode.trim() && newPassword.trim() && reenterPassword.trim();

  /* ================= UI (UNCHANGED) ================= */
  return (
    <Box
      sx={{
        position: "fixed",
        inset: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#fafbfc",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      <Paper
        elevation={3}
        sx={{
          width: 480,
          maxWidth: "95vw",
          p: 4,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          borderRadius: 2,
          boxSizing: "border-box",
          fontSize: 14,
        }}
      >
        <Box sx={{ width: "100%" }}>
          <Typography
            variant="h5"
            align="center"
            fontWeight={700}
            mb={3}
            sx={{ fontSize: 14 }}
          >
            Reset Password
          </Typography>

          <form onSubmit={handleResetPassword}>
            <Typography sx={{ fontWeight: 500, fontSize: 14 }}>
              Reset Code
            </Typography>

            <TextField
              value={resetCode}
              onInput={(e) =>
                setResetCode((e.target as HTMLInputElement).value)
              }
              fullWidth
              margin="dense"
              required
              placeholder="Reset Code"
              InputProps={{ sx: inputSx }}
            />

            <Typography sx={{ fontWeight: 500, fontSize: 14, mt: 2 }}>
              New Password
            </Typography>

            <TextField
              type="password"
              value={newPassword}
              onInput={(e) =>
                setNewPassword((e.target as HTMLInputElement).value)
              }
              fullWidth
              margin="dense"
              required
              placeholder="New Password"
              InputProps={{ sx: inputSx }}
            />

            <Typography sx={{ fontWeight: 500, fontSize: 14, mt: 2 }}>
              Re-enter New Password
            </Typography>

            <TextField
              type="password"
              value={reenterPassword}
              onInput={(e) =>
                setReenterPassword((e.target as HTMLInputElement).value)
              }
              fullWidth
              margin="dense"
              required
              placeholder="Re-enter New Password"
              InputProps={{ sx: inputSx }}
            />

            <Box sx={{ mt: 2 }}>
              <Button
                type="submit"
                variant="contained"
                fullWidth
                disabled={!isFormComplete || isSuccess}
                sx={{
                  background: "#906aff",
                  color: "white",
                  fontWeight: 700,
                  fontSize: 14,
                  borderRadius: 2,
                  my: 1,
                  boxShadow: "none",
                  textTransform: "none",
                }}
              >
                Reset Password
              </Button>
            </Box>

            <Box sx={{ mt: 2 }}>
              {message && (
                <Typography
                  color={isSuccess ? "success.main" : "error"}
                  align="center"
                  sx={{ fontSize: 14 }}
                >
                  {message}
                </Typography>
              )}
            </Box>
          </form>
        </Box>
      </Paper>
    </Box>
  );
};

export default ForgotPasswordReset;
