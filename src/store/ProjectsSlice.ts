// src/store/projectsSlice.ts
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export interface Project {
  projectName: string;
  projectOwner: string;
  jiraId: string;
  status: string;
  startDate: string;
  endDate: string;
  id: string;
}

interface ProjectsState {
  projects: Project[];
}

const initialState: ProjectsState = {
  projects: [],
};

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
  },
});

export const { setProjects, addProject, removeProject } = projectsSlice.actions;
export default projectsSlice.reducer;
