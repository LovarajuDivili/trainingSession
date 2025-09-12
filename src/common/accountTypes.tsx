import React from "react";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import SettingsIcon from "@mui/icons-material/Settings";
import CodeIcon from "@mui/icons-material/Code";
import BuildIcon from "@mui/icons-material/Build";
import TransformIcon from "@mui/icons-material/Transform";
import BugReportIcon from "@mui/icons-material/BugReport";

export interface AccountSelectionProps {
  accountType: string;
  setAccountType: (type: string) => void;
}

export interface AccountType {
  value: string;
  label: string;
  icon: React.ReactNode;
}

export const accountTypes: AccountType[] = [
  {
    value: "Admin",
    label: "Admin",
    icon: <AdminPanelSettingsIcon sx={{ color: "#a084e8" }} />,
  },
  {
    value: "Technical",
    label: "Technical",
    icon: <SettingsIcon sx={{ color: "#5bc0f8" }} />,
  },
  {
    value: "Developer",
    label: "Developer",
    icon: <CodeIcon sx={{ color: "#00b894" }} />,
  },
  {
    value: "Functional",
    label: "Functional",
    icon: <BuildIcon sx={{ color: "#fd7e14" }} />,
  },
  {
    value: "Migrator",
    label: "Migrator",
    icon: <TransformIcon sx={{ color: "#ff6f61" }} />,
  },
  {
    value: "Tester",
    label: "Tester",
    icon: <BugReportIcon sx={{ color: "#ff9f1c" }} />,
  },
];
