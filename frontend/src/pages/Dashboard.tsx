import React, { useContext, useEffect, useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Avatar,
  List,
  ListItem,
  CircularProgress,
  IconButton,
} from "@mui/material";
import Grid from "@mui/material/Grid";

import PersonAddIcon from "@mui/icons-material/PersonAdd";
import BusinessCenterIcon from "@mui/icons-material/BusinessCenter";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import DashboardIcon from "@mui/icons-material/Dashboard";

import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

import { Line } from "react-chartjs-2";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title as ChartTitle,
  Tooltip as ChartTooltip,
  Legend as ChartLegend,
} from "chart.js";

import { UserContext } from "../components/UserContext";
import { useOutletContext } from "react-router-dom";
import type { Employee } from "../common/types";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ChartTitle,
  ChartTooltip,
  ChartLegend
);

const PRIMARY = "#906aff";

type EventImage = { imageUrl: string; order: number };
type JobOpening = { title: string; location?: string; openings?: number };

const getEmployeeImage = (emp: Employee): string | undefined => {
  const anyEmp = emp as any;
  if (anyEmp.image) return anyEmp.image;

  if (emp.id) {
    const stored = localStorage.getItem(`employee_image_${emp.id}`);
    if (stored) return stored;
  }
  return undefined;
};

type OutletContextType = {
  employees: Employee[];
  loading: boolean;
};

const Dashboard: React.FC = () => {
  const { user, token } = useContext(UserContext);
  const { employees = [], loading: employeesLoading } =
    useOutletContext<OutletContextType>();

  const [openingsData, setOpeningsData] = useState<{
    eventImages: EventImage[];
    jobOpenings: JobOpening[];
  }>({
    eventImages: [],
    jobOpenings: [],
  });

  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  const [newJoinerPage, setNewJoinerPage] = useState(0);
  const [jobPage, setJobPage] = useState(0);

  const ITEMS_PER_PAGE = 3;

  useEffect(() => {
    const fetchOpenings = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const res = await fetch("http://localhost:5000/api/openings-events", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await res.json();

        setOpeningsData({
          eventImages: Array.isArray(data.eventImages)
            ? data.eventImages.sort((a: any, b: any) => a.order - b.order)
            : [],
          jobOpenings: Array.isArray(data.jobOpenings)
            ? data.jobOpenings
            : [],
        });
      } catch (err) {
        console.error("Error fetching:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOpenings();
  }, [token]);

  useEffect(() => {
    if (!openingsData.eventImages.length) return;
    const id = setInterval(() => {
      setCurrentIndex(
        (prev) => (prev + 1) % openingsData.eventImages.length
      );
    }, 5000);
    return () => clearInterval(id);
  }, [openingsData.eventImages.length]);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    return "Good Evening";
  };

  const formatDate = (d?: string | Date) => {
    if (!d) return "";
    return new Date(d).toLocaleDateString();
  };

  const sortedJoiners = employees
    .filter((e) => e.joinDate)
    .sort(
      (a, b) =>
        new Date(b.joinDate!).getTime() -
        new Date(a.joinDate!).getTime()
    );

  const joinerStart = newJoinerPage * ITEMS_PER_PAGE;
  const joinerSlice = sortedJoiners.slice(
    joinerStart,
    joinerStart + ITEMS_PER_PAGE
  );

  const jobStart = jobPage * ITEMS_PER_PAGE;
  const jobSlice = openingsData.jobOpenings.slice(
    jobStart,
    jobStart + ITEMS_PER_PAGE
  );

  if (loading || employeesLoading)
    return (
      <Box
        sx={{
          height: "80vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <CircularProgress sx={{ color: PRIMARY }} />
      </Box>
    );

  const monthly = Array(12).fill(0);
  employees.forEach((emp) => {
    if (!emp.joinDate) return;
    const m = new Date(emp.joinDate).getMonth();
    monthly[m]++;
  });

  const chartData = {
    labels: [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
    ],
    datasets: [
      {
        label: "New Joiners",
        data: monthly,
        borderColor: PRIMARY,
        backgroundColor: `${PRIMARY}33`,
        borderWidth: 3,
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
      x: { grid: { color: "#f1f1f1" } },
      y: {
        beginAtZero: true,
        ticks: { stepSize: 1 },
        grid: { color: "#f1f1f1" },
      },
    },
  };

  return (
    <Box sx={{ p: 2, height: "calc(100vh - 80px)", overflowY: "auto" }}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          mb: 2,
          pb: 1,
          borderBottom: "1px solid #e0e0e0",
        }}
      >
        <DashboardIcon sx={{ mr: 1 }} />
        <Typography sx={{ fontSize: 22, fontWeight: 700 }}>
          Dashboard
        </Typography>
      </Box>

      <Grid container spacing={2}>
        <Grid item xs={12} md={4}>
          <Card sx={{ borderRadius: 3, mb: 2, height: 325, position: "relative" }}>
            <CardContent sx={{ height: "100%", pb: 7 }}>
              <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                <PersonAddIcon sx={{ mr: 1 }} />
                <Typography sx={{ fontWeight: 700 }}>New Joiners</Typography>
              </Box>

              <List sx={{ height: 180, overflow: "hidden" }}>
                {joinerSlice.map((emp) => {
                  const img = getEmployeeImage(emp);

                  return (
                    <ListItem
                      key={emp.id}
                      sx={{
                        mb: 1,
                        borderRadius: 2,
                        bgcolor: "#fff",
                        boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                      }}
                      secondaryAction={
                        <Typography sx={{ fontSize: 12 }}>
                          {formatDate(emp.joinDate)}
                        </Typography>
                      }
                    >
                      <Avatar src={img} sx={{ mr: 2, bgcolor: PRIMARY }}>
                        {!img && emp.name?.charAt(0)}
                      </Avatar>

                      <Box>
                        <Typography sx={{ fontWeight: 700 }}>
                          {emp.name}
                        </Typography>
                        <Typography sx={{ fontSize: 12, color: "#666" }}>
                          {emp.role}
                        </Typography>
                      </Box>
                    </ListItem>
                  );
                })}
              </List>

              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  position: "absolute",
                  bottom: 10,
                  left: 0,
                  right: 0,
                  px: 2,
                }}
              >
                <IconButton
                  disabled={newJoinerPage === 0}
                  onClick={() => setNewJoinerPage((p) => Math.max(p - 1, 0))}
                >
                  <ChevronLeftIcon />
                </IconButton>

                <IconButton
                  disabled={
                    joinerStart + ITEMS_PER_PAGE >= sortedJoiners.length
                  }
                  onClick={() => setNewJoinerPage((p) => p + 1)}
                >
                  <ChevronRightIcon />
                </IconButton>
              </Box>
            </CardContent>
          </Card>

          <Card sx={{ borderRadius: 3, height: 325, position: "relative" }}>
            <CardContent sx={{ height: "100%", pb: 7 }}>
              <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                <BusinessCenterIcon sx={{ mr: 1 }} />
                <Typography sx={{ fontWeight: 700 }}>
                  Current Openings
                </Typography>
              </Box>

              <List sx={{ height: 180, overflow: "hidden" }}>
                {jobSlice.map((job, i) => (
                  <ListItem
                    key={i}
                    sx={{
                      mb: 1,
                      borderRadius: 2,
                      bgcolor: "#fff",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Box>
                      <Typography sx={{ fontWeight: 700 }}>
                        {job.title}
                      </Typography>
                      <Typography sx={{ fontSize: 12, color: "#666" }}>
                        {job.location || "Remote"}
                      </Typography>
                    </Box>

                    <Typography
                      sx={{
                        fontSize: 13,
                        fontWeight: 600,
                        pr: 1.5,
                      }}
                    >
                      {job.openings ?? 0} Openings
                    </Typography>
                  </ListItem>
                ))}
              </List>

              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  position: "absolute",
                  bottom: 10,
                  left: 0,
                  right: 0,
                  px: 2,
                }}
              >
                <IconButton
                  disabled={jobPage === 0}
                  onClick={() => setJobPage((p) => Math.max(p - 1, 0))}
                >
                  <ChevronLeftIcon />
                </IconButton>

                <IconButton
                  disabled={
                    jobStart + ITEMS_PER_PAGE >=
                    openingsData.jobOpenings.length
                  }
                  onClick={() => setJobPage((p) => p + 1)}
                >
                  <ChevronRightIcon />
                </IconButton>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={8}>
          <Card sx={{ borderRadius: 3 }}>
            <CardContent sx={{ p: 0 }}>
              <Box sx={{ p: 2 }}>
                <Typography sx={{ fontWeight: 700 }}>
                  {getGreeting()}, {user?.name?.split(" ")[0]}!
                </Typography>
              </Box>

              <Box
                sx={{
                  height: 260,
                  borderRadius: 3,
                  overflow: "hidden",
                  position: "relative",
                }}
              >
                {openingsData.eventImages.length ? (
                  openingsData.eventImages.map((img, i) => (
                    <Box
                      key={i}
                      sx={{
                        position: "absolute",
                        inset: 0,
                        backgroundImage: `url(${img.imageUrl})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        opacity: i === currentIndex ? 1 : 0,
                        transition: "opacity .7s",
                      }}
                    />
                  ))
                ) : (
                  <Box
                    sx={{
                      height: "100%",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      bgcolor: "#f0f0f0",
                    }}
                  >
                    No Events Found
                  </Box>
                )}
              </Box>

              <Box sx={{ p: 2 }}>
                <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                  <TrendingUpIcon sx={{ mr: 1 }} />
                  <Typography sx={{ fontWeight: 700 }}>
                    Employee Join Trend (2025)
                  </Typography>
                </Box>

                <Box sx={{ height: 260 }}>
                  <Line data={chartData} options={chartOptions} />
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
