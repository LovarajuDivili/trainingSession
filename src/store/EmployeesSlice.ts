/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  createSlice,
  createAsyncThunk,
  type PayloadAction,
} from "@reduxjs/toolkit";
import type { Employee } from "../common/types";
import { Errors } from "../common/labelConstants";

const API_BASE = "/api";
export const fetchEmployees = createAsyncThunk(
  "employees/fetchEmployees",
  async () => {
    const response = await fetch(`${API_BASE}/employees/get_all/`);
    const data = await response.json();
    return data.data;
  }
);

export const addEmployeeAPI = createAsyncThunk<
  Employee,
  Employee,
  { rejectValue: { detail: string } }
>("employees/addEmployee", async (employee, { rejectWithValue }) => {
  try {
    console.log("Sending employee data:", employee);
    const formData = new FormData();

    for (const key in employee) {
      const value = (employee as any)[key];
      if (value !== undefined && value !== null) {
        if (key === "skills") {
          formData.append("skills", JSON.stringify(value));
        } else if (key === "image" && value instanceof File) {
          formData.append("image", value);
        } else {
          formData.append(key, value);
        }
      }
    }

    const response = await fetch(`${API_BASE}/employees/create/`, {
      method: "POST",
      body: formData,
    });

    console.log("Response status:", response.status);

    if (!response.ok) {
      let errorData;
      try {
        errorData = await response.json();
        console.log("Error response:", errorData);
      } catch {
        errorData = response.statusText || "Failed to add employee";
      }
      return rejectWithValue(errorData);
    }

    const data = await response.json();
    console.log("Success response:", data);
    return data.data;
  } catch (err) {
    console.error("Fetch error:", err);
    return rejectWithValue({
      detail: err instanceof Error ? err.message : "Unknown error",
    });
  }
});

export const updateEmployeeAPI = createAsyncThunk<
  Employee,
  Employee,
  { rejectValue: { detail: string } }
>("employees/updateEmployee", async (employee, { rejectWithValue }) => {
  try {
    console.log("Updating employee data:", employee);

    const formData = new FormData();

    for (const key in employee) {
      const value = (employee as any)[key];
      if (value !== undefined && value !== null) {
        if (key === "skills") {
          formData.append("skills", JSON.stringify(value));
        } else if (key === "image" && value instanceof File) {
          formData.append("image", value);
        } else {
          formData.append(key, value);
        }
      }
    }

    const response = await fetch(
      `${API_BASE}/employees/update/${employee.id}`,
      {
        method: "PUT",
        body: formData,
      }
    );

    console.log("Update response status:", response.status);

    if (!response.ok) {
      let errorData;
      try {
        errorData = await response.json();
        console.log("Update error response:", errorData);
      } catch {
        errorData = response.statusText || "Failed to update employee";
      }
      return rejectWithValue(errorData);
    }

    const data = await response.json();
    console.log("Update success response:", data);
    return data.data;
  } catch (err) {
    console.error("Update fetch error:", err);
    return rejectWithValue({
      detail: err instanceof Error ? err.message : "Unknown error",
    });
  }
});

export const deleteEmployeeAPI = createAsyncThunk<
  string,
  string,
  { rejectValue: { detail: string } }
>(
  "employees/deleteEmployee",
  async (employeeId: string, { rejectWithValue }) => {
    try {
      const response = await fetch(
        `${API_BASE}/employees/delete/${employeeId}`,
        {
          method: "DELETE",
        }
      );

      console.log("Delete response status:", response.status);

      if (!response.ok) {
        let errorData;
        try {
          errorData = await response.json();
          console.log("Delete error response:", errorData);
        } catch {
          errorData = response.statusText || "Failed to delete employee";
        }
        return rejectWithValue(errorData);
      }

      const data = await response.json();
      console.log("Delete success response:", data);
      return employeeId;
    } catch (err) {
      console.error("Delete fetch error:", err);
      return rejectWithValue({
        detail: err instanceof Error ? err.message : "Unknown error",
      });
    }
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
        state.error = action.error.message || Errors.FAILED_TO_FETCH;
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
        state.error = action.payload?.detail || Errors.FAILED_TO_ADD;
      })
      .addCase(updateEmployeeAPI.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateEmployeeAPI.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.employees.findIndex(
          (emp) => emp.id === action.payload.id
        );
        if (index !== -1) {
          state.employees[index] = action.payload;
        }
      })
      .addCase(updateEmployeeAPI.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.detail || Errors.FAILED_TO_UPDATE;
      })
      .addCase(deleteEmployeeAPI.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteEmployeeAPI.fulfilled, (state, action) => {
        state.loading = false;
        state.employees = state.employees.filter(
          (emp) => emp.id !== action.payload
        );
      })
      .addCase(deleteEmployeeAPI.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.detail || Errors.FAILED_TO_DELETE;
      });
  },
});

export const { setEmployees, addEmployee } = employeesSlice.actions;

export default employeesSlice.reducer;
