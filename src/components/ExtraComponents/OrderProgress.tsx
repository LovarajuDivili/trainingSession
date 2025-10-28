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

const OrderProgress = () => (
  <Box>
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        mb: 2,
      }}
    >
      <Typography variant="h6" fontWeight={800} sx={{ fontSize: "25px" }}>
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
      >
        Request Order +
      </Button>
    </Box>
    <List>
      {[
        { icon: <LaptopIcon />, name: "Laptop", hours: "08:39" },
        { icon: <HeadphonesIcon />, name: "Head Phones", hours: "13:20" },
        { icon: <MonitorIcon />, name: "Monitors", hours: "18:30" },
        { icon: <CameraAltIcon />, name: "CC Cameras", hours: "12:30" },
      ].map((course, index) => (
        <ListItem
          key={index}
          disablePadding
          sx={{
            mb: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <ListItemIcon
              sx={{
                bgcolor: "black",
                color: "white",
                borderRadius: "50%",
                width: 45,
                height: 45,
                minWidth: "auto",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
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

export default OrderProgress;
