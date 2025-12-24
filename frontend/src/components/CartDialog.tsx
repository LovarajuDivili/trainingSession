import React from "react";
import {
  Dialog,
  DialogContent,
  Box,
  Typography,
  TextField,
  Button,
  Divider,
  RadioGroup,
  FormControlLabel,
  Radio,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/Delete";
import { useCart } from "../context/CartContext";
import { useFormik } from "formik";
import * as Yup from "yup";

const inputSX = {
  "& .MuiOutlinedInput-root": {
    borderRadius: "12px",
    background: "#fff",
    border: "1px solid #dcdcdc",
  },

  "& input": {
    padding: "12px 14px !important",
    color: "#000 !important",
  },

  "& .Mui-focused input": {
    color: "#000 !important",
  },

  "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
    borderColor: "#906AFF !important",
  },

  "& fieldset": { border: "none" },
};

const labelSX = {
  shrink: true,
  sx: { fontSize: "0.9rem", mt: -1.3 },
};

const errorTextSX = {
  marginTop: 4,
  marginLeft: 4,
  fontSize: "0.75rem",
  color: "#d9534f",
};

const purplePillButton = {
  backgroundColor: "#906AFF",
  textTransform: "none",
  color: "white",
  borderRadius: "25px",
  px: 3,
  py: 0.6,
  fontWeight: 600,
  fontSize: "0.95rem",
  "&:hover": { backgroundColor: "#7c55ff" },
};

const disabledButton = {
  backgroundColor: "#e0e0e0",
  color: "#9e9e9e",
  borderRadius: "25px",
  px: 3,
  py: 0.6,
  fontWeight: 600,
  fontSize: "0.95rem",
};

const expiryNotExpired = (value?: string) => {
  if (!value) return false;
  const matched = /^(\d{2})\/(\d{2})$/.exec(value);
  if (!matched) return false;

  const month = parseInt(matched[1], 10);
  const year = 2000 + parseInt(matched[2], 10);
  if (month < 1 || month > 12) return false;

  const expiryDate = new Date(year, month, 0);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return expiryDate >= today;
};

const schema = Yup.object({
  first: Yup.string().min(3, "At least 3 characters").required("Required"),
  last: Yup.string().min(3, "At least 3 characters").required("Required"),
  phone: Yup.string().matches(/^\d{10}$/, "Must be 10 digits").required("Required"),
  email: Yup.string().email("Invalid email").required("Required"),
  address: Yup.string().required("Required"),
  city: Yup.string().required("Required"),
  district: Yup.string().required("Required"),
  postal: Yup.string().matches(/^\d{6}$/, "Must be 6 digits").required("Required"),

  paymentMethod: Yup.string().required(),
  cardName: Yup.string().required("Required"),
  cardNumber: Yup.string().matches(/^\d{16}$/, "16 digits required").required("Required"),
  expiry: Yup.string()
    .matches(/^(0[1-9]|1[0-2])\/\d{2}$/, "MM/YY")
    .test("expiry-not-expired", "Expired card", (v) => expiryNotExpired(v))
    .required(),
  cvv: Yup.string().matches(/^\d{3}$/, "3 digits").required("Required"),
  zip: Yup.string().matches(/^\d{6}$/, "6 digits").required("Required"),
});

interface CartDialogProps {
  open: boolean;
  onClose: () => void;
}

const CartDialog: React.FC<CartDialogProps> = ({ open, onClose }) => {
  const { cart, removeFromCart, clearCart } = useCart() as any;

  const subtotal = cart.reduce((s: number, it: any) => s + it.price, 0);
  const vat = subtotal * 0.18;
  const total = subtotal + vat;

  const formik = useFormik({
    initialValues: {
      first: "",
      last: "",
      phone: "",
      email: "",
      address: "",
      city: "",
      district: "",
      postal: "",
      paymentMethod: "card",
      cardName: "",
      cardNumber: "",
      expiry: "",
      cvv: "",
      zip: "",
    },
    validationSchema: schema,
    validateOnMount: true,
    onSubmit: async (values, { setSubmitting }) => {
      if (!formik.isValid || cart.length === 0) {
        setSubmitting(false);
        return;
      }

      try {
        const token = localStorage.getItem("token");
        if (!token) {
          alert("Login required");
          return;
        }

        const body = {
          items: cart.map((c: any) => ({
            productId: c._id,
            name: `${c.category} - ${c.brand}`,
            price: c.price,
            qty: 1,
          })),
          totalAmount: Math.round(total),
        };

        const res = await fetch("http://localhost:5000/api/orders/place", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(body),
        });

        const data = await res.json();

        if (data.success) {
          clearCart();
          window.dispatchEvent(new Event("refreshOrders"));
          onClose();
        } else alert("Order failed");
      } finally {
        setSubmitting(false);
      }
    },
  });

  const isDisabled =
    !formik.isValid || formik.isSubmitting || cart.length === 0;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullScreen
      PaperProps={{
        sx: {
          marginLeft: "150px",
          width: "calc(100% - 150px)",
          background: "#fafafa",
        },
      }}
    >
      <DialogContent
        sx={{
          height: "100vh",
          overflowY: "auto",
          display: "flex",
          alignItems: "flex-start",
          flexWrap: "nowrap",
          padding: "32px",
          gap: 4,
        }}
      >
        <Box
          sx={{
            flex: 1,
            minWidth: "500px",
            background: "#fff",
            padding: 3,
            borderRadius: "20px",
            border: "1px solid #e5e5e5",
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Typography sx={{ fontSize: "1.6rem", fontWeight: 700 }}>
              Billing details
            </Typography>
            <CloseIcon sx={{ cursor: "pointer" }} onClick={onClose} />
          </Box>

          <Box
            sx={{
              background: "#f0e6ff",
              padding: 3,
              borderRadius: "16px",
              mb: 2,
            }}
          >
            <Typography sx={{ mb: 1 }}>
              If you have a coupon code, apply it below
            </Typography>
            <Box sx={{ display: "flex", gap: 2 }}>
              <TextField placeholder="Enter coupon code" InputLabelProps={labelSX} sx={{ ...inputSX, flex: 1 }} />
              <Button variant="contained" sx={{ background: "#41af51", borderRadius: "12px", textTransform: "none", px: 3, "&:hover": { backgroundColor: "#41af51" }, }}>
                Apply Coupon
              </Button>
            </Box>
          </Box>

          <TextField
            label="First Name *"
            placeholder="Enter first name"
            InputLabelProps={labelSX}
            fullWidth
            sx={inputSX}
            {...formik.getFieldProps("first")}
            error={formik.touched.first && Boolean(formik.errors.first)}
            helperText={formik.touched.first && formik.errors.first ? <span style={errorTextSX}>{formik.errors.first}</span> : " "}
          />

          <TextField
            label="Last Name *"
            placeholder="Enter last name"
            InputLabelProps={labelSX}
            fullWidth
            sx={inputSX}
            {...formik.getFieldProps("last")}
            error={formik.touched.last && Boolean(formik.errors.last)}
            helperText={formik.touched.last && formik.errors.last ? <span style={errorTextSX}>{formik.errors.last}</span> : " "}
          />

          <TextField
            label="Phone Number *"
            placeholder="Enter phone number"
            InputLabelProps={labelSX}
            fullWidth
            sx={inputSX}
            {...formik.getFieldProps("phone")}
            error={formik.touched.phone && Boolean(formik.errors.phone)}
            helperText={formik.touched.phone && formik.errors.phone ? <span style={errorTextSX}>{formik.errors.phone}</span> : " "}
          />

          <TextField
            label="Email Address *"
            placeholder="Enter email"
            InputLabelProps={labelSX}
            fullWidth
            sx={inputSX}
            {...formik.getFieldProps("email")}
            error={formik.touched.email && Boolean(formik.errors.email)}
            helperText={formik.touched.email && formik.errors.email ? <span style={errorTextSX}>{formik.errors.email}</span> : " "}
          />

          <Typography sx={{ fontWeight: 600, mt: 2, mb: 1 }}>
            Address information
          </Typography>

          <TextField
            label="Address *"
            placeholder="Enter address"
            InputLabelProps={labelSX}
            fullWidth
            sx={inputSX}
            {...formik.getFieldProps("address")}
            error={formik.touched.address && Boolean(formik.errors.address)}
            helperText={formik.touched.address && formik.errors.address ? <span style={errorTextSX}>{formik.errors.address}</span> : " "}
          />

          <TextField
            label="City *"
            placeholder="Enter city"
            InputLabelProps={labelSX}
            fullWidth
            sx={inputSX}
            {...formik.getFieldProps("city")}
            error={formik.touched.city && Boolean(formik.errors.city)}
            helperText={formik.touched.city && formik.errors.city ? <span style={errorTextSX}>{formik.errors.city}</span> : " "}
          />

          <TextField
            label="District *"
            placeholder="Enter district"
            InputLabelProps={labelSX}
            fullWidth
            sx={inputSX}
            {...formik.getFieldProps("district")}
            error={formik.touched.district && Boolean(formik.errors.district)}
            helperText={formik.touched.district && formik.errors.district ? <span style={errorTextSX}>{formik.errors.district}</span> : " "}
          />

          <TextField
            label="Postal Code *"
            placeholder="Enter postal code"
            InputLabelProps={labelSX}
            fullWidth
            sx={inputSX}
            {...formik.getFieldProps("postal")}
            error={formik.touched.postal && Boolean(formik.errors.postal)}
            helperText={formik.touched.postal && formik.errors.postal ? <span style={errorTextSX}>{formik.errors.postal}</span> : " "}
          />
        </Box>

        <Box
          sx={{
            flex: 1,
            minWidth: "480px",
            maxWidth: "600px",
            background: "#ebe7ff",
            padding: 4,
            borderRadius: "20px",
            display: "flex",
            flexDirection: "column",
            gap: 3,
          }}
        >
          <Typography sx={{ fontWeight: 700, fontSize: "1.3rem" }}>
            Your order
          </Typography>

          {cart.map((item: any) => (
            <Box
              key={item._id}
              sx={{
                padding: 2,
                borderRadius: "14px",
                background: "#f6f2ff",
                display: "flex",
                justifyContent: "space-between",
                mb: 1,
              }}
            >
              <Box>
                <Typography>{item.category} / {item.brand}</Typography>
                <Typography sx={{ fontWeight: 700 }}>
                  ₹{item.price.toLocaleString()}
                </Typography>
              </Box>

              <DeleteIcon
                onClick={() => removeFromCart(item._id)}
                sx={{ cursor: "pointer", color: "#c00" }}
              />
            </Box>
          ))}

          <Divider />

          <Box>
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <span>Subtotal</span>
              <b>₹{subtotal.toLocaleString()}</b>
            </Box>
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <span>VAT (18%)</span>
              <b>₹{vat.toFixed(2)}</b>
            </Box>
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <b>Total</b>
              <b>₹{Math.round(total).toLocaleString()}</b>
            </Box>
          </Box>

          <Box
            sx={{
              background: "#fff",
              padding: 3,
              borderRadius: "16px",
              boxShadow: "0 3px 12px rgba(0,0,0,0.12)",
              display: "flex",
              flexDirection: "column",
              gap: 2,
            }}
          >
            <Typography sx={{ fontWeight: 600 }}>Payment method</Typography>

            <RadioGroup
              value={formik.values.paymentMethod}
              onChange={(e) => formik.setFieldValue("paymentMethod", e.target.value)}
            >
              <FormControlLabel value="bank" control={<Radio />} label="Bank transfer" />
              <FormControlLabel value="card" control={<Radio />} label="Credit card" />
              <FormControlLabel value="barion" control={<Radio />} label="Barion" />
            </RadioGroup>

            <TextField
              label="Name on card *"
              placeholder="Enter card holder name"
              InputLabelProps={labelSX}
              fullWidth
              sx={inputSX}
              {...formik.getFieldProps("cardName")}
              error={formik.touched.cardName && Boolean(formik.errors.cardName)}
              helperText={formik.touched.cardName && formik.errors.cardName ? <span style={errorTextSX}>{formik.errors.cardName}</span> : " "}
            />

            <TextField
              label="Card Number *"
              placeholder="Enter card number"
              InputLabelProps={labelSX}
              fullWidth
              sx={inputSX}
              {...formik.getFieldProps("cardNumber")}
              error={formik.touched.cardNumber && Boolean(formik.errors.cardNumber)}
              helperText={formik.touched.cardNumber && formik.errors.cardNumber ? <span style={errorTextSX}>{formik.errors.cardNumber}</span> : " "}
            />

            <Box sx={{ display: "flex", gap: 2 }}>
              <TextField
                label="Expiry date (MM/YY) *"
                placeholder="MM/YY"
                InputLabelProps={labelSX}
                sx={inputSX}
                fullWidth
                {...formik.getFieldProps("expiry")}
                error={formik.touched.expiry && Boolean(formik.errors.expiry)}
                helperText={formik.touched.expiry && formik.errors.expiry ? <span style={errorTextSX}>{formik.errors.expiry}</span> : " "}
              />

              <TextField
                label="CVV *"
                placeholder="Enter CVV"
                InputLabelProps={labelSX}
                sx={inputSX}
                fullWidth
                {...formik.getFieldProps("cvv")}
                error={formik.touched.cvv && Boolean(formik.errors.cvv)}
                helperText={formik.touched.cvv && formik.errors.cvv ? <span style={errorTextSX}>{formik.errors.cvv}</span> : " "}
              />
            </Box>

            <TextField
              label="ZIP / Postal Code *"
              placeholder="Enter ZIP / postal"
              InputLabelProps={labelSX}
              fullWidth
              sx={inputSX}
              {...formik.getFieldProps("zip")}
              error={formik.touched.zip && Boolean(formik.errors.zip)}
              helperText={formik.touched.zip && formik.errors.zip ? <span style={errorTextSX}>{formik.errors.zip}</span> : " "}
            />
          </Box>

          <Button
            variant="contained"
            disabled={isDisabled}
            onClick={() => formik.handleSubmit()}
            sx={{
              ...(isDisabled ? disabledButton : purplePillButton),
              width: "180px",
              textTransform: "none",
              alignSelf: "center",
              mt: 1,
            }}
          >
            {formik.isSubmitting ? "Processing..." : "Place Order"}
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default CartDialog;
