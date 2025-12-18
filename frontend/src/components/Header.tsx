import { useEffect, useState, type JSX } from "react";
import {
  Menu as MenuIcon,
  SwapHoriz as SwapHorizIcon,
  AccountCircle as AccountCircleIcon,
  ShoppingCart as ShoppingCartIcon,
  AdminPanelSettings as AdminPanelSettingsIcon,
  AccountBalanceWallet as AccountBalanceWalletIcon,
  SmartToy as SmartToyIcon,
} from "@mui/icons-material";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  Badge,
  Box,
} from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import { useCart } from "../ContextFiles/CartContext";
import { apiRequest } from "../Services/apiService";
import "./Header.scss";

interface HeaderProps {
  onMenuClick: () => void;
}

const ROLE_ICONS: Record<string, JSX.Element> = {
  Admin: <AdminPanelSettingsIcon className="admin-icon" />,
  Accountant: <AccountBalanceWalletIcon className="admin-icon" />,
  "AI Tools": <SmartToyIcon className="admin-icon" />,
};

const Header = ({ onMenuClick }: HeaderProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { cart } = useCart();
  const [accountType, setAccountType] = useState<string>("Admin");
  const [logoutConfirmOpen, setLogoutConfirmOpen] = useState(false);

  useEffect(() => {
    const path = location.pathname.toLowerCase();

    if (path.startsWith("/accountant")) {
      setAccountType("Accountant");
      localStorage.setItem("accountType", "Accountant");
      localStorage.setItem("accountantId", "ACCOUNTANT_01");
      return;
    }

    if (path.includes("/dashboard/admin")) {
      setAccountType("Admin");
      localStorage.setItem("accountType", "Admin");
      return;
    }

    if (path.includes("/dashboard/ai tools")) {
      setAccountType("AI Tools");
      localStorage.setItem("accountType", "AI Tools");
    }
  }, [location.pathname]);

  const handleRoleClick = () => {
    switch (accountType) {
      case "Accountant":
        navigate("/accountant");
        break;
      case "Admin":
        navigate("/dashboard/admin/dashboard");
        break;
      case "AI Tools":
        navigate("/dashboard/ai tools/dashboard");
        break;
      default:
        break;
    }
  };

  const confirmLogout = async () => {
    try {
      await apiRequest({
        endpoint: "/api/auth/logout",
        method: "POST",
      });
    } catch {
      // even if logout API fails, still clear session
    } finally {
      localStorage.clear();
      navigate("/logged-out", { replace: true });
    }
  };

  return (
    <>
      <header className="app-header">
        <div className="left-section">
          <div className="menu-icon" onClick={onMenuClick}>
            <MenuIcon />
          </div>

          <img
            src="/aifalogo.svg"
            alt="AIFA Logo"
            style={{ width: 90, height: 40, objectFit: "contain" }}
          />

          <div className="vertical-divider" />

          <div className="admin-section" onClick={handleRoleClick}>
            {ROLE_ICONS[accountType]}
            <span className="admin-label">{accountType}</span>
          </div>
        </div>

        <div className="right-section">
          {accountType === "Accountant" && (
            <Badge
              badgeContent={cart.length}
              invisible={cart.length === 0}
              sx={{
                "& .MuiBadge-badge": {
                  backgroundColor: "#906aff",
                  fontSize: "10px",
                  height: 16,
                  minWidth: 16,
                },
              }}
            >
              <ShoppingCartIcon
                onClick={() =>
                  window.dispatchEvent(new CustomEvent("openCart"))
                }
                sx={{ color: "#fff", fontSize: 24, cursor: "pointer" }}
              />
            </Badge>
          )}

          <SwapHorizIcon
            onClick={() => navigate("/account-type-selection")}
            sx={{
              color: "#fff",
              fontSize: 28,
              cursor: "pointer",
              ml: 1,
            }}
          />

          <div className="vertical-divider" />

          <div className="aifa-box">
            <img src="/aifa_clr_logo.svg" className="aifa-logo" alt="AIFA" />

            <div
              className="user-avatar"
              onClick={() => setLogoutConfirmOpen(true)}
            >
              <AccountCircleIcon sx={{ fontSize: 30, color: "#906aff" }} />
            </div>
          </div>
        </div>
      </header>

      <Dialog
        open={logoutConfirmOpen}
        onClose={() => setLogoutConfirmOpen(false)}
        PaperProps={{ sx: { borderRadius: 4, px: 1 } }}
      >
        <DialogTitle
          sx={{
            fontWeight: 700,
            display: "flex",
            alignItems: "center",
            gap: 1,
          }}
        >
          <Box
            sx={{
              width: 36,
              height: 36,
              borderRadius: "50%",
              bgcolor: "#f3efff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            🔒
          </Box>
          Confirm Logout
        </DialogTitle>

        <DialogContent>
          <DialogContentText sx={{ fontSize: 14 }}>
            Are you sure you want to log out of your account?
          </DialogContentText>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 3, gap: 1 }}>
          <Button
            onClick={() => setLogoutConfirmOpen(false)}
            variant="outlined"
            sx={{
              borderRadius: 999,
              textTransform: "none",
              px: 3,
              borderColor: "#906aff",
              color: "#906aff",
            }}
          >
            Cancel
          </Button>

          <Button
            onClick={confirmLogout}
            variant="contained"
            sx={{
              borderRadius: 999,
              textTransform: "none",
              px: 3,
              backgroundColor: "#906aff",
              "&:hover": { backgroundColor: "#7a53e3" },
            }}
          >
            Logout
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Header;
