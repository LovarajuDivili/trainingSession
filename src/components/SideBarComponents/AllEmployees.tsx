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
  Select,
  MenuItem,
  FormControl,
  Card,
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
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { useNavigate } from "react-router-dom";
import "./AllEmployees.css";
import axios from "axios";
//import { colors } from "../../common/colorConstants";
import { useThemeColors } from "../../hooks/useThemeColors";
import { useTheme } from "../../context/ThemeContext";

const CustomNoRowsOverlay = () => {
  const colors = useThemeColors();
  return (
    <Box
      className="no-rows-overlay"
      sx={{
        backgroundColor: colors.background.card, // Add this
        color: colors.text.primary,
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
    laptop: false,
    headphones: false,
    monitor: false,
    image: null as string | null,
  });
  const [skillInput, setSkillInput] = useState("");
  const dispatch = useAppDispatch();
  const employees = useAppSelector((state) => state.employees.employees);
  const navigate = useNavigate();
  const colors = useThemeColors();
  const { themeMode } = useTheme();

  const handleCardClick = (employeeId: string) => {
    navigate(`/admin/all-employees/employeedetails/${employeeId}`, {
      state: { from: "/admin/all-employees" },
    });
  };

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

  const handleSnackbarClose = (
    _: React.SyntheticEvent | Event,
    reason?: string
  ) => {
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
        laptop: false,
        headphones: false,
        monitor: false,
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
      laptop: false,
      headphones: false,
      monitor: false,
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
    } catch (error: unknown) {
      console.error("Error saving employee:", error);

      let message = `Failed to ${isEditing ? "update" : "add"} employee`;

      if (axios.isAxiosError(error)) {
        message = error.response?.data?.detail || message;
      } else if (error instanceof Error) {
        message = error.message || message;
      }

      setSnackbarMessage(message);
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  const handleDeleteEmployee = async (employeeId: string) => {
    setEmployeeToDelete(employeeId);
    setDeleteConfirmOpen(true);
    setConfirmChecked(false);
  };

  const handleConfirmDelete = async () => {
    if (!employeeToDelete) return;

    try {
      await dispatch(deleteEmployeeAPI(employeeToDelete)).unwrap();
      dispatch(fetchEmployees());
      setDeleteConfirmOpen(false);
      setEmployeeToDelete(null);
      setConfirmChecked(false);
    } catch (error: unknown) {
      console.error("Error deleting employee:", error);

      let message = "⚠️ Failed to delete employee";

      if (axios.isAxiosError(error)) {
        message = error.response?.data?.detail || message;
      } else if (error instanceof Error) {
        message = error.message || message;
      }

      alert(message);
    }
  };

  const handleCancelDelete = () => {
    setDeleteConfirmOpen(false);
    setEmployeeToDelete(null);
    setConfirmChecked(false);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check file size (max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        setSnackbarMessage("Image size must be less than 2MB");
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        const base64String = event.target?.result as string;
        // Remove the data URL prefix if present
        const base64Data = base64String.split(",")[1] || base64String;

        setNewEmployee((prev) => ({
          ...prev,
          image: base64Data, // Store only the base64 data
        }));
      };
      reader.onerror = () => {
        setSnackbarMessage("Failed to read image file");
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const dialogTitle = isEditing ? "Edit Employee" : "Add New Employee";
  const saveButtonLabel = isEditing ? "Save" : "Add";

  const columns: GridColDef<Employee>[] = [
    {
      field: "name",
      headerName: "Name",
      flex: 1.5,
      renderCell: (params) => {
        const { image, name } = params.row;
        return (
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, pt: 1.5 }}>
            <img
              src={
                image ? `data:image/jpeg;base64,${image}` : "/placeholder.jpg"
              }
              alt={name || "Employee"}
              style={{
                width: 30,
                height: 30,
                borderRadius: "50%",
                objectFit: "cover",
              }}
              onError={(e) => {
                e.currentTarget.src = "/placeholder.jpg";
              }}
            />
            <Typography
              variant="body1"
              sx={{ fontWeight: 500, color: colors.text.primary }}
            >
              {name || "No Name"}
            </Typography>
          </Box>
        );
      },
    },
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
              className="skill-button"
              style={{
                backgroundColor:
                  themeMode === "dark"
                    ? colors.text.white
                    : colors.ui.chip.background,
                color:
                  themeMode === "dark"
                    ? colors.primary.main
                    : colors.ui.chip.text,
                border:
                  themeMode === "dark"
                    ? `1px solid ${colors.primary.main}`
                    : "none",
                margin: "4px",
                padding: "6px",
                borderRadius: "6px",
                fontSize: "12px",
                //border: "none",
                cursor: "default",
              }}
            >
              <strong>{each}</strong>
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
            sx={{ color: "#906aff" }}
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
              sx={{
                fontSize: "35px",
                color: cardView ? colors.text.primary : colors.text.gray,
              }}
            />
          </IconButton>
        }
      />

      {loading ? (
        <Typography>{Loading.LOADING}</Typography>
      ) : (
        <Box
          sx={{
            height: cardView ? "auto" : 500,
            width: "100%",
            backgroundColor: colors.background.white, // This should now be black in dark mode
          }}
        >
          {cardView ? (
            <Grid container spacing={2}>
              {filteredEmployees.map((emp) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={emp.id}>
                  <Card
                    onClick={() => handleCardClick(emp.id)}
                    sx={{
                      p: 2,
                      border: `1px solid ${colors.border.light}`,
                      borderRadius: 3,
                      boxShadow: `0 2px 8px ${colors.shadow.light}`,
                      backgroundColor: colors.background.card,
                      height: "100%",
                      transition: "transform 0.2s, box-shadow 0.2s",
                      "&:hover": {
                        transform: "translateY(-2px)",
                        boxShadow: `0 4px 12px ${colors.shadow.medium}`,
                        cursor: "pointer",
                      },
                    }}
                  >
                    <Box>
                      <Box
                        display="flex"
                        justifyContent="space-between"
                        alignItems="center"
                        mb={2}
                      >
                        <Typography
                          variant="h6"
                          sx={{
                            fontWeight: 600,
                            color: colors.primary.main,
                          }}
                        >
                          {emp.name}
                        </Typography>
                        {emp.image ? (
                          <Box>
                            <img
                              src={`data:image/jpeg;base64,${emp.image}`}
                              alt={emp.name}
                              style={{
                                width: 60,
                                height: 60,
                                borderRadius: "50%",
                                objectFit: "cover",
                              }}
                            />
                          </Box>
                        ) : (
                          <Box
                            sx={{
                              width: 60,
                              height: 60,
                              borderRadius: "50%",
                              backgroundColor: colors.special.placeholder,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              color: colors.special.placeholderText,
                              fontSize: 20,
                              fontWeight: "bold",
                            }}
                          >
                            {emp.name.charAt(0).toUpperCase()}
                          </Box>
                        )}
                      </Box>

                      <Typography
                        variant="body2"
                        sx={{ mt: 1, color: colors.text.primary }}
                      >
                        <strong>Emp Id:</strong> {emp.id}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{ mt: 1, color: colors.text.primary }}
                      >
                        <strong>Email:</strong> {emp.email}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{ color: colors.text.primary }}
                      >
                        <strong>Role:</strong> {emp.role}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{ color: colors.text.primary }}
                      >
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
                                fontSize: "12px",
                                padding: "4px 8px",
                                backgroundColor: colors.ui.chip.background,
                                color: colors.ui.chip.text,
                                borderRadius: "6px",
                                border: `1px solid ${colors.ui.chip.border}`,
                              }}
                            >
                              {s}
                            </Box>
                          ))}
                        </Box>
                      ) : null}
                    </Box>
                  </Card>
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
                    backgroundColor: colors.background.white, // Use white background
                    color: colors.text.primary,
                    fontSize: 17,
                    borderBottom: `1px solid ${colors.border.light}`,
                  },
                  "& .MuiDataGrid-columnHeader": {
                    backgroundColor: colors.background.white, // Use white background
                    "&:focus, &:focus-within": {
                      outline: "none",
                    },
                  },
                  "& .MuiDataGrid-columnHeaderTitle": {
                    fontWeight: 600,
                    color: colors.text.primary,
                  },
                  "& .MuiDataGrid-cell": {
                    color: colors.text.primary,
                    borderBottom: `1px solid ${colors.border.light}`,
                    backgroundColor: colors.background.white, // Use white background
                  },
                  "& .MuiDataGrid-row": {
                    backgroundColor: colors.background.white, // Use white background
                    "&:hover": {
                      backgroundColor: colors.state.hoverLight,
                    },
                  },
                  "& .MuiTablePagination-root": {
                    color: colors.text.primary,
                    backgroundColor: colors.background.white, // Use white background
                  },
                  "& .MuiDataGrid-menuIcon": {
                    color: colors.text.primary,
                  },
                  "& .MuiDataGrid-sortIcon": {
                    color: colors.text.primary,
                  },
                  "& .MuiDataGrid-footerContainer": {
                    backgroundColor: colors.background.white, // Use white background
                    borderTop: `1px solid ${colors.border.light}`,
                    color: colors.text.primary,
                  },
                  "& .MuiDataGrid-toolbarContainer": {
                    backgroundColor: colors.background.white, // Use white background
                    color: colors.text.primary,
                  },
                  // Main DataGrid background
                  backgroundColor: colors.background.white, // Use white background
                  border: `1px solid ${colors.border.light}`,
                  "& .MuiDataGrid-virtualScroller": {
                    backgroundColor: colors.background.white, // Use white background
                  },
                  "& .MuiDataGrid-main": {
                    backgroundColor: colors.background.white, // Use white background
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
        PaperProps={{
          sx: {
            backgroundColor: colors.background.white,
            color: colors.text.primary,
            border: "0.1px solid #ffffff", // <-- White border
            borderRadius: "12px", // Optional: makes it look cleaner
          },
        }}
      >
        <Box
          className="dialog-header"
          sx={{
            backgroundColor: colors.background.white,
            color: colors.text.primary,
          }}
        >
          <DialogTitle
            sx={{
              color: colors.text.primary,
              padding: 0,
              fontSize: "25px",
            }}
          >
            {dialogTitle}
          </DialogTitle>
          <Box className="dialog-actions">
            <Button
              variant="outlined"
              className="cancel-button"
              onClick={handleCloseDialog}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={handleSaveEmployee}
              disabled={isSaveDisabled}
              sx={{
                backgroundColor:
                  themeMode === "dark"
                    ? colors.text.white
                    : colors.primary.main,
                color:
                  themeMode === "dark"
                    ? colors.primary.main
                    : colors.text.white,
                textTransform: "uppercase",
                "&:hover": {
                  backgroundColor:
                    themeMode === "dark"
                      ? colors.state.hoverLight
                      : colors.primary.dark,
                },
                "&:disabled": {
                  backgroundColor: colors.ui.button.disabled,
                  color: colors.text.disabled,
                },
                // Add !important to override CSS
                "&&": {
                  backgroundColor:
                    themeMode === "dark"
                      ? `${colors.text.white} !important`
                      : colors.primary.main,
                  color:
                    themeMode === "dark"
                      ? `${colors.primary.main} !important`
                      : colors.text.white,
                },
              }}
            >
              {saveButtonLabel}
            </Button>
          </Box>
        </Box>

        <Divider />

        <DialogContent sx={{ mt: 2, pt: 0 }}>
          <Grid container spacing={2} sx={{ pr: 1 }}>
            <Grid item size={{ xs: 2, sm: 4, md: 4 }}>
              <Typography
                sx={{ fontSize: "15px", mb: 0.5, color: colors.text.primary }}
              >
                Name
              </Typography>
              <TextField
                placeholder="Enter name"
                value={newEmployee.name}
                onChange={(e) => handleChange("name", e.target.value)}
                fullWidth
                required
                sx={{
                  "& .MuiOutlinedInput-root": {
                    color: colors.text.primary,
                    backgroundColor: colors.background.white, // This ensures input background
                    "& fieldset": {
                      borderColor: colors.border.light,
                    },
                    "&:hover fieldset": {
                      borderColor: colors.primary.main,
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: colors.primary.main,
                    },
                  },
                }}
              />
            </Grid>

            <Grid item size={{ xs: 2, sm: 4, md: 4 }}>
              <Typography className="form-label">Email</Typography>
              <TextField
                placeholder="Enter email"
                value={newEmployee.email}
                onChange={(e) => handleChange("email", e.target.value)}
                fullWidth
                required
                disabled={isEditing}
                className="form-field"
                sx={{
                  "& .MuiOutlinedInput-root": {
                    color: colors.text.primary,
                    "& fieldset": {
                      borderColor: colors.border.light,
                    },
                    "&:hover fieldset": {
                      borderColor: colors.primary.main,
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: colors.primary.main,
                    },
                  },
                }}
              />
            </Grid>

            <Grid item size={{ xs: 2, sm: 4, md: 4 }}>
              <Typography
                className="form-label"
                sx={{ color: colors.text.primary }}
              >
                Role
              </Typography>
              <FormControl fullWidth required>
                <Select
                  value={newEmployee.role}
                  onChange={(e) => handleChange("role", e.target.value)}
                  displayEmpty
                  className="form-field"
                  sx={{
                    color: colors.text.primary,
                    "& .MuiOutlinedInput-notchedOutline": {
                      borderColor: colors.border.light,
                    },
                    "&:hover .MuiOutlinedInput-notchedOutline": {
                      borderColor: colors.primary.main,
                    },
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                      borderColor: colors.primary.main,
                    },
                  }}
                >
                  <MenuItem value="" disabled>
                    Select Role
                  </MenuItem>
                  <MenuItem value="Developer">Developer</MenuItem>
                  <MenuItem value="Tester">Tester</MenuItem>
                  <MenuItem value="HR Team">HR Team</MenuItem>
                  <MenuItem value="Accountant">Accountant</MenuItem>
                  <MenuItem value="AWS Team">AWS Team</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                width: "100%",
                mt: 2,
              }}
            >
              <Grid
                container
                spacing={2}
                alignItems="center"
                sx={{ maxWidth: "md", width: "100%" }}
              >
                <Grid item xs={12} sx={{ width: "50%" }}>
                  <Box
                    className="upload-container"
                    sx={{
                      flex: 1,
                      border: `1px dashed ${colors.border.dashed}`,
                      borderRadius: 2,
                      backgroundColor: colors.background.upload,
                      padding: 3,
                      textAlign: "center",
                    }}
                  >
                    <CloudUploadIcon
                      sx={{ fontSize: 40, color: colors.special.uploadIcon }}
                    />
                    <Typography
                      variant="subtitle1"
                      className="upload-title"
                      sx={{ clor: colors.text.secondary }}
                    >
                      Upload Image
                    </Typography>
                    <Typography
                      variant="body2"
                      className="upload-subtitle"
                      sx={{ clor: colors.text.secondary }}
                    >
                      Image size must be less than 2MB
                    </Typography>

                    <Button
                      variant="contained"
                      component="label"
                      className="upload-button"
                      sx={{
                        backgroundColor: colors.primary.main,
                        color: colors.text.white,
                        borderRadius: "20px",
                        textTransform: "none",
                        fontWeight: 500,
                        px: 3,
                        "&:hover": {
                          backgroundColor: colors.primary.dark,
                        },
                      }}
                    >
                      {newEmployee.image ? "Change Image" : "Upload Image"}
                      <input
                        type="file"
                        accept="image/*"
                        hidden
                        onChange={handleImageUpload}
                      />
                    </Button>
                  </Box>
                </Grid>

                <Grid
                  item
                  xs={12}
                  sm={6}
                  md={6}
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    width: "40%",
                  }}
                >
                  {newEmployee.image ? (
                    <Box className="preview-container">
                      <img
                        src={`data:image/jpeg;base64,${newEmployee.image}`}
                        alt="Preview"
                        className="preview-image"
                      />
                      <Typography
                        variant="body2"
                        sx={{ mt: 1, color: colors.text.primary }}
                      >
                        <strong>Filename:</strong>{" "}
                        {typeof newEmployee.image === "string"
                          ? "Uploaded Image"
                          : "Image"}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{ color: colors.text.primary }}
                      >
                        <strong>File Size:</strong>{" "}
                        {typeof newEmployee.image === "string"
                          ? "-"
                          : `${(
                              (newEmployee.image as File).size / 1024
                            ).toFixed(2)} KB`}
                      </Typography>
                    </Box>
                  ) : (
                    <Typography
                      variant="body2"
                      sx={{ color: colors.text.secondary, textAlign: "center" }}
                    >
                      No image selected
                    </Typography>
                  )}
                </Grid>
              </Grid>
            </Box>

            <Grid item size={{ xs: 2, sm: 4, md: 4 }}>
              <Box className="checkbox-container">
                <Checkbox
                  checked={newEmployee.laptop || false}
                  onChange={(e) =>
                    handleChange("laptop", e.target.checked.toString())
                  }
                  className="checkbox-primary"
                />
                <Typography>Laptop</Typography>
              </Box>
            </Grid>
            <Grid item size={{ xs: 2, sm: 4, md: 4 }}>
              <Box className="checkbox-container">
                <Checkbox
                  checked={newEmployee.headphones || false}
                  onChange={(e) =>
                    handleChange("headphones", e.target.checked.toString())
                  }
                  className="checkbox-primary"
                />
                <Typography>Headphones</Typography>
              </Box>
            </Grid>
            <Grid item size={{ xs: 2, sm: 4, md: 4 }}>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Checkbox
                  checked={newEmployee.monitor || false}
                  onChange={(e) =>
                    handleChange("monitor", e.target.checked.toString())
                  }
                  className="checkbox-primary"
                />
                <Typography>Monitor</Typography>
              </Box>
            </Grid>

            <Grid item size={{ xs: 2, sm: 4, md: 4 }}>
              <Typography className="form-label">Join Date</Typography>
              <TextField
                type="date"
                value={newEmployee.joinDate}
                onChange={(e) => handleChange("joinDate", e.target.value)}
                fullWidth
                InputLabelProps={{ shrink: true }}
                required
                className="form-field"
                sx={{
                  "& .MuiOutlinedInput-root": {
                    color: colors.text.primary,
                    "& fieldset": {
                      borderColor: colors.border.light,
                    },
                    "&:hover fieldset": {
                      borderColor: colors.primary.main,
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: colors.primary.main,
                    },
                  },
                }}
              />
            </Grid>

            <Grid item size={{ xs: 2, sm: 4, md: 4 }}>
              <Typography
                className="form-label"
                sx={{ color: colors.text.primary }}
              >
                ID
              </Typography>
              <TextField
                placeholder="Enter ID"
                value={newEmployee.id}
                onChange={(e) => handleChange("id", e.target.value)}
                fullWidth
                required
                InputProps={{ readOnly: true }}
                className="form-field"
                sx={{
                  "& .MuiOutlinedInput-root": {
                    color: colors.text.primary,
                    backgroundColor: colors.background.disabled,
                    "& fieldset": {
                      borderColor: colors.border.light,
                    },
                  },
                }}
              />
            </Grid>

            <Grid item size={{ xs: 2, sm: 4, md: 4 }}>
              <Typography
                sx={{ fontSize: "15px", mb: 0.5, color: colors.text.primary }}
              >
                Skills
              </Typography>
              <TextField
                placeholder="Type a skill and press Enter"
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyDown={handleSkillKeyDown}
                fullWidth
                className="form-field"
                sx={{
                  "& .MuiOutlinedInput-root": {
                    color: colors.text.primary,
                    "& fieldset": {
                      borderColor: colors.border.light,
                    },
                    "&:hover fieldset": {
                      borderColor: colors.primary.main,
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: colors.primary.main,
                    },
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
                    className="skill-chip-form"
                    sx={{
                      color: colors.primary.main,
                      borderColor: colors.primary.main,
                      "& .MuiChip-deleteIcon": {
                        color: colors.primary.main,
                        "&:hover": {
                          color: colors.primary.dark,
                        },
                      },
                    }}
                  />
                ))}
              </Box>
            </Grid>
          </Grid>
        </DialogContent>
      </Dialog>

      <Dialog
        open={deleteConfirmOpen}
        onClose={handleCancelDelete}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle className="delete-dialog-title">
          Confirm Delete
          <IconButton
            onClick={handleCancelDelete}
            size="small"
            className="delete-close-button"
          >
            <CloseIcon sx={{ fontSize: "18px" }} />
          </IconButton>
        </DialogTitle>
        <Divider sx={{ mb: 1 }} />
        <DialogContent>
          <Typography className="delete-confirm-text">
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
        <Box className="delete-actions">
          <Button
            variant="outlined"
            onClick={handleCancelDelete}
            className="delete-cancel-button"
            sx={{
              borderColor: "primary.main",
              "&:hover": {
                borderColor: "primary.main",
              },
            }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={handleConfirmDelete}
            disabled={!confirmChecked}
            className="delete-confirm-button"
            sx={{
              backgroundColor:
                themeMode === "dark" ? colors.text.white : colors.status.error,
              color:
                themeMode === "dark" ? colors.status.error : colors.text.white,
              "&:hover": {
                backgroundColor:
                  themeMode === "dark" ? colors.state.hoverLight : "#c62828",
              },
              "&:disabled": {
                backgroundColor: colors.ui.button.disabled,
                color: colors.text.disabled,
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
