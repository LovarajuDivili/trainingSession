import {
  Box,
  Typography,
  Card,
  Button,
  IconButton,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControlLabel,
  Checkbox,
  Divider,
  Grid,
  Tooltip,
} from "@mui/material";
import { useState, useEffect } from "react";
import { useAppSelector, useAppDispatch } from "../../hooks/reduxHooks";
import {
  fetchCarouselImages,
  uploadCarouselImage,
  deleteCarouselImage,
} from "../../store/CarouselSlice";
import {
  fetchCurrentOpenings,
  createCurrentOpening,
  deleteCurrentOpening,
} from "../../store/CurrentOpeningsSlice";
import DashboardHeader from "../DashboardHeader";
import { sidebarItems } from "../../common/sidebarItems";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import { useThemeColors } from "../../hooks/useThemeColors";

const OpeningsEvents = () => {
  const colors = useThemeColors();
  const dispatch = useAppDispatch();
  const {
    images,
    loading: imagesLoading,
    error: imagesError,
  } = useAppSelector((state) => state.carousel);
  const {
    openings,
    loading: openingsLoading,
    error: openingsError,
  } = useAppSelector((state) => state.currentOpenings);

  const [imageDialogOpen, setImageDialogOpen] = useState(false);
  const [openingDialogOpen, setOpeningDialogOpen] = useState(false);
  const [deleteImagesDialogOpen, setDeleteImagesDialogOpen] = useState(false);
  const [confirmDeleteImages, setConfirmDeleteImages] = useState(false);

  // Delete All Openings Dialog
  const [deleteOpeningsDialogOpen, setDeleteOpeningsDialogOpen] =
    useState(false);
  const [confirmDeleteOpenings, setConfirmDeleteOpenings] = useState(false);

  const [newImage, setNewImage] = useState<{
    title: string;
    description: string;
    order: number;
    is_active: boolean;
    file: File | null;
  }>({
    title: "",
    description: "",
    order: 0,
    is_active: true,
    file: null,
  });

  const [newOpening, setNewOpening] = useState<{
    title: string;
    department: string;
    job_description: string;
    applicants: number;
    is_active: boolean;
    order: number;
  }>({
    title: "",
    department: "",
    job_description: "",
    applicants: 0,
    is_active: true,
    order: 0,
  });

  // Validation states
  const [imageErrors, setImageErrors] = useState({
    title: false,
    description: false,
    order: false,
    file: false,
  });

  const [openingErrors, setOpeningErrors] = useState({
    title: false,
    department: false,
    job_description: false,
    applicants: false,
    order: false,
  });

  const currentItem = sidebarItems.find(
    (item) => item.route === "/admin/openingsEvents"
  );

  useEffect(() => {
    dispatch(fetchCarouselImages(false));
    dispatch(fetchCurrentOpenings(false));
  }, [dispatch]);

  // Validate image form
  const validateImageForm = () => {
    const errors = {
      title: !newImage.title.trim(),
      description: !newImage.description.trim(),
      order: newImage.order < 0,
      file: !newImage.file,
    };
    setImageErrors(errors);
    return !Object.values(errors).some(Boolean);
  };

  // Validate opening form
  const validateOpeningForm = () => {
    const errors = {
      title: !newOpening.title.trim(),
      department: !newOpening.department.trim(),
      job_description: !newOpening.job_description.trim(),
      applicants: newOpening.applicants < 0,
      order: newOpening.order < 0,
    };
    setOpeningErrors(errors);
    return !Object.values(errors).some(Boolean);
  };

  // Check if image form is valid
  const isImageFormValid = () => {
    return (
      newImage.title.trim() &&
      newImage.description.trim() &&
      newImage.order >= 0 &&
      newImage.file !== null
    );
  };

  // Check if opening form is valid
  const isOpeningFormValid = () => {
    return (
      newOpening.title.trim() &&
      newOpening.department.trim() &&
      newOpening.job_description.trim() &&
      newOpening.applicants >= 0 &&
      newOpening.order >= 0
    );
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setNewImage({ ...newImage, file: event.target.files[0] });
      setImageErrors({ ...imageErrors, file: false });
    }
  };

  const handleImageUpload = async () => {
    if (!validateImageForm()) {
      return;
    }

    if (!newImage.file) {
      setImageErrors({ ...imageErrors, file: true });
      return;
    }

    const reader = new FileReader();
    reader.onload = async (e) => {
      const base64Image = e.target?.result as string;

      const formData = new FormData();
      formData.append("title", newImage.title);
      formData.append("description", newImage.description);
      formData.append("order", newImage.order.toString());
      formData.append("is_active", newImage.is_active.toString());
      formData.append("image_data", base64Image);

      try {
        await dispatch(uploadCarouselImage(formData)).unwrap();
        setImageDialogOpen(false);
        setNewImage({
          title: "",
          description: "",
          order: 0,
          is_active: true,
          file: null,
        });
        setImageErrors({
          title: false,
          description: false,
          order: false,
          file: false,
        });
      } catch (error) {
        console.error("Failed to upload image:", error);
      }
    };

    reader.readAsDataURL(newImage.file);
  };

  const handleOpeningCreate = async () => {
    if (!validateOpeningForm()) {
      return;
    }

    try {
      await dispatch(createCurrentOpening(newOpening)).unwrap();
      setOpeningDialogOpen(false);
      setNewOpening({
        title: "",
        department: "",
        job_description: "",
        applicants: 0,
        is_active: true,
        order: 0,
      });
      setOpeningErrors({
        title: false,
        department: false,
        job_description: false,
        applicants: false,
        order: false,
      });
    } catch (error) {
      console.error("Failed to create opening:", error);
    }
  };

  const handleImageDelete = async (imageId: string) => {
    if (window.confirm("Are you sure you want to delete this image?")) {
      try {
        await dispatch(deleteCarouselImage(imageId)).unwrap();
      } catch (error) {
        console.error("Failed to delete image:", error);
      }
    }
  };

  const handleOpeningDelete = async (openingId: string) => {
    if (window.confirm("Are you sure you want to delete this opening?")) {
      try {
        await dispatch(deleteCurrentOpening(openingId)).unwrap();
      } catch (error) {
        console.error("Failed to delete opening:", error);
      }
    }
  };

  // Reset errors when dialog closes
  const handleImageDialogClose = () => {
    setImageDialogOpen(false);
    setImageErrors({
      title: false,
      description: false,
      order: false,
      file: false,
    });
  };

  const handleOpeningDialogClose = () => {
    setOpeningDialogOpen(false);
    setOpeningErrors({
      title: false,
      department: false,
      job_description: false,
      applicants: false,
      order: false,
    });
  };

  const loading = imagesLoading || openingsLoading;
  const error = imagesError || openingsError;

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "200px",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 0 }}>
      <DashboardHeader
        title={currentItem?.label || "Openings & Events"}
        icon={currentItem?.icon}
      />

      {error && (
        <Typography color="error" sx={{ mb: 0 }}>
          Error: {error}
        </Typography>
      )}

      {/* Carousel Images Section */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Typography
          variant="h6"
          sx={{ fontWeight: 400, color: colors.text.primary }}
        >
          Event Management
        </Typography>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setImageDialogOpen(true)}
            sx={{
              backgroundColor: colors.primary.main,
              "&:hover": { backgroundColor: colors.primary.dark },
            }}
          >
            Add Image
          </Button>
          <Tooltip title="Delete All">
            <span>
              <IconButton
                onClick={() => setDeleteImagesDialogOpen(true)}
                disabled={images.length === 0}
                sx={{
                  color: colors.status.error,
                  backgroundColor: colors.background.white,
                  border: `1px solid ${colors.border.light}`,
                  "&:hover": {
                    backgroundColor: colors.status.error + "20",
                  },
                  "&:disabled": {
                    color: colors.text.disabled,
                    backgroundColor: colors.background.disabled,
                  },
                }}
              >
                <DeleteIcon />
              </IconButton>
            </span>
          </Tooltip>
        </Box>
      </Box>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
          gap: 2,
          mb: 4,
        }}
      >
        {images.map((image) => (
          <Card
            key={image.id}
            sx={{
              p: 1,
              borderRadius: 3,
              boxShadow: `0 4px 20px ${colors.shadow.card}`,
              backgroundColor: colors.background.card,
            }}
          >
            <Box sx={{ position: "relative" }}>
              <img
                src={image.image_data}
                alt={image.title}
                style={{
                  width: "100%",
                  height: "200px",
                  objectFit: "cover",
                  borderRadius: "8px",
                }}
              />
              <IconButton
                onClick={() => handleImageDelete(image.id)}
                sx={{
                  position: "absolute",
                  top: 8,
                  right: 8,
                  backgroundColor: colors.overlay.white70,
                  "&:hover": { backgroundColor: colors.overlay.white90 },
                }}
              >
                <DeleteIcon />
              </IconButton>
            </Box>

            <Typography
              variant="h6"
              sx={{
                mt: 0,
                fontWeight: 600,
                color: colors.text.primary1,
                mb: -1,
              }}
            >
              {image.title}
            </Typography>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: -2,
              }}
            >
              <Typography
                variant="caption"
                sx={{ color: colors.text.secondary }}
              >
                Order: {image.order}
              </Typography>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={image.is_active}
                    disabled
                    sx={{ "&.Mui-disabled": { color: colors.primary.main } }}
                  />
                }
                label="Active"
                sx={{ m: 0 }}
              />
            </Box>
          </Card>
        ))}
      </Box>

      {images.length === 0 && (
        <Typography
          sx={{ textAlign: "center", color: colors.status.warning, mb: 4 }}
        >
          No images found. Upload some images to get started.
        </Typography>
      )}

      {/* Divider */}
      <Divider sx={{ my: 2, borderColor: colors.border.light }} />

      {/* Current Openings Section */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 1,
        }}
      >
        <Typography
          variant="h6"
          sx={{ fontWeight: 400, color: colors.text.primary }}
        >
          Job Vacancies
        </Typography>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setOpeningDialogOpen(true)}
            sx={{
              backgroundColor: colors.primary.main,
              "&:hover": { backgroundColor: colors.primary.dark },
            }}
          >
            Add Opening
          </Button>
          <Tooltip title="Delete All">
            <span>
              <IconButton
                onClick={() => setDeleteOpeningsDialogOpen(true)}
                disabled={openings.length === 0}
                sx={{
                  color: colors.status.error,
                  backgroundColor: colors.background.white,
                  border: `1px solid ${colors.border.light}`,
                  "&:hover": {
                    backgroundColor: colors.status.error + "20",
                  },
                  "&:disabled": {
                    color: colors.text.disabled,
                    backgroundColor: colors.background.disabled,
                  },
                }}
              >
                <DeleteIcon />
              </IconButton>
            </span>
          </Tooltip>
        </Box>
      </Box>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
          gap: 1,
        }}
      >
        {openings.map((opening) => (
          <Card
            key={opening.id}
            sx={{
              p: 1,
              borderRadius: 3,
              boxShadow: `0 4px 20px ${colors.shadow.card}`,
              backgroundColor: colors.background.card,
            }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                mb: 1,
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 600,
                  color: colors.text.primary1,
                  flex: 1,
                  mr: 2,
                }}
              >
                {opening.title}
              </Typography>
              <IconButton
                onClick={() => handleOpeningDelete(opening.id)}
                sx={{
                  backgroundColor: colors.overlay.black04,
                  "&:hover": { backgroundColor: colors.overlay.black08 },
                }}
                size="small"
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Box>
            {opening.job_description && (
              <Typography
                variant="body2"
                sx={{
                  color: colors.text.secondary,
                  mb: 1,
                  fontSize: "0.875rem",
                  lineHeight: 1.4,
                }}
              >
                {opening.job_description.length > 100
                  ? `${opening.job_description.substring(0, 100)}...`
                  : opening.job_description}
              </Typography>
            )}
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 0,
              }}
            >
              <Typography variant="body2" sx={{ color: colors.text.primary1 }}>
                {opening.department}
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  fontWeight: 600,
                  color: colors.primary.main,
                }}
              >
                {opening.applicants} applicants
              </Typography>
            </Box>

            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Typography
                variant="caption"
                sx={{ color: colors.text.secondary }}
              >
                <strong> Order: {opening.order}</strong>
              </Typography>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={opening.is_active}
                    disabled
                    sx={{ "&.Mui-disabled": { color: colors.primary.main } }}
                  />
                }
                label="Active"
                sx={{ m: 0 }}
              />
            </Box>
          </Card>
        ))}
      </Box>

      {openings.length === 0 && (
        <Typography
          sx={{ textAlign: "center", color: colors.status.warning, mt: 4 }}
        >
          No current openings found. Add some openings to get started.
        </Typography>
      )}

      {/* Image Upload Dialog */}
      <Dialog
        open={imageDialogOpen}
        onClose={handleImageDialogClose}
        maxWidth="sm"
        fullWidth
        sx={{
          "& .MuiDialog-paper": {
            borderRadius: "15px",
          },
        }}
      >
        <DialogTitle>Upload New Carousel Image</DialogTitle>
        <Divider />
        <DialogContent>
          {/* First Row: Title, Description and Order */}
          <Grid container spacing={2} sx={{ mb: 2, mt: 1 }}>
            <Grid item xs={4}>
              <TextField
                autoFocus
                margin="dense"
                label="Title"
                fullWidth
                variant="outlined"
                value={newImage.title}
                onChange={(e) =>
                  setNewImage({ ...newImage, title: e.target.value })
                }
                sx={{ width: "175px" }}
                error={imageErrors.title}
                helperText={imageErrors.title ? "Title is required" : ""}
                required
              />
            </Grid>
            <Grid item xs={4}>
              <TextField
                margin="dense"
                label="Description"
                fullWidth
                variant="outlined"
                multiline
                sx={{ width: "175px" }}
                value={newImage.description}
                onChange={(e) =>
                  setNewImage({ ...newImage, description: e.target.value })
                }
                error={imageErrors.description}
                helperText={imageErrors.description ? "Description is required" : ""}
                required
              />
            </Grid>
            <Grid item xs={4}>
              <TextField
                margin="dense"
                label="Order"
                type="number"
                fullWidth
                variant="outlined"
                value={newImage.order}
                onChange={(e) =>
                  setNewImage({
                    ...newImage,
                    order: parseInt(e.target.value) || 0,
                  })
                }
                sx={{ borderBlockColor: colors.primary.main, width: "170px" }}
                error={imageErrors.order}
                helperText={imageErrors.order ? "Order must be 0 or greater" : ""}
                required
              />
            </Grid>
          </Grid>

          {/* Second Row: Select Image and Active Checkbox */}
          <Grid container spacing={2} sx={{ mb: 2 }} alignItems="center">
            <Grid item xs={6}>
              <Button
                variant="outlined"
                component="label"
                fullWidth
                sx={{
                  color: colors.primary.main,
                  height: "56px",
                  mt: "8px",
                  width: "175px",
                  borderColor: imageErrors.file ? colors.status.error : undefined,
                }}
              >
                Select Image
                <input
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={handleFileChange}
                />
              </Button>
              {imageErrors.file && (
                <Typography variant="caption" sx={{ color: colors.status.error, mt: 0.5, display: 'block' }}>
                  Image is required
                </Typography>
              )}
            </Grid>
            <Grid item xs={6}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={newImage.is_active}
                    onChange={(e) =>
                      setNewImage({ ...newImage, is_active: e.target.checked })
                    }
                    sx={{
                      color: colors.primary.main,
                      "&.Mui-checked": {
                        color: colors.primary.main,
                      },
                    }}
                  />
                }
                label="Active"
                sx={{ mb: 0, ml: 0.5 }}
              />
            </Grid>
          </Grid>

          {newImage.file && (
            <Typography
              variant="body2"
              sx={{ mt: 0, color: colors.text.secondary }}
            >
              Selected: {newImage.file.name}
            </Typography>
          )}
        </DialogContent>

        {/* Buttons aligned to right end */}
        <DialogActions>
          <Button
            sx={{ color: colors.primary.main, mt: -2 }}
            onClick={handleImageDialogClose}
          >
            Cancel
          </Button>
          <Button
            onClick={handleImageUpload}
            variant="contained"
            sx={{ backgroundColor: colors.primary.main, mt: -2 }}
            disabled={!isImageFormValid()}
          >
            Upload
          </Button>
        </DialogActions>
      </Dialog>

      {/* Opening Create Dialog */}
      <Dialog
        open={openingDialogOpen}
        onClose={handleOpeningDialogClose}
        maxWidth="sm"
        fullWidth
        sx={{
          "& .MuiDialog-paper": {
            borderRadius: "15px",
          },
        }}
      >
        <DialogTitle>Create New Current Opening</DialogTitle>
        <Divider />
        <DialogContent>
          {/* First Row: Title, Department and Description */}
          <Grid container spacing={2} sx={{ mb: 2, mt: 1 }}>
            <Grid item xs={4}>
              <TextField
                autoFocus
                margin="dense"
                label="Job Title"
                fullWidth
                variant="outlined"
                value={newOpening.title}
                onChange={(e) =>
                  setNewOpening({ ...newOpening, title: e.target.value })
                }
                sx={{ width: "170px" }}
                error={openingErrors.title}
                helperText={openingErrors.title ? "Job title is required" : ""}
                required
              />
            </Grid>
            <Grid item xs={4}>
              <TextField
                margin="dense"
                label="Department"
                fullWidth
                variant="outlined"
                value={newOpening.department}
                onChange={(e) =>
                  setNewOpening({ ...newOpening, department: e.target.value })
                }
                sx={{ width: "170px" }}
                error={openingErrors.department}
                helperText={openingErrors.department ? "Department is required" : ""}
                required
              />
            </Grid>
            <Grid item xs={4}>
              <TextField
                margin="dense"
                label="Job Description"
                fullWidth
                variant="outlined"
                multiline
                value={newOpening.job_description}
                onChange={(e) =>
                  setNewOpening({
                    ...newOpening,
                    job_description: e.target.value,
                  })
                }
                sx={{ width: "170px" }}
                error={openingErrors.job_description}
                helperText={openingErrors.job_description ? "Job description is required" : ""}
                required
              />
            </Grid>
          </Grid>

          {/* Second Row: Number of Applicants, Order and Checkbox */}
          <Grid container spacing={2} sx={{ mb: 2 }} alignItems="center">
            <Grid item xs={4}>
              <TextField
                margin="dense"
                label="Number of Applicants"
                type="number"
                fullWidth
                variant="outlined"
                value={newOpening.applicants}
                onChange={(e) =>
                  setNewOpening({
                    ...newOpening,
                    applicants: parseInt(e.target.value) || 0,
                  })
                }
                sx={{ width: "170px" }}
                error={openingErrors.applicants}
                helperText={openingErrors.applicants ? "Must be 0 or greater" : ""}
                required
              />
            </Grid>
            <Grid item xs={4}>
              <TextField
                margin="dense"
                label="Order"
                type="number"
                fullWidth
                variant="outlined"
                value={newOpening.order}
                onChange={(e) =>
                  setNewOpening({
                    ...newOpening,
                    order: parseInt(e.target.value) || 0,
                  })
                }
                sx={{ width: "170px" }}
                error={openingErrors.order}
                helperText={openingErrors.order ? "Order must be 0 or greater" : ""}
                required
              />
            </Grid>
            <Grid item xs={4}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={newOpening.is_active}
                    onChange={(e) =>
                      setNewOpening({
                        ...newOpening,
                        is_active: e.target.checked,
                      })
                    }
                    sx={{
                      color: colors.primary.main,
                      "&.Mui-checked": {
                        color: colors.primary.main,
                      },
                    }}
                  />
                }
                label="Active"
                sx={{ mb: 0, ml: 0.5 }}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button
            sx={{ color: colors.primary.main }}
            onClick={handleOpeningDialogClose}
          >
            Cancel
          </Button>
          <Button
            onClick={handleOpeningCreate}
            variant="contained"
            sx={{ backgroundColor: colors.primary.main }}
            disabled={!isOpeningFormValid()}
          >
            Create
          </Button>
        </DialogActions>
      </Dialog>

      {/* Rest of your dialogs remain the same */}
      <Dialog
        open={deleteImagesDialogOpen}
        onClose={() => {
          setDeleteImagesDialogOpen(false);
          setConfirmDeleteImages(false);
        }}
        maxWidth="xs"
        fullWidth
        sx={{
          "& .MuiDialog-paper": {
            borderRadius: "15px",
            padding: 1,
          },
        }}
      >
        <DialogTitle>Delete All Images?</DialogTitle>
        <Divider />

        <DialogContent>
          <Typography sx={{ color: colors.text.secondary, mb: 1 }}>
            Are you sure you want to delete <strong>ALL carousel images</strong>
            ? This action cannot be undone.
          </Typography>

          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Checkbox
              checked={confirmDeleteImages}
              onChange={(e) => setConfirmDeleteImages(e.target.checked)}
              sx={{
                color: colors.ui.checkbox,
                "&.Mui-checked": {
                  color: colors.ui.checkbox,
                },
              }}
            />
            <Typography>I understand and want to proceed</Typography>
          </Box>
        </DialogContent>

        <DialogActions>
          <Button
            onClick={() => {
              setDeleteImagesDialogOpen(false);
              setConfirmDeleteImages(false);
            }}
            sx={{ color: colors.primary.main }}
          >
            Cancel
          </Button>
          <Button
            disabled={!confirmDeleteImages}
            variant="contained"
            sx={{
              backgroundColor: colors.status.error,
              "&:disabled": { backgroundColor: colors.status.error + "60" },
            }}
            onClick={async () => {
              for (const img of images) {
                await dispatch(deleteCarouselImage(img.id));
              }
              setDeleteImagesDialogOpen(false);
              setConfirmDeleteImages(false);
            }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={deleteOpeningsDialogOpen}
        onClose={() => {
          setDeleteOpeningsDialogOpen(false);
          setConfirmDeleteOpenings(false);
        }}
        maxWidth="xs"
        fullWidth
        sx={{
          "& .MuiDialog-paper": {
            borderRadius: "15px",
            padding: 1,
          },
        }}
      >
        <DialogTitle>Delete All Openings?</DialogTitle>
        <Divider />

        <DialogContent>
          <Typography sx={{ color: colors.text.secondary, mb: 1 }}>
            Are you sure you want to delete <strong>ALL job openings</strong>?
            This action cannot be undone.
          </Typography>

          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Checkbox
              checked={confirmDeleteOpenings}
              onChange={(e) => setConfirmDeleteOpenings(e.target.checked)}
              sx={{
                color: colors.ui.checkbox,
                "&.Mui-checked": {
                  color: colors.ui.checkbox,
                },
              }}
            />
            <Typography>I understand and want to proceed</Typography>
          </Box>
        </DialogContent>

        <DialogActions>
          <Button
            onClick={() => {
              setDeleteOpeningsDialogOpen(false);
              setConfirmDeleteOpenings(false);
            }}
            sx={{ color: colors.primary.main }}
          >
            Cancel
          </Button>
          <Button
            disabled={!confirmDeleteOpenings}
            variant="contained"
            sx={{
              backgroundColor: colors.status.error,
              "&:disabled": { backgroundColor: colors.status.error + "60" },
            }}
            onClick={async () => {
              for (const opening of openings) {
                await dispatch(deleteCurrentOpening(opening.id));
              }
              setDeleteOpeningsDialogOpen(false);
              setConfirmDeleteOpenings(false);
            }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default OpeningsEvents;