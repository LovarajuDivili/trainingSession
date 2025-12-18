import React from "react";
import { Box, Card, Typography } from "@mui/material";
import Chart from "react-apexcharts";
import type { ApexOptions } from "apexcharts";
import BarChartIcon from "@mui/icons-material/BarChart";

import { apiRequest } from "../Services/apiService";

const Statistics: React.FC = () => {
  const [monthlyData, setMonthlyData] = React.useState<number[]>([]);
  const [deptLabels, setDeptLabels] = React.useState<string[]>([]);
  const [deptValues, setDeptValues] = React.useState<number[]>([]);

  React.useEffect(() => {
    const fetchStats = async () => {
      try {
        const monthly = await apiRequest<{
          monthlyJoinings: number[];
        }>({
          endpoint: "/api/employees/stats/monthly-joinings",
          method: "GET",
        });

        setMonthlyData(monthly.monthlyJoinings || []);

        const deptDist = await apiRequest<Record<string, number>>({
          endpoint: "/api/employees/stats/department-distribution",
          method: "GET",
        });

        setDeptLabels(Object.keys(deptDist || {}));
        setDeptValues(Object.values(deptDist || {}));
      } catch (err) {
        console.error("Statistics API error:", err);
      }
    };

    fetchStats();
  }, []);

  const barChartOptions: ApexOptions = {
    chart: {
      type: "bar",
      toolbar: { show: false },
      animations: {
        enabled: true,
        easing: "easeinout",
        speed: 800,
      },
    },

    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "45%",
        borderRadius: 6,
        endingShape: "rounded",
      },
    },

    dataLabels: { enabled: false },

    grid: {
      borderColor: "#e5e7eb",
      strokeDashArray: 4,
    },

    xaxis: {
      categories: [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ],
      axisBorder: { show: false },
      axisTicks: { show: false },
      labels: { style: { fontSize: "12px" } },
    },

    yaxis: {
      tickAmount: 5,
      labels: { style: { fontSize: "12px" } },
    },

    tooltip: {
      y: {
        formatter: (val: number) => `${val} Employees`,
      },
    },

    title: {
      text: "Monthly Employee Joinings",
      align: "center",
      style: {
        fontWeight: 700,
        fontSize: "16px",
      },
    },
  };

  const barChartSeries = [
    {
      name: "Employees",
      data: monthlyData,
    },
  ];

  const donutChartOptions: ApexOptions = {
    labels: deptLabels,

    plotOptions: {
      pie: {
        donut: {
          size: "70%",
          labels: {
            show: true,
            name: {
              show: true,
              fontSize: "13px",
              offsetY: -10,
            },
            value: {
              show: true,
              fontSize: "18px",
              fontWeight: 700,
              offsetY: 6,
            },
            total: {
              show: true,
              label: "Employees",
              fontSize: "14px",
              fontWeight: 700,
            },
          },
        },
      },
    },

    dataLabels: {
      enabled: true,
      style: {
        fontSize: "12px",
        fontWeight: 600,
      },
      dropShadow: { enabled: false },
    },

    stroke: { width: 3 },

    legend: {
      position: "bottom",
      fontSize: "13px",
      itemMargin: { vertical: 6 },
      markers: {
        width: 12,
        height: 12,
        radius: 12,
      },
    },

    tooltip: {
      y: {
        formatter: (val: number) => `${val} Employees`,
      },
    },

    title: {
      text: "Employee Distribution by Department",
      align: "center",
      style: {
        fontWeight: 700,
        fontSize: "16px",
      },
    },
  };

  const donutChartSeries = deptValues;

  return (
    <Box
      sx={{
        width: "100%",
        height: "calc(100vh - 80px)",
        overflowY: "auto",
        bgcolor: "#f5f7fb",
        px: 4,
        py: 4,
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 1.2, mb: 2 }}>
        <BarChartIcon sx={{ fontSize: 28 }} />
        <Typography sx={{ fontSize: 22, fontWeight: 700 }}>
          Statistics
        </Typography>
      </Box>

      <Box sx={{ borderBottom: "1px solid #e0e0e0", mb: 3 }} />

      <Box sx={{ display: "flex", gap: 3 }}>
        <Card
          sx={{
            flex: 1,
            p: 3,
            borderRadius: 3,
            boxShadow: "0 8px 24px rgba(15,23,42,0.08)",
            bgcolor: "#fff",
          }}
        >
          <Chart
            options={barChartOptions}
            series={barChartSeries}
            type="bar"
            height={350}
          />
        </Card>

        <Card
          sx={{
            flex: 1,
            p: 3,
            borderRadius: 3,
            boxShadow: "0 8px 24px rgba(15,23,42,0.08)",
            bgcolor: "#fff",
          }}
        >
          <Chart
            options={donutChartOptions}
            series={donutChartSeries}
            type="donut"
            height={350}
          />
        </Card>
      </Box>
    </Box>
  );
};

export default Statistics;
