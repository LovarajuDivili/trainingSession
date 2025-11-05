/* eslint-disable react-hooks/exhaustive-deps */
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
  const [imageIndex, setImageIndex] = useState(0);
  const handleNextImage = () =>
    setImageIndex((prev) => (prev + 1) % images.length);
  const handlePrevImage = () =>
    setImageIndex((prev) => (prev - 1 + images.length) % images.length);

  useEffect(() => {
    const timer = setInterval(handleNextImage, 4000);
    return () => clearInterval(timer);
  }, []);

  const recentJoiners = useMemo(() => {
    return [...employees]
      .filter((emp) => emp.joinDate)
      .sort(
        (a, b) =>
          new Date(b.joinDate).getTime() - new Date(a.joinDate).getTime()
      );
  }, [employees]);

  const [currentJoinerIndex, setCurrentJoinerIndex] = useState(0);
  const visibleJoiners = 3;

  const handleNextJoiners = () => {
    setCurrentJoinerIndex((prev) =>
      prev + visibleJoiners >= recentJoiners.length ? 0 : prev + 1
    );
  };

  const handlePrevJoiners = () => {
    setCurrentJoinerIndex((prev) =>
      prev === 0 ? Math.max(0, recentJoiners.length - visibleJoiners) : prev - 1
    );
  };

  useEffect(() => {
    if (recentJoiners.length > visibleJoiners) {
      const timer = setInterval(handleNextJoiners, 3000);
      return () => clearInterval(timer);
    }
  }, [recentJoiners.length]);

  const getVisibleJoiners = () => {
    if (recentJoiners.length === 0) return [];

    const endIndex = Math.min(
      currentJoinerIndex + visibleJoiners,
      recentJoiners.length
    );
    let visible = recentJoiners.slice(currentJoinerIndex, endIndex);

    if (
      visible.length < visibleJoiners &&
      recentJoiners.length > visibleJoiners
    ) {
      const remaining = visibleJoiners - visible.length;
      visible = [...visible, ...recentJoiners.slice(0, remaining)];
    }

    return visible;
  };

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

  const currentOpenings = [
    { title: "Frontend Developer", department: "Engineering", applicants: 12 },
    { title: "UX Designer", department: "Design", applicants: 8 },
  ];

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

  const visibleJoinersList = getVisibleJoiners();

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
            height: "calc(108vh - 150px)",
            width: "30%",
            display: "flex",
            flexDirection: "column",
            p: 2,
            pt: 0.5,
            position: "relative",
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              //justifyContent: "space-between",
              mb: 1,
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              New Joiners ({recentJoiners.length})
            </Typography>

            {recentJoiners.length > visibleJoiners && (
              <Box sx={{ display: "flex", gap: 0.5 }}>
                <IconButton
                  onClick={handlePrevJoiners}
                  size="small"
                  sx={{
                    backgroundColor: "rgba(0,0,0,0.04)",
                    "&:hover": { backgroundColor: "rgba(0,0,0,0.08)" },
                  }}
                >
                  <ArrowBackIosNewIcon fontSize="small" />
                </IconButton>
                <IconButton
                  onClick={handleNextJoiners}
                  size="small"
                  sx={{
                    backgroundColor: "rgba(0,0,0,0.04)",
                    "&:hover": { backgroundColor: "rgba(0,0,0,0.08)" },
                  }}
                >
                  <ArrowForwardIosIcon fontSize="small" />
                </IconButton>
              </Box>
            )}
          </Box>

          <Box sx={{ flex: 1, overflow: "hidden", mb: 1 }}>
            {" "}
            {visibleJoinersList.length > 0 ? (
              visibleJoinersList.map((emp, index) => (
                <Card
                  key={`${emp.id}-${currentJoinerIndex + index}`}
                  sx={{
                    p: 1.5,
                    borderRadius: 4,
                    boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
                    backgroundColor: "#fdfefe",
                    width: "80%",
                    mb: 1.5,
                    transition: "transform 0.3s ease, opacity 0.3s ease",
                    transform: "translateX(0)",
                    opacity: 1,
                    minHeight: "auto",
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                    <Box
                      sx={{
                        width: 45,
                        height: 45,
                        borderRadius: "50%",
                        overflow: "hidden",
                        mr: 1.5,
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
                        sx={{ fontWeight: 600, fontSize: "14px" }}
                      >
                        {emp.name}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ fontSize: "12px" }}
                      >
                        {emp.role || "—"}
                      </Typography>
                    </Box>
                  </Box>

                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      px: 0.5,
                      mt: 0.5,
                    }}
                  >
                    <Box>
                      <Typography
                        variant="caption"
                        sx={{
                          color: "#00bcd4",
                          fontWeight: 600,
                          fontSize: "11px",
                        }}
                      >
                        Date
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{ fontWeight: 600, fontSize: "12px" }}
                      >
                        {emp.joinDate
                          ? new Date(emp.joinDate).toLocaleDateString()
                          : "—"}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography
                        variant="caption"
                        sx={{
                          color: "#00bcd4",
                          fontWeight: 600,
                          fontSize: "11px",
                        }}
                      >
                        Time
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{ fontWeight: 600, fontSize: "12px" }}
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
          </Box>

          {recentJoiners.length > visibleJoiners && (
            <Box
              sx={{ display: "flex", justifyContent: "center", gap: 1, mb: 1 }}
            >
              {" "}
              {Array.from({
                length: Math.ceil(recentJoiners.length / visibleJoiners),
              }).map((_, dotIndex) => (
                <Box
                  key={dotIndex}
                  sx={{
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    backgroundColor:
                      Math.floor(currentJoinerIndex / visibleJoiners) ===
                      dotIndex
                        ? "primary.main"
                        : "grey.300",
                    transition: "background-color 0.3s ease",
                  }}
                />
              ))}
            </Box>
          )}

          <Typography
            variant="body1"
            sx={{ fontWeight: 500, fontSize: "14px", pb: 0.5 }}
          >
            {" "}
            {new Date().toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </Typography>

          <Box sx={{ mb: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 1.5 }}>
              Current Openings
            </Typography>

            <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
              {currentOpenings.map((opening, index) => (
                <Card
                  key={index}
                  sx={{
                    p: 1.5,
                    height: "35px",
                    width: "80%",
                    borderRadius: 3,
                    boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                    backgroundColor: "#f8f9fa",
                    border: "1px solid #e9ecef",
                    transition: "all 0.2s ease",
                    "&:hover": {
                      boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                      transform: "translateY(-1px)",
                    },
                  }}
                >
                  <Typography
                    variant="subtitle1"
                    sx={{ fontWeight: 600, fontSize: "13px", mb: 0.5 }}
                  >
                    {opening.title}
                  </Typography>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ fontSize: "11px" }}
                    >
                      {opening.department}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        fontSize: "11px",
                        fontWeight: 600,
                        color: "primary.main",
                      }}
                    >
                      {opening.applicants} applicants
                    </Typography>
                  </Box>
                </Card>
              ))}
            </Box>
          </Box>
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
                src={images[imageIndex]}
                alt={`Slide ${imageIndex + 1}`}
                sx={{
                  width: "100%",
                  height: 250,
                  objectFit: "cover",
                  transition: "opacity 1s ease-in-out",
                }}
              />
            </Card>

            <IconButton
              onClick={handlePrevImage}
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
              onClick={handleNextImage}
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
