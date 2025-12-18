import * as React from "react";
import { TextField, Button, Box, Typography, Paper } from "@mui/material";
import { apiRequest } from "../Services/apiService";

interface ForgotPasswordRequestProps {
  onOTPSent: (email: string) => void;
}

const ForgotPasswordRequest: React.FC<ForgotPasswordRequestProps> = (props) => {
  const [email, setEmail] = React.useState("");
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

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage("");
    setIsSuccess(false);

    try {
      const res = await apiRequest<
        {
          message?: string;
        },
        { email: string }
      >({
        endpoint: "/api/auth/forgot-password",
        method: "POST",
        payload: { email },
      });

      setMessage(res?.message || "Code sent to your email");
      setIsSuccess(true);

      setTimeout(() => props.onOTPSent(email), 8000);
    } catch (err: any) {
      setMessage(err?.message || "Failed to send Code");
      setIsSuccess(false);
    }
  };

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
            Forgot Password
          </Typography>

          <form onSubmit={handleSubmit}>
            <Typography
              sx={{ fontWeight: 500, fontSize: 14, mb: 0, lineHeight: 1.2 }}
            >
              Email
            </Typography>

            <TextField
              type="email"
              value={email}
              onInput={(e) => setEmail((e.target as HTMLInputElement).value)}
              fullWidth
              margin="dense"
              required
              variant="outlined"
              placeholder="Email"
              InputProps={{ sx: inputSx }}
              sx={{ mt: 0, mb: 0, borderRadius: 2, fontSize: 14 }}
              inputProps={{ style: { fontSize: 14 } }}
            />

            <Box sx={{ mt: 2 }}>
              <Button
                type="submit"
                variant="contained"
                fullWidth
                disabled={!email}
                sx={{
                  background: "#906aff",
                  color: "white",
                  fontWeight: 700,
                  letterSpacing: 1,
                  fontSize: 14,
                  borderRadius: 2,
                  my: 1,
                  boxShadow: "none",
                  textTransform: "none",
                }}
              >
                Send Code
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

export default ForgotPasswordRequest;
