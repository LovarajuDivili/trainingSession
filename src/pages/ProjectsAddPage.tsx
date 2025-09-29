import React, { useCallback, useEffect, useState } from "react";
import { Box, Typography, Button } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import CreateProject from "./CreateProject";

const ProjectsAddPage: React.FC = () => {
  const navigate = useNavigate();
  const { role } = useParams(); 
  const [isFormValid, setIsFormValid] = useState(false);

  const handleFormValidityChange = useCallback((valid: boolean) => {
    setIsFormValid(valid);
  }, []);

  const handleSaveClick = () => {
    window.dispatchEvent(new Event("submit-project-form"));
  };

  // Navigate back when a project is saved
  useEffect(() => {
    const handleProjectSaved = () => {
      navigate(`/dashboard/${role}/projects`);
    };

    window.addEventListener("project-form-saved", handleProjectSaved);
    return () => {
      window.removeEventListener("project-form-saved", handleProjectSaved);
    };
  }, [navigate, role]);

  return (
    <Box>
      {/* Top bar */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
          flexWrap: "wrap",
          gap: 2,
        }}
      >
        <Typography variant="h5" sx={{ fontWeight: "bold", color: "black" }}>
          Add New Project
        </Typography>

        <Box sx={{ display: "flex", gap: 2 }}>
          <Button variant="outlined" 
          onClick={() => navigate(-1)}
          sx = {{
            color: "#906aff",
            borderColor: "#906aff",
            "&hover": {
              borderColor: "#7a53e3",
              backgroundColor: "rgba(144,106,255,0.04)",
            },
          }}>
            Close
          </Button>
          <Button
            variant="contained"
            onClick={handleSaveClick}
            disabled={!isFormValid}
            sx={{
              backgroundColor: "#906aff",
              "&:hover": { backgroundColor: "#7a53e3" },
            }}
          >
            Save
          </Button>
        </Box>
      </Box>
      <CreateProject onValidityChange={handleFormValidityChange} />
    </Box>
  );
};

export default ProjectsAddPage;