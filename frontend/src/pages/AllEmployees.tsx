import React, { useState, useContext, useEffect, useCallback } from 'react';
import {
  Box,
  Typography,
  InputBase,
  IconButton,
  Button,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Card,
  CardContent,
  TextField,
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import GridViewIcon from '@mui/icons-material/GridView';
import PeopleIcon from '@mui/icons-material/People';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import {
  DataGrid,
  type GridRenderCellParams,
  type GridSortModel,
  type GridColDef,
  type GridColumnHeaderParams,
} from '@mui/x-data-grid';
import AddEmployeeDialog from '../components/AddEmployeeDialog';
import EditEmployeeDialog from '../components/EditEmployeeDialog';
import EmployeeContext from '../context/EmployeeContext';
import { UserContext } from '../components/UserContext';
import type { Employee } from '../common/types';

const primaryColor = '#906aff';
const pageSizeOptions = [5, 10, 20, 50];

const AllEmployees: React.FC = () => {
  const ctx = useContext(EmployeeContext);
  if (!ctx) {
    throw new Error(
      'EmployeeContext is missing. Ensure EmployeeProvider wraps this component.'
    );
  }

  const { filteredEmployees, setEmployees } = ctx;
  const { token } = useContext(UserContext);

  const [showGrid, setShowGrid] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editEmployee, setEditEmployee] = useState<Employee | null>(null);
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 });
  const [localEmployees, setLocalEmployees] = useState<Employee[]>([]);
  const [sortModel, setSortModel] = useState<GridSortModel>([]);
  const [menuAnchorEl, setMenuAnchorEl] = useState<HTMLElement | null>(null);
  const [menuRow, setMenuRow] = useState<Employee | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [employeeToDelete, setEmployeeToDelete] = useState<Employee | null>(null);

  useEffect(() => {
    setLocalEmployees(filteredEmployees || []);
  }, [filteredEmployees]);

  const displayedEmployeesUnsorted = localEmployees.filter((emp) =>
    [emp.name, emp.role, emp.email]
      .filter(Boolean)
      .some((field) =>
        String(field).toLowerCase().includes(searchTerm.toLowerCase())
      )
  );

  const applySorting = useCallback(
    (employees: Employee[], sortModel: GridSortModel): Employee[] => {
      if (sortModel.length === 0) return employees;
      const { field, sort } = sortModel[0];

      return [...employees].sort((a, b) => {
        const aRaw = a[field as keyof Employee];
        const bRaw = b[field as keyof Employee];

        if (aRaw == null) return 1;
        if (bRaw == null) return -1;

        if (field === 'joinDate') {
          const aDate = new Date(aRaw as string);
          const bDate = new Date(bRaw as string);
          if (isNaN(aDate.getTime())) return 1;
          if (isNaN(bDate.getTime())) return -1;
          return sort === 'asc'
            ? aDate.getTime() - bDate.getTime()
            : bDate.getTime() - aDate.getTime();
        }

        if (field === 'skills') {
          const aSkills = Array.isArray(aRaw) ? (aRaw as string[]).join(',') : '';
          const bSkills = Array.isArray(bRaw) ? (bRaw as string[]).join(',') : '';
          return sort === 'asc'
            ? aSkills.localeCompare(bSkills)
            : bSkills.localeCompare(aSkills);
        }

        if (typeof aRaw === 'string' && typeof bRaw === 'string') {
          return sort === 'asc'
            ? aRaw.localeCompare(bRaw)
            : bRaw.localeCompare(aRaw);
        }

        return 0;
      });
    },
    []
  );

  const displayedEmployees = applySorting(displayedEmployeesUnsorted, sortModel);
  const totalEmployees = displayedEmployees.length;
  const totalPages = Math.max(
    1,
    Math.ceil(totalEmployees / paginationModel.pageSize)
  );

  const handleRowMenuOpen = (
    event: React.MouseEvent<HTMLElement>,
    row: Employee
  ) => {
    setMenuAnchorEl(event.currentTarget);
    setMenuRow(row);
  };

  const handleRowMenuClose = () => {
    setMenuAnchorEl(null);
    setMenuRow(null);
  };

  const handleRowEdit = () => {
    if (!menuRow) return;
    setEditEmployee(menuRow);
    setEditDialogOpen(true);
    handleRowMenuClose();
  };

  const handleRowDeleteClick = () => {
    if (!menuRow) return;
    setEmployeeToDelete(menuRow);
    setDeleteConfirmOpen(true);
    handleRowMenuClose();
  };

  const handleAddEmployee = async (employeeData: Omit<Employee, 'id'>) => {
    try {
      const response = await fetch('http://localhost:5000/api/employees', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          ...employeeData,
          image: undefined,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Raw response:', errorText);
        throw new Error(`HTTP ${response.status}: ${errorText.slice(0, 200)}`);
      }

      const savedEmployee = await response.json();
      setEmployees((prev) => [...prev, savedEmployee]);
      setDialogOpen(false);
    } catch (error: any) {
      console.error('Add error:', error);
      alert(`Add failed: ${error.message}`);
    }
  };

  const handleUpdateEmployee = async (updatedEmployee: Employee) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/employees/${updatedEmployee.id}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            ...updatedEmployee,
            image: undefined,
          }),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Raw response:', errorText);
        throw new Error(`HTTP ${response.status}: ${errorText.slice(0, 200)}`);
      }

      const savedEmployee = await response.json();
      setEmployees((prev) =>
        prev.map((emp) => (emp.id === savedEmployee.id ? savedEmployee : emp))
      );
      setEditDialogOpen(false);
      setEditEmployee(null);
    } catch (error: any) {
      console.error('Update error:', error);
      alert(`Update failed: ${error.message}`);
    }
  };

  const handleRowDelete = async () => {
    if (!employeeToDelete) return;
    try {
      const response = await fetch(
        `http://localhost:5000/api/employees/${employeeToDelete.id}`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Raw response:', errorText);
        throw new Error(`HTTP ${response.status}`);
      }

      setEmployees((prev) =>
        prev.filter((emp) => emp.id !== employeeToDelete.id)
      );
    } catch (error: any) {
      console.error('Delete error:', error);
      alert(`Delete failed: ${error.message}`);
    } finally {
      setDeleteConfirmOpen(false);
      setEmployeeToDelete(null);
    }
  };

  const handleSort = (field: string, direction: 'asc' | 'desc') => {
    if (sortModel.length === 1 && sortModel[0].field === field) {
      const newSort =
        sortModel[0].sort === direction ? [] : [{ field, sort: direction }];
      setSortModel(newSort);
    } else {
      setSortModel([{ field, sort: direction }]);
    }
    setPaginationModel((m) => ({ ...m, page: 0 }));
  };

  const getEmployeeImage = (emp: Employee): string | undefined => {
    const anyEmp = emp as any;
    if (anyEmp.image) return anyEmp.image as string;
    if (emp.id) {
      const stored = localStorage.getItem(`employee_image_${emp.id}`);
      if (stored) return stored;
    }
    return undefined;
  };

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
          display: 'flex',
          justifyContent: 'flex-end',
          alignItems: 'center',
          px: 3,
          py: 1.5,
          borderTop: '1px solid #e3e3e3',
          background: '#fafafa',
          gap: 3,
        }}
      >
        <Typography sx={{ fontSize: '0.875rem', color: '#555' }}>
          Rows per page:
        </Typography>
        <TextField
          select
          size="small"
          value={paginationModel.pageSize}
          onChange={(e) =>
            setPaginationModel({ page: 0, pageSize: Number(e.target.value) })
          }
          sx={{
            width: 70,
            '& .MuiOutlinedInput-input': { padding: '4px 8px' },
          }}
        >
          {pageSizeOptions.map((size) => (
            <MenuItem key={size} value={size}>
              {size}
            </MenuItem>
          ))}
        </TextField>
        <Typography sx={{ fontSize: '0.875rem', color: '#555' }}>
          {from}-{to} of {totalEmployees}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <IconButton
            size="small"
            disabled={paginationModel.page === 0}
            onClick={() =>
              setPaginationModel((m) => ({ ...m, page: m.page - 1 }))
            }
            sx={{
              border: '1px solid #e0e0e0',
              borderRadius: '50%',
              '&:disabled': { opacity: 0.3 },
            }}
          >
            <ArrowBackIcon fontSize="small" />
          </IconButton>
          <IconButton
            size="small"
            disabled={paginationModel.page >= totalPages - 1}
            onClick={() =>
              setPaginationModel((m) => ({ ...m, page: m.page + 1 }))
            }
            sx={{
              border: '1px solid #e0e0e0',
              borderRadius: '50%',
              '&:disabled': { opacity: 0.3 },
            }}
          >
            <ArrowForwardIcon fontSize="small" />
          </IconButton>
        </Box>
      </Box>
    );
  };

  const renderHeader = (params: GridColumnHeaderParams<Employee>) => {
    const { colDef, field } = params;

    const sortableFields = ['id', 'name', 'role', 'email', 'projectName', 'joinDate', 'skills'];
    const isSortable = sortableFields.includes(field);

    const currentSort = sortModel.find((s) => s.field === field);
    const sortDirection = currentSort?.sort;

    const handleClickAsc = (e: React.MouseEvent) => {
      e.stopPropagation();
      handleSort(field, 'asc');
    };
    const handleClickDesc = (e: React.MouseEvent) => {
      e.stopPropagation();
      handleSort(field, 'desc');
    };

    return (
      <Box
        sx={{
          display: 'inline-flex',
          alignItems: 'center',
          userSelect: 'none',
          cursor: isSortable ? 'pointer' : 'default',
          '&:hover .sort-icons': {
            opacity: 1,
          },
        }}
      >
        <Typography sx={{ fontWeight: 'bold', fontSize: '0.875rem' }}>
          {colDef.headerName}
        </Typography>
        {isSortable && (
          <Box
            className="sort-icons"
            sx={{
              display: 'inline-flex',
              flexDirection: 'row',
              opacity: 0,
              transition: 'opacity 0.2s ease',
              ml: 0.5,
              '& svg': {
                fontSize: 18,
                color: '#aaa',
                cursor: 'pointer',
                '&.active': {
                  color: primaryColor,
                },
                '&:hover': {
                  color: primaryColor,
                },
                lineHeight: 0,
                ml: 0.3,
              },
            }}
          >
            <ArrowUpwardIcon
              className={sortDirection === 'asc' ? 'active' : ''}
              onClick={handleClickAsc}
            />
            <ArrowDownwardIcon
              className={sortDirection === 'desc' ? 'active' : ''}
              onClick={handleClickDesc}
            />
          </Box>
        )}
      </Box>
    );
  };

  const cellWrapperSx = {
    display: 'flex',
    alignItems: 'center',
    height: '100%',
  } as const;

  const columns: GridColDef<Employee>[] = [
    {
      field: 'name',
      headerName: 'Employee Name',
      flex: 1.2,
      sortable: false,
      renderHeader: renderHeader as unknown as (params: any) => React.ReactNode,
      renderCell: (params: GridRenderCellParams<Employee>) => {
        const emp = params.row;
        const img = getEmployeeImage(emp);
        const initial = emp.name ? emp.name.charAt(0).toUpperCase() : '?';
        return (
          <Box sx={cellWrapperSx}>
            <Avatar
              src={img}
              sx={{ width: 32, height: 32, bgcolor: primaryColor, fontSize: 14, mr: 1.5 }}
            >
              {!img && initial}
            </Avatar>
            <Typography sx={{ fontSize: '0.875rem' }}>{emp.name}</Typography>
          </Box>
        );
      },
    },
    {
      field: 'email',
      headerName: 'Email',
      flex: 1.2,
      sortable: false,
      renderHeader: renderHeader as unknown as (params: any) => React.ReactNode,
      renderCell: (params: GridRenderCellParams<Employee>) => (
        <Box sx={cellWrapperSx}>
          <Typography sx={{ fontSize: '0.875rem' }}>{params.value as string}</Typography>
        </Box>
      ),
    },
    {
      field: 'role',
      headerName: 'Role',
      flex: 1,
      sortable: false,
      renderHeader: renderHeader as unknown as (params: any) => React.ReactNode,
      renderCell: (params: GridRenderCellParams<Employee>) => (
        <Box sx={cellWrapperSx}>
          <Typography sx={{ fontSize: '0.875rem' }}>{params.value as string}</Typography>
        </Box>
      ),
    },
    {
      field: 'joinDate',
      headerName: 'Join Date',
      flex: 1,
      sortable: false,
      renderHeader: renderHeader as unknown as (params: any) => React.ReactNode,
      renderCell: (params: GridRenderCellParams<Employee>) => {
        if (!params.value) return null;
        const date = new Date(params.value as string);
        const text = date.toISOString().split('T')[0];
        return (
          <Box sx={cellWrapperSx}>
            <Typography sx={{ fontSize: '0.875rem' }}>{text}</Typography>
          </Box>
        );
      },
    },
    {
      field: 'id',
      headerName: 'ID',
      flex: 0.6,
      sortable: false,
      renderHeader: renderHeader as unknown as (params: any) => React.ReactNode,
      renderCell: (params: GridRenderCellParams<Employee>) => (
        <Box sx={cellWrapperSx}>
          <Typography sx={{ fontSize: '0.875rem' }}>{params.value as string}</Typography>
        </Box>
      ),
    },
    {
      field: 'skills',
      headerName: 'Skills',
      flex: 1.5,
      sortable: false,
      renderHeader: renderHeader as unknown as (params: any) => React.ReactNode,
      renderCell: (params: GridRenderCellParams<Employee>) => {
        const value = Array.isArray(params.value)
          ? (params.value as string[]).join(', ')
          : (params.value as string);
        return (
          <Box sx={cellWrapperSx}>
            <Typography sx={{ fontSize: '0.875rem' }}>{value}</Typography>
          </Box>
        );
      },
    },
    {
      field: 'projectName',
      headerName: 'Project Name',
      flex: 1.2,
      sortable: false,
      renderHeader: renderHeader as unknown as (params: any) => React.ReactNode,
      renderCell: (params: GridRenderCellParams<Employee>) => (
        <Box sx={cellWrapperSx}>
          <Typography sx={{ fontSize: '0.875rem' }}>
            {params.row.projectName ?? ''}
          </Typography>
        </Box>
      ),
    },
    {
      field: 'rowMenu',
      headerName: '',
      flex: 0.3,
      sortable: false,
      filterable: false,
      renderCell: (params: GridRenderCellParams<Employee>) => (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            width: '100%',
            height: '100%',
          }}
        >
          <IconButton
            size="small"
            onClick={(e) => handleRowMenuOpen(e, params.row)}
          >
            <MoreVertIcon fontSize="small" />
          </IconButton>
        </Box>
      ),
    },
  ];

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 2,
          px: 2,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, fontWeight: 700 }}>
          <PeopleIcon sx={{ fontSize: 28, color: '#000' }} />
          <Typography sx={{ fontSize: 22, fontWeight: 700, color: '#000' }}>
            Employees ({displayedEmployees.length})
          </Typography>
          <IconButton
            size="small"
            onClick={() => setShowGrid(!showGrid)}
            sx={{
              ml: 1,
              color: showGrid ? primaryColor : '#000',
              backgroundColor: showGrid ? 'rgba(144, 106, 255, 0.12)' : 'transparent',
              borderRadius: '999px',
              transition: 'all 0.2s ease',
              '&:hover': {
                backgroundColor: showGrid ? 'rgba(144, 106, 255, 0.2)' : 'rgba(0, 0, 0, 0.04)',
                transform: 'scale(1.05)',
              },
            }}
          >
            <GridViewIcon sx={{ fontSize: 22 }} />
          </IconButton>
        </Box>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              backgroundColor: '#fff',
              border: '1px solid #e2e2e2',
              borderRadius: '999px',
              px: 2,
              height: 44,
              minWidth: 420,
            }}
          >
            <SearchIcon sx={{ color: '#b3b3b3', mr: 1 }} />
            <InputBase
              placeholder="Search by name, role, email"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              sx={{
                flex: 1,
                fontSize: 14,
                '&::placeholder': { color: '#b3b3b3', opacity: 1 },
              }}
            />
            {searchTerm && (
              <IconButton size="small" onClick={() => setSearchTerm('')} sx={{ color: '#b3b3b3' }}>
                <ClearIcon fontSize="small" />
              </IconButton>
            )}
          </Box>
          <Button
            variant="contained"
            onClick={() => setDialogOpen(true)}
            sx={{
              backgroundColor: primaryColor,
              borderRadius: '999px',
              px: 3.5,
              height: 44,
              textTransform: 'none',
              fontWeight: 500,
              fontSize: 15,
              boxShadow: '0px 4px 10px rgba(144,106,255,0.35)',
              '&:hover': { backgroundColor: '#7a53e3', boxShadow: 'none' },
            }}
          >
            Add New +
          </Button>
        </Box>
      </Box>

      <Box sx={{ borderBottom: '1px solid #dcdcdc', mb: 2, mx: 2 }} />

      {!showGrid ? (
        <Box
          sx={{
            flexGrow: 1,
            bgcolor: 'white',
            borderRadius: 2,
            boxShadow: '0 1px 3px rgba(0,0,0,0.12)',
            border: '1px solid #e0e0e0',
            display: 'flex',
            flexDirection: 'column',
            height: '600px',
            overflow: 'auto',
          }}
        >
          <DataGrid
            rows={displayedEmployees}
            columns={columns}
            getRowId={(row) => row.id}
            paginationModel={paginationModel}
            onPaginationModelChange={setPaginationModel}
            showColumnVerticalBorder
            sx={{
              border: 'none',
              height: 540,
              '& .MuiDataGrid-columnHeader': {
                backgroundColor: '#eef3f7 !important',
                borderBottom: '1px solid #e5e7eb',
                minHeight: 48,
                maxHeight: 48,
              },
              '& .MuiDataGrid-filler, .MuiDataGrid-scrollbarFiller': {
                backgroundColor: '#ffffff',
              },
              '& .MuiDataGrid-columnHeader:hover .MuiDataGrid-iconButtonContainer': {
                opacity: 1,
              },
              '& .MuiDataGrid-iconButtonContainer': {
                opacity: 0,
                transition: 'opacity 0.2s ease',
              },
              '& .MuiDataGrid-columnHeaderTitle': {
                fontWeight: 'bold',
                fontSize: '0.875rem',
              },
              '& .MuiDataGrid-row': {
                backgroundColor: '#ffffff',
                width: '100%',
                '&:hover': { backgroundColor: '#f9fafb' },
                '&:last-child .MuiDataGrid-cell': {
                  borderBottom: 'none',
                },
              },
              '& .MuiDataGrid-columnSeparator': { display: 'none' },
              '& .MuiDataGrid-cell': {
                borderBottom: '1px solid #f1f1f1',
                fontSize: '0.875rem',
                color: '#374151',
                padding: '0 16px',
                '&:focus, &:focus-within': { outline: 'none' },
              },
              '& .MuiDataGrid-virtualScroller': {
                backgroundColor: '#ffffff',
                overflowY: 'auto !important',
              },
              '& .MuiDataGrid-topContainer': { borderBottom: 'none' },
            }}
            disableRowSelectionOnClick
            disableColumnMenu
            slots={{ footer: CustomFooter }}
          />
        </Box>
      ) : (
        <Box
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 2,
            height: '600px',
            overflowY: 'auto',
          }}
        >
          {displayedEmployees.map((emp) => {
            const img = getEmployeeImage(emp);
            const initial = emp.name ? emp.name.charAt(0).toUpperCase() : '?';
            return (
              <Card
                key={emp.id}
                sx={{
                  height: 230,
                  width: 260,
                  p: 2,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                }}
              >
                <Avatar
                  src={img}
                  sx={{ width: 64, height: 64, bgcolor: primaryColor, mb: 1, fontSize: 24 }}
                >
                  {!img && initial}
                </Avatar>
                <CardContent sx={{ textAlign: 'center', pt: 0 }}>
                  <Typography variant="h6">{emp.name}</Typography>
                  <Typography>Role: {emp.role}</Typography>
                  <Typography>
                    Skills:{' '}
                    {Array.isArray(emp.skills)
                      ? emp.skills.join(', ')
                      : (emp.skills as any)}
                  </Typography>
                </CardContent>
              </Card>
            );
          })}
        </Box>
      )}

      <Menu
        anchorEl={menuAnchorEl}
        open={Boolean(menuAnchorEl)}
        onClose={handleRowMenuClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <MenuItem onClick={handleRowEdit}>
          <ListItemIcon>
            <EditIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Edit</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleRowDeleteClick}>
          <ListItemIcon>
            <DeleteIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Delete</ListItemText>
        </MenuItem>
      </Menu>

      <AddEmployeeDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onAddEmployee={handleAddEmployee as any}
      />
      <EditEmployeeDialog
        open={editDialogOpen}
        employee={editEmployee as any}
        onClose={() => {
          setEditDialogOpen(false);
          setEditEmployee(null);
        }}
        onUpdateEmployee={handleUpdateEmployee as any}
      />

      <Dialog
        open={deleteConfirmOpen}
        onClose={() => {
          setDeleteConfirmOpen(false);
          setEmployeeToDelete(null);
        }}
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete{' '}
            <strong>{employeeToDelete?.name ?? 'this employee'}</strong>?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setDeleteConfirmOpen(false);
              setEmployeeToDelete(null);
            }}
            sx={{
              color: '#906aff',
              textTransform: 'none',
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleRowDelete}
            variant="contained"
            sx={{
              backgroundColor: '#906aff',
              color: '#fff',
              textTransform: 'none',
              borderRadius: '8px',
              boxShadow: 'none',
              '&:hover': {
                backgroundColor: '#7a53e3',
              },
            }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AllEmployees;
