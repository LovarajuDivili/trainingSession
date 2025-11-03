// src/common/sidebarItems.ts
import PeopleIcon from "@mui/icons-material/People";
import DeveloperModeIcon from "@mui/icons-material/DeveloperMode";
import AssignmentIcon from "@mui/icons-material/Assignment";
import BarChartIcon from "@mui/icons-material/BarChart";
import HistoryIcon from "@mui/icons-material/History";

export const sidebarItems = [
  {
    label: "Dashboard",
    route: "/admin/dashboard",
    icon: <PeopleIcon />,
  },
  {
    label: "All Employees",
    route: "/admin/all-employees",
    icon: <PeopleIcon />,
  },
  { label: "Projects", route: "/admin/projects", icon: <AssignmentIcon /> },
  {
    label: "Developers",
    route: "/admin/developers",
    icon: <DeveloperModeIcon />,
  },

  { label: "Statistics", route: "/admin/statistics", icon: <BarChartIcon /> },
  { label: "Logs", route: "/admin/logs", icon: <HistoryIcon /> },
];
