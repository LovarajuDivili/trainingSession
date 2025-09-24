import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Button,
  Stack,
} from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import { DataGrid } from "@mui/x-data-grid";

const Projects: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [rows, setRows] = useState<any[]>([]);
  const [newProject, setNewProject] = useState({
    projectName: "",
    description: "",
  });
  const [openDialog, setOpenDialog] = useState(false);

  useEffect(() => {
    const storedProjects = JSON.parse(localStorage.getItem("projects") || "[]");
    setRows(storedProjects);

    if (location.pathname === "/dashboard/projects/addnew") {
      setOpenDialog(true);
    }
  }, [location.pathname]);

  const isFormValid = newProject.projectName.trim().length > 0;

  const handleSaveProject = () => {
    const stored = JSON.parse(localStorage.getItem("projects") || "[]");
    const updated = [...stored, { id: Date.now(), ...newProject }];
    localStorage.setItem("projects", JSON.stringify(updated));
    setRows(updated);
    setNewProject({ projectName: "", description: "" });
    setOpenDialog(false);
    navigate("/dashboard/projects");
  };

  return (
    <Box sx={{ mt: 3 }}>
      {rows.length === 0 ? (
        <Typography>No projects found.</Typography>
      ) : (
        <DataGrid
          rows={rows}
          columns={[
            { field: "projectName", headerName: "Project Name", flex: 1 },
            { field: "projectOwner", headerName: "Project Owner", flex: 1 },
            { field: "jiraId", headerName: "Jira ID", flex: 1 },
            { field: "status", headerName: "Status", flex: 1 },
            { field: "startDate", headerName: "Start Date", flex: 1 },
            { field: "endDate", headerName: "End Date", flex: 1 },
          ]}
          pageSizeOptions={[5, 10, 20]}
          initialState={{ pagination: { paginationModel: { pageSize: 5 } } }}
          autoHeight
        />
      )}

      <Dialog
        open={openDialog}
        onClose={() => {
          setOpenDialog(false);
          navigate("/dashboard/projects");
        }}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Add New Project</DialogTitle>
        <DialogContent dividers>
          <TextField
            label="Project Name"
            fullWidth
            margin="normal"
            value={newProject.projectName}
            onChange={(e) =>
              setNewProject({ ...newProject, projectName: e.target.value })
            }
          />
          <TextField
            label="Description"
            fullWidth
            margin="normal"
            multiline
            rows={4}
            value={newProject.description}
            onChange={(e) =>
              setNewProject({ ...newProject, description: e.target.value })
            }
          />
          <Stack direction="row" spacing={2} mt={2}>
            <Button
              variant="contained"
              onClick={handleSaveProject}
              disabled={!isFormValid}
            >
              Save
            </Button>
            <Button
              onClick={() => {
                setOpenDialog(false);
                navigate("/dashboard/projects");
              }}
            >
              Close
            </Button>
          </Stack>
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default Projects;
