import React from "react";

import GroupOutlinedIcon from "@mui/icons-material/GroupOutlined";
import WorkOutlineIcon from "@mui/icons-material/WorkOutline";
import EventAvailableOutlinedIcon from "@mui/icons-material/EventAvailableOutlined";
import InsightsOutlinedIcon from "@mui/icons-material/InsightsOutlined";
import ReceiptLongOutlinedIcon from "@mui/icons-material/ReceiptLongOutlined";
import SpaceDashboardOutlinedIcon from "@mui/icons-material/SpaceDashboardOutlined";

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
    icon: <GroupOutlinedIcon />,
    getPath: (role: string) => `/dashboard/${role}/all-employees`,
  },
  {
    text: "Projects",
    route: "projects",
    icon: <WorkOutlineIcon />,
    getPath: (role: string) => `/dashboard/${role}/projects`,
  },
  {
    text: "Dashboard",
    route: "dashboard",
    icon: <SpaceDashboardOutlinedIcon />,
    getPath: (role: string) => `/dashboard/${role}/dashboard`,
  },
  {
    text: "Openings & Events",
    route: "openings-events",
    icon: <EventAvailableOutlinedIcon />,
    getPath: (role: string) => `/dashboard/${role}/openings-events`,
  },
  {
    text: "Statistics",
    route: "statistics",
    icon: <InsightsOutlinedIcon />,
    getPath: (role: string) => `/dashboard/${role}/statistics`,
  },
  {
    text: "Logs",
    route: "logs",
    icon: <ReceiptLongOutlinedIcon />,
    getPath: (role: string) => `/dashboard/${role}/logs`,
  },
];
