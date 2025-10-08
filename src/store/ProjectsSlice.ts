import {
  createSlice,
  createAsyncThunk,
  type PayloadAction,
} from "@reduxjs/toolkit";
import { Errors } from "../common/labelConstants";
import { API_BASE } from "../common/apiService";

export interface Project {
  projectName: string;
  projectOwner: string;
  jiraId: string;
  status: string;
  startDate: string;
  endDate: string;
  id: string;
}

interface ProjectsState {
  projects: Project[];
  loading: boolean;
  error: string | null;
}

const initialState: ProjectsState = {
  projects: [],
  loading: false,
  error: null,
};

export const fetchProjects = createAsyncThunk(
  "projects/fetchProjects",
  async () => {
    const response = await fetch(`${API_BASE}/projects`);
    if (!response.ok) {
      throw new Error(`Failed to fetch projects: ${response.status}`);
    }
    const data = await response.json();
    return data.data;
  }
);

export const addProjectAPI = createAsyncThunk<
  Project,
  Project,
  { rejectValue: string }
>("projects/addProject", async (project, { rejectWithValue }) => {
  try {
    const response = await fetch(`${API_BASE}/projects`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(project),
    });

    if (!response.ok) {
      let errorMsg = "Failed to add project";
      try {
        const errorData = await response.json();
        errorMsg = errorData?.detail || errorMsg;
      } catch {
        errorMsg = response.statusText || errorMsg;
      }
      return rejectWithValue(errorMsg);
    }

    const data = await response.json();
    return data.data;
  } catch (err) {
    return rejectWithValue(
      err instanceof Error ? err.message : "Unknown error"
    );
  }
});

const projectsSlice = createSlice({
  name: "projects",
  initialState,
  reducers: {
    setProjects: (state, action: PayloadAction<Project[]>) => {
      state.projects = action.payload;
    },
    addProject: (state, action: PayloadAction<Project>) => {
      state.projects.push(action.payload);
    },
    removeProject: (state, action: PayloadAction<string>) => {
      state.projects = state.projects.filter(
        (project) => project.id !== action.payload
      );
    },
    clearError: (state) => {
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchProjects.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProjects.fulfilled, (state, action) => {
        state.loading = false;
        state.projects = action.payload;
      })
      .addCase(fetchProjects.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || Errors.FAILED_TO_FETCH;
      })
      .addCase(addProjectAPI.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addProjectAPI.fulfilled, (state, action) => {
        state.loading = false;
        state.projects.push(action.payload);
      })
      .addCase(addProjectAPI.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || Errors.FAILED_TO_ADD;
      });
  },
});

export const { setProjects, addProject, removeProject, clearError } =
  projectsSlice.actions;
export default projectsSlice.reducer;
