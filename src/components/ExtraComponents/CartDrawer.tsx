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
  IconButton,
} from "@mui/material";
import { useCartDrawer } from "../../context/CartDrawerContext";
import { useCart } from "../../context/CartContext";
import CloseIcon from "@mui/icons-material/Close";

const CartDrawer = () => {
  const { isDrawerOpen, closeDrawer } = useCartDrawer();
  const { cart } = useCart();

  const subtotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const vat = subtotal * 0.18; 
  const total = subtotal + vat;

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
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 3,
              }}
            >
              <Typography
                variant="h5"
                sx={{ fontWeight: "bold", fontSize: "1.5rem" }}
              >
                Billing details
              </Typography>

              {/* Close Icon */}
              <IconButton
                onClick={closeDrawer}
                sx={{
                  bgcolor: "#f0f0f0ff",
                }}
              >
                <CloseIcon sx={{ color: "red" }} />
              </IconButton>
            </Box>

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
                  placeholder="Enter coupon code"
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "20px",
                    },
                    flex: 1,
                  }}
                />
                <Button
                  variant="outlined"
                  sx={{
                    whiteSpace: "nowrap",
                    bgcolor: "green",
                    color: "white",
                    borderRadius: "20px",
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
                <TextField
                  fullWidth
                  placeholder="Enter your first name"
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "20px",
                    },
                    width: 285,
                  }}
                />
              </Grid>
              <Grid item xs={6}>
                <Typography
                  variant="body2"
                  sx={{ mb: 1, fontWeight: "medium" }}
                >
                  Last Name *
                </Typography>
                <TextField
                  fullWidth
                  placeholder="Enter your last name"
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "20px",
                    },
                    width: 285,
                  }}
                />
              </Grid>
            </Grid>

            {/* Phone */}
            <Typography variant="body2" sx={{ mb: 1, fontWeight: "medium" }}>
              Phone Number *
            </Typography>
            <TextField
              fullWidth
              placeholder="Enter your phone number"
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "20px",
                },
                mb: 3,
              }}
            />

            
            <Typography variant="body2" sx={{ mb: 1, fontWeight: "medium" }}>
              Email Address *
            </Typography>
            <TextField
              fullWidth
              placeholder="Enter your email address"
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "20px",
                },
                mb: 3,
              }}
            />

            
            <Typography variant="h5" sx={{ mb: 3, fontSize: "1.3rem" }}>
              Address information
            </Typography>

            <Typography variant="body2" sx={{ mb: 1, fontWeight: "medium" }}>
              Address
            </Typography>
            <TextField
              fullWidth
              placeholder="Enter your address"
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "20px",
                },
                mb: 3,
              }}
            />

            <Typography variant="body2" sx={{ mb: 1, fontWeight: "medium" }}>
              City
            </Typography>
            <TextField
              fullWidth
              placeholder="Enter your city name "
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "20px",
                },
                mb: 3,
              }}
            />

            <Typography variant="body2" sx={{ mb: 1, fontWeight: "medium" }}>
              District
            </Typography>
            <TextField
              fullWidth
              placeholder="Enter your district name"
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "20px",
                },
                mb: 3,
              }}
            />

            <Typography variant="body2" sx={{ mb: 1, fontWeight: "medium" }}>
              Postal Code
            </Typography>
            <TextField
              fullWidth
              placeholder="Enter your postal code"
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "20px",
                },
                mb: 3,
              }}
            />
          </Box>

          
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
                {cart.length > 0 ? (
                  cart.map((item) => (
                    <Box
                      key={item._id}
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        mb: 2,
                      }}
                    >
                      <Typography variant="body1">
                        {item.brand} {item.category} x {item.quantity}
                      </Typography>
                      <Typography variant="body1" fontWeight="medium">
                        ₹{item.price * item.quantity}
                      </Typography>
                    </Box>
                  ))
                ) : (
                  <Typography sx={{ color: "gray" }}>
                    No items in cart
                  </Typography>
                )}
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
                  <Typography variant="body2">
                    ₹{subtotal.toLocaleString()}
                  </Typography>
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
                  <Typography variant="body2">VAT (18%)</Typography>
                  <Typography variant="body2">
                    ₹{vat.toLocaleString()}
                  </Typography>
                </Box>
                <Divider />
              </Box>

              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                  Total
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                  ₹{total.toLocaleString()}
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
    control={
      <Radio
        sx={{
          
          "&.Mui-checked": {
            color: "#906aff",
          },
        }}
      />
    }
    label="Bank transfer"
  />
  <FormControlLabel
    value="credit-card"
    control={
      <Radio
        sx={{
          
          "&.Mui-checked": {
            color: "#906aff",
          },
        }}
      />
    }
    label="Credit card"
  />
  <FormControlLabel
    value="barion"
    control={
      <Radio
        sx={{
          
          "&.Mui-checked": {
            color: "#906aff",
          },
        }}
      />
    }
    label="Barion"
  />
</RadioGroup>


              <Typography variant="body2" sx={{ mb: 1, fontWeight: "medium" }}>
                Name on card *
              </Typography>
              <TextField
                fullWidth
                placeholder="Enter your name on the card"
                sx={{
                  mb: 3,
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "20px",
                  },
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
                placeholder="xxxx xxxx xxxx"
                sx={{
                  mb: 3,
                  ".MuiInputBase-root": {
                    backgroundColor: "white",

                    borderRadius: "20px",
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
                    placeholder="MM / YY"
                    sx={{
                      width: 257,
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "20px",
                      },
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
                    placeholder="Enter your cvv"
                    sx={{
                      width: 257,
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "20px",
                      },
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
                placeholder="Enter your postal code"
                sx={{
                  ".MuiInputBase-root": {
                    backgroundColor: "white",
                  },
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "20px",
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
                  bgcolor: "#906aff",
                  borderRadius: "20px",
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
