import React, { useState } from "react";
import { ThemeProvider, CssBaseline, Box } from "@mui/material";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import theme from "./theme/theme";
import Navbar from "./components/Navbar";
import AccountSelection from "./components/AccountSelection";
import Dashboard from "./pages/Dashboard";
import LogoutSuccess from "./pages/LogoutSuccess";

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
          <Route path="/dashboard/*" element={<Dashboard />} />
          <Route path="/logout-success" element={<LogoutSuccess />} />
          <Route path="*" element={<Navigate to="/" />} />
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
