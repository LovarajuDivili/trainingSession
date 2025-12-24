import React, { useEffect, useState } from "react";
import {
  Grid,
  Paper,
  Typography,
  Avatar,
  Box,
  Button,
  LinearProgress,
} from "@mui/material";

import LaptopMacIcon from "@mui/icons-material/LaptopMac";
import HeadsetIcon from "@mui/icons-material/Headset";
import MonitorIcon from "@mui/icons-material/Monitor";
import CategoryIcon from "@mui/icons-material/Category";

import PeopleIcon from "@mui/icons-material/People";
import GroupsIcon from "@mui/icons-material/Groups";
import BusinessIcon from "@mui/icons-material/Business";

import { useNavigate } from "react-router-dom";

function getUserIdFromToken(): string | null {
  const token = localStorage.getItem("token");
  if (!token) return null;
  try {
    const decoded = JSON.parse(atob(token.split(".")[1]));
    return decoded.userId ?? decoded.id ?? null;
  } catch {
    return null;
  }
}

const CalendarSection = () => {
  const months = [
    "January","February","March","April","May","June",
    "July","August","September","October","November","December",
  ];

  const today = new Date();

  const [activeMonthIndex, setActiveMonthIndex] = useState(today.getMonth());
  const [year, setYear] = useState(today.getFullYear());

  const getVisibleMonths = () => {
    const arr = [];
    for (let i = 0; i < 4; i++) {
      arr.push(months[(activeMonthIndex - 3 + i + 12) % 12]);
    }
    return arr;
  };

  const visibleMonths = getVisibleMonths();

  const goPrev = () => {
    setActiveMonthIndex((p) => (p === 0 ? 11 : p - 1));
    if (activeMonthIndex === 0) setYear((y) => y - 1);
  };

  const goNext = () => {
    setActiveMonthIndex((p) => (p === 11 ? 0 : p + 1));
    if (activeMonthIndex === 11) setYear((y) => y + 1);
  };

  const getWeek = () => {
    let reference =
      activeMonthIndex === today.getMonth() && year === today.getFullYear()
        ? today
        : new Date(year, activeMonthIndex, 1);

    const dow = reference.getDay();
    const mondayOffset = dow === 0 ? -6 : 1 - dow;

    const monday = new Date(
      reference.getFullYear(),
      reference.getMonth(),
      reference.getDate() + mondayOffset
    );

    const arr: any[] = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(
        monday.getFullYear(),
        monday.getMonth(),
        monday.getDate() + i
      );

      const label = `${d.getDate()} ${d.toLocaleDateString("en-US", {
        weekday: "short",
      })}`;

      arr.push({
        label,
        isToday:
          d.getDate() === today.getDate() &&
          d.getMonth() === today.getMonth() &&
          d.getFullYear() === today.getFullYear(),
      });
    }
    return arr;
  };

  const weekDays = getWeek();

  return (
    <Box sx={{ mt: 4 }}>
      <Box sx={{ display: "flex", justifyContent: "center", gap: 3 }}>
        <Typography sx={{ fontSize: 20, cursor: "pointer" }} onClick={goPrev}>
          ‹
        </Typography>

        <Box sx={{ display: "flex", gap: 3 }}>
          {visibleMonths.map((m) => (
            <Typography
              key={m}
              sx={{
                cursor: "pointer",
                color: m === months[activeMonthIndex] ? "#7b3fe4" : "#777",
                fontWeight: m === months[activeMonthIndex] ? 700 : 500,
              }}
              onClick={() => setActiveMonthIndex(months.indexOf(m))}
            >
              {m}
            </Typography>
          ))}
        </Box>

        <Typography sx={{ fontSize: 20, cursor: "pointer" }} onClick={goNext}>
          ›
        </Typography>
      </Box>

      <Box sx={{ display: "flex", justifyContent: "center", mt: 3, gap: 3 }}>
        {weekDays.map((d, i) => (
          <Box
            key={i}
            sx={{
              px: 2,
              py: "6px",
              borderRadius: "12px",
              backgroundColor: d.isToday ? "#f1e6ff" : "transparent",
              color: d.isToday ? "#7b3fe4" : "#222",
              fontWeight: 600,
            }}
          >
            {d.label}
          </Box>
        ))}
      </Box>

      <Typography
        sx={{ mt: 3, textAlign: "center", fontSize: 20, fontWeight: 700 }}
      >
        {months[activeMonthIndex]} {year}
      </Typography>

      <Box
        sx={{
          height: "2px",
          width: "90%",
          mt: 3,
          mx: "auto",
          background: "#dcdcdc",
        }}
      />
    </Box>
  );
};

const smallCard = {
  p: 2,
  display: "flex",
  alignItems: "center",
  gap: 2,
  borderRadius: 2,
  boxShadow: "0 3px 8px rgba(0,0,0,0.06)",
};

const AccountantDashboard = () => {
  const nav = useNavigate();

  const [items, setItems] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [employees, setEmployees] = useState<any[]>([]);

  const token = localStorage.getItem("token");
  const userId = getUserIdFromToken();

  useEffect(() => {
    fetch("http://localhost:5000/api/accountant", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((d) => setItems(d.items ?? []));
  }, []);

  useEffect(() => {
    fetch("http://localhost:5000/api/employees", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((d) => setEmployees(d ?? []));
  }, []);

  const roleCounts = React.useMemo(() => {
    const map = new Map<string, number>();
    employees.forEach((emp) => {
      const r = (emp.role ?? "").trim().toLowerCase();
      if (!r) return;
      map.set(r, (map.get(r) ?? 0) + 1);
    });

    return Array.from(map).map(([role, count]) => ({
      role: role.charAt(0).toUpperCase() + role.slice(1),
      count,
    }));
  }, [employees]);

  const dashboardCounts = {
    laptops: items.filter((i) => i.category === "Laptop").length,
    headphones: items.filter((i) => i.category === "HeadHeadphones").length,
    monitors: items.filter((i) => i.category === "Monitor").length,
    others: items.filter(
      (i) => !["Laptop", "Headphones", "Monitor"].includes(i.category)
    ).length,
  };

  const fetchOrders = () => {
    if (!userId) return;

    fetch(`http://localhost:5000/api/orders/${userId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((d) => setOrders(d.orders ?? []));
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const updateOrder = (id: string, status: string, progress: number) => {
    fetch(`http://localhost:5000/api/orders/update/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ status, progress }),
    }).then(() => fetchOrders());
  };

  return (
    <Box sx={{ display: "flex", gap: 3 }}>
      {/* LEFT SIDE */}
      <Grid container spacing={3} sx={{ flex: 1 }}>
        <Grid item xs={12}>
          <Typography variant="h6" fontWeight={700}>
            Select the items
          </Typography>
        </Grid>

        {/* Cards */}
        <Grid item xs={12}>
          <Grid container spacing={2}>
            <Grid item xs={6} sm={3}>
              <Paper sx={smallCard}>
                <Avatar sx={{ bgcolor: "#ffecec" }}>
                  <LaptopMacIcon sx={{ color: "#f15e5e" }} />
                </Avatar>
                <Box>
                  <Typography fontWeight={700}>
                    {dashboardCounts.laptops}
                  </Typography>
                  <Typography sx={{ opacity: 0.6 }}>Laptops</Typography>
                </Box>
              </Paper>
            </Grid>

            <Grid item xs={6} sm={3}>
              <Paper sx={smallCard}>
                <Avatar sx={{ bgcolor: "#e7f3ff" }}>
                  <HeadsetIcon sx={{ color: "#007bff" }} />
                </Avatar>
                <Box>
                  <Typography fontWeight={700}>
                    {dashboardCounts.headphones}
                  </Typography>
                  <Typography sx={{ opacity: 0.6 }}>HeadPhones</Typography>
                </Box>
              </Paper>
            </Grid>

            <Grid item xs={6} sm={3}>
              <Paper sx={smallCard}>
                <Avatar sx={{ bgcolor: "#ecffef" }}>
                  <MonitorIcon sx={{ color: "#28a745" }} />
                </Avatar>
                <Box>
                  <Typography fontWeight={700}>
                    {dashboardCounts.monitors}
                  </Typography>
                  <Typography sx={{ opacity: 0.6 }}>Monitors</Typography>
                </Box>
              </Paper>
            </Grid>

            <Grid item xs={6} sm={3}>
              <Paper
                sx={smallCard}
                onClick={() => nav("/accountant/requestOrder")}
              >
                <Avatar sx={{ bgcolor: "#fff4e6" }}>
                  <CategoryIcon sx={{ color: "#c79b4b" }} />
                </Avatar>
                <Box>
                  <Typography fontWeight={700}>
                    {dashboardCounts.others}
                  </Typography>
                  <Typography sx={{ opacity: 0.6 }}>Others</Typography>
                </Box>
              </Paper>
            </Grid>
          </Grid>
        </Grid>

        <Grid item xs={12}>
          <CalendarSection />
        </Grid>

        <Grid item xs={12}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {roleCounts.map((r) => (
              <Paper
                key={r.role}
                onClick={() =>
                  nav(`/accountant/employeedata?role=${r.role}`)
                }
                sx={{
                  p: 2,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  borderRadius: 2,
                  boxShadow: "0 3px 8px rgba(0,0,0,0.06)",
                  cursor: "pointer",
                }}
              >
                <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
                  <Avatar sx={{ bgcolor: "#f6f0ff" }}>
                    {r.role.toLowerCase() === "hr" ? (
                      <PeopleIcon sx={{ color: "#906aff" }} />
                    ) : r.role.toLowerCase() === "admin" ? (
                      <BusinessIcon sx={{ color: "#007bff" }} />
                    ) : (
                      <GroupsIcon sx={{ color: "#906aff" }} />
                    )}
                  </Avatar>
                  <Box>
                    <Typography fontWeight={700}>{r.role}</Typography>
                    <Typography sx={{ opacity: 0.7 }}>
                      {r.count} member(s)
                    </Typography>
                  </Box>
                </Box>

                <Box
                  sx={{
                    width: 34,
                    height: 34,
                    borderRadius: "50%",
                    background: "#906aff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "white",
                    fontWeight: 700,
                  }}
                >
                  {r.count}
                </Box>
              </Paper>
            ))}
          </Box>
        </Grid>
      </Grid>

      <Box sx={{ width: "400px", flexShrink: 0, mr: 2 }}>

        <Paper
          sx={{
            p: 2,
            backgroundColor: "white",
            borderRadius: 2,
            boxShadow: "0 3px 10px rgba(0,0,0,0.1)",
            height: "auto",
            overflowY: "visible",
          }}
        >
          <Box
            sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}
          >
            <Typography variant="h6" fontWeight={700}>
              My Orders
            </Typography>

            <Button
              variant="contained"
              sx={{
                backgroundColor: "#906AFF",
                borderRadius: "18px",
                fontSize: "12px",
                textTransform: "none",
                "&:hover": { backgroundColor: "#7c55ff" },
              }}
              onClick={() => nav("/accountant/requestOrder")}
            >
              Request Another Order
            </Button>
          </Box>

          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {orders.map((order, i) => (
              <Paper
                key={i}
                sx={{
                  p: 2,
                  borderRadius: 2,
                  backgroundColor: "#faf8ff",
                }}
              >
                <Typography fontWeight={700}>Order #{i + 1}</Typography>
                <Typography sx={{ mt: 1 }}>
                  Status: <b>{order.status}</b>
                </Typography>

                <Typography sx={{ mt: 1 }}>
                  Progress: {order.progress}%
                </Typography>

                <LinearProgress
                  variant="determinate"
                  value={order.progress}
                  sx={{
                    height: 8,
                    borderRadius: 5,
                    mt: 1,
                    backgroundColor: "#e7d8ff",
                    "& .MuiLinearProgress-bar": {
                      backgroundColor: "#906aff",
                    },
                  }}
                />

                <Box sx={{ display: "flex", gap: 1, mt: 2 }}>
                  <Button
                    size="small"
                    variant="contained"
                    sx={{
                      backgroundColor: "#906aff",
                      borderRadius: "18px",
                      textTransform: "none",
                      fontSize: "12px",
                      '&:hover':{ backgroundColor: '#906aff'}

                    }}
                    onClick={() =>
                      updateOrder(order._id, "Processing", 50)
                    }
                  >
                    Mark Processing
                  </Button>

                  <Button
                    size="small"
                    variant="contained"
                    sx={{
                      backgroundColor: "#906aff",
                      borderRadius: "18px",
                      textTransform: "none",
                      fontSize: "12px",
                      '&:hover':{ backgroundColor: '#906aff'}
                    }}
                    onClick={() =>
                      updateOrder(order._id, "Completed", 100)
                    }
                  >
                    Complete
                  </Button>
                </Box>
              </Paper>
            ))}
          </Box>
        </Paper>
      </Box>
    </Box>
  );
};

export default AccountantDashboard;
