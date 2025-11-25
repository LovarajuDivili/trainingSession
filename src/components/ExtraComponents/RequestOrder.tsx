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
import CloseIcon from "@mui/icons-material/Close";
import { useEffect } from "react";
import { useThemeColors } from "../../hooks/useThemeColors";

const RequestOrder = () => {
  const navigate = useNavigate();
  const colors = useThemeColors();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [itemsData, setItemsData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const { cart, addToCart, removeFromCart } = useCart();

  useEffect(() => {
    handleCategoryClick("laptop"); // Load laptops on initial render
  }, []);

  const items = [
    {
      name: "Laptop",
      icon: <LaptopIcon sx={{ fontSize: 35, color: colors.status.error }} />,
    },
    {
      name: "Monitor",
      icon: <MonitorIcon sx={{ fontSize: 35, color: colors.status.success }} />,
    },
    {
      name: "Keyboard",
      icon: <KeyboardIcon sx={{ fontSize: 35, color: colors.status.info }} />,
    },
    {
      name: "Mouse",
      icon: <MouseIcon sx={{ fontSize: 35, color: colors.status.warning }} />,
    },
    {
      name: "Headphones",
      icon: (
        <HeadphonesIcon
          sx={{ fontSize: 35, color: colors.special.uploadIcon }}
        />
      ),
    },
    {
      name: "Webcam",
      icon: <CameraAltIcon sx={{ fontSize: 35, color: colors.status.error }} />,
    },
  ];

  const categoryIcons: Record<string, JSX.Element> = {
    laptop: <LaptopIcon sx={{ fontSize: 25, color: colors.status.error }} />,
    monitor: (
      <MonitorIcon sx={{ fontSize: 25, color: colors.status.success }} />
    ),
    keyboard: <KeyboardIcon sx={{ fontSize: 25, color: colors.status.info }} />,
    mouse: <MouseIcon sx={{ fontSize: 25, color: colors.status.warning }} />,
    headphones: (
      <HeadphonesIcon sx={{ fontSize: 25, color: colors.special.uploadIcon }} />
    ),
    webcam: <CameraAltIcon sx={{ fontSize: 25, color: colors.status.error }} />,
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

  const handleAllItemsClick = async () => {
    try {
      setSelectedCategory("others");
      setLoading(true);
      const response = await axios.get(
        `http://localhost:8000/v-1/application/inventory/`
      );

      const shuffled = shuffleArray(response.data);
      setItemsData(shuffled);
    } catch (error) {
      console.error("Error fetching all inventory data:", error);
      setItemsData([]);
    } finally {
      setLoading(false);
    }
  };

  const shuffleArray = (array: any[]) => {
    return array
      .map((item) => ({ item, sort: Math.random() }))
      .sort((a, b) => a.sort - b.sort)
      .map(({ item }) => item);
  };

  // Add item to cart
  const handleAddToCart = (item: any) => {
    addToCart(item);
    setSnackbarMessage(`Added ${item.brand} ${item.category} to cart`);
    setSnackbarOpen(true);
  };

  const isInCart = (id: string) => {
    return cart.some((cartItem: any) => cartItem._id === id);
  };

  const handleRemoveFromCart = (itemId: string, itemName: string) => {
    removeFromCart(itemId);
    setSnackbarMessage(`Removed ${itemName} from cart`);
    setSnackbarOpen(true);
  };

  const handleClose = () => {
    navigate("/accountant");
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const getSortedItems = () => {
  return [...itemsData].sort((a, b) => {
    const aInCart = isInCart(a._id);
    const bInCart = isInCart(b._id);
    
    if (aInCart && !bInCart) return -1; // a (in cart) comes first
    if (!aInCart && bInCart) return 1;  // b (in cart) comes first
    return 0; // keep original order for both in cart or both not in cart
  });
};

  return (
    <Box
      sx={{
        minHeight: "88vh",
        backgroundColor: colors.background.white,
        color: colors.text.primary,
      }}
    >
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
        <Typography
          variant="h5"
          fontWeight="bold"
          sx={{ color: colors.text.primary }}
        >
          Select the Items
        </Typography>

        <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
          <Typography
            variant="body1"
            sx={{ color: colors.primary.main, fontWeight: 600 }}
          >
            Cart: {cart.length} items
          </Typography>
          <Button
            variant="contained"
            onClick={handleClose}
            sx={{
              textTransform: "none",
              borderRadius: 2,
              boxShadow: 3,
              backgroundColor: colors.primary.main,
              color: colors.text.white,
              "&:hover": {
                backgroundColor: colors.primary.dark,
                boxShadow: 4,
              },
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
                    ? colors.primary.lighter
                    : colors.background.card,
                border: `1px solid ${colors.border.light}`,
                transition: "0.3s",
                cursor: "pointer",
                "&:hover": {
                  backgroundColor: colors.primary.lighter,
                  transform: "scale(1.03)",
                  boxShadow: 6,
                  borderColor: colors.primary.main,
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
                  sx={{ color: colors.text.primary1, textAlign: "center" }}
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
                selectedCategory === "others"
                  ? colors.primary.lighter
                  : colors.background.card,
              border: `1px solid ${colors.border.light}`,
              transition: "0.3s",
              cursor: "pointer",
              "&:hover": {
                backgroundColor: colors.primary.lighter,
                transform: "scale(1.03)",
                boxShadow: 6,
                borderColor: colors.primary.main,
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
              <CategoryIcon
                sx={{ fontSize: 35, color: colors.text.secondary }}
              />
              <Typography
                variant="h6"
                fontWeight={600}
                sx={{ color: colors.text.primary1, textAlign: "center" }}
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
            <CircularProgress sx={{ color: colors.primary.main }} />
          </Box>
        ) : selectedCategory && itemsData.length > 0 ? (
          <>
            <Typography variant="h6" sx={{ mb: 2, color: colors.text.primary }}>
              Showing{" "}
              {selectedCategory === "others"
                ? "all items"
                : selectedCategory + "s"}
              :
            </Typography>
            <Grid container spacing={7}>
              {getSortedItems().map((item) => (
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
                      backgroundColor: colors.background.card,
                      border: `1px solid ${colors.border.light}`,
                      "&:hover": {
                        boxShadow: 6,
                        transform: "scale(1.02)",
                        borderColor: colors.primary.light,
                      },
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
                        <Typography
                          variant="body2"
                          sx={{
                            color: colors.text.primary1,
                            fontWeight: 600,
                          }}
                        >
                          <strong>{item.category}</strong>
                        </Typography>
                        {categoryIcons[item.category?.toLowerCase()] || (
                          <CategoryIcon
                            sx={{ fontSize: 15, color: colors.text.secondary }}
                          />
                        )}
                      </Box>

                      <Typography
                        variant="body2"
                        sx={{ color: colors.text.primary1 }}
                      >
                        Brand: {item.brand}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{ color: colors.text.primary1 }}
                      >
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
                          borderColor: colors.border.light,
                          gap: 1,
                          color: colors.text.primary,
                          backgroundColor: colors.background.white,
                          "&:hover": {
                            borderColor: colors.primary.main,
                            backgroundColor: colors.primary.lighter,
                          },
                        }}
                      >
                        <FavoriteIcon
                          sx={{ fontSize: 13, color: colors.status.error }}
                        />
                        Wishlist
                      </Button>
                      {isInCart(item._id) ? (
                        <Button
                          variant="outlined"
                          size="small"
                          onClick={() =>
                            handleRemoveFromCart(
                              item._id,
                              `${item.brand} ${item.category}`
                            )
                          }
                          sx={{
                            textTransform: "none",
                            width: "55%",
                            borderRadius: 2,
                            height: 40,
                            p: 0,
                            lineHeight: 1.1,
                            fontSize: "12px",
                            borderColor: colors.status.error,
                            color: colors.status.error,
                            backgroundColor: colors.background.white,
                            gap: 0.5,
                            "&:hover": {
                              backgroundColor: colors.status.error + "20",
                              borderColor: colors.status.error,
                            },
                          }}
                        >
                          <CloseIcon sx={{ fontSize: 16 }} />
                          Remove
                        </Button>
                      ) : (
                        <Button
                          variant={
                            isInCart(item._id) ? "outlined" : "contained"
                          }
                          size="small"
                          disabled={isInCart(item._id)}
                          onClick={() => handleAddToCart(item)}
                          sx={{
                            textTransform: "none",
                            width: "55%",
                            borderRadius: 2,
                            backgroundColor: isInCart(item._id)
                              ? colors.status.success
                              : colors.primary.main,
                            color: colors.text.white,
                            height: 40,
                            p: 0,
                            lineHeight: 1.1,
                            fontSize: "12px",
                            borderColor: isInCart(item._id)
                              ? colors.status.success
                              : "transparent",
                            "&:hover": {
                              backgroundColor: isInCart(item._id)
                                ? colors.status.success
                                : colors.primary.dark,
                            },
                            "&:disabled": {
                              backgroundColor: colors.background.disabled,
                              color: colors.text.disabled,
                              borderColor: colors.border.light,
                            },
                          }}
                        >
                          {isInCart(item._id) ? "✓ Added" : "Add to Cart"}
                        </Button>
                      )}
                    </Box>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </>
        ) : selectedCategory ? (
          <Typography
            sx={{
              textAlign: "center",
              mt: 3,
              color: colors.text.secondary,
            }}
          >
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
          sx={{
            width: "100%",
            backgroundColor: colors.status.success,
            color: colors.text.white,
            "& .MuiAlert-icon": {
              color: colors.text.white,
            },
          }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default RequestOrder;
