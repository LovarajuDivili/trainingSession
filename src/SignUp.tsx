/* eslint-disable @typescript-eslint/no-explicit-any */
import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
//import Checkbox from "@mui/material/Checkbox";
import Divider from "@mui/material/Divider";
//import FormControlLabel from "@mui/material/FormControlLabel";
import FormLabel from "@mui/material/FormLabel";
import FormControl from "@mui/material/FormControl";
import Link from "@mui/material/Link";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import MuiCard from "@mui/material/Card";
import { styled } from "@mui/material/styles";
import AppTheme from "./common/AppTheme";
import { useNavigate } from "react-router-dom";
import { Alert, CircularProgress, Snackbar } from "@mui/material";
import { useAuth } from "./contexts/AuthContext";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import sha256 from "crypto-js/sha256";
import MenuItem from "@mui/material/MenuItem";

const Card = styled(MuiCard)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignSelf: "center",
  width: "100%",
  padding: theme.spacing(4),
  gap: theme.spacing(2),
  margin: "auto",
  boxShadow:
    "hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px",
  [theme.breakpoints.up("sm")]: {
    width: "450px",
  },
  ...theme.applyStyles("dark", {
    boxShadow:
      "hsla(220, 30%, 5%, 0.5) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.08) 0px 15px 35px -5px",
  }),
}));

const SignUpContainer = styled(Stack)(({ theme }) => ({
  height: "calc((1 - var(--template-frame-height, 0)) * 100dvh)",
  minHeight: "100%",
  padding: theme.spacing(2),
  [theme.breakpoints.up("sm")]: {
    padding: theme.spacing(4),
  },

  backgroundImage: 'url("/public/aifaBG.jpg")',
  backgroundSize: "100% 100%",
  backgroundPosition: "center",
  backgroundRepeat: "no-repeat",
  position: "relative",
  border: "none",
  "&::before": {
    content: '""',
    display: "block",
    position: "absolute",
    zIndex: -1,
    inset: 0,
    background: "rgba(0,0,0,0.3)",
    ...theme.applyStyles("dark", {
      background: "rgba(0,0,0,0.5)",
    }),
  },
}));

export default function SignUp(props: { disableCustomTheme?: boolean }) {
  const navigate = useNavigate();
  const { signup, isSigningUp: contextIsSigningUp } = useAuth();
  const [isLoading, setIsLoading] = React.useState(false);
  const [emailError, setEmailError] = React.useState(false);
  const [emailErrorMessage, setEmailErrorMessage] = React.useState("");
  const [passwordError, setPasswordError] = React.useState(false);
  const [passwordErrorMessage, setPasswordErrorMessage] = React.useState("");
  const [nameError, setNameError] = React.useState(false);
  const [nameErrorMessage, setNameErrorMessage] = React.useState("");
  const [error, setError] = React.useState("");
  const [success, setSuccess] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(false);
  const [role, setRole] = React.useState("");
  const [roleError, setRoleError] = React.useState(false);
  const [roleErrorMessage, setRoleErrorMessage] = React.useState("");

  const isSigningUp = contextIsSigningUp || isLoading;

  React.useEffect(() => {
    const token = sessionStorage.getItem("token");
    if (token) {
      navigate("/welcome", { replace: true });
    }
  }, [navigate]);
  const validateInputs = () => {
    const email = document.getElementById("email") as HTMLInputElement;
    const password = document.getElementById("password") as HTMLInputElement;
    const name = document.getElementById("name") as HTMLInputElement;

    let isValid = true;

    if (!email.value || !/\S+@\S+\.\S+/.test(email.value)) {
      setEmailError(true);
      setEmailErrorMessage("Please enter a valid email address.");
      isValid = false;
    } else {
      setEmailError(false);
      setEmailErrorMessage("");
    }

    if (!password.value) {
      setPasswordError(true);
      setPasswordErrorMessage("Password is required.");
      isValid = false;
    } else {
      const hasMinLength = password.value.length >= 6;
      const hasUpperCase = /[A-Z]/.test(password.value);
      const hasNumber = /[0-9]/.test(password.value);
      const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password.value);

      if (!hasMinLength || !hasUpperCase || !hasNumber || !hasSpecialChar) {
        setPasswordError(true);

        let message = "Password must have:";
        if (!hasMinLength) message += " at least 6 characters,";
        if (!hasUpperCase) message += " one uppercase letter,";
        if (!hasNumber) message += " one number,";
        if (!hasSpecialChar) message += " one special character,";

        message = message.replace(/,$/, ".");
        setPasswordErrorMessage(message);

        isValid = false;
      } else {
        setPasswordError(false);
        setPasswordErrorMessage("");
      }
    }

    if (!name.value || name.value.length < 1) {
      setNameError(true);
      setNameErrorMessage("Name is required.");
      isValid = false;
    } else {
      setNameError(false);
      setNameErrorMessage("");
    }

    if (!role) {
      setRoleError(true);
      setRoleErrorMessage("Please select a role.");
      isValid = false;
    } else {
      setRoleError(false);
      setRoleErrorMessage("");
    }

    return isValid;
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!validateInputs()) return;

    const data = new FormData(event.currentTarget);
    const name = data.get("name") as string;
    const email = data.get("email") as string;
    const password = data.get("password") as string;
    const selectedRole = role;

    setIsLoading(true);
    setError("");

    try {
      const shaHashedPassword = sha256(password).toString();

      await signup(name, email, shaHashedPassword, selectedRole);

      setSuccess("Account created! Redirecting to login...");
      setTimeout(() => navigate("/signin"), 2000);
    } catch (error: any) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };

  return (
    <AppTheme {...props}>
      <SignUpContainer
        direction="column"
        justifyContent="space-between"
        sx={{
          height: "91.2vh",
        }}
      >
        <Card
          // variant="outlined"
          sx={{
            width: "100%",
            maxWidth: 400,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Box
              component="img"
              src="/chat.svg"
              alt="Custom Icon"
              sx={{
                width: 30,
                height: 30,
              }}
            />
            <Typography
              component="h6"
              variant="h6"
              sx={{
                width: "100%",
                fontSize: "1.5rem",
                color: "#906aff",
              }}
            >
              Aifa
            </Typography>
          </Box>
          <Typography
            component="h1"
            variant="h4"
            sx={{ width: "100%", fontSize: "clamp(2rem, 10vw, 2.15rem)" }}
          >
            Sign up
          </Typography>
          <Snackbar
            open={!!success}
            autoHideDuration={3000}
            onClose={() => setSuccess("")}
            anchorOrigin={{ vertical: "top", horizontal: "center" }}
          >
            <Alert
              onClose={() => setSuccess("")}
              severity="success"
              sx={{ width: "100%" }}
            >
              {success}
            </Alert>
          </Snackbar>
          <Snackbar
            open={!!error}
            autoHideDuration={6000}
            onClose={() => setError("")}
            anchorOrigin={{ vertical: "top", horizontal: "center" }}
          >
            <Alert
              onClose={() => setError("")}
              severity="error"
              sx={{ width: "100%" }}
            >
              {error}
            </Alert>
          </Snackbar>
          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{ display: "flex", flexDirection: "column", gap: 2 }}
          >
            <FormControl>
              <FormLabel htmlFor="name">Full name</FormLabel>
              <TextField
                autoComplete="name"
                name="name"
                required
                fullWidth
                id="name"
                placeholder="Enter your name"
                error={nameError}
                helperText={nameErrorMessage}
                color={nameError ? "error" : "primary"}
                disabled={isSigningUp}
              />
            </FormControl>
            <FormControl>
              <FormLabel htmlFor="email">Email</FormLabel>
              <TextField
                required
                fullWidth
                id="email"
                placeholder="Enter your email"
                name="email"
                autoComplete="email"
                variant="outlined"
                error={emailError}
                helperText={emailErrorMessage}
                color={emailError ? "error" : "primary"}
                disabled={isSigningUp}
              />
            </FormControl>
            <FormControl>
              <FormLabel htmlFor="role">Role</FormLabel>
              <TextField
                id="role"
                name="role"
                select
                required
                fullWidth
                value={role}
                onChange={(e) => setRole(e.target.value)}
                error={roleError}
                helperText={roleErrorMessage}
                disabled={isSigningUp}
              >
                <MenuItem value="">Select a role</MenuItem>
                <MenuItem value="Admin">Admin</MenuItem>
                <MenuItem value="Accountant">Accountant</MenuItem>
                <MenuItem value="Developer">Developer</MenuItem>
                <MenuItem value="Tester">Tester</MenuItem>
                <MenuItem value="Migrator">Migrator</MenuItem>
              </TextField>
            </FormControl>
            <FormControl>
              <FormLabel htmlFor="password">Password</FormLabel>
              <TextField
                required
                fullWidth
                name="password"
                placeholder="Enter your password"
                type={showPassword ? "text" : "password"}
                id="password"
                autoComplete="new-password"
                variant="outlined"
                error={passwordError}
                helperText={passwordErrorMessage}
                color={passwordError ? "error" : "primary"}
                disabled={isSigningUp}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label={
                          showPassword ? "hide password" : "show password"
                        }
                        onClick={handleClickShowPassword}
                        onMouseDown={handleMouseDownPassword}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </FormControl>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={isSigningUp}
              sx={{ backgroundColor: "#906aff" }}
              startIcon={
                isSigningUp ? (
                  <CircularProgress size={16} color="inherit" />
                ) : null
              }
            >
              {isSigningUp ? "Creating account..." : "Sign up"}
            </Button>
          </Box>
          <Divider>
            <Typography sx={{ color: "text.secondary" }}>or</Typography>
          </Divider>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <Typography sx={{ textAlign: "center" }}>
              Already have an account?{" "}
              <Link
                component="button"
                type="button"
                onClick={() => navigate("/signin")}
                variant="body2"
                sx={{
                  alignSelf: "center",
                  cursor: "pointer",
                  color: "#906aff",
                }}
              >
                Sign in
              </Link>
            </Typography>
          </Box>
        </Card>
      </SignUpContainer>
    </AppTheme>
  );
}
