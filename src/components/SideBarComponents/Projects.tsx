import { useState, useEffect } from "react";
import { Box, Button, Typography } from "@mui/material";
import { DataGrid, type GridColDef } from "@mui/x-data-grid";
import { useNavigate } from "react-router-dom";
import { Loading } from "../../common/labelConstants";
import DashboardHeader from "../DashboardHeader";
import { sidebarItems } from "../../common/sidebarItems";
import { useAppDispatch, useAppSelector } from "../../hooks/reduxHooks";
import { fetchProjects } from "../../store/ProjectsSlice";

const Projects = () => {
  const [searchText, setSearchText] = useState("");
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { projects, loading } = useAppSelector((state) => state.projects);

  useEffect(() => {
    // Fetch projects from MongoDB backend
    dispatch(fetchProjects());
  }, [dispatch]);

  const filteredProjects = projects.filter(
    (proj) =>
      proj.projectName.toLowerCase().includes(searchText.toLowerCase()) ||
      proj.jiraId.toLowerCase().includes(searchText.toLowerCase())
  );

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
              pagination: { paginationModel: { pageSize: 5, page: 0 } },
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
  );
};

export default Projects;
