
import React, { useState } from "react";
import {
  Box,
  Typography,
  IconButton,
  Card,
  CardContent,
  TextField,
  Link,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  DataGrid,
  GridActionsCellItem,
  type GridSortModel,
  type GridColDef,
} from "@mui/x-data-grid";
import type { Project } from "../common/types";
import EditProjectDialog from "./ProjectDialog";

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
  onEditProject,
  onDeleteProject,
  onViewProjectEmployees,
}) => {
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });
  const [sortModel, setSortModel] = useState<GridSortModel>([]);

  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editProject, setEditProject] = useState<Project | null>(null);

  const formatDate = (dateStr?: string | null) =>
    dateStr ? String(dateStr).split("T")[0] : "-";

  const applySorting = (list: Project[], model: GridSortModel): Project[] => {
    if (model.length === 0) return list;
    const { field, sort } = model[0];

    return [...list].sort((a, b) => {
      const aVal = a[field as keyof Project];
      const bVal = b[field as keyof Project];

      if (aVal == null) return 1;
      if (bVal == null) return -1;

      if (field === "startDate" || field === "endDate") {
        return sort === "asc"
          ? new Date(aVal as string).getTime() -
              new Date(bVal as string).getTime()
          : new Date(bVal as string).getTime() -
              new Date(aVal as string).getTime();
      }

      if (typeof aVal === "string" && typeof bVal === "string") {
        return sort === "asc"
          ? aVal.localeCompare(bVal)
          : bVal.localeCompare(aVal);
      }

      return 0;
    });
  };

  const sortedProjects = applySorting(projects, sortModel);
  const totalProjects = sortedProjects.length;

  const pagedProjects = sortedProjects.slice(
    paginationModel.page * paginationModel.pageSize,
    (paginationModel.page + 1) * paginationModel.pageSize
  );

  const handleEditClick = (project: Project) => {
    setEditProject(project);
    setEditDialogOpen(true);
  };

  const handleDeleteClick = (project: Project) => {
    onDeleteProject?.(project);
  };

  const CustomFooter = () => {
    const from =
      totalProjects === 0
        ? 0
        : paginationModel.page * paginationModel.pageSize + 1;
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
        <Typography sx={{ fontSize: 14 }}>Rows per page</Typography>
        <TextField
          select
          size="small"
          value={paginationModel.pageSize}
          onChange={(e) =>
            setPaginationModel({ page: 0, pageSize: Number(e.target.value) })
          }
          sx={{ width: 70 }}
        >
          {pageSizeOptions.map((size) => (
            <option key={size} value={size}>
              {size}
            </option>
          ))}
        </TextField>

        <Typography sx={{ fontSize: 14 }}>
          {from}-{to} of {totalProjects}
        </Typography>

        <IconButton
          size="small"
          disabled={paginationModel.page === 0}
          onClick={() =>
            setPaginationModel((m) => ({ ...m, page: m.page - 1 }))
          }
        >
          <ArrowBackIcon fontSize="small" />
        </IconButton>

        <IconButton
          size="small"
          disabled={
            paginationModel.page >=
            Math.ceil(totalProjects / paginationModel.pageSize) - 1
          }
          onClick={() =>
            setPaginationModel((m) => ({ ...m, page: m.page + 1 }))
          }
        >
          <ArrowForwardIcon fontSize="small" />
        </IconButton>
      </Box>
    );
  };

  const columns: GridColDef<Project>[] = [
    { field: "name", headerName: "Project Name", flex: 1.2 },
    { field: "jiraCode", headerName: "Jira Code", width: 130 },
    { field: "status", headerName: "Status", flex: 1 },
    {
      field: "startDate",
      headerName: "Start Date",
      flex: 1,
      renderCell: (p) => formatDate(p.value as string),
    },
    {
      field: "endDate",
      headerName: "End Date",
      flex: 1,
      renderCell: (p) => formatDate(p.value as string),
    },
    {
      field: "view",
      headerName: "View",
      width: 80,
      renderCell: (params) => (
        <Link
          component="button"
          onClick={() => onViewProjectEmployees?.(params.row)}
          sx={{ color: primaryColor, fontWeight: 600 }}
        >
          View
        </Link>
      ),
    },
    {
      field: "actions",
      type: "actions",
      headerName: "Actions",
      width: 100,
      getActions: (params) => [
        <GridActionsCellItem
          icon={<EditIcon />}
          label="Edit"
          onClick={() => handleEditClick(params.row)}
          sx={{ color: primaryColor }}
        />,
        <GridActionsCellItem
          icon={<DeleteIcon />}
          label="Delete"
          onClick={() => handleDeleteClick(params.row)}
          sx={{ color: primaryColor }}
        />,
      ],
    },
  ];

  if (loading) {
    return <Typography sx={{ mt: 4 }}>Loading...</Typography>;
  }

  if (projects.length === 0) {
    return <Typography sx={{ mt: 4 }}>No projects found.</Typography>;
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
      {!showGrid ? (
        <DataGrid
          rows={pagedProjects}
          columns={columns}
          getRowId={(row) => row._id ?? row.id}
          paginationModel={paginationModel}
          onPaginationModelChange={setPaginationModel}
          rowCount={totalProjects}
          paginationMode="server"
          sortingMode="server"
          sortModel={sortModel}
          onSortModelChange={setSortModel}
          disableRowSelectionOnClick
          disableColumnMenu
          slots={{ footer: CustomFooter }}
          sx={{
            border: "1px solid #e0e0e0",
            height: 500,
            "& .MuiDataGrid-columnHeader": {
              backgroundColor: "#f5f7fb",
              fontWeight: 700,
            },
            "& .MuiDataGrid-row:hover": {
              backgroundColor: "#fafafa",
            },
          }}
        />
      ) : (
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap: 3,
          }}
        >
          {projects.map((project) => (
            <Card key={project._id} sx={{ p: 2 }}>
              <CardContent>
                <Typography fontWeight={600}>{project.name}</Typography>
                <Typography variant="body2">
                  Jira: {project.jiraCode}
                </Typography>
                <Typography variant="body2">
                  Status: {project.status}
                </Typography>

                <Box sx={{ mt: 2, display: "flex", gap: 1 }}>
                  <IconButton
                    size="small"
                    onClick={() => handleEditClick(project)}
                    sx={{ color: primaryColor }}
                  >
                    <EditIcon fontSize="small" />
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={() => handleDeleteClick(project)}
                    sx={{ color: primaryColor }}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Box>
              </CardContent>
            </Card>
          ))}
        </Box>
      )}

      <EditProjectDialog
        open={editDialogOpen}
        project={editProject}
        onClose={() => setEditDialogOpen(false)}
        onSave={(p) => {
          onEditProject?.(p);
          setEditDialogOpen(false);
        }}
      />
    </Box>
  );
};

export default ProjectsList;
