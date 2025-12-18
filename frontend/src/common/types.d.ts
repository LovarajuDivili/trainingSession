export interface MenuItemType {
  label: string;
  path: string;
}

export interface Employee {
  projectName: string;
  id: string;
  name: string;
  email: string;
  role: string;
  joinDate: string;
  skills: string[];
}

export interface Project {
  _id?: string;
  id?: number;
  name: string;
  jiraCode: number;
  owner: string;
  startDate?: string;
  endDate?: string;
  status: string;
}

export interface EventImage {
  _id?: string;
  imageUrl: string;
  title?: string;
  order: number;
}

export interface JobOpening {
  _id?: string;
  title: string;
  description: string;
  location: string;
  openings: number;
  requirements: string[];
}

export interface OpeningsEvents {
  _id?: string;
  userId?: string;
  eventImages: EventImage[];
  jobOpenings: JobOpening[];
}
