/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Box, CircularProgress, Alert } from "@mui/material";
import { useAuth } from "./contexts/AuthContext";

export default function GoogleCallback() {
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  useEffect(() => {
    const handleGoogleCallback = async () => {
      const queryParams = new URLSearchParams(location.search);
      const token = queryParams.get("token");
      const userData = queryParams.get("user");

      if (token && userData) {
        try {
          // Parse user data
          const user = JSON.parse(decodeURIComponent(userData));

          // Store in sessionStorage
          sessionStorage.setItem("token", token);
          sessionStorage.setItem("user", JSON.stringify(user));

          // Redirect to welcome page
          navigate("/welcome", { replace: true });
        } catch (err) {
          setError("Failed to process Google login");
          setTimeout(() => navigate("/signin"), 3000);
        }
      } else {
        // If not redirected with token, fetch from backend
        try {
          const response = await fetch(
            "http://localhost:8000/v-1/application/auth/google/callback" +
              location.search
          );

          if (response.ok) {
            const data = await response.json();

            // Store tokens and user data
            sessionStorage.setItem("token", data.access_token);
            sessionStorage.setItem("user", JSON.stringify(data.user));

            // Redirect to welcome page
            navigate("/welcome", { replace: true });
          } else {
            setError("Google authentication failed");
            setTimeout(() => navigate("/signin"), 3000);
          }
        } catch (err) {
          setError("Network error during Google login");
          setTimeout(() => navigate("/signin"), 3000);
        }
      }
    };

    handleGoogleCallback();
  }, [navigate, location]);

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      height="100vh"
      flexDirection="column"
      gap={3}
    >
      {error ? (
        <>
          <Alert severity="error">{error}</Alert>
          <p>Redirecting to login page...</p>
        </>
      ) : (
        <>
          <CircularProgress />
          <p>Completing Google sign-in...</p>
        </>
      )}
    </Box>
  );
}
