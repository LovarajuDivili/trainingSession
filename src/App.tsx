// App.tsx
import { Box } from "@mui/material";
import { Routes, Route } from "react-router-dom";
import WelcomeSasa from "./components/WelcomeSasa";
import Admin from "./pages/Admin";
import Technical from "./pages/Technical";
import Logout from "./pages/Logout";
import Dashboard from "./components/Dashboard";

const App = () => {
  return (
    <Box>
      <Routes>
        <Route path="/" element={<WelcomeSasa />} />
        <Route path="/admin" element={<Admin />}>
          <Route path="all-employees" element={<Dashboard />} />
          <Route path="developers" element={<Dashboard />} />
          <Route path="testers" element={<Dashboard />} />
          <Route path="aws-team" element={<Dashboard />} />
          <Route path="projects" element={<Dashboard />} />
          <Route path="statistics" element={<Dashboard />} />
          <Route path="logs" element={<Dashboard />} />
        </Route>

        <Route path="*" element={<Admin />} />

        <Route path="/technical" element={<Technical />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/all-employees" element={<Dashboard />} />
      </Routes>
    </Box>
  );
};

export default App;
