import { createSlice, createAsyncThunk, } from "@reduxjs/toolkit";

export interface CurrentOpening {
  id: string;
  title: string;
  department: string;
  applicants: number;
  is_active: boolean;
  order: number;
  created_at?: string;
  updated_at?: string;
}

interface CurrentOpeningsState {
  openings: CurrentOpening[];
  loading: boolean;
  error: string | null;
}

const initialState: CurrentOpeningsState = {
  openings: [],
  loading: false,
  error: null,
};

export const fetchCurrentOpenings = createAsyncThunk(
  "currentOpenings/fetchOpenings",
  async (activeOnly: boolean = true) => {
    const response = await fetch(
      `http://localhost:8000/v-1/application/current-openings/?active_only=${activeOnly}`
    );
    if (!response.ok) {
      throw new Error("Failed to fetch current openings");
    }
    return await response.json();
  }
);

export const createCurrentOpening = createAsyncThunk(
  "currentOpenings/createOpening",
  async (openingData: Omit<CurrentOpening, 'id' | 'created_at' | 'updated_at'>) => {
    const response = await fetch(
      "http://localhost:8000/v-1/application/current-openings/",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(openingData),
      }
    );
    if (!response.ok) {
      throw new Error("Failed to create opening");
    }
    return await response.json();
  }
);

export const deleteCurrentOpening = createAsyncThunk(
  "currentOpenings/deleteOpening",
  async (openingId: string) => {
    const response = await fetch(
      `http://localhost:8000/v-1/application/current-openings/${openingId}`,
      {
        method: "DELETE",
      }
    );
    if (!response.ok) {
      throw new Error("Failed to delete opening");
    }
    return openingId;
  }
);

const currentOpeningsSlice = createSlice({
  name: "currentOpenings",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch openings
      .addCase(fetchCurrentOpenings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCurrentOpenings.fulfilled, (state, action) => {
        state.loading = false;
        state.openings = action.payload;
      })
      .addCase(fetchCurrentOpenings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch openings";
      })
      // Create opening
      .addCase(createCurrentOpening.fulfilled, (state, action) => {
        state.openings.push(action.payload);
      })
      .addCase(createCurrentOpening.rejected, (state, action) => {
        state.error = action.error.message || "Failed to create opening";
      })
      // Delete opening
      .addCase(deleteCurrentOpening.fulfilled, (state, action) => {
        state.openings = state.openings.filter(opening => opening.id !== action.payload);
      })
      .addCase(deleteCurrentOpening.rejected, (state, action) => {
        state.error = action.error.message || "Failed to delete opening";
      });
  },
});

export const { clearError } = currentOpeningsSlice.actions;
export default currentOpeningsSlice.reducer;