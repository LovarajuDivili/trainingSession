/* eslint-disable @typescript-eslint/no-explicit-any */
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
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../hooks/reduxHooks";
import { addProjectAPI, updateProjectAPI } from "../../store/ProjectsSlice";
import type { Project } from "../../store/ProjectsSlice";
import { Add_New, Cancel } from "../../common/labelConstants";
import { useLocation } from "react-router-dom";
import { Snackbar, Alert } from "@mui/material";
import type { AddProjectProps, ProjectFormFieldsProps } from "../../common/types";

const AddProject = ({
  onClose,
  project = null,
  onSuccess,
}: AddProjectProps) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const location = useLocation();

  const state = location.state as
    | { isEditing?: boolean; projectData?: Project }
    | undefined;
  const projectFromState = state?.projectData || project;

  const isEditingMode = Boolean(projectFromState?.id);
  //const editingId = projectFromState?.id || null;

  const [formValues, setFormValues] = useState({
    projectName: "",
    projectOwner: "",
    jiraId: "",
    status: "",
    startDate: "",
    endDate: "",
  });

  const [loading, setLoading] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">(
    "success"
  );
  //const [dateError, setDateError] = useState("");
  const [startDateError, setStartDateError] = useState("");
  const [endDateError, setEndDateError] = useState("");

  useEffect(() => {
    if (projectFromState) {
      setFormValues({
        projectName: projectFromState.projectName || "",
        projectOwner: projectFromState.projectOwner || "",
        jiraId: projectFromState.jiraId || "",
        status: projectFromState.status || "",
        startDate: projectFromState.startDate || "",
        endDate: projectFromState.endDate || "",
      });
    } else {
      setFormValues({
        projectName: "",
        projectOwner: "",
        jiraId: "",
        status: "",
        startDate: "",
        endDate: "",
      });
    }
  }, [projectFromState]);

  const handleChange = (field: string, value: string) => {
    setFormValues((prev) => {
      const newValues = { ...prev, [field]: value };

      if (field === "startDate" || field === "endDate") {
        validateDates(
          field === "startDate" ? value : prev.startDate,
          field === "endDate" ? value : prev.endDate
        );
      }

      return newValues;
    });
  };

  const validateDates = (start: string, end: string): boolean => {
    let isValid = true;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (start) {
      const startDate = new Date(start);
      startDate.setHours(0, 0, 0, 0);

      if (startDate < today) {
        setStartDateError("Start date cannot be in the past");
        isValid = false;
      } else {
        setStartDateError("");
      }
    }

    if (start && end) {
      const startDate = new Date(start);
      const endDate = new Date(end);
      startDate.setHours(0, 0, 0, 0);
      endDate.setHours(0, 0, 0, 0);

      if (endDate <= startDate) {
        setEndDateError("End date must be after start date");
        isValid = false;
      } else if (endDate < today) {
        setEndDateError("End date cannot be in the past");
        isValid = false;
      } else {
        setEndDateError("");
      }
    }

    return isValid;
  };

  const isSaveDisabled =
    !(
      formValues.projectName.trim() &&
      formValues.projectOwner.trim() &&
      formValues.jiraId.trim() &&
      formValues.status &&
      formValues.startDate &&
      formValues.endDate
    ) || Boolean(startDateError || endDateError);

  const handleSave = async () => {
    if (!validateDates(formValues.startDate, formValues.endDate)) {
      return;
    }

    setLoading(true);

    try {
      const editingId = project?.id || projectFromState?.id;
      const projectData = {
        projectName: formValues.projectName.trim(),
        projectOwner: formValues.projectOwner.trim(),
        jiraId: formValues.jiraId.trim(),
        status: formValues.status,
        startDate: formValues.startDate,
        endDate: formValues.endDate,
      };

      if (isEditingMode && editingId) {
        await dispatch(
          updateProjectAPI({ id: editingId, projectData })
        ).unwrap();
        setSnackbarMessage("Project updated successfully");
        setSnackbarSeverity("success");
      } else {
        await dispatch(addProjectAPI(projectData)).unwrap();
        setSnackbarMessage("Project added successfully");
        setSnackbarSeverity("success");
      }

      setSnackbarOpen(true);

      // Wait for 1.5s before navigating so user sees Snackbar
      setTimeout(() => {
        if (onSuccess) onSuccess();
        else navigate("/admin/projects");
      }, 1500);
    } catch (err: any) {
      let message = "Unknown error occurred";
      if (typeof err === "string") message = err;
      else if (err?.detail) message = err.detail;
      else if (err?.message) message = err.message;

      setSnackbarMessage(message);
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    if (onClose) {
      onClose();
    } else {
      navigate("/admin/projects");
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const title = isEditingMode ? "Edit Project" : Add_New.ADD_PROJECT;
  const buttonLabel = isEditingMode ? "Save" : Add_New.ADD_BUTTON;

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
          {title}
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
            disabled={loading}
          >
            {Cancel.CANCEL}
          </Button>
          <Button
            variant="contained"
            sx={{ backgroundColor: "#906aff", textTransform: "uppercase" }}
            onClick={handleSave}
            disabled={isSaveDisabled || loading}
          >
            {buttonLabel}
          </Button>
        </Box>
      </Box>

      <Divider sx={{ mb: 3 }} />

      <ProjectFormFields
        projects={formValues}
        handleChange={handleChange}
        startDateError={startDateError}
        endDateError={endDateError}
      />
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbarSeverity}
          sx={{ width: "100%" }}
          variant="filled"
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};



const ProjectFormFields = ({
  projects,
  handleChange,
  startDateError,
  endDateError,
}: ProjectFormFieldsProps) => (
  <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }}>
    {/* Row 1 */}
    <Grid item size={{ xs: 2, sm: 4, md: 4 }}>
      <Typography sx={{ fontSize: "15px", mb: 0.5 }}>
        {Add_New.PROJECT_NAME}
      </Typography>
      <TextField
        placeholder="Enter project name"
        value={projects.projectName}
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
        value={projects.projectOwner}
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
        value={projects.jiraId}
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
        value={projects.status}
        onChange={(e) => handleChange("status", e.target.value)}
        fullWidth
        sx={{
          borderRadius: "20px",
          "& .MuiOutlinedInput-root": {
            borderRadius: "20px",
          },
          "& .MuiSelect-select": {
            color: projects.status ? "inherit" : "grey",
          },
        }}
        displayEmpty
      >
        <MenuItem value="" disabled>
          <em>Select Status</em>
        </MenuItem>
        <MenuItem value="Active">Active</MenuItem>
        <MenuItem value="InActive">InActive</MenuItem>
        <MenuItem value="InProgress">In Progress</MenuItem>
      </Select>
    </Grid>

    <Grid item size={{ xs: 2, sm: 4, md: 4 }}>
      <Typography sx={{ fontSize: "15px", mb: 0.5 }}>Start Date</Typography>
      <TextField
        type="date"
        value={projects.startDate}
        onChange={(e) => handleChange("startDate", e.target.value)}
        fullWidth
        error={Boolean(startDateError)}
        helperText={startDateError}
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
        value={projects.endDate}
        onChange={(e) => handleChange("endDate", e.target.value)}
        fullWidth
        error={Boolean(endDateError)}
        helperText={endDateError}
        sx={{
          "& .MuiOutlinedInput-root": {
            borderRadius: "20px",
          },
        }}
      />
    </Grid>
  </Grid>
);

export { ProjectFormFields };
export default AddProject;
