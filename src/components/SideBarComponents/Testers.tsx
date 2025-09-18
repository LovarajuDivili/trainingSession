import { Box, Typography } from "@mui/material";
import DashboardHeader from "../DashboardHeader";
import { sidebarItems } from "../../common/sidebarItems";

const Testers = () => {
  const currentItem = sidebarItems.find(
    (item) => item.route === "/admin/testers"
  );

  return (
    <Box>
      <DashboardHeader
        title={currentItem?.label || "Testers"}
        icon={currentItem?.icon}
      />
      <Typography sx={{ p: 2 }}>No data available for Testers yet.</Typography>
    </Box>
  );
};

export default Testers;
