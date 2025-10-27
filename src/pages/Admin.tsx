import { Box } from "@mui/material";
import Header from "../components/Header";
import SideBar from "../components/SideBar";
import { Navigate, Outlet, useLocation } from "react-router-dom";

const Admin = () => {
  const location = useLocation();

  if (location.pathname === "/admin") {
    return <Navigate to="/admin/all-employees" replace />;
  }

  return (
    <Box>
      <Box
        sx={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1000,
          height: "60px",
        }}
      >
        <Header role={""} />
      </Box>

      <Box
        sx={{
          position: "fixed",
          top: "60px",
          left: 0,
          bottom: 0,
          width: "240px",
          zIndex: 900,
        }}
      >
        <SideBar />
      </Box>

      <Box
        sx={{
          marginTop: "60px",
          marginLeft: "240px",
          padding: 2,
          height: "calc(100vh - 82px)",
          overflow: "auto",
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
};

export default Admin;
