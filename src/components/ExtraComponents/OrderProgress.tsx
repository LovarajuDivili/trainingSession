import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  //ListItemText,
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
import { useThemeColors } from "../../hooks/useThemeColors";
import { useTheme } from "../../context/ThemeContext";

const OrderProgress = () => {
  const { orders } = useOrders();
  const navigate = useNavigate();
  const colors = useThemeColors();
  const { themeMode } = useTheme();

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
        <Typography
          sx={{
            textAlign: "center",
            fontWeight: 600,
            color: colors.text.secondary,
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
                    bgcolor: themeMode === "dark" ? colors.background.card : colors.background.white,
                    borderRadius: "50%",
                    width: 45,
                    height: 45,
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
                      color: colors.text.primary, 
                      fontWeight: 500,
                      fontSize: "16px"
                    }}
                  >
                    {`${item.brand} ${item.category}`}
                  </Typography>
                  <Typography 
                    sx={{ 
                      color: colors.text.secondary,
                      fontSize: "14px"
                    }}
                  >
                    {item.hours}
                  </Typography>
                </Box>
              </Box>

              <IconButton>
                <MoreVertIcon sx={{ color: colors.text.primary }} />
              </IconButton>
            </ListItem>
          ))}
        </List>
      )}

      {/* ----- Progress Section ----- */}
      <Box mt={4} textAlign="center">
        <Typography
          variant="subtitle1"
          fontWeight={600}
          sx={{ color: colors.text.primary, mb: 2 }}
        >
          Order Progress
        </Typography>

        <Box sx={{ position: "relative", display: "inline-flex", mt: 2 }}>
          <CircularProgress
            variant="determinate"
            value={orders.length > 0 ? 70 : 0}
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
              sx={{ color: colors.text.primary }}
            >
              {orders.length > 0 ? "70%" : "0%"}
            </Typography>
          </Box>
        </Box>

        <Typography
          variant="body2"
          fontWeight={500}
          sx={{
            mb: 1,
            mt: 2,
            textAlign: "left",
            color: colors.text.primary,
          }}
        >
          Progress
        </Typography>

        <LinearProgress
          variant="determinate"
          value={orders.length > 0 ? 70 : 0}
          sx={{
            height: 8,
            borderRadius: 5,
            backgroundColor: themeMode === "dark" ? colors.background.lightGray : colors.border.light,
            "& .MuiLinearProgress-bar": {
              backgroundColor: colors.primary.main,
            },
          }}
        />
      </Box>
    </Box>
  );
};

export default OrderProgress;