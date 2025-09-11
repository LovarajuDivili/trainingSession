export interface DropdownItem {
  label: string;
  value: string;
}

export interface AccountSelectionProps {
  accountType: string;
  setAccountType: (type: string) => void;
}

export interface NavbarProps {
  accountType: string;
}
