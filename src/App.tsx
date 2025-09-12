import React, { useState } from "react";
import { ThemeProvider, CssBaseline, Box } from "@mui/material";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import theme from "./theme/theme";
import Navbar from "./components/Navbar";
import AccountSelection from "./components/AccountSelection";
import Dashboard from "./pages/DashBoard";
import LogoutSuccess from "./pages/LogoutSuccess";

const App: React.FC = () => {
  const [accountType, setAccountType] = useState<string>("Admin");

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <Navbar accountType={accountType} />
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
            <Route
              path="/dashboard"
              element={<Dashboard accountType={accountType} />}
            />
            <Route path="/logout-success" element={<LogoutSuccess />} />
            {/* Redirect any unknown path */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </Box>
      </BrowserRouter>
    </ThemeProvider>
  );
};

export default App;
