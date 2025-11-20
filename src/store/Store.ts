import { configureStore } from "@reduxjs/toolkit";
import projectsReducer from "./ProjectsSlice";
import employeesReducer from "./EmployeesSlice";
import statisticsReducer from "./StatisticsSlice";
import carouselReducer from "./CarouselSlice";
import currentOpeningsReducer from "./CurrentOpeningsSlice";

export const store = configureStore({
  reducer: {
    projects: projectsReducer,
    employees: employeesReducer,
    statistics: statisticsReducer,
    carousel: carouselReducer,
    currentOpenings: currentOpeningsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
