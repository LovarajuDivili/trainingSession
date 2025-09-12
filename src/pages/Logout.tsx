import { Box, Typography, Paper } from "@mui/material";

const Logout = () => {
  return (
    <Box
      sx={{
        height: "100vh",                // full height of viewport
        display: "flex",                // use flex to center content
        justifyContent: "center",      // center horizontally
        alignItems: "center",          // center vertically
        backgroundColor: "#f5f5f5",   // light background for contrast
      }}
    >
      <Paper
        elevation={3}                 // subtle shadow
        sx={{
          padding: 4,
          borderRadius: 3,
          textAlign: "center",
          minWidth: "300px",
        }}
      >
        <Typography variant="h6" sx={{ mb: 2, color: "#333" }}>
          Logout Successful
        </Typography>
        <Typography variant="body2" sx={{ color: "#666" }}>
          You have been logged out. Please login again to continue.
        </Typography>
      </Paper>
    </Box>
  );
};

export default Logout;

