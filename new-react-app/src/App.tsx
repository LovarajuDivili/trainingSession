// App.tsx

import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AccountTypeSelection from "./AccountTypeSelection";
import LoggedOut from "./pages/LoggedOut";

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AccountTypeSelection />} />
        <Route path="/logged-out" element={<LoggedOut />} />
      </Routes>
    </Router>
  );
};

export default App;
