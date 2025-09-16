import React from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Box } from "@mui/material";
import { awsRows, awsColumns } from "../../common/utilitys";

const AWSTeam: React.FC = () => {
  return (
    <Box sx={{ height: 400, mt: 2 }}>
      <DataGrid rows={awsRows} columns={awsColumns} pageSizeOptions={[5]} />
    </Box>
  );
};

export default AWSTeam;
