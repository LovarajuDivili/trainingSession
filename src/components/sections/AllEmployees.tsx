// import React from "react";
// import { DataGrid, GridColDef } from "@mui/x-data-grid";
// import { Box } from "@mui/material";

// const rows = [
//   { id: 1, name: "Alice", email: "alice@example.com", role: "Developer" },
//   { id: 2, name: "Bob", email: "bob@example.com", role: "Tester" },
// ];

// const columns: GridColDef[] = [
//   { field: "id", headerName: "ID", width: 70 },
//   { field: "name", headerName: "Name", flex: 1 },
//   { field: "email", headerName: "Email", flex: 1 },
//   { field: "role", headerName: "Role", flex: 1 },
// ];

// const AllEmployees: React.FC = () => {
//   return (
//     <Box sx={{ height: 400, mt: 2 }}>
//       <DataGrid rows={rows} columns={columns} pageSizeOptions={[5]} />
//     </Box>
//   );
// };

// export default AllEmployees;

import React from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Box } from "@mui/material";
import { employeeRows, employeeColumns } from "../../common/utilitys";

const AllEmployees: React.FC = () => {
  return (
    <Box sx={{ height: 400, mt: 2 }}>
      <DataGrid
        rows={employeeRows}
        columns={employeeColumns}
        pageSizeOptions={[5]}
      />
    </Box>
  );
};

export default AllEmployees;
