import React, { useState, type KeyboardEvent } from "react";
import {
  Box,
  Typography,
  InputBase,
  IconButton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Card,
  CardContent,
  Chip,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";
import GridViewIcon from "@mui/icons-material/GridView";
import PeopleIcon from "@mui/icons-material/People";
import CloseIcon from "@mui/icons-material/Close";
import { useOutletContext } from "react-router-dom";
import type { Employee } from "../common/types";
import { DataGrid, type GridRenderCellParams } from "@mui/x-data-grid";

interface OutletContext {
  filteredEmployees: Employee[];
  setEmployees: React.Dispatch<React.SetStateAction<Employee[]>>;
}

const primaryColor = "#906aff";

const AllEmployees: React.FC = () => {
  const { filteredEmployees, setEmployees } = useOutletContext<OutletContext>();
  const [showGrid, setShowGrid] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newEmployee, setNewEmployee] = useState<Employee>({
    id: "",
    name: "",
    role: "",
    email: "",
    joinDate: "",
    skills: [],
  });
  const [skillInput, setSkillInput] = useState("");

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const emailValid = emailRegex.test(newEmployee.email.trim());

  const isFormValid =
    newEmployee.id.trim() !== "" &&
    newEmployee.name.trim() !== "" &&
    newEmployee.role.trim() !== "" &&
    newEmployee.email.trim() !== "" &&
    emailValid &&
    newEmployee.joinDate.trim() !== "" &&
    newEmployee.skills.length > 0;

  const displayedEmployees = filteredEmployees.filter((emp) =>
    `${emp.name} ${emp.role} ${emp.email}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  const columns = [
    { field: "id", headerName: "ID", flex: 0.6 },
    { field: "name", headerName: "Employee Name", flex: 1 },
    { field: "role", headerName: "Role", flex: 1 },
    {
      field: "email",
      headerName: "Email",
      flex: 1.2,
      renderCell: (params: GridRenderCellParams<Employee>) => (
        <Typography
          variant="body2"
          sx={{
            fontSize: "0.875rem",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            lineHeight: "24px",
            display: "flex",
            alignItems: "center",
            height: "100%",
            width: "100%",
          }}
          title={params.value}
        >
          {params.value}
        </Typography>
      ),
    },
    { field: "joinDate", headerName: "Join Date", flex: 1 },
    {
      field: "skills",
      headerName: "Skills",
      flex: 1.5,
      renderCell: (params: GridRenderCellParams<Employee>) => (
        <Typography
          variant="body2"
          sx={{
            fontSize: "0.875rem",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            lineHeight: "24px",
            display: "flex",
            alignItems: "center",
            height: "100%",
            width: "100%",
          }}
          title={params.value?.join(", ")}
        >
          {params.value?.join(", ") || "-"}
        </Typography>
      ),
    },
  ];

  const handleSkillKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (
      (e.key === "Enter" || e.key === ",") &&
      skillInput.trim() !== "" &&
      !newEmployee.skills.includes(skillInput.trim())
    ) {
      e.preventDefault();
      setNewEmployee((prev) => ({
        ...prev,
        skills: [...prev.skills, skillInput.trim()],
      }));
      setSkillInput("");
    }
  };

  const handleDeleteSkill = (skillToDelete: string) => {
    setNewEmployee((prev) => ({
      ...prev,
      skills: prev.skills.filter((skill) => skill !== skillToDelete),
    }));
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setNewEmployee({
      id: "",
      name: "",
      role: "",
      email: "",
      joinDate: "",
      skills: [],
    });
    setSkillInput("");
  };

  const handleAddEmployee = () => {
    setEmployees((prev) => [...prev, newEmployee]);
    handleDialogClose();
  };

  return (
    <Box
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      {/* Toolbar */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
          flexWrap: { xs: "wrap", sm: "nowrap" },
          gap: 2,
          flexShrink: 0,
          px: 2,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <PeopleIcon sx={{ color: "black" }} />
          <Typography variant="h5" sx={{ fontWeight: "bold", color: "black" }}>
            Employees ({displayedEmployees.length})
          </Typography>
          <IconButton
            onClick={() => setShowGrid((prev) => !prev)}
            sx={{ color: showGrid ? primaryColor : "black" }}
            title={showGrid ? "Switch to Table View" : "Switch to Card View"}
          >
            <GridViewIcon />
          </IconButton>
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Box
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
              placeholder="Search by name, role, email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              sx={{ flex: 1 }}
            />
            {searchTerm && (
              <IconButton onClick={() => setSearchTerm("")} size="small">
                <ClearIcon fontSize="small" />
              </IconButton>
            )}
          </Box>

          <Button
            variant="contained"
            onClick={() => setDialogOpen(true)}
            sx={{
              backgroundColor: primaryColor,
              "&:hover": { backgroundColor: "#7a53e3" },
            }}
          >
            Add New +
          </Button>
        </Box>
      </Box>
      <Box
        sx={{
          borderBottom: "1px solid #dcdcdc",
          mb: 2,
          mx: 2,
        }}
      />
      <Box
        sx={{
          flexGrow: 1,
          px: 2,
          height: "100%",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {showGrid ? (
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              gap: 2,
              justifyContent: "flex-start",
              overflowY: "auto",
            }}
          >
            {displayedEmployees.map((emp) => (
              <Card
                key={emp.id}
                elevation={3}
                sx={{
                  height: 230,
                  minWidth: 250,
                  maxWidth: 280,
                  flex: "1 1 250px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  p: 2,
                  boxSizing: "border-box",
                  textAlign: "center",
                  overflow: "hidden",
                }}
              >
                <PeopleIcon
                  sx={{ fontSize: 48, color: primaryColor, mb: 1 }}
                  aria-label="Employee Icon"
                />
                <CardContent sx={{ p: 0, flexGrow: 1 }}>
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: "bold",
                      fontSize: "1.1rem",
                      mb: 0.5,
                      overflowWrap: "break-word",
                    }}
                  >
                    {emp.name}
                  </Typography>
                  <Typography variant="body2" sx={{ fontSize: "0.9rem", mb: 1 }}>
                    <strong>Role:</strong> {emp.role}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      fontSize: "0.9rem",
                      whiteSpace: "normal",
                      wordBreak: "break-word",
                      overflowWrap: "break-word",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      maxHeight: 48,
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                      marginTop: 1,
                    }}
                    title={emp.skills?.join(", ") || "-"}
                  >
                    <strong>Skills:</strong>{" "}
                    {emp.skills && emp.skills.length > 0
                      ? emp.skills.join(", ")
                      : "-"}
                  </Typography>
                </CardContent>
              </Card>
            ))}
          </Box>
        ) : (
          <Box
            sx={{
              flexGrow: 1,
              bgcolor: "white",
              borderRadius: 2,
              boxShadow: 3,
            }}
          >
            <DataGrid
              rows={displayedEmployees}
              columns={columns}
              getRowId={(row) => row.id}
              pageSizeOptions={[10]}
              pagination
              paginationModel={{ pageSize: 10, page: 0 }}
              disableRowSelectionOnClick
              sx={{
                border: "none",
                height: "600px",
                "& .MuiDataGrid-columnHeaders": { backgroundColor: "#f9f9f9" },
                "& .MuiDataGrid-columnHeaderTitle": { fontWeight: "bold" },
                "& .MuiDataGrid-cell": { py: 1 },
                "& .MuiDataGrid-row:hover": { backgroundColor: "#f5f5f5" },
              }}
            />
          </Box>
        )}
      </Box>
      <Dialog
        open={dialogOpen}
        onClose={(_, reason) => {
          if (reason !== "backdropClick" && reason !== "escapeKeyDown") {
            handleDialogClose();
          }
        }}
        PaperProps={{
          sx: {
            width: "60vw",
            maxWidth: "none",
          },
        }}
      >
        <DialogTitle
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            pr: 1,
          }}
        >
          Add New Employee
          <IconButton
            aria-label="close"
            onClick={handleDialogClose}
            sx={{
              color: (theme) => theme.palette.grey[500],
              p: 0.5,
            }}
            size="large"
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <Box
          sx={{
            borderBottom: "1px solid #dcdcdc",
            mx: 3,
            mb: 1,
          }}
        />
        <DialogContent sx={{ px: 3, pt: 1 }}>
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              gap: 2,
            }}
          >
            <Box sx={{ flexBasis: "calc(50% - 8px)" }}>
              <TextField
                label="ID"
                variant="outlined"
                fullWidth
                value={newEmployee.id}
                onChange={(e) =>
                  setNewEmployee((prev) => ({ ...prev, id: e.target.value }))
                }
                required
                autoFocus
                sx={{ mb: 2,
                  "& .MuiOutlinedInput-root": {
                     borderRadius: 2,
                  },
                 }}
              />
            </Box>
            <Box sx={{ flexBasis: "calc(50% - 8px)" }}>
              <TextField
                label="Name"
                variant="outlined"
                fullWidth
                value={newEmployee.name}
                onChange={(e) =>
                  setNewEmployee((prev) => ({ ...prev, name: e.target.value }))
                }
                required
                sx={{ mb: 2,
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                  },
                 }}
              />
            </Box>

            <Box sx={{ flexBasis: "calc(50% - 8px)" }}>
              <TextField
                label="Role"
                variant="outlined"
                fullWidth
                value={newEmployee.role}
                onChange={(e) =>
                  setNewEmployee((prev) => ({ ...prev, role: e.target.value }))
                }
                required
                sx={{ mb: 2,
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                  },
                 }}
              />
            </Box>

            <Box sx={{ flexBasis: "calc(50% - 8px)" }}>
              <TextField
                label="Email"
                variant="outlined"
                fullWidth
                value={newEmployee.email}
                onChange={(e) =>
                  setNewEmployee((prev) => ({ ...prev, email: e.target.value }))
                }
                error={newEmployee.email !== "" && !emailValid}
                helperText={
                  newEmployee.email !== "" && !emailValid
                    ? "Invalid email format"
                    : ""
                }
                required
                sx={{ mb: 2,
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                  },
                 }}
              />
            </Box>

            <Box sx={{ flexBasis: "calc(50% - 8px)" }}>
              <TextField
                label="Join Date"
                variant="outlined"
                type="date"
                fullWidth
                value={newEmployee.joinDate}
                onChange={(e) =>
                  setNewEmployee((prev) => ({
                    ...prev,
                    joinDate: e.target.value,
                  }))
                }
                InputLabelProps={{
                  shrink: true,
                }}
                required
                sx={{ mb: 2,
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                  },
                 }}
              />
            </Box>

            <Box sx={{ flexBasis: "100%" }}>
              <TextField
                label="Skills"
                variant="outlined"
                fullWidth
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyDown={handleSkillKeyDown}
                helperText="Press Enter or comma to add skill"
                sx={{ mb: 1,
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                  },
                 }}
              />
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                {newEmployee.skills.map((skill) => (
                  <Chip
                    key={skill}
                    label={skill}
                    onDelete={() => handleDeleteSkill(skill)}
                    color="primary"
                    size="small"
                    sx={{ cursor: "pointer" }}
                  />
                ))}
              </Box>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions sx={{ pr: 3, pb: 2 }}>
          <Button 
          variant="outlined" 
          onClick={handleDialogClose} 
          sx={{ mr: 1,
            backgroundColor: primaryColor,
            color: "white",
            "&:hover": {
              backgroundColor: "#7a53e3",
            },
           }}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleAddEmployee}
            disabled={!isFormValid}
            sx={{ backgroundColor: primaryColor }}
          >
            Add Employee
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AllEmployees;

