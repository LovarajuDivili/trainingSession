import React, { useState, useContext, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { UserContext } from "../components/Context";
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Divider,
  InputAdornment,
} from "@mui/material";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { apiRequest } from "../Services/apiService";

const Login: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { setUser, setToken } = useContext(UserContext);
  const state = location.state as { message?: string } | null;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [blockedMessage, setBlockedMessage] = useState("");

  useEffect(() => {
    if (localStorage.getItem("needsLoginMessage")) {
      setBlockedMessage("Please log in to continue");
      localStorage.removeItem("needsLoginMessage");
    }
  }, []);

  const enableSignIn = Boolean(email && password);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage("");
    setBlockedMessage("");

    try {
      const data = await apiRequest<
        { user: any; token: string },
        { email: string; password: string }
      >({
        endpoint: "/api/auth/login",
        method: "POST",
        payload: { email, password },
      });

      localStorage.setItem("user", JSON.stringify(data.user));
      localStorage.setItem("token", data.token);

      setUser(data.user);
      setToken(data.token);

      navigate("/account-type-selection", { replace: true });
    } catch (err: any) {
      setErrorMessage(err?.message || "Invalid credentials");
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #f5f7ff, #ecebff)",
        px: 2,
      }}
    >
      <Paper
        elevation={6}
        sx={{
          width: 400,
          p: 4,
          borderRadius: 4,
        }}
      >
        <Typography variant="h5" fontWeight={700} align="center" mb={1}>
          Welcome Back
        </Typography>

        <Typography
          variant="body2"
          align="center"
          color="text.secondary"
          mb={3}
        >
          Please sign in to your account
        </Typography>

        {state?.message && (
          <Typography color="error" align="center" mb={2}>
            {state.message}
          </Typography>
        )}

        <form onSubmit={handleSubmit}>
          <TextField
            label="Email address"
            type="email"
            fullWidth
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            margin="normal"
            required
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <EmailOutlinedIcon fontSize="small" />
                </InputAdornment>
              ),
            }}
          />

          <TextField
            label="Password"
            type="password"
            fullWidth
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            margin="normal"
            required
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LockOutlinedIcon fontSize="small" />
                </InputAdornment>
              ),
            }}
          />

          <Box display="flex" justifyContent="flex-end" mt={1}>
            <Typography
              variant="body2"
              sx={{ cursor: "pointer", color: "primary.main" }}
              onClick={() => navigate("/forgot-password")}
            >
              Forgot password?
            </Typography>
          </Box>

          {errorMessage && (
            <Typography color="error" mt={2} align="center">
              {errorMessage}
            </Typography>
          )}

          {blockedMessage && (
            <Typography color="error" mt={2} align="center">
              {blockedMessage}
            </Typography>
          )}

          <Button
            type="submit"
            fullWidth
            variant="contained"
            disabled={!enableSignIn}
            sx={{
              mt: 3,
              py: 1.2,
              borderRadius: 3,
              fontWeight: 600,
              textTransform: "none",
            }}
          >
            Sign In
          </Button>
        </form>

        <Divider sx={{ my: 3 }} />

        <Typography variant="body2" align="center">
          Don’t have an account?{" "}
          <Typography
            component="span"
            sx={{
              color: "primary.main",
              fontWeight: 600,
              cursor: "pointer",
            }}
            onClick={() => navigate("/register")}
          >
            Create account
          </Typography>
        </Typography>
      </Paper>
    </Box>
  );
};

export default Login;
