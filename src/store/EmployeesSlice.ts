import {
  createSlice,
  createAsyncThunk,
  type PayloadAction,
} from "@reduxjs/toolkit";
import type { Employee } from "../common/types";

// Async thunks for API calls
const API_BASE = "/api"; // This will proxy to http://localhost:8000/v-1/application
export const fetchEmployees = createAsyncThunk(
  "employees/fetchEmployees",
  async () => {
    const response = await fetch(`${API_BASE}/employees`);
    const data = await response.json();
    return data.data;
  }
);

export const addEmployeeAPI = createAsyncThunk<
  Employee,
  Employee,
  { rejectValue: string }
>("employees/addEmployee", async (employee, { rejectWithValue }) => {
  try {
    console.log("Sending employee data:", employee);
    const response = await fetch(`${API_BASE}/employees`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(employee),
    });

    console.log("Response status:", response.status);

    if (!response.ok) {
      let errorMsg = "Failed to add employee";
      try {
        const errorData = await response.json();
        console.log("Error response:", errorData);
        errorMsg = errorData?.detail || errorMsg;
      } catch {
        errorMsg = response.statusText || errorMsg;
      }
      return rejectWithValue(errorMsg);
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

export const deleteEmployeeAPI = createAsyncThunk(
  "employees/deleteEmployee",
  async (employeeId: string) => {
    await fetch(`/api/employees/${employeeId}`, {
      method: "DELETE",
    });
    return employeeId;
  }
);

const employeesSlice = createSlice({
  name: "employees",
  initialState: {
    employees: [] as Employee[],
    loading: false,
    error: null as string | null,
  },
  reducers: {
    setEmployees: (state, action: PayloadAction<Employee[]>) => {
      state.employees = action.payload;
    },
    addEmployee: (state, action: PayloadAction<Employee>) => {
      state.employees.push(action.payload);
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchEmployees.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEmployees.fulfilled, (state, action) => {
        state.loading = false;
        state.employees = action.payload;
      })
      .addCase(fetchEmployees.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch employees";
      })
      .addCase(addEmployeeAPI.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addEmployeeAPI.fulfilled, (state, action) => {
        state.loading = false;
        state.employees.push(action.payload);
      })
      .addCase(addEmployeeAPI.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to add employee";
      });
  },
});

export const { setEmployees, addEmployee } = employeesSlice.actions;

export default employeesSlice.reducer;
