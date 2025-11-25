import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  CircularProgress,
  LinearProgress,
  Button,
  IconButton,
  Card,
} from "@mui/material";
import LaptopIcon from "@mui/icons-material/Laptop";
import HeadphonesIcon from "@mui/icons-material/Headphones";
import MonitorIcon from "@mui/icons-material/Monitor";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import MouseIcon from "@mui/icons-material/Mouse";
import KeyboardIcon from "@mui/icons-material/Keyboard";
import CategoryIcon from "@mui/icons-material/Category";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { useNavigate } from "react-router-dom";
import { useOrders } from "../../context/OrderContext";
import { useThemeColors } from "../../hooks/useThemeColors";
import { useTheme } from "../../context/ThemeContext";
import { useEffect, useState } from "react";

const OrderProgress = () => {
  const { orders, isLoading } = useOrders();
  const navigate = useNavigate();
  const colors = useThemeColors();
  const { themeMode } = useTheme();
  const [progress, setProgress] = useState(0);

  // Calculate progress based on order status
  useEffect(() => {
    if (orders.length === 0) {
      setProgress(0);
      return;
    }

    // Calculate progress based on order status
    const completedOrders = orders.filter(
      (order) => order.status === "completed"
    ).length;
    const progressPercentage = (completedOrders / orders.length) * 100;
    setProgress(Math.round(progressPercentage));
  }, [orders]);

  const getIconForCategory = (category: string) => {
    switch (category.toLowerCase()) {
      case "laptop":
        return <LaptopIcon sx={{ color: colors.status.error }} />;
      case "mouse":
        return <MouseIcon sx={{ color: colors.status.warning }} />;
      case "keyboard":
        return <KeyboardIcon sx={{ color: colors.status.info }} />;
      case "monitor":
        return <MonitorIcon sx={{ color: colors.status.success }} />;
      case "headphones":
        return <HeadphonesIcon sx={{ color: colors.special.uploadIcon }} />;
      case "webcam":
        return <CameraAltIcon sx={{ color: colors.status.error }} />;
      default:
        return <CategoryIcon sx={{ color: colors.text.gray }} />;
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch {
      return "Invalid date";
    }
  };

  if (isLoading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height={200}
      >
        <CircularProgress sx={{ color: colors.primary.main }} />
      </Box>
    );
  }

  return (
    <Box>
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Typography
          variant="h6"
          fontWeight={800}
          sx={{
            fontSize: "25px",
            height: "40px",
            color: colors.text.primary,
          }}
        >
          My Orders
        </Typography>

        <Button
          variant="contained"
          sx={{
            backgroundColor: colors.primary.main,
            color: colors.text.white,
            textTransform: "none",
            fontWeight: 600,
            "&:hover": {
              backgroundColor: colors.primary.dark,
            },
          }}
          onClick={() => navigate("/accountant/requestorder")}
        >
          Request Order +
        </Button>
      </Box>

      {/* If No Orders */}
      {orders.length === 0 ? (
        <Card
          sx={{
            mt: 2,
            p: 3,
            textAlign: "center",
            backgroundColor: colors.background.card,
            border: `1px solid ${colors.border.light}`,
          }}
        >
          <Typography
            sx={{
              fontWeight: 600,
              color: colors.text.secondary,
              fontSize: "18px",
            }}
          >
            No orders yet
          </Typography>
          <Typography
            sx={{
              color: colors.text.secondary,
              mt: 1,
              fontSize: "14px",
            }}
          >
            Start by requesting an order to see your progress here.
          </Typography>
        </Card>
      ) : (
        <Box>
          {/* Orders List */}
          <Typography variant="h6" sx={{ mb: 2, color: colors.text.primary }}>
            Recent Orders ({orders.length})
          </Typography>

          <List sx={{ mb: 4 }}>
            {orders.slice(0, 5).map((order) => (
              <Card
                key={order.id}
                sx={{
                  mb: 2,
                  p: 2,
                  backgroundColor: colors.background.card,
                  border: `1px solid ${colors.border.light}`,
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    mb: 1,
                  }}
                ></Box>

                <Typography
                  variant="body2"
                  sx={{ color: colors.text.secondary, mb: 1 }}
                >
                  {formatDate(order.order_date)}
                </Typography>

                <Box sx={{ mt: 1 }}>
                  {order.items.slice(0, 3).map((item, index) => (
                    <ListItem
                      key={`${order.id}-${index}`}
                      disablePadding
                      sx={{
                        mb: 1,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 2 }}
                      >
                        <ListItemIcon
                          sx={{
                            bgcolor:
                              themeMode === "dark"
                                ? colors.background.card
                                : colors.background.white,
                            borderRadius: "50%",
                            width: 40,
                            height: 40,
                            minWidth: "auto",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            border: `1px solid ${colors.border.light}`,
                            boxShadow: colors.shadow.light,
                          }}
                        >
                          {getIconForCategory(item.category)}
                        </ListItemIcon>

                        <Box>
                          <Typography
                            sx={{
                              color: colors.text.primary1,
                              fontWeight: 500,
                              fontSize: "14px",
                            }}
                          >
                            {`${item.brand} ${item.category}`}
                          </Typography>
                          <Typography
                            sx={{
                              color: colors.text.secondary,
                              fontSize: "12px",
                            }}
                          >
                            Qty: {item.quantity} × ₹{item.price}
                          </Typography>
                        </Box>
                      </Box>

                      <Typography
                        sx={{
                          color: colors.text.primary1,
                          fontWeight: 600,
                          fontSize: "14px",
                        }}
                      >
                        ₹{(item.quantity * item.price).toLocaleString()}
                      </Typography>
                    </ListItem>
                  ))}

                  {order.items.length > 3 && (
                    <Typography
                      variant="body2"
                      sx={{
                        color: colors.text.secondary,
                        textAlign: "center",
                        mt: 1,
                      }}
                    >
                      +{order.items.length - 3} more items
                    </Typography>
                  )}
                </Box>

                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mt: 2,
                    pt: 1,
                    borderTop: `1px solid ${colors.border.light}`,
                  }}
                >
                  <Box>
                    <Typography
                      variant="body2"
                      sx={{
                        color: colors.text.primary1,
                        fontWeight: 600,
                      }}
                    >
                      Total: ₹{order.total.toLocaleString()}
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{
                        color: colors.text.secondary,
                      }}
                    >
                      Payment: {order.payment_method}
                    </Typography>
                  </Box>
                  <IconButton size="small">
                    <MoreVertIcon sx={{ color: colors.text.primary1 }} />
                  </IconButton>
                </Box>
              </Card>
            ))}
          </List>
        </Box>
      )}

      {/* Progress Section */}
      <Card
        sx={{
          mt: 4,
          p: 3,
          backgroundColor: colors.background.card,
          border: `1px solid ${colors.border.light}`,
        }}
      >
        <Typography
          variant="h6"
          fontWeight={600}
          sx={{ color: colors.text.primary1, mb: 3, textAlign: "center" }}
        >
          Order Progress
        </Typography>

        <Box
          sx={{
            position: "relative",
            display: "inline-flex",
            mt: 2,
            width: "100%",
            justifyContent: "center",
          }}
        >
          <CircularProgress
            variant="determinate"
            value={progress}
            size={120}
            thickness={4}
            sx={{ color: colors.primary.main }}
          />

          <Box
            sx={{
              top: 0,
              left: 0,
              bottom: 0,
              right: 0,
              position: "absolute",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Typography
              variant="h6"
              fontWeight={700}
              sx={{ color: colors.text.primary1 }}
            >
              {progress}%
            </Typography>
          </Box>
        </Box>

        <Box sx={{ mt: 3 }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
            <Typography
              variant="body2"
              fontWeight={500}
              sx={{ color: colors.text.primary1 }}
            >
              Overall Progress
            </Typography>
            <Typography variant="body2" sx={{ color: colors.text.secondary }}>
              {orders.filter((order) => order.status === "completed").length} of{" "}
              {orders.length} completed
            </Typography>
          </Box>

          <LinearProgress
            variant="determinate"
            value={progress}
            sx={{
              height: 8,
              borderRadius: 5,
              backgroundColor:
                themeMode === "dark"
                  ? colors.background.lightGray
                  : colors.border.light,
              "& .MuiLinearProgress-bar": {
                backgroundColor: colors.primary.main,
              },
            }}
          />
        </Box>

        {/* Status Legend */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-around",
            mt: 3,
            flexWrap: "wrap",
            gap: 1,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Box
              sx={{
                width: 12,
                height: 12,
                borderRadius: "50%",
                backgroundColor: colors.status.success,
              }}
            />
            <Typography
              variant="body2"
              sx={{ color: colors.text.secondary, fontSize: "12px" }}
            >
              Completed
            </Typography>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Box
              sx={{
                width: 12,
                height: 12,
                borderRadius: "50%",
                backgroundColor: colors.status.warning,
              }}
            />
            <Typography
              variant="body2"
              sx={{ color: colors.text.secondary, fontSize: "12px" }}
            >
              Pending
            </Typography>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Box
              sx={{
                width: 12,
                height: 12,
                borderRadius: "50%",
                backgroundColor: colors.status.info,
              }}
            />
            <Typography
              variant="body2"
              sx={{ color: colors.text.secondary, fontSize: "12px" }}
            >
              Shipped
            </Typography>
          </Box>
        </Box>
      </Card>
    </Box>
  );
};

export default OrderProgress;
