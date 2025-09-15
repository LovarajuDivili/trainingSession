import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  Button,
  InputAdornment,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import type { Employee, DashboardProps } from "../common/types";
import { Add_New, Loading } from "../common/labelConstants";

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

const Dashboard = ({ selectedItem }: DashboardProps) => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    if (selectedItem === "All Employees") {
      setLoading(true);
      fetchEmployees().then((data) => {
        setEmployees(data);
        setLoading(false);
      });
    }
  }, [selectedItem]);

  const filteredEmployees = employees.filter((emp) =>
    emp.name.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <Box sx={{ p: 3 }}>
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
        <Typography variant="h5" gutterBottom>
          {selectedItem}
        </Typography>

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
              "&:hover": {
                backgroundColor: "#7a55d8",
              },
            }}
            onClick={() => alert("Add new data")}
            endIcon={<AddIcon />}
          >
            {Add_New.ADD_NEW}
          </Button>
        </Box>
      </Box>

      {/* Dashboard Content */}
      {selectedItem === "All Employees" ? (
        <Box>
          {loading ? (
            <Typography>{Loading.LOADING}</Typography>
          ) : (
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>
                      <strong>Name</strong>
                    </TableCell>
                    <TableCell>
                      <strong>Email</strong>
                    </TableCell>
                    <TableCell>
                      <strong>Role</strong>
                    </TableCell>
                    <TableCell>
                      <strong>Join Date</strong>
                    </TableCell>
                    <TableCell>
                      <strong>ID</strong>
                    </TableCell>
                    <TableCell>
                      <strong>Skills</strong>
                    </TableCell>
                    <TableCell>
                      <strong>Current Date</strong>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredEmployees.map((emp) => (
                    <TableRow key={emp.id}>
                      <TableCell>{emp.name}</TableCell>
                      <TableCell>{emp.email}</TableCell>
                      <TableCell>{emp.role}</TableCell>
                      <TableCell>{emp.joinDate}</TableCell>
                      <TableCell>{emp.id}</TableCell>
                      <TableCell>{emp.skills.join(", ")}</TableCell>
                      <TableCell>{new Date().toLocaleDateString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Box>
      ) : (
        <Typography variant="h6"></Typography>
      )}
    </Box>
  );
};

export default Dashboard;
