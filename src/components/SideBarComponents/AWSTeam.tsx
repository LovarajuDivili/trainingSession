import { Box, Typography } from "@mui/material";
import DashboardHeader from "../DashboardHeader";
import { sidebarItems } from "../../common/sidebarItems";

const AWSTeam = () => {
  const currentItem = sidebarItems.find(
    (item) => item.route === "/admin/aws-team"
  );

  return (
    <Box>
      <DashboardHeader
        title={currentItem?.label || "AWSTeam"}
        icon={currentItem?.icon}
      />
      <Typography sx={{ p: 2 }}>No data available for AWSTeam yet.</Typography>
    </Box>
  );
};

export default AWSTeam;
