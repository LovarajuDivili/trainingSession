import React, { useState, useEffect, useCallback, useContext } from "react";
import {
  Box,
  Typography,
  InputBase,
  IconButton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";
import FolderIcon from "@mui/icons-material/Folder";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";
import CloseIcon from "@mui/icons-material/Close";
import {
  DataGrid,
  type GridColDef,
  type GridSortModel,
} from "@mui/x-data-grid";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";

import Header from "./Header";
import CreateProject from "../pages/CreateNewProject";
import ProjectsList from "../components/ProjectsList";
import type { Project, Employee } from "../common/types";
import { UserContext } from "./Context";

const primaryColor = "#906aff";

const ProjectsLayout: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isFormValid, setIsFormValid] = useState(false);
  const [projects, setProjects] = useState<Project[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [loadingData, setLoadingData] = useState(false);

  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState<Project | null>(null);

  // Employees dialog state
  const [viewEmployeesOpen, setViewEmployeesOpen] = useState(false);
  const [projectEmployees, setProjectEmployees] = useState<Employee[]>([]);
  const [selectedProjectName, setSelectedProjectName] = useState<string>("");
  const [employeeSortModel, setEmployeeSortModel] = useState<GridSortModel>([]);

  const { token, loading } = useContext(UserContext);

  const fetchProjects = useCallback(async () => {
    if (!token) return;
    setLoadingData(true);

    try {
      const res = await fetch("http://localhost:5000/api/projects", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (Array.isArray(data)) {
        setProjects(data);
      } else {
        setProjects([]);
        if (data.message) alert(data.message);
      }
    } catch (err: any) {
      alert("Failed to fetch projects: " + (err.message || err));
    }

    setLoadingData(false);
  }, [token]);

  useEffect(() => {
    if (!loading && token) fetchProjects();
  }, [fetchProjects, token, loading]);

  const handleAddProjectClick = () => setIsAdding(true);
  const handleCloseClick = () => setIsAdding(false);

  const handleFormValidityChange = useCallback(
    (valid: boolean) => setIsFormValid(valid),
    []
  );

  // CREATE
  const handleSaveClick = async (newProject: Project) => {
    if (!token) {
      alert("No token available. Please login again.");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/projects", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newProject),
      });

      if (!response.ok) {
        const error = await response.json();
        alert(error.message || "Failed to add project");
        return;
      }

      setIsAdding(false);
      setSearchTerm("");
      fetchProjects();
    } catch (err: any) {
      alert("Failed to add project: " + (err.message || err));
    }
  };

  // UPDATE
  const handleUpdateProject = async (updatedProject: Project) => {
    if (!token) {
      alert("No token available. Please login again.");
      return;
    }
    if (!updatedProject._id) {
      alert("Project id missing");
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:5000/api/projects/${updatedProject._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(updatedProject),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        alert(error.message || "Failed to update project");
        return;
      }

      const data = await response.json();

      setProjects((current) =>
        current.map((p) => (p._id === data._id ? data : p))
      );
    } catch (err: any) {
      alert("Failed to update project: " + (err.message || err));
    }
  };

  const requestDeleteProject = (project: Project) => {
    setProjectToDelete(project);
    setDeleteConfirmOpen(true);
  };

  const cancelDelete = () => {
    setDeleteConfirmOpen(false);
    setProjectToDelete(null);
  };

  const confirmDelete = async () => {
    if (!token || !projectToDelete || !projectToDelete._id) {
      cancelDelete();
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:5000/api/projects/${projectToDelete._id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        const error = await response.json();
        alert(error.message || "Failed to delete project");
        return;
      }

      setProjects((current) =>
        current.filter((p) => p._id !== projectToDelete._id)
      );
    } catch (err: any) {
      alert("Failed to delete project: " + (err.message || err));
    } finally {
      cancelDelete();
    }
  };

  const filteredProjects = projects.filter((p) => {
    const lower = searchTerm.toLowerCase();
    return (
      p.name.toLowerCase().includes(lower) ||
      p.jiraCode.toString().includes(searchTerm)
    );
  });

  const displayedProjectCount = filteredProjects.length;

  // Employee header sort handler
  const handleEmployeeSort = (field: string, direction: "asc" | "desc") => {
    if (
      employeeSortModel.length === 1 &&
      employeeSortModel[0].field === field
    ) {
      const newSort =
        employeeSortModel[0].sort === direction
          ? []
          : [{ field, sort: direction }];
      setEmployeeSortModel(newSort);
    } else {
      setEmployeeSortModel([{ field, sort: direction }]);
    }
  };

  const employeeColumns: GridColDef[] = [
    {
      field: "id",
      headerName: "ID",
      flex: 0.8,
      sortable: false,
      renderHeader: (params) => {
        const sort = employeeSortModel.find((m) => m.field === params.field);
        return (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              cursor: "pointer",
              fontWeight: "bold",
              gap: 0.5,
              width: "100%",
              justifyContent: "space-between",
              "&:hover svg": { opacity: 1 },
            }}
          >
            <Box sx={{ flex: 1 }}>ID</Box>
            <Box sx={{ display: "flex", gap: 0.25 }}>
              <ArrowUpwardIcon
                onClick={(e) => {
                  e.stopPropagation();
                  handleEmployeeSort(params.field as string, "asc");
                }}
                sx={{
                  fontSize: 16,
                  color: sort?.sort === "asc" ? primaryColor : "#ccc",
                  cursor: "pointer",
                  opacity: 0,
                  transition: "opacity 0.2s ease, transform 0.2s ease",
                  "&:hover": { color: primaryColor, transform: "scale(1.1)" },
                }}
              />
              <ArrowDownwardIcon
                onClick={(e) => {
                  e.stopPropagation();
                  handleEmployeeSort(params.field as string, "desc");
                }}
                sx={{
                  fontSize: 16,
                  color: sort?.sort === "desc" ? primaryColor : "#ccc",
                  cursor: "pointer",
                  opacity: 0,
                  transition: "opacity 0.2s ease, transform 0.2s ease",
                  "&:hover": { color: primaryColor, transform: "scale(1.1)" },
                }}
              />
            </Box>
          </Box>
        );
      },
    },
    {
      field: "name",
      headerName: "Name",
      flex: 1.2,
      sortable: false,
      renderHeader: (params) => {
        const sort = employeeSortModel.find((m) => m.field === params.field);
        return (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              cursor: "pointer",
              fontWeight: "bold",
              gap: 0.5,
              width: "100%",
              justifyContent: "space-between",
              "&:hover svg": { opacity: 1 },
            }}
          >
            <Box sx={{ flex: 1 }}>Name</Box>
            <Box sx={{ display: "flex", gap: 0.25 }}>
              <ArrowUpwardIcon
                onClick={(e) => {
                  e.stopPropagation();
                  handleEmployeeSort(params.field as string, "asc");
                }}
                sx={{
                  fontSize: 16,
                  color: sort?.sort === "asc" ? primaryColor : "#ccc",
                  cursor: "pointer",
                  opacity: 0,
                  transition: "opacity 0.2s ease, transform 0.2s ease",
                  "&:hover": { color: primaryColor, transform: "scale(1.1)" },
                }}
              />
              <ArrowDownwardIcon
                onClick={(e) => {
                  e.stopPropagation();
                  handleEmployeeSort(params.field as string, "desc");
                }}
                sx={{
                  fontSize: 16,
                  color: sort?.sort === "desc" ? primaryColor : "#ccc",
                  cursor: "pointer",
                  opacity: 0,
                  transition: "opacity 0.2s ease, transform 0.2s ease",
                  "&:hover": { color: primaryColor, transform: "scale(1.1)" },
                }}
              />
            </Box>
          </Box>
        );
      },
    },
    {
      field: "role",
      headerName: "Role",
      flex: 1,
      sortable: false,
      renderHeader: (params) => {
        const sort = employeeSortModel.find((m) => m.field === params.field);
        return (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              cursor: "pointer",
              fontWeight: "bold",
              gap: 0.5,
              width: "100%",
              justifyContent: "space-between",
              "&:hover svg": { opacity: 1 },
            }}
          >
            <Box sx={{ flex: 1 }}>Role</Box>
            <Box sx={{ display: "flex", gap: 0.25 }}>
              <ArrowUpwardIcon
                onClick={(e) => {
                  e.stopPropagation();
                  handleEmployeeSort(params.field as string, "asc");
                }}
                sx={{
                  fontSize: 16,
                  color: sort?.sort === "asc" ? primaryColor : "#ccc",
                  cursor: "pointer",
                  opacity: 0,
                  transition: "opacity 0.2s ease, transform 0.2s ease",
                  "&:hover": { color: primaryColor, transform: "scale(1.1)" },
                }}
              />
              <ArrowDownwardIcon
                onClick={(e) => {
                  e.stopPropagation();
                  handleEmployeeSort(params.field as string, "desc");
                }}
                sx={{
                  fontSize: 16,
                  color: sort?.sort === "desc" ? primaryColor : "#ccc",
                  cursor: "pointer",
                  opacity: 0,
                  transition: "opacity 0.2s ease, transform 0.2s ease",
                  "&:hover": { color: primaryColor, transform: "scale(1.1)" },
                }}
              />
            </Box>
          </Box>
        );
      },
    },
    {
      field: "email",
      headerName: "Email",
      flex: 1.5,
      sortable: false,
      renderHeader: (params) => {
        const sort = employeeSortModel.find((m) => m.field === params.field);
        return (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              cursor: "pointer",
              fontWeight: "bold",
              gap: 0.5,
              width: "100%",
              justifyContent: "space-between",
              "&:hover svg": { opacity: 1 },
            }}
          >
            <Box sx={{ flex: 1 }}>Email</Box>
            <Box sx={{ display: "flex", gap: 0.25 }}>
              <ArrowUpwardIcon
                onClick={(e) => {
                  e.stopPropagation();
                  handleEmployeeSort(params.field as string, "asc");
                }}
                sx={{
                  fontSize: 16,
                  color: sort?.sort === "asc" ? primaryColor : "#ccc",
                  cursor: "pointer",
                  opacity: 0,
                  transition: "opacity 0.2s ease, transform 0.2s ease",
                  "&:hover": { color: primaryColor, transform: "scale(1.1)" },
                }}
              />
              <ArrowDownwardIcon
                onClick={(e) => {
                  e.stopPropagation();
                  handleEmployeeSort(params.field as string, "desc");
                }}
                sx={{
                  fontSize: 16,
                  color: sort?.sort === "desc" ? primaryColor : "#ccc",
                  cursor: "pointer",
                  opacity: 0,
                  transition: "opacity 0.2s ease, transform 0.2s ease",
                  "&:hover": { color: primaryColor, transform: "scale(1.1)" },
                }}
              />
            </Box>
          </Box>
        );
      },
    },
    {
      field: "projectName",
      headerName: "Project",
      flex: 1,
      sortable: false,
      renderHeader: (params) => {
        const sort = employeeSortModel.find((m) => m.field === params.field);
        return (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              cursor: "pointer",
              fontWeight: "bold",
              gap: 0.5,
              width: "100%",
              justifyContent: "space-between",
              "&:hover svg": { opacity: 1 },
            }}
          >
            <Box sx={{ flex: 1 }}>Project</Box>
            <Box sx={{ display: "flex", gap: 0.25 }}>
              <ArrowUpwardIcon
                onClick={(e) => {
                  e.stopPropagation();
                  handleEmployeeSort(params.field as string, "asc");
                }}
                sx={{
                  fontSize: 16,
                  color: sort?.sort === "asc" ? primaryColor : "#ccc",
                  cursor: "pointer",
                  opacity: 0,
                  transition: "opacity 0.2s ease, transform 0.2s ease",
                  "&:hover": { color: primaryColor, transform: "scale(1.1)" },
                }}
              />
              <ArrowDownwardIcon
                onClick={(e) => {
                  e.stopPropagation();
                  handleEmployeeSort(params.field as string, "desc");
                }}
                sx={{
                  fontSize: 16,
                  color: sort?.sort === "desc" ? primaryColor : "#ccc",
                  cursor: "pointer",
                  opacity: 0,
                  transition: "opacity 0.2s ease, transform 0.2s ease",
                  "&:hover": { color: primaryColor, transform: "scale(1.1)" },
                }}
              />
            </Box>
          </Box>
        );
      },
    },
  ];

  const handleViewProjectEmployees = async (project: Project) => {
    if (!token) {
      alert("No token available. Please login again.");
      return;
    }

    const projectName = project.name;
    setSelectedProjectName(projectName);

    try {
      const res = await fetch(
        `http://localhost:5000/api/employees/project/${encodeURIComponent(
          projectName
        )}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        alert(data.message || "Failed to fetch employees for this project");
        return;
      }

      const data: Employee[] = await res.json();
      setProjectEmployees(data);
      setEmployeeSortModel([]);
      setViewEmployeesOpen(true);
    } catch (err: any) {
      alert("Failed to fetch employees: " + (err.message || err));
    }
  };

  if (loading) {
    return (
      <Box sx={{ p: 4, textAlign: "center" }}>
        <Typography variant="h6">Loading...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ flexGrow: 1, minHeight: "100vh", bgcolor: "#f8f9fa" }}>
      <Header onMenuClick={() => {}} />

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          mb: 2,
          px: 2,
          pt: 1,
          alignItems: "center",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <FolderIcon sx={{ color: "black" }} />
          <Typography sx={{ fontSize: 22, fontWeight: "bold", color: "black" }}>
            Projects ({displayedProjectCount})
          </Typography>
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              backgroundColor: "#fff",
              border: "1px solid #e2e2e2",
              borderRadius: "999px",
              px: 2,
              height: 44,
              minWidth: 420,
              boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
              "&:focus-within": { borderColor: primaryColor },
            }}
          >
            <SearchIcon sx={{ color: "#b3b3b3", mr: 1 }} />
            <InputBase
              placeholder="Search by Name or Jira Code..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              sx={{
                flex: 1,
                fontSize: 14,
                "&::placeholder": { color: "#b3b3b3", opacity: 1 },
              }}
            />
            {searchTerm && (
              <IconButton
                size="small"
                onClick={() => setSearchTerm("")}
                sx={{ color: "#b3b3b3" }}
              >
                <ClearIcon fontSize="small" />
              </IconButton>
            )}
          </Box>

          <Button
            variant="contained"
            onClick={handleAddProjectClick}
            sx={{
              backgroundColor: primaryColor,
              borderRadius: "999px",
              px: 3.5,
              height: 44,
              textTransform: "none",
              fontWeight: 500,
              fontSize: 15,
              boxShadow: "0px 4px 10px rgba(144,106,255,0.35)",
              "&:hover": { backgroundColor: "#7a53e3", boxShadow: "none" },
            }}
          >
            Add Project +
          </Button>
        </Box>
      </Box>

      <Box sx={{ borderBottom: "1px solid #ddd", mb: 2 }} />

      <Box sx={{ px: 2 }}>
        {loadingData ? (
          <Typography sx={{ mt: 4, color: "#777" }}>Loading...</Typography>
        ) : (
          <ProjectsList
            showGrid={false}
            projects={filteredProjects}
            loading={false}
            onToggleView={() => {}}
            onEditProject={handleUpdateProject}
            onDeleteProject={requestDeleteProject}
            onViewProjectEmployees={handleViewProjectEmployees}
          />
        )}
      </Box>

      <Dialog
        open={isAdding}
        onClose={handleCloseClick}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle sx={{ pr: 6 }}>
          Add New Project
          <IconButton
            onClick={handleCloseClick}
            sx={{
              position: "absolute",
              right: 12,
              top: 12,
              color: "#555",
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <Box sx={{ borderBottom: "1px solid #e0e0e0", mx: 3 }} />

        <DialogContent>
          <CreateProject
            onValidityChange={handleFormValidityChange}
            onSave={handleSaveClick}
          />
        </DialogContent>

        <Box sx={{ borderTop: "1px solid #e0e0e0", mx: 3 }} />

        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            gap: 2,
            px: 3,
            py: 2,
          }}
        >
          <Button
            onClick={handleCloseClick}
            sx={{
              background: "#9462ff",
              color: "white",
              borderRadius: "30px",
              px: 4,
              py: 1,
              textTransform: "none",
              "&:hover": { background: "#8352ef" },
            }}
          >
            Cancel
          </Button>

          <Button
            onClick={() => {
              document
                .querySelector("form")
                ?.dispatchEvent(
                  new Event("submit", { cancelable: true, bubbles: true })
                );
            }}
            disabled={!isFormValid}
            sx={{
              background: !isFormValid ? "#e3e3e3" : "#9462ff",
              color: !isFormValid ? "#a0a0a0" : "white",
              borderRadius: "30px",
              px: 4,
              py: 1,
              textTransform: "none",
              cursor: !isFormValid ? "not-allowed" : "pointer",
              boxShadow: !isFormValid ? "none" : "0px 3px 8px rgba(0,0,0,0.24)",
              "&:hover": {
                background: !isFormValid ? "#e3e3e3" : "#8352ef",
              },
            }}
          >
            Add Project
          </Button>
        </Box>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteConfirmOpen} onClose={cancelDelete}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete{" "}
            <strong>{projectToDelete?.name ?? "this project"}</strong>?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={cancelDelete}
            sx={{
              color: "#906aff",
              textTransform: "none",
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={confirmDelete}
            variant="contained"
            sx={{
              backgroundColor: "#906aff",
              color: "#fff",
              textTransform: "none",
              borderRadius: "8px",
              boxShadow: "none",
              "&:hover": {
                backgroundColor: "#7a53e3",
              },
            }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Employees for Project Dialog */}
      <Dialog
        open={viewEmployeesOpen}
        onClose={() => setViewEmployeesOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle sx={{ pr: 6 }}>
          <Typography fontSize="18px" fontWeight="bold">
            Employees – {selectedProjectName}
          </Typography>
          <IconButton
            onClick={() => setViewEmployeesOpen(false)}
            sx={{
              position: "absolute",
              right: 12,
              top: 12,
              color: "#555",
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent>
          <Box
            sx={{
              mt: 1,
              mb: 1,
              bgcolor: "#ffffff",
              borderRadius: 2,
              boxShadow: "0 1px 3px rgba(0,0,0,0.12)",
              border: "1px solid #e0e0e0",
              display: "flex",
              flexDirection: "column",
              height: 400,
            }}
          >
            <DataGrid
              rows={projectEmployees}
              columns={employeeColumns}
              getRowId={(row) => row.id}
              pageSizeOptions={[5, 10, 20]}
              initialState={{
                pagination: { paginationModel: { pageSize: 5, page: 0 } },
              }}
              sortingMode="server"
              sortModel={employeeSortModel}
              onSortModelChange={setEmployeeSortModel}
              disableRowSelectionOnClick
              disableColumnMenu
              sx={{
                border: "none",
                flexGrow: 1,
                "& .MuiDataGrid-columnHeader": {
                  backgroundColor: "#eef3f7 !important",
                  borderBottom: "1px solid #e5e7eb",
                  minHeight: 48,
                  maxHeight: 48,
                  fontWeight: "bold",
                  borderRight: "1px solid #dde3ea",
                },
                "& .MuiDataGrid-columnSeparator": {
                  display: "none",
                },
                "& .MuiDataGrid-cell": {
                  borderBottom: "1px solid #f1f1f1",
                  fontSize: "0.875rem",
                  color: "#374151",
                  padding: "10px 16px",
                  "&:focus, &:focus-within": { outline: "none" },
                },
                "& .MuiDataGrid-virtualScroller": {
                  backgroundColor: "#ffffff",
                  overflowY: "auto !important",
                },
              }}
            />
          </Box>
        </DialogContent>

        <DialogActions
          sx={{
            px: 3,
            pb: 2.5,
            pt: 1,
            justifyContent: "flex-end",
          }}
        >
          <Button
            onClick={() => setViewEmployeesOpen(false)}
            sx={{
              background: "#9462ff",
              color: "white",
              borderRadius: "30px",
              px: 4,
              py: 0.8,
              textTransform: "none",
              fontWeight: 500,
              "&:hover": { background: "#8352ef" },
            }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ProjectsLayout;
