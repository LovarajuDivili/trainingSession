import React from "react";
import PeopleIcon from "@mui/icons-material/People";
import CodeIcon from "@mui/icons-material/Code";
import BugReportIcon from "@mui/icons-material/BugReport";
import CloudIcon from "@mui/icons-material/Cloud";
import ReceiptIcon from "@mui/icons-material/Receipt";
import BarChartIcon from "@mui/icons-material/BarChart";
import ListAltIcon from "@mui/icons-material/ListAlt";

export const menuItems = [
  { text: "All Employees", icon: <PeopleIcon />, path: "/llmgarden/all-employees" },
  { text: "Developers", icon: <CodeIcon />, path: "/llmgarden/developers" },
  { text: "Testers", icon: <BugReportIcon />, path: "/llmgarden/testers" },
  { text: "AWS Team", icon: <CloudIcon />, path: "/llmgarden/aws" },
  { text: "Projects", icon: <ReceiptIcon />, path: "/llmgarden/projects" },
  { text: "Statistics", icon: <BarChartIcon />, path: "/llmgarden/statistics" },
  { text: "Logs", icon: <ListAltIcon />, path: "/llmgarden/logs" },
];
