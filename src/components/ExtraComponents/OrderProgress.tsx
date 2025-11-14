import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  CircularProgress,
  LinearProgress,
  Button,
  IconButton,
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

const OrderProgress = () => {
  const { orders } = useOrders();
  const navigate = useNavigate();

  const getIconForCategory = (category: string) => {
    switch (category.toLowerCase()) {
      case "laptop":
        return <LaptopIcon sx={{ color: "#ff3b30" }} />;
      case "mouse":
        return <MouseIcon sx={{ color: "#ff9800" }} />;
      case "keyboard":
        return <KeyboardIcon sx={{ color: "#0084ff" }} />;
      case "monitor":
        return <MonitorIcon sx={{ color: "#22c55e" }} />;
      case "headphones":
        return <HeadphonesIcon sx={{ color: "#9c27b0" }} />;
      case "webcam":
        return <CameraAltIcon sx={{ color: "#f44336" }} />;
      default:
        return <CategoryIcon sx={{ color: "gray" }} />;
    }
  };

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
          sx={{ fontSize: "25px", height: "40px" }}
        >
          My Orders
        </Typography>

        <Button
          variant="contained"
          sx={{
            backgroundColor: "#906aff",
            textTransform: "none",
            fontWeight: 600,
          }}
          onClick={() => navigate("/accountant/requestorder")}
        >
          Request Order +
        </Button>
      </Box>

      {/* If No Orders */}
      {orders.length === 0 ? (
        <Typography
          sx={{
            textAlign: "center",
            fontWeight: 600,
            color: "gray",
            mt: 4,
            fontSize: "18px",
          }}
        >
          No orders yet
        </Typography>
      ) : (
        <List>
          {orders.map((item, index) => (
            <ListItem
              key={index}
              disablePadding
              sx={{
                mb: 2,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <ListItemIcon
                  sx={{
                    bgcolor: "white",
                    borderRadius: "50%",
                    width: 45,
                    height: 45,
                    minWidth: "auto",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    border: "1px solid #e0e0e0",
                    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                  }}
                >
                  {getIconForCategory(item.category)}
                </ListItemIcon>

                <ListItemText
                  primary={`${item.brand} ${item.category}`}
                  secondary={item.hours}
                  primaryTypographyProps={{ fontWeight: 500 }}
                />
              </Box>

              <IconButton>
                <MoreVertIcon sx={{ color: "gray" }} />
              </IconButton>
            </ListItem>
          ))}
        </List>
      )}

      {/* ----- Progress Section ----- */}
      <Box mt={4} textAlign="center">
        <Typography variant="subtitle1" fontWeight={600}>
          Order Progress
        </Typography>

        <Box sx={{ position: "relative", display: "inline-flex", mt: 2 }}>
          <CircularProgress
            variant="determinate"
            value={orders.length > 0 ? 70 : 0}
            size={120}
            thickness={4}
            sx={{ color: "#906aff" }}
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
            <Typography variant="h6" fontWeight={700}>
              {orders.length > 0 ? "70%" : "0%"}
            </Typography>
          </Box>
        </Box>

        <Typography
          variant="body2"
          fontWeight={500}
          sx={{ mb: 1, textAlign: "left" }}
        >
          Progress
        </Typography>

        <LinearProgress
          variant="determinate"
          value={orders.length > 0 ? 70 : 0}
          sx={{
            height: 8,
            borderRadius: 5,
            backgroundColor: "#e0e0e0",
            "& .MuiLinearProgress-bar": { backgroundColor: "#906aff" },
          }}
        />
      </Box>
    </Box>
  );
};

export default OrderProgress;
