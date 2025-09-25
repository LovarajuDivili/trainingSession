import React, { useEffect, useState } from "react";
import MenuIcon from "@mui/icons-material/Menu";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { useNavigate, useLocation } from "react-router-dom";
import "./Header.scss";

interface HeaderProps {
  onMenuClick?: () => void;
}

const validRoles = ["admin", "developer", "technical"];

const Header: React.FC<HeaderProps> = ({ onMenuClick }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [accountType, setAccountType] = useState("Admin");

  useEffect(() => {
    const pathParts = location.pathname.split("/");
    const roleIndex = pathParts.findIndex((part) => part === "all-employees");

    if (roleIndex !== -1 && pathParts.length > roleIndex + 1) {
      const potentialRole = pathParts[roleIndex + 1].toLowerCase();

      if (validRoles.includes(potentialRole)) {
        // Capitalize first letter
        const capitalized = potentialRole.charAt(0).toUpperCase() + potentialRole.slice(1);
        setAccountType(capitalized);
        localStorage.setItem("accountType", capitalized);
        return;
      }
    }

    // Fallback to stored or default
    const stored = localStorage.getItem("accountType");
    if (stored && validRoles.includes(stored.toLowerCase())) {
      setAccountType(stored);
    } else {
      setAccountType("Admin");
      localStorage.setItem("accountType", "Admin");
    }
  }, [location.pathname]);

  const handleLogout = () => {
    localStorage.removeItem("accountType");
    navigate("/logged-out");
  };

  const handleRoleClick = () => {
    navigate(`/all-employees/${accountType.toLowerCase()}`);
  };

  return (
    <header className="app-header">
      <div className="left-section">
        <div className="menu-icon" onClick={onMenuClick} aria-label="Toggle menu">
          <MenuIcon />
        </div>

        <img
          src="/aifalogo.svg"
          alt="AIFA Logo"
          style={{ width: 90, height: 40, objectFit: "contain" }}
        />

        <div className="vertical-divider" />

        <div
          className="admin-section"
          onClick={handleRoleClick}
          aria-label="Navigate to role page"
          style={{ cursor: "pointer" }}
        >
          <AccountCircleIcon className="admin-icon" />
          <span className="admin-label">{accountType}</span>
        </div>
      </div>

      <div className="right-section">
        <SwapHorizIcon
          onClick={() => {
            if (localStorage.getItem("employeeData")) {
              localStorage.removeItem("employeeData");
            } else {
              localStorage.setItem("employeeData", "true");
            }
            navigate("/");
          }}
          aria-label="Compare/Sync"
          sx={{ color: "#fff", fontSize: 28, cursor: "pointer" }}
        />

        <div className="vertical-divider" />

        <div className="aifa-box">
          <img src="/aifa_clr_logo.svg" alt="AIFA Logo" className="aifa-logo" />
          <div
            className="user-avatar"
            onClick={handleLogout}
            aria-label="Logout"
            style={{ cursor: "pointer" }}
          >
            <AccountCircleIcon sx={{ fontSize: 30, color: "#906aff" }} />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;