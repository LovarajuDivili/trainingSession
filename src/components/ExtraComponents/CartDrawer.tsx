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
  Snackbar,
  Alert,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { useCartDrawer } from "../../context/CartDrawerContext";
import { useCart } from "../../context/CartContext";
import CloseIcon from "@mui/icons-material/Close";
import { useOrders } from "../../context/OrderContext";
import { useState } from "react";
import { useThemeColors } from "../../hooks/useThemeColors";

const CartDrawer = () => {
  const { isDrawerOpen, closeDrawer } = useCartDrawer();
   const { cart, clearCart, removeFromCart } = useCart();
  const { addOrder } = useOrders();
  const colors = useThemeColors();

  const [openSnackbar, setOpenSnackbar] = useState(false);

  const subtotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const vat = subtotal * 0.18;
  const total = subtotal + vat;

  const handlePlaceOrder = () => {
    if (cart.length === 0) return;

    addOrder(cart); // Add to orders context
    clearCart(); // Clear cart
    setOpenSnackbar(true); // Show message
    closeDrawer(); // Close Drawer
  };

  const handleRemoveItem = (itemId: string) => {
    removeFromCart(itemId);
  };

  return (
    <>
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
            backgroundColor: colors.background.white,
            color: colors.text.primary,
          }}
        >
          <Box sx={{ display: "flex", gap: 6, flex: 1 }}>
            {/* Left Section - Billing Details */}
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
                  sx={{ 
                    fontWeight: "bold", 
                    fontSize: "1.5rem",
                    color: colors.text.primary 
                  }}
                >
                  Billing details
                </Typography>

                {/* Close Icon */}
                <IconButton
                  onClick={closeDrawer}
                  sx={{
                    bgcolor: colors.status.error,
                    "&:hover": { 
                      bgcolor: colors.status.error,
                      opacity: 0.9 
                    },
                  }}
                >
                  <CloseIcon sx={{ color: colors.text.white }} />
                </IconButton>
              </Box>

              {/* Coupon Section */}
              <Box
                sx={{
                  mb: 4,
                  backgroundColor: colors.special.couponSection,
                  p: 2,
                  borderRadius: "20px",
                  border: `1px solid ${colors.border.light}`,
                }}
              >
                <Typography
                  variant="body2"
                  sx={{ 
                    mb: 2, 
                    color: colors.text.primary,
                    fontWeight: 500 
                  }}
                >
                  If you have a coupon code, please apply it below
                </Typography>

                <Box sx={{ display: "flex", gap: 1, mb: 3 }}>
                  <TextField
                    placeholder="Enter coupon code"
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "20px",
                        backgroundColor: colors.background.card,
                        "& fieldset": {
                          borderColor: colors.border.light,
                        },
                        "&:hover fieldset": {
                          borderColor: colors.primary.main,
                        },
                        "&.Mui-focused fieldset": {
                          borderColor: colors.primary.main,
                        },
                      },
                      "& .MuiInputBase-input": {
                        color: colors.text.primary1,
                        "&::placeholder": {
                          color: colors.text.secondary,
                          opacity: 1,
                        },
                      },
                      flex: 1,
                    }}
                  />
                  <Button
                    variant="outlined"
                    sx={{
                      whiteSpace: "nowrap",
                      bgcolor: colors.status.success,
                      color: colors.text.white,
                      borderRadius: "20px",
                      border: "none",
                      "&:hover": {
                        bgcolor: colors.status.success,
                        opacity: 0.9,
                        border: "none",
                      },
                    }}
                  >
                    Apply coupon
                  </Button>
                </Box>
              </Box>

              {/* Personal Information */}
              <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid item xs={6}>
                  <Typography
                    variant="body2"
                    sx={{ 
                      mb: 1, 
                      fontWeight: "medium",
                      color: colors.text.primary 
                    }}
                  >
                    First Name *
                  </Typography>
                  <TextField
                    fullWidth
                    placeholder="Enter your first name"
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "20px",
                        backgroundColor: colors.background.card,
                        "& fieldset": {
                          borderColor: colors.border.light,
                        },
                        "&:hover fieldset": {
                          borderColor: colors.primary.main,
                        },
                        "&.Mui-focused fieldset": {
                          borderColor: colors.primary.main,
                        },
                      },
                      "& .MuiInputBase-input": {
                        color: colors.text.primary1,
                        "&::placeholder": {
                          color: colors.text.secondary,
                          opacity: 1,
                        },
                      },
                      width: 285,
                    }}
                  />
                </Grid>
                <Grid item xs={6}>
                  <Typography
                    variant="body2"
                    sx={{ 
                      mb: 1, 
                      fontWeight: "medium",
                      color: colors.text.primary 
                    }}
                  >
                    Last Name *
                  </Typography>
                  <TextField
                    fullWidth
                    placeholder="Enter your last name"
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "20px",
                        backgroundColor: colors.background.card,
                        "& fieldset": {
                          borderColor: colors.border.light,
                        },
                        "&:hover fieldset": {
                          borderColor: colors.primary.main,
                        },
                        "&.Mui-focused fieldset": {
                          borderColor: colors.primary.main,
                        },
                      },
                      "& .MuiInputBase-input": {
                        color: colors.text.primary1,
                        "&::placeholder": {
                          color: colors.text.secondary,
                          opacity: 1,
                        },
                      },
                      width: 285,
                    }}
                  />
                </Grid>
              </Grid>

              {/* Phone */}
              <Typography variant="body2" sx={{ 
                mb: 1, 
                fontWeight: "medium",
                color: colors.text.primary 
              }}>
                Phone Number *
              </Typography>
              <TextField
                fullWidth
                placeholder="Enter your phone number"
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "20px",
                    backgroundColor: colors.background.card,
                    "& fieldset": {
                      borderColor: colors.border.light,
                    },
                    "&:hover fieldset": {
                      borderColor: colors.primary.main,
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: colors.primary.main,
                    },
                  },
                  "& .MuiInputBase-input": {
                    color: colors.text.primary1,
                    "&::placeholder": {
                      color: colors.text.secondary,
                      opacity: 1,
                    },
                  },
                  mb: 3,
                }}
              />

              {/* Email */}
              <Typography variant="body2" sx={{ 
                mb: 1, 
                fontWeight: "medium",
                color: colors.text.primary 
              }}>
                Email Address *
              </Typography>
              <TextField
                fullWidth
                placeholder="Enter your email address"
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "20px",
                    backgroundColor: colors.background.card,
                    "& fieldset": {
                      borderColor: colors.border.light,
                    },
                    "&:hover fieldset": {
                      borderColor: colors.primary.main,
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: colors.primary.main,
                    },
                  },
                  "& .MuiInputBase-input": {
                    color: colors.text.primary1,
                    "&::placeholder": {
                      color: colors.text.secondary,
                      opacity: 1,
                    },
                  },
                  mb: 3,
                }}
              />

              {/* Address Information */}
              <Typography variant="h5" sx={{ 
                mb: 3, 
                fontSize: "1.3rem",
                color: colors.text.primary,
                fontWeight: "bold" 
              }}>
                Address information
              </Typography>

              <Typography variant="body2" sx={{ 
                mb: 1, 
                fontWeight: "medium",
                color: colors.text.primary 
              }}>
                Address
              </Typography>
              <TextField
                fullWidth
                placeholder="Enter your address"
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "20px",
                    backgroundColor: colors.background.card,
                    "& fieldset": {
                      borderColor: colors.border.light,
                    },
                    "&:hover fieldset": {
                      borderColor: colors.primary.main,
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: colors.primary.main,
                    },
                  },
                  "& .MuiInputBase-input": {
                    color: colors.text.primary1,
                    "&::placeholder": {
                      color: colors.text.secondary,
                      opacity: 1,
                    },
                  },
                  mb: 3,
                }}
              />

              <Typography variant="body2" sx={{ 
                mb: 1, 
                fontWeight: "medium",
                color: colors.text.primary 
              }}>
                City
              </Typography>
              <TextField
                fullWidth
                placeholder="Enter your city name "
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "20px",
                    backgroundColor: colors.background.card,
                    "& fieldset": {
                      borderColor: colors.border.light,
                    },
                    "&:hover fieldset": {
                      borderColor: colors.primary.main,
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: colors.primary.main,
                    },
                  },
                  "& .MuiInputBase-input": {
                    color: colors.text.primary1,
                    "&::placeholder": {
                      color: colors.text.secondary,
                      opacity: 1,
                    },
                  },
                  mb: 3,
                }}
              />

              <Typography variant="body2" sx={{ 
                mb: 1, 
                fontWeight: "medium",
                color: colors.text.primary 
              }}>
                District
              </Typography>
              <TextField
                fullWidth
                placeholder="Enter your district name"
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "20px",
                    backgroundColor: colors.background.card,
                    "& fieldset": {
                      borderColor: colors.border.light,
                    },
                    "&:hover fieldset": {
                      borderColor: colors.primary.main,
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: colors.primary.main,
                    },
                  },
                  "& .MuiInputBase-input": {
                    color: colors.text.primary1,
                    "&::placeholder": {
                      color: colors.text.secondary,
                      opacity: 1,
                    },
                  },
                  mb: 3,
                }}
              />

              <Typography variant="body2" sx={{ 
                mb: 1, 
                fontWeight: "medium",
                color: colors.text.primary 
              }}>
                Postal Code
              </Typography>
              <TextField
                fullWidth
                placeholder="Enter your postal code"
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "20px",
                    backgroundColor: colors.background.card,
                    "& fieldset": {
                      borderColor: colors.border.light,
                    },
                    "&:hover fieldset": {
                      borderColor: colors.primary.main,
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: colors.primary.main,
                    },
                  },
                  "& .MuiInputBase-input": {
                    color: colors.text.primary1,
                    "&::placeholder": {
                      color: colors.text.secondary,
                      opacity: 1,
                    },
                  },
                  mb: 3,
                }}
              />
            </Box>

            {/* Right Section - Order Summary & Payment */}
            <Box sx={{ 
              flex: 1, 
              backgroundColor: colors.primary.lighter, 
              p: 4,
              borderRadius: 3,
              border: `1px solid ${colors.border.light}`,
            }}>
              <Typography
                variant="h5"
                sx={{ 
                  mb: 3, 
                  fontWeight: "bold", 
                  fontSize: "1.5rem", 
                  p: 0.5,
                  color: colors.text.primary 
                }}
              >
                Your order
              </Typography>

              <Box
                sx={{
                  borderColor: colors.border.light,
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
    alignItems: "center",
    mb: 2,
    p: 1,
    borderRadius: 1,
    border: `1px solid ${colors.border.light}`,
  }}
>
  {/* Item name and quantity on the left */}
  <Typography variant="body1" sx={{ color: colors.text.primary, flex: 1 }}>
    {item.brand} {item.category} x {item.quantity}
  </Typography>
  
  {/* Price and delete button on the right */}
  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
    <Typography variant="body1" fontWeight="medium" sx={{ color: colors.text.primary }}>
      ₹{item.price * item.quantity}
    </Typography>
    
    {/* Remove Item Button */}
    <IconButton
      onClick={() => handleRemoveItem(item._id)}
      sx={{
        color: colors.status.error,
        "&:hover": {
          backgroundColor: colors.status.error + '20',
        },
      }}
      size="small"
    >
      <DeleteIcon fontSize="small" />
    </IconButton>
  </Box>
</Box>
                    ))
                  ) : (
                    <Typography sx={{ color: colors.text.secondary }}>
                      No items in cart
                    </Typography>
                  )}
                  <Divider sx={{ borderColor: colors.border.light }} />
                </Box>

                <Box sx={{ mb: 2 }}>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      mb: 1,
                    }}
                  >
                    <Typography variant="body2" sx={{ color: colors.text.primary }}>Subtotal</Typography>
                    <Typography variant="body2" sx={{ color: colors.text.primary }}>
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
                    <Typography variant="body2" sx={{ color: colors.text.primary }}>Shipping</Typography>
                    <Typography variant="body2" color={colors.status.success}>
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
                    <Typography variant="body2" sx={{ color: colors.text.primary }}>VAT (18%)</Typography>
                    <Typography variant="body2" sx={{ color: colors.text.primary }}>
                      ₹{vat.toLocaleString()}
                    </Typography>
                  </Box>
                  <Divider sx={{ borderColor: colors.border.light }} />
                </Box>

                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Typography variant="h6" sx={{ fontWeight: "bold", color: colors.text.primary }}>
                    Total
                  </Typography>
                  <Typography variant="h6" sx={{ fontWeight: "bold", color: colors.text.primary }}>
                    ₹{total.toLocaleString()}
                  </Typography>
                </Box>
              </Box>

              <Typography
                variant="h5"
                sx={{ 
                  mb: 3, 
                  fontWeight: "bold", 
                  fontSize: "1.5rem",
                  color: colors.text.primary 
                }}
              >
                Payment method
              </Typography>

              <Box
                sx={{
                  border: `1px solid ${colors.border.light}`,
                  borderRadius: 2,
                  p: 3,
                  backgroundColor: colors.background.white,
                }}
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
                          color: colors.text.secondary,
                          "&.Mui-checked": {
                            color: colors.primary.main,
                          },
                        }}
                      />
                    }
                    label={<Typography sx={{ color: colors.text.primary }}>Bank transfer</Typography>}
                  />
                  <FormControlLabel
                    value="credit-card"
                    control={
                      <Radio
                        sx={{
                          color: colors.text.secondary,
                          "&.Mui-checked": {
                            color: colors.primary.main,
                          },
                        }}
                      />
                    }
                    label={<Typography sx={{ color: colors.text.primary }}>Credit card</Typography>}
                  />
                  <FormControlLabel
                    value="barion"
                    control={
                      <Radio
                        sx={{
                          color: colors.text.secondary,
                          "&.Mui-checked": {
                            color: colors.primary.main,
                          },
                        }}
                      />
                    }
                    label={<Typography sx={{ color: colors.text.primary }}>Barion</Typography>}
                  />
                </RadioGroup>

                <Typography
                  variant="body2"
                  sx={{ 
                    mb: 1, 
                    fontWeight: "medium",
                    color: colors.text.primary 
                  }}
                >
                  Name on card *
                </Typography>
                <TextField
                  fullWidth
                  placeholder="Enter your name on the card"
                  sx={{
                    mb: 3,
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "20px",
                      backgroundColor: colors.background.card,
                      "& fieldset": {
                        borderColor: colors.border.light,
                      },
                      "&:hover fieldset": {
                        borderColor: colors.primary.main,
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: colors.primary.main,
                      },
                    },
                    "& .MuiInputBase-input": {
                      color: colors.text.primary1,
                      "&::placeholder": {
                        color: colors.text.secondary,
                        opacity: 1,
                      },
                    },
                  }}
                />

                <Typography
                  variant="body2"
                  sx={{ 
                    mb: 1, 
                    fontWeight: "medium",
                    color: colors.text.primary 
                  }}
                >
                  Card number *
                </Typography>
                <TextField
                  fullWidth
                  placeholder="xxxx xxxx xxxx"
                  sx={{
                    mb: 3,
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "20px",
                      backgroundColor: colors.background.card,
                      "& fieldset": {
                        borderColor: colors.border.light,
                      },
                      "&:hover fieldset": {
                        borderColor: colors.primary.main,
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: colors.primary.main,
                      },
                    },
                    "& .MuiInputBase-input": {
                      color: colors.text.primary1,
                      "&::placeholder": {
                        color: colors.text.secondary,
                        opacity: 1,
                      },
                    },
                  }}
                />

                <Grid container spacing={2} sx={{ mb: 3 }}>
                  <Grid item xs={6}>
                    <Typography
                      variant="body2"
                      sx={{ 
                        mb: 1, 
                        fontWeight: "medium",
                        color: colors.text.primary 
                      }}
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
                          backgroundColor: colors.background.card,
                          "& fieldset": {
                            borderColor: colors.border.light,
                          },
                          "&:hover fieldset": {
                            borderColor: colors.primary.main,
                          },
                          "&.Mui-focused fieldset": {
                            borderColor: colors.primary.main,
                          },
                        },
                        "& .MuiInputBase-input": {
                          color: colors.text.primary1,
                          "&::placeholder": {
                            color: colors.text.secondary,
                            opacity: 1,
                          },
                        },
                      }}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <Typography
                      variant="body2"
                      sx={{ 
                        mb: 1, 
                        fontWeight: "medium",
                        color: colors.text.primary 
                      }}
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
                          backgroundColor: colors.background.card,
                          "& fieldset": {
                            borderColor: colors.border.light,
                          },
                          "&:hover fieldset": {
                            borderColor: colors.primary.main,
                          },
                          "&.Mui-focused fieldset": {
                            borderColor: colors.primary.main,
                          },
                        },
                        "& .MuiInputBase-input": {
                          color: colors.text.primary1,
                          "&::placeholder": {
                            color: colors.text.secondary,
                            opacity: 1,
                          },
                        },
                      }}
                    />
                  </Grid>
                </Grid>

                <Typography
                  variant="body2"
                  sx={{ 
                    mb: 1, 
                    fontWeight: "medium",
                    color: colors.text.primary 
                  }}
                >
                  ZIP / Postal code *
                </Typography>
                <TextField
                  fullWidth
                  placeholder="Enter your postal code"
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "20px",
                      backgroundColor: colors.background.card,
                      "& fieldset": {
                        borderColor: colors.border.light,
                      },
                      "&:hover fieldset": {
                        borderColor: colors.primary.main,
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: colors.primary.main,
                      },
                    },
                    "& .MuiInputBase-input": {
                      color: colors.text.primary1,
                      "&::placeholder": {
                        color: colors.text.secondary,
                        opacity: 1,
                      },
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
                    bgcolor: colors.primary.main,
                    borderRadius: "20px",
                    color: colors.text.white,
                    "&:hover": {
                      bgcolor: colors.primary.dark,
                    },
                  }}
                  onClick={handlePlaceOrder}
                >
                  Place Order
                </Button>
              </Box>
            </Box>
          </Box>
        </Box>
      </Drawer>
      {/* ✅ Snackbar */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={2500}
        onClose={() => setOpenSnackbar(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert severity="success" variant="filled">
          ✅ Order placed successfully!
        </Alert>
      </Snackbar>
    </>
  );
};

export default CartDrawer;