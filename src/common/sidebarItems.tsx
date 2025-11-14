// src/common/sidebarItems.ts
import PeopleIcon from "@mui/icons-material/People";
import EventIcon from "@mui/icons-material/Event";
import AssignmentIcon from "@mui/icons-material/Assignment";
import BarChartIcon from "@mui/icons-material/BarChart";
import HistoryIcon from "@mui/icons-material/History";
import DashboardIcon from "@mui/icons-material/Dashboard";

export const sidebarItems = [
  {
    label: "Dashboard",
    route: "/admin/dashboard",
    icon: <DashboardIcon />,
  },
  {
    label: "All Employees",
    route: "/admin/all-employees",
    icon: <PeopleIcon />,
  },
  { label: "Projects", route: "/admin/projects", icon: <AssignmentIcon /> },
  {
    label: "Openings and Events",
    route: "/admin/openingsEvents",
    icon: <EventIcon />,
  },

  { label: "Statistics", route: "/admin/statistics", icon: <BarChartIcon /> },
  { label: "Logs", route: "/admin/logs", icon: <HistoryIcon /> },
];
