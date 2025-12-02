/* eslint-disable no-case-declarations */
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
  Snackbar,
  Alert,
  type AlertColor,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import DashboardHeader from "../DashboardHeader";
import { sidebarItems } from "../../common/sidebarItems";
import { useState, useEffect } from "react";
import { useThemeColors } from "../../hooks/useThemeColors";
import DownloadIcon from "@mui/icons-material/Download";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import axios from "axios";
import * as XLSX from "xlsx";

// Update the LogRow interface
interface LogRow {
  _id: string;
  id: string;
  user?: string;
  action?: string;
  status?: string;
  date?: string;
  time?: string;
  name?: string;
  type?: string;
}

interface ToastState {
  open: boolean;
  message: string;
  severity: AlertColor;
}

type TimePeriod = "current-month" | "weekly" | "quarterly" | "yearly";

const Logs = () => {
  const currentItem = sidebarItems.find((item) => item.route === "/admin/logs");
  const [activeTab, setActiveTab] = useState("security");
  const [paginationModel, setPaginationModel] = useState({
    pageSize: 10,
    page: 0,
  });
  const colors = useThemeColors();
  const [periodAnchorEl, setPeriodAnchorEl] = useState<null | HTMLElement>(
    null
  );
  const [selectedPeriod, setSelectedPeriod] =
    useState<TimePeriod>("current-month");
  const [searchText, setSearchText] = useState("");
  const [rows, setRows] = useState<LogRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [toast, setToast] = useState<ToastState>({
    open: false,
    message: "",
    severity: "success",
  });

  // Toast handler functions
  const showToast = (message: string, severity: AlertColor = "success") => {
    setToast({
      open: true,
      message,
      severity,
    });
  };

  const handleCloseToast = (
    _event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }
    setToast({ ...toast, open: false });
  };

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
      renderCell: (params: any) => {
        const status = params.value?.toLowerCase() || "";
        let backgroundColor = "";
        const textColor = "#ffffff";

        if (status === "success") {
          backgroundColor = "#4caf50";
        } else if (status === "failed") {
          backgroundColor = "#f44336";
        } else {
          backgroundColor = "#ff9800";
        }

        return (
          <Box
            sx={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "1px 6px",
              borderRadius: "16px",
              backgroundColor,
              color: textColor,
              fontSize: "12px",
              fontWeight: "600",
              textTransform: "capitalize",
              minWidth: "50px",
              height: "30px",
              boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
            }}
          >
            {status}
          </Box>
        );
      },
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
      renderCell: (params: any) => {
        const status = params.value?.toLowerCase() || "";
        let backgroundColor = "";
        const textColor = "#ffffff";

        if (status === "success") {
          backgroundColor = "#4caf50";
        } else if (status === "failed") {
          backgroundColor = "#f44336";
        } else {
          backgroundColor = "#ff9800";
        }

        return (
          <Box
            sx={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "1px 6px",
              borderRadius: "16px",
              backgroundColor,
              color: textColor,
              fontSize: "12px",
              fontWeight: "600",
              textTransform: "capitalize",
              minWidth: "50px",
              height: "30px",
              boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
            }}
          >
            {status}
          </Box>
        );
      },
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

  // Helper function to get time period parameters for API
  const getTimePeriodParams = (period: TimePeriod) => {
    const now = new Date();

    switch (period) {
      case "current-month":
        return {
          month: String(now.getMonth() + 1).padStart(2, "0"),
        };

      case "weekly":
        // Last 7 days
        const oneWeekAgo = new Date(now);
        oneWeekAgo.setDate(now.getDate() - 7);
        return {
          from_date: oneWeekAgo.toISOString().split("T")[0],
          to_date: now.toISOString().split("T")[0],
        };

      case "quarterly":
        // Last 3 months
        const threeMonthsAgo = new Date(now);
        threeMonthsAgo.setMonth(now.getMonth() - 3);
        return {
          from_date: threeMonthsAgo.toISOString().split("T")[0],
          to_date: now.toISOString().split("T")[0],
        };

      case "yearly":
        // Last 12 months
        const oneYearAgo = new Date(now);
        oneYearAgo.setFullYear(now.getFullYear() - 1);
        return {
          from_date: oneYearAgo.toISOString().split("T")[0],
          to_date: now.toISOString().split("T")[0],
        };

      default:
        return {};
    }
  };

  // Get display label for selected period
  const getPeriodLabel = (period: TimePeriod) => {
    switch (period) {
      case "current-month":
        return "Current Month";
      case "weekly":
        return "Weekly";
      case "quarterly":
        return "Quarterly";
      case "yearly":
        return "Yearly";
      default:
        return "Current Month";
    }
  };

  const handleDownload = async () => {
    try {
      const token = sessionStorage.getItem("token");

      if (!token) {
        showToast("You are not logged in. Please re-login.", "error");
        return;
      }

      // Build parameters - max page_size is 100 according to backend
      const params: Record<string, string> = {
        page: "0",
        page_size: "100",
      };

      if (searchText) {
        params.search = searchText;
      }

      const periodParams = getTimePeriodParams(selectedPeriod);
      Object.assign(params, periodParams);

      // Build endpoint
      let endpoint = "";
      if (activeTab === "security") {
        endpoint = `http://localhost:8000/v-1/application/logs/security`;
      } else if (activeTab === "system") {
        endpoint = `http://localhost:8000/v-1/application/logs/system`;
      } else {
        showToast("Download not supported for Audit tab", "warning");
        return;
      }

      const initialResponse = await axios.get(endpoint, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: params,
      });

      const totalCount = initialResponse.data?.total || 0;

      if (totalCount === 0) {
        showToast("No data available to download", "info");
        return;
      }

      const pageSize = 100;
      const totalPages = Math.ceil(totalCount / pageSize);

      let allLogs =
        initialResponse.data?.logs || initialResponse.data?.data || [];

      for (let page = 1; page < totalPages; page++) {
        const pageParams = { ...params, page: String(page) };

        try {
          const pageResponse = await axios.get(endpoint, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            params: pageParams,
          });

          const pageLogs =
            pageResponse.data?.logs || pageResponse.data?.data || [];
          allLogs = [...allLogs, ...pageLogs];

          await new Promise((resolve) => setTimeout(resolve, 100));
        } catch (pageError) {
          console.error(`Error fetching page ${page}:`, pageError);

          break;
        }
      }

      if (!allLogs.length) {
        showToast("No data available to download", "info");
        return;
      }

      // Create Excel file
      const worksheet = XLSX.utils.json_to_sheet(allLogs);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Logs");

      const periodLabel = getPeriodLabel(selectedPeriod)
        .toLowerCase()
        .replace(" ", "_");
      const filename = `${
        activeTab === "security" ? "Security" : "System"
      }_Logs_${periodLabel}_${new Date().toISOString().slice(0, 10)}.xlsx`;

      XLSX.writeFile(workbook, filename);

      showToast(`Successfully downloaded ${allLogs.length} records`);
    } catch (error: any) {
      console.error("Download failed:", error);

      if (axios.isAxiosError(error)) {
        // Show more specific error message
        if (error.response?.data?.detail) {
          showToast(
            `Download failed: ${JSON.stringify(error.response.data.detail)}`,
            "error"
          );
        } else {
          showToast("Failed to download logs. Please try again.", "error");
        }
      } else {
        showToast("An unexpected error occurred.", "error");
      }
    }
  };

  // Fetch logs data
  const fetchLogs = async () => {
    try {
      setLoading(true);
      const token = sessionStorage.getItem("token");

      if (!token) {
        console.error("No token found");
        setRows([]);
        setTotalCount(0);
        return;
      }

      const params: Record<string, string> = {
        page: String(paginationModel.page),
        page_size: String(paginationModel.pageSize),
      };

      if (searchText) {
        params.search = searchText;
      }

      const periodParams = getTimePeriodParams(selectedPeriod);
      Object.assign(params, periodParams);

      let endpoint = "";
      if (activeTab === "security") {
        endpoint = `http://localhost:8000/v-1/application/logs/security`;
      } else if (activeTab === "system") {
        endpoint = `http://localhost:8000/v-1/application/logs/system`;
      } else {
        setRows([]);
        setTotalCount(0);
        return;
      }

      const response = await axios.get(endpoint, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: params,
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
    let mounted = true;

    const safeFetch = async () => {
      try {
        if (!mounted) return;
        await fetchLogs();
      } catch (e) {
        console.error(e);
      }
    };

    safeFetch();

    return () => {
      mounted = false;
    };
  }, [activeTab, paginationModel, searchText, selectedPeriod]);

  const handleTabClick = (tab: string) => {
    setActiveTab(tab);
    setPaginationModel({ page: 0, pageSize: 10 });
  };

  const handlePeriodClick = (event: React.MouseEvent<HTMLElement>) => {
    setPeriodAnchorEl(event.currentTarget);
  };

  const handlePeriodClose = () => {
    setPeriodAnchorEl(null);
  };

  const handlePeriodSelect = (period: TimePeriod) => {
    setSelectedPeriod(period);
    setPaginationModel({ page: 0, pageSize: 10 });
    handlePeriodClose();
  };

  return (
    <Box>
      {/* Toast Notification */}
      <Snackbar
        open={toast.open}
        autoHideDuration={4000}
        onClose={handleCloseToast}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={handleCloseToast}
          severity={toast.severity}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {toast.message}
        </Alert>
      </Snackbar>

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

        {/* Right side - Time period dropdown and Download button */}
        <Stack
          direction="row"
          spacing={1}
          alignItems="center"
          sx={{ pr: 2, pb: 1 }}
        >
          {/* Time Period Dropdown */}
          <Button
            onClick={handlePeriodClick}
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
            {getPeriodLabel(selectedPeriod)}
          </Button>
          <Menu
            anchorEl={periodAnchorEl}
            open={Boolean(periodAnchorEl)}
            onClose={handlePeriodClose}
          >
            <MenuItem onClick={() => handlePeriodSelect("current-month")}>
              Current Month
            </MenuItem>
            <MenuItem onClick={() => handlePeriodSelect("weekly")}>
              Weekly
            </MenuItem>
            <MenuItem onClick={() => handlePeriodSelect("quarterly")}>
              Quarterly
            </MenuItem>
            <MenuItem onClick={() => handlePeriodSelect("yearly")}>
              Yearly
            </MenuItem>
          </Menu>

          {/* Download Icon */}
          <IconButton
            onClick={handleDownload}
            sx={{
              backgroundColor: colors.primary.main,
              border: "1px solid",
              borderColor: colors.primary.main,
              borderRadius: 8,
              color: "#ffffff",
              height: 40,
              width: 40,
              "&:hover": {
                backgroundColor: colors.primary.dark,
                borderColor: colors.primary.dark,
              },
              "& .MuiSvgIcon-root": {
                color: "#ffffff",
              },
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
            getRowId={(row) => row.id || row._id}
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
