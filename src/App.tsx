import React from "react";
import { BrowserRouter as Router, Routes, Route, useParams } from "react-router-dom";

// Page components
import AccountTypeSelection from "./pages/AccountTypeSelection";
import LoggedOut from "./pages/LoggedOut";
import AllEmployees from "./pages/AllEmployees";
//import Developers from "./pages/Developers";
//import Testers from "./pages/Testers";
//import AwsTeam from "./pages/AWSTeam";
//import Projects from "./pages/Projects";
//import Statistics from "./pages/Statistics";
//import Logs from "./pages/Logs";
import DashboardLayout from "./pages/DashboardLayout";
import Layout from "./components/Layout";
import InProgress from "./pages/InProgress";

import { employeeData } from "./common/dummyData";

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        {/* Landing Page */}
        <Route path="/" element={<AccountTypeSelection />} />

        {/* Admin Page */}
        <Route
          path="/llm-garden/admin"
          element={
            <DashboardLayout role="Admin">
              <AllEmployees />
            </DashboardLayout>
          }
        />

        {/* All Employees Page with optional role parameter */}
        <Route
          path="/llmgarden/all-employees/:role?"
          element={
            <Layout
              pageTitle="All Employees"
              isLLMGardenPage
              employeeCount={employeeData.length}
            >
              <AllEmployees />
            </Layout>
          }
        />

        {/* Other Pages with "In progress." message and header/sidebar */}
        <Route
          path="/llmgarden/developers"
          element={
            <Layout pageTitle="Developers" isLLMGardenPage hideControls>
              <InProgress />
            </Layout>
          }
        />
        <Route
          path="/llmgarden/testers"
          element={
            <Layout pageTitle="Testers" isLLMGardenPage hideControls>
              <InProgress />
            </Layout>
          }
        />
        <Route
          path="/llmgarden/aws"
          element={
            <Layout pageTitle="AWS Team" isLLMGardenPage hideControls>
              <InProgress />
            </Layout>
          }
        />
        <Route
          path="/llmgarden/projects"
          element={
            <Layout pageTitle="Projects" isLLMGardenPage hideControls>
              <InProgress />
            </Layout>
          }
        />
        <Route
          path="/llmgarden/statistics"
          element={
            <Layout pageTitle="Statistics" isLLMGardenPage hideControls>
              <InProgress />
            </Layout>
          }
        />
        <Route
          path="/llmgarden/logs"
          element={
            <Layout pageTitle="Logs" isLLMGardenPage hideControls>
              <InProgress />
            </Layout>
          }
        />

        {/* Dashboard by role */}
        <Route path="/dashboard/:role" element={<DashboardWrapper />} />

        {/* Logged Out Page */}
        <Route path="/logged-out" element={<LoggedOut />} />
      </Routes>
    </Router>
  );
};

// Wrapper to dynamically inject role
const DashboardWrapper: React.FC = () => {
  const { role } = useParams<{ role: string }>();
  if (!role) return <div>Role missing in URL</div>;
  return <DashboardLayout role={role} />;
};

export default App;
