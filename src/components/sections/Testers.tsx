import React from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Box } from "@mui/material";
import { testerRows, testerColumns } from "../../common/utilitys";

const Testers: React.FC = () => {
  return (
    <Box sx={{ height: 400, mt: 2 }}>
      <DataGrid
        rows={testerRows}
        columns={testerColumns}
        pageSizeOptions={[5]}
      />
    </Box>
  );
};

export default Testers;
