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

const SESSION_STORAGE_KEY = "employee_data";

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
  {
    name: "Peter Jones",
    email: "peter@example.com",
    role: "Product Manager",
    joinDate: "2020-09-10",
    id: "EMP003",
    skills: ["Agile", "Scrum", "Roadmapping", "Market Research"],
  },
  {
    name: "Mary Lee",
    email: "mary@example.com",
    role: "UX Designer",
    joinDate: "2022-01-20",
    id: "EMP004",
    skills: ["Figma", "User Research", "Prototyping", "Wireframing"],
  },
  {
    name: "David Chen",
    email: "david@example.com",
    role: "DevOps Engineer",
    joinDate: "2021-11-05",
    id: "EMP005",
    skills: ["AWS", "Docker", "Kubernetes", "CI/CD"],
  },
  {
    name: "Sarah Davis",
    email: "sarah@example.com",
    role: "Data Scientist",
    joinDate: "2023-05-12",
    id: "EMP006",
    skills: ["Python", "Machine Learning", "SQL", "Tableau"],
  },
  {
    name: "James Wilson",
    email: "james@example.com",
    role: "Team Lead",
    joinDate: "2019-08-28",
    id: "EMP007",
    skills: [
      "Leadership",
      "Project Management",
      "Mentoring",
      "Strategic Planning",
    ],
  },
  {
    name: "Emily White",
    email: "emily@example.com",
    role: "Technical Writer",
    joinDate: "2023-02-14",
    id: "EMP008",
    skills: ["Documentation", "Markdown", "API Documentation", "Confluence"],
  },
  {
    name: "Michael Brown",
    email: "michael@example.com",
    role: "Support Engineer",
    joinDate: "2022-07-25",
    id: "EMP009",
    skills: ["Troubleshooting", "Customer Service", "Linux", "SQL"],
  },
  {
    name: "Laura Taylor",
    email: "laura@example.com",
    role: "Marketing Specialist",
    joinDate: "2021-03-30",
    id: "EMP010",
    skills: ["SEO", "Content Creation", "Social Media", "Email Marketing"],
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
    try {
      const savedRaw = sessionStorage.getItem(SESSION_STORAGE_KEY);
      const sessionEmployees: Employee[] = savedRaw ? JSON.parse(savedRaw) : [];

      const sessionFiltered = sessionEmployees.filter(
        (se) => !defaultEmployees.some((de) => de.id === se.id)
      );
      setEmployees([...defaultEmployees, ...sessionFiltered]);
    } catch {
      setEmployees([...defaultEmployees]);
    }
  }, []);

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

  const isSaveDisabled = !(
    newEmployee.name &&
    newEmployee.email &&
    newEmployee.role &&
    newEmployee.joinDate &&
    newEmployee.id
  );
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
      !newEmployee.name ||
      !newEmployee.email ||
      !newEmployee.role ||
      !newEmployee.joinDate ||
      !newEmployee.id
    ) {
      alert("⚠️ Please fill all required fields!");
      return;
    }

    const savedRaw = sessionStorage.getItem(SESSION_STORAGE_KEY);
    const sessionEmployees: Employee[] = savedRaw ? JSON.parse(savedRaw) : [];

    const alreadyExists = [...defaultEmployees, ...sessionEmployees].some(
      (e) => e.id === newEmployee.id
    );
    if (alreadyExists) {
      alert("An employee with this ID already exists.");
      return;
    }

    const updatedSessionEmployees = [...sessionEmployees, newEmployee];

    sessionStorage.setItem(
      SESSION_STORAGE_KEY,
      JSON.stringify(updatedSessionEmployees)
    );

    setEmployees([...defaultEmployees, ...updatedSessionEmployees]);

    handleCloseDialog();
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
                padding: "6px 6px",
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

      {loading ? (
        <Typography>{Loading.LOADING}</Typography>
      ) : (
        <Box sx={{ height: cardView ? "auto" : 500, width: "100%" }}>
          {cardView ? (
            <Grid container spacing={2}>
              {filteredEmployees.map((emp) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={emp.id}>
                  <Box
                    sx={{
                      p: 2,
                      m: 1,
                      border: "1px solid #ddd",
                      borderRadius: 2,
                      boxShadow: 1,
                      backgroundColor: "#fff",
                      justifyContent: "space-between",
                      height: "100%",
                      maxWidth: "180px",
                      maxHeight: "185px",
                      wordWrap: "break-word",
                      overflowWrap: "break-word",
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
              sx={{
                "& .MuiDataGrid-columnHeaders": {
                  color: "#906aff !important",
                  fontSize: 17,
                },
                "& .MuiDataGrid-columnHeaderTitle": {
                  fontWeight: 600,
                },
              }}
            />
          )}
        </Box>
      )}

      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "22px",
          }}
        >
          <DialogTitle sx={{ p: 0, fontSize: "25px" }}>
            Add New Employee
          </DialogTitle>
          <Box sx={{ display: "flex", gap: 1 }}>
            <Button onClick={handleCloseDialog}>Cancel</Button>
            <Button
              variant="contained"
              color="primary"
              onClick={handleAddEmployee}
              disabled={isSaveDisabled}
            >
              Add
            </Button>
          </Box>
        </Box>

        <DialogContent sx={{ mt: 0, pt: 0 }}>
          <Grid container spacing={2} sx={{ pr: 1 }}>
            <Grid item size={{ xs: 2, sm: 4, md: 4 }}>
              <Typography sx={{ fontSize: "15px", mb: 0.5 }}>Name</Typography>
              <TextField
                placeholder="Enter name"
                value={newEmployee.name}
                onChange={(e) => handleChange("name", e.target.value)}
                fullWidth
                required
              />
            </Grid>

            <Grid item size={{ xs: 2, sm: 4, md: 4 }}>
              <Typography sx={{ fontSize: "15px", mb: 0.5 }}>Email</Typography>
              <TextField
                placeholder="Enter email"
                value={newEmployee.email}
                onChange={(e) => handleChange("email", e.target.value)}
                fullWidth
                required
              />
            </Grid>

            <Grid item size={{ xs: 2, sm: 4, md: 4 }}>
              <Typography sx={{ fontSize: "15px", mb: 0.5 }}>Role</Typography>
              <TextField
                placeholder="Enter role"
                value={newEmployee.role}
                onChange={(e) => handleChange("role", e.target.value)}
                fullWidth
                required
              />
            </Grid>

            <Grid item size={{ xs: 2, sm: 4, md: 4 }}>
              <Typography sx={{ fontSize: "15px", mb: 0.5 }}>
                Join Date
              </Typography>
              <TextField
                type="date"
                value={newEmployee.joinDate}
                onChange={(e) => handleChange("joinDate", e.target.value)}
                fullWidth
                InputLabelProps={{ shrink: true }}
                required
              />
            </Grid>

            <Grid item size={{ xs: 2, sm: 4, md: 4 }}>
              <Typography sx={{ fontSize: "15px", mb: 0.5 }}>ID</Typography>
              <TextField
                placeholder="Enter ID"
                value={newEmployee.id}
                onChange={(e) => handleChange("id", e.target.value)}
                fullWidth
                required
              />
            </Grid>

            <Grid item size={{ xs: 2, sm: 4, md: 4 }}>
              <Typography sx={{ fontSize: "15px", mb: 0.5 }}>Skills</Typography>
              <TextField
                placeholder="Enter skills, comma separated"
                value={newEmployee.skills.join(", ")}
                onChange={(e) => handleChange("skills", e.target.value)}
                fullWidth
              />
            </Grid>
          </Grid>
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default AllEmployees;
