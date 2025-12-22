import React, { useState, useEffect, type JSX } from "react";
import {
  Box,
  Grid,
  Paper,
  Typography,
  Button,
  Card,
  CardContent,
  CardActions,
} from "@mui/material";

import LaptopMacIcon from "@mui/icons-material/LaptopMac";
import MonitorIcon from "@mui/icons-material/Monitor";
import KeyboardIcon from "@mui/icons-material/Keyboard";
import MouseIcon from "@mui/icons-material/Mouse";
import HeadsetIcon from "@mui/icons-material/Headset";
import VideocamIcon from "@mui/icons-material/Videocam";
import CategoryIcon from "@mui/icons-material/Category";

import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";

import { useNavigate } from "react-router-dom";

import CartDialog from "../../components/CartDialog";
import { useCart } from "../../ContextFiles/CartContext";
import { apiRequest } from "../../Services/apiService";

const purplePillButton = {
  backgroundColor: "#906AFF",
  textTransform: "none",
  color: "white",
  borderRadius: "25px",
  px: 3,
  py: 1,
  fontWeight: 600,
  "&:hover": { backgroundColor: "#7c55ff" },
};

const categoryBox = (active: boolean) => ({
  px: 4,
  py: 2,
  borderRadius: 2,
  minWidth: "130px",
  cursor: "pointer",
  textAlign: "center",
  boxShadow: active
    ? "0 0 10px rgba(144,106,255,0.4)"
    : "0 3px 8px rgba(0,0,0,0.08)",
  border: active ? "2px solid #906AFF" : "1px solid #ddd",
});

const iconMap: Record<string, JSX.Element> = {
  Laptop: <LaptopMacIcon sx={{ fontSize: 28, color: "#ff6b6b" }} />,
  Monitor: <MonitorIcon sx={{ fontSize: 28, color: "#1dd1a1" }} />,
  Keyboard: <KeyboardIcon sx={{ fontSize: 28, color: "#576574" }} />,
  Mouse: <MouseIcon sx={{ fontSize: 28, color: "#e67e22" }} />,
  Headphones: <HeadsetIcon sx={{ fontSize: 28, color: "#6c5ce7" }} />,
  Webcam: <VideocamIcon sx={{ fontSize: 28, color: "#ff4757" }} />,
  Others: <CategoryIcon sx={{ fontSize: 28, color: "#a55eea" }} />,
};

const RequestOrder: React.FC = () => {
  const [items, setItems] = useState<any[]>([]);
  const [activeCategory, setActiveCategory] = useState("Laptop");
  const [fav, setFav] = useState<string[]>([]);
  const [cartOpen, setCartOpen] = useState(false);

  const { cart, addToCart } = useCart();
  const nav = useNavigate();

  useEffect(() => {
    const fetchItems = async () => {
      try {
        // const data = await apiRequest<any>({
        //   endpoint: "/api/accountant",
        //   method: "GET",
        // });
        const data = await apiRequest<{ items: any[] }>({
          endpoint: "/api/accountant",
          method: "GET",
        });
        setItems(data.items);
        // setItems(data?.items || data || []);
      } catch (err) {
        console.error("Error loading items:", err);
      }
    };

    fetchItems();
  }, []);

  useEffect(() => {
    const handler = () => setCartOpen(true);
    window.addEventListener("openCart", handler);
    return () => window.removeEventListener("openCart", handler);
  }, []);

  const categories = [
    "Laptop",
    "Monitor",
    "Keyboard",
    "Mouse",
    "Headphones",
    "Webcam",
    "Others",
  ];

  // const products =
  //   activeCategory === "Others"
  //     ? items
  //     : items.filter((i: any) => i.category === activeCategory);
  const products =
    activeCategory === "Others"
      ? items.filter(
          (i) =>
            ![
              "Laptop",
              "Monitor",
              "Keyboard",
              "Mouse",
              "Headphones",
              "Webcam",
            ].includes(i.category)
        )
      : items.filter((i) => i.category === activeCategory);

  const toggleFav = (id: string) =>
    setFav((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );

  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
        <Typography variant="h6" sx={{ fontWeight: 700 }}>
          Select the Items
        </Typography>

        <Box sx={{ display: "flex", alignItems: "center", gap: 3 }}>
          <Typography sx={{ color: "#906AFF", fontWeight: 700 }}>
            Cart: {cart.length} items
          </Typography>

          <Button sx={purplePillButton} onClick={() => nav(-1)}>
            Close
          </Button>
        </Box>
      </Box>

      <Grid container spacing={2} sx={{ mb: 3 }}>
        {categories.map((cat) => (
          <Grid item key={cat}>
            <Paper
              sx={categoryBox(activeCategory === cat)}
              onClick={() => setActiveCategory(cat)}
            >
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 1,
                }}
              >
                {iconMap[cat]}
                <Typography sx={{ fontWeight: 600 }}>{cat}</Typography>
              </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>

      <Typography variant="subtitle1" sx={{ mb: 2 }}>
        Showing {activeCategory.toLowerCase()}:
      </Typography>

      <Grid container spacing={3}>
        {products.map((item: any) => (
          <Grid item xs={12} sm={6} md={4} m={3} key={item._id}>
            <Card
              sx={{ borderRadius: 3, boxShadow: "0 8px 18px rgba(0,0,0,0.08)" }}
            >
              <CardContent sx={{ position: "relative" }}>
                <Box sx={{ position: "absolute", top: 12, right: 12 }}>
                  {iconMap[item.category]}
                </Box>

                <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                  {item.category} / {item.brand}
                </Typography>

                <Typography variant="body2">Brand: {item.brand}</Typography>
                <Typography variant="body2">Price: ₹{item.price}</Typography>
              </CardContent>

              <CardActions
                sx={{ display: "flex", justifyContent: "space-between", px: 2 }}
              >
                <Box
                  sx={{ cursor: "pointer" }}
                  onClick={() => toggleFav(item._id)}
                >
                  {fav.includes(item._id) ? (
                    <FavoriteIcon sx={{ color: "red" }} />
                  ) : (
                    <FavoriteBorderIcon sx={{ color: "#555" }} />
                  )}
                </Box>

                <Button sx={purplePillButton} onClick={() => addToCart(item)}>
                  Add to Cart
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      <CartDialog open={cartOpen} onClose={() => setCartOpen(false)} />
    </Box>
  );
};

export default RequestOrder;
