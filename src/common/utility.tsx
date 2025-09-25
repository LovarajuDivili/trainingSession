import React from "react";
import PeopleIcon from "@mui/icons-material/People";
import FolderIcon from "@mui/icons-material/Folder";
import CodeIcon from "@mui/icons-material/Code";
import BugReportIcon from "@mui/icons-material/BugReport";
import CloudIcon from "@mui/icons-material/Cloud";
import BarChartIcon from "@mui/icons-material/BarChart";
import ReceiptIcon from "@mui/icons-material/Receipt";

export interface MenuItem {
  text: string;
  route: string;
  icon: React.ReactNode;
  getPath: (role: string) => string;
}

export const menuItems: MenuItem[] = [
  {
    text: "All Employees",
    route: "all-employees",
    icon: <PeopleIcon />,
    getPath: (role: string) => `/dashboard/${role}/all-employees`,
  },
  {
    text: "Projects",
    route: "projects",
    icon: <FolderIcon />,
    getPath: (role: string) => `/dashboard/${role}/projects`,
  },
  {
    text: "Developers",
    route: "developers",
    icon: <CodeIcon />,
    getPath: (role: string) => `/dashboard/${role}/developers`,
  },
  {
    text: "Testers",
    route: "testers",
    icon: <BugReportIcon />,
    getPath: (role: string) => `/dashboard/${role}/testers`,
  },
  {
    text: "AWS Team",
    route: "aws-team",
    icon: <CloudIcon />,
    getPath: (role: string) => `/dashboard/${role}/aws-team`,
  },
  {
    text: "Statistics",
    route: "statistics",
    icon: <BarChartIcon />,
    getPath: (role: string) => `/dashboard/${role}/statistics`,
  },
  {
    text: "Logs",
    route: "logs",
    icon: <ReceiptIcon />,
    getPath: (role: string) => `/dashboard/${role}/logs`,
  },
];