import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

interface EmployeeRoleCounts {
  AllEmployees: number;
  Developers: number;
  AWSTeam: number;
  Testers: number;
}

interface ProjectStatusCounts {
  Active: number;
  Inactive: number;
  InProgress: number;
}

interface StatisticsState {
  employeeRoleCounts: EmployeeRoleCounts;
  projectStatusCounts: ProjectStatusCounts;
  totalEmployees: number;
  totalProjects: number;
  loading: boolean;
  error: string | null;
}

const initialState: StatisticsState = {
  employeeRoleCounts: {
    AllEmployees: 0,
    Developers: 0,
    AWSTeam: 0,
    Testers: 0,
  },
  projectStatusCounts: {
    Active: 0,
    Inactive: 0,
    InProgress: 0,
  },
  totalEmployees: 0,
  totalProjects: 0,
  loading: false,
  error: null,
};

export const fetchStatistics = createAsyncThunk(
  "statistics/fetchStatistics",
  async () => {
    const response = await axios.get(
      `${
        import.meta.env.VITE_API_BASE_URL
      }/v-1/application/statistics/dashboard-summary`
    );
    return response.data.data;
  }
);

export const fetchEmployeeRoleCounts = createAsyncThunk(
  "statistics/fetchEmployeeRoleCounts",
  async () => {
    const response = await axios.get(
      "/v-1/application/statistics/employee-role-counts"
    );
    return response.data.data;
  }
);

export const fetchProjectStatusCounts = createAsyncThunk(
  "statistics/fetchProjectStatusCounts",
  async () => {
    const response = await axios.get(
      "/v-1/application/statistics/project-status-counts"
    );
    return response.data.data;
  }
);

const statisticsSlice = createSlice({
  name: "statistics",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Statistics
      .addCase(fetchStatistics.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStatistics.fulfilled, (state, action) => {
        state.loading = false;
        state.employeeRoleCounts = action.payload.employees;
        state.projectStatusCounts = action.payload.projects;
        state.totalEmployees = action.payload.totalEmployees;
        state.totalProjects = action.payload.totalProjects;
      })
      .addCase(fetchStatistics.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch statistics";
      })
      // Employee Role Counts
      .addCase(fetchEmployeeRoleCounts.fulfilled, (state, action) => {
        state.employeeRoleCounts = action.payload;
      })
      // Project Status Counts
      .addCase(fetchProjectStatusCounts.fulfilled, (state, action) => {
        state.projectStatusCounts = action.payload;
      });
  },
});

export const { clearError } = statisticsSlice.actions;
export default statisticsSlice.reducer;
