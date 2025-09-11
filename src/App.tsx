import React, { useState } from "react";
import { ThemeProvider, CssBaseline, Box } from "@mui/material";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import theme from "./theme/theme";
import Navbar from "./components/Navbar";
import AccountSelection from "./components/AccountSelection";
import LogoutSuccess from "./pages/LogoutSuccess";

const App: React.FC = () => {
  const [accountType, setAccountType] = useState<string>("Admin");

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <Navbar accountType={accountType} />
        <Box component="main" sx={{ p: 3 }}>
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
            <Route path="/logout-success" element={<LogoutSuccess />} />
          </Routes>
        </Box>
      </BrowserRouter>
    </ThemeProvider>
  );
};

export default App;
