import { Box, Typography } from "@mui/material";
import DashboardHeader from "../DashboardHeader";
import { sidebarItems } from "../../common/sidebarItems";

const Developers = () => {
  const currentItem = sidebarItems.find(
    (item) => item.route === "/admin/developers"
  );

  return (
    <Box>
      <DashboardHeader
        title={currentItem?.label || "Developers"}
        icon={currentItem?.icon}
      />
      <Typography sx={{ p: 2 }}>
        No data available for Developers yet.
      </Typography>
    </Box>
  );
};

export default Developers;
