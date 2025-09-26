import {
  Box,
  Typography,
  Button,
  Grid,
  TextField,
  MenuItem,
  Select,
  Divider,
} from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../hooks/reduxHooks";
import { addProject } from "../../store/ProjectsSlice";
import type { Project } from "../../store/ProjectsSlice";
import { Add_New, Cancel } from "../../common/labelConstants";

const AddProject = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

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
    const newProject: Project = {
      ...project,
      id: "PROJ" + Date.now(),
    };

    dispatch(addProject(newProject));

    alert("Project added successfully!");
    navigate("/admin/projects");
  };

  const handleCancel = () => {
    navigate("/admin/projects");
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
          mt: 2,
        }}
      >
        <Typography variant="h5" sx={{ fontWeight: 600 }}>
          {Add_New.ADD_PROJECT}
        </Typography>

        <Box sx={{ display: "flex", gap: 2 }}>
          <Button
            variant="outlined"
            sx={{
              color: "#d81b60",
              borderColor: "#d81b60",
              textTransform: "uppercase",
            }}
            onClick={handleCancel}
          >
            {Cancel.CANCEL}
          </Button>
          <Button
            variant="contained"
            sx={{ backgroundColor: "#906aff", textTransform: "uppercase" }}
            onClick={handleSave}
            disabled={isSaveDisabled}
          >
            {Add_New.ADD_BUTTON}
          </Button>
        </Box>
      </Box>
      <Divider sx={{ mb: 3 }} />
      <Grid
        container
        spacing={{ xs: 2, md: 3 }}
        columns={{ xs: 4, sm: 8, md: 12 }}
      >
        {/* Row 1 */}
        <Grid item size={{ xs: 2, sm: 4, md: 4 }}>
          <Typography sx={{ fontSize: "15px", mb: 0.5 }}>
            {Add_New.PROJECT_NAME}
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
            {Add_New.PROJECT_OWNER}
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
              borderRadius: "20px",
              "& .MuiOutlinedInput-root": {
                borderRadius: "20px",
              },
              "& .MuiSelect-select": {
                color: project.status ? "inherit" : "grey",
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
