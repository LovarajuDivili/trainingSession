// common/dropdowns.ts

import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import BuildCircleIcon from "@mui/icons-material/BuildCircle";
import CodeIcon from "@mui/icons-material/Code";

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
