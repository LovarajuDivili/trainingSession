import {
  Box,
  Drawer,
  Typography,
  Divider,
  List,
  ListItem,
  ListItemText,
  Button,
} from "@mui/material";
import { useCartDrawer } from "../../context/CartDrawerContext";

const CartDrawer = () => {
  const { isDrawerOpen, closeDrawer } = useCartDrawer();

  // temporary mock data
  const cartItems = [
    { id: 1, name: "Laptop", price: 50000 },
    { id: 2, name: "Keyboard", price: 1200 },
  ];

  return (
    <Drawer anchor="right" open={isDrawerOpen} onClose={closeDrawer}>
      <Box
        sx={{
          width: 350,
          p: 3,
          display: "flex",
          flexDirection: "column",
          height: "100%",
        }}
      >
        <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
          Your Cart
        </Typography>

        <Divider />

        <List>
          {cartItems.map((item) => (
            <ListItem key={item.id}>
              <ListItemText primary={item.name} secondary={`₹${item.price}`} />
            </ListItem>
          ))}
        </List>

        <Divider sx={{ mt: "auto", mb: 2 }} />

        <Button
          variant="contained"
          color="primary"
          fullWidth
          onClick={() => alert("Proceed to checkout")}
        >
          Checkout
        </Button>
      </Box>
    </Drawer>
  );
};

export default CartDrawer;
