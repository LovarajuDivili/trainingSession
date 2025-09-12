import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import SettingsIcon from "@mui/icons-material/Settings";
import StorageIcon from "@mui/icons-material/Storage";
import DatabaseIcon from "@mui/icons-material/Dns";
import LayersIcon from "@mui/icons-material/Layers";
import BarChartIcon from "@mui/icons-material/BarChart";
import ReceiptIcon from "@mui/icons-material/Receipt";
import { useNavigate } from "react-router-dom";

const sidebarItems = [
  { label: "General Configuration", icon: <SettingsIcon sx={{ color: "black" }} />, path: "/general" },
  { label: "LLM Garden", icon: <LayersIcon sx={{ color: "black" }} />, path: "/llm-garden" },
  { label: "Database", icon: <DatabaseIcon sx={{ color: "black" }} />, path: "/database" },
  { label: "Storage Provider", icon: <StorageIcon sx={{ color: "black" }} />, path: "/storage" },
  { label: "Projects", icon: <ReceiptIcon sx={{ color: "black" }} />, path: "/projects" },
  { label: "Statistics", icon: <BarChartIcon sx={{ color: "black" }} />, path: "/statistics" },
  { label: "Logs", icon: <ReceiptIcon sx={{ color: "black" }} />, path: "/logs" },
];

const Sidebar = () => {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        width: 240,
        height: "100vh",
        bgcolor: "white",   // ✅ White background
        borderRight: "1px solid #ddd",
        position: "fixed",
        top: 50,
        left: -7,
      }}
    >
      <List>
        {sidebarItems.map((item) => (
          <ListItem key={item.label} disablePadding>
            <ListItemButton onClick={() => navigate(item.path)}>
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText
                primary={item.label}
                primaryTypographyProps={{ sx: { color: "grey.700" } }} // ✅ Grey text
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default Sidebar;
