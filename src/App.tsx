// App.tsx
import { Box } from "@mui/material";
import { Routes, Route } from "react-router-dom";
import WelcomeSasa from "./components/WelcomeSasa";
import Admin from "./pages/Admin";
import Technical from "./pages/Technical";
import Logout from "./pages/Logout"


const App = () => {
  return (
    
      <Box>
        <Routes>
          <Route path="/" element={<WelcomeSasa />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/technical" element={<Technical />} />
          <Route path="/logout" element={<Logout />} />
        </Routes>
      </Box>
    
  );
};

export default App;
