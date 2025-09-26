import {
  createSlice,
  createAsyncThunk,
  type PayloadAction,
} from "@reduxjs/toolkit";
import type { Employee } from "../common/types";

// Async thunks for API calls
export const fetchEmployees = createAsyncThunk(
  "employees/fetchEmployees",
  async () => {
    const response = await fetch("/api/employees");
    const data = await response.json();
    return data.data;
  }
);

export const addEmployeeAPI = createAsyncThunk(
  "employees/addEmployee",
  async (employee: Employee) => {
    const response = await fetch("/api/employees", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(employee),
    });
    const data = await response.json();
    return data.data;
  }
);

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
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchEmployees.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchEmployees.fulfilled, (state, action) => {
        state.loading = false;
        state.employees = action.payload;
      })
      .addCase(fetchEmployees.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch employees";
      })
      .addCase(addEmployeeAPI.fulfilled, (state, action) => {
        state.employees.push(action.payload);
      });
  },
});

export const { setEmployees, addEmployee } = employeesSlice.actions;

export default employeesSlice.reducer;
