import React, { useState, useEffect } from "react";
import { Box, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { DataGrid } from "@mui/x-data-grid";
import AdminHeader from "../../common/AdminHeader";

const Projects: React.FC = () => {
  const navigate = useNavigate();

  const [rows, setRows] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<boolean>(true);
  const [filteredRows, setFilteredRows] = useState(rows);
  const [activeSection, setActiveSection] = useState("Projects");

  useEffect(() => {
    const storedProjects = JSON.parse(localStorage.getItem("projects") || "[]");
    setRows(storedProjects);
  }, []);

  useEffect(() => {
    setActiveSection("Projects");
  });

  useEffect(() => {
    const filtered = rows.filter((row) =>
      Object.values(row).some((val) =>
        String(val).toLowerCase().includes(searchQuery.toLowerCase())
      )
    );
    setFilteredRows(filtered);
  }, [searchQuery, rows]);

  return (
    <Box>
      <AdminHeader
        activeSection={activeSection}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        viewMode={viewMode}
        setViewMode={setViewMode}
        filteredCount={filteredRows.length}
        onAddClick={() => navigate("/dashboard/projects/addnew")}
        isgrid={false}
      />

      <Box sx={{ mt: 3 }}>
        {rows.length === 0 ? (
          <Typography>No projects found.</Typography>
        ) : (

          <Box sx={{ mt: 3, height: "calc(78vh - 150px)" }}>
            <DataGrid
              rows={filteredRows}
              columns={[
                { field: "projectName", headerName: "Project Name", flex: 1 },
                { field: "projectOwner", headerName: "Project Owner", flex: 1 },
                { field: "jiraId", headerName: "Jira ID", flex: 1 },
                { field: "status", headerName: "Status", flex: 1 },
                { field: "startDate", headerName: "Start Date", flex: 1 },
                { field: "endDate", headerName: "End Date", flex: 1 },
              ]}
              pageSizeOptions={[5, 10, 20]}
              initialState={{
                pagination: { paginationModel: { pageSize: 5 } },
              }}
              sx={{
                backgroundColor: "#fff",
                borderRadius: "12px",
                boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
                border: "none",
                height: "100%",

                "& .MuiDataGrid-columnHeaders": {
                  backgroundColor: "#f5f5f5",
                  color: "#333",
                  fontWeight: 600,
                  fontSize: "0.95rem",
                },

                "& .MuiDataGrid-cell": {
                  borderBottom: "1px solid #f0f0f0",
                  fontSize: "0.9rem",
                },

                "& .MuiDataGrid-row:hover": {
                  backgroundColor: "#fafafa",
                  cursor: "pointer",
                },

                "& .MuiDataGrid-footerContainer": {
                  borderTop: "1px solid #f0f0f0",
                  backgroundColor: "#fafafa",
                },

                "& .MuiTablePagination-root": {
                  fontSize: "0.85rem",
                },
              }}
            />
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default Projects;
