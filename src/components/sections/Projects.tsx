import React from "react";
import { Box, Typography } from "@mui/material";

const Projects: React.FC = () => {
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h6" fontWeight={600}>
        Projects Section
      </Typography>
      <Typography variant="body1" sx={{ mt: 1, color: "text.secondary" }}>
        No projects added yet.
      </Typography>
    </Box>
  );
};

export default Projects;
