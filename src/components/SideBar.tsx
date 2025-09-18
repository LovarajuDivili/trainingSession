import { Box, List, ListItem, ListItemButton, ListItemIcon, ListItemText } from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import PeopleIcon from "@mui/icons-material/People";
import DeveloperModeIcon from "@mui/icons-material/DeveloperMode";
import BugReportIcon from "@mui/icons-material/BugReport";
import CloudIcon from "@mui/icons-material/Cloud";
import AssignmentIcon from "@mui/icons-material/Assignment";
import BarChartIcon from "@mui/icons-material/BarChart";
import HistoryIcon from "@mui/icons-material/History";

const sidebarItems = [
  { label: "All Employees", route: "/admin/all-employees", icon: <PeopleIcon /> },
  { label: "Developers", route: "/admin/developers", icon: <DeveloperModeIcon /> },
  { label: "Testers", route: "/admin/testers", icon: <BugReportIcon /> },
  { label: "AWS Team", route: "/admin/aws-team", icon: <CloudIcon /> },
  { label: "Projects", route: "/admin/projects", icon: <AssignmentIcon /> },
  { label: "Statistics", route: "/admin/statistics", icon: <BarChartIcon /> },
  { label: "Logs", route: "/admin/logs", icon: <HistoryIcon /> },
];

const SideBar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <Box
      sx={{
        width: 240,
        height: "100vh",
        bgcolor: "white",
        borderRight: "1px solid #ddd",
        position: "fixed",
        top: 50,
        left: 0,
      }}
    >
      <List>
        {sidebarItems.map((item) => (
          <ListItem key={item.label} disablePadding>
            <ListItemButton
              selected={location.pathname === item.route}
              onClick={() => navigate(item.route)}
            >
              <ListItemIcon sx={{ color: "black" }}>
              {item.icon}
            </ListItemIcon>
              <ListItemText primary={item.label} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default SideBar;
