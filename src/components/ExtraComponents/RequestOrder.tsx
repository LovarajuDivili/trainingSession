import { Box, Typography, Button, TextField } from "@mui/material";
import { useNavigate } from "react-router-dom";

const RequestOrder = () => {
  const navigate = useNavigate();

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h5" fontWeight={700} gutterBottom>
        Request New Order
      </Typography>

      <Typography variant="body1" sx={{ mb: 3 }}>
        Fill in the details below to request a new order.
      </Typography>

      <Box
        component="form"
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 2,
          maxWidth: 400,
        }}
      >
        <TextField label="Order Name" variant="outlined" fullWidth />
        <TextField
          label="Description"
          variant="outlined"
          fullWidth
          multiline
          rows={3}
        />
        <TextField
          label="Quantity"
          type="number"
          variant="outlined"
          fullWidth
        />

        <Button
          variant="contained"
          sx={{
            mt: 2,
            backgroundColor: "#906aff",
            textTransform: "none",
            fontWeight: 600,
            "&:hover": { backgroundColor: "#7a5de0" },
          }}
        >
          Submit Request
        </Button>

        <Button
          onClick={() => navigate(-1)}
          sx={{ mt: 1, textTransform: "none", color: "#906aff" }}
        >
          ← Back to My Orders
        </Button>
      </Box>
    </Box>
  );
};

export default RequestOrder;
