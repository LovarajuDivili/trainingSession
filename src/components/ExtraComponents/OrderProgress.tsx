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
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { useNavigate } from "react-router-dom";

const OrderProgress = () => {
  const navigate = useNavigate();
  return (
    <Box>
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
            "&:hover": { backgroundColor: "#7a5de0" },
          }}
          onClick={() => navigate("/accountant/requestorder")}
        >
          Request Order +
        </Button>
      </Box>
      <List>
        {[
          {
            icon: <LaptopIcon sx={{ color: "#ff6b8eff" }} />,
            name: "Laptop",
            hours: "08:39",
          },
          {
            icon: <HeadphonesIcon sx={{ color: "#feca57" }} />,
            name: "Head Phones",
            hours: "13:20",
          },
          {
            icon: <MonitorIcon sx={{ color: "#1dd1a1" }} />,
            name: "Monitors",
            hours: "18:30",
          },
          {
            icon: <CameraAltIcon sx={{ color: "#54a0ff" }} />,
            name: "WebCameras",
            hours: "12:30",
          },
        ].map((course, index) => (
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
                {course.icon}
              </ListItemIcon>
              <ListItemText
                sx={{ pl: 2 }}
                primary={course.name}
                secondary={course.hours}
                primaryTypographyProps={{ fontWeight: 500 }}
              />
            </Box>
            <IconButton>
              <MoreVertIcon sx={{ color: "gray" }} />
            </IconButton>
          </ListItem>
        ))}
      </List>

      <Box mt={4} textAlign="center">
        <Typography variant="subtitle1" fontWeight={600}>
          Order Progress
        </Typography>
        <Box sx={{ position: "relative", display: "inline-flex", mt: 2 }}>
          <CircularProgress
            variant="determinate"
            value={70}
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
              70%
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
          value={70}
          sx={{
            height: 8,
            borderRadius: 5,
            backgroundColor: "#e0e0e0",
            "& .MuiLinearProgress-bar": {
              backgroundColor: "#906aff",
            },
          }}
        />
      </Box>
    </Box>
  );
};

export default OrderProgress;
