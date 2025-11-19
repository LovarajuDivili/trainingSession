import { useState, useEffect } from "react";
import {
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
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
import { deleteProjectAPI, fetchProjects } from "../../store/ProjectsSlice";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import CloseIcon from "@mui/icons-material/Close";
import NoData from "../../common/noData";
import type { Project } from "../../common/types";
//import { colors } from "../../common/colorConstants";
import { useThemeColors } from "../../hooks/useThemeColors";

const CustomNoRowsOverlay = () => {
  const colors = useThemeColors();
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
        backgroundColor: colors.background.card, // Add theme background
        color: colors.text.primary,
      }}
    >
      <NoData
        imageSrc="/public/no_data_image.jpg"
        altText="No projects"
        message="No projects found"
      />
    </Box>
  );
};

const Projects = () => {
  const [searchText, setSearchText] = useState("");
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const colors = useThemeColors();
  const { projects, loading } = useAppSelector((state) => state.projects);

  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState<string | null>(null);
  const [confirmChecked, setConfirmChecked] = useState(false);

  useEffect(() => {
    dispatch(fetchProjects());
  }, [dispatch]);

  const filteredProjects = projects.filter(
    (proj: { projectName: string; jiraId: string }) =>
      proj.projectName.toLowerCase().includes(searchText.toLowerCase()) ||
      proj.jiraId.toLowerCase().includes(searchText.toLowerCase())
  );

  const isProjectCompleted = (endDate: string): boolean => {
    if (!endDate) return false;
    const today = new Date();
    const projectEndDate = new Date(endDate);

    today.setHours(0, 0, 0, 0);
    projectEndDate.setHours(0, 0, 0, 0);
    return projectEndDate < today;
  };

  const handleEditProject = (project: Project) => {
    navigate("/admin/projects/add", {
      state: { isEditing: true, projectData: project },
    });
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
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error("Error deleting project:", error.message);
        alert(error.message || "⚠️ Failed to delete project");
      } else {
        console.error("Unexpected error:", error);
        alert("⚠️ Failed to delete project");
      }
    }
  };

  const handleCancelDelete = () => {
    setDeleteConfirmOpen(false);
    setProjectToDelete(null);
    setConfirmChecked(false);
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
                ? colors.status.success
                : params.value === "InProgress"
                ? colors.status.warning
                : params.value === "InActive"
                ? colors.status.error
                : colors.background.disabled,
            color: colors.text.white,
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
    {
      field: "startDate",
      headerName: "Start Date",
      flex: 1,
      renderCell: (params) => {
        const isCompleted = isProjectCompleted(params.row.endDate);
        return (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              height: "100%",
            }}
          >
            <Typography
              sx={{
                color: isCompleted ? colors.status.error : colors.text.primary,
                fontWeight: isCompleted ? 400 : 200,
                lineHeight: 1.5,
                fontSize: "0.875rem",
              }}
            >
              {params.value}
            </Typography>
          </Box>
        );
      },
    },
    {
      field: "endDate",
      headerName: "End Date",
      flex: 1,
      renderCell: (params) => {
        const isCompleted = isProjectCompleted(params.row.endDate);
        return (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              height: "100%",
            }}
          >
            <Typography
              sx={{
                color: isCompleted ? colors.status.error : colors.text.primary,
                fontWeight: isCompleted ? 400 : 200,
                lineHeight: 1.5,
                fontSize: "0.875rem",
              }}
            >
              {params.value}
            </Typography>
          </Box>
        );
      },
    },
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
        <Typography sx={{ color: colors.text.primary }}>
          {Loading.LOADING}
        </Typography>
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
            slots={{
              noRowsOverlay: CustomNoRowsOverlay,
            }}
            getRowClassName={(params) =>
              isProjectCompleted(params.row.endDate) ? "completed-project" : ""
            }
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

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteConfirmOpen}
        onClose={handleCancelDelete}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            backgroundColor: colors.background.card,
            color: colors.text.primary,
          },
        }}
      >
        <DialogTitle
          sx={{
            fontSize: "20px",
            fontWeight: 600,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            color: colors.text.primary,
            backgroundColor: colors.background.card,
          }}
        >
          Confirm Delete
          <IconButton
            onClick={handleCancelDelete}
            size="small"
            sx={{
              backgroundColor: colors.background.lightGray,
              color: colors.ui.button.delete,
              "&:hover": {
                backgroundColor: colors.status.error,
                color: colors.text.white,
              },
              width: 28,
              height: 28,
              borderRadius: "50%",
            }}
          >
            <CloseIcon sx={{ fontSize: "18px" }} />
          </IconButton>
        </DialogTitle>
        <Divider sx={{ mb: 1 }} />
        <DialogContent sx={{ backgroundColor: colors.background.card }}>
          <Typography sx={{ mb: 1, color: colors.text.primary }}>
            Are you sure you want to delete project -{" "}
            <strong>
              {projects.find((proj) => proj.id === projectToDelete)
                ?.projectName || ""}
            </strong>
            ? This action cannot be undone.
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Checkbox
              id="confirm-delete-project"
              checked={confirmChecked}
              onChange={(e) => setConfirmChecked(e.target.checked)}
              size="small"
              sx={{
                color: colors.ui.checkbox,
                "&.Mui-checked": {
                  color: colors.ui.checkbox,
                },
              }}
            />
            <Typography
              component="label"
              htmlFor="confirm-delete-project"
              sx={{ cursor: "pointer", color: colors.text.primary }}
            >
              Yes, I want to delete project -{" "}
              <strong>
                {projects.find((proj) => proj.id === projectToDelete)
                  ?.projectName || ""}
              </strong>
            </Typography>
          </Box>
        </DialogContent>
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            gap: 2,
            p: 2,
            backgroundColor: colors.background.card,
          }}
        >
          <Button
            variant="outlined"
            onClick={handleCancelDelete}
            sx={{
              color: colors.text.gray,
              borderColor: colors.text.gray,
              textTransform: "uppercase",
              "&:hover": {
                borderColor: colors.primary.main,
                color: colors.primary.main,
              },
            }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleConfirmDelete}
            disabled={!confirmChecked}
            sx={{
              backgroundColor: colors.ui.button.delete,
              textTransform: "uppercase",
              "&:hover": {
                backgroundColor: colors.status.error,
              },
              "&:disabled": {
                backgroundColor: colors.background.disabled,
                color: colors.text.disabled,
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
