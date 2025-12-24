import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import AccountBalanceWalletIcon from  "@mui/icons-material/AccountBalanceWallet";
import SmartToyIcon from '@mui/icons-material/SmartToy';


export const roles = [
  {
    value: "Admin",
    label: "Admin",
    icon: <AdminPanelSettingsIcon sx={{ color: "#9b57f5" }} />,
  },
  {
    value: "Accountant",
    label: "Accountant",
    icon: <AccountBalanceWalletIcon sx={{ color: "#00bcd4" }} />,
  },
  {
    value: "AI Tools",
    label: "AI Tools",
    icon: <SmartToyIcon sx={{ color: "#4caf50" }} />,
  },
];



