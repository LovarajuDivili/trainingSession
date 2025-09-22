import { useState, useEffect } from "react";
import { Box, Typography } from "@mui/material";
import { DataGrid, type GridColDef } from "@mui/x-data-grid";
import { useNavigate } from "react-router-dom";
import { Loading } from "../../common/labelConstants";
import DashboardHeader from "../DashboardHeader";
import { sidebarItems } from "../../common/sidebarItems";

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
          status: "In Progress",
          startDate: "2023-05-01",
          endDate: "2023-12-31",
          id: "PROJ001",
        },
        {
          projectName: "Mobile App",
          projectOwner: "Bob Williams",
          jiraId: "JIRA-202",
          status: "Completed",
          startDate: "2022-01-15",
          endDate: "2022-10-30",
          id: "PROJ002",
        },
        {
          projectName: "Database Migration",
          projectOwner: "Charlie Brown",
          jiraId: "JIRA-303",
          status: "Completed",
          startDate: "2023-01-10",
          endDate: "2023-04-15",
          id: "PROJ003",
        },
        {
          projectName: "Marketing Campaign Launch",
          projectOwner: "Diana Prince",
          jiraId: "JIRA-404",
          status: "In Progress",
          startDate: "2023-09-15",
          endDate: "2024-03-30",
          id: "PROJ004",
        },
        {
          projectName: "Cloud Infrastructure Setup",
          projectOwner: "Ethan Hunt",
          jiraId: "JIRA-505",
          status: "On Hold",
          startDate: "2024-01-20",
          endDate: "2024-06-30",
          id: "PROJ005",
        },
        {
          projectName: "Security Audit",
          projectOwner: "Fiona Glenanne",
          jiraId: "JIRA-606",
          status: "Completed",
          startDate: "2022-08-01",
          endDate: "2022-11-15",
          id: "PROJ006",
        },
        {
          projectName: "New Feature Development (Login)",
          projectOwner: "George Costanza",
          jiraId: "JIRA-707",
          status: "In Progress",
          startDate: "2024-02-01",
          endDate: "2024-08-31",
          id: "PROJ007",
        },
        {
          projectName: "Customer Feedback System",
          projectOwner: "Heidi Klum",
          jiraId: "JIRA-808",
          status: "To Do",
          startDate: "2024-10-01",
          endDate: "2025-02-28",
          id: "PROJ008",
        },
        {
          projectName: "Internal Tool Integration",
          projectOwner: "Ian Malcolm",
          jiraId: "JIRA-909",
          status: "In Progress",
          startDate: "2023-11-01",
          endDate: "2024-05-31",
          id: "PROJ009",
        },
        {
          projectName: "Bug Triage and Fixes",
          projectOwner: "Jessica Jones",
          jiraId: "JIRA-1010",
          status: "In Progress",
          startDate: "2024-01-01",
          endDate: "2024-05-31",
          id: "PROJ010",
        },
      ]);
    }, 1000);
  });
};

const Projects = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const navigate = useNavigate(); 

  useEffect(() => {
    const savedData = sessionStorage.getItem(SESSION_STORAGE_KEY);

    if (savedData) {
      setProjects(JSON.parse(savedData));
    } else {
      setLoading(true);
      fetchProjects().then((data) => {
        setProjects(data);
        sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(data));
        setLoading(false);
      });
    }
  }, []);

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
    { field: "status", headerName: "Status", flex: 1 },
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
        onAddClick={() => navigate("/admin/projects/add")} // ✅ navigate
      />

      {loading ? (
        <Typography>{Loading.LOADING}</Typography>
      ) : (
        <Box sx={{ height: 500, width: "100%" }}>
          <DataGrid
            rows={filteredProjects}
            columns={columns}
            getRowId={(row) => row.id}
            pageSizeOptions={[5, 10, 20]}
            initialState={{
              pagination: { paginationModel: { pageSize: 5, page: 0 } },
            }}
            autoHeight
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
