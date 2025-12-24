import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";

import AccountTypeSelection from "./pages/AccountTypeSelection";
import LoggedOut from "./pages/LoggedOut";
import AllEmployees from "./pages/AllEmployees";
import ProjectsLayout from "./components/ProjectsLayout";
import DashboardLayout from "./pages/DashboardLayout";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import Logs from "./pages/Logs";
import OpeningsEvents from "./pages/OpeningsEvents";
import EmployeeProvider from "./context/EmployeeProvider";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPasswordFlow from "./pages/ForgotPasswordFlow";
import ProtectedRoute from "./components/ProtectedRoute";
import Statistics from "./pages/Statistics";
import AccountantLayout from "./pages/accountant/AccountantLayout";
import AccountantDashboard from "./pages/accountant/AccountantDashboard";
import RequestOrder from "./pages/accountant/RequestOrder";
import EmployeeSearch from "./pages/accountant/EmployeeSearch";
import EmployeeDetails from "./pages/accountant/EmployeeDetails";
import AIToolsDashboard from "./pages/AIToolsDashboard";
import GenAIFloating from "./components/GenAIFloating";

const AppContent: React.FC = () => {
  const location = useLocation();
  const hideGenAIOnRoutes = [
    "/login",
    "/register",
    "/forgot-password",
    "/account-type-selection",
    "/logged-out",
  ];

  const shouldHideGenAI = hideGenAIOnRoutes.includes(location.pathname);

  return (
    <>
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
\
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
          path="/dashboard/ai-tools"
          element={
            <ProtectedRoute>
              <AIToolsDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/dashboard/ai-tools/dashboard"
          element={<Navigate to="/dashboard/ai-tools" replace />}
        />

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

      {!shouldHideGenAI && <GenAIFloating />}
    </>
  );
};

const App: React.FC = () => {
  return (
    <Router>
      <AppContent />
    </Router>
  );
};

export default App;
