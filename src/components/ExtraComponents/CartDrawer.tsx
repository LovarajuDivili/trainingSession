import {
  Box,
  Drawer,
  Typography,
  TextField,
  Button,
  Divider,
  FormControlLabel,
  Radio,
  RadioGroup,
  Grid,
} from "@mui/material";
import { useCartDrawer } from "../../context/CartDrawerContext";

const CartDrawer = () => {
  const { isDrawerOpen, closeDrawer } = useCartDrawer();

  return (
    <Drawer anchor="right" open={isDrawerOpen} onClose={closeDrawer}>
      <Box
        sx={{
          width: "85vw",
          maxWidth: "1400px",
          p: 6,
          pt: 3,
          pr: 0,
          display: "flex",
          flexDirection: "column",
          height: "100%",
          overflow: "auto",
          gap: 4,
        }}
      >
        <Box sx={{ display: "flex", gap: 6, flex: 1 }}>
          <Box sx={{ flex: 1 }}>
            <Typography
              variant="h5"
              sx={{ mb: 3, fontWeight: "bold", fontSize: "1.5rem" }}
            >
              Billing details
            </Typography>

            <Box
              sx={{
                mb: 4,
                bgcolor: "#E8E8EB",
                p: 2,
                pb: -2,
                borderRadius: "20px",
              }}
            >
              <Typography variant="body2" sx={{ mb: 2, color: "black" }}>
                If you have a coupon code, please apply it below
              </Typography>

              <Box sx={{ display: "flex", gap: 1, mb: 3 }}>
                <TextField
                  size="small"
                  placeholder="Enter coupon code"
                  sx={{ flex: 1 }}
                />
                <Button
                  variant="outlined"
                  sx={{
                    whiteSpace: "nowrap",
                    bgcolor: "green",
                    color: "white",
                  }}
                >
                  Apply coupon
                </Button>
              </Box>
            </Box>

            <Grid container spacing={2} sx={{ mb: 3 }}>
              <Grid item xs={6}>
                <Typography
                  variant="body2"
                  sx={{ mb: 1, fontWeight: "medium" }}
                >
                  First Name *
                </Typography>
                <TextField fullWidth size="small" sx={{ width: 285 }} />
              </Grid>
              <Grid item xs={6}>
                <Typography
                  variant="body2"
                  sx={{ mb: 1, fontWeight: "medium" }}
                >
                  Last Name *
                </Typography>
                <TextField fullWidth size="small" sx={{ width: 285 }} />
              </Grid>
            </Grid>

            {/* Phone */}
            <Typography variant="body2" sx={{ mb: 1, fontWeight: "medium" }}>
              Phone Number *
            </Typography>
            <TextField fullWidth size="small" sx={{ mb: 3 }} />

            {/* Email */}
            <Typography variant="body2" sx={{ mb: 1, fontWeight: "medium" }}>
              Email Address *
            </Typography>
            <TextField fullWidth size="small" sx={{ mb: 3 }} />

            {/* Address Information */}
            <Typography
              variant="h5"
              sx={{ mb: 3, fontWeight: "bold", fontSize: "1.5rem" }}
            >
              Address information
            </Typography>

            <Typography variant="body2" sx={{ mb: 1, fontWeight: "medium" }}>
              House Number
            </Typography>
            <TextField fullWidth size="small" sx={{ mb: 3 }} />

            <Typography variant="body2" sx={{ mb: 1, fontWeight: "medium" }}>
              City
            </Typography>
            <TextField fullWidth size="small" sx={{ mb: 3 }} />

            <Typography variant="body2" sx={{ mb: 1, fontWeight: "medium" }}>
              District
            </Typography>
            <TextField fullWidth size="small" sx={{ mb: 3 }} />

            <Typography variant="body2" sx={{ mb: 1, fontWeight: "medium" }}>
              Postal Code
            </Typography>
            <TextField fullWidth size="small" sx={{ mb: 3 }} />
          </Box>

          {/* Right Column */}
          <Box sx={{ flex: 1, bgcolor: "#E8E8EB", p: 4 }}>
            <Typography
              variant="h5"
              sx={{ mb: 3, fontWeight: "bold", fontSize: "1.5rem", p: 0.5 }}
            >
              Your order
            </Typography>

            <Box
              sx={{
                borderColor: "divider",
                borderRadius: 2,
                p: 1,
                mb: 4,
              }}
            >
              <Box sx={{ mb: 3 }}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mb: 2,
                  }}
                >
                  <Typography variant="body1">Laptop x 1</Typography>
                  <Typography variant="body1" fontWeight="medium">
                    169,790 
                  </Typography>
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mb: 3,
                  }}
                >
                  <Typography variant="body1">Head Phones x 1</Typography>
                  <Typography variant="body1" fontWeight="medium">
                    24,990
                  </Typography>
                </Box>
                <Divider />
              </Box>

              <Box sx={{ mb: 2 }}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mb: 1,
                  }}
                >
                  <Typography variant="body2">Subtotal</Typography>
                  <Typography variant="body2">194,780 </Typography>
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mb: 1,
                  }}
                >
                  <Typography variant="body2">Shipping</Typography>
                  <Typography variant="body2" color="success.main">
                    Free shipping
                  </Typography>
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mb: 2,
                  }}
                >
                  <Typography variant="body2">VAT</Typography>
                  <Typography variant="body2">52,590 </Typography>
                </Box>
                <Divider />
              </Box>

              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                  Total
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                  247,370 
                </Typography>
              </Box>
            </Box>

            <Typography
              variant="h5"
              sx={{ mb: 3, fontWeight: "bold", fontSize: "1.5rem" }}
            >
              Payment method
            </Typography>

            <Box
              sx={{ border: 1, borderColor: "divider", borderRadius: 2, p: 3 }}
            >
              <RadioGroup
                row
                defaultValue="credit-card"
                sx={{
                  mb: 3,
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <FormControlLabel
                  value="bank-transfer"
                  control={<Radio />}
                  label="Bank transfer"
                />
                <FormControlLabel
                  value="credit-card"
                  control={<Radio />}
                  label="Credit card"
                />
                <FormControlLabel
                  value="barion"
                  control={<Radio />}
                  label="Barion"
                />
              </RadioGroup>

              <Typography variant="body2" sx={{ mb: 1, fontWeight: "medium" }}>
                Name on card *
              </Typography>
              <TextField
                fullWidth
                size="small"
                sx={{
                  mb: 3,
                  ".MuiInputBase-root": {
                    backgroundColor: "white",
                  },
                }}
              />

              <Typography variant="body2" sx={{ mb: 1, fontWeight: "medium" }}>
                Card number *
              </Typography>
              <TextField
                fullWidth
                size="small"
                sx={{
                  mb: 3,
                  ".MuiInputBase-root": {
                    backgroundColor: "white",
                  },
                }}
              />

              <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid item xs={6}>
                  <Typography
                    variant="body2"
                    sx={{ mb: 1, fontWeight: "medium" }}
                  >
                    Expiry date *
                  </Typography>
                  <TextField
                    fullWidth
                    size="small"
                    placeholder="MM / YY"
                    sx={{
                      width: 257,
                      ".MuiInputBase-root": {
                        backgroundColor: "white",
                      },
                    }}
                  />
                </Grid>
                <Grid item xs={6}>
                  <Typography
                    variant="body2"
                    sx={{ mb: 1, fontWeight: "medium" }}
                  >
                    Security code / CVV *
                  </Typography>
                  <TextField
                    fullWidth
                    size="small"
                    sx={{
                      width: 257,
                      ".MuiInputBase-root": {
                        backgroundColor: "white",
                      },
                    }}
                  />
                </Grid>
              </Grid>

              <Typography variant="body2" sx={{ mb: 1, fontWeight: "medium" }}>
                ZIP / Postal code *
              </Typography>
              <TextField
                fullWidth
                size="small"
                sx={{
                  ".MuiInputBase-root": {
                    backgroundColor: "white",
                  },
                }}
              />

              <Button
                variant="contained"
                fullWidth
                size="large"
                sx={{
                  py: 1.5,
                  fontWeight: "bold",
                  mt: 3,
                  fontSize: "1.1rem",
                }}
              >
                Place Order
              </Button>
            </Box>
          </Box>
        </Box>
      </Box>
    </Drawer>
  );
};

export default CartDrawer;
