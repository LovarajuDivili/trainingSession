import { GridColDef } from "@mui/x-data-grid";

export const employeeRows = [
  {
    id: 1,
    name: "Alice",
    email: "alice@example.com",
    role: "Developer",
    joinDate: "2023-02-15",
    skills: "React, Node.js",
  },
  {
    id: 2,
    name: "Bob",
    email: "bob@example.com",
    role: "Tester",
    joinDate: "2023-04-10",
    skills: "Selenium, Cypress",
  },
  {
    id: 3,
    name: "Charlie",
    email: "charlie@example.com",
    role: "AWS Engineer",
    joinDate: "2023-06-20",
    skills: "AWS, Terraform",
  },
];

export const employeeColumns: GridColDef[] = [
  { field: "id", headerName: "ID", width: 70 },
  { field: "name", headerName: "Employee Name", flex: 1 },
  { field: "email", headerName: "Email", flex: 1 },
  { field: "role", headerName: "Role", flex: 1 },
  { field: "joinDate", headerName: "Join Date", flex: 1 },
  { field: "skills", headerName: "Skills", flex: 1 },
];

export const awsRows = [
  {
    id: 1,
    name: "Charlie",
    email: "charlie@example.com",
    skills: "EC2, S3, Lambda",
  },
];

export const awsColumns: GridColDef[] = [
  { field: "id", headerName: "ID", width: 70 },
  { field: "name", headerName: "Name", flex: 1 },
  { field: "email", headerName: "Email", flex: 1 },
  { field: "skills", headerName: "AWS Skills", flex: 1 },
];

export const developerRows = [
  {
    id: 1,
    name: "Alice",
    email: "alice@example.com",
    skills: "React, Node.js",
  },
];

export const developerColumns: GridColDef[] = [
  { field: "id", headerName: "ID", width: 70 },
  { field: "name", headerName: "Name", flex: 1 },
  { field: "email", headerName: "Email", flex: 1 },
  { field: "skills", headerName: "Skills", flex: 1 },
];

export const testerRows = [
  { id: 2, name: "Bob", email: "bob@example.com", tools: "Selenium, Cypress" },
];

export const testerColumns: GridColDef[] = [
  { field: "id", headerName: "ID", width: 70 },
  { field: "name", headerName: "Name", flex: 1 },
  { field: "email", headerName: "Email", flex: 1 },
  { field: "tools", headerName: "Testing Tools", flex: 1 },
];

export const columns: GridColDef[] = [
  { field: "id", headerName: "ID", width: 70 },
  { field: "name", headerName: "Employee Name", flex: 1 },
  { field: "email", headerName: "Email", flex: 1 },
  { field: "role", headerName: "Role", flex: 1 },
  { field: "joinDate", headerName: "Join Date", flex: 1 },
  { field: "skills", headerName: "Skills", flex: 1 },
];

import GroupIcon from "@mui/icons-material/Group";
import CodeIcon from "@mui/icons-material/Code";
import BugReportIcon from "@mui/icons-material/BugReport";
import CloudIcon from "@mui/icons-material/Cloud";
import FolderIcon from "@mui/icons-material/Folder";
import BarChartIcon from "@mui/icons-material/BarChart";
import ListAltIcon from "@mui/icons-material/ListAlt";

export const sidebarSections = [
  { label: "All Employees", path: "allemployees", icon: <GroupIcon /> },
  { label: "Developers", path: "developers", icon: <CodeIcon /> },
  { label: "Testers", path: "testers", icon: <BugReportIcon /> },
  { label: "AWS Team", path: "awsteam", icon: <CloudIcon /> },
  { label: "Projects", path: "projects", icon: <FolderIcon /> },
  { label: "Statistics", path: "statistics", icon: <BarChartIcon /> },
  { label: "Logs", path: "logs", icon: <ListAltIcon /> },
];

export interface Employee {
  id: number;
  name: string;
  email: string;
  role: string;
  joinDate?: string;
  skills?: string;
}

export const allEmployees: Employee[] = [
  {
    id: 1,
    name: "Alice",
    email: "alice@example.com",
    role: "Developer",
    joinDate: "2023-01-12",
    skills: "React, Node.js",
  },
  {
    id: 2,
    name: "Bob",
    email: "bob@example.com",
    role: "Tester",
    joinDate: "2022-11-05",
    skills: "Selenium, Cypress",
  },
  {
    id: 3,
    name: "Charlie",
    email: "charlie@example.com",
    role: "AWS Engineer",
    joinDate: "2023-03-20",
    skills: "EC2, S3, Lambda",
  },
];

export const employeeColumns1: GridColDef[] = [
  { field: "id", headerName: "ID", flex: 0.7, minWidth: 60 },
  { field: "name", headerName: "Employee Name", flex: 1, minWidth: 120 },
  { field: "email", headerName: "Email", flex: 1, minWidth: 150 },
  { field: "role", headerName: "Role", flex: 1, minWidth: 120 },
  { field: "joinDate", headerName: "Join Date", flex: 1, minWidth: 100 },
  { field: "skills", headerName: "Skills", flex: 1, minWidth: 150 },
];
