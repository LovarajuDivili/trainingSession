import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
// import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";


export const roles = [
  {
    value: "Admin",
    label: "Admin",
    icon: <AdminPanelSettingsIcon sx={{ color: "#9b57f5" }} />,
  },
  {
    value: "Accountant",
    label: "Accountant",
    icon: <AccountBalanceIcon sx={{ color: "#00bcd4" }} />,
  },
 
];
