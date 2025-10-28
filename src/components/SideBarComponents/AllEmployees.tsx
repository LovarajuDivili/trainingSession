/* eslint-disable @typescript-eslint/no-explicit-any */
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
  Chip,
  Divider,
  Checkbox,
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
import { useAppDispatch, useAppSelector } from "../../hooks/reduxHooks";
import {
  fetchEmployees,
  addEmployeeAPI,
  deleteEmployeeAPI,
  updateEmployeeAPI,
} from "../../store/EmployeesSlice";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import CloseIcon from "@mui/icons-material/Close";
import { Snackbar, Alert } from "@mui/material";
import NoData from "../../common/noData";

const CustomNoRowsOverlay = () => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100%",
        gap: 2,
        p: 3,
      }}
    >
      <NoData
        imageSrc="/public/no_data_image.jpg"
        altText="No employees"
        message="No employees found"
      />
    </Box>
  );
};

const AllEmployees = () => {
  const [loading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [cardView, setCardView] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<"error" | "success">(
    "success"
  );
  const [isEditing, setIsEditing] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [employeeToDelete, setEmployeeToDelete] = useState<string | null>(null);
  const [confirmChecked, setConfirmChecked] = useState(false);
  const [newEmployee, setNewEmployee] = useState<Employee>({
    name: "",
    email: "",
    role: "",
    joinDate: "",
    id: "",
    skills: [],
  });
  const [skillInput, setSkillInput] = useState("");
  const dispatch = useAppDispatch();
  const employees = useAppSelector((state) => state.employees.employees);

  const handleSkillKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && skillInput.trim() !== "") {
      e.preventDefault();
      if (!newEmployee.skills.includes(skillInput.trim())) {
        setNewEmployee((prev) => ({
          ...prev,
          skills: [...prev.skills, skillInput.trim()],
        }));
      }
      setSkillInput("");
    }
  };

  const handleDeleteSkill = (skillToDelete: string) => {
    setNewEmployee((prev) => ({
      ...prev,
      skills: prev.skills.filter((skill) => skill !== skillToDelete),
    }));
  };

  useEffect(() => {
    dispatch(fetchEmployees());
  }, [dispatch]);

  const filteredEmployees = employees.filter(
    (emp) =>
      emp.name.toLowerCase().includes(searchText.toLowerCase()) ||
      emp.role.toLowerCase().includes(searchText.toLowerCase())
  );

  const handleSnackbarClose = (_?: any, reason?: string) => {
    if (reason === "clickaway") return;
    setSnackbarOpen(false);
  };

  const handleOpenDialog = (employee?: Employee) => {
    if (employee) {
      setIsEditing(true);
      setNewEmployee(employee);
    } else {
      setIsEditing(false);
      const numericIds = employees
        .map((emp) => parseInt(emp.id.replace("EMP", ""), 10))
        .filter((num) => !isNaN(num));

      const nextNumber =
        numericIds.length > 0 ? Math.max(...numericIds) + 1 : 1;

      const nextId = `EMP${nextNumber}`;
      setNewEmployee({
        name: "",
        email: "",
        role: "",
        joinDate: "",
        id: String(nextId),
        skills: [],
      });
    }
    setOpenDialog(true);
  };
  const handleCloseDialog = () => {
    setOpenDialog(false);
    setIsEditing(false);
    setNewEmployee({
      name: "",
      email: "",
      role: "",
      joinDate: "",
      id: "",
      skills: [],
    });
    setSkillInput("");
  };

  const handleAddClick = () => {
    handleOpenDialog();
  };

  const handleEditEmployee = (employee: Employee) => {
    handleOpenDialog(employee);
  };

  const isSaveDisabled = !(
    newEmployee.name &&
    newEmployee.email &&
    newEmployee.role &&
    newEmployee.joinDate &&
    newEmployee.id &&
    newEmployee.skills.length > 0
  );
  const handleChange = (field: keyof Employee, value: string) => {
    setNewEmployee((prev) => ({ ...prev, [field]: value }));
  };

  const handleSaveEmployee = async () => {
    if (
      !newEmployee.name ||
      !newEmployee.email ||
      !newEmployee.role ||
      !newEmployee.joinDate ||
      !newEmployee.id
    ) {
      setSnackbarMessage("⚠️ Please fill all required fields!");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      return;
    }

    try {
      if (isEditing) {
        await dispatch(updateEmployeeAPI(newEmployee)).unwrap();
        setSnackbarMessage("Employee updated successfully!");
        setSnackbarSeverity("success");
      } else {
        await dispatch(addEmployeeAPI(newEmployee)).unwrap();
        setSnackbarMessage("Employee added successfully!");
        setSnackbarSeverity("success");
      }

      dispatch(fetchEmployees());
      handleCloseDialog();
      setSnackbarOpen(true);
    } catch (error: any) {
      console.error("Error saving employee:", error);

      const message =
        error?.detail || `Failed to ${isEditing ? "update" : "add"} employee`;
      setSnackbarMessage(message);
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  const handleDeleteEmployee = async (employeeId: string) => {
    setEmployeeToDelete(employeeId);
    setDeleteConfirmOpen(true);
    setConfirmChecked(false); // Reset checkbox when dialog opens
  };

  const handleConfirmDelete = async () => {
    if (!employeeToDelete) return;

    try {
      await dispatch(deleteEmployeeAPI(employeeToDelete)).unwrap();
      dispatch(fetchEmployees());
      setDeleteConfirmOpen(false);
      setEmployeeToDelete(null);
      setConfirmChecked(false);
    } catch (error: any) {
      console.error("Error deleting employee:", error);
      alert(error?.detail || "⚠️ Failed to delete employee");
    }
  };

  const handleCancelDelete = () => {
    setDeleteConfirmOpen(false);
    setEmployeeToDelete(null);
    setConfirmChecked(false);
  };

  const dialogTitle = isEditing ? "Edit Employee" : "Add New Employee";
  const saveButtonLabel = isEditing ? "Save" : "Add";

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
                backgroundColor: "#906aff",
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
    {
      field: "actions",
      headerName: "Actions",
      flex: 1,
      sortable: false,
      filterable: false,
      renderCell: (params: GridRenderCellParams<Employee>) => (
        <Box>
          <IconButton
            color="primary"
            onClick={() => handleEditEmployee(params.row)}
          >
            <EditIcon />
          </IconButton>
          <IconButton
            color="error"
            onClick={() => handleDeleteEmployee(params.row.id)}
          >
            <DeleteIcon />
          </IconButton>
        </Box>
      ),
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
        onAddClick={handleAddClick}
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
                      <Box
                        display="flex"
                        justifyContent="space-between"
                        alignItems="center"
                      >
                        <Typography
                          variant="h6"
                          sx={{ fontWeight: 600, color: "#906aff" }}
                        >
                          {emp.name}
                        </Typography>

                        <Box
                          sx={{
                            width: 30,
                            height: 30,
                            borderRadius: "50%",
                            backgroundColor: "lightgray",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <Typography
                            variant="h6"
                            sx={{ fontWeight: 600, color: "white" }}
                          >
                            {emp.name.charAt(0).toUpperCase()}{" "}
                          </Typography>
                        </Box>
                      </Box>
                      <Typography variant="body2" sx={{ mt: 1 }}>
                        <strong>Emp Id:</strong> {emp.id}
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
                                bgcolor: "#906aff",
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
            <Box sx={{ height: "calc(100vh - 150px)", width: "100%" }}>
              <DataGrid
                rows={filteredEmployees}
                columns={columns}
                getRowId={(row) => row.id}
                pageSizeOptions={[5, 10, 20]}
                initialState={{
                  pagination: { paginationModel: { pageSize: 5, page: 0 } },
                }}
                slots={{
                  noRowsOverlay: CustomNoRowsOverlay,
                }}
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
            </Box>
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
            padding: "20px",
          }}
        >
          <DialogTitle sx={{ p: 0, fontSize: "25px" }}>
            {dialogTitle}
          </DialogTitle>
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              gap: 2,
              mt: 0,
              mb: 1,
            }}
          >
            <Button
              variant="outlined"
              sx={{
                color: "#d81b60",
                borderColor: "#d81b60",
                textTransform: "uppercase",
              }}
              onClick={handleCloseDialog}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={handleSaveEmployee}
              disabled={isSaveDisabled}
              sx={{ backgroundColor: "#906aff", textTransform: "uppercase" }}
            >
              {saveButtonLabel}
            </Button>
          </Box>
        </Box>

        <Divider />

        <DialogContent sx={{ mt: 2, pt: 0 }}>
          <Grid container spacing={2} sx={{ pr: 1 }}>
            <Grid item size={{ xs: 2, sm: 4, md: 4 }}>
              <Typography sx={{ fontSize: "15px", mb: 0.5 }}>Name</Typography>
              <TextField
                placeholder="Enter name"
                value={newEmployee.name}
                onChange={(e) => handleChange("name", e.target.value)}
                fullWidth
                required
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "20px",
                  },
                }}
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
                disabled={isEditing}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "20px",
                  },
                }}
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
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "20px",
                  },
                }}
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
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "20px",
                  },
                }}
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
                InputProps={{ readOnly: true }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "20px",
                  },
                }}
              />
            </Grid>

            <Grid item size={{ xs: 2, sm: 4, md: 4 }}>
              <Typography sx={{ fontSize: "15px", mb: 0.5 }}>Skills</Typography>
              <TextField
                placeholder="Type a skill and press Enter"
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyDown={handleSkillKeyDown}
                fullWidth
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "20px",
                  },
                }}
              />
            </Grid>

            <Grid item xs={12}>
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                {newEmployee.skills.map((skill, index) => (
                  <Chip
                    key={index}
                    label={skill}
                    onDelete={() => handleDeleteSkill(skill)}
                    variant="outlined"
                    sx={{
                      backgroundColor: "white",
                      color: "#906aff",
                      borderColor: "#906aff",
                    }}
                  />
                ))}
              </Box>
            </Grid>
          </Grid>
        </DialogContent>
      </Dialog>
      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteConfirmOpen}
        onClose={handleCancelDelete}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle
          sx={{
            fontSize: "20px",
            fontWeight: 600,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          Confirm Delete
          

          <IconButton
            onClick={handleCancelDelete}
            size="small"
            sx={{
              backgroundColor: "#f5f5f5",
              color: "#d81b1b",
              "&:hover": { backgroundColor: "#f44336", color: "#fff" },
              width: 28,
              height: 28,
              borderRadius: "50%",
            }}
          >
            <CloseIcon sx={{ fontSize: "18px" }} />
          </IconButton>
        </DialogTitle>
        <Divider sx={{ mb: 1 }} />
        <DialogContent>
          <Typography sx={{ mb: 1 }}>
            Are you sure you want to delete the employee -{" "}
            <strong>
              {employees.find((emp) => emp.id === employeeToDelete)?.name || ""}
            </strong>
            ? This action cannot be undone.
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Checkbox
              id="confirm-delete"
              checked={confirmChecked}
              onChange={(e) => setConfirmChecked(e.target.checked)}
              size="small"
            />
            <Typography
              component="label"
              htmlFor="confirm-delete"
              sx={{ cursor: "pointer" }}
            >
              Yes, I want to delete the employee -{" "}
              <strong>
                {employees.find((emp) => emp.id === employeeToDelete)?.name ||
                  ""}
              </strong>
            </Typography>
          </Box>
        </DialogContent>
        <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2, p: 2 }}>
          <Button
            variant="outlined"
            onClick={handleCancelDelete}
            sx={{
              color: "#666",
              borderColor: "#666",
              textTransform: "uppercase",
            }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={handleConfirmDelete}
            disabled={!confirmChecked}
            sx={{
              backgroundColor: "#d81b1bff",
              textTransform: "uppercase",
              "&:disabled": {
                backgroundColor: "#f5f5f5",
                color: "#999",
              },
            }}
          >
            Delete
          </Button>
        </Box>
      </Dialog>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={2000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbarSeverity}
          sx={{ width: "100%" }}
          variant="filled"
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default AllEmployees;
