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
  DialogContent,
  Dialog,
  DialogTitle,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../hooks/reduxHooks";
import { addProjectAPI, updateProjectAPI } from "../../store/ProjectsSlice";
import type { Project } from "../../store/ProjectsSlice";
import { Add_New, Cancel } from "../../common/labelConstants";

interface AddProjectProps {
  open?: boolean;
  onClose?: () => void;
  project?: Project | null;
  isEditing?: boolean;
  onSuccess?: () => void;
}

const AddProject = ({
  open = false,
  onClose,
  project = null,
  isEditing = false,
  onSuccess,
}: AddProjectProps) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const [projects, setProject] = useState({
    projectName: "",
    projectOwner: "",
    jiraId: "",
    status: "",
    startDate: "",
    endDate: "",
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (project) {
      setProject({
        projectName: project.projectName || "",
        projectOwner: project.projectOwner || "",
        jiraId: project.jiraId || "",
        status: project.status || "",
        startDate: project.startDate || "",
        endDate: project.endDate || "",
      });
    } else {
      setProject({
        projectName: "",
        projectOwner: "",
        jiraId: "",
        status: "",
        startDate: "",
        endDate: "",
      });
    }
  }, [project]);

  const handleChange = (field: string, value: string) => {
    setProject((prev) => ({ ...prev, [field]: value }));
  };

  const isSaveDisabled = !(
    projects.projectName &&
    projects.projectOwner &&
    projects.jiraId &&
    projects.status &&
    projects.startDate &&
    projects.endDate
  );

  const handleSave = async () => {
    const projectData: Project = {
      ...projects,
      id: isEditing && project ? project.id : "PROJ" + Date.now(),
    };

    setLoading(true);
    try {
      if (isEditing) {
        await dispatch(updateProjectAPI(projectData)).unwrap();
      } else {
        await dispatch(addProjectAPI(projectData)).unwrap();
      }

      if (onSuccess) {
        onSuccess();
      } else {
        alert(`Project ${isEditing ? "updated" : "added"} successfully!`);
        navigate("/admin/projects");
      }
    } catch (error: any) {
      const errorMessage = error.payload || error.message || "Unknown error";

      console.error("Project operation error:", error);
      alert(
        `Error ${isEditing ? "updating" : "adding"} project: ${errorMessage}`
      );
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

  const title = isEditing ? "Edit Project" : Add_New.ADD_PROJECT;
  const buttonLabel = isEditing ? "Update" : Add_New.ADD_BUTTON;

  if (onClose) {
    return (
      <Dialog open={open} onClose={handleCancel} maxWidth="md" fullWidth>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "20px",
          }}
        >
          <DialogTitle sx={{ p: 0, fontSize: "25px" }}>{title}</DialogTitle>
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

        <Divider />

        <DialogContent sx={{ mt: 2, pt: 0 }}>
          <ProjectFormFields projects={projects} handleChange={handleChange} />
        </DialogContent>
      </Dialog>
    );
  }
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
            disabled={loading}
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
      <ProjectFormFields projects={projects} handleChange={handleChange} />
    </Box>
  );
};

interface ProjectFormFieldsProps {
  projects: {
    projectName: string;
    projectOwner: string;
    jiraId: string;
    status: string;
    startDate: string;
    endDate: string;
  };
  handleChange: (field: string, value: string) => void;
}

const ProjectFormFields = ({
  projects,
  handleChange,
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
