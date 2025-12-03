import { useState } from "react";
import {
  Box,
  Typography,
  IconButton,
  Button,
  Divider,
  Dialog,
  DialogTitle,
  DialogActions,
  Snackbar,
  Alert,
  Badge,
  Avatar,
} from "@mui/material";
import AccountCircle from "@mui/icons-material/AccountCircle";
import LogoutIcon from "@mui/icons-material/Logout";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import { useCartDrawer } from "../context/CartDrawerContext";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { roleIcons } from "../common/utility";
import { useAuth } from "../contexts/AuthContext";
import {
  Aifa,
  Cancel,
  Confirm,
  Logout,
  Logout_Confirm,
  Logout_Success,
} from "../common/labelConstants";
import { useCart } from "../context/CartContext";
import { useTheme } from "../context/ThemeContext";
import { useThemeColors } from "../hooks/useThemeColors";

const Header = ({ role: propRole }: { role?: string }) => {
  const [showLogout, setShowLogout] = useState<boolean>(false);
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [openSnackbar, setOpenSnackbar] = useState<boolean>(false);
  const { cart } = useCart();
  const { themeMode, toggleTheme } = useTheme();
  const [isLoggingOut, setIsLoggingOut] = useState<boolean>(false);
  const colors = useThemeColors();
  const { logout } = useAuth();

  const navigate = useNavigate();
  const location = useLocation();

  // Get user data from sessionStorage
  const getUserData = () => {
    try {
      const userData = sessionStorage.getItem("user");
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error("Error parsing user data:", error);
      return null;
    }
  };

  const userData = getUserData();
  const profileImage = userData?.profile_image;
  const userName = userData?.name;

  // Get role from multiple sources with priority
  const getCurrentRole = () => {
    // Priority: prop > sessionStorage > userData > path-based detection
    if (propRole) return propRole;

    const sessionRole = sessionStorage.getItem("role");
    if (sessionRole) return sessionRole;

    if (userData?.role) return userData.role;

    // Fallback: detect from path
    const path = location.pathname;
    if (path.includes("/admin")) return "admin";
    if (path.includes("/accountant")) return "accountant";
    if (path.includes("/aitools")) return "aitools";
    if (path.includes("/migrator")) return "migrator";
    if (path.includes("/tester")) return "tester";

    return null;
  };

  const role = getCurrentRole();

  const handleIconClick = () => {
    setShowLogout((prev) => !prev);
  };

  const handleLogout = () => {
    setOpenDialog(true);
  };

  const confirmLogout = async () => {
    try {
      setIsLoggingOut(true);
      await logout(); // Wait for logout to complete
      setOpenDialog(false);
      setOpenSnackbar(true);

      // Navigate to login page after successful logout
      setTimeout(() => {
        navigate("/login");
      }, 100);
    } catch (error) {
      console.error("Logout error:", error);
      // Even if there's an error, still navigate to login
      setOpenDialog(false);
      navigate("/login");
    } finally {
      setIsLoggingOut(false);
    }
  };

  const cancelLogout = () => {
    setOpenDialog(false);
  };

  const handleSwap = () => {
    navigate("/welcome");
  };

  const { openDrawer } = useCartDrawer();

  const handleCartClick = () => {
    openDrawer();
  };

  const roleIcon = role ? roleIcons[role.toLowerCase()] : null;

  // Check if we're on welcome page
  const isWelcomePage = location.pathname === "/welcome";

  return (
    <Box
      sx={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        backgroundColor: colors.background.header,
        width: "100%",
        height: "50px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        zIndex: 1000,
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1,
          marginLeft: "10px",
        }}
      >
        <Box
          component="img"
          src="/chat.svg"
          alt="Custom Icon"
          sx={{
            width: 35,
            height: 35,
          }}
        />

        <Typography
          variant="h6"
          component="div"
          sx={{ color: "white", paddingRight: "14px" }}
        >
          <strong>{Aifa.AIFA}</strong>
        </Typography>

        
        {!isWelcomePage && role && roleIcon && (
          <>
            <Divider
              orientation="vertical"
              variant="middle"
              flexItem
              sx={{
                backgroundColor: "white",
                width: "0px",
              }}
            />

            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 0.5,
                ml: 2,
                px: 1.5,
                py: 0.3,
                borderRadius: "12px",
                backgroundColor: "rgba(255,255,255,0.2)",
              }}
            >
              {roleIcon}
              <Typography
                sx={{ color: "white", fontSize: 14, fontWeight: 500 }}
              >
                {role.charAt(0).toUpperCase() + role.slice(1)}
              </Typography>
            </Box>
          </>
        )}
      </Box>

      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 4,
          position: "relative",
          marginRight: "10px",
        }}
      >
        {/* Theme Toggle Button */}
        <IconButton
          onClick={toggleTheme}
          sx={{ color: "white" }}
          title={
            themeMode === "light"
              ? "Switch to dark mode"
              : "Switch to light mode"
          }
        >
          {themeMode === "light" ? <Brightness4Icon /> : <Brightness7Icon />}
        </IconButton>

        {/* Show cart only for accountant role AND not on welcome page */}
        {!isWelcomePage && role?.toLowerCase() === "accountant" && (
          <Button
            variant="contained"
            startIcon={
              <Badge
                badgeContent={cart.length}
                color="error"
                overlap="circular"
                sx={{
                  "& .MuiBadge-badge": {
                    fontSize: "0.7rem",
                    height: "16px",
                    minWidth: "16px",
                  },
                }}
              >
                <ShoppingCartIcon />
              </Badge>
            }
            onClick={handleCartClick}
            sx={{
              textTransform: "none",
              backgroundColor: "white",
              color: colors.primary.main,
              borderRadius: "20px",
              boxShadow: 2,
              "&:hover": {
                backgroundColor: "#f3eaff",
              },
            }}
          >
            Cart
          </Button>
        )}

        <IconButton sx={{ color: "white" }} onClick={handleSwap}>
          <SwapHorizIcon />
        </IconButton>

        <Divider
          orientation="vertical"
          variant="middle"
          flexItem
          sx={{
            backgroundColor: "white",
            width: "0px",
          }}
        />

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            backgroundColor: "white",
            borderRadius: "100px",
            padding: "1px 1px",
            height: "42px",
          }}
        >
          <Box
            sx={{
              width: "125px",
              height: "35px",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Box
              component="img"
              src="/aifa_clr_logo.svg"
              alt="Custom Icon"
              sx={{
                width: 100,
                height: 30,
                backgroundColor: "white",
              }}
            />
          </Box>

          <Box sx={{ position: "relative" }}>
            <IconButton
              onClick={handleIconClick}
              sx={{
                color: colors.primary.main,
                padding: "4px", // Reduce padding for better avatar fit
              }}
            >
              {profileImage ? (
                <Avatar
                  src={profileImage}
                  alt={userName || "User"}
                  sx={{
                    width: 35,
                    height: 35,
                    border: `2px solid ${colors.primary.main}`,
                  }}
                />
              ) : (
                <AccountCircle sx={{ fontSize: 43 }} />
              )}
            </IconButton>

            {showLogout && (
              <Box
                sx={{
                  position: "absolute",
                  top: "55px",
                  right: 0,
                  backgroundColor: colors.background.white,
                  boxShadow: 3,
                  borderRadius: 20,
                }}
              >
                <Button
                  onClick={handleLogout}
                  startIcon={<LogoutIcon sx={{ fontSize: 20 }} />}
                  sx={{
                    width: "120px",
                    height: "40px",
                    borderRadius: "20px",
                    backgroundColor: colors.background.white,
                    color: colors.text.primary,
                    boxShadow: 3,
                    textTransform: "none",
                    "&:hover": {
                      backgroundColor: colors.state.hoverLight,
                    },
                  }}
                >
                  {Logout.LOGOUT}
                </Button>
              </Box>
            )}
          </Box>
        </Box>
      </Box>

      {/* Confirmation Dialog */}
      <Dialog open={openDialog} onClose={cancelLogout}>
        <DialogTitle>{Logout_Confirm.LOGOUT_CONFIRM}</DialogTitle>
        <DialogActions>
          <Button
            onClick={cancelLogout}
            sx={{
              color: colors.primary.main,
            }}
          >
            {Cancel.CANCEL}
          </Button>
          <Button
            onClick={confirmLogout}
            color="primary"
            variant="contained"
            sx={{
              backgroundColor: colors.primary.main,
              "&:hover": {
                backgroundColor: colors.primary.dark,
              },
            }}
          >
            {isLoggingOut ? "Logging out..." : Confirm.CONFIRM}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar Notification */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={() => setOpenSnackbar(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={() => setOpenSnackbar(false)}
          severity="success"
          sx={{ width: "100%" }}
        >
          {Logout_Success.LOGOUT_SUCCESS}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Header;
