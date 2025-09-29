import React from "react";
import { Box, Typography } from "@mui/material";

const Statistics: React.FC = () => {
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h6" fontWeight={600}>
        Statistics Section
      </Typography>
      <Typography variant="body1" sx={{ mt: 1, color: "text.secondary" }}>
        Charts and statistics will appear here.
      </Typography>
    </Box>
  );
};

export default Statistics;
