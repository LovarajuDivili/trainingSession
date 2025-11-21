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
//import { colors } from "../../common/colorConstants";
import { useThemeColors } from "../../hooks/useThemeColors";
import { fetchCarouselImages } from "../../store/CarouselSlice";
import { fetchCurrentOpenings } from "../../store/CurrentOpeningsSlice";

const Dashboard = () => {
  const { user } = useAuth();
  const colors = useThemeColors();
  const dispatch = useAppDispatch();
  const employees = useAppSelector((state) => state.employees.employees);
  const employeesLoading = useAppSelector((state) => state.employees.loading);
  const employeesError = useAppSelector((state) => state.employees.error);
  const { openings: currentOpenings } = useAppSelector(
    (state) => state.currentOpenings
  );

  useEffect(() => {
    dispatch(fetchCarouselImages(true));
    dispatch(fetchEmployees());
    dispatch(fetchCurrentOpenings(true));
  }, [dispatch]);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  };

  // Carousel
  const { images: carouselImages } = useAppSelector((state) => state.carousel);

  const images = carouselImages
    .filter((img) => img.is_active)
    .sort((a, b) => a.order - b.order)
    .map((img) => img.image_data);

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
          p: 0.5,
          gap: 2,
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mr: 6,
          }}
        >
          <Typography
            variant="h6"
            sx={{ fontWeight: 600, color: colors.text.primary }}
          >
            New Joiners
          </Typography>

          {recentJoiners.length > visibleJoiners && (
            <Box sx={{ display: "flex", gap: 0.5 }}>
              <IconButton
                onClick={handlePrevJoiners}
                size="small"
                sx={{
                  backgroundColor: colors.overlay.black04,
                  "&:hover": { backgroundColor: colors.overlay.black08 },
                }}
              >
                <ArrowBackIosNewIcon
                  fontSize="small"
                  sx={{ color: colors.primary.main }}
                />
              </IconButton>
              <IconButton
                onClick={handleNextJoiners}
                size="small"
                sx={{
                  backgroundColor: colors.overlay.black04,
                  "&:hover": { backgroundColor: colors.overlay.black08 },
                }}
              >
                <ArrowForwardIosIcon
                  fontSize="small"
                  sx={{ color: colors.primary.main }}
                />
              </IconButton>
            </Box>
          )}
        </Box>

        <Box sx={{ flex: 1 }}>
          {visibleJoinersList.length > 0 ? (
            visibleJoinersList.map((emp, index) => (
              <Card
                key={`${emp.id}-${currentJoinerIndex + index}`}
                sx={{
                  p: 1.5,
                  borderRadius: 4,
                  boxShadow: `0 4px 20px ${colors.shadow.card}`,
                  backgroundColor: colors.background.card,
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
                        emp.image
                          ? `data:image/jpeg;base64,${emp.image}`
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
                      sx={{
                        fontWeight: 600,
                        fontSize: "14px",
                        color: colors.text.primary1,
                      }}
                    >
                      {emp.name}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ fontSize: "12px", color: colors.text.secondary }}
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
                        color: colors.status.info,
                        fontWeight: 600,
                        fontSize: "11px",
                      }}
                    >
                      Date
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        fontWeight: 600,
                        fontSize: "12px",
                        color: colors.text.primary1,
                      }}
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
                        color: colors.status.info,
                        fontWeight: 600,
                        fontSize: "11px",
                      }}
                    >
                      Time
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        fontWeight: 600,
                        fontSize: "12px",
                        color: colors.text.primary1,
                      }}
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
          <Box sx={{ display: "flex", justifyContent: "center", gap: 1 }}>
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
                    Math.floor(currentJoinerIndex / visibleJoiners) === dotIndex
                      ? colors.primary.main
                      : "grey.300",
                  transition: "background-color 0.3s ease",
                }}
              />
            ))}
          </Box>
        )}

        <Typography sx={{ fontWeight: 600, color: colors.text.primary }}>
          Current Openings
        </Typography>

        <Box
          sx={{
            flex: 1,
            overflowY: "auto",
            pr: 1,
            "&::-webkit-scrollbar": { width: "6px" },
            "&::-webkit-scrollbar-thumb": {
              backgroundColor: colors.special.scrollbarThumb,
              borderRadius: "10px",
            },
          }}
        >
          {currentOpenings.length > 0 ? (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
              {currentOpenings.map((opening, index) => (
                <Card
                  key={index}
                  sx={{
                    p: 1.5,
                    height: "35px",
                    width: "80%",
                    borderRadius: 3,
                    boxShadow: `0 2px 8px ${colors.shadow.light}`,
                    backgroundColor: colors.special.currentOpeningsBg,
                    border: `1px solid ${colors.border.light}`,
                    transition: "all 0.2s ease",
                    "&:hover": {
                      boxShadow: `0 4px 12px ${colors.shadow.hover}`,
                      transform: "translateY(-1px)",
                    },
                  }}
                >
                  <Typography
                    variant="subtitle1"
                    sx={{
                      fontWeight: 600,
                      fontSize: "13px",
                      mb: 0.5,
                      color: colors.text.primary,
                    }}
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
                      sx={{ fontSize: "11px", color: colors.text.secondary }}
                    >
                      {opening.department}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        fontSize: "11px",
                        fontWeight: 600,
                        color: colors.primary.main,
                      }}
                    >
                      {opening.applicants} applicants
                    </Typography>
                  </Box>
                </Card>
              ))}
            </Box>
          ) : (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "100px",
                width: "80%",
              }}
            >
              <Typography
                sx={{
                  color: colors.text.secondary,
                  fontStyle: "italic",
                  textAlign: "center",
                }}
              >
                No openings
              </Typography>
            </Box>
          )}
        </Box>
      </Box>

      {/* RIGHT COLUMN — Greeting + Carousel + Chart */}
      <Box
        sx={{
          height: 620,
          flex: 1,
          backgroundColor: colors.background.white,
          borderRadius: "40px 0 0 40px",
          boxShadow: `-4px 0 12px ${colors.shadow.medium}`,
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
          sx={{
            fontWeight: 600,
            fontSize: "30px",
            mb: 1,
            color: colors.text.primary,
          }}
        >
          <Box component="span" sx={{ color: colors.primary.main }}>
            {getGreeting()},
          </Box>{" "}
          <Box component="span" sx={{ color: colors.text.primary }}>
            {user?.name || "User"}!
          </Box>
        </Typography>

        <Box
          sx={{
            position: "relative",
            width: "100%",
            mt: 1,
            "&:hover .carousel-title-overlay": {
              opacity: 1,
            },
          }}
        >
          <Card
            sx={{
              overflow: "hidden",
              borderRadius: 4,
              boxShadow: `0 4px 20px ${colors.shadow.medium}`,
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

            {/* Hover Title Overlay */}
            <Box
              className="carousel-title-overlay"
              sx={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: colors.overlay.black08,
                color: colors.text.white,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                opacity: 0,
                transition: "opacity 0.3s ease-in-out",
                pointerEvents: "none",
              }}
            >
              <Typography
                variant="h5"
                sx={{
                  fontWeight: 600,
                  fontSize: "20px",
                  textAlign: "center",
                  margin: 0,
                  textShadow: `0 2px 4px ${colors.shadow.dark}`,
                }}
              >
                {carouselImages
                  .filter((img) => img.is_active)
                  .sort((a, b) => a.order - b.order)[imageIndex]?.title ||
                  "Carousel Image"}
              </Typography>
            </Box>
          </Card>

          <IconButton
            onClick={handlePrevImage}
            sx={{
              position: "absolute",
              top: "50%",
              left: 20,
              transform: "translateY(-50%)",
              backgroundColor: colors.overlay.white70,
              "&:hover": { backgroundColor: colors.overlay.white90 },
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
              backgroundColor: colors.overlay.white70,
              "&:hover": { backgroundColor: colors.overlay.white90 },
            }}
          >
            <ArrowForwardIosIcon />
          </IconButton>
        </Box>

        <Typography
          variant="h6"
          sx={{ mt: 2, mb: 1, fontWeight: 600, color: colors.text.primary }}
        >
          Employee Join Trend (Jan–Dec)
        </Typography>

        <ResponsiveContainer width="95%" height="90%">
          <LineChart data={monthlyData}>
            <CartesianGrid strokeDasharray="3 3" stroke={colors.chart.grid} />
            <XAxis dataKey="month" />
            <YAxis allowDecimals={false} />
            <Tooltip
              contentStyle={{
                backgroundColor: colors.chart.tooltipBackground,
                border: `1px solid ${colors.chart.tooltipBorder}`,
                borderRadius: 8,
              }}
              labelStyle={{ color: colors.primary.main }}
              itemStyle={{ color: colors.primary.main }}
            />

            <Line
              type="monotone"
              dataKey="count"
              stroke={colors.chart.line}
              strokeWidth={3}
              dot={{ r: 5 }}
              activeDot={{
                r: 8,
                fill: colors.chart.activeDot,
                stroke: colors.chart.activeDot,
              }}
            />
          </LineChart>
        </ResponsiveContainer>
      </Box>
    </Box>
  );
};

export default Dashboard;
