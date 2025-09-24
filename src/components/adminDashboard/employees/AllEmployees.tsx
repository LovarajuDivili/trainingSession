import React, { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Box, Card, CardContent, Grid, Typography } from "@mui/material";
import { employeeColumns } from "../../../common/utilitys";
import AdminHeader from "../../common/AdminHeader";
import GroupIcon from "@mui/icons-material/Group";
import AddEmployee from "./AddEmployee";

interface Employee {
  id: number;
  name: string;
  email: string;
  role: string;
  joinDate: string;
  skills: string[];
}

const AllEmployees: React.FC = () => {
  const [activeSection, setActiveSection] = useState("All Employees");
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<boolean>(true);

  const [employees, setEmployees] = useState<Employee[]>(() => {
    const stored = localStorage.getItem("employees");
    return stored ? JSON.parse(stored) : [];
  });

  const [filteredRows, setFilteredRows] = useState<Employee[]>(employees);
  const [openDialog, setOpenDialog] = useState<boolean>(false);

  useEffect(() => {
    const filtered = employees.filter((emp) =>
      Object.values(emp).some((val) =>
        String(val).toLowerCase().includes(searchQuery.toLowerCase())
      )
    );
    setFilteredRows(filtered);
  }, [searchQuery, employees]);

  const handleAddEmployee = (employee: Omit<Employee, "id">) => {
    const newEmp: Employee = { ...employee, id: Date.now() };
    const updatedEmployees = [...employees, newEmp];
    setEmployees(updatedEmployees);
    localStorage.setItem("employees", JSON.stringify(updatedEmployees));
  };

  useEffect(() => {
    setActiveSection("All Employees");
  }, []);

  return (
    <Box>
      <AdminHeader
        activeSection={activeSection}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        viewMode={viewMode}
        setViewMode={setViewMode}
        filteredCount={filteredRows.length}
        onAddClick={() => setOpenDialog(true)}
        isgrid={true}
      />

      {viewMode ? (
        <Box sx={{ height: "calc(78vh - 150px)", mt: 2 }}>
          <DataGrid
            rows={filteredRows}
            columns={employeeColumns}
            pageSizeOptions={[5, 10, 20]}
            initialState={{ pagination: { paginationModel: { pageSize: 5 } } }}
            sx={{
              backgroundColor: "#fff",
              borderRadius: "12px",
              boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
              border: "none",
              height: "100%",

              "& .MuiDataGrid-columnHeaders": {
                backgroundColor: "#f5f5f5",
                color: "#333",
                fontWeight: 600,
                fontSize: "0.95rem",
              },

              "& .MuiDataGrid-cell": {
                borderBottom: "1px solid #f0f0f0",
                fontSize: "0.9rem",
              },

              "& .MuiDataGrid-row:hover": {
                backgroundColor: "#fafafa",
                cursor: "pointer",
              },

              "& .MuiDataGrid-footerContainer": {
                borderTop: "1px solid #f0f0f0",
                backgroundColor: "#fafafa",
              },

              "& .MuiTablePagination-root": {
                fontSize: "0.85rem",
              },
            }}
          />
        </Box>
      ) : (
        <Grid container spacing={2} sx={{ mt: 2, justifyContent: "center" }}>
          {filteredRows.map((emp) => (
            <Grid
              item
              key={emp.id}
              xs={12}
              sm={6}
              md={3}
              lg={3}
              sx={{ display: "flex", justifyContent: "center" }}
            >
              <Card
                sx={{
                  width: 250,
                  height: 260,
                  borderRadius: 3,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  boxShadow: 3,
                  p: 1,
                }}
              >
                <CardContent sx={{ p: 2, textAlign: "center" }}>
                  <GroupIcon sx={{ color: "#6c63ff", mb: 1 }} />
                  <Typography
                    variant="h5"
                    sx={{
                      fontWeight: 700,
                      color: "#1976d2",
                      fontSize: "1.5rem",
                      mb: 1.5,
                    }}
                  >
                    {emp.name}
                  </Typography>
                  <Typography>Email: {emp.email}</Typography>
                  <Typography>Role: {emp.role}</Typography>
                  <Typography>Join Date: {emp.joinDate}</Typography>
                  <Typography>
                    Skills:{" "}
                    {Array.isArray(emp.skills)
                      ? emp.skills.join(", ")
                      : emp.skills}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {openDialog && (
        <AddEmployee
          openDialog={openDialog}
          setOpenDialog={setOpenDialog}
          onSave={handleAddEmployee}
        />
      )}
    </Box>
  );
};

export default AllEmployees;
