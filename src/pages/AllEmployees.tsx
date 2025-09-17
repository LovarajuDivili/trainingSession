import React from "react";
import { Box } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { employeeData } from "../common/dummyData";
import type { Employee } from "../common/types";
const columns = [
  { field: "name", headerName: "Employee Name", flex: 1 },
  { field: "email", headerName: "Email", flex: 1 },
  { field: "role", headerName: "Role", flex: 1 },
  { field: "joinDate", headerName: "Join Date", flex: 1 },
  { field: "id", headerName: "ID", flex: 0.7 },
  {
    field: "skills",
    headerName: "Skills",
    flex: 1.5,
    renderCell: (params: GridRenderCellParams<Employee>) =>
      params.row.skills.join(", "),
  },
  { field: "currentDate", headerName: "Current Date", flex: 1 },
];

const AllEmployees: React.FC = () => {
  return (
    <Box
      sx={{
        width: "100%",
        boxSizing: "border-box",
      }}
    >
      <Box
        sx={{
          height: 500,
          width: "100%",
          bgcolor: "white",
          borderRadius: 2,
          boxShadow: 3,
          overflow: "hidden",
        }}
      >
        <DataGrid
          rows={employeeData}
          columns={columns}
          pageSize={10}
          getRowId={(row) => row.id}
          disableRowSelectionOnClick
          sx={{
            border: "none",
            "& .MuiDataGrid-columnHeaders": {
              backgroundColor: "#f9f9f9",
              fontWeight: "bold",
            },
            "& .MuiDataGrid-row:hover": {
              backgroundColor: "#f5f5f5",
            },
          }}
        />
      </Box>
    </Box>
  );
};

export default AllEmployees;
