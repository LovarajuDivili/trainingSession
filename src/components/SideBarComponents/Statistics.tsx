import { Box, Typography } from "@mui/material";
import DashboardHeader from "../DashboardHeader";
import { sidebarItems } from "../../common/sidebarItems";

const Statistics = () => {
  const currentItem = sidebarItems.find(
    (item) => item.route === "/admin/statistics"
  );

  return (
    <Box>
      <DashboardHeader
        title={currentItem?.label || "Statistics"}
        icon={currentItem?.icon}
      />
      <Typography sx={{ p: 2 }}>
        No data available for Statistics yet.
      </Typography>
    </Box>
  );
};

export default Statistics;
