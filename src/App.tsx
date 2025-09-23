// App.tsx
import { Box } from "@mui/material";
import { Routes, Route } from "react-router-dom";
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

const App = () => {
  return (
    <Box>
      <Routes>
        <Route path="/" element={<WelcomeSasa />} />
        <Route path="/admin" element={<Admin />}>
          <Route path="/admin/all-employees" element={<AllEmployees />} />
          <Route path="/admin/developers" element={<Developers />} />
          <Route path="/admin/aws-team" element={<AWSTeam />} />
          <Route path="/admin/logs" element={<Logs />} />
          <Route path="/admin/projects" element={<Projects />} />
          <Route path="/admin/projects/add" element={<AddProject />} />
          <Route path="/admin/statistics" element={<Statistics />} />
          <Route path="/admin/testers" element={<Testers />} />
        </Route>
        <Route path="*" element={<Admin />} />

        <Route path="/technical" element={<Technical />}></Route>
        <Route path="/developer" element={<Technical />}></Route>
        <Route path="/functional" element={<Technical />}></Route>
        <Route path="/migrator" element={<Technical />}></Route>
        <Route path="/tester" element={<Technical />}></Route>
        <Route path="/logout" element={<Logout />} />
      </Routes>
    </Box>
  );
};

export default App;
