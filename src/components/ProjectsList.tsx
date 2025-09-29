import React from "react";
import {
  Typography,
  Box,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";

interface Project {
  id: number;
  name: string;
  jiraId: number;
  owner: string;
  startDate?: string;
  endDate?: string;
  status: string;
}

interface Props {
  showGrid: boolean;
  projects: Project[];
}

const ProjectsList: React.FC<Props> = ({ showGrid, projects }) => {
  if (projects.length === 0) {
    return (
      <Typography variant="body1" sx={{ mt: 4, color: "#777" }}>
        No projects found.
      </Typography>
    );
  }

  if (showGrid) {
    return (
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "repeat(auto-fill, minmax(280px, 1fr))",
          },
          gap: 3,
          justifyContent: "start",
        }}
      >
        {projects.map((project) => (
          <Card
            key={project.id}
            elevation={2}
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              p: 2,
              borderRadius: 2,
              minHeight: 160,
              boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
              transition: "transform 0.2s ease, box-shadow 0.2s ease",
              "&:hover": {
                transform: "translateY(-4px)",
                boxShadow: "0 4px 16px rgba(0,0,0,0.12)",
              },
            }}
          >
            <CardContent sx={{ p: 0 }}>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                {project.name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Jira ID: {project.jiraId}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Owner: {project.owner}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Status: {project.status}
              </Typography>
              {project.startDate && (
                <Typography variant="body2" color="text.secondary">
                  Start: {project.startDate}
                </Typography>
              )}
              {project.endDate && (
                <Typography variant="body2" color="text.secondary">
                  End: {project.endDate}
                </Typography>
              )}
            </CardContent>
          </Card>
        ))}
      </Box>
    );
  }

  // List/Table view
  return (
    <TableContainer component={Paper} sx={{ maxWidth: "100%", mx: 0 }}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell><strong>Project Name</strong></TableCell>
            <TableCell><strong>Jira ID</strong></TableCell>
            <TableCell><strong>Owner</strong></TableCell>
            <TableCell><strong>Status</strong></TableCell>
            <TableCell><strong>Start Date</strong></TableCell>
            <TableCell><strong>End Date</strong></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {projects.map((project) => (
            <TableRow key={project.id} hover>
              <TableCell>{project.name}</TableCell>
              <TableCell>{project.jiraId}</TableCell>
              <TableCell>{project.owner}</TableCell>
              <TableCell>{project.status}</TableCell>
              <TableCell>{project.startDate || "-"}</TableCell>
              <TableCell>{project.endDate || "-"}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default ProjectsList;
