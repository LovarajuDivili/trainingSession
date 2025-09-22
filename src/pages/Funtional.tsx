import { Box, Typography } from "@mui/material";
//import React from 'react'
import Header from "../components/Header";

const Functional = () => {
  return (
    <Box mt={5}>
      <Header role={""} />
      <Typography variant="h6" sx={{ marginTop: "100px" }}>
        Under Progress
      </Typography>
    </Box>
  );
};

export default Functional;
