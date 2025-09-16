import React from "react";
import { Box, Typography } from "@mui/material";

const Logs: React.FC = () => {
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h6" fontWeight={600}>
        Logs Section
      </Typography>
      <Typography variant="body1" sx={{ mt: 1, color: "text.secondary" }}>
        No logs available.
      </Typography>
    </Box>
  );
};

export default Logs;
