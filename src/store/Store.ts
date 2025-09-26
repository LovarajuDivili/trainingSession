import { configureStore } from "@reduxjs/toolkit";
import projectsReducer from "./ProjectsSlice";
import employeesReducer from "./EmployeesSlice";

export const store = configureStore({
  reducer: {
    projects: projectsReducer,
    employees: employeesReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
