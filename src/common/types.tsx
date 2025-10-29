import type { JSX } from "react";

export interface DropdownItem {
  value: string;
  label: string;
  icon: JSX.Element;
}

export interface Employee {
  image?: File | string | null;
  photo?: string;
  name: string;
  email: string;
  role: string;
  joinDate: string;
  id: string;
  skills: string[];
  laptop: boolean;
  headphones: boolean;
  monitor: boolean;
}

export interface DashboardProps {
  selectedItem: string;
}
