/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  Typography,
  CircularProgress,
  Snackbar,
  Alert,
} from "@mui/material";
import Header from "../Header";
import { useNavigate } from "react-router-dom";
import LaptopIcon from "@mui/icons-material/Laptop";
import HeadphonesIcon from "@mui/icons-material/Headphones";
import MonitorIcon from "@mui/icons-material/Monitor";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import KeyboardIcon from "@mui/icons-material/Keyboard";
import MouseIcon from "@mui/icons-material/Mouse";
import CategoryIcon from "@mui/icons-material/Category";
import axios from "axios";
import { useState, type JSX } from "react";
import { useCart } from "../../context/CartContext";
import FavoriteIcon from "@mui/icons-material/FavoriteBorder";

const RequestOrder = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [itemsData, setItemsData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const { cart, addToCart } = useCart();

  const items = [
    {
      name: "Laptop",
      icon: <LaptopIcon sx={{ fontSize: 35, color: "#ff3b30" }} />,
    },
    {
      name: "Monitor",
      icon: <MonitorIcon sx={{ fontSize: 35, color: "#22c55e" }} />,
    },
    {
      name: "Keyboard",
      icon: <KeyboardIcon sx={{ fontSize: 35, color: "#0084ff" }} />,
    },
    {
      name: "Mouse",
      icon: <MouseIcon sx={{ fontSize: 35, color: "#ff9800" }} />,
    },
    {
      name: "Headphones",
      icon: <HeadphonesIcon sx={{ fontSize: 35, color: "#9c27b0" }} />,
    },
    {
      name: "Webcam",
      icon: <CameraAltIcon sx={{ fontSize: 35, color: "#f44336" }} />,
    },
  ];

  const categoryIcons: Record<string, JSX.Element> = {
    laptop: <LaptopIcon sx={{ fontSize: 25, color: "#ff3b30" }} />,
    monitor: <MonitorIcon sx={{ fontSize: 25, color: "#22c55e" }} />,
    keyboard: <KeyboardIcon sx={{ fontSize: 25, color: "#0084ff" }} />,
    mouse: <MouseIcon sx={{ fontSize: 25, color: "#ff9800" }} />,
    headphones: <HeadphonesIcon sx={{ fontSize: 25, color: "#9c27b0" }} />,
    webcam: <CameraAltIcon sx={{ fontSize: 25, color: "#f44336" }} />,
  };

  // Fetch specific category
  const handleCategoryClick = async (category: string) => {
    try {
      setSelectedCategory(category);
      setLoading(true);
      const response = await axios.get(
        `http://localhost:8000/v-1/application/inventory/${category}`
      );
      setItemsData(response.data);
    } catch (error) {
      console.error("Error fetching category data:", error);
      setItemsData([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch all inventory items (for "Others")
  const handleAllItemsClick = async () => {
    try {
      setSelectedCategory("others");
      setLoading(true);
      const response = await axios.get(
        `http://localhost:8000/v-1/application/inventory/`
      );
      setItemsData(response.data);
    } catch (error) {
      console.error("Error fetching all inventory data:", error);
      setItemsData([]);
    } finally {
      setLoading(false);
    }
  };

  // Add item to cart
  const handleAddToCart = (item: any) => {
    addToCart(item);
    setSnackbarMessage(`Added ${item.brand} ${item.category} to cart`);
    setSnackbarOpen(true);
  };

  // Save cart to localStorage (optional) and navigate back
  const handleClose = () => {
    // Save cart to localStorage or context for persistence
    localStorage.setItem("orderCart", JSON.stringify(cart));
    navigate("/accountant");
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <Box sx={{ minHeight: "88vh", backgroundColor: "white" }}>
      <Header role={""} />

      {/* Header Row */}
      <Box
        sx={{
          mt: 10,
          px: 3,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography variant="h5" fontWeight="bold">
          Select the Items
        </Typography>

        <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
          <Typography
            variant="body1"
            sx={{ color: "#906aff", fontWeight: 600 }}
          >
            Cart: {cart.length} items
          </Typography>
          <Button
            variant="contained"
            color="error"
            onClick={handleClose}
            sx={{
              textTransform: "none",
              borderRadius: 2,
              boxShadow: 3,
              backgroundColor: "#ac8fff",
              "&:hover": { backgroundColor: "#ac8fff" },
            }}
          >
            Close
          </Button>
        </Box>
      </Box>

      {/* Category Cards */}
      <Grid container spacing={5} sx={{ p: 5 }}>
        {items.map((item, index) => (
          <Grid item xs={2} key={index}>
            <Card
              onClick={() => handleCategoryClick(item.name.toLowerCase())}
              sx={{
                height: 100,
                width: 202,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                borderRadius: 2,
                boxShadow: 3,
                backgroundColor:
                  selectedCategory === item.name.toLowerCase()
                    ? "#e8e8ff"
                    : "#f9f9f9",
                transition: "0.3s",
                cursor: "pointer",
                "&:hover": {
                  backgroundColor: "#e8e8ff",
                  transform: "scale(1.03)",
                  boxShadow: 6,
                },
              }}
            >
              <CardContent
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 1.5,
                }}
              >
                {item.icon}
                <Typography
                  variant="h6"
                  fontWeight={600}
                  sx={{ color: "#333", textAlign: "center" }}
                >
                  {item.name}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}

        {/* "Others" Card */}
        <Grid item xs={2}>
          <Card
            onClick={handleAllItemsClick}
            sx={{
              height: 100,
              width: 202,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              borderRadius: 2,
              boxShadow: 3,
              backgroundColor:
                selectedCategory === "others" ? "#e8e8ff" : "#f9f9f9",
              transition: "0.3s",
              cursor: "pointer",
              "&:hover": {
                backgroundColor: "#e8e8ff",
                transform: "scale(1.03)",
                boxShadow: 6,
              },
            }}
          >
            <CardContent
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 1.5,
              }}
            >
              <CategoryIcon sx={{ fontSize: 35, color: "#607d8b" }} />
              <Typography
                variant="h6"
                fontWeight={600}
                sx={{ color: "#333", textAlign: "center" }}
              >
                Others
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Item Data Section */}
      <Box sx={{ px: 5, pb: 5 }}>
        {loading ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              mt: 4,
            }}
          >
            <CircularProgress />
          </Box>
        ) : selectedCategory && itemsData.length > 0 ? (
          <>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Showing{" "}
              {selectedCategory === "others"
                ? "all items"
                : selectedCategory + "s"}
              :
            </Typography>
            <Grid container spacing={7}>
              {itemsData.map((item) => (
                <Grid item xs={3} key={item._id}>
                  <Card
                    sx={{
                      p: 2,
                      borderRadius: 2,
                      boxShadow: 3,
                      transition: "0.3s",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                      height: 160,
                      width: 205,
                      "&:hover": { boxShadow: 6, transform: "scale(1.02)" },
                    }}
                  >
                    {/* Top Content */}
                    <Box>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          mb: 1,
                        }}
                      >
                        <Typography variant="body2" color="text.secondary">
                          <strong>{item.category}</strong>
                        </Typography>
                        {categoryIcons[item.category?.toLowerCase()] || (
                          <CategoryIcon
                            sx={{ fontSize: 15, color: "#757575" }}
                          />
                        )}
                      </Box>

                      <Typography variant="body2" color="text.secondary">
                        Brand: {item.brand}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Price: ₹{item.price}
                      </Typography>
                    </Box>

                    {/* Bottom Buttons */}
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        mt: 2,
                        gap: 1,
                      }}
                    >
                      <Button
                        variant="outlined"
                        size="small"
                        sx={{
                          textTransform: "none",
                          borderRadius: 2,
                          height: 40,
                          fontSize: "12px",
                          width: "48%",
                          borderColor: "#e0e0e0",
                          gap: 1,
                        }}
                      >
                        <FavoriteIcon sx={{ fontSize: 13, color: "red" }} />
                        Wishlist
                      </Button>
                      <Button
                        variant="contained"
                        size="small"
                        onClick={() => handleAddToCart(item)}
                        sx={{
                          textTransform: "none",
                          width: "55%",
                          borderRadius: 2,
                          backgroundColor: "#ff5722",
                          height: 40,
                          p: 0,
                          lineHeight: 1.1,
                          fontSize: "12px",
                          "&:hover": { backgroundColor: "#e64a19" },
                        }}
                      >
                        Add to Cart
                      </Button>
                    </Box>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </>
        ) : selectedCategory ? (
          <Typography sx={{ textAlign: "center", mt: 3 }}>
            No items found for {selectedCategory}.
          </Typography>
        ) : null}
      </Box>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity="success"
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default RequestOrder;
