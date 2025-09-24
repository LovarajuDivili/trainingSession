import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Employee } from "../common/types";

interface EmployeesState {
  employees: Employee[];
}

const initialState: EmployeesState = {
  employees: [],
};

const employeesSlice = createSlice({
  name: "employees",
  initialState,
  reducers: {
    setEmployees: (state, action: PayloadAction<Employee[]>) => {
      state.employees = action.payload;
    },
    addEmployee: (state, action: PayloadAction<Employee>) => {
      state.employees.push(action.payload);
    },
    removeEmployee: (state, action: PayloadAction<string>) => {
      state.employees = state.employees.filter(
        (emp) => emp.id !== action.payload
      );
    },
  },
});

export const { setEmployees, addEmployee, removeEmployee } =
  employeesSlice.actions;

export default employeesSlice.reducer;
