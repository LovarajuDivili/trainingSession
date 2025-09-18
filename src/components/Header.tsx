import React, { useEffect, useState } from "react";
import MenuIcon from "@mui/icons-material/Menu";
import SyncAltIcon from "@mui/icons-material/SyncAlt";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { useNavigate, useLocation } from "react-router-dom";
import "./Header.scss";

interface HeaderProps {
  onMenuClick?: () => void;
}

const Header: React.FC<HeaderProps> = ({ onMenuClick }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [accountType, setAccountType] = useState("Admin");

  useEffect(() => {
    // Check if current route matches /llmgarden/all-employees/:role
    const pathParts = location.pathname.split("/");

    const roleIndex = pathParts.findIndex((part) => part === "all-employees");
    const potentialRole = pathParts[roleIndex + 1]; // next segment

    const validRoles = ["admin", "developer", "tester"];
    if (validRoles.includes(potentialRole?.toLowerCase())) {
      const capitalized =
        potentialRole.charAt(0).toUpperCase() + potentialRole.slice(1).toLowerCase();

      setAccountType(capitalized);
      localStorage.setItem("accountType", capitalized);
    } else {
      const stored = localStorage.getItem("accountType");
      setAccountType(stored || "Admin");
    }
  }, [location.pathname]);

  const handleLogout = () => {
    localStorage.removeItem("accountType");
    navigate("/logged-out");
  };

  const handleRoleClick = () => {
    navigate(`/llmgarden/all-employees/${accountType.toLowerCase()}`);
  };

  return (
    <header className="app-header">
      <div className="left-section">
        <div className="menu-icon" onClick={onMenuClick} aria-label="Toggle menu">
          <MenuIcon />
        </div>

        <img src="/chat.svg" alt="Cerebro Logo" className="logo" />
        <span className="app-title">Cerebro SASA</span>

        <div className="vertical-divider" />

        {/* Role Label */}
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

      {/* Right Section */}
      <div className="right-section">
        <SyncAltIcon
          className="sync-icon"
          onClick={() => {
            if (localStorage.getItem("employeeData")) {
              localStorage.removeItem("employeeData");
            } else {
              localStorage.setItem("employeeData", "true");
            }
            navigate("/");
          }}
          aria-label="Compare/Sync"
          style={{ cursor: "pointer" }}
        />

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
