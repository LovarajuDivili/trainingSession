import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import BuildCircleIcon from "@mui/icons-material/BuildCircle";
import CodeIcon from "@mui/icons-material/Code";
import PersonIcon from "@mui/icons-material/Person";
import DataObjectIcon from "@mui/icons-material/DataObject";
import BugReportIcon from "@mui/icons-material/BugReport";

export const roles = [
  {
    value: "Admin",
    label: "Admin",
    icon: <AdminPanelSettingsIcon sx={{ color: "#9b57f5" }} />,
  },
  {
    value: "Technical",
    label: "Technical",
    icon: <BuildCircleIcon sx={{ color: "#00bcd4" }} />,
  },
  {
    value: "Developer",
    label: "Developer",
    icon: <CodeIcon sx={{ color: "#4caf50" }} />,
  },
];

export const secondaryRoles = [
  {
    value: "Functional",
    label: "Functional",
    icon: <PersonIcon sx={{ color: "#ff9800" }} />,
  },
  {
    value: "Migrator",
    label: "Migrator",
    icon: <DataObjectIcon sx={{ color: "#9e9e9e" }} />,
  },
  {
    value: "Tester",
    label: "Tester",
    icon: <BugReportIcon sx={{ color: "#f44336" }} />,
  },
];


