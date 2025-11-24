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
  product_id: string;
  category: string;
  brand: string;
  price: number;
  stock: number;
  quantity: number;
}

export interface CartContextType {
  cart: CartItem[];
  addToCart: (item: any) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  updateCartForUser: (newUser: any) => void;
  isLoading?: boolean;
}

export interface CartDrawerContextType {
  isDrawerOpen: boolean;
  openDrawer: () => void;
  closeDrawer: () => void;
}

export interface BillingDetails {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  district?: string;
  postalCode?: string;
  cardName?: string;
  cardNumber?: string;
  expiryDate?: string;
  cvv?: string;
}

export interface OrderItem {
  _id: string;
  product_id: string;
  brand: string;
  category: string;
  price: number;
  quantity: number;
  stock: number;
}

export interface Order {
  id: string;
  user_id: string;
  items: OrderItem[];
  billing_details: BillingDetails;
  payment_method: string;
  subtotal: number;
  vat: number;
  total: number;
  status: string;
  order_date: string;
  created_at: string;
}

export interface OrderContextType {
  orders: Order[];
  addOrder: (cartItems: CartItem[], billingDetails?: BillingDetails, paymentMethod?: string) => Promise<Order>;
  isLoading: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  created_at?: string;
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
