import { useState } from "react";
import viteLogo from "/chat.svg";
import "./App.scss";
import { HomePage } from "./common/labelConstants";

// ✅ MUI imports
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemButton,
} from "@mui/material";

// ✅ MUI icons
import HomeIcon from "@mui/icons-material/Home";
import PersonIcon from "@mui/icons-material/Person";
import SettingsIcon from "@mui/icons-material/Settings";

function App() {
  const [count, setCount] = useState(0);

  // Items with label + MUI icon
  const items = [
    { label: "Home", icon: <HomeIcon /> },
    { label: "Profile", icon: <PersonIcon /> },
    { label: "Settings", icon: <SettingsIcon /> },
  ];

  return (
    <Box p={3}>
      {/* Logo */}
      <Box mb={2}>
        <a href="https://vite.dev" target="_blank" rel="noreferrer">
          <img src={viteLogo} alt="Vite logo" style={{ width: 60 }} />
        </a>
      </Box>

      {/* Heading */}
      <Typography variant="h4" className="heading" gutterBottom>
        {HomePage.VITE} + {HomePage.REACT}
      </Typography>

      {/* Iterated list */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Menu
          </Typography>
          <List>
            {items.map((item, index) => (
              <ListItem key={index} >
                <ListItemButton>
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.label} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </CardContent>
      </Card>

      {/* Counter Button */}
      <Card>
        <CardContent>
          <Button
            variant="contained"
            color="primary"
            onClick={() => setCount((c) => c + 1)}
          >
            Count is {count}
          </Button>
        </CardContent>
      </Card>
    </Box>
  );
}

export default App;
