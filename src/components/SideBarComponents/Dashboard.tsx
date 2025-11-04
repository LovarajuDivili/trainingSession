import {
  Box,
  Card,
  Typography,
  IconButton,
  CircularProgress,
} from "@mui/material";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { useState, useEffect, useMemo } from "react";
import { useAppSelector, useAppDispatch } from "../../hooks/reduxHooks";
import { fetchEmployees } from "../../store/EmployeesSlice";
import { useAuth } from "../../contexts/AuthContext";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

const Dashboard = () => {
  const { user } = useAuth();
  const dispatch = useAppDispatch();
  const employees = useAppSelector((state) => state.employees.employees);
  const employeesLoading = useAppSelector((state) => state.employees.loading);
  const employeesError = useAppSelector((state) => state.employees.error);

  useEffect(() => {
    dispatch(fetchEmployees());
  }, [dispatch]);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  };

  // Carousel
  const images = [
    "https://picsum.photos/900/300?random=1",
    "https://picsum.photos/900/300?random=2",
    "https://picsum.photos/900/300?random=3",
  ];
  const [index, setIndex] = useState(0);
  const handleNext = () => setIndex((prev) => (prev + 1) % images.length);
  const handlePrev = () =>
    setIndex((prev) => (prev - 1 + images.length) % images.length);

  useEffect(() => {
    const timer = setInterval(handleNext, 4000);
    return () => clearInterval(timer);
  }, []);

  // Compute monthly join counts (Jan–Dec)
  const monthlyData = useMemo(() => {
    const data = Array(12).fill(0); // index 0 = Jan, 11 = Dec
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

  if (employeesLoading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "200px",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (employeesError) {
    return (
      <Typography color="error" sx={{ textAlign: "center", mt: 4 }}>
        Error loading employees: {employeesError}
      </Typography>
    );
  }

  const recentJoiners = [...employees]
    .filter((emp) => emp.joinDate)
    .sort(
      (a, b) => new Date(b.joinDate).getTime() - new Date(a.joinDate).getTime()
    )
    .slice(0, 3);

  return (
    <Box>
      <Box
        sx={{
          height: "calc(100vh - 150px)",
          width: "100%",
          display: "flex",
        }}
      >
        {/* LEFT COLUMN — New Joiners */}
        <Box
          sx={{
            height: "calc(100vh - 150px)",
            width: "30%",
            display: "flex",
            flexDirection: "column",
            gap: 2,
            p: 2,
          }}
        >
          <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
            New Joiners
          </Typography>

          {recentJoiners.length > 0 ? (
            recentJoiners.map((emp) => (
              <Card
                key={emp.id}
                sx={{
                  p: 2,
                  borderRadius: 4,
                  boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
                  backgroundColor: "#fdfefe",
                  width: "100%",
                  maxWidth: 280,
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", mb: 1.5 }}>
                  <Box
                    sx={{
                      width: 50,
                      height: 50,
                      borderRadius: "50%",
                      overflow: "hidden",
                      mr: 2,
                    }}
                  >
                    <img
                      src={
                        typeof emp.image === "string"
                          ? emp.image.startsWith("http")
                            ? emp.image
                            : `${import.meta.env.VITE_API_BASE_URL}/uploads/${
                                emp.image
                              }`
                          : emp.image
                          ? URL.createObjectURL(emp.image as File)
                          : "/placeholder.jpg"
                      }
                      alt={emp.name}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                      onError={(e) =>
                        (e.currentTarget.src = "/placeholder.jpg")
                      }
                    />
                  </Box>

                  <Box>
                    <Typography
                      variant="subtitle1"
                      sx={{ fontWeight: 600, fontSize: "15px" }}
                    >
                      {emp.name}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ fontSize: "13px" }}
                    >
                      {emp.role || "—"}
                    </Typography>
                  </Box>
                </Box>

                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mb: 1,
                    px: 0.5,
                  }}
                >
                  <Box>
                    <Typography
                      variant="caption"
                      sx={{ color: "#00bcd4", fontWeight: 600 }}
                    >
                      Date
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ fontWeight: 600, fontSize: "13px" }}
                    >
                      {emp.joinDate
                        ? new Date(emp.joinDate).toLocaleDateString()
                        : "—"}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography
                      variant="caption"
                      sx={{ color: "#00bcd4", fontWeight: 600 }}
                    >
                      Time
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ fontWeight: 600, fontSize: "13px" }}
                    >
                      9:30 AM
                    </Typography>
                  </Box>
                </Box>
              </Card>
            ))
          ) : (
            <Typography color="text.secondary">
              No recent joiners found.
            </Typography>
          )}

          <Typography variant="body1" sx={{ mt: 2, fontWeight: 500 }}>
            {new Date().toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </Typography>
        </Box>

        {/* RIGHT COLUMN — Greeting + Carousel + Chart */}
        <Box
          sx={{
            height: 620,
            flex: 1,
            backgroundColor: "#fff",
            borderRadius: "40px 0 0 40px",
            boxShadow: "-4px 0 12px rgba(0,0,0,0.05)",
            p: 5,
            pt: 2,
            pb: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-start",
            alignItems: "flex-start",
          }}
        >
          <Typography
            variant="h4"
            sx={{ fontWeight: 600, fontSize: "30px", color: "#333", mb: 1 }}
          >
            {getGreeting()}, {user?.name || "User"}!
          </Typography>

          <Box sx={{ position: "relative", width: "100%", mt: 1 }}>
            <Card
              sx={{
                overflow: "hidden",
                borderRadius: 4,
                boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
              }}
            >
              <Box
                component="img"
                src={images[index]}
                alt={`Slide ${index + 1}`}
                sx={{
                  width: "100%",
                  height: 250,
                  objectFit: "cover",
                  transition: "opacity 1s ease-in-out",
                }}
              />
            </Card>

            <IconButton
              onClick={handlePrev}
              sx={{
                position: "absolute",
                top: "50%",
                left: 20,
                transform: "translateY(-50%)",
                backgroundColor: "rgba(255,255,255,0.7)",
                "&:hover": { backgroundColor: "rgba(255,255,255,0.9)" },
              }}
            >
              <ArrowBackIosNewIcon />
            </IconButton>

            <IconButton
              onClick={handleNext}
              sx={{
                position: "absolute",
                top: "50%",
                right: 20,
                transform: "translateY(-50%)",
                backgroundColor: "rgba(255,255,255,0.7)",
                "&:hover": { backgroundColor: "rgba(255,255,255,0.9)" },
              }}
            >
              <ArrowForwardIosIcon />
            </IconButton>
          </Box>

          <Typography
            variant="h6"
            sx={{ mt: 2, mb: 1, fontWeight: 600, color: "#333" }}
          >
            Employee Join Trend (Jan–Dec)
          </Typography>

          <ResponsiveContainer width="95%" height="90%">
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
              />
              <Line
                type="monotone"
                dataKey="count"
                stroke="#1976d2"
                strokeWidth={3}
                dot={{ r: 5 }}
                activeDot={{ r: 8 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </Box>
      </Box>
    </Box>
  );
};

export default Dashboard;
