import React, { useState } from "react";
import { ThemeProvider, CssBaseline, Box } from "@mui/material";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import theme from "./theme/theme";
import Navbar from "./pages/Navbar";
import AccountSelection from "./pages/AccountSelection";
import LogoutSuccess from "./pages/LogoutSuccess";
import AddProject from "./components/adminDashboard/projects/AddProject";
import AllEmployees from "./components/adminDashboard/employees/AllEmployees";
import Developers from "./components/adminDashboard/developers/Developers";
import Testers from "./components/adminDashboard/testers/Testers";
import AWSTeam from "./components/adminDashboard/awsteam/AWSTeam";
import Logs from "./components/adminDashboard/logs/Logs";
import Statistics from "./components/adminDashboard/statistics/Statistics";
import AdminDasboard from "./components/adminDashboard/AdminDasboard";
import Projects from "./components/adminDashboard/projects/Projects";

const AppContent: React.FC = () => {
  const [accountType, setAccountType] = useState<string>("");
  const location = useLocation();

  const showNavbar = location.pathname !== "/logout-success";

  return (
    <>
      {showNavbar && <Navbar accountType={accountType} />}

      <Box component="main">
        <Routes>
          <Route
            path="/"
            element={
              <AccountSelection
                accountType={accountType}
                setAccountType={setAccountType}
              />
            }
          />

          <Route path="/dashboard" element={<AdminDasboard />}>
            <Route index element={<AllEmployees />} />
            <Route path="/dashboard/projects" element={<Projects />} />
            <Route path="/dashboard/developers" element={<Developers />} />
            <Route path="/dashboard/testers" element={<Testers />} />
            <Route path="/dashboard/awsteam" element={<AWSTeam />} />
            <Route path="/dashboard/logs" element={<Logs />} />
            <Route path="/dashboard/statistics" element={<Statistics />} />
            <Route path="/dashboard/projects/addnew" element={<AddProject />} />
          </Route>
          <Route path="/logout-success" element={<LogoutSuccess />} />
        </Routes>
      </Box>
    </>
  );
};

const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </ThemeProvider>
  );
};

export default App;
