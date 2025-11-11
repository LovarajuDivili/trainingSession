/* eslint-disable react-hooks/rules-of-hooks */
import { Box, Card, CardContent, Typography, Grid } from "@mui/material";
import DashboardHeader from "../DashboardHeader";
import { sidebarItems } from "../../common/sidebarItems";
import { LineChart as MuiLineChart } from "@mui/x-charts/LineChart";
import { BarChart } from "@mui/x-charts/BarChart";
import { PieChart } from "@mui/x-charts/PieChart";
import { useAppDispatch, useAppSelector } from "../../hooks/reduxHooks";
import { Stats } from "../../common/labelConstants";
import { fetchStatistics } from "../../store/StatisticsSlice";
import { useEffect, useMemo } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import { fetchEmployees } from "../../store/EmployeesSlice";

const Statistics = () => {
  const dispatch = useAppDispatch();
  const currentItem = sidebarItems.find(
    (item) => item.route === "/admin/statistics"
  );

  const {
    employeeRoleCounts,
    projectStatusCounts,
    totalEmployees,
    totalProjects,
    loading,
  } = useAppSelector((state) => state.statistics);
  const employees = useAppSelector((state) => state.employees.employees);

  useEffect(() => {
    dispatch(fetchStatistics());
    dispatch(fetchEmployees()); // <-- Add this
  }, [dispatch]);
  const cardData = [
    {
      title: "AllEmployees",
      value: (totalEmployees ?? 0).toString(),
      data: [100, 120, 90, 150, 130],
      color: "#1976d2",
    },
    {
      title: "Projects",
      value: totalProjects.toString(),
      data: [80, 95, 70, 120, 110],
      color: "#d32f2f",
    },
    {
      title: "Developers",
      value: (employeeRoleCounts.Developers ?? 0).toString(),
      data: [50, 60, 45, 70, 65],
      color: "#388e3c",
    },
    {
      title: "AWS Team",
      value: employeeRoleCounts.AWSTeam.toString(),
      data: [120, 140, 110, 160, 150],
      color: "#f57c00",
    },
    {
      title: "Testers",
      value: employeeRoleCounts.Testers.toString(),
      data: [30, 40, 25, 50, 45],
      color: "#7b1fa2",
    },
  ];

  const barData = [
    employeeRoleCounts.AllEmployees ?? 0,
    employeeRoleCounts.Developers ?? 0,
    employeeRoleCounts.AWSTeam ?? 0,
    employeeRoleCounts.Testers ?? 0,
  ];

  const barLabels = ["Employees", "Devs", "AWS", "Testers"];

  const pieData = [
    {
      id: "Active",
      value: projectStatusCounts.Active,
      label: "Active",
      color: "#47be4b",
    },
    {
      id: "Inactive",
      value: projectStatusCounts.Inactive,
      label: "Inactive",
      color: "#e12a2a",
    },
    {
      id: "InProgress",
      value: projectStatusCounts.InProgress,
      label: "InProgress",
      color: "orange",
    },
  ];
  const monthlyData = useMemo(() => {
    const data = Array(12).fill(0);
    employees.forEach((emp) => {
      if (emp.joinDate) {
        const date = new Date(emp.joinDate);
        const month = date.getMonth();
        data[month]++;
      }
    });
    return [
      { month: "Jan", count: data[0] },
      { month: "Feb", count: data[1] },
      { month: "Mar", count: data[2] },
      { month: "Apr", count: data[3] },
      { month: "May", count: data[4] },
      { month: "Jun", count: data[5] },
      { month: "Jul", count: data[6] },
      { month: "Aug", count: data[7] },
      { month: "Sep", count: data[8] },
      { month: "Oct", count: data[9] },
      { month: "Nov", count: data[10] },
      { month: "Dec", count: data[11] },
    ];
  }, [employees]);

  if (loading) {
    return <Typography>Loading statistics...</Typography>;
  }

  return (
    <Box sx={{ minHeight: "0vh", display: "flex", flexDirection: "column" }}>
      <DashboardHeader
        title={currentItem?.label || "Statistics"}
        icon={currentItem?.icon}
      />
      <Box sx={{ overflowX: "auto", p: 1 }}>
        <Grid container spacing={1} wrap="nowrap">
          {cardData.map((card, index) => (
            <Grid
              item
              key={index}
              sx={{ flex: "0 0 auto", width: 225, height: 100 }}
            >
              <Card sx={{ borderRadius: 3, boxShadow: 3, p: 0 }}>
                <CardContent
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                  }}
                >
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="subtitle2" color="text.secondary">
                      {card.title}
                    </Typography>
                    <Typography variant="h5" sx={{ fontWeight: "bold" }}>
                      {card.value}
                    </Typography>
                  </Box>
                  <Box sx={{ width: 70, height: 50 }}>
                    {/* Use MuiLineChart for the small cards */}
                    <MuiLineChart
                      series={[{ data: card.data, color: card.color }]}
                      xAxis={[{ scaleType: "linear" }]}
                      height={50}
                      widths="100%"
                      sx={{ overflow: "visible" }}
                    />
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      <Box sx={{ display: "flex", gap: 2, p: 1, mt: 1, height: 420 }}>
        {/* Project Status Distribution */}
        <Card sx={{ flex: 1 }}>
          <CardContent>
            <Typography variant="h6" sx={{ mb: 2 }}>
              {Stats.PROJ_STATUS_DISTRIBUTION}
            </Typography>
            <PieChart
              series={[
                {
                  type: "pie",
                  data: pieData,
                },
              ]}
              sx={{ height: 300 }}
            />
          </CardContent>
        </Card>

        {/* Employee Role Count */}
        <Card sx={{ flex: 1 }}>
          <CardContent>
            <Typography variant="h6" sx={{ mb: 2 }}>
              {Stats.EMP_ROLE_COUNT}
            </Typography>
            <BarChart
              series={[{ data: barData, color: "#1976d2" }]}
              xAxis={[{ scaleType: "band", data: barLabels }]}
              height={300}
              sx={{ overflow: "visible" }}
            />
          </CardContent>
        </Card>

        {/* Employee Join Trend */}
        <Card sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
          <CardContent sx={{ flex: 1, ml: "-30px" }}>
            <Typography
              variant="h6"
              sx={{ mb: 2, fontWeight: 600, ml: "30px" }}
            >
              Employee Join Trend (Jan–Dec)
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis allowDecimals={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#fff",
                    border: "1px solid #ccc",
                    borderRadius: 8,
                  }}
                  labelStyle={{ color: "#ac8fff" }}
                  itemStyle={{ color: "#ac8fff" }}
                />
                <Line
                  type="monotone"
                  dataKey="count"
                  stroke="#ff9430"
                  strokeWidth={3}
                  dot={{ r: 5 }}
                  activeDot={{ r: 8, fill: "#ac8fff", stroke: "#ac8fff" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
};

export default Statistics;
