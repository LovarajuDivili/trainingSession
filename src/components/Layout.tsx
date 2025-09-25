import React, { useMemo, useState, useEffect } from "react";
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
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import { Outlet, useLocation } from "react-router-dom";
import type { Employee } from "../common/types";
import { employeeData } from "../common/dummyData";

const drawerWidth = 240;

const Layout: React.FC = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [employees, setEmployees] = useState<Employee[]>([]);
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

  const location = useLocation();
  const isEmployeePage = location.pathname === "/employees";

  useEffect(() => {
    setEmployees(employeeData);
  }, []);

  const filteredEmployees = useMemo(() => {
    if (!searchTerm.trim()) return employees;
    return employees.filter(
      (emp) =>
        emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, employees]);

  const handleDrawerToggle = () => setMobileOpen(!mobileOpen);

  const handleAddSkill = () => {
    const skill = newEmployee.skillInput.trim();
    if (skill && !newEmployee.skills.includes(skill)) {
      setNewEmployee({
        ...newEmployee,
        skills: [...newEmployee.skills, skill],
        skillInput: "",
      });
    }
  };

  const handleDeleteSkill = (skillToDelete: string) => {
    setNewEmployee({
      ...newEmployee,
      skills: newEmployee.skills.filter((s) => s !== skillToDelete),
    });
  };

  const isFormValid =
    newEmployee.id.trim() &&
    newEmployee.name.trim() &&
    newEmployee.role.trim() &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newEmployee.email.trim()) &&
    newEmployee.joinDate.trim() &&
    newEmployee.skills.length > 0;

  return (
    <Box sx={{ display: "flex", height: "100vh" }}>
      {/* Sidebar */}
      <Sidebar
        drawerWidth={drawerWidth}
        mobileOpen={mobileOpen}
        handleDrawerToggle={handleDrawerToggle}
      />

      {/* Main Content */}
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
        {/* Header */}
        <Header onMenuClick={handleDrawerToggle} />

        {/* Page Content */}
        <Box
          sx={{
            p: 3,
            pt: 3,
            flexGrow: 1,
            height: "calc(100vh - 64px - 48px)", 
            overflow: "hidden", 
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* Page-specific controls */}
          {isEmployeePage && (
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 2,
                flexWrap: "wrap",
                gap: 2,
              }}
            >
              {/* Search Bar */}
              <Paper
                sx={{
                  display: "flex",
                  alignItems: "center",
                  backgroundColor: "#fff",
                  border: "1px solid #dcdcdc",
                  px: 1.5,
                  borderRadius: "8px",
                  minWidth: 240,
                  boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
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
                  <IconButton onClick={() => setSearchTerm("")} size="small">
                    <ClearIcon fontSize="small" />
                  </IconButton>
                )}
              </Paper>

              {/* Add Employee Button */}
              <Button
                variant="contained"
                onClick={() => setDialogOpen(true)}
                sx={{
                  backgroundColor: "#906aff",
                  "&:hover": { backgroundColor: "#7a53e3" },
                }}
              >
                Add New +
              </Button>
            </Box>
          )}

          {/* Outlet content fills rest of available space */}
          <Box
            sx={{
              flexGrow: 1,
              overflow: "hidden", 
            }}
          >
            <Outlet context={{ filteredEmployees }} />
          </Box>
        </Box>

        {/* Add New Employee Dialog */}
        <Dialog
          open={dialogOpen}
          onClose={() => setDialogOpen(false)}
          maxWidth="md"
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
              error={
                newEmployee.email !== "" &&
                !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newEmployee.email.trim())
              }
              helperText={
                newEmployee.email !== "" &&
                !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newEmployee.email.trim())
                  ? "Please enter a valid email."
                  : ""
              }
            />
            <TextField
              label="Join Date"
              type="date"
              fullWidth
              margin="dense"
              value={newEmployee.joinDate}
              onChange={(e) =>
                setNewEmployee({ ...newEmployee, joinDate: e.target.value })
              }
              InputLabelProps={{ shrink: true }}
            />

            {/* Skills */}
            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle1">Skills</Typography>
              <Box sx={{ display: "flex", gap: 1, mt: 1 }}>
                <TextField
                  label="Add Skill"
                  size="small"
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
              <Box
                sx={{
                  mt: 1,
                  display: "flex",
                  gap: 1,
                  flexWrap: "wrap",
                }}
              >
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
            <Button
              variant="contained"
              disabled={!isFormValid}
              onClick={() => alert("Add employee feature not implemented")}
            >
              Add Employee
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Box>
  );
};

export default Layout;
