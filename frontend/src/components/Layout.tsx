import React, { useMemo, useState, useEffect, useContext } from "react";
import {
  Box,
  Typography,
  InputBase,
  Button,
  IconButton,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Chip,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";
import Sidebar from "./Sidebar";
import Header from "./Header";
import { Outlet, useLocation } from "react-router-dom";
import type { Employee } from "../common/types";
import { UserContext } from "./Context";
import { apiRequest } from "../Services/apiService";

const drawerWidth = 240;

const Layout: React.FC = () => {
  const { token } = useContext(UserContext);

  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadEmployees = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const data = await apiRequest<Employee[]>({
          endpoint: "/api/employees",
          method: "GET",
        });
        setEmployees(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Failed to fetch employees", err);
        setEmployees([]);
      } finally {
        setLoading(false);
      }
    };

    loadEmployees();
  }, [token]);

  const filteredEmployees = useMemo(() => {
    if (!searchTerm.trim()) return employees;

    const lower = searchTerm.toLowerCase();
    return employees.filter(
      (emp) =>
        emp.name.toLowerCase().includes(lower) ||
        emp.role.toLowerCase().includes(lower) ||
        emp.email.toLowerCase().includes(lower)
    );
  }, [searchTerm, employees]);

  const handleDrawerToggle = () => setMobileOpen((prev) => !prev);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [newEmployee, setNewEmployee] = useState({
    id: "",
    name: "",
    role: "",
    email: "",
    joinDate: "",
    skills: [] as string[],
    skillInput: "",
  });

  const handleAddSkill = () => {
    const skill = newEmployee.skillInput.trim();
    if (skill && !newEmployee.skills.includes(skill)) {
      setNewEmployee((prev) => ({
        ...prev,
        skills: [...prev.skills, skill],
        skillInput: "",
      }));
    }
  };

  const handleDeleteSkill = (skill: string) => {
    setNewEmployee((prev) => ({
      ...prev,
      skills: prev.skills.filter((s) => s !== skill),
    }));
  };

  const isFormValid =
    newEmployee.id &&
    newEmployee.name &&
    newEmployee.role &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newEmployee.email) &&
    newEmployee.joinDate &&
    newEmployee.skills.length > 0;

  const location = useLocation();
  const isEmployeePage = location.pathname === "/employees";

  return (
    <Box sx={{ display: "flex", height: "100vh" }}>
      <Sidebar
        drawerWidth={drawerWidth}
        mobileOpen={mobileOpen}
        handleDrawerToggle={handleDrawerToggle}
      />

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          bgcolor: "#f5f7fb",
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          display: "flex",
          flexDirection: "column",
          height: "100vh",
          overflow: "hidden",
        }}
      >
        <Header onMenuClick={handleDrawerToggle} />

        <Box
          sx={{
            p: 3,
            pt: "10px",
            flexGrow: 1,
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
          }}
        >
          {isEmployeePage && (
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 2,
                gap: 2,
                flexWrap: "wrap",
              }}
            >
              <Paper
                sx={{
                  display: "flex",
                  alignItems: "center",
                  px: 1.5,
                  borderRadius: 2,
                  minWidth: 240,
                  border: "1px solid #dcdcdc",
                }}
              >
                <SearchIcon sx={{ color: "#888", mr: 1 }} />
                <InputBase
                  placeholder="Search employees..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  sx={{ flex: 1 }}
                />
                {searchTerm && (
                  <IconButton size="small" onClick={() => setSearchTerm("")}>
                    <ClearIcon fontSize="small" />
                  </IconButton>
                )}
              </Paper>

              <Button
                variant="contained"
                onClick={() => setDialogOpen(true)}
                sx={{
                  backgroundColor: "#906aff",
                  borderRadius: 2,
                  "&:hover": { backgroundColor: "#7a53e3" },
                }}
              >
                Add New +
              </Button>
            </Box>
          )}

          <Box sx={{ flexGrow: 1, overflow: "hidden" }}>
            <Outlet
              context={{
                employees: filteredEmployees,
                loading,
              }}
            />
          </Box>
        </Box>

        <Dialog
          open={dialogOpen}
          onClose={() => setDialogOpen(false)}
          fullWidth
        >
          <DialogTitle>Add New Employee</DialogTitle>

          <DialogContent>
            <TextField
              label="Employee ID"
              fullWidth
              margin="dense"
              value={newEmployee.id}
              onChange={(e) =>
                setNewEmployee({ ...newEmployee, id: e.target.value })
              }
            />
            <TextField
              label="Name"
              fullWidth
              margin="dense"
              value={newEmployee.name}
              onChange={(e) =>
                setNewEmployee({ ...newEmployee, name: e.target.value })
              }
            />
            <TextField
              label="Role"
              fullWidth
              margin="dense"
              value={newEmployee.role}
              onChange={(e) =>
                setNewEmployee({ ...newEmployee, role: e.target.value })
              }
            />
            <TextField
              label="Email"
              fullWidth
              margin="dense"
              value={newEmployee.email}
              onChange={(e) =>
                setNewEmployee({ ...newEmployee, email: e.target.value })
              }
              error={Boolean(
                newEmployee.email &&
                  !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newEmployee.email)
              )}
            />
            <TextField
              label="Join Date"
              type="date"
              fullWidth
              margin="dense"
              InputLabelProps={{ shrink: true }}
              value={newEmployee.joinDate}
              onChange={(e) =>
                setNewEmployee({
                  ...newEmployee,
                  joinDate: e.target.value,
                })
              }
            />

            <Box sx={{ mt: 2 }}>
              <Typography fontWeight={600}>Skills</Typography>

              <Box sx={{ display: "flex", gap: 1, mt: 1 }}>
                <TextField
                  size="small"
                  label="Add Skill"
                  value={newEmployee.skillInput}
                  onChange={(e) =>
                    setNewEmployee({
                      ...newEmployee,
                      skillInput: e.target.value,
                    })
                  }
                />
                <Button variant="outlined" onClick={handleAddSkill}>
                  Add
                </Button>
              </Box>

              <Box sx={{ mt: 1, display: "flex", gap: 1, flexWrap: "wrap" }}>
                {newEmployee.skills.map((skill) => (
                  <Chip
                    key={skill}
                    label={skill}
                    onDelete={() => handleDeleteSkill(skill)}
                  />
                ))}
              </Box>
            </Box>
          </DialogContent>

          <DialogActions>
            <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button variant="contained" disabled={!isFormValid}>
              Add Employee
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Box>
  );
};

export default Layout;
