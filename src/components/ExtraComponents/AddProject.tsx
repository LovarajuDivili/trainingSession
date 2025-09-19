import {
  Box,
  Typography,
  Button,
  Grid,
  TextField,
  MenuItem,
} from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const LOCAL_STORAGE_KEY = "projects_data";

const AddProject = () => {
  const navigate = useNavigate();

  const [project, setProject] = useState({
    projectName: "",
    projectOwner: "",
    jiraId: "",
    status: "",
    startDate: "",
    endDate: "",
  });

  const handleChange = (field: string, value: string) => {
    setProject((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    const savedData = localStorage.getItem(LOCAL_STORAGE_KEY);
    const projects = savedData ? JSON.parse(savedData) : [];

    const newProject = {
      ...project,
      id: "PROJ" + Date.now(),
    };

    const updatedProjects = [...projects, newProject];

    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedProjects));

    alert("Project added successfully!");
    navigate("/admin/projects");
  };

  const handleCancel = () => {
    navigate("/admin/projects");
  };

  return (
    <Box sx={{ maxWidth: 1000, mx: "auto", mt: 4, p: 2 }}>
      <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
        Add New Project
      </Typography>

      <Grid
        container
        spacing={{ xs: 2, md: 3 }}
        columns={{ xs: 4, sm: 8, md: 12 }}
      >
        {/* Row 1 */}
        <Grid item size={{ xs: 2, sm: 4, md: 4 }}>
          <Typography sx={{ fontSize: "15px", mb: 0.5 }}>
            Project Name
          </Typography>
          <TextField
            placeholder="Enter project name"
            value={project.projectName}
            onChange={(e) => handleChange("projectName", e.target.value)}
            fullWidth
          />
        </Grid>

        <Grid item size={{ xs: 2, sm: 4, md: 4 }}>
          <Typography sx={{ fontSize: "15px", mb: 0.5 }}>
            Project Owner
          </Typography>
          <TextField
            placeholder="Enter project owner"
            value={project.projectOwner}
            onChange={(e) => handleChange("projectOwner", e.target.value)}
            fullWidth
          />
        </Grid>

        <Grid item size={{ xs: 2, sm: 4, md: 4 }}>
          <Typography sx={{ fontSize: "15px", mb: 0.5 }}>Jira Id</Typography>
          <TextField
            placeholder="JIRA-123"
            value={project.jiraId}
            onChange={(e) => handleChange("jiraId", e.target.value)}
            fullWidth
          />
        </Grid>

        {/* Row 2 */}
        <Grid item size={{ xs: 2, sm: 4, md: 4 }}>
          <Typography sx={{ fontSize: "15px", mb: 0.5 }}>Status</Typography>
          <TextField
            select
            value={project.status}
            onChange={(e) => handleChange("status", e.target.value)}
            fullWidth
          >
            <MenuItem value="">
              <em>Select Status</em>
            </MenuItem>
            <MenuItem value="Not Started">Not Started</MenuItem>
            <MenuItem value="In Progress">In Progress</MenuItem>
            <MenuItem value="Completed">Completed</MenuItem>
            <MenuItem value="On Hold">On Hold</MenuItem>
          </TextField>
        </Grid>

        <Grid item size={{ xs: 2, sm: 4, md: 4 }}>
          <Typography sx={{ fontSize: "15px", mb: 0.5 }}>Start Date</Typography>
          <TextField
            type="date"
            value={project.startDate}
            onChange={(e) => handleChange("startDate", e.target.value)}
            fullWidth
          />
        </Grid>

        <Grid item size={{ xs: 2, sm: 4, md: 4 }}>
          <Typography sx={{ fontSize: "15px", mb: 0.5 }}>End Date</Typography>
          <TextField
            type="date"
            value={project.endDate}
            onChange={(e) => handleChange("endDate", e.target.value)}
            fullWidth
          />
        </Grid>
      </Grid>

      {/* Buttons */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          gap: 2,
          mt: 4,
        }}
      >
        <Button
          variant="contained"
          sx={{ backgroundColor: "#1976d2", textTransform: "uppercase" }}
          onClick={handleSave}
        >
          Save
        </Button>
        <Button
          variant="outlined"
          sx={{
            color: "#d81b60",
            borderColor: "#d81b60",
            textTransform: "uppercase",
          }}
          onClick={handleCancel}
        >
          Cancel
        </Button>
      </Box>
    </Box>
  );
};

export default AddProject;
