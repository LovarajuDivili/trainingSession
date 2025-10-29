import {
  Box,
  Typography,
  TextField,
  // Button,
  InputAdornment,
  Grid,
  Card,
  CardContent,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../hooks/reduxHooks";
import { fetchEmployees } from "../../store/EmployeesSlice";
import Header from "../../components/Header";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Fab from "@mui/material/Fab";
import { useNavigate } from "react-router-dom";

const HrData = () => {
  const dispatch = useAppDispatch();
  const employees = useAppSelector((state) => state.employees.employees);
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    dispatch(fetchEmployees());
  }, [dispatch]);

  // Filter employees based on role === "HR Team"
  const filteredEmployees = employees.filter(
    (emp) =>
      emp.role.toLowerCase() === "hr team" &&
      (emp.name.toLowerCase().includes(searchText.toLowerCase()) ||
        emp.id.toLowerCase().includes(searchText.toLowerCase()) ||
        emp.role.toLowerCase().includes(searchText.toLowerCase()))
  );

  const navigate = useNavigate();
  return (
    <Box sx={{ minHeight: "70vh", backgroundColor: "white" }}>
      <Header role={"HR Team"} />

      <Box sx={{ mt: 6 }}>
        {/* Header Section */}
        <Box
          sx={{
            width: "100%",
            height: 300,
            background: "linear-gradient(135deg, #ac8fff 0%, #6c63ff 100%)",
            borderRadius: "0 0 40px 40px",
            position: "relative",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            color: "#fff",
            textAlign: "center",
            overflow: "hidden",
            p: 0,
          }}
        >
          {/* Profile Circles */}
          {filteredEmployees.length > 0 && (
            <Box
              sx={{
                position: "absolute",
                top: 40,
                display: "flex",
                gap: 3,
                flexWrap: "wrap",
                justifyContent: "center",
              }}
            >
              {filteredEmployees.slice(0, 6).map((emp, index) => (
                <Box
                  key={index}
                  component="img"
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
                  onError={(e) => {
                    e.currentTarget.src = "/placeholder.jpg";
                  }}
                  sx={{
                    width: 60,
                    height: 60,
                    borderRadius: "50%",
                    border: "3px solid white",
                    objectFit: "cover",
                    mx: 1,
                  }}
                />
              ))}
            </Box>
          )}

          <Typography
            variant="h4"
            fontWeight={700}
            sx={{ mt: 10, mb: 1, zIndex: 1 }}
          >
            Meet Our HR Team
          </Typography>

          {/* Search Bar */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              backgroundColor: "#fff",
              borderRadius: "30px",
              boxShadow: 3,
              width: { xs: "90%", sm: "70%", md: "50%" },
              p: 1,
              zIndex: 1,
            }}
          >
            <TextField
              fullWidth
              placeholder="Search HR member by name or ID"
              variant="standard"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              InputProps={{
                disableUnderline: true,
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: "#888" }} />
                  </InputAdornment>
                ),
              }}
              sx={{ mx: 1 }}
            />
          </Box>
        </Box>

        {/* HR Cards Section */}
        <Box sx={{ p: 4 }}>
          <Grid
            container
            spacing={3}
            justifyContent="center"
            alignItems="stretch"
            sx={{
              maxWidth: "1200px",
              margin: "0 auto",
            }}
          >
            {filteredEmployees.length > 0 ? (
              filteredEmployees.map((emp) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={emp.id}>
                  <Card
                    sx={{
                      borderRadius: "16px",
                      boxShadow: 3,
                      textAlign: "center",
                      transition: "transform 0.2s",
                      "&:hover": { transform: "scale(1.03)" },
                      backgroundColor: "#fff",
                      height: "100%",
                    }}
                  >
                    <CardContent>
                      <Box
                        sx={{
                          width: 80,
                          height: 80,
                          borderRadius: "50%",
                          overflow: "hidden",
                          mx: "auto",
                          mb: 2,
                          boxShadow: 3,
                        }}
                      >
                        <Box
                          component="img"
                          src={
                            typeof emp.image === "string"
                              ? emp.image.startsWith("http")
                                ? emp.image
                                : `${
                                    import.meta.env.VITE_API_BASE_URL
                                  }/uploads/${emp.image}`
                              : emp.image
                              ? URL.createObjectURL(emp.image as File)
                              : "/placeholder.jpg"
                          }
                          alt={emp.name}
                          onError={(e) => {
                            e.currentTarget.src = "/placeholder.jpg";
                          }}
                          sx={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                          }}
                        />
                      </Box>

                      <Typography variant="h6" fontWeight={600}>
                        {emp.name}
                      </Typography>
                      <Typography color="text.secondary">{emp.role}</Typography>
                      <Typography sx={{ mt: 1, fontSize: 14 }}>
                        <strong>ID:</strong> {emp.id}
                      </Typography>
                      <Typography sx={{ fontSize: 14 }}>
                        <strong>Email:</strong> {emp.email}
                      </Typography>
                      <Typography sx={{ fontSize: 14 }}>
                        <strong>Join Date:</strong>{" "}
                        {emp.joinDate
                          ? new Date(emp.joinDate).toLocaleDateString()
                          : ""}
                      </Typography>

                      <Box
                        sx={{
                          mt: 2,
                          display: "flex",
                          flexWrap: "wrap",
                          justifyContent: "center",
                          gap: 1,
                        }}
                      >
                        {emp.skills.map((skill, i) => (
                          <Box
                            key={i}
                            sx={{
                              px: 1.5,
                              py: 0.5,
                              bgcolor: "#906aff",
                              color: "#fff",
                              borderRadius: "6px",
                              fontSize: 12,
                            }}
                          >
                            {skill}
                          </Box>
                        ))}
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))
            ) : (
              <Typography
                variant="h6"
                sx={{ mt: 4, display: "flex", alignItems: "center" }}
              >
                No HR team members found.
              </Typography>
            )}
          </Grid>
        </Box>
      </Box>
      <Fab
        color="primary"
        aria-label="back"
        onClick={() => navigate("/accountant")}
        sx={{
          position: "fixed",
          bottom: 20,
          left: 20,
          backgroundColor: "#906aff",
          color: "#fff",
          "&:hover": {
            backgroundColor: "#7a5df0",
          },
        }}
      >
        <ArrowBackIcon />
      </Fab>
    </Box>
  );
};

export default HrData;
