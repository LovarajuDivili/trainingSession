import { configureStore } from "@reduxjs/toolkit";
import projectsReducer from "./ProjectsSlice";
import employeesReducer from "./EmployeesSlice";
import statisticsReducer from "./StatisticsSlice";

export const store = configureStore({
  reducer: {
    projects: projectsReducer,
    employees: employeesReducer,
    statistics: statisticsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
