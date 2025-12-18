import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import AccountTypeSelection from "./pages/AccountTypeSelection";
import LoggedOut from "./pages/Logout";
import AllEmployees from "./pages/AllEmployees";
import ProjectsLayout from "./components/ProjectsLayout";
import DashboardLayout from "./pages/DashboardLayout";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import Logs from "./pages/Logs";
import OpeningsEvents from "./pages/Openings&Events";
import EmployeeProvider from "./ContextFiles/EmpProvider";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPasswordFlow from "./pages/ForgotPassword";
import ProtectedRoute from "./components/ProtectedRoute";
import Statistics from "./pages/Statistics";
import AccountantLayout from "./pages/Accountants/AccountantLayout";
import AccountantDashboard from "./pages/Accountants/AccountantDashboard";
import RequestOrder from "./pages/Accountants/RequestOrder";
import EmployeeSearch from "./pages/Accountants/EmployeeSearch";
import EmployeeDetails from "./pages/Accountants/EmployeeDetails";

const App: React.FC = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPasswordFlow />} />
      <Route path="/logged-out" element={<LoggedOut />} />
      <Route path="/" element={<Navigate to="/login" replace />} />

      <Route
        path="/account-type-selection"
        element={<AccountTypeSelection />}
      />

      <Route
        path="/accountant"
        element={
          <ProtectedRoute>
            <AccountantLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<AccountantDashboard />} />
        <Route path="requestOrder" element={<RequestOrder />} />
        <Route path="employeedata" element={<EmployeeSearch />} />
        <Route path="employeedetails" element={<EmployeeDetails />} />
      </Route>

      <Route
        path="/dashboard/:role"
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route
            path="all-employees"
            element={
              <EmployeeProvider>
                <AllEmployees />
              </EmployeeProvider>
            }
          />
          <Route path="projects" element={<ProjectsLayout />} />
          <Route path="openings-events" element={<OpeningsEvents />} />
          <Route path="statistics" element={<Statistics />} />
          <Route path="logs" element={<Logs />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
};

export default App;
