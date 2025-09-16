import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  InputAdornment,
} from "@mui/material";
import LibraryBooksIcon from "@mui/icons-material/LibraryBooks";
import SearchIcon from "@mui/icons-material/Search";
import AddSharpIcon from "@mui/icons-material/AddSharp";
import { DataGrid } from "@mui/x-data-grid";
import { useLocation } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { allEmployees, employeeColumns, Employee } from "../common/utilitys";

const Dashboard: React.FC = () => {
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeSection, setActiveSection] = useState("All Employees");
  const [rows, setRows] = useState<Employee[]>(allEmployees);

  useEffect(() => {
    switch (location.pathname) {
      case "/dashboard/allemployees":
        setActiveSection("All Employees");
        setRows(allEmployees);
        break;
      case "/dashboard/developers":
        setActiveSection("Developers");
        setRows(allEmployees.filter((emp) => emp.role === "Developer"));
        break;
      case "/dashboard/testers":
        setActiveSection("Testers");
        setRows(allEmployees.filter((emp) => emp.role === "Tester"));
        break;
      case "/dashboard/awsteam":
        setActiveSection("AWS Team");
        setRows(allEmployees.filter((emp) => emp.role.includes("AWS")));
        break;
      default:
        setActiveSection("All Employees");
        setRows(allEmployees);
    }
  }, [location.pathname]);

  const filteredRows = rows.filter((row) =>
    Object.values(row).some((val) =>
      String(val).toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  return (
    <Box sx={{ display: "flex" }}>
      <Sidebar />

      <Box
        component="main"
        sx={{ flexGrow: 1, mt: "56px", px: 3, marginTop: 9.5 }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            px: 3,
            py: 1.5,
            background: "white",
            borderBottom: "1px solid #eee",
          }}
        >
          <Typography
            variant="h6"
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 0.7,
              fontWeight: 600,
            }}
          >
            <Box
              component="span"
              sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
            >
              <LibraryBooksIcon fontSize="small" /> LLM Garden
            </Box>
            - {activeSection}{" "}
            <Typography
              component="span"
              variant="body1"
              sx={{ fontWeight: 500, color: "Black" }}
            >
              ({filteredRows.length})
            </Typography>
          </Typography>

          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <TextField
              placeholder="Search"
              size="small"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              sx={{
                width: 280,
                "& .MuiOutlinedInput-root": {
                  borderRadius: "50px",
                  background: "#fafafa",
                  mt: 0.3,
                },
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon fontSize="small" />
                  </InputAdornment>
                ),
              }}
            />
            <Button
              variant="contained"
              sx={{
                textTransform: "none",
                bgcolor: "#906aff",
                "&:hover": { bgcolor: "#7a54f6" },
                borderRadius: "50px",
                px: 3,
                py: 1,
                mt: 0.3,
              }}
            >
              Add New <AddSharpIcon sx={{ ml: 0.5 }} />
            </Button>
          </Box>
        </Box>

        <Box sx={{ height: 400, mt: 2 }}>
          <DataGrid
            rows={filteredRows}
            columns={employeeColumns}
            pageSizeOptions={[5, 10]}
            initialState={{
              pagination: { paginationModel: { pageSize: 5 } },
            }}
            disableRowSelectionOnClick
            sx={{
              backgroundColor: "#fff",
              border: "1px solid #e0e0e0",
              borderRadius: 2,
              "& .MuiDataGrid-columnHeaders": {
                backgroundColor: "#f5f5f5",
                fontWeight: "bold",
                color: "#333",
              },
              "& .MuiDataGrid-cell": { color: "#333" },
              "& .MuiDataGrid-row:nth-of-type(odd)": {
                backgroundColor: "#fafafa",
              },
              "& .MuiDataGrid-row:hover": { backgroundColor: "#f1f1f1" },
              "& .MuiDataGrid-footerContainer": {
                borderTop: "1px solid #e0e0e0",
              },
            }}
            autoHeight
          />
        </Box>
      </Box>
    </Box>
  );
};

export default Dashboard;
