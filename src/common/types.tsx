import type { JSX } from "react";

/*export interface DropdownItem {
    label: string;
    value: string;
}*/

export interface DropdownItem {
  value: string;
  label: string;
  icon: JSX.Element;
}

export interface Employee {
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

// export interface Employee {
//   name: string;
//   email: string;
//   role: string;
//   joinDate: string;
//   id: string;
//   skills: string[];
// }


