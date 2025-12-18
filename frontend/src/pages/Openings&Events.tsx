import React, { useState, useEffect } from "react";
import {
  Box,
  Card,
  Typography,
  Button,
  IconButton,
  Chip,
  Dialog,
  DialogTitle,
  DialogActions,
  Menu,
  MenuItem,
} from "@mui/material";

import DeleteIcon from "@mui/icons-material/Delete";
import EventIcon from "@mui/icons-material/Event";
import MoreVertIcon from "@mui/icons-material/MoreVert";

import type {
  OpeningsEvents as OpeningsEventsType,
  EventImage,
  JobOpening,
} from "../common/types";

import AddImageDialog from "../components/ImageDialog";
import AddJobDialog from "../components/JobDialog";
import EditJobDialog from "../components/JobDialogAdd";
import { apiRequest } from "../Services/apiService";

const primaryColor = "#906aff";

const OpeningsEventsPage: React.FC = () => {
  const [data, setData] = useState<OpeningsEventsType>({
    eventImages: [],
    jobOpenings: [],
  });

  const [imageDialogOpen, setImageDialogOpen] = useState(false);
  const [jobDialogOpen, setJobDialogOpen] = useState(false);
  const [editJobDialogOpen, setEditJobDialogOpen] = useState(false);

  const [jobToEdit, setJobToEdit] = useState<JobOpening | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [imageToDelete, setImageToDelete] = useState<EventImage | null>(null);
  const [jobToDelete, setJobToDelete] = useState<JobOpening | null>(null);

  const [newImage, setNewImage] = useState({
    imageUrl: "",
    title: "",
    order: 0,
  });

  const [newJob, setNewJob] = useState({
    title: "",
    description: "",
    location: "",
    openings: 0,
    requirements: [] as string[],
  });

  const [requirementInput, setRequirementInput] = useState("");
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [menuJobId, setMenuJobId] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const result = await apiRequest<OpeningsEventsType>({
        endpoint: "/api/openings-events",
        method: "GET",
      });
      setData(result);
    } catch (err) {
      console.error("Error fetching data:", err);
    }
  };

  const handleAddImage = async () => {
    if (!newImage.imageUrl.trim()) return;

    try {
      const created = await apiRequest<EventImage, typeof newImage>({
        endpoint: "/api/openings-events/images",
        method: "POST",
        payload: newImage,
      });

      setData((prev) => ({
        ...prev,
        eventImages: [...prev.eventImages, created],
      }));

      setNewImage({ imageUrl: "", title: "", order: 0 });
      setImageDialogOpen(false);
    } catch (err) {
      console.error("Add image error:", err);
    }
  };

  const handleAddJob = async () => {
    if (!newJob.title.trim() || !newJob.description.trim()) return;

    try {
      const createdJob = await apiRequest<JobOpening, typeof newJob>({
        endpoint: "/api/openings-events/jobs",
        method: "POST",
        payload: newJob,
      });

      setData((prev) => ({
        ...prev,
        jobOpenings: [...prev.jobOpenings, createdJob],
      }));

      setJobDialogOpen(false);
      setNewJob({
        title: "",
        description: "",
        location: "",
        openings: 0,
        requirements: [],
      });
      setRequirementInput("");
    } catch (err) {
      console.error("Error adding job:", err);
    }
  };

  const handleUpdateJob = async (updatedJob: JobOpening) => {
    const jobId = updatedJob._id ?? (updatedJob as any).id;
    if (!jobId) return;

    try {
      const saved = await apiRequest<JobOpening, JobOpening>({
        endpoint: `/api/openings-events/jobs/${jobId}`,
        method: "PUT",
        payload: updatedJob,
      });

      setData((prev) => ({
        ...prev,
        jobOpenings: prev.jobOpenings.map((j) =>
          (j._id ?? (j as any).id) === jobId ? saved : j
        ),
      }));

      setEditJobDialogOpen(false);
      setJobToEdit(null);
    } catch (err) {
      console.error("Error updating job:", err);
    }
  };

  const confirmDeleteImage = (image: EventImage) => {
    setImageToDelete(image);
    setJobToDelete(null);
    setDeleteDialogOpen(true);
  };

  const confirmDeleteJob = (job: JobOpening) => {
    setJobToDelete(job);
    setImageToDelete(null);
    setDeleteDialogOpen(true);
    handleMenuClose();
  };

  const cancelDelete = () => {
    setImageToDelete(null);
    setJobToDelete(null);
    setDeleteDialogOpen(false);
  };

  const handleDeleteImage = async () => {
    if (!imageToDelete?._id) return;

    await apiRequest({
      endpoint: `/api/openings-events/images/${imageToDelete._id}`,
      method: "DELETE",
    });

    fetchData();
    cancelDelete();
  };

  const handleDeleteJob = async () => {
    const jobId = jobToDelete?._id ?? (jobToDelete as any)?.id;
    if (!jobId) return;

    await apiRequest({
      endpoint: `/api/openings-events/jobs/${jobId}`,
      method: "DELETE",
    });

    fetchData();
    cancelDelete();
  };

  const handleRequirementKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Enter" && requirementInput.trim()) {
      setNewJob((prev) => ({
        ...prev,
        requirements: [...prev.requirements, requirementInput.trim()],
      }));
      setRequirementInput("");
      e.preventDefault();
    }
  };

  const removeRequirement = (req: string) => {
    setNewJob((prev) => ({
      ...prev,
      requirements: prev.requirements.filter((r) => r !== req),
    }));
  };

  const handleMenuClick = (e: React.MouseEvent<HTMLElement>, jobId: string) => {
    setAnchorEl(e.currentTarget);
    setMenuJobId(jobId);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setMenuJobId(null);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
        <EventIcon sx={{ mr: 1 }} />
        <Typography fontSize={22} fontWeight={700}>
          Openings & Events
        </Typography>
      </Box>

      {/* EVENTS */}
      <Card sx={{ p: 3, mb: 4 }}>
        <Box display="flex" justifyContent="space-between" mb={2}>
          <Typography fontWeight={600}>Event Management</Typography>
          <Button
            variant="contained"
            sx={{ background: primaryColor }}
            onClick={() => setImageDialogOpen(true)}
          >
            Add Image
          </Button>
        </Box>

        <Box display="grid" gridTemplateColumns="repeat(2,1fr)" gap={2}>
          {data.eventImages.map((img) => (
            <Card key={img._id} sx={{ p: 2, position: "relative" }}>
              <IconButton
                onClick={() => confirmDeleteImage(img)}
                sx={{ position: "absolute", top: 8, right: 8 }}
              >
                <DeleteIcon fontSize="small" />
              </IconButton>

              <Box
                sx={{
                  height: 180,
                  backgroundImage: `url(${img.imageUrl})`,
                  backgroundSize: "cover",
                  borderRadius: 2,
                  mb: 1,
                }}
              />

              <Typography fontWeight={600}>{img.title}</Typography>
              <Typography variant="body2">Order: {img.order}</Typography>
            </Card>
          ))}
        </Box>
      </Card>

      <Card sx={{ p: 3 }}>
        <Box display="flex" justifyContent="space-between" mb={2}>
          <Typography fontWeight={600}>Job Vacancies</Typography>
          <Button
            variant="contained"
            sx={{ background: primaryColor }}
            onClick={() => setJobDialogOpen(true)}
          >
            Add Opening
          </Button>
        </Box>

        <Box display="grid" gridTemplateColumns="repeat(2,1fr)" gap={2}>
          {data.jobOpenings.map((job) => (
            <Card key={job._id ?? (job as any).id} sx={{ p: 2 }}>
              <Box display="flex" justifyContent="space-between">
                <Typography fontWeight={600}>{job.title}</Typography>
                <IconButton
                  size="small"
                  onClick={(e) =>
                    handleMenuClick(e, job._id ?? (job as any).id)
                  }
                >
                  <MoreVertIcon fontSize="small" />
                </IconButton>
              </Box>

              <Menu
                anchorEl={anchorEl}
                open={
                  menuJobId === (job._id ?? (job as any).id) &&
                  Boolean(anchorEl)
                }
                onClose={handleMenuClose}
              >
                <MenuItem
                  onClick={() => {
                    setJobToEdit(job);
                    setEditJobDialogOpen(true);
                    handleMenuClose();
                  }}
                >
                  Edit
                </MenuItem>
                <MenuItem onClick={() => confirmDeleteJob(job)}>
                  Delete
                </MenuItem>
              </Menu>

              <Typography variant="body2">{job.description}</Typography>

              <Box mt={1}>
                {job.requirements.map((r, i) => (
                  <Chip key={i} label={r} size="small" sx={{ mr: 1 }} />
                ))}
              </Box>
            </Card>
          ))}
        </Box>
      </Card>

      <Dialog open={deleteDialogOpen} onClose={cancelDelete}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogActions>
          <Button onClick={cancelDelete}>Cancel</Button>
          <Button
            variant="contained"
            onClick={imageToDelete ? handleDeleteImage : handleDeleteJob}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      <AddImageDialog
        open={imageDialogOpen}
        onClose={() => setImageDialogOpen(false)}
        onSubmit={handleAddImage}
        newImage={newImage}
        setNewImage={setNewImage}
      />

      <AddJobDialog
        open={jobDialogOpen}
        onClose={() => setJobDialogOpen(false)}
        onSubmit={handleAddJob}
        newJob={newJob}
        setNewJob={setNewJob}
        requirementInput={requirementInput}
        setRequirementInput={setRequirementInput}
        handleRequirementKeyDown={handleRequirementKeyDown}
        removeRequirement={removeRequirement}
      />

      {jobToEdit && (
        <EditJobDialog
          open={editJobDialogOpen}
          onClose={() => {
            setEditJobDialogOpen(false);
            setJobToEdit(null);
          }}
          job={jobToEdit}
          onUpdate={handleUpdateJob}
        />
      )}
    </Box>
  );
};

export default OpeningsEventsPage;
