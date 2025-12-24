import React, { useEffect, useState, useMemo, useContext } from "react";
import {
  Box,
  Typography,
  Tabs,
  Tab,
  IconButton,
  InputBase,
  MenuItem,
  TextField,
  Button,
} from "@mui/material";

import ReceiptIcon from "@mui/icons-material/Receipt";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";

import * as XLSX from "xlsx";

import {
  DataGrid,
  GridColDef,
  GridColumnHeaderParams,
} from "@mui/x-data-grid";

import { UserContext } from "../components/UserContext";

const primaryColor = "#906aff";

const Logs: React.FC = () => {
  const { token } = useContext(UserContext);

  const [logs, setLogs] = useState<any[]>([]);
  const [tab, setTab] = useState(0);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("currentMonth");

  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });

  useEffect(() => {
    if (!token) return;

    fetch("http://localhost:5000/api/logs", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(async (res) => (res.ok ? res.json() : []))
      .then(setLogs)
      .catch(console.error);
  }, [token]);

  const securityActions = ["login", "logout"];
  const systemActions = [
    "employees_fetched",
    "employee_created",
    "employee_updated",
    "employee_deleted",
    "projects_fetched",
    "project_created",
    "project_updated",
    "project_deleted",
    "job_created",
    "job_updated",
    "job_deleted",
    "event_image_uploaded",
  ];

  const filteredByTab = useMemo(
    () =>
      tab === 0
        ? logs.filter((l) => securityActions.includes(l.action))
        : logs.filter((l) => systemActions.includes(l.action)),
    [tab, logs]
  );

  const searched = useMemo(
    () =>
      filteredByTab.filter((log) =>
        [log.name, log.action, log.status, log.date, log.time]
          .filter(Boolean)
          .some((v) =>
            String(v).toLowerCase().includes(search.toLowerCase())
          )
      ),
    [filteredByTab, search]
  );

  const sorted = searched;

  const renderHeaderNoArrows = (params: GridColumnHeaderParams<any>) => (
    <Typography sx={{ fontWeight: "bold", fontSize: "0.875rem" }}>
      {params.colDef.headerName}
    </Typography>
  );

  const columns: GridColDef[] = [
    {
      field: "name",
      headerName: "User",
      flex: 1,
      sortable: false,
      renderHeader: renderHeaderNoArrows,
    },
    {
      field: "action",
      headerName: "Action",
      flex: 1,
      sortable: false,
      renderHeader: renderHeaderNoArrows,
    },
    {
      field: "status",
      headerName: "Status",
      flex: 1,
      sortable: false,
      renderHeader: renderHeaderNoArrows,
    },
    {
      field: "date",
      headerName: "Date",
      flex: 1,
      sortable: false,
      renderHeader: renderHeaderNoArrows,
    },
    {
      field: "time",
      headerName: "Time",
      flex: 1,
      sortable: false,
      renderHeader: renderHeaderNoArrows,
    },
  ];

  const downloadExcel = () => {
    const sheet = XLSX.utils.json_to_sheet(sorted);
    const book = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(book, sheet, "Logs");
    XLSX.writeFile(book, "logs.xlsx");
  };

  return (
    <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>

      <Box
        sx={{
          px: 3,
          mb: 1,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <ReceiptIcon sx={{ fontSize: 28, color: "#000" }} />
          <Typography sx={{ fontSize: 22, fontWeight: 700 }}>Logs</Typography>
        </Box>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            border: "1px solid #e2e2e2",
            borderRadius: "25px",
            px: 2,
            width: 300,
            height: 40,
            background: "#fff",
          }}
        >
          <SearchIcon sx={{ color: "#aaa", mr: 1 }} />
          <InputBase
            placeholder="Search logs"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            sx={{ flex: 1 }}
          />
          {search && (
            <IconButton size="small" onClick={() => setSearch("")}>
              <ClearIcon />
            </IconButton>
          )}
        </Box>
      </Box>

      <Box sx={{ height: 2, backgroundColor: "#e2e2e2", mx: 3, mb: 2 }} />

      <Box
        sx={{
          px: 3,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Tabs
          value={tab}
          onChange={(_, v) => setTab(v)}
          TabIndicatorProps={{ style: { background: primaryColor } }}
          sx={{
            "& .MuiTab-root": {
              textTransform: "none",
              color: "#000 !important",
              "&.Mui-selected": { color: "#000 !important" },
              "&:focus": { outline: "none !important" },
              "&.Mui-focusVisible": { outline: "none !important" },
            },
          }}
        >
          <Tab label="Security Audit Logs" />
          <Tab label="System Logs" />
        </Tabs>

        <Box sx={{ display: "flex", gap: 2 }}>
          <TextField
            select
            size="small"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            sx={{ width: 150 }}
          >
            <MenuItem value="currentMonth">Current Month</MenuItem>
            <MenuItem value="quarter">Quarterly</MenuItem>
          </TextField>

          <Button
            variant="contained"
            sx={{
              backgroundColor: primaryColor,
              borderRadius: "25px",
              px: 3,
              textTransform: "none",
              "&:hover": {
                backgroundColor: "#7a53e3 !important",
              },
            }}
            onClick={downloadExcel}
          >
            Download
          </Button>
        </Box>
      </Box>

      <Box sx={{ height: 2, backgroundColor: "#e2e2e2", mx: 3, mt: 2, mb: 2 }} />

      <Box
        sx={{
          mx: 3,
          border: "1px solid #e0e0e0",
          borderRadius: 2,
          background: "#fff",
          height: 560,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        <DataGrid
          rows={sorted}
          columns={columns}
          getRowId={(row) => row._id}
          disableColumnMenu
          disableColumnFilter
          disableColumnSelector
          disableColumnSorting
          disableRowSelectionOnClick
          paginationModel={paginationModel}
          onPaginationModelChange={setPaginationModel}
          autoHeight={false}
          sx={{
            border: "none",

            "& .MuiDataGrid-columnHeaders": {
              backgroundColor: "#eef3f7 !important",
              borderBottom: "1px solid #e5e7eb",
              position: "sticky",
              top: 0,
              zIndex: 2,
            },

            "& .MuiDataGrid-columnHeader": {
              backgroundColor: "#eef3f7 !important",
            },

            "& .MuiDataGrid-filler, .MuiDataGrid-scrollbarFiller": {
              backgroundColor: "#eef3f7 !important",
            },

            "& .MuiDataGrid-virtualScroller": {
              overflowY: "auto !important",
              backgroundColor: "#fff",
              height: "calc(100% - 56px)",
            },

            "& .MuiDataGrid-footerContainer": {
              borderTop: "1px solid #eee",
              background: "#fafafa",
            },

            "& .MuiDataGrid-cell": {
              fontSize: "0.875rem",
            },
          }}
        />
      </Box>
    </Box>
  );
};

export default Logs;
