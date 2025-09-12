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
} from "@mui/material";
import AccountCircle from "@mui/icons-material/AccountCircle";
import LogoutIcon from "@mui/icons-material/Logout";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
import { useNavigate } from "react-router-dom";


const Header = () => {
  const [showLogout, setShowLogout] = useState<boolean>(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const handleIconClick = () => {
    setShowLogout((prev) => !prev);
  };

  const handleLogout = () => {
    setOpenDialog(true);
  };

  const confirmLogout = () => {
    setOpenDialog(false);
    setOpenSnackbar(true);
    // optionally navigate after logout or clear session
    setTimeout(() => {
      navigate("/logout"); // or wherever you want
    }, 1500); // delay navigation to show snackbar
  };

  const cancelLogout = () => {
    setOpenDialog(false);
  };

  const navigate = useNavigate();


  return (
    <Box
      sx={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        backgroundColor: "#906aff",
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

        <Typography variant="h6" component="div" sx={{ color: "white" }}>
          <strong>Aifa</strong>
        </Typography>
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
        <IconButton sx={{ color: "white" }}>
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
            <IconButton onClick={handleIconClick} sx={{ color: "#906aff" }}>
              <AccountCircle sx={{ fontSize: 43 }} />
            </IconButton>

            {showLogout && (
              <Box
                sx={{
                  position: "absolute",
                  top: "55px",
                  right: 0,
                  backgroundColor: "white",
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
                    backgroundColor: "white",
                    color: "#000",
                    boxShadow: 3,
                    textTransform: "none",
                    "&:hover": {
                      backgroundColor: "#f0f0f0",
                    },
                  }}
                >
                  Logout
                </Button>
              </Box>
            )}
          </Box>
        </Box>
      </Box>
      {/* Confirmation Dialog */}
      <Dialog open={openDialog} onClose={cancelLogout}>
        <DialogTitle>Are you sure you want to logout?</DialogTitle>
        <DialogActions>
          <Button onClick={cancelLogout}>Cancel</Button>
          <Button onClick={confirmLogout} color="primary" variant="contained">
            Confirm
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
          Logout successful!
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Header;
