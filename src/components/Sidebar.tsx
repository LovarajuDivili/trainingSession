// import React from "react";
// import {
//   Drawer,
//   Toolbar,
//   List,
//   ListItemButton,
//   ListItemText,
//   ListItemIcon,
//   Box,
// } from "@mui/material";
// import { useNavigate, useLocation } from "react-router-dom";

// import GroupIcon from "@mui/icons-material/Group";
// import CodeIcon from "@mui/icons-material/Code";
// import BugReportIcon from "@mui/icons-material/BugReport";
// import CloudIcon from "@mui/icons-material/Cloud";
// import FolderIcon from "@mui/icons-material/Folder";
// import BarChartIcon from "@mui/icons-material/BarChart";
// import ListAltIcon from "@mui/icons-material/ListAlt";

// const drawerWidth = 245;

// const sections = [
//   { label: "All Employees", path: "allemployees", icon: <GroupIcon /> },
//   { label: "Developers", path: "developers", icon: <CodeIcon /> },
//   { label: "Testers", path: "testers", icon: <BugReportIcon /> },
//   { label: "AWS Team", path: "awsteam", icon: <CloudIcon /> },
//   { label: "Projects", path: "projects", icon: <FolderIcon /> },
//   { label: "Statistics", path: "statistics", icon: <BarChartIcon /> },
//   { label: "Logs", path: "logs", icon: <ListAltIcon /> },
// ];

// const Sidebar: React.FC = () => {
//   const navigate = useNavigate();
//   const location = useLocation();

//   return (
//     <Drawer
//       variant="permanent"
//       sx={{
//         width: drawerWidth,
//         flexShrink: 0,
//         [`& .MuiDrawer-paper`]: {
//           width: drawerWidth,
//           boxSizing: "border-box",
//           borderRight: 0,
//           backgroundColor: "#f7f8fc",
//           color: "#6c757d",
//         },
//       }}
//     >
//       <Toolbar />
//       <Box sx={{ overflow: "auto", pt: 2 }}>
//         <List>
//           {sections.map(({ label, path, icon }) => {
//             const selected = location.pathname.endsWith(path);
//             return (
//               <ListItemButton
//                 key={label}
//                 selected={selected}
//                 onClick={() => navigate(`/dashboard/${path}`)}
//                 sx={{
//                   py: 1,
//                   px: 3,
//                   borderRadius: 10,
//                   mb: 0.25,
//                   color: selected ? "#fff" : "#6c757d",
//                   bgcolor: selected ? "#1e3a8a !important" : "transparent",
//                   "&.Mui-selected": {
//                     bgcolor: "#3d68e0ff !important",
//                     color: "#fff !important",
//                   },
//                 }}
//               >
//                 <ListItemIcon
//                   sx={{
//                     color: selected ? "#fff !important" : "#6c757d",
//                     minWidth: 36,
//                   }}
//                 >
//                   {icon}
//                 </ListItemIcon>
//                 <ListItemText primary={label} />
//               </ListItemButton>
//             );
//           })}
//         </List>
//       </Box>
//     </Drawer>
//   );
// };

// export default Sidebar;

import React from "react";
import {
  Drawer,
  Toolbar,
  List,
  ListItemButton,
  ListItemText,
  ListItemIcon,
  Box,
} from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import { sidebarSections } from "../common/utilitys";

const drawerWidth = 245;

const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: {
          width: drawerWidth,
          boxSizing: "border-box",
          borderRight: 0,
          backgroundColor: "#f7f8fc",
          color: "#6c757d",
        },
      }}
    >
      <Toolbar />
      <Box sx={{ overflow: "auto", pt: 2 }}>
        <List>
          {sidebarSections.map(({ label, path, icon }) => {
            const selected = location.pathname.endsWith(path);
            return (
              <ListItemButton
                key={label}
                selected={selected}
                onClick={() => navigate(`/dashboard/${path}`)}
                sx={{
                  py: 1,
                  px: 3,
                  borderRadius: 10,
                  mb: 0.25,
                  color: selected ? "#fff" : "#6c757d",
                  bgcolor: selected ? "#1e3a8a !important" : "transparent",
                  "&.Mui-selected": {
                    bgcolor: "#3d68e0ff !important",
                    color: "#fff !important",
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    color: selected ? "#fff !important" : "#6c757d",
                    minWidth: 36,
                  }}
                >
                  {icon}
                </ListItemIcon>
                <ListItemText primary={label} />
              </ListItemButton>
            );
          })}
        </List>
      </Box>
    </Drawer>
  );
};

export default Sidebar;
