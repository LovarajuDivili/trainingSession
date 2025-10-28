import type { JSX } from "react";

export interface DropdownItem {
  value: string;
  label: string;
  icon: JSX.Element;
}

export interface Employee {
  image?: string; 
  photo?: string;
  name: string;
  email: string;
  role: string;
  joinDate: string;
  id: string;
  skills: string[];
}

export interface DashboardProps {
  selectedItem: string;
}
