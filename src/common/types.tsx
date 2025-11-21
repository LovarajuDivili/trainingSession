/* eslint-disable @typescript-eslint/no-explicit-any */
import type { ThemeOptions } from "@mui/material/styles";
import type { JSX, ReactNode } from "react";

export interface DropdownItem {
  value: string;
  label: string;
  icon: JSX.Element;
}

export interface Employee {
  image?: string | null;
  photo?: string;
  name: string;
  email: string;
  role: string;
  joinDate: string;
  id: string;
  skills: string[];
  laptop: boolean;
  headphones: boolean;
  monitor: boolean;
}

export interface DashboardProps {
  selectedItem: string;
}

export interface DashboardHeaderProps {
  title: string;
  icon?: ReactNode;
  count?: number;
  showSearch?: boolean;
  searchText?: string;
  onSearchChange?: (value: string) => void;
  showAddButton?: boolean;
  onAddClick?: () => void;
  addButtonLabel?: string;
  rightContent?: ReactNode;
  gridIcon?: ReactNode;
}

export interface ForgotPasswordProps {
  open: boolean;
  handleClose: () => void;
}

export interface ProtectedRouteProps {
  children: ReactNode;
  requiredRole?: string;
}

export interface AddProjectProps {
  open?: boolean;
  onClose?: () => void;
  project?: Project | null;
  onSuccess?: () => void;
}

export interface ProjectFormFieldsProps {
  projects: {
    projectName: string;
    projectOwner: string;
    jiraId: string;
    status: string;
    startDate: string;
    endDate: string;
  };
  handleChange: (field: string, value: string) => void;
  startDateError?: string;
  endDateError?: string;
}

export interface CartItem {
  _id: string;
  category: string;
  brand: string;
  price: number;
  stock: number;
  quantity: number;
}

export interface CartContextType {
  cart: CartItem[];
  addToCart: (item: unknown) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  updateCartForUser: (newUser: any) => void; 
}

export interface CartDrawerContextType {
  isDrawerOpen: boolean;
  openDrawer: () => void;
  closeDrawer: () => void;
}

export interface OrderItem {
  name: string;
  brand: string;
  category: string;
  hours: string;
}

export interface OrdersContextType {
  orders: OrderItem[];
  addOrder: (items: CartItem[]) => void;
}

export interface CartItem {
  brand: string;
  category: string;
  quantity: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (
    name: string,
    email: string,
    password: string,
    role: string
  ) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
  isSigningUp: boolean;
  isLoggingIn: boolean;
}

export interface AuthProviderProps {
  children: ReactNode;
}

export interface ProjectBase {
  projectName: string;
  projectOwner: string;
  jiraId: string;
  status: string;
  startDate: string;
  endDate: string;
}

export interface Project extends ProjectBase {
  id: string;
}

export interface ProjectsState {
  projects: Project[];
  loading: boolean;
  error: string | null;
}

export interface EmployeeRoleCounts {
  AllEmployees: number;
  Developers: number;
  AWSTeam: number;
  Testers: number;
}

export interface ProjectStatusCounts {
  Active: number;
  Inactive: number;
  InProgress: number;
}

export interface StatisticsState {
  employeeRoleCounts: EmployeeRoleCounts;
  projectStatusCounts: ProjectStatusCounts;
  totalEmployees: number;
  totalProjects: number;
  loading: boolean;
  error: string | null;
}

export interface NoDataProps {
  imageSrc: string;
  altText?: string;
  message: string;
}

export interface AppThemeProps {
  children: React.ReactNode;
  disableCustomTheme?: boolean;
  themeComponents?: ThemeOptions["components"];
}

export interface APIError {
  detail?: string;
  message?: string;
}
