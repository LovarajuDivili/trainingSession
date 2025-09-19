import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  IconButton,
  Grid,
} from "@mui/material";
import {
  DataGrid,
  type GridColDef,
  type GridRenderCellParams,
} from "@mui/x-data-grid";
import ViewCompactIcon from "@mui/icons-material/ViewCompact";
import { Loading } from "../../common/labelConstants";
import type { Employee } from "../../common/types";
import DashboardHeader from "../DashboardHeader";
import { sidebarItems } from "../../common/sidebarItems";

const LOCAL_STORAGE_KEY = "employees_data";

const defaultEmployees: Employee[] = [
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
];

const AllEmployees = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [cardView, setCardView] = useState(false);

  const [openDialog, setOpenDialog] = useState(false);
  const [newEmployee, setNewEmployee] = useState<Employee>({
    name: "",
    email: "",
    role: "",
    joinDate: "",
    id: "",
    skills: [],
  });

  useEffect(() => {
    const savedData = localStorage.getItem(LOCAL_STORAGE_KEY);

    if (savedData) {
      try {
        const parsed = JSON.parse(savedData) as Employee[];
        const merged = [
          ...defaultEmployees,
          ...parsed.filter((e) => !defaultEmployees.some((d) => d.id === e.id)),
        ];
        setEmployees(merged);
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (err) {
        setEmployees(defaultEmployees);
      }
    } else {
      setEmployees(defaultEmployees);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(employees));
  }, [employees]);

  const filteredEmployees = employees.filter(
    (emp) =>
      emp.name.toLowerCase().includes(searchText.toLowerCase()) ||
      emp.role.toLowerCase().includes(searchText.toLowerCase())
  );

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
        skills: value ? value.split(",").map((s) => s.trim()) : [],
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
      if (employees.some((e) => e.id === newEmployee.id)) {
        alert("An employee with this ID already exists.");
        return;
      }
      setEmployees((prev) => [...prev, newEmployee]);
      handleCloseDialog();
    } else {
      alert("⚠️ Please fill all required fields!");
    }
  };

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
          {params?.row?.skills?.map((each, index) => (
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
        params.row.joinDate
          ? new Date(params.row.joinDate).toLocaleDateString()
          : "",
    },
  ];

  const currentItem = sidebarItems.find(
    (item) => item.route === "/admin/all-employees"
  );

  return (
    <Box>
      {/* Header */}
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
        gridIcon={
          <IconButton
            onClick={() => setCardView((prev) => !prev)}
            size="medium"
            aria-label="toggle-compact"
            sx={{ ml: 0.5 }}
          >
            <ViewCompactIcon
              sx={{ fontSize: "35px", color: cardView ? "black" : "#666" }}
            />
          </IconButton>
        }
      />

      {/* Page Content */}
      {loading ? (
        <Typography>{Loading.LOADING}</Typography>
      ) : (
        <Box sx={{ height: cardView ? "auto" : 500, width: "100%" }}>
          {cardView ? (
            <Grid container spacing={2} sx={{ mt: 2 }}>
              {filteredEmployees.map((emp) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={emp.id}>
                  <Box
                    sx={{
                      p: 2,
                      border: "1px solid #ddd",
                      borderRadius: 2,
                      boxShadow: 1,
                      backgroundColor: "#fff",
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                    }}
                  >
                    <Box>
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        {emp.name}
                      </Typography>
                      <Typography variant="body2" sx={{ mt: 1 }}>
                        <strong>Email:</strong> {emp.email}
                      </Typography>
                      <Typography variant="body2">
                        <strong>Role:</strong> {emp.role}
                      </Typography>
                      <Typography variant="body2">
                        <strong>Joined:</strong>{" "}
                        {emp.joinDate
                          ? new Date(emp.joinDate).toLocaleDateString()
                          : ""}
                      </Typography>
                      {emp.skills?.length ? (
                        <Box
                          sx={{
                            mt: 1,
                            display: "flex",
                            flexWrap: "wrap",
                            gap: 1,
                          }}
                        >
                          {emp.skills.map((s, i) => (
                            <Box
                              key={i}
                              sx={{
                                fontSize: 12,
                                px: 1,
                                py: "2px",
                                bgcolor: "#000",
                                color: "#fff",
                                borderRadius: "6px",
                              }}
                            >
                              {s}
                            </Box>
                          ))}
                        </Box>
                      ) : null}
                    </Box>
                  </Box>
                </Grid>
              ))}
            </Grid>
          ) : (
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
          )}
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
