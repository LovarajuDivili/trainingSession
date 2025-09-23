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
      {/* Header */}
      <Box sx={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 1000 }}>
        <Header role={""} />
      </Box>

      {/* Sidebar + Content */}
      <Box sx={{ display: "flex", mt: "40px" }}>
        <SideBar />
        <Box sx={{ flexGrow: 1, ml: "240px", p: 3 }}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
};

export default Admin;
