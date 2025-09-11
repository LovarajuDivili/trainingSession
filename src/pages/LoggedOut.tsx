import React from "react";
import { Box, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

const LoggedOut: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: "#f1ecff",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        textAlign: "center",
        px: 2,
      }}
    >
      <Typography
        variant="h4"
        mb={2}
        sx={{ color: "#906aff", fontWeight: "bold" }}
      >
        You’ve been logged out
      </Typography>

      <Typography variant="body1" mb={4} sx={{ color: "#906aff" }}>
        Click to return to the homepage
      </Typography>

      <Button
        variant="contained"
        onClick={() => navigate("/")}
        sx={{
          backgroundColor: "#906aff",
          color: "#fff",
          borderRadius: 8,
          px: 4,
          py: 1,
          fontWeight: "bold",
          textTransform: "none",
          fontSize: "1rem",
          "&:hover": {
            backgroundColor: "#ac8fff",
          },
        }}
      >
        Return to Home
      </Button>
    </Box>
  );
};

export default LoggedOut;