import React, { useEffect, useState } from "react";
import MenuIcon from "@mui/icons-material/Menu";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { useNavigate, useLocation } from "react-router-dom";

import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import Badge from "@mui/material/Badge";

import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import SmartToyIcon from "@mui/icons-material/SmartToy";

import { useCart } from "../context/CartContext";

import "./Header.scss";

const roleIcons: any = {
  Admin: <AdminPanelSettingsIcon className="admin-icon" />,
  Accountant: <AccountBalanceWalletIcon className="admin-icon" />,
  "AI Tools": <SmartToyIcon className="admin-icon" />,
};

const Header: React.FC = ({ onMenuClick }: any) => {
  const navigate = useNavigate();
  const location = useLocation();

  const [accountType, setAccountType] = useState("Admin");
  const [logoutConfirmOpen, setLogoutConfirmOpen] = useState(false);

  const { cart } = useCart();

  useEffect(() => {
    const path = location.pathname;

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

    if (path.includes("/dashboard/ai-tools")) {
      setAccountType("AI Tools");
      localStorage.setItem("accountType", "AI Tools");
      return;
    }
  }, [location.pathname]);

  const handleRoleClick = () => {
    if (accountType === "Accountant") return navigate("/accountant");
    if (accountType === "Admin")
      return navigate("/dashboard/admin/dashboard");
    if (accountType === "AI Tools")
      return navigate("/dashboard/ai-tools/dashboard");
  };

  const confirmLogout = async () => {
    const token = localStorage.getItem("token");

    if (token) {
      await fetch("http://localhost:5000/api/auth/logout", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
    }

    localStorage.clear();
    navigate("/logged-out");
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
            {roleIcons[accountType]}
            <span className="admin-label">{accountType}</span>
          </div>
        </div>

        <div className="right-section">
          {accountType === "Accountant" && (
            <Badge
              badgeContent={cart.length}
              color="error"
              invisible={cart.length === 0}
              sx={{
                "& .MuiBadge-badge": {
                  backgroundColor: "#906aff",
                  fontSize: "10px",
                  height: "16px",
                  minWidth: "16px",
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
              marginLeft: "10px",
            }}
          />

          <div className="vertical-divider" />

          <div className="aifa-box">
            <img src="/aifa_clr_logo.svg" className="aifa-logo" />

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
      >
        <DialogTitle>Confirm Logout</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to log out?
          </DialogContentText>
        </DialogContent>

        <DialogActions>
          <Button
            onClick={() => setLogoutConfirmOpen(false)}
            sx={{ color: "#906aff", textTransform: "none" }}
          >
            Cancel
          </Button>
          <Button
            onClick={confirmLogout}
            variant="contained"
            sx={{ backgroundColor: "#906aff", textTransform: "none" , "&:hover":{
              backgroundColor: "#906aff"
            } }}
          >
            Logout
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Header;
