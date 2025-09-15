import { Box } from "@mui/material";
import Header from "../components/Header";
import { useState } from "react";
import SideBar from "../components/SideBar";
import Dashboard from "../components/Dashboard";

const Admin = () => {
  const [selectedItem, setSelectedItem] = useState("All Employees");

  return (
    <Box>
      
      <Box sx={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 1000 }}>
        <Header role={""} />
      </Box>

      <Box sx={{ display: "flex", mt: "50px" }}> 
        <SideBar selectedItem={selectedItem} setSelectedItem={setSelectedItem} />
        <Box sx={{ flexGrow: 1, ml: "240px", p: 3 }}> 
          <Dashboard selectedItem={selectedItem} />
        </Box>
      </Box>
    </Box>
  );
};

export default Admin;
