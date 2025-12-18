import React, { useEffect, useState, useMemo } from "react";
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
  type GridColDef,
  type GridColumnHeaderParams,
} from "@mui/x-data-grid";

import { apiRequest } from "../Services/apiService";

const primaryColor = "#906aff";

type LogItem = {
  _id: string;
  name?: string;
  action?: string;
  status?: string;
  date?: string;
  time?: string;
};

const Logs: React.FC = () => {
  const [logs, setLogs] = useState<LogItem[]>([]);
  const [tab, setTab] = useState(0);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("currentMonth");

  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const data = await apiRequest<LogItem[]>({
          endpoint: "/api/logs",
          method: "GET",
        });
        setLogs(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Error fetching logs:", err);
      }
    };

    fetchLogs();
  }, []);

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
        ? logs.filter((l) => securityActions.includes(l.action || ""))
        : logs.filter((l) => systemActions.includes(l.action || "")),
    [tab, logs]
  );

  const searched = useMemo(
    () =>
      filteredByTab.filter((log) =>
        [log.name, log.action, log.status, log.date, log.time]
          .filter(Boolean)
          .some((v) => String(v).toLowerCase().includes(search.toLowerCase()))
      ),
    [filteredByTab, search]
  );

  const renderHeaderNoArrows = (params: GridColumnHeaderParams<any>) => (
    <Typography sx={{ fontWeight: 600, fontSize: "0.85rem" }}>
      {params.colDef.headerName}
    </Typography>
  );

  const columns: GridColDef[] = [
    {
      field: "name",
      headerName: "User",
      flex: 1,
      renderHeader: renderHeaderNoArrows,
    },
    {
      field: "action",
      headerName: "Action",
      flex: 1,
      renderHeader: renderHeaderNoArrows,
    },
    {
      field: "status",
      headerName: "Status",
      flex: 1,
      renderHeader: renderHeaderNoArrows,
    },
    {
      field: "date",
      headerName: "Date",
      flex: 1,
      renderHeader: renderHeaderNoArrows,
    },
    {
      field: "time",
      headerName: "Time",
      flex: 1,
      renderHeader: renderHeaderNoArrows,
    },
  ];

  const downloadExcel = () => {
    const sheet = XLSX.utils.json_to_sheet(searched);
    const book = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(book, sheet, "Logs");
    XLSX.writeFile(book, "logs.xlsx");
  };

  return (
    <Box
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        bgcolor: "#f5f7fb",
      }}
    >
      <Box
        sx={{
          px: 3,
          py: 2,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Box display="flex" alignItems="center" gap={1}>
          <ReceiptIcon sx={{ fontSize: 26 }} />
          <Typography sx={{ fontSize: 22, fontWeight: 700 }}>Logs</Typography>
        </Box>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            border: "1px solid #ddd",
            borderRadius: 25,
            px: 2,
            width: 300,
            height: 40,
            background: "#fff",
          }}
        >
          <SearchIcon sx={{ color: "#999", mr: 1 }} />
          <InputBase
            placeholder="Search logs"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            sx={{ flex: 1, fontSize: 14 }}
          />
          {search && (
            <IconButton size="small" onClick={() => setSearch("")}>
              <ClearIcon fontSize="small" />
            </IconButton>
          )}
        </Box>
      </Box>

      <Box sx={{ px: 3 }}>
        <Tabs
          value={tab}
          onChange={(_, v) => setTab(v)}
          TabIndicatorProps={{ style: { background: primaryColor } }}
        >
          <Tab label="Security Audit Logs" />
          <Tab label="System Logs" />
        </Tabs>
      </Box>

      <Box
        sx={{
          px: 3,
          py: 2,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <TextField
          select
          size="small"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          sx={{
            width: 130,
            background: "#fff",
            borderRadius: "50px",
            "& .MuiOutlinedInput-root": {
              borderRadius: "50px",
            },
          }}
        >
          <MenuItem value="currentMonth">Current Month</MenuItem>
          <MenuItem value="quarter">Quarterly</MenuItem>
        </TextField>

        <Button
          variant="contained"
          onClick={downloadExcel}
          sx={{
            backgroundColor: primaryColor,
            borderRadius: 25,
            px: 3,
            textTransform: "none",
          }}
        >
          Download
        </Button>
      </Box>

      <Box
        sx={{
          mx: 3,
          mb: 3,
          borderRadius: 3,
          background: "#fff",
          boxShadow: "0 6px 18px rgba(0,0,0,0.05)",
          height: 400,
          overflow: "hidden",
        }}
      >
        <DataGrid
          rows={searched}
          columns={columns}
          getRowId={(row) => row._id}
          paginationModel={paginationModel}
          onPaginationModelChange={setPaginationModel}
          disableRowSelectionOnClick
          disableColumnMenu
          disableColumnSorting
          sx={{
            border: "none",
            "& .MuiDataGrid-columnHeaders": {
              backgroundColor: "#f3f4f6",
              borderBottom: "1px solid #e5e7eb",
            },
            "& .MuiDataGrid-row:hover": {
              backgroundColor: "#faf8ff",
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
