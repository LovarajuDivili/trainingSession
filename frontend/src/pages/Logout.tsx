import React from "react";
import { Box, Typography, Button, Card } from "@mui/material";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import { useNavigate } from "react-router-dom";
import { LoggedOutPage } from "../common/labelConstants";

const PRIMARY = "#906aff";

const LoggedOut: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #f4f1ff, #faf9ff)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        px: 2,
      }}
    >
      <Card
        sx={{
          maxWidth: 420,
          width: "100%",
          p: 4,
          borderRadius: 4,
          textAlign: "center",
          boxShadow: "0 12px 32px rgba(144,106,255,0.18)",
        }}
      >
        <Box
          sx={{
            width: 70,
            height: 70,
            mx: "auto",
            mb: 2,
            borderRadius: "50%",
            bgcolor: "#f3efff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <LogoutRoundedIcon sx={{ fontSize: 36, color: PRIMARY }} />
        </Box>

        <Typography
          variant="h5"
          sx={{
            fontWeight: 700,
            color: "#1f1f1f",
            mb: 1,
          }}
        >
          {LoggedOutPage.TITLE}
        </Typography>

        <Typography
          variant="body2"
          sx={{
            color: "text.secondary",
            mb: 3,
            lineHeight: 1.6,
          }}
        >
          {LoggedOutPage.DESCRIPTION}
        </Typography>

        <Button
          fullWidth
          variant="contained"
          onClick={() => navigate("/login")}
          sx={{
            backgroundColor: PRIMARY,
            borderRadius: 999,
            py: 1.4,
            fontWeight: 600,
            textTransform: "none",
            fontSize: "0.95rem",
            boxShadow: "0 8px 20px rgba(144,106,255,0.35)",
            "&:hover": {
              backgroundColor: "#7a53e3",
            },
          }}
        >
          {LoggedOutPage.RETURN_HOME}
        </Button>
      </Card>
    </Box>
  );
};

export default LoggedOut;
