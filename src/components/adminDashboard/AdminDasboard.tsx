import { Box } from "@mui/material";
import Sidebar from "../../pages/Sidebar";
import { Outlet } from "react-router-dom";

const AdminDasboard = () => {
  return (
    <Box sx={{ width: "100%", marginTop: "5%", display: "flex" }}>
      <Box sx={{ width: "20%" }}>
        <Sidebar />
      </Box>
      <Box sx={{ width: "75%" }}>
        <Outlet />
      </Box>
    </Box>
  );
};

export default AdminDasboard;
