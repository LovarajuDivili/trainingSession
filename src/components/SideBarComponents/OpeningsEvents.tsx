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

  const currentItem = sidebarItems.find(
    (item) => item.route === "/admin/openingsEvents"
  );

  useEffect(() => {
    dispatch(fetchCarouselImages(false));
    dispatch(fetchCurrentOpenings(false));
  }, [dispatch]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setNewImage({ ...newImage, file: event.target.files[0] });
    }
  };

  const handleImageUpload = async () => {
    if (!newImage.file) {
      alert("Please select an image file");
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
      } catch (error) {
        console.error("Failed to upload image:", error);
      }
    };

    reader.readAsDataURL(newImage.file);
  };

  const handleOpeningCreate = async () => {
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

  // New functions to delete all images and all openings
  const handleDeleteAllImages = async () => {
    if (
      window.confirm(
        "Are you sure you want to delete ALL carousel images? This action cannot be undone."
      )
    ) {
      try {
        // Delete all images one by one
        for (const image of images) {
          await dispatch(deleteCarouselImage(image.id)).unwrap();
        }
      } catch (error) {
        console.error("Failed to delete all images:", error);
      }
    }
  };

  const handleDeleteAllOpenings = async () => {
    if (
      window.confirm(
        "Are you sure you want to delete ALL current openings? This action cannot be undone."
      )
    ) {
      try {
        // Delete all openings one by one
        for (const opening of openings) {
          await dispatch(deleteCurrentOpening(opening.id)).unwrap();
        }
      } catch (error) {
        console.error("Failed to delete all openings:", error);
      }
    }
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
          <IconButton
            onClick={handleDeleteAllImages}
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
          sx={{ textAlign: "center", color: colors.text.secondary, mb: 4 }}
        >
          No carousel images found. Upload some images to get started.
        </Typography>
      )}

      {/* Divider */}
      <Divider sx={{ my: 4, borderColor: colors.border.light }} />

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
          <IconButton
            onClick={handleDeleteAllOpenings}
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
          sx={{ textAlign: "center", color: colors.text.secondary, mt: 4 }}
        >
          No current openings found. Add some openings to get started.
        </Typography>
      )}

      {/* Image Upload Dialog */}
      <Dialog
        open={imageDialogOpen}
        onClose={() => setImageDialogOpen(false)}
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
            onClick={() => setImageDialogOpen(false)}
          >
            Cancel
          </Button>
          <Button
            onClick={handleImageUpload}
            variant="contained"
            sx={{ backgroundColor: colors.primary.main, mt: -2 }}
          >
            Upload
          </Button>
        </DialogActions>
      </Dialog>

      {/* Opening Create Dialog */}
      <Dialog
        open={openingDialogOpen}
        onClose={() => setOpeningDialogOpen(false)}
        maxWidth="sm"
        fullWidth
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
            onClick={() => setOpeningDialogOpen(false)}
          >
            Cancel
          </Button>
          <Button
            onClick={handleOpeningCreate}
            variant="contained"
            sx={{ backgroundColor: colors.primary.main }}
          >
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default OpeningsEvents;
