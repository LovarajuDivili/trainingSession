import React, { useState, useEffect } from "react";
import { Box } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { allEmployees, employeeColumns, Employee } from "../common/utilitys";

interface EmployeesProps {
  filter?: string;
}

const Employees: React.FC<EmployeesProps> = ({ filter }) => {
  const [rows, setRows] = useState<Employee[]>([]);

  useEffect(() => {
    const storedEmployees: Employee[] = JSON.parse(
      localStorage.getItem("employees") || "[]"
    );
    setRows(storedEmployees.length > 0 ? storedEmployees : allEmployees);
  }, []);

  const filteredRows = filter
    ? rows.filter((emp) => emp.role.includes(filter))
    : rows;

  return (
    <Box sx={{ mt: 3 }}>
      <DataGrid
        rows={filteredRows}
        columns={employeeColumns}
        pageSizeOptions={[5, 10]}
        initialState={{ pagination: { paginationModel: { pageSize: 5 } } }}
        disableRowSelectionOnClick
        autoHeight
        sx={{
          backgroundColor: "#fff",
          border: "1px solid #dcdcdc",
          borderRadius: 2,
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: "#f5f5f5",
            fontWeight: "bold",
            fontSize: "0.95rem",
            borderBottom: "1px solid #dcdcdc",
          },
          "& .MuiDataGrid-cell": {
            borderBottom: "1px solid #e0e0e0",
            fontSize: "0.9rem",
            color: "#333",
          },
          "& .MuiDataGrid-row:hover": {
            backgroundColor: "#f9f9f9",
          },
        }}
      />
    </Box>
  );
};

export default Employees;
