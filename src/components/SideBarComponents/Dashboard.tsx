import { Box, Card, Typography, IconButton } from "@mui/material";
import DashboardHeader from "../DashboardHeader";
import { sidebarItems } from "../../common/sidebarItems";
import { useAppSelector } from "../../hooks/reduxHooks";
import { useAuth } from "../../contexts/AuthContext";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { useState, useEffect } from "react";

const Dashboard = () => {
  const { user } = useAuth();

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  };

  const currentItem = sidebarItems.find(
    (item) => item.route === "/admin/dashboard"
  );

  const employees = useAppSelector((state) => state.employees.employees);

  const recentJoiners = [...employees]
    .filter((emp) => emp.joinDate)
    .sort(
      (a, b) => new Date(b.joinDate).getTime() - new Date(a.joinDate).getTime()
    )
    .slice(0, 3);

  // Carousel images
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

  return (
    <Box>
      <DashboardHeader
        title={currentItem?.label || "Dashboard"}
        icon={currentItem?.icon}
        
      />

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
          }}
        >
          <Typography variant="h6" sx={{ mb: 1 }}>
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
                  width: 250,
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
                      {"9:30 AM"}
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

          <Typography variant="body1">
            {new Date().toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </Typography>
        </Box>

        {/* RIGHT COLUMN — Greeting + Carousel */}
        <Box
          sx={{
            height: 700,
            width: "70%",
            backgroundColor: "#fff",
            borderRadius: "40px 0 0 40px",
            boxShadow: "-4px 0 12px rgba(0,0,0,0.05)",
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-start",
            alignItems: "flex-start",
            textAlign: "left",
            p: 5,
          }}
        >
          {/* Greeting */}
          <Box sx={{ mb: 3 }}>
            <Typography
              variant="h4"
              sx={{
                fontWeight: 600,
                fontSize: "30px",
                color: "#333",
                mb: 0.5,
              }}
            >
              {getGreeting()}, {user?.name || "User"}
            </Typography>
          </Box>

          {/* Carousel */}
          <Box sx={{ position: "relative", width: "100%", mt: 2 }}>
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
                  height: 300,
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
          {/* Random Graph */}
        </Box>
      </Box>
    </Box>
  );
};

export default Dashboard;
