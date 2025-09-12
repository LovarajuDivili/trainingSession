import React from "react";
import { Typography, Box, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

const LogoutSuccess: React.FC = () => {
  const navigate = useNavigate();
  return (
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        gap: 2,
      }}
    >
      <Typography variant="h4" sx={{ fontWeight: 600 }}>
        You have successfully logged out.
      </Typography>
      <Button variant="contained" onClick={() => navigate("/")}>
        Login Again
      </Button>
    </Box>
  );
};

export default LogoutSuccess;
