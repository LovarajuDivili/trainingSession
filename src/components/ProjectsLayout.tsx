import React, { useState, useCallback, useEffect } from "react";
import {
  Box,
  Typography,
  InputBase,
  IconButton,
  Button,
} from "@mui/material";
import FolderIcon from "@mui/icons-material/Folder";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";

import Header from "./Header";
import Sidebar from "./Sidebar";
import CreateProject from "../pages/CreateProject";
import ProjectsList from "../components/ProjectsList";

interface Project {
  id: number
  name: string;
  jiraId: number;
  owner: string;
  startDate?: string;
  endDate?: string;
  status: string;
}

const drawerWidth = 240;
const LOCAL_STORAGE_KEY = "projects";

const ProjectsLayout: React.FC = () => {

  const [searchTerm, setSearchTerm] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);
  const [projects, setProjects] = useState<Project[]>([]);
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    const storedProjects = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (storedProjects) {
      setProjects(JSON.parse(storedProjects));
    }
  }, []);

  useEffect(() => {
    const handleProjectSaved = () => {
      const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (stored) {
        setProjects(JSON.parse(stored));
      }
      setIsAdding(false);
      setSearchTerm("");
    };

    window.addEventListener("project-form-saved", handleProjectSaved);
    return () => {
      window.removeEventListener("project-form-saved", handleProjectSaved);
    };
  }, []);

  const handleAddProjectClick = () => {
    setIsAdding(true);
  };

  const handleCloseClick = () => {
    setIsAdding(false);
  };

  const handleFormValidityChange = useCallback((valid: boolean) => {
    setIsFormValid(valid);
  }, []);

  const handleSaveClick = () => {
    window.dispatchEvent(new Event("submit-project-form"));
  };

  const displayedProjectCount = projects.length;

  const filteredProjects = projects.filter((project) => {
    const lower = searchTerm.toLowerCase();
    return (
      project.name.toLowerCase().includes(lower) ||
      project.jiraId.toString().includes(searchTerm)
    );
  });

  return (
    <Box sx={{ display: "flex" }}>
      <Header onMenuClick={() => setMobileOpen(!mobileOpen)} />

      <Sidebar
        mobileOpen={mobileOpen}
        handleDrawerToggle={() => setMobileOpen(!mobileOpen)}
        drawerWidth={drawerWidth}
      />

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          marginTop: "64px",
          overflow: "hidden",
          height: "100vh"
        }}
      >
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
          {isAdding ? (
            <>
              <Typography variant="h5" sx={{ fontWeight: "bold", color: "black" }}>
                Add New Project
              </Typography>
              <Box sx={{ display: "flex", gap: 2 }}>
                <Button variant="outlined" onClick={handleCloseClick}>
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
            </>
          ) : (
            <>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <FolderIcon sx={{ color: "black" }} />
                <Typography variant="h5" sx={{ fontWeight: "bold", color: "black" }}>
                  Projects ({displayedProjectCount})
                </Typography>
              </Box>

              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    backgroundColor: "#fff",
                    border: "1px solid #dcdcdc",
                    px: 1.5,
                    borderRadius: "8px",
                    minWidth: 240,
                    boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
                  }}
                >
                  <SearchIcon sx={{ color: "#888", mr: 1 }} />
                  <InputBase
                    placeholder="Search by Name or Jira ID..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    sx={{ flex: 1 }}
                  />
                  {searchTerm && (
                    <IconButton onClick={() => setSearchTerm("")} size="small">
                      <ClearIcon fontSize="small" />
                    </IconButton>
                  )}
                </Box>

                <Button
                  variant="contained"
                  onClick={handleAddProjectClick}
                  sx={{
                    backgroundColor: "#906aff",
                    "&:hover": { backgroundColor: "#7a53e3" },
                  }}
                >
                  Add Project +
                </Button>
              </Box>
            </>
          )}
        </Box>

        {isAdding ? (
          <CreateProject onValidityChange={handleFormValidityChange} />
        ) : (
          <ProjectsList showGrid={false} projects={filteredProjects} />
        )}
      </Box>
    </Box>
  );
};

export default ProjectsLayout;


