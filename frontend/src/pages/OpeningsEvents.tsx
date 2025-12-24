import React, { useState, useEffect, useContext } from "react";
import {
  Box,
  Card,
  Typography,
  Button,
  IconButton,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Menu,
  MenuItem,
} from "@mui/material";

import DeleteIcon from "@mui/icons-material/Delete";
import EventIcon from "@mui/icons-material/Event";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import WorkIcon from "@mui/icons-material/Work";
import MoreVertIcon from "@mui/icons-material/MoreVert";

import { UserContext } from "../components/UserContext";
import {
  OpeningsEvents as OpeningsEventsType,
  EventImage,
  JobOpening,
} from "../common/types";

import AddImageDialog from "../components/AddImageDialog";
import AddJobDialog from "../components/AddJobDialog";
import EditJobDialog from "../components/EditJobDialog"; // ⭐ NEW IMPORT

const primaryColor = "#906aff";

const OpeningsEventsPage: React.FC = () => {
  const { token } = useContext(UserContext);

  const [data, setData] = useState<OpeningsEventsType>({
    eventImages: [],
    jobOpenings: [],
  });

  const [imageDialogOpen, setImageDialogOpen] = useState(false);
  const [jobDialogOpen, setJobDialogOpen] = useState(false);

  const [editJobDialogOpen, setEditJobDialogOpen] = useState(false); // ⭐ NEW
  const [jobToEdit, setJobToEdit] = useState<JobOpening | null>(null); // ⭐ NEW

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
  }, [token]);

  const fetchData = async () => {
    if (!token) return;
    try {
      const res = await fetch("http://localhost:5000/api/openings-events", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const result = await res.json();
      setData(result);
    } catch (err) {
      console.error("Error fetching data:", err);
    }
  };

  const handleAddImage = async () => {
    if (!token || !newImage.imageUrl.trim()) return;

    try {
      const res = await fetch("http://localhost:5000/api/openings-events/images", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newImage),
      });

      const created: EventImage = await res.json();

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
    if (!token || !newJob.title.trim() || !newJob.description.trim()) return;

    try {
      const res = await fetch("http://localhost:5000/api/openings-events/jobs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newJob),
      });

      const createdJob: JobOpening = await res.json();

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
    if (!token || !updatedJob) return;

    const jobId = updatedJob._id ?? (updatedJob as any).id;

    try {
      const res = await fetch(
        `http://localhost:5000/api/openings-events/jobs/${jobId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(updatedJob),
        }
      );

      const saved: JobOpening = await res.json();

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
    if (!token || !imageToDelete) return;

    try {
      await fetch(
        `http://localhost:5000/api/openings-events/images/${imageToDelete._id}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      await fetchData();
      cancelDelete();
    } catch (err) {
      console.error("Error deleting image:", err);
    }
  };

  const handleDeleteJob = async () => {
    if (!token || !jobToDelete) return;

    try {
      const jobId = jobToDelete._id ?? (jobToDelete as any).id;

      await fetch(
        `http://localhost:5000/api/openings-events/jobs/${jobId}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      await fetchData();
      cancelDelete();
    } catch (err) {
      console.error("Error deleting job:", err);
    }
  };

  const handleRequirementKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
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
    <Box
      sx={{
        width: "100%",
        height: "calc(100vh - 80px)",
        overflowY: "auto",
        padding: "24px 32px",
        boxSizing: "border-box",
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 1.2, mb: 2 }}>
        <EventIcon sx={{ fontSize: 28, color: "black" }} />
        <Typography sx={{ fontSize: 22, fontWeight: 700 }}>
          Openings & Events
        </Typography>
      </Box>

      <Box sx={{ borderBottom: "1px solid #e0e0e0", mb: 3 }} />

      <Card sx={{ p: 3, mb: 4, borderRadius: 3 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
          <Typography sx={{ fontSize: 20, fontWeight: 600 }}>
            Event Management
          </Typography>

          <Button
            variant="contained"
            sx={{
              background: primaryColor,
              borderRadius: "20px",
              px: 3,
              textTransform: "none",
              "&:hover": { background: primaryColor },
            }}
            onClick={() => {
              setNewImage({ imageUrl: "", title: "", order: 0 });
              setImageDialogOpen(true);
            }}
          >
            Add Image
          </Button>
        </Box>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            gap: 3,
          }}
        >
          {data.eventImages.map((img) => (
            <Card
              key={img._id}
              sx={{
                p: 2,
                borderRadius: 3,
                position: "relative",
                overflow: "hidden",
                "&:hover .deleteBtn": { opacity: 1 },
              }}
            >
              <IconButton
                className="deleteBtn"
                onClick={() => confirmDeleteImage(img)}
                sx={{
                  position: "absolute",
                  top: 10,
                  right: 10,
                  opacity: 0,
                  transition: "0.2s",
                  background: "#ebebeb",
                }}
              >
                <DeleteIcon fontSize="small" />
              </IconButton>

              <Box
                sx={{
                  height: 200,
                  borderRadius: 2,
                  backgroundImage: `url(${img.imageUrl})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  mb: 2,
                }}
              />

              <Typography sx={{ fontWeight: 600 }}>{img.title}</Typography>
              <Typography variant="body2" color="text.secondary">
                Order: {img.order}
              </Typography>
            </Card>
          ))}
        </Box>
      </Card>

      {/* JOB VACANCIES */}
      <Card sx={{ p: 3, mb: 4, borderRadius: 3 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
          <Typography sx={{ fontSize: 20, fontWeight: 600 }}>
            Job Vacancies
          </Typography>

          <Button
            variant="contained"
            sx={{
              background: primaryColor,
              borderRadius: "20px",
              px: 3,
              textTransform: "none",
              "&:hover": { background: primaryColor },
            }}
            onClick={() => setJobDialogOpen(true)}
          >
            Add Opening
          </Button>
        </Box>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            gap: 3,
          }}
        >
          {data.jobOpenings.map((job) => (
            <Card
              key={job._id ?? (job as any).id}
              sx={{ p: 2, borderRadius: 3, position: "relative" }}
            >
              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography sx={{ fontWeight: 600 }}>{job.title}</Typography>

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

              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  mb: 1,
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                  <WorkIcon fontSize="small" sx={{ color: "text.secondary" }} />
                  <Typography variant="body2" color="text.secondary">
                    {job.openings}{" "}
                    {job.openings === 1 ? "Opening" : "Openings"}
                  </Typography>
                </Box>

                <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                  <LocationOnIcon
                    fontSize="small"
                    sx={{ color: "text.secondary" }}
                  />
                  <Typography variant="body2" color="text.secondary">
                    {job.location || "N/A"}
                  </Typography>
                </Box>
              </Box>

              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                {job.description}
              </Typography>

              <Box sx={{ mt: 1 }}>
                {job.requirements.map((req, i) => (
                  <Chip key={i} label={req} size="small" sx={{ mr: 1, mb: 1 }} />
                ))}
              </Box>
            </Card>
          ))}
        </Box>
      </Card>

      <Dialog open={deleteDialogOpen} onClose={cancelDelete}>
        <DialogTitle sx={{ fontWeight: 700 }}>Confirm Delete</DialogTitle>

        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this{" "}
            {imageToDelete ? "image" : "job opening"}?
          </DialogContentText>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button
            onClick={cancelDelete}
            sx={{
              color: "#906aff",
              textTransform:'none',
            }}
          >
            Cancel
          </Button>

          <Button
            onClick={imageToDelete ? handleDeleteImage : handleDeleteJob}
            sx={{
              borderRadius: "8px",
              textTransform: "none",
              background: primaryColor,
              color: "#fff",
              boxShadow:'none',
              "&:hover": { background: "#7a53e3" },
            }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      <AddImageDialog
        key={imageDialogOpen ? "open" : "closed"}
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
