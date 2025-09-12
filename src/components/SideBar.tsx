// Sidebar.tsx
import { Box, List, ListItem, ListItemButton, ListItemIcon, ListItemText } from "@mui/material";
import SettingsIcon from "@mui/icons-material/Settings";
import StorageIcon from "@mui/icons-material/Storage";
import DatabaseIcon from "@mui/icons-material/Dns";
import LayersIcon from "@mui/icons-material/Layers";
import BarChartIcon from "@mui/icons-material/BarChart";
import ReceiptIcon from "@mui/icons-material/Receipt";
import { useNavigate } from "react-router-dom";

const sidebarItems = [
  { label: "General Configuration", icon: <SettingsIcon />, path: "/general" },
  { label: "LLM Garden", icon: <LayersIcon />, path: "/llm-garden" },
  { label: "Database", icon: <DatabaseIcon />, path: "/database" },
  { label: "Storage Provider", icon: <StorageIcon />, path: "/storage" },
  { label: "Projects", icon: <ReceiptIcon />, path: "/projects" },
  { label: "Statistics", icon: <BarChartIcon />, path: "/statistics" },
  { label: "Logs", icon: <ReceiptIcon />, path: "/logs" },
];

const Sidebar = () => {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        width: 240,
        height: "100vh",
        bgcolor: "#f5f5f5",
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
              <ListItemText primary={item.label} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default Sidebar;
