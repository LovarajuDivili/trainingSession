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
import { useFormik } from "formik";
import * as Yup from "yup";
import { useCart } from "../ContextFiles/CartContext";
import { apiRequest } from "../Services/apiService";


const expiryNotExpired = (value?: string) => {
  if (!value) return false;
  const match = value.match(/^(\d{2})\/(\d{2})$/);
  if (!match) return false;

  const month = Number(match[1]);
  const year = 2000 + Number(match[2]);
  return new Date(year, month, 0) >= new Date();
};

const schema = Yup.object({
  first: Yup.string().min(3).required(),
  last: Yup.string().min(3).required(),
  phone: Yup.string()
    .matches(/^\d{10}$/)
    .required(),
  email: Yup.string().email().required(),
  address: Yup.string().required(),
  city: Yup.string().required(),
  district: Yup.string().required(),
  postal: Yup.string()
    .matches(/^\d{6}$/)
    .required(),
  paymentMethod: Yup.string().required(),
  cardName: Yup.string().required(),
  cardNumber: Yup.string()
    .matches(/^\d{16}$/)
    .required(),
  expiry: Yup.string()
    .matches(/^(0[1-9]|1[0-2])\/\d{2}$/)
    .test("expiry", "Expired card", expiryNotExpired)
    .required(),
  cvv: Yup.string()
    .matches(/^\d{3}$/)
    .required(),
  zip: Yup.string()
    .matches(/^\d{6}$/)
    .required(),
});

interface CartDialogProps {
  open: boolean;
  onClose: () => void;
}

const CartDialog: React.FC<CartDialogProps> = ({ open, onClose }) => {
  const { cart, removeFromCart, clearCart } = useCart() as any;

  const subtotal = cart.reduce((s: number, i: any) => s + i.price, 0);
  const vat = subtotal * 0.18;
  const total = Math.round(subtotal + vat);

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
    onSubmit: async (_, { setSubmitting }) => {
      try {
        if (!formik.isValid || cart.length === 0) return;

        await apiRequest({
          endpoint: "/api/orders/place",
          method: "POST",
          payload: {
            items: cart.map((c: any) => ({
              productId: c._id,
              name: `${c.category} - ${c.brand}`,
              price: c.price,
              qty: 1,
            })),
            totalAmount: total,
          },
        });

        clearCart();
        window.dispatchEvent(new Event("refreshOrders"));
        onClose();
      } catch (err: any) {
        alert(err.message || "Order failed");
      } finally {
        setSubmitting(false);
      }
    },
  });

  const isDisabled =
    !formik.isValid || formik.isSubmitting || cart.length === 0;

  return (
    <Dialog open={open} onClose={onClose} fullScreen>
      <DialogContent sx={{ display: "flex", gap: 4, p: 4 }}>
        <Box flex={1} bgcolor="#fff" p={4} borderRadius={3}>
          <Box display="flex" justifyContent="space-between">
            <Typography fontWeight={700} fontSize={22}>
              Billing Details
            </Typography>
            <CloseIcon sx={{ cursor: "pointer" }} onClick={onClose} />
          </Box>

          {Object.keys(schema.fields)
            .slice(0, 8)
            .map((field) => (
              <TextField
                key={field}
                fullWidth
                margin="dense"
                label={field.toUpperCase()}
                {...formik.getFieldProps(field)}
                error={Boolean(formik.touched[field] && formik.errors[field])}
                helperText={
                  formik.touched[field] && formik.errors[field]
                    ? (formik.errors[field] as string)
                    : " "
                }
              />
            ))}
        </Box>

        <Box flex={1} bgcolor="#ede9ff" p={4} borderRadius={3}>
          <Typography fontWeight={700}>Your Order</Typography>

          {cart.map((item: any) => (
            <Box key={item._id} display="flex" justifyContent="space-between">
              <Typography>
                {item.category} / {item.brand}
              </Typography>
              <DeleteIcon
                sx={{ cursor: "pointer", color: "#c00" }}
                onClick={() => removeFromCart(item._id)}
              />
            </Box>
          ))}

          <Divider sx={{ my: 2 }} />

          <Typography>Total: ₹{total}</Typography>

          <RadioGroup
            value={formik.values.paymentMethod}
            onChange={(e) =>
              formik.setFieldValue("paymentMethod", e.target.value)
            }
          >
            <FormControlLabel value="card" control={<Radio />} label="Card" />
            <FormControlLabel value="bank" control={<Radio />} label="Bank" />
          </RadioGroup>

          <Button
            disabled={isDisabled}
            variant="contained"
            onClick={() => formik.handleSubmit()}
          >
            {formik.isSubmitting ? "Processing..." : "Place Order"}
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default CartDialog;
