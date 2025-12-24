import React, { useEffect, useState } from "react";
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
import { useNavigate } from "react-router-dom";
import ProjectsList from "../components/ProjectsList";
import type { Project } from "../common/types";

const ProjectsPage: React.FC = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState<Project[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchProjects = async () => {
      setLoading(true);
      try {
        const response = await fetch("http://localhost:5000/api/projects");
        const data = await response.json();
        setProjects(data);
      } catch (err: any) {
        alert("Failed to fetch projects: " + (err.message || err));
      }
      setLoading(false);
    };
    fetchProjects();
  }, []);


  const filteredProjects = projects.filter((p) => {
    const lower = searchTerm.toLowerCase();
    return (
      p.name.toLowerCase().includes(lower) ||
      p.jiraCode.toString().includes(searchTerm)
    );
  });

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
          flexWrap: { xs: "wrap", sm: "nowrap" },
          gap: 2,
          borderBottom: "1px solid #dcdcdc",
          pb: 2,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <FolderIcon sx={{ color: "black" }} />
          <Typography variant="h5" sx={{ fontWeight: "bold", color: "black" }}>
            Projects ({filteredProjects.length})
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
              placeholder=" or Jira Code..."
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
            onClick={() => navigate("add")}
            sx={{
              backgroundColor: "#906aff",
              borderRadius: "16px",
              "&:hover": { backgroundColor: "#7a53e3" },
              whiteSpace: "nowrap",
            }}
          >
            Add Project +
          </Button>
        </Box>
      </Box>
      <ProjectsList showGrid={false} projects={filteredProjects} loading={loading} />
    </Box>
  );
};

export default ProjectsPage;
