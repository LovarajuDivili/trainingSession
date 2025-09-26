import { useState, useEffect } from "react";
import { Box, Button, Typography } from "@mui/material";
import { DataGrid, type GridColDef } from "@mui/x-data-grid";
import { useNavigate } from "react-router-dom";
import { Loading } from "../../common/labelConstants";
import DashboardHeader from "../DashboardHeader";
import { sidebarItems } from "../../common/sidebarItems";
import { useAppDispatch, useAppSelector } from "../../hooks/reduxHooks";
import { setProjects } from "../../store/ProjectsSlice";

interface Project {
  projectName: string;
  projectOwner: string;
  jiraId: string;
  status: string;
  startDate: string;
  endDate: string;
  id: string;
}

const SESSION_STORAGE_KEY = "project_data";

const fetchProjects = (): Promise<Project[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        {
          projectName: "Website Redesign",
          projectOwner: "Alice Johnson",
          jiraId: "JIRA-101",
          status: "Inactive",
          startDate: "2023-05-01",
          endDate: "2023-12-31",
          id: "PROJ001",
        },
        {
          projectName: "Mobile App",
          projectOwner: "Bob Williams",
          jiraId: "JIRA-202",
          status: "Active",
          startDate: "2022-01-15",
          endDate: "2022-10-30",
          id: "PROJ002",
        },
        {
          projectName: "Database Migration",
          projectOwner: "Charlie Brown",
          jiraId: "JIRA-303",
          status: "Active",
          startDate: "2023-01-10",
          endDate: "2023-04-15",
          id: "PROJ003",
        },
        {
          projectName: "Marketing Campaign Launch",
          projectOwner: "Diana Prince",
          jiraId: "JIRA-404",
          status: "Inactive",
          startDate: "2023-09-15",
          endDate: "2024-03-30",
          id: "PROJ004",
        },
        {
          projectName: "Cloud Infrastructure Setup",
          projectOwner: "Ethan Hunt",
          jiraId: "JIRA-505",
          status: "Inactive",
          startDate: "2024-01-20",
          endDate: "2024-06-30",
          id: "PROJ005",
        },
        {
          projectName: "Security Audit",
          projectOwner: "Fiona Glenanne",
          jiraId: "JIRA-606",
          status: "Active",
          startDate: "2022-08-01",
          endDate: "2022-11-15",
          id: "PROJ006",
        },
      ]);
    }, 1000);
  });
};

const Projects = () => {
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const projects = useAppSelector((state) => state.projects.projects);

  useEffect(() => {
    const savedData = sessionStorage.getItem(SESSION_STORAGE_KEY);

    if (savedData) {
      dispatch(setProjects(JSON.parse(savedData)));
    } else {
      setLoading(true);
      fetchProjects().then((data) => {
        dispatch(setProjects(data));
        sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(data));
        setLoading(false);
      });
    }
  }, [dispatch]);

  useEffect(() => {
    if (projects.length > 0) {
      sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(projects));
    }
  }, [projects]);

  const filteredProjects = projects.filter(
    (proj) =>
      proj.projectName.toLowerCase().includes(searchText.toLowerCase()) ||
      proj.jiraId.toLowerCase().includes(searchText.toLowerCase())
  );

  const columns: GridColDef<Project>[] = [
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
                : params.value === "In Progress"
                ? "orange"
                : "#e12a2aff",
            color: "white",
            textTransform: "none",
            fontWeight: 600,
            borderRadius: "20px",
            maxWidth: "20px",
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
