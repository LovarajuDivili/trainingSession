import React, { useRef } from "react";
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
  Avatar,
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

interface AddImageDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: () => void;
  newImage: { imageUrl: string; title: string; order: number };
  setNewImage: React.Dispatch<
    React.SetStateAction<{ imageUrl: string; title: string; order: number }>
  >;
}

const AddImageDialog: React.FC<AddImageDialogProps> = ({
  open,
  onClose,
  onSubmit,
  newImage,
  setNewImage,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [imageFileName, setImageFileName] = React.useState("");

  const isFormValid =
    newImage.imageUrl.trim() !== "" &&
    newImage.title.trim() !== "" &&
    Number.isFinite(newImage.order);

  const handleFileButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImageFileName(file.name);

    const reader = new FileReader();
    reader.onload = () => {
      setNewImage((prev) => ({
        ...prev,
        imageUrl: reader.result as string,
      }));
    };
    reader.readAsDataURL(file);
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
        Add Event Image
        <IconButton onClick={onClose} sx={{ color: "black" }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <Box sx={{ borderBottom: "1px solid #e0e0e0", mx: 3 }} />

      <DialogContent sx={{ px: 3 }}>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
          <Box>
            <Typography sx={{ fontSize: 13, mb: 1.5 }}>Image *</Typography>

            <Box sx={{ display: "flex", alignItems: "center", gap: 3 }}>
              <Avatar
                sx={{ width: 80, height: 80, bgcolor: "#f0f0f0" }}
                src={newImage.imageUrl || undefined}
              />

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                style={{ display: "none" }}
              />

              <Box sx={{ flex: 1 }}>
                <Button
                  variant="outlined"
                  onClick={handleFileButtonClick}
                  sx={{
                    borderRadius: "20px",
                    textTransform: "none",
                    borderColor: primaryColor,
                    color: primaryColor,
                    px: 3,
                    "&:hover": {
                      borderColor: "#7a53e3",
                      backgroundColor: "#7a53e3",
                      color: "#fff",
                    },
                  }}
                >
                  Add Image
                </Button>

                {imageFileName && (
                  <Typography
                    variant="caption"
                    sx={{ display: "block", mt: 0.5, color: "text.secondary" }}
                  >
                    {imageFileName}
                  </Typography>
                )}
              </Box>
            </Box>
          </Box>

          <Box sx={{ display: "flex", gap: 2 }}>
            <Box sx={{ flex: 1 }}>
              <Typography sx={{ fontSize: 13, mb: 0.5 }}>Title *</Typography>
              <TextField
                fullWidth
                variant="outlined"
                placeholder="Enter title"
                value={newImage.title}
                onChange={(e) =>
                  setNewImage((prev) => ({ ...prev, title: e.target.value }))
                }
                sx={textFieldSx}
              />
            </Box>

            <Box sx={{ flex: 1 }}>
              <Typography sx={{ fontSize: 13, mb: 0.5 }}>Order *</Typography>
              <TextField
                fullWidth
                variant="outlined"
                type="number"
                placeholder="0"
                value={newImage.order}
                onChange={(e) =>
                  setNewImage((prev) => ({
                    ...prev,
                    order: Number(e.target.value),
                  }))
                }
                sx={textFieldSx}
              />
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
          Add Image
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddImageDialog;
