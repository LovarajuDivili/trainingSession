import React from "react";
import { Box, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

const LogoutSuccess: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        textAlign: "center",
        mt: 10,
      }}
    >
      <Typography
        variant="h5"
        sx={{ fontWeight: 600, color: "#4b2db7", mb: 3 }}
      >
        You are successfully logged out!
      </Typography>
      <Button
        variant="contained"
        sx={{
          background: "linear-gradient(90deg, #906aff, #ac8fff)",
          color: "#fff",
          fontWeight: 600,
          borderRadius: 3,
          px: 4,
          "&:hover": { opacity: 0.9 },
        }}
        onClick={() => navigate("/")}
      >
        Go Back to Login
      </Button>
    </Box>
  );
};

export default LogoutSuccess;
