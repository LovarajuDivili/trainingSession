
import React, { useEffect, useState } from "react";
import { Box, TextField, MenuItem } from "@mui/material";

const LOCAL_STORAGE_KEY = "projects";

const statusOptions = [
  { value: "active", label: "Active" },
  { value: "inactive", label: "Inactive" },
  { value: "inProgress", label: "In Progress" },
  { value: "notStarted", label: "Not Started" },
];

interface CreateProjectProps {
  onValidityChange: (valid: boolean) => void;
}

const CreateProject: React.FC<CreateProjectProps> = ({ onValidityChange }) => {
  const [formData, setFormData] = useState({
    name: "",
    jiraId: "",
    owner: "",
    startDate: "",
    endDate: "",
    status: "",
  });

  const isValid =
    formData.name.trim() !== "" &&
    formData.jiraId.trim() !== "" &&
    formData.owner.trim() !== "" &&
    formData.status.trim() !== "";

  useEffect(() => {
    onValidityChange(isValid);
  }, [isValid, onValidityChange]);

  useEffect(() => {
    const handleSubmit = () => {
      if (!isValid) {
        alert("Please fill all required fields.");
        return;
      }

      const newProject = {
        id: Date.now(),
        ...formData,
        jiraId: Number(formData.jiraId),
      };

      const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
      const projects = stored ? JSON.parse(stored) : [];
      projects.push(newProject);
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(projects));

      window.dispatchEvent(new Event("project-form-saved"));
    };

    window.addEventListener("submit-project-form", handleSubmit);
    return () => {
      window.removeEventListener("submit-project-form", handleSubmit);
    };
  }, [formData, isValid]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <Box
      component="form"
      sx={{
        display: "flex",
        flexWrap: "wrap",
        gap: 2,
      }}
    >

      <Box sx={{ flex: "1 1 48%" }}>
        <TextField
          variant="outlined"
          label="Project Name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          fullWidth
          required
          InputLabelProps={{ shrink: formData.name !== "" }} // force label to shrink when value exists
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: "4px",
            },
          }}
        />
      </Box>

      <Box sx={{ flex: "1 1 48%" }}>
        <TextField
          variant="outlined"
          label="Jira ID"
          name="jiraId"
          type="number"
          value={formData.jiraId}
          onChange={handleChange}
          fullWidth
          required
          inputProps={{ min: 0 }}
          InputLabelProps={{ shrink: formData.jiraId !== "" }}
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: "4px",
            },
          }}
        />
      </Box>

      <Box sx={{ flex: "1 1 48%" }}>
        <TextField
          variant="outlined"
          label="Project Owner"
          name="owner"
          value={formData.owner}
          onChange={handleChange}
          fullWidth
          required
          InputLabelProps={{ shrink: formData.owner !== "" }}
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: "4px",
            },
          }}
        />
      </Box>

      <Box sx={{ flex: "1 1 48%" }}>
        <TextField
          variant="outlined"
          label="Start Date"
          name="startDate"
          type="date"
          value={formData.startDate}
          onChange={handleChange}
          fullWidth
          InputLabelProps={{ shrink: true }}
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: "4px",
            },
          }}
        />
      </Box>

      <Box sx={{ flex: "1 1 48%" }}>
        <TextField
          variant="outlined"
          label="End Date"
          name="endDate"
          type="date"
          value={formData.endDate}
          onChange={handleChange}
          fullWidth
          InputLabelProps={{ shrink: true }}
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: "4px",
            },
          }}
        />
      </Box>

      <Box sx={{ flex: "1 1 48%" }}>
        <TextField
          variant="outlined"
          select
          label="Status"
          name="status"
          value={formData.status}
          onChange={handleChange}
          fullWidth
          required
          InputLabelProps={{ shrink: formData.status !== "" }}
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: "4px",
            },
          }}
        >
          {statusOptions.map((opt) => (
            <MenuItem key={opt.value} value={opt.value}>
              {opt.label}
            </MenuItem>
          ))}
        </TextField>
      </Box>
    </Box>
  );
};

export default CreateProject;
