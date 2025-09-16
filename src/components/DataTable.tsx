import React from "react";
import { Box, Container } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";

interface DataTableProps {
  rows: any[];
  columns: GridColDef[];
}

const DataTable: React.FC<DataTableProps> = ({ rows, columns }) => {
  return (
    <Container maxWidth="xl" disableGutters sx={{ mt: 3 }}>
      <Box sx={{ height: 350, borderRadius: 2, p: 2 }}>
        <DataGrid
          rows={rows}
          columns={columns}
          pageSizeOptions={[5, 10]}
          initialState={{
            pagination: { paginationModel: { pageSize: 5 } },
          }}
          disableRowSelectionOnClick
          sx={{
            border: "none",
            "& .MuiDataGrid-columnHeaders": {
              backgroundColor: "#f5f5f5",
              fontWeight: "bold",
            },
          }}
        />
      </Box>
    </Container>
  );
};

export default DataTable;
