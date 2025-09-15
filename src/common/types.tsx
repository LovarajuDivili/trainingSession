import type { JSX } from "react";

export interface DropdownItem {
    label: string;
    value: string;
}

export interface DropdownItem {
  value: string;
  label: string;
  icon: JSX.Element;
}