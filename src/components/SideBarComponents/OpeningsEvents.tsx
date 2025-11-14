import { Box, Typography } from "@mui/material";
import DashboardHeader from "../DashboardHeader";
import { sidebarItems } from "../../common/sidebarItems";

const OpeningsEvents = () => {
  const currentItem = sidebarItems.find(
    (item) => item.route === "/admin/openingsEvents"
  );

  return (
    <Box>
      <DashboardHeader
        title={currentItem?.label || "OpeningsEvents"}
        icon={currentItem?.icon}
      />
      <Typography sx={{ p: 2 }}>
        No data available for Openings and Events yet.
      </Typography>
    </Box>
  );
};

export default OpeningsEvents;
