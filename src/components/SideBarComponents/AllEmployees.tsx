import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
} from "@mui/material";
import {
  DataGrid,
  type GridColDef,
  type GridRenderCellParams,
} from "@mui/x-data-grid";
import { Loading } from "../../common/labelConstants";
import type { Employee } from "../../common/types";
import DashboardHeader from "../DashboardHeader";
import { sidebarItems } from "../../common/sidebarItems";

const LOCAL_STORAGE_KEY = "employees_data";

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
    }, 1000);
  });
};

const AllEmployees = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");

  // Add Employee Dialog states
  const [openDialog, setOpenDialog] = useState(false);
  const [newEmployee, setNewEmployee] = useState<Employee>({
    name: "",
    email: "",
    role: "",
    joinDate: "",
    id: "",
    skills: [],
  });

  // Load employees (localStorage > API fallback)
  useEffect(() => {
    const savedData = localStorage.getItem(LOCAL_STORAGE_KEY);

    if (savedData) {
      setEmployees(JSON.parse(savedData));
    } else {
      setLoading(true);
      fetchEmployees().then((data) => {
        setEmployees(data);
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));
        setLoading(false);
      });
    }
  }, []);

  // Save employees to localStorage whenever they change
  useEffect(() => {
    if (employees.length > 0) {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(employees));
    }
  }, [employees]);

  const filteredEmployees = employees.filter((emp) =>
    emp.name.toLowerCase().includes(searchText.toLowerCase())
  );

  // Dialog handlers
  const handleOpenDialog = () => setOpenDialog(true);

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setNewEmployee({
      name: "",
      email: "",
      role: "",
      joinDate: "",
      id: "",
      skills: [],
    });
  };

  const handleChange = (field: keyof Employee, value: string) => {
    if (field === "skills") {
      setNewEmployee((prev) => ({
        ...prev,
        skills: value.split(",").map((s) => s.trim()),
      }));
    } else {
      setNewEmployee((prev) => ({ ...prev, [field]: value }));
    }
  };

  const handleAddEmployee = () => {
    if (
      newEmployee.name &&
      newEmployee.email &&
      newEmployee.role &&
      newEmployee.joinDate &&
      newEmployee.id
    ) {
      setEmployees((prev) => [...prev, newEmployee]);
      handleCloseDialog();
    } else {
      alert("⚠️ Please fill all required fields!");
    }
  };

  // DataGrid columns
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
      renderCell: (params: GridRenderCellParams<Employee>) => (
        <>
          {params?.row?.skills.map((each, index) => (
            <button
              key={index}
              style={{
                margin: "5px",
                backgroundColor: "black",
                color: "white",
                padding: "4px 8px",
                border: "none",
                borderRadius: "6px",
              }}
            >
              {each}
            </button>
          ))}
        </>
      ),
    },
    {
      field: "currentDate",
      headerName: "Current Date",
      flex: 1,
      renderCell: (params: GridRenderCellParams<Employee>) =>
        new Date(params.row.joinDate).toLocaleDateString(),
    },
  ];

  const currentItem = sidebarItems.find(
    (item) => item.route === "/admin/all-employees"
  );

  return (
    <Box>
      {/* Header with Add New button */}
      <DashboardHeader
        title={currentItem?.label || "All Employees"}
        icon={currentItem?.icon}
        count={filteredEmployees.length}
        showSearch
        searchText={searchText}
        onSearchChange={setSearchText}
        showAddButton
        onAddClick={handleOpenDialog}
        addButtonLabel="Add New"
      />

      {/* Page Content */}
      {loading ? (
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
      )}

      {/* Add Employee Dialog */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            p: 2,
          }}
        >
          <DialogTitle sx={{ p: 0 }}>Add New Employee</DialogTitle>
          <Box sx={{ display: "flex", gap: 1 }}>
            <Button onClick={handleCloseDialog}>Cancel</Button>
            <Button
              variant="contained"
              color="primary"
              onClick={handleAddEmployee}
            >
              Add
            </Button>
          </Box>
        </Box>

        <DialogContent
          sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}
        >
          <TextField
            label="Name"
            value={newEmployee.name}
            onChange={(e) => handleChange("name", e.target.value)}
            fullWidth
            required
          />
          <TextField
            label="Email"
            value={newEmployee.email}
            onChange={(e) => handleChange("email", e.target.value)}
            fullWidth
            required
          />
          <TextField
            label="Role"
            value={newEmployee.role}
            onChange={(e) => handleChange("role", e.target.value)}
            fullWidth
            required
          />
          <TextField
            type="date"
            label="Join Date"
            InputLabelProps={{ shrink: true }}
            value={newEmployee.joinDate}
            onChange={(e) => handleChange("joinDate", e.target.value)}
            fullWidth
            required
          />
          <TextField
            label="ID"
            value={newEmployee.id}
            onChange={(e) => handleChange("id", e.target.value)}
            fullWidth
            required
          />
          <TextField
            label="Skills (comma separated)"
            value={newEmployee.skills.join(", ")}
            onChange={(e) => handleChange("skills", e.target.value)}
            fullWidth
          />
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default AllEmployees;
