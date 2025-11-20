import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export interface CarouselImage {
  id: string;
  title: string;
  description?: string;
  image_data: string;
  image_url?: string;
  is_active: boolean;
  order: number;
  created_at?: string;
  updated_at?: string;
}

interface CarouselState {
  images: CarouselImage[];
  loading: boolean;
  error: string | null;
}

const initialState: CarouselState = {
  images: [],
  loading: false,
  error: null,
};

export const fetchCarouselImages = createAsyncThunk(
  "carousel/fetchImages",
  async (activeOnly: boolean = true) => {
    const response = await fetch(
      `http://localhost:8000/v-1/application/carousel/?active_only=${activeOnly}`
    );
    if (!response.ok) {
      throw new Error("Failed to fetch carousel images");
    }
    return await response.json();
  }
);

export const uploadCarouselImage = createAsyncThunk(
  "carousel/uploadImage",
  async (formData: FormData) => {
    const response = await fetch(
      "http://localhost:8000/v-1/application/carousel/",
      {
        method: "POST",
        body: formData,
      }
    );
    if (!response.ok) {
      throw new Error("Failed to upload image");
    }
    return await response.json();
  }
);

export const deleteCarouselImage = createAsyncThunk(
  "carousel/deleteImage",
  async (imageId: string) => {
    const response = await fetch(
      `http://localhost:8000/v-1/application/carousel/${imageId}`,
      {
        method: "DELETE",
      }
    );
    if (!response.ok) {
      throw new Error("Failed to delete image");
    }
    return imageId;
  }
);

const carouselSlice = createSlice({
  name: "carousel",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch images
      .addCase(fetchCarouselImages.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCarouselImages.fulfilled, (state, action) => {
        state.loading = false;
        state.images = action.payload;
      })
      .addCase(fetchCarouselImages.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch images";
      })
      // Upload image
      .addCase(uploadCarouselImage.fulfilled, (state, action) => {
        state.images.push(action.payload);
      })
      .addCase(uploadCarouselImage.rejected, (state, action) => {
        state.error = action.error.message || "Failed to upload image";
      })
      // Delete image
      .addCase(deleteCarouselImage.fulfilled, (state, action) => {
        state.images = state.images.filter(img => img.id !== action.payload);
      })
      .addCase(deleteCarouselImage.rejected, (state, action) => {
        state.error = action.error.message || "Failed to delete image";
      });
  },
});

export const { clearError } = carouselSlice.actions;
export default carouselSlice.reducer;