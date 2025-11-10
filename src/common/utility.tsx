import type { JSX } from "react";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import CodeIcon from "@mui/icons-material/Code";
import SettingsApplicationsIcon from "@mui/icons-material/SettingsApplications";
import SyncAltIcon from "@mui/icons-material/SyncAlt";
import BugReportIcon from "@mui/icons-material/BugReport";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import GroupIcon from "@mui/icons-material/Group";
import PersonAddIcon from "@mui/icons-material/Group";

export const roleIcons: Record<string, JSX.Element> = {
  admin: <AdminPanelSettingsIcon sx={{ fontSize: 18, color: "white" }} />,
  accountant: (
    <AccountBalanceWalletIcon sx={{ fontSize: 18, color: "white" }} />
  ),
  developer: <CodeIcon sx={{ fontSize: 18, color: "white" }} />,
  functional: (
    <SettingsApplicationsIcon sx={{ fontSize: 18, color: "white" }} />
  ),
  migrator: <SyncAltIcon sx={{ fontSize: 18, color: "white" }} />,
  tester: <BugReportIcon sx={{ fontSize: 18, color: "white" }} />,
  hrteam: <PersonAddIcon sx={{ fontSize: 18, color: "white" }} />,
};

export const roles = [
  {
    value: "admin",
    label: "Admin",
    description: "Create & Manage Projects",
    icon: <AdminPanelSettingsIcon sx={{ fontSize: 50, color: "#ff9b73" }} />,
    active: true,
  },
  {
    value: "accountant",
    label: "Accountant",
    description: "Manage Accounts & Finance",
    icon: <AccountBalanceWalletIcon sx={{ fontSize: 50, color: "#73b5ff" }} />,
    active: true,
  },
  {
    value: "employee",
    label: "Employee",
    description: "Execute daily assigned tasks",
    icon: (
      <GroupIcon sx={{ fontSize: 50, color: "rgba(255, 153, 153, 0.81)" }} />
    ),
    active: false,
  },
  {
    value: "hrteam",
    label: "HR Department",
    description: "Manage Employee & HR work",
    icon: (
      <PersonAddIcon sx={{ fontSize: 50, color: "rgba(216, 153, 255, 1)" }} />
    ),
    active: false,
  },
];
