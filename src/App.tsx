import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import AccountTypeSelection from "./pages/AccountTypeSelection";
import LoggedOut from "./pages/LoggedOut";
import AllEmployees from "./pages/AllEmployees";
import ProjectsPage from "./pages/ProjectsPage";
import ProjectsAddPage from "./pages/ProjectsAddPage";
import DashboardLayout from "./pages/DashboardLayout";
import Layout from "./components/Layout";
import InProgress from "./pages/InProgress";
import EmployeeProvider from "./context/EmployeeProvider";

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AccountTypeSelection />} />
        <Route path="/logged-out" element={<LoggedOut />} />

        <Route path="/dashboard/:role" element={<DashboardLayout />}>
          <Route element={<Layout />}>
            <Route
              path="all-employees"
              element={
                <EmployeeProvider>
                  <AllEmployees />
                </EmployeeProvider>
              }
            />
            <Route path="projects" element={<ProjectsPage />} />
            <Route path="projects/add" element={<ProjectsAddPage />} />
            <Route path="developers" element={<InProgress />} />
            <Route path="testers" element={<InProgress />} />
            <Route path="aws-team" element={<InProgress />} />
            <Route path="statistics" element={<InProgress />} />
            <Route path="logs" element={<InProgress />} />
            <Route index element={<Navigate to="all-employees" replace />} />
          </Route>
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
