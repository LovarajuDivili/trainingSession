import { Box, Typography, Paper } from "@mui/material";
import { Logged_Out, Logout_Success } from "../common/labelConstants";

const Logout = () => {
  return (
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f5f5f5",
      }}
    >
      <Paper
        elevation={3}
        sx={{
          padding: 4,
          borderRadius: 3,
          textAlign: "center",
          minWidth: "300px",
        }}
      >
        <Typography variant="h6" sx={{ mb: 2, color: "#333" }}>
          {Logout_Success.LOGOUT_SUCCESS}
        </Typography>
        <Typography variant="body2" sx={{ color: "#666" }}>
          {Logged_Out.LOGGED_OUT}
        </Typography>
      </Paper>
    </Box>
  );
};

export default Logout;
