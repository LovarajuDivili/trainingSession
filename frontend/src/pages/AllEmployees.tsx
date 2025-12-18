import React, { useState, useContext } from "react";
import {
  Box,
  Typography,
  Button,
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  IconButton,
  TextField,
} from "@mui/material";

import PeopleIcon from "@mui/icons-material/People";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

import {
  DataGrid,
  GridActionsCellItem,
  type GridColDef,
} from "@mui/x-data-grid";

import AddEmployeeDialog from "../components/EmployeeDialog";
import EditEmployeeDialog from "../components/EmployeeDialogAdd";
import EmployeeContext from "../ContextFiles/EmpContext";
import type { Employee } from "../common/types";

import { apiRequest } from "../Services/apiService";

const primaryColor = "#906aff";
const pageSizeOptions = [5, 10, 20, 50];

const AllEmployees: React.FC = () => {
  const ctx = useContext(EmployeeContext);
  if (!ctx) throw new Error("EmployeeContext missing");

  const { filteredEmployees, setEmployees } = ctx;

  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editEmployee, setEditEmployee] = useState<Employee | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [employeeToDelete, setEmployeeToDelete] = useState<Employee | null>(
    null
  );

  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });

  const handleAddEmployee = async (emp: Employee) => {
    const saved = await apiRequest<Employee, Employee>({
      endpoint: "/api/employees",
      method: "POST",
      payload: emp,
    });

    setEmployees((prev) => [...prev, saved]);
    setAddDialogOpen(false);
  };

  const handleUpdateEmployee = async (emp: Employee) => {
    const saved = await apiRequest<Employee, Employee>({
      endpoint: `/api/employees/${emp.id}`,
      method: "PUT",
      payload: emp,
    });

    setEmployees((prev) => prev.map((e) => (e.id === saved.id ? saved : e)));
    setEditDialogOpen(false);
  };

  const handleDeleteEmployee = async () => {
    if (!employeeToDelete) return;

    await apiRequest({
      endpoint: `/api/employees/${employeeToDelete.id}`,
      method: "DELETE",
    });

    setEmployees((prev) => prev.filter((e) => e.id !== employeeToDelete.id));
    setDeleteConfirmOpen(false);
  };

  const totalEmployees = filteredEmployees.length;

  const CustomFooter = () => {
    const from =
      totalEmployees === 0
        ? 0
        : paginationModel.page * paginationModel.pageSize + 1;
    const to = Math.min(
      (paginationModel.page + 1) * paginationModel.pageSize,
      totalEmployees
    );

    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          alignItems: "center",
          px: 3,
          py: 1.5,
          borderTop: "1px solid #e3e3e3",
          background: "#fafafa",
          gap: 3,
        }}
      >
        <Typography fontSize={14}>Rows per page</Typography>

        <TextField
          select
          size="small"
          value={paginationModel.pageSize}
          onChange={(e) =>
            setPaginationModel({ page: 0, pageSize: Number(e.target.value) })
          }
          sx={{ width: 70 }}
        >
          {pageSizeOptions.map((size) => (
            <option key={size} value={size}>
              {size}
            </option>
          ))}
        </TextField>

        <Typography fontSize={14}>
          {from}-{to} of {totalEmployees}
        </Typography>

        <IconButton
          size="small"
          disabled={paginationModel.page === 0}
          onClick={() =>
            setPaginationModel((m) => ({ ...m, page: m.page - 1 }))
          }
        >
          <ArrowBackIcon fontSize="small" />
        </IconButton>

        <IconButton
          size="small"
          disabled={
            paginationModel.page >=
            Math.ceil(totalEmployees / paginationModel.pageSize) - 1
          }
          onClick={() =>
            setPaginationModel((m) => ({ ...m, page: m.page + 1 }))
          }
        >
          <ArrowForwardIcon fontSize="small" />
        </IconButton>
      </Box>
    );
  };

  const columns: GridColDef<Employee>[] = [
    {
      field: "name",
      headerName: "Employee",
      flex: 1.5,
      renderCell: ({ row }) => (
        <Box display="flex" alignItems="center" gap={1.5}>
          <Avatar sx={{ bgcolor: primaryColor, width: 32, height: 32 }}>
            {row.name?.[0]}
          </Avatar>
          <Typography fontSize={14} fontWeight={500}>
            {row.name}
          </Typography>
        </Box>
      ),
    },
    { field: "email", headerName: "Email", flex: 1.5 },
    { field: "role", headerName: "Role", flex: 1 },
    { field: "projectName", headerName: "Project", flex: 1.2 },
    {
      field: "actions",
      type: "actions",
      headerName: "Actions",
      width: 100,
      getActions: ({ row }) => [
        <GridActionsCellItem
          icon={<EditIcon />}
          label="Edit"
          onClick={() => {
            setEditEmployee(row);
            setEditDialogOpen(true);
          }}
          sx={{ color: primaryColor }}
        />,
        <GridActionsCellItem
          icon={<DeleteIcon />}
          label="Delete"
          onClick={() => {
            setEmployeeToDelete(row);
            setDeleteConfirmOpen(true);
          }}
          sx={{ color: primaryColor }}
        />,
      ],
    },
  ];

  return (
    <Box p={2}>
      <Box display="flex" justifyContent="space-between" mb={2}>
        <Box display="flex" alignItems="center" gap={1}>
          <PeopleIcon />
          <Typography fontSize={22} fontWeight={700}>
            Employees ({totalEmployees})
          </Typography>
        </Box>

        <Button
          variant="contained"
          onClick={() => setAddDialogOpen(true)}
          sx={{
            borderRadius: "50px",
            textTransform: "none",
            height: 45,
            backgroundColor: primaryColor,
          }}
        >
          Add Employee <AddIcon />
        </Button>
      </Box>

      <DataGrid
        rows={filteredEmployees}
        columns={columns}
        getRowId={(row) => row.id}
        paginationModel={paginationModel}
        onPaginationModelChange={setPaginationModel}
        disableRowSelectionOnClick
        slots={{ footer: CustomFooter }}
        sx={{
          border: "1px solid #e0e0e0",
          borderRadius: 2,
          height: 500,
          "& .MuiDataGrid-columnHeader": {
            backgroundColor: "#f5f7fb",
            fontWeight: 700,
          },
          "& .MuiDataGrid-row:hover": {
            backgroundColor: "#fafafa",
          },
        }}
      />

      <AddEmployeeDialog
        open={addDialogOpen}
        onClose={() => setAddDialogOpen(false)}
        onAddEmployee={handleAddEmployee}
      />

      <EditEmployeeDialog
        open={editDialogOpen}
        employee={editEmployee as Employee}
        onClose={() => setEditDialogOpen(false)}
        onUpdateEmployee={handleUpdateEmployee}
      />

      <Dialog
        open={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
      >
        <DialogTitle>Delete Employee</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete {employeeToDelete?.name}?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteConfirmOpen(false)}>Cancel</Button>
          <Button
            color="error"
            variant="contained"
            onClick={handleDeleteEmployee}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AllEmployees;
