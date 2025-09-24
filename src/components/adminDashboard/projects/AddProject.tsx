import React, { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Stack,
  MenuItem,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

const AddProject: React.FC = () => {
  const navigate = useNavigate();

  const [projectName, setProjectName] = useState("");
  const [projectOwner, setProjectOwner] = useState("");
  const [jiraId, setJiraId] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [status, setStatus] = useState("Not Started");

  const handleSave = () => {
    const newProject = {
      id: Date.now(),
      projectName,
      projectOwner,
      jiraId,
      startDate,
      endDate,
      status,
    };
    const storedProjects = JSON.parse(localStorage.getItem("projects") || "[]");
    const updatedProjects = [...storedProjects, newProject];
    localStorage.setItem("projects", JSON.stringify(updatedProjects));
    navigate("/dashboard/projects");
  };

  const inputStyle = {
    "& .MuiOutlinedInput-root": {
      borderRadius: "30px",
      minHeight: 55,
    },
  };

  const buttonStyle = {
    borderRadius: "22px",
    textTransform: "none",
    padding: "10px 25px",
  };

  return (
    <Box
      sx={{
        minHeight: "80vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        px: 2,
      }}
    >
      <Box sx={{ maxWidth: 800, width: "100%" }}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          mb={5}
        >
          <Typography variant="h5" sx={{ fontWeight: 600 }}>
            Add New Project
          </Typography>
          <Stack direction="row" spacing={2}>
            <Button
              variant="outlined"
              onClick={() => navigate("/dashboard/projects")}
              sx={buttonStyle}
            >
              Close
            </Button>
            <Button
              variant="contained"
              onClick={handleSave}
              disabled={!projectName.trim() || !projectOwner || !jiraId}
              sx={{
                ...buttonStyle,
                bgcolor: "#906aff",
                "&:hover": { bgcolor: "#7a54f6" },
              }}
            >
              Save
            </Button>
          </Stack>
        </Stack>

        <Stack spacing={4}>
          <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
            <Box sx={{ width: "100%" }}>
              <label
                htmlFor="projectName"
                style={{ fontWeight: 500, marginBottom: 6, display: "block" }}
              >
                Project Name
              </label>
              <TextField
                id="projectName"
                fullWidth
                required
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                sx={inputStyle}
              />
            </Box>
            <Box sx={{ width: "100%" }}>
              <label
                htmlFor="jiraId"
                style={{ fontWeight: 500, marginBottom: 6, display: "block" }}
              >
                Jira ID
              </label>
              <TextField
                id="jiraId"
                fullWidth
                required
                value={jiraId}
                onChange={(e) => setJiraId(e.target.value)}
                sx={inputStyle}
              />
            </Box>
          </Stack>

          <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
            <Box sx={{ width: "100%" }}>
              <label
                htmlFor="projectOwner"
                style={{ fontWeight: 500, marginBottom: 6, display: "block" }}
              >
                Project Owner
              </label>
              <TextField
                id="projectOwner"
                fullWidth
                required
                value={projectOwner}
                onChange={(e) => setProjectOwner(e.target.value)}
                sx={inputStyle}
              />
            </Box>
            <Box sx={{ width: "100%" }}>
              <label
                htmlFor="startDate"
                style={{ fontWeight: 500, marginBottom: 6, display: "block" }}
              >
                Start Date
              </label>
              <TextField
                id="startDate"
                type="date"
                fullWidth
                required
                InputLabelProps={{ shrink: true }}
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                sx={inputStyle}
              />
            </Box>
          </Stack>

          <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
            <Box sx={{ width: "100%" }}>
              <label
                htmlFor="endDate"
                style={{ fontWeight: 500, marginBottom: 6, display: "block" }}
              >
                End Date
              </label>
              <TextField
                id="endDate"
                type="date"
                fullWidth
                required
                InputLabelProps={{ shrink: true }}
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                sx={inputStyle}
              />
            </Box>
            <Box sx={{ width: "100%" }}>
              <label
                htmlFor="status"
                style={{ fontWeight: 500, marginBottom: 6, display: "block" }}
              >
                Status
              </label>
              <TextField
                id="status"
                select
                fullWidth
                required
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                sx={inputStyle}
              >
                <MenuItem value="Active">Active</MenuItem>
                <MenuItem value="Inactive">Inactive</MenuItem>
                <MenuItem value="Not Started">Not Started</MenuItem>
                <MenuItem value="In Progress">In Progress</MenuItem>
              </TextField>
            </Box>
          </Stack>
        </Stack>
      </Box>
    </Box>
  );
};

export default AddProject;
