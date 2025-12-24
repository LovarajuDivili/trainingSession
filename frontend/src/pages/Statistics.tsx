import React from "react";
import { Box, Card, Typography } from "@mui/material";
import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import BarChartIcon from "@mui/icons-material/BarChart";

const Statistics: React.FC = () => {

  const [monthlyData, setMonthlyData] = React.useState<number[]>([]);
  const [deptLabels, setDeptLabels] = React.useState<string[]>([]);
  const [deptValues, setDeptValues] = React.useState<number[]>([]);

  React.useEffect(() => {
    const token = localStorage.getItem("token");

    fetch("http://localhost:5000/api/employees/stats/monthly-joinings", {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => setMonthlyData(data.monthlyJoinings));

    fetch("http://localhost:5000/api/employees/stats/department-distribution", {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(dist => {
        setDeptLabels(Object.keys(dist));
        setDeptValues(Object.values(dist));
      });

  }, []);


  const lineChartOptions: ApexOptions = {
    chart: { toolbar: { show: false }, zoom: { enabled: false } },
    xaxis: {
      categories: [
        "Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
      ]
    },
    stroke: { curve: "smooth" },
    markers: { size: 5 },
    title: {
      text: "Monthly Employee Joinings",
      align: "center",
      style: { fontWeight: 700, fontSize: "16px" }
    }
  };

  const lineChartSeries = [
    { name: "Employees", data: monthlyData }
  ];

  const donutChartOptions: ApexOptions = {
    labels: deptLabels,
    legend: { position: "bottom" },
    title: {
      text: "Employee Distribution by Department",
      align: "center",
      style: { fontWeight: 700, fontSize: "16px" }
    }
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
        py: 4
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 1.2, mb: 2 }}>
        <BarChartIcon sx={{ fontSize: 28, color: "black" }} />
        <Typography sx={{ fontSize: 22, fontWeight: 700 }}>
          Statistics
        </Typography>
      </Box>

      <Box sx={{ borderBottom: "1px solid #e0e0e0", mb: 3 }} />

      <Box
        sx={{
          display: "flex",
          gap: 3,
          width: "100%",
          alignItems: "stretch"
        }}
      >
        <Card
          sx={{
            flex: 1,
            p: 3,
            borderRadius: 3,
            boxShadow: "0 8px 24px rgba(15,23,42,0.08)",
            bgcolor: "#fff"
          }}
        >
          <Chart
            options={lineChartOptions}
            series={lineChartSeries}
            type="line"
            height={350}
          />
        </Card>

        <Card
          sx={{
            flex: 1,
            p: 3,
            borderRadius: 3,
            boxShadow: "0 8px 24px rgba(15,23,42,0.08)",
            bgcolor: "#fff"
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
