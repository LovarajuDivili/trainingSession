import {
  Box,
  Typography,
  Button,
  Grid,
  TextField,
  MenuItem,
  Select,
} from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const SESSION_STORAGE_KEY = "project_data";

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

  const isSaveDisabled = !(
    project.projectName &&
    project.projectOwner &&
    project.jiraId &&
    project.status &&
    project.startDate &&
    project.endDate
  );

  const handleSave = () => {
    const savedData = sessionStorage.getItem(SESSION_STORAGE_KEY);
    const projects = savedData ? JSON.parse(savedData) : [];

    const newProject = {
      ...project,
      id: "PROJ" + Date.now(),
    };

    const updatedProjects = [...projects, newProject];

    sessionStorage.setItem(
      SESSION_STORAGE_KEY,
      JSON.stringify(updatedProjects)
    );

    alert("Project added successfully!");
    navigate("/admin/projects");
  };

  const handleCancel = () => {
    navigate("/admin/projects");
  };

  return (
    <Box sx={{ maxWidth: 1000, mx: "auto", mt: 4, p: 2 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: "20px",
          mt: "20px",
        }}
      >
        <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
          Add New Project
        </Typography>
        {/* Buttons */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            gap: 2,
            mt: 0,
            mb: 1,
          }}
        >
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
          <Button
            variant="contained"
            sx={{ backgroundColor: "#906aff", textTransform: "uppercase" }}
            onClick={handleSave}
            disabled={isSaveDisabled}
          >
            Add
          </Button>
        </Box>
      </Box>
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
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "20px",
              },
            }}
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
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "20px",
              },
            }}
          />
        </Grid>

        <Grid item size={{ xs: 2, sm: 4, md: 4 }}>
          <Typography sx={{ fontSize: "15px", mb: 0.5 }}>Jira Id</Typography>
          <TextField
            placeholder="JIRA-123"
            value={project.jiraId}
            onChange={(e) => handleChange("jiraId", e.target.value)}
            fullWidth
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "20px",
              },
            }}
          />
        </Grid>

        {/* Row 2 */}
        <Grid item size={{ xs: 2, sm: 4, md: 4 }}>
          <Typography sx={{ fontSize: "15px", mb: 0.5 }}>Status</Typography>
          <Select
            value={project.status}
            onChange={(e) => handleChange("status", e.target.value)}
            fullWidth
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "20px",
              },
              "& .MuiSelect-select": {
                color: project.status ? "inherit" : "grey", // grey when placeholder
              },
            }}
            displayEmpty
          >
            <MenuItem value="" disabled>
              <em>Select Status</em>
            </MenuItem>
            <MenuItem value="Active">Active</MenuItem>
            <MenuItem value="InActive">Inactive</MenuItem>
            <MenuItem value="InProgress">In Progress</MenuItem>
          </Select>
        </Grid>

        <Grid item size={{ xs: 2, sm: 4, md: 4 }}>
          <Typography sx={{ fontSize: "15px", mb: 0.5 }}>Start Date</Typography>
          <TextField
            type="date"
            value={project.startDate}
            onChange={(e) => handleChange("startDate", e.target.value)}
            fullWidth
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "20px",
              },
            }}
          />
        </Grid>

        <Grid item size={{ xs: 2, sm: 4, md: 4 }}>
          <Typography sx={{ fontSize: "15px", mb: 0.5 }}>End Date</Typography>
          <TextField
            type="date"
            value={project.endDate}
            onChange={(e) => handleChange("endDate", e.target.value)}
            fullWidth
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "20px",
              },
            }}
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default AddProject;
