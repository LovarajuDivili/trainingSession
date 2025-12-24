import React, { useState } from "react";
import {
  Box,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Card,
  CardContent,
  TextField,
  Link,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  DataGrid,
  type GridRenderCellParams,
  type GridSortModel,
  type GridColDef,
} from "@mui/x-data-grid";
import type { Project } from "../common/types";
import EditProjectDialog from "./EditProjectDialog";

const primaryColor = "#906aff";
const pageSizeOptions = [5, 10, 20, 50];

interface Props {
  projects: Project[];
  loading?: boolean;
  showGrid: boolean;
  onToggleView: () => void;
  onEditProject?: (project: Project) => void;
  onDeleteProject?: (project: Project) => void;
  onViewProjectEmployees?: (project: Project) => void;
}

const ProjectsList: React.FC<Props> = ({
  projects,
  loading,
  showGrid,
  onToggleView,
  onEditProject,
  onDeleteProject,
  onViewProjectEmployees,
}) => {
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 });
  const [sortModel, setSortModel] = useState<GridSortModel>([]);
  const [menuAnchorEl, setMenuAnchorEl] = useState<HTMLElement | null>(null);
  const [menuRow, setMenuRow] = useState<Project | null>(null);

  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editProject, setEditProject] = useState<Project | null>(null);

  const formatDate = (dateStr?: string | null) => {
    if (!dateStr) return "-";
    return String(dateStr).split("T")[0];
  };

  const applySorting = (list: Project[], model: GridSortModel): Project[] => {
    if (model.length === 0) return list;
    const { field, sort } = model[0];

    return [...list].sort((a, b) => {
      const aRaw = a[field as keyof Project];
      const bRaw = b[field as keyof Project];

      if (aRaw == null) return 1;
      if (bRaw == null) return -1;

      if (field === "startDate" || field === "endDate") {
        const aDate = new Date(aRaw as string);
        const bDate = new Date(bRaw as string);
        if (isNaN(aDate.getTime())) return 1;
        if (isNaN(bDate.getTime())) return -1;
        return sort === "asc"
          ? aDate.getTime() - bDate.getTime()
          : bDate.getTime() - aDate.getTime();
      }

      if (typeof aRaw === "string" && typeof bRaw === "string") {
        return sort === "asc"
          ? aRaw.localeCompare(bRaw)
          : bRaw.localeCompare(aRaw);
      }

      return 0;
    });
  };

  const sortedProjects = applySorting(projects, sortModel);
  const totalProjects = sortedProjects.length;
  const totalPages = Math.max(1, Math.ceil(totalProjects / paginationModel.pageSize));
  const pagedProjects = sortedProjects.slice(
    paginationModel.page * paginationModel.pageSize,
    (paginationModel.page + 1) * paginationModel.pageSize
  );

  const handleRowMenuOpen = (event: React.MouseEvent<HTMLElement>, row: Project) => {
    setMenuAnchorEl(event.currentTarget);
    setMenuRow(row);
  };

  const handleRowMenuClose = () => {
    setMenuAnchorEl(null);
    setMenuRow(null);
  };

  const handleEditClick = (project: Project) => {
    setEditProject(project);
    setEditDialogOpen(true);
  };

  const handleEditSave = (updatedProject: Project) => {
    if (onEditProject) {
      onEditProject(updatedProject);
    }
    setEditDialogOpen(false);
    setEditProject(null);
  };

  const handleEditClose = () => {
    setEditDialogOpen(false);
    setEditProject(null);
  };

  const handleRowEdit = () => {
    if (menuRow) {
      handleEditClick(menuRow);
    }
    handleRowMenuClose();
  };

  const handleRowDelete = () => {
    if (menuRow && onDeleteProject) onDeleteProject(menuRow);
    handleRowMenuClose();
  };

  const handleSort = (field: string, direction: "asc" | "desc") => {
    if (sortModel.length === 1 && sortModel[0].field === field) {
      const newSort =
        sortModel[0].sort === direction ? [] : [{ field, sort: direction }];
      setSortModel(newSort);
    } else {
      setSortModel([{ field, sort: direction }]);
    }
    setPaginationModel((m) => ({ ...m, page: 0 }));
  };

  const CustomFooter = () => {
    const from =
      totalProjects === 0 ? 0 : paginationModel.page * paginationModel.pageSize + 1;
    const to = Math.min(
      (paginationModel.page + 1) * paginationModel.pageSize,
      totalProjects
    );

    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          alignItems: "center",
          px: 3,
          py: 1.5,
          borderTop: "1px solid #e3e3e3",
          background: "#fafafa",
          gap: 3,
        }}
      >
        <Typography sx={{ fontSize: "0.875rem", color: "#555" }}>
          Rows per page:
        </Typography>
        <TextField
          select
          size="small"
          value={paginationModel.pageSize}
          onChange={(e) =>
            setPaginationModel({ page: 0, pageSize: Number(e.target.value) })
          }
          sx={{ width: 70, "& .MuiOutlinedInput-input": { padding: "4px 8px" } }}
        >
          {pageSizeOptions.map((size) => (
            <MenuItem key={size} value={size}>
              {size}
            </MenuItem>
          ))}
        </TextField>
        <Typography sx={{ fontSize: "0.875rem", color: "#555" }}>
          {from}-{to} of {totalProjects}
        </Typography>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <IconButton
            size="small"
            disabled={paginationModel.page === 0}
            onClick={() =>
              setPaginationModel((m) => ({ ...m, page: m.page - 1 }))
            }
            sx={{
              border: "1px solid #e0e0e0",
              borderRadius: "50%",
              "&:disabled": { opacity: 0.3 },
            }}
          >
            <ArrowBackIcon fontSize="small" />
          </IconButton>
          <IconButton
            size="small"
            disabled={paginationModel.page >= totalPages - 1}
            onClick={() =>
              setPaginationModel((m) => ({ ...m, page: m.page + 1 }))
            }
            sx={{
              border: "1px solid #e0e0e0",
              borderRadius: "50%",
              "&:disabled": { opacity: 0.3 },
            }}
          >
            <ArrowForwardIcon fontSize="small" />
          </IconButton>
        </Box>
      </Box>
    );
  };

  if (loading) {
    return <Typography sx={{ mt: 4, color: "#777" }}>Loading...</Typography>;
  }

  if (projects.length === 0) {
    return <Typography sx={{ mt: 4, color: "#777" }}>No projects found.</Typography>;
  }

  const columns: GridColDef<Project>[] = [
    {
      field: "name",
      headerName: "Project Name",
      flex: 1.2,
      sortable: false,
      renderHeader: (params) => {
        const sort = sortModel.find((m) => m.field === params.field);
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
            <Box sx={{ flex: 1 }}>Project Name</Box>
            <Box sx={{ display: "flex", gap: 0.25 }}>
              <ArrowUpwardIcon
                onClick={(e) => {
                  e.stopPropagation();
                  handleSort(params.field as string, "asc");
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
                  handleSort(params.field as string, "desc");
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
      field: "jiraCode",
      headerName: "Jira Code",
      width: 120,
      sortable: false,
      renderHeader: (params) => {
        const sort = sortModel.find((m) => m.field === params.field);
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
            <Box sx={{ flex: 1 }}>Jira Code</Box>
            <Box sx={{ display: "flex", gap: 0.25 }}>
              <ArrowUpwardIcon
                onClick={(e) => {
                  e.stopPropagation();
                  handleSort(params.field as string, "asc");
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
                  handleSort(params.field as string, "desc");
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
      field: "status",
      headerName: "Status",
      flex: 1,
      sortable: false,
      renderHeader: (params) => {
        const sort = sortModel.find((m) => m.field === params.field);
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
            <Box sx={{ flex: 1 }}>Status</Box>
            <Box sx={{ display: "flex", gap: 0.25 }}>
              <ArrowUpwardIcon
                onClick={(e) => {
                  e.stopPropagation();
                  handleSort(params.field as string, "asc");
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
                  handleSort(params.field as string, "desc");
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
      field: "startDate",
      headerName: "Start Date",
      flex: 1,
      sortable: false,
      renderCell: (params: GridRenderCellParams<Project>) =>
        formatDate(params.value as string | undefined),
      renderHeader: (params) => {
        const sort = sortModel.find((m) => m.field === params.field);
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
            <Box sx={{ flex: 1 }}>Start Date</Box>
            <Box sx={{ display: "flex", gap: 0.25 }}>
              <ArrowUpwardIcon
                onClick={(e) => {
                  e.stopPropagation();
                  handleSort(params.field as string, "asc");
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
                  handleSort(params.field as string, "desc");
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
      field: "endDate",
      headerName: "End Date",
      flex: 1,
      sortable: false,
      renderCell: (params: GridRenderCellParams<Project>) =>
        formatDate(params.value as string | undefined),
      renderHeader: (params) => {
        const sort = sortModel.find((m) => m.field === params.field);
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
            <Box sx={{ flex: 1 }}>End Date</Box>
            <Box sx={{ display: "flex", gap: 0.25 }}>
              <ArrowUpwardIcon
                onClick={(e) => {
                  e.stopPropagation();
                  handleSort(params.field as string, "asc");
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
                  handleSort(params.field as string, "desc");
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
      field: "view",
      headerName: "View",
      width: 80,
      sortable: false,
      renderCell: (params: GridRenderCellParams<Project>) => (
        <Link
          component="button"
          variant="body2"
          underline="hover"
          sx={{
            fontWeight: "bold",
            cursor: onViewProjectEmployees ? "pointer" : "default",
            width: "100%",
            textAlign: "center",
            color: primaryColor,
            backgroundColor: "transparent",
            padding: 0,
            minWidth: 0,
            border: "none",
            textTransform: "none",
            fontSize: "1rem",
            "&:hover": {
              color: "#7a51d9",
              textDecoration: "underline",
              backgroundColor: "transparent",
            },
            "&:focus": {
              outline: "none",
              textDecoration: "underline",
            },
          }}
          onClick={() => {
            if (onViewProjectEmployees) {
              onViewProjectEmployees(params.row);
            }
          }}
        >
          View
        </Link>
      ),
      renderHeader: () => (
        <Typography sx={{ fontWeight: "bold", textAlign: "center" }}>
          View
        </Typography>
      ),
    },
    {
      field: "actions",
      headerName: "",
      sortable: false,
      filterable: false,
      flex: 0.3,
      renderCell: (params: GridRenderCellParams<Project>) => (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
          }}
        >
          <IconButton
            size="small"
            onClick={(e) => handleRowMenuOpen(e, params.row)}
            aria-label="actions"
          >
            <MoreVertIcon fontSize="small" />
          </IconButton>
        </Box>
      ),
    },
  ];

  return (
    <Box
      sx={{
        flexGrow: 1,
        minHeight: "0px",
        display: "flex",
        flexDirection: "column",
        overflowY: "auto",
      }}
    >
      {!showGrid ? (
        <Box
          sx={{
            flexGrow: 1,
            bgcolor: "white",
            borderRadius: 2,
            boxShadow: "0 1px 3px rgba(0,0,0,0.12)",
            border: "1px solid #e0e0e0",
            display: "flex",
            flexDirection: "column",
            height: "calc(100vh - 260px)",
            minHeight: 300,
          }}
        >
          <DataGrid
            rows={pagedProjects}
            columns={columns}
            getRowId={(row: Project, index: number) =>
              row._id ?? row.id ?? `row-${index}`
            }
            paginationModel={paginationModel}
            rowCount={totalProjects}
            onPaginationModelChange={setPaginationModel}
            pageSizeOptions={pageSizeOptions}
            paginationMode="server"
            sortingMode="server"
            sortModel={sortModel}
            onSortModelChange={setSortModel}
            showColumnVerticalBorder
            sx={{
              border: "none",
              flexGrow: 1,
              "& .MuiDataGrid-columnHeader": {
                backgroundColor: "#eef3f7 !important",
                borderBottom: "1px solid #e5e7eb",
                minHeight: 48,
                maxHeight: 48,
              },
              "& .Mui-row": {
                backgroundColor: "#ffffff",
                width: "100%",
                "&:hover": { backgroundColor: "#f9fafb" },
                "&:last-child .Mui-cell": {
                  borderBottom: "none",
                },
              },
              "& .MuiDataGrid-columnSeparator": { display: "none" },
              "& .MuiDataGrid-cell": {
                borderBottom: "1px solid #f1f1f1",
                fontSize: "0.875rem",
                color: "#374151",
                padding: "10px 16px",
                "&:focus, &:focus-within": { outline: "none" },
              },
              '& .MuiDataGrid-columnHeader[data-field="view"]': {
                borderRight: "none",
              },
              "& .MuiDataGrid-virtualScroller": {
                backgroundColor: "#ffffff",
                overflowY: "auto !important",
              },
              "& .MuiDataGrid-topContainer": { borderBottom: "none" },
            }}
            disableRowSelectionOnClick
            disableColumnMenu
            slots={{ footer: CustomFooter }}
          />
        </Box>
      ) : (
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "repeat(auto-fill, minmax(280px, 1fr))",
            },
            gap: 3,
            justifyContent: "start",
            maxHeight: "calc(100vh - 260px)",
            overflowY: "auto",
            px: 2,
            py: 1,
          }}
        >
          {projects.map((project, index) => (
            <Card
              key={project._id ?? project.id ?? `row-${index}`}
              elevation={2}
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                p: 2,
                borderRadius: 2,
                minHeight: 160,
                boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                transition: "transform 0.2s ease, box-shadow 0.2s ease",
                "&:hover": {
                  transform: "translateY(-4px)",
                  boxShadow: "0 4px 16px rgba(0,0,0,0.12)",
                },
              }}
            >
              <CardContent sx={{ p: 0 }}>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  {project.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Jira Code: {project.jiraCode}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Status: {project.status}
                </Typography>
                {project.startDate && (
                  <Typography variant="body2" color="text.secondary">
                    Start: {formatDate(project.startDate)}
                  </Typography>
                )}
                {project.endDate && (
                  <Typography variant="body2" color="text.secondary">
                    End: {formatDate(project.endDate)}
                  </Typography>
                )}
                <Link
                  component="button"
                  variant="body2"
                  underline="hover"
                  sx={{
                    fontWeight: "bold",
                    color: primaryColor,
                    padding: 0,
                    backgroundColor: "transparent",
                    border: "none",
                    cursor: onViewProjectEmployees ? "pointer" : "default",
                    fontSize: "1rem",
                    mt: 1,
                    display: "inline-block",
                    "&:hover": {
                      color: "#7a51d9",
                      textDecoration: "underline",
                      backgroundColor: "transparent",
                    },
                    "&:focus": {
                      outline: "none",
                      textDecoration: "underline",
                    },
                  }}
                  onClick={() => {
                    if (onViewProjectEmployees) {
                      onViewProjectEmployees(project);
                    }
                  }}
                >
                  View
                </Link>
              </CardContent>
              <Box sx={{ textAlign: "right", pt: 1 }}>
                <IconButton
                  size="small"
                  onClick={(e) => handleRowMenuOpen(e, project)}
                  aria-label="actions"
                >
                  <MoreVertIcon fontSize="small" />
                </IconButton>
              </Box>
            </Card>
          ))}
        </Box>
      )}

      <Menu
        anchorEl={menuAnchorEl}
        open={Boolean(menuAnchorEl)}
        onClose={handleRowMenuClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <MenuItem onClick={handleRowEdit}>
          <ListItemIcon>
            <EditIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Edit</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleRowDelete}>
          <ListItemIcon>
            <DeleteIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Delete</ListItemText>
        </MenuItem>
      </Menu>

      <EditProjectDialog
        open={editDialogOpen}
        project={editProject}
        onClose={handleEditClose}
        onSave={handleEditSave}
      />
    </Box>
  );
};

export default ProjectsList;
