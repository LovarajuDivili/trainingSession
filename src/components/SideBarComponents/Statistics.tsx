import { Box, Card, CardContent, Typography, Grid } from "@mui/material";
import DashboardHeader from "../DashboardHeader";
import { sidebarItems } from "../../common/sidebarItems";
import { LineChart } from "@mui/x-charts/LineChart";
import { BarChart } from "@mui/x-charts/BarChart";
import { PieChart } from "@mui/x-charts/PieChart";
import { useAppSelector } from "../../hooks/reduxHooks";
import { Stats } from "../../common/labelConstants";

const Statistics = () => {
  const currentItem = sidebarItems.find(
    (item) => item.route === "/admin/statistics"
  );

  const employees = useAppSelector((state) => state.employees.employees);
  const projects = useAppSelector((state) => state.projects.projects || []);

  const employeeRoleCounts = employees.reduce(
    (acc, emp) => {
      if (emp.role === "Developer") acc.Developers++;
      else if (emp.role === "AWS Team") acc.AWSTeam++;
      else if (emp.role === "Tester") acc.Testers++;
      acc.AllEmployees++;
      return acc;
    },
    { AllEmployees: 0, Developers: 0, AWSTeam: 0, Testers: 0 }
  );

  const projectStatusCounts = projects.reduce(
    (acc, project) => {
      if (project.status === "Active") acc.Active++;
      else if (project.status === "Inactive") acc.Inactive++;
      else if (project.status === "In Progress") acc.InProgress++;
      return acc;
    },
    { Active: 0, Inactive: 0, InProgress: 0 }
  );

  const cardData = [
    {
      title: "All Employees",
      value: employees.length.toString(),
      data: [100, 120, 90, 150, 130],
      color: "#1976d2",
    },
    {
      title: "Projects",
      value: projects.length.toString(),
      data: [80, 95, 70, 120, 110],
      color: "#d32f2f",
    },
    {
      title: "Developers",
      value: employeeRoleCounts.Developers,
      data: [50, 60, 45, 70, 65],
      color: "#388e3c",
    },
    {
      title: "AWS Team",
      value: employeeRoleCounts.AWSTeam,
      data: [120, 140, 110, 160, 150],
      color: "#f57c00",
    },
    {
      title: "Testers",
      value: employeeRoleCounts.Testers,
      data: [30, 40, 25, 50, 45],
      color: "#7b1fa2",
    },
  ];

  const barData = [
    employeeRoleCounts.AllEmployees,
    employeeRoleCounts.Developers,
    employeeRoleCounts.AWSTeam,
    employeeRoleCounts.Testers,
  ];

  const barLabels = ["Employees", "Developers", "AWS", "Testers"];

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
      id: "In Progress",
      value: projectStatusCounts.InProgress,
      label: "In Progress",
      color: "orange",
    },
  ];

  return (
    <Box sx={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
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
                    <LineChart
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

      <Box sx={{ display: "flex", gap: 2, p: 1, mt: 1, flexGrow: 1 }}>
        <Box sx={{ display: "flex", gap: 2, flex: 2, height: "400px" }}>
          <Card sx={{ flex: 1, height: "100%" }}>
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

          <Card sx={{ flex: 1, height: "100%" }}>
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
        </Box>

        <Card sx={{ flex: 1, height: "100%" }}>
          <CardContent>
            <Typography variant="h6">EXTRA LINE CHART-later</Typography>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
};

export default Statistics;
