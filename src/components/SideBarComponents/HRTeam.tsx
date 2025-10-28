import { Box, Typography } from "@mui/material";
import DashboardHeader from "../DashboardHeader";
import { sidebarItems } from "../../common/sidebarItems";

const HRTeam = () => {
  const currentItem = sidebarItems.find(
    (item) => item.route === "/admin/hrteam"
  );

  return (
    <Box>
      <DashboardHeader
        title={currentItem?.label || "HRTeam"}
        icon={currentItem?.icon}
      />
      <Typography sx={{ p: 2 }}>No data available for HR Team yet.</Typography>
    </Box>
  );
};

export default HRTeam;
