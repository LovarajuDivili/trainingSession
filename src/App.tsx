import { Box } from "@mui/material";
import { Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import WelcomeSasa from "./components/WelcomeSasa";
import Admin from "./pages/Admin";
import Logout from "./pages/Logout";
import AllEmployees from "./components/SideBarComponents/AllEmployees";
import Dashboard from "./components/SideBarComponents/Dashboard";
import Logs from "./components/SideBarComponents/Logs";
import Projects from "./components/SideBarComponents/Projects";
import Statistics from "./components/SideBarComponents/Statistics";
import AddProject from "./components/ExtraComponents/AddProject";
import SignIn from "./SignIn";
import SignUp from "./SignUp";
import Functional from "./pages/Funtional";
import Migrator from "./pages/Migrator";
import Tester from "./pages/Tester";
import Accountant from "./pages/Accountant";
import RequestOrder from "./components/ExtraComponents/RequestOrder";
import EmployeeData from "./components/ExtraComponents/EmployeesData";
import HrData from "./components/ExtraComponents/HrData";
import EmployeeDetails from "./components/ExtraComponents/EmployeeDetails";
import { CartDrawerProvider } from "./context/CartDrawerContext";
import CartDrawer from "./components/ExtraComponents/CartDrawer";
import { CartProvider } from "./context/CartContext";
import OpeningsEvents from "./components/SideBarComponents/OpeningsEvents";
import OpeningsAndEvents from "./pages/OpeningsAndEvents";
import { OrdersProvider } from "./context/OrderContext";
import { ThemeProvider } from "./context/ThemeContext";
import { useEffect } from "react";

const AppContent = () => {
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    const checkAuthStatus = () => {
      const token = sessionStorage.getItem("token");
      const currentPath = window.location.pathname;

      if (
        !token &&
        !currentPath.includes("/signin") &&
        !currentPath.includes("/signup") &&
        !currentPath.includes("/logout")
      ) {
        window.location.href = "/signin";
      }
    };
    checkAuthStatus();
  }, []);

  if (isLoading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
      >
        Loading...
      </Box>
    );
  }

  return (
    <Routes>
      <Route path="/signin" element={<SignIn />} />
      <Route path="/signup" element={<SignUp />} />

      <Route
        path="/welcome"
        element={
          <ProtectedRoute>
            <WelcomeSasa />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin"
        element={
          <ProtectedRoute requiredRole="Admin">
            <Admin />
          </ProtectedRoute>
        }
      >
        <Route path="all-employees" element={<AllEmployees />} />
        <Route path="openingsEvents" element={<OpeningsEvents />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="logs" element={<Logs />} />
        <Route path="projects" element={<Projects />} />
        <Route path="projects/add" element={<AddProject />} />
        <Route path="statistics" element={<Statistics />} />
      </Route>

      <Route
        path="/accountant"
        element={
          <ProtectedRoute>
            <Accountant />
          </ProtectedRoute>
        }
      />
      <Route
        path="/accountant/requestorder"
        element={
          <ProtectedRoute>
            <RequestOrder />
          </ProtectedRoute>
        }
      />
      <Route
        path="/accountant/employeedata"
        element={
          <ProtectedRoute>
            <EmployeeData />
          </ProtectedRoute>
        }
      />
      <Route
        path="/accountant/hrdata"
        element={
          <ProtectedRoute>
            <HrData />
          </ProtectedRoute>
        }
      />
      <Route
        path="/accountant/employeedata/:employeeId"
        element={<EmployeeDetails />}
      />

      <Route
        path="/openingsandEvents"
        element={
          <ProtectedRoute>
            <OpeningsAndEvents />
          </ProtectedRoute>
        }
      />

      <Route
        path="/functional"
        element={
          <ProtectedRoute>
            <Functional />
          </ProtectedRoute>
        }
      />
      <Route
        path="/migrator"
        element={
          <ProtectedRoute>
            <Migrator />
          </ProtectedRoute>
        }
      />
      <Route
        path="/tester"
        element={
          <ProtectedRoute>
            <Tester />
          </ProtectedRoute>
        }
      />

      <Route path="/logout" element={<Logout />} />

      <Route
        path="/"
        element={
          isAuthenticated ? (
            <Navigate to="/welcome" replace />
          ) : (
            <Navigate to="/signup" replace />
          )
        }
      />
      <Route
        path="*"
        element={
          isAuthenticated ? (
            <Navigate to="/welcome" replace />
          ) : (
            <Navigate to="/signup" replace />
          )
        }
      />
    </Routes>
  );
};

const App = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        {" "}
        <CartProvider>
          {" "}
          <OrdersProvider>
            <CartDrawerProvider>
              <Box>
                <AppContent />
              </Box>
              <CartDrawer />
            </CartDrawerProvider>
          </OrdersProvider>
        </CartProvider>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
