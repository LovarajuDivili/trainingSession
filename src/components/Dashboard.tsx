import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  InputAdornment,
} from "@mui/material";
import { useLocation } from "react-router-dom";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import { Add_New, Loading } from "../common/labelConstants";
import {
  DataGrid,
  type GridColDef,
  type GridRenderCellParams,
} from "@mui/x-data-grid";
import type { Employee } from "../common/types";

const fetchEmployees = (): Promise<Employee[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        {
          name: "John Doe",
          email: "john@example.com",
          role: "Developer",
          joinDate: "2022-03-01",
          id: "EMP001",
          skills: ["React", "TypeScript", "Node.js"],
        },
        {
          name: "Jane Smith",
          email: "jane@example.com",
          role: "Tester",
          joinDate: "2021-06-15",
          id: "EMP002",
          skills: ["Selenium", "Cypress", "Manual Testing"],
        },
      ]);
    });
  });
};

const Dashboard = () => {
  const location = useLocation();
  const section = location.pathname.split("/")[2];

  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    if (section === "all-employees") {
      setLoading(true);
      fetchEmployees().then((data) => {
        setEmployees(data);
        setLoading(false);
      });
    }
  }, [section]);

  const filteredEmployees = employees.filter((emp) =>
    emp.name.toLowerCase().includes(searchText.toLowerCase())
  );

  const displayName = section
    ? section.replace("-", " ").replace(/\b\w/g, (c) => c.toUpperCase())
    : "Dashboard";

  const columns: GridColDef<Employee>[] = [
    { field: "name", headerName: "Name", flex: 1 },
    { field: "email", headerName: "Email", flex: 1.5 },
    { field: "role", headerName: "Role", flex: 1 },
    { field: "joinDate", headerName: "Join Date", flex: 1 },
    { field: "id", headerName: "ID", flex: 1 },
    {
      field: "skills",
      headerName: "Skills",
      flex: 2,
      renderCell: (params: GridRenderCellParams<Employee>) => {
        return (
          <>
            {params?.row?.skills.map((each, index) => (
              <button
                key={index}
                style={{
                  margin: "5px",
                  backgroundColor: "black",
                  color: "white",
                }}
              >
                {each}
              </button>
            ))}
          </>
        );
      },
    },
    {
      field: "currentDate",
      headerName: "Current Date",
      flex: 1,
      renderCell: (params: GridRenderCellParams) => {
        return new Date(params.row.joinDate).toLocaleDateString();
      },
    },
  ];

  return (
    <Box>
      {/* Dashboard Header */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          mb: 3,
          p: 2,
          borderBottom: "1px solid #ddd",
          backgroundColor: "#fff",
          position: "sticky",
          top: 0,
          zIndex: 100,
        }}
      >
        <Typography variant="h5">{displayName}</Typography>

        {section === "all-employees" && (
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <TextField
              placeholder="Search"
              variant="outlined"
              size="small"
              sx={{ width: "300px" }}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
            <Button
              variant="contained"
              sx={{
                borderRadius: "20px",
                textTransform: "none",
                backgroundColor: "#906aff",
                color: "white",
                fontWeight: 500,
                "&:hover": { backgroundColor: "#7a55d8" },
              }}
              onClick={() => alert("Add new data")}
              endIcon={<AddIcon />}
            >
              {Add_New.ADD_NEW}
            </Button>
          </Box>
        )}
      </Box>

      {/* Dashboard Content */}
      {section === "all-employees" ? (
        loading ? (
          <Typography>{Loading.LOADING}</Typography>
        ) : (
          <Box sx={{ height: 500, width: "100%" }}>
            <DataGrid
              rows={filteredEmployees}
              columns={columns}
              getRowId={(row) => row.id}
              pageSizeOptions={[5, 10, 20]}
              initialState={{
                pagination: { paginationModel: { pageSize: 5, page: 0 } },
              }}
              autoHeight
            />
          </Box>
        )
      ) : (
        <Typography variant="h6">
          No data available for {displayName}.
        </Typography>
      )}
    </Box>
  );
};

export default Dashboard;
