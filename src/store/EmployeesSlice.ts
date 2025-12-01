/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  createSlice,
  createAsyncThunk,
  type PayloadAction,
} from "@reduxjs/toolkit";
import type { Employee } from "../common/types";
import { Errors } from "../common/labelConstants";
import { API_BASE } from "../common/apiService";

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
    const formData = new FormData();

    // Append all fields
    formData.append("name", employee.name);
    formData.append("email", employee.email);
    formData.append("role", employee.role);
    formData.append("joinDate", employee.joinDate);
    formData.append("id", employee.id);
    formData.append("skills", JSON.stringify(employee.skills));
    formData.append("laptop", employee.laptop?.toString() || "false");
    formData.append("headphones", employee.headphones?.toString() || "false");
    formData.append("monitor", employee.monitor?.toString() || "false");

    // Handle image properly
    if (employee.image) {
      // If image is base64 string, convert it to a Blob
      const base64Data = employee.image;
      // Check if it's base64
      if (base64Data.startsWith("data:image")) {
        // Extract base64 data
        const base64String = base64Data.split(",")[1] || base64Data;
        const byteCharacters = atob(base64String);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: "image/jpeg" });

        // Create a File object
        const file = new File([blob], "employee_image.jpg", {
          type: "image/jpeg",
        });
        formData.append("image", file);
      } else {
        // If it's already just base64 data
        formData.append("image", base64Data);
      }
    }

    console.log("FormData entries:"); // Debugging
    for (const pair of (formData as any).entries()) {
      console.log(pair[0] + ": " + pair[1]);
    }

    const response = await fetch(`${API_BASE}/employees/create/`, {
      method: "POST",
      body: formData,
      // Don't set Content-Type header for FormData - browser sets it automatically
    });

    if (!response.ok) {
      let errorData;
      try {
        errorData = await response.json();
      } catch {
        errorData = response.statusText || "Failed to add employee";
      }
      return rejectWithValue(errorData);
    }

    const data = await response.json();
    return data.data;
  } catch (err) {
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
    const formData = new FormData();

    for (const key in employee) {
      const typedKey = key as keyof typeof employee;
      const value = employee[typedKey];

      if (value !== undefined && value !== null) {
        if (typedKey === "skills") {
          formData.append("skills", JSON.stringify(value));
        } else if (typedKey === "image") {
          formData.append("image", value as string);
        } else {
          formData.append(typedKey, String(value));
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

    if (!response.ok) {
      let errorData;
      try {
        errorData = await response.json();
      } catch {
        errorData = response.statusText || "Failed to update employee";
      }
      return rejectWithValue(errorData);
    }

    const data = await response.json();

    return data.data;
  } catch (err) {
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

      if (!response.ok) {
        let errorData;
        try {
          errorData = await response.json();
        } catch {
          errorData = response.statusText || "Failed to delete employee";
        }
        return rejectWithValue(errorData);
      }

      return employeeId;
    } catch (err) {
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
    clearEmployeeImage: (state, action: PayloadAction<string>) => {
      const employee = state.employees.find((emp) => emp.id === action.payload);
      if (employee) {
        employee.image = null;
      }
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
