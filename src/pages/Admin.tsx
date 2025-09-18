import { Box } from "@mui/material";
import Header from "../components/Header";
import SideBar from "../components/SideBar";
import { Outlet } from "react-router-dom";

const Admin = () => {
  return (
    <Box>
      {/* Header */}
      <Box sx={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 1000 }}>
        <Header role={""} />
      </Box>

      {/* Sidebar + Content */}
      <Box sx={{ display: "flex", mt: "50px" }}>
        <SideBar />
        <Box sx={{ flexGrow: 1, ml: "240px", p: 3 }}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
};

export default Admin;
