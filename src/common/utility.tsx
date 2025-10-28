import type { JSX } from "react";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import CodeIcon from "@mui/icons-material/Code";
import SettingsApplicationsIcon from "@mui/icons-material/SettingsApplications";
import SyncAltIcon from "@mui/icons-material/SyncAlt";
import BugReportIcon from "@mui/icons-material/BugReport";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import GroupIcon from "@mui/icons-material/Group";
import type { DropdownItem } from "./types";

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
  hrteam: <GroupIcon sx={{ fontSize: 18, color: "white" }} />,
};

export const roleDropdowns: DropdownItem[] = [
  {
    value: "admin",
    label: "Admin",
    icon: <AdminPanelSettingsIcon sx={{ color: "#1976d2" }} />,
  },
  {
    value: "accountant",
    label: "Accountant",
    icon: <AccountBalanceWalletIcon sx={{ color: "#b9d219ff" }} />,
  },
  {
    value: "developer",
    label: "Developer",
    icon: <CodeIcon sx={{ color: "black" }} />,
  },
  {
    value: "functional",
    label: "Functional",
    icon: <SettingsApplicationsIcon sx={{ color: "#ffbeb5ff" }} />,
  },
  {
    value: "migrator",
    label: "Migrator",
    icon: <SyncAltIcon sx={{ color: "#19d23eff" }} />,
  },
  {
    value: "tester",
    label: "Tester",
    icon: <BugReportIcon sx={{ color: "#d21919ff" }} />,
  },
  {
    value: "hrteam",
    label: "HR Team",
    icon: <GroupIcon sx={{ color: "#d21919ff" }} />,
  },
];
