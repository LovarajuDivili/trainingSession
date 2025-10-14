import { Box } from "@mui/material";
import { Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import WelcomeSasa from "./components/WelcomeSasa";
import Admin from "./pages/Admin";
import Logout from "./pages/Logout";
import AllEmployees from "./components/SideBarComponents/AllEmployees";
import Developers from "./components/SideBarComponents/Developers";
import AWSTeam from "./components/SideBarComponents/AWSTeam";
import Logs from "./components/SideBarComponents/Logs";
import Projects from "./components/SideBarComponents/Projects";
import Statistics from "./components/SideBarComponents/Statistics";
import Testers from "./components/SideBarComponents/Testers";
import AddProject from "./components/ExtraComponents/AddProject";
import Technical from "./pages/Technical";
import SignIn from "./SignIn";
import SignUp from "./SignUp";

const App = () => {
  return (
    <AuthProvider>
      <Box>
        <Routes>
          {/* Public routes */}
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />

          {/* Protected routes */}
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
              <ProtectedRoute requiredRole="admin">
                <Admin />
              </ProtectedRoute>
            }
          >
            <Route path="all-employees" element={<AllEmployees />} />
            <Route path="developers" element={<Developers />} />
            <Route path="aws-team" element={<AWSTeam />} />
            <Route path="logs" element={<Logs />} />
            <Route path="projects" element={<Projects />} />
            <Route path="projects/add" element={<AddProject />} />
            <Route path="statistics" element={<Statistics />} />
            <Route path="testers" element={<Testers />} />
          </Route>

          {/* Other protected routes */}
          <Route
            path="/technical"
            element={
              <ProtectedRoute>
                <Technical />
              </ProtectedRoute>
            }
          />
          <Route
            path="/developer"
            element={
              <ProtectedRoute>
                <Technical />
              </ProtectedRoute>
            }
          />
          <Route
            path="/functional"
            element={
              <ProtectedRoute>
                <Technical />
              </ProtectedRoute>
            }
          />
          <Route
            path="/migrator"
            element={
              <ProtectedRoute>
                <Technical />
              </ProtectedRoute>
            }
          />
          <Route
            path="/tester"
            element={
              <ProtectedRoute>
                <Technical />
              </ProtectedRoute>
            }
          />
          <Route path="/logout" element={<Logout />} />

          {/* Default route */}
          <Route path="/" element={<Navigate to="/signup" replace />} />

          {/* Fallback route */}
          <Route path="*" element={<Navigate to="/signup" replace />} />
        </Routes>
      </Box>
    </AuthProvider>
  );
};

export default App;
