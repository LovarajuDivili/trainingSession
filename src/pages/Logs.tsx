import React from "react";
import { Box, Typography } from "@mui/material";

const Logs: React.FC = () => {
  return (
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: "#f5f7fb",
      }}
    >
      <Typography variant="h5" fontWeight="bold">
        In progress.
      </Typography>
    </Box>
  );
};

export default Logs;
