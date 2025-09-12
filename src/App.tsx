import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AccountTypeSelection from "./pages/AccountTypeSelection";
import LoggedOut from "./pages/LoggedOut";
import DashboardLayout from "./pages/DashboardLayoout";
const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AccountTypeSelection />} />
        <Route path="/logged-out" element={<LoggedOut />} />
        <Route path="/dashboard/:role" element={<DashboardWrapper />} />
      </Routes>
    </Router>
  );
};

import { useParams } from "react-router-dom";
const DashboardWrapper: React.FC = () => {
  const { role } = useParams<{ role: string }>();
  if (!role) {
    return <div>Role missing in URL</div>;
  }
  return <DashboardLayout role={role} />;
};

export default App;
