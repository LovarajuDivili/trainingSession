/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import {
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Typography,
} from "@mui/material";
import {
  DataGrid,
  type GridColDef,
  type GridRenderCellParams,
} from "@mui/x-data-grid";
import { useNavigate } from "react-router-dom";
import { Loading } from "../../common/labelConstants";
import DashboardHeader from "../DashboardHeader";
import { sidebarItems } from "../../common/sidebarItems";
import { useAppDispatch, useAppSelector } from "../../hooks/reduxHooks";
import {
  deleteProjectAPI,
  fetchProjects,
  type Project,
} from "../../store/ProjectsSlice";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddProject from "../ExtraComponents/AddProject";

const Projects = () => {
  const [searchText, setSearchText] = useState("");
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { projects, loading } = useAppSelector((state) => state.projects);
  const [openDialog, setOpenDialog] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState<string | null>(null);
  const [confirmChecked, setConfirmChecked] = useState(false);
  const [currentProject, setCurrentProject] = useState<Project | null>(null);

  useEffect(() => {
    dispatch(fetchProjects());
  }, [dispatch]);

  const filteredProjects = projects.filter(
    (proj) =>
      proj.projectName.toLowerCase().includes(searchText.toLowerCase()) ||
      proj.jiraId.toLowerCase().includes(searchText.toLowerCase())
  );

  const handleOpenEditDialog = (project: Project) => {
    setCurrentProject(project);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setCurrentProject(null);
  };

  const handleEditProject = (project: Project) => {
    handleOpenEditDialog(project);
  };

  const handleDeleteProject = async (projectId: string) => {
    setProjectToDelete(projectId);
    setDeleteConfirmOpen(true);
    setConfirmChecked(false);
  };

  const handleConfirmDelete = async () => {
    if (!projectToDelete) return;

    try {
      await dispatch(deleteProjectAPI(projectToDelete)).unwrap();
      dispatch(fetchProjects());
      setDeleteConfirmOpen(false);
      setProjectToDelete(null);
      setConfirmChecked(false);
    } catch (error: any) {
      console.error("Error deleting project:", error);
      alert(error?.detail || "⚠️ Failed to delete project");
    }
  };

  const handleCancelDelete = () => {
    setDeleteConfirmOpen(false);
    setProjectToDelete(null);
    setConfirmChecked(false);
  };

  const handleEditSuccess = () => {
    dispatch(fetchProjects());
    handleCloseDialog();
  };

  const columns: GridColDef[] = [
    { field: "projectName", headerName: "Project Name", flex: 1.5 },
    { field: "projectOwner", headerName: "Project Owner", flex: 1.2 },
    { field: "jiraId", headerName: "Jira ID", flex: 1 },
    {
      field: "status",
      headerName: "Status",
      flex: 1,
      renderCell: (params) => (
        <Button
          variant="contained"
          size="small"
          sx={{
            backgroundColor:
              params.value === "Active"
                ? "#47be4bff"
                : params.value === "InProgress"
                ? "#e1aa2aff"
                : params.value === "InActive"
                ? "#e12a2aff"
                : null,
            color: "white",
            textTransform: "none",
            fontWeight: 600,
            borderRadius: "20px",
            width: "80px",
          }}
        >
          {params.value}
        </Button>
      ),
    },
    { field: "startDate", headerName: "Start Date", flex: 1 },
    { field: "endDate", headerName: "End Date", flex: 1 },
    {
      field: "actions",
      headerName: "Actions",
      flex: 1,
      sortable: false,
      filterable: false,
      renderCell: (params: GridRenderCellParams<Project>) => (
        <Box>
          <IconButton
            color="primary"
            onClick={() => handleEditProject(params.row)}
          >
            <EditIcon />
          </IconButton>
          <IconButton
            color="error"
            onClick={() => handleDeleteProject(params.row.id)}
          >
            <DeleteIcon />
          </IconButton>
        </Box>
      ),
    },
  ];

  const currentItem = sidebarItems.find(
    (item) => item.route === "/admin/projects"
  );

  return (
    <Box>
      <DashboardHeader
        title={currentItem?.label || "Projects"}
        icon={currentItem?.icon}
        count={filteredProjects.length}
        showSearch
        searchText={searchText}
        onSearchChange={setSearchText}
        showAddButton
        addButtonLabel="Add New"
        onAddClick={() => navigate("/admin/projects/add")}
      />

      {loading ? (
        <Typography>{Loading.LOADING}</Typography>
      ) : (
        <Box sx={{ height: "calc(97vh - 150px)", width: "100%" }}>
          <DataGrid
            rows={filteredProjects}
            columns={columns}
            getRowId={(row) => row.id}
            pageSizeOptions={[5, 10, 20]}
            initialState={{
              pagination: { paginationModel: { pageSize: 10, page: 0 } },
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
      <AddProject
        open={openDialog}
        onClose={handleCloseDialog}
        project={currentProject}
        isEditing={true}
        onSuccess={handleEditSuccess}
      />

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteConfirmOpen}
        onClose={handleCancelDelete}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ fontSize: "20px", fontWeight: 600 }}>
          Confirm Delete
        </DialogTitle>
        <DialogContent>
          <Typography sx={{ mb: 2 }}>
            Are you sure you want to delete this project? This action cannot be
            undone.
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Checkbox
              id="confirm-delete-project"
              checked={confirmChecked}
              onChange={(e) => setConfirmChecked(e.target.checked)}
              size="small"
            />
            <Typography
              component="label"
              htmlFor="confirm-delete-project"
              sx={{ cursor: "pointer" }}
            >
              Yes, I want to delete this project
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
    </Box>
  );
};

export default Projects;
