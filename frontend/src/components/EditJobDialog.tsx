import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Typography,
  IconButton,
  Button,
  Box,
  Chip,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

import { JobOpening } from "../common/types";

const primaryColor = "#906aff";

const textFieldSx = {
  "& .MuiOutlinedInput-root": { borderRadius: "10px" },
  "& .MuiOutlinedInput-notchedOutline": { borderColor: "#e0e0e0" },
  "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#e0e0e0" },
  "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
    borderColor: "#e0e0e0",
  },
};

interface EditJobDialogProps {
  open: boolean;
  onClose: () => void;
  job: JobOpening | null;
  onUpdate: (updatedJob: JobOpening) => void;
}

const EditJobDialog: React.FC<EditJobDialogProps> = ({
  open,
  onClose,
  job,
  onUpdate,
}) => {
  const [editJob, setEditJob] = useState<JobOpening>({
    _id: "",
    title: "",
    description: "",
    location: "",
    openings: 0,
    requirements: [],
  });

  const [originalJob, setOriginalJob] = useState<JobOpening | null>(null);
  const [requirementInput, setRequirementInput] = useState("");

  useEffect(() => {
    if (job) {
      const formattedJob = {
        _id: job._id,
        title: job.title,
        description: job.description ?? "",
        location: job.location ?? "",
        openings: job.openings ?? 0,
        requirements: [...job.requirements],
      };

      setEditJob(formattedJob);
      setOriginalJob(formattedJob); 
    }
  }, [job, open]);

  const handleRequirementKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Enter" && requirementInput.trim()) {
      setEditJob((prev) => ({
        ...prev,
        requirements: [...prev.requirements, requirementInput.trim()],
      }));
      setRequirementInput("");
      e.preventDefault();
    }
  };

  const removeRequirement = (req: string) => {
    setEditJob((prev) => ({
      ...prev,
      requirements: prev.requirements.filter((r) => r !== req),
    }));
  };

  const isFormValid =
    editJob.title.trim() !== "" &&
    editJob.location.trim() !== "" &&
    Number.isFinite(editJob.openings) &&
    editJob.requirements.length > 0;

  const hasChanges =
    originalJob &&
    JSON.stringify(editJob) !== JSON.stringify(originalJob);

  const handleSave = () => {
    if (isFormValid && hasChanges) {
      onUpdate(editJob);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: { width: "55vw", maxWidth: 900, borderRadius: "12px", p: "8px 0" },
      }}
    >
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          fontSize: "1.4rem",
          px: 3,
          pt: 2,
        }}
      >
        Edit Job Opening
        <IconButton onClick={onClose} sx={{ color: "black" }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <Box sx={{ borderBottom: "1px solid #e0e0e0", mx: 3 }} />

      <DialogContent sx={{ px: 3 }}>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
          <Box sx={{ display: "flex", gap: 2 }}>
            <Box sx={{ flex: 1 }}>
              <Typography sx={{ fontSize: 13, mb: 0.5 }}>
                Job Title *
              </Typography>
              <TextField
                fullWidth
                variant="outlined"
                value={editJob.title}
                onChange={(e) =>
                  setEditJob((prev) => ({ ...prev, title: e.target.value }))
                }
                sx={textFieldSx}
              />
            </Box>

            <Box sx={{ flex: 1 }}>
              <Typography sx={{ fontSize: 13, mb: 0.5 }}>
                Location *
              </Typography>
              <TextField
                fullWidth
                variant="outlined"
                value={editJob.location}
                onChange={(e) =>
                  setEditJob((prev) => ({ ...prev, location: e.target.value }))
                }
                sx={textFieldSx}
              />
            </Box>
          </Box>

          <Box>
            <Typography sx={{ fontSize: 13, mb: 0.5 }}>Description</Typography>
            <TextField
              fullWidth
              multiline
              rows={3}
              variant="outlined"
              value={editJob.description}
              onChange={(e) =>
                setEditJob((prev) => ({ ...prev, description: e.target.value }))
              }
              sx={textFieldSx}
            />
          </Box>

          <Box sx={{ display: "flex", gap: 2 }}>
            <Box sx={{ flex: 1 }}>
              <Typography sx={{ fontSize: 13, mb: 0.5 }}>
                Number of Openings *
              </Typography>
              <TextField
                fullWidth
                type="number"
                variant="outlined"
                value={editJob.openings}
                onChange={(e) =>
                  setEditJob((prev) => ({
                    ...prev,
                    openings: Number(e.target.value),
                  }))
                }
                sx={textFieldSx}
              />
            </Box>
            <Box sx={{ flex: 1 }} />
          </Box>

          {/* REQUIREMENTS */}
          <Box>
            <Typography sx={{ fontSize: 13, mb: 0.5 }}>Requirements *</Typography>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Press Enter to add requirement"
              value={requirementInput}
              onChange={(e) => setRequirementInput(e.target.value)}
              onKeyDown={handleRequirementKeyDown}
              sx={textFieldSx}
            />

            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mt: 1 }}>
              {editJob.requirements.map((req, i) => (
                <Chip key={i} label={req} onDelete={() => removeRequirement(req)} />
              ))}
            </Box>
          </Box>
        </Box>
      </DialogContent>

      <Box sx={{ borderTop: "1px solid #e0e0e0", mx: 3 }} />

      <DialogActions sx={{ justifyContent: "flex-end", px: 3, pb: 3 }}>
        <Button
          variant="outlined"
          onClick={onClose}
          sx={{
            mr: 1,
            borderRadius: "20px",
            px: 4,
            textTransform: "none",
            background: primaryColor,
            color: "#fff",
          }}
        >
          Cancel
        </Button>

        <Button
          variant="contained"
          disabled={!isFormValid || !hasChanges}
          onClick={handleSave}
          sx={{
            borderRadius: "20px",
            px: 4,
            textTransform: "none",
            background:
              isFormValid && hasChanges ? primaryColor : "#d3d3d3",
            color: "#fff",
          }}
        >
          Save Changes
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditJobDialog;
