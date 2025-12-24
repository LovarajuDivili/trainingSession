import React from "react";
import PeopleIcon from "@mui/icons-material/People";
import FolderIcon from "@mui/icons-material/Folder";
import EventIcon from '@mui/icons-material/Event';
import BarChartIcon from "@mui/icons-material/BarChart";
import ReceiptIcon from "@mui/icons-material/Receipt";
import DashboardIcon from "@mui/icons-material/Dashboard";

export interface MenuItem {
  text: string;
  route: string;
  icon: React.ReactNode;
  getPath: (role: string) => string;
}

export const menuItems: MenuItem[] = [
  {
    text: "Dashboard",
    route: "dashboard",
    icon: <DashboardIcon />,
    getPath: (role: string) => `/dashboard/${role}/dashboard`,
  },
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
    text: "Openings and Events",
    route: "openings-events",
    icon: <EventIcon />,
    getPath: (role: string) => `/dashboard/${role}/openings-events`,
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