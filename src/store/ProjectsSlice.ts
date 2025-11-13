import {
  createSlice,
  createAsyncThunk,
  type PayloadAction,
} from "@reduxjs/toolkit";
import { Errors } from "../common/labelConstants";
import { API_BASE } from "../common/apiService";
import type { Project, ProjectBase, ProjectsState } from "../common/types";

const initialState: ProjectsState = {
  projects: [],
  loading: false,
  error: null,
};

export const fetchProjects = createAsyncThunk(
  "projects/fetchProjects",
  async () => {
    const response = await fetch(`${API_BASE}/projects/get_all/`);
    if (!response.ok) {
      throw new Error(`Failed to fetch projects: ${response.status}`);
    }
    const data = await response.json();
    return data.data;
  }
);

export const addProjectAPI = createAsyncThunk<
  Project,
  ProjectBase,
  { rejectValue: string }
>("projects/addProject", async (project, { rejectWithValue }) => {
  try {
    const response = await fetch(`${API_BASE}/projects/create/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(project),
    });

    if (!response.ok) {
      let errorData;
      try {
        const text = await response.text();
        console.log("Raw error text:", text);
        errorData = JSON.parse(text);
      } catch (parseError) {
        console.log("Failed to parse error response:", parseError);
        return rejectWithValue(response.statusText || "Failed to add project");
      }

      if (errorData.detail) {
        return rejectWithValue(errorData.detail);
      } else if (errorData.message) {
        return rejectWithValue(errorData.message);
      } else {
        return rejectWithValue(
          `Error ${response.status}: ${response.statusText}`
        );
      }
    }

    const data = await response.json();
    console.log("Success response:", data);
    return data.data;
  } catch (err) {
    console.error("Fetch error:", err);
    return rejectWithValue(
      err instanceof Error ? err.message : "Unknown error"
    );
  }
});

export const updateProjectAPI = createAsyncThunk<
  Project,
  { id: string; projectData: ProjectBase },
  { rejectValue: string }
>(
  "projects/updateProject",
  async ({ id, projectData }, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE}/projects/update/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(projectData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData.detail || "Failed to update project");
      }

      const data = await response.json();
      return data.data;
    } catch (err) {
      return rejectWithValue(
        err instanceof Error ? err.message : "Unknown error"
      );
    }
  }
);

export const deleteProjectAPI = createAsyncThunk<
  string,
  string,
  { rejectValue: string }
>("projects/deleteProject", async (projectId: string, { rejectWithValue }) => {
  try {
    const response = await fetch(`${API_BASE}/projects/delete/${projectId}`, {
      method: "DELETE",
    });

    console.log("Delete response status:", response.status);

    if (!response.ok) {
      let errorData;
      try {
        errorData = await response.json();
        console.log("Delete error response:", errorData);
      } catch {
        errorData = response.statusText || "Failed to delete project";
      }
      return rejectWithValue(errorData.detail || errorData);
    }

    const data = await response.json();
    console.log("Delete success response:", data);
    return projectId;
  } catch (err) {
    console.error("Delete fetch error:", err);
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
      })
      .addCase(updateProjectAPI.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProjectAPI.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.projects.findIndex(
          (proj) => proj.id === action.payload.id
        );
        if (index !== -1) {
          state.projects[index] = action.payload;
        }
      })
      .addCase(updateProjectAPI.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || Errors.FAILED_TO_UPDATE;
      })
      .addCase(deleteProjectAPI.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteProjectAPI.fulfilled, (state, action) => {
        state.loading = false;
        state.projects = state.projects.filter(
          (proj) => proj.id !== action.payload
        );
      })
      .addCase(deleteProjectAPI.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || Errors.FAILED_TO_DELETE;
      });
  },
});

export const { setProjects, addProject, removeProject, clearError } =
  projectsSlice.actions;
export default projectsSlice.reducer;
