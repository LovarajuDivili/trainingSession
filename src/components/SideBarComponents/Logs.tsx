// Update your Logs component to handle system logs
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Box,
  Typography,
  Button,
  Stack,
  Paper,
  Menu,
  MenuItem,
  IconButton,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import DashboardHeader from "../DashboardHeader";
import { sidebarItems } from "../../common/sidebarItems";
import { useState, useEffect } from "react";
import { useThemeColors } from "../../hooks/useThemeColors";
import DownloadIcon from "@mui/icons-material/Download";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import axios from "axios";

// Update the LogRow interface
interface LogRow {
  id: string;
  user?: string;
  action?: string;
  status?: string;
  date?: string;
  time?: string;
  // Add system log fields
  name?: string;
  type?: string;
}

const Logs = () => {
  const currentItem = sidebarItems.find((item) => item.route === "/admin/logs");
  const [activeTab, setActiveTab] = useState("security");
  const [paginationModel, setPaginationModel] = useState({
    pageSize: 10,
    page: 0,
  });
  const colors = useThemeColors();
  const [monthAnchorEl, setMonthAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedMonth, setSelectedMonth] = useState("Current Month");
  const [searchText, setSearchText] = useState("");
  const [rows, setRows] = useState<LogRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalCount, setTotalCount] = useState(0);

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  // Define columns for the data grid
  const securityColumns = [
    {
      field: "user",
      headerName: "User",
      width: 250,
      headerClassName: "grid-header",
    },
    {
      field: "action",
      headerName: "Action",
      width: 242,
      headerClassName: "grid-header",
    },
    {
      field: "status",
      headerName: "Status",
      width: 250,
      headerClassName: "grid-header",
      renderCell: (params: any) => (
        <Typography
          sx={{
            color:
              params.value === "success"
                ? "green"
                : params.value === "failed"
                ? "red"
                : "orange",
            fontWeight: "bold",
          }}
        >
          {params.value}
        </Typography>
      ),
    },
    {
      field: "date",
      headerName: "DATE (MM-DD-YYYY)",
      width: 240,
      headerClassName: "grid-header",
    },
    {
      field: "time",
      headerName: "TIME",
      width: 220,
      headerClassName: "grid-header",
    },
  ];

  const systemColumns = [
    {
      field: "name",
      headerName: "Name",
      width: 230,
      headerClassName: "grid-header",
    },
    {
      field: "type",
      headerName: "Type",
      width: 200,
      headerClassName: "grid-header",
    },
    {
      field: "action",
      headerName: "Action",
      width: 200,
      headerClassName: "grid-header",
    },
    {
      field: "status",
      headerName: "Status",
      width: 200,
      headerClassName: "grid-header",
      renderCell: (params: any) => (
        <Typography
          sx={{
            color:
              params.value === "success"
                ? "green"
                : params.value === "failed"
                ? "red"
                : "orange",
            fontWeight: "bold",
          }}
        >
          {params.value}
        </Typography>
      ),
    },
    {
      field: "date",
      headerName: "DATE (MM-DD-YYYY)",
      width: 200,
      headerClassName: "grid-header",
    },
    {
      field: "time",
      headerName: "TIME",
      width: 180,
      headerClassName: "grid-header",
    },
  ];

  const auditTraceColumns = [
    {
      field: "action",
      headerName: "ACTION",
      width: 300,
      headerClassName: "grid-header",
    },
    {
      field: "type",
      headerName: "TYPE",
      width: 300,
      headerClassName: "grid-header",
    },
    {
      field: "date",
      headerName: "DATE (MM-DD-YYYY)",
      width: 300,
      headerClassName: "grid-header",
    },
    {
      field: "time",
      headerName: "TIME",
      width: 300,
      headerClassName: "grid-header",
    },
  ];

  // Get the appropriate columns based on active tab
  const getCurrentColumns = () => {
    switch (activeTab) {
      case "security":
        return securityColumns;
      case "system":
        return systemColumns;
      case "audit":
        return auditTraceColumns;
      default:
        return securityColumns;
    }
  };

  // Fetch logs data
  const fetchLogs = async () => {
    try {
      setLoading(true);
      const token = sessionStorage.getItem("token");

      let endpoint = "";
      if (activeTab === "security") {
        endpoint = `http://localhost:8000/v-1/application/logs/security?page=${paginationModel.page}&page_size=${paginationModel.pageSize}&search=${searchText}`;
      } else if (activeTab === "system") {
        endpoint = `http://localhost:8000/v-1/application/logs/system?page=${paginationModel.page}&page_size=${paginationModel.pageSize}&search=${searchText}`;
      } else {
        // For audit tab, return empty for now
        setRows([]);
        setTotalCount(0);
        return;
      }

      const response = await axios.get(endpoint, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = response.data;
      setRows(data.logs || []);
      setTotalCount(data.total || 0);
    } catch (error) {
      console.error("Error fetching logs:", error);
      setRows([]);
      setTotalCount(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [activeTab, paginationModel, searchText]);

  const handleTabClick = (tab: string) => {
    setActiveTab(tab);
    setPaginationModel({ page: 0, pageSize: 10 });
  };

  const handleMonthClick = (event: React.MouseEvent<HTMLElement>) => {
    setMonthAnchorEl(event.currentTarget);
  };

  const handleMonthClose = () => {
    setMonthAnchorEl(null);
  };

  const handleMonthSelect = (month: string) => {
    setSelectedMonth(month);
    handleMonthClose();
  };

  return (
    <Box>
      <DashboardHeader
        title={currentItem?.label || "Logs"}
        icon={currentItem?.icon}
        showSearch={true}
        searchText={searchText}
        onSearchChange={setSearchText}
      />

      {/* Button Section - All in one row */}
      <Stack
        direction="row"
        sx={{
          p: 0,
          borderBottom: 1,
          borderColor: "divider",
          backgroundColor: "background.paper",
          position: "relative",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        {/* Left side - Navigation buttons */}
        <Stack direction="row" spacing={2}>
          <Button
            onClick={() => handleTabClick("security")}
            sx={{
              textTransform: "none",
              px: 1,
              pb: 2,
              color: colors.text.primary1,
              position: "relative",
              "&::after":
                activeTab === "security"
                  ? {
                      content: '""',
                      position: "absolute",
                      bottom: 0,
                      left: 0,
                      right: 0,
                      height: "2px",
                      backgroundColor: colors.primary.main,
                    }
                  : {},
            }}
          >
            Security Audit Logs
          </Button>
          <Button
            onClick={() => handleTabClick("system")}
            sx={{
              textTransform: "none",
              px: 1,
              pb: 2,
              color: colors.text.primary1,
              position: "relative",
              "&::after":
                activeTab === "system"
                  ? {
                      content: '""',
                      position: "absolute",
                      bottom: 0,
                      left: 0,
                      right: 0,
                      height: "2px",
                      backgroundColor: colors.primary.main,
                    }
                  : {},
            }}
          >
            System Logs
          </Button>

          <Button
            onClick={() => handleTabClick("audit")}
            sx={{
              textTransform: "none",
              color: colors.text.primary1,
              px: 1,
              pb: 2,
              position: "relative",
              "&::after":
                activeTab === "audit"
                  ? {
                      content: '""',
                      position: "absolute",
                      bottom: 0,
                      left: 0,
                      right: 0,
                      height: "2px",
                      backgroundColor: colors.primary.main,
                    }
                  : {},
            }}
          >
            Audit Trace
          </Button>
        </Stack>

        {/* Right side - Month dropdown and Download button */}
        <Stack
          direction="row"
          spacing={1}
          alignItems="center"
          sx={{ pr: 2, pb: 1 }}
        >
          {/* Month Dropdown */}
          <Button
            onClick={handleMonthClick}
            endIcon={<ArrowDropDownIcon />}
            sx={{
              textTransform: "none",
              color: colors.text.primary1,
              border: "1px solid",
              borderColor: "divider",
              px: 2,
              minWidth: "auto",
              borderRadius: 5,
            }}
          >
            {selectedMonth}
          </Button>
          <Menu
            anchorEl={monthAnchorEl}
            open={Boolean(monthAnchorEl)}
            onClose={handleMonthClose}
          >
            <MenuItem onClick={() => handleMonthSelect("Current Month")}>
              Current Month
            </MenuItem>
            {months.map((month) => (
              <MenuItem key={month} onClick={() => handleMonthSelect(month)}>
                {month}
              </MenuItem>
            ))}
          </Menu>

          {/* Download Icon */}
          <IconButton
            sx={{
              border: "1px solid",
              borderColor: "divider",
              borderRadius: 8,
              color: "text.primary",
              height: 40,
            }}
          >
            <DownloadIcon />
          </IconButton>
        </Stack>
      </Stack>

      {/* Content Section */}
      <Box sx={{ p: 2 }}>
        {/* Data Grid */}
        <Paper sx={{ height: 450, width: "100%" }}>
          <DataGrid
            rows={rows}
            columns={getCurrentColumns()}
            paginationModel={paginationModel}
            onPaginationModelChange={setPaginationModel}
            pageSizeOptions={[10]}
            loading={loading}
            rowCount={totalCount}
            paginationMode="server"
            sx={{
              border: 0,
              "& .grid-header": {
                backgroundColor: "#f5f5f5",
                fontWeight: "bold",
              },
              "& .MuiDataGrid-cell": {
                borderBottom: "1px solid #e0e0e0",
              },
              "& .MuiDataGrid-columnHeaders": {
                borderBottom: "1px solid #e0e0e0",
              },
            }}
            slots={{
              noRowsOverlay: () => (
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "100%",
                  }}
                >
                  <Typography color="textSecondary">
                    {activeTab === "security"
                      ? "No security logs available"
                      : activeTab === "system"
                      ? "No system logs available"
                      : "No data available"}
                  </Typography>
                </Box>
              ),
            }}
          />
        </Paper>

        {/* Pagination Info */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mt: 1,
          }}
        >
          <Typography variant="body2" color="textSecondary">
            Rows per page: {paginationModel.pageSize}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            {paginationModel.page * paginationModel.pageSize + 1}-
            {Math.min(
              (paginationModel.page + 1) * paginationModel.pageSize,
              totalCount
            )}{" "}
            of {totalCount}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default Logs;