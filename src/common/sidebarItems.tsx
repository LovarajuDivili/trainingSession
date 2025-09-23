// src/common/sidebarItems.ts
import PeopleIcon from "@mui/icons-material/People";
import DeveloperModeIcon from "@mui/icons-material/DeveloperMode";
import BugReportIcon from "@mui/icons-material/BugReport";
import CloudIcon from "@mui/icons-material/Cloud";
import AssignmentIcon from "@mui/icons-material/Assignment";
import BarChartIcon from "@mui/icons-material/BarChart";
import HistoryIcon from "@mui/icons-material/History";

export const sidebarItems = [
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
  { label: "Testers", route: "/admin/testers", icon: <BugReportIcon /> },
  { label: "AWS Team", route: "/admin/aws-team", icon: <CloudIcon /> },

  { label: "Statistics", route: "/admin/statistics", icon: <BarChartIcon /> },
  { label: "Logs", route: "/admin/logs", icon: <HistoryIcon /> },
];
