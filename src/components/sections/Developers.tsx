import React from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Box } from "@mui/material";
import { developerRows, developerColumns } from "../../common/utilitys";

const Developers: React.FC = () => {
  return (
    <Box sx={{ height: 400, mt: 2 }}>
      <DataGrid
        rows={developerRows}
        columns={developerColumns}
        pageSizeOptions={[5]}
      />
    </Box>
  );
};

export default Developers;
