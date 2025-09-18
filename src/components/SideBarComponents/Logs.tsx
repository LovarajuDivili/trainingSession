import { Box, Typography } from "@mui/material";
import DashboardHeader from "../DashboardHeader";
import { sidebarItems } from "../../common/sidebarItems";

const Logs = () => {
  const currentItem = sidebarItems.find((item) => item.route === "/admin/logs");

  return (
    <Box>
      <DashboardHeader
        title={currentItem?.label || "Logs"}
        icon={currentItem?.icon}
      />
      <Typography sx={{ p: 2 }}>No data available for Logs yet.</Typography>
    </Box>
  );
};

export default Logs;
