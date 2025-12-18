import React from "react";
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

const primaryColor = "#906aff";

const textFieldSx = {
  "& .MuiOutlinedInput-root": { borderRadius: "10px" },
  "& .MuiOutlinedInput-notchedOutline": { borderColor: "#e0e0e0" },
  "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#e0e0e0" },
  "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
    borderColor: "#e0e0e0",
  },
};

interface AddJobDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: () => void;
  newJob: {
    title: string;
    description: string;
    location: string;
    openings: number;
    requirements: string[];
  };
  setNewJob: React.Dispatch<React.SetStateAction<any>>;
  requirementInput: string;
  setRequirementInput: React.Dispatch<React.SetStateAction<string>>;
  handleRequirementKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  removeRequirement: (req: string) => void;
}

const AddJobDialog: React.FC<AddJobDialogProps> = ({
  open,
  onClose,
  onSubmit,
  newJob,
  setNewJob,
  requirementInput,
  setRequirementInput,
  handleRequirementKeyDown,
  removeRequirement,
}) => {
  const isFormValid =
    newJob.title.trim() !== "" &&
    newJob.location.trim() !== "" &&
    Number.isFinite(newJob.openings) &&
    newJob.requirements.length > 0;

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
        Add Job Opening
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
                placeholder="Enter job title"
                value={newJob.title}
                onChange={(e) =>
                  setNewJob((prev: any) => ({ ...prev, title: e.target.value }))
                }
                sx={textFieldSx}
              />
            </Box>

            <Box sx={{ flex: 1 }}>
              <Typography sx={{ fontSize: 13, mb: 0.5 }}>Location *</Typography>
              <TextField
                fullWidth
                variant="outlined"
                placeholder="Enter location"
                value={newJob.location}
                onChange={(e) =>
                  setNewJob((prev: any) => ({
                    ...prev,
                    location: e.target.value,
                  }))
                }
                sx={textFieldSx}
              />
            </Box>
          </Box>

          <Box>
            <Typography sx={{ fontSize: 13, mb: 0.5 }}>Description</Typography>
            <TextField
              fullWidth
              variant="outlined"
              multiline
              rows={3}
              placeholder="Enter description"
              value={newJob.description}
              onChange={(e) =>
                setNewJob((prev: any) => ({
                  ...prev,
                  description: e.target.value,
                }))
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
                variant="outlined"
                type="number"
                placeholder="0"
                value={newJob.openings}
                onChange={(e) =>
                  setNewJob((prev: any) => ({
                    ...prev,
                    openings: Number(e.target.value),
                  }))
                }
                sx={textFieldSx}
              />
            </Box>
            <Box sx={{ flex: 1 }} />
          </Box>

          <Box>
            <Typography sx={{ fontSize: 13, mb: 0.5 }}>
              Requirements *
            </Typography>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Press Enter to add requirement"
              value={requirementInput}
              onChange={(e) => setRequirementInput(e.target.value)}
              onKeyDown={handleRequirementKeyDown}
              sx={textFieldSx}
            />
            <Typography sx={{ fontSize: "0.8rem", mt: 0.5 }}>
              Press Enter to add requirement
            </Typography>

            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mt: 1 }}>
              {newJob.requirements.map((req, i) => (
                <Chip
                  key={i}
                  label={req}
                  onDelete={() => removeRequirement(req)}
                />
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
            "&:hover": { background: "#7a53e3" },
          }}
        >
          Cancel
        </Button>

        <Button
          variant="contained"
          disabled={!isFormValid}
          onClick={onSubmit}
          sx={{
            borderRadius: "20px",
            px: 4,
            textTransform: "none",
            background: isFormValid ? primaryColor : "#d3d3d3",
            color: "#fff",
            "&:hover": {
              background: isFormValid ? "#7a53e3" : "#d3d3d3",
            },
          }}
        >
          Add Opening
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddJobDialog;
