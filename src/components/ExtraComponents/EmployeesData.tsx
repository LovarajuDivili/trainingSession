import {
  Box,
  Typography,
  TextField,
  InputAdornment,
  Grid,
  Card,
  CardContent,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../hooks/reduxHooks";
import { fetchEmployees } from "../../store/EmployeesSlice";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Fab from "@mui/material/Fab";
import { useNavigate } from "react-router-dom";
import Header from "../../components/Header";

const EmployeeData = () => {
  const dispatch = useAppDispatch();
  const employees = useAppSelector((state) => state.employees.employees);
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    dispatch(fetchEmployees());
  }, [dispatch]);

  const filteredEmployees = employees.filter(
    (emp) =>
      emp.name.toLowerCase().includes(searchText.toLowerCase()) ||
      emp.id.toLowerCase().includes(searchText.toLowerCase()) ||
      emp.role.toLowerCase().includes(searchText.toLowerCase())
  );

  const navigate = useNavigate();

  const handleCardClick = (employeeId: string) => {
    navigate(`/accountant/employeedata/${employeeId}`, {
      state: { from: "/accountant/employeedata" },
    });
  };

  return (
    <Box sx={{ minHeight: "70vh", backgroundColor: "white" }}>
      <Box sx={{ position: "relative" }}>
        <Fab
          color="error"
          aria-label="back"
          onClick={() => navigate("/accountant")}
          sx={{
            position: "absolute",
            top: 20,
            right: 20,
            backgroundColor: "#ff4d4d",
            color: "#fff",
            boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
            "&:hover": {
              backgroundColor: "#e60000",
            },
          }}
        >
          <ArrowBackIcon />
        </Fab>
      </Box>
      <Header role={""} />

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
          {employees.length > 0 && (
            <Box
              sx={{
                position: "absolute",
                top: 75,
                display: "flex",
                justifyContent: "center",
                width: "100%",
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center" }}>
                {employees.slice(0, 4).map((emp, index) => (
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
                        : `https://randomuser.me/api/portraits/men/${
                            index + 10
                          }.jpg`
                    }
                    alt={emp.name}
                    sx={{
                      width: 40,
                      height: 40,
                      borderRadius: "50%",
                      border: "2px solid white",
                      objectFit: "cover",
                      ml: index === 0 ? 0 : -1.5,
                      boxShadow: "0 0 4px rgba(0,0,0,0.2)",
                    }}
                  />
                ))}

                {/* +count circle */}
                {employees.length > 4 && (
                  <Box
                    sx={{
                      width: 40,
                      height: 40,
                      borderRadius: "50%",
                      backgroundColor: "#ddd",
                      border: "2px solid white",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontWeight: 600,
                      color: "#555",
                      ml: -1.5,
                      fontSize: "0.9rem",
                    }}
                  >
                    +{employees.length - 4}
                  </Box>
                )}
              </Box>
            </Box>
          )}

          <Typography
            variant="h4"
            fontWeight={700}
            sx={{ mt: 10, mb: 1, zIndex: 1 }}
          >
            Search for the Employee
          </Typography>

          {/* Search Bar */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              backgroundColor: "#fff",
              borderRadius: "30px",
              boxShadow: "0 8px 32px rgba(0, 0, 0, 0.2)",
              border: "1px solid #e0e0e0ff",
              width: "80%",
              p: 1.5,
              zIndex: 1,
              //border: "1px solid red",
              position: "fixed",
              marginTop: "290px",
            }}
          >
            <TextField
              fullWidth
              placeholder="Employee Name or Employee Id"
              variant="standard"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              InputProps={{
                disableUnderline: true,
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: "#888", mr: 1 }} />
                  </InputAdornment>
                ),
              }}
              sx={{
                mx: 1,
                "& .MuiInputBase-input": {
                  fontSize: "16px",
                  padding: "8px 0",
                },
              }}
            />
          </Box>
        </Box>

        {/* Employees Card Section */}
        <Box sx={{ p: 4, pt: 7, height: "40vh", overflow: "auto" }}>
          <Grid
            container
            spacing={3}
            justifyContent="flex-start"
            sx={{ gap: 6 }}
          >
            {filteredEmployees.length > 0 ? (
              filteredEmployees.map((emp) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={emp.id}>
                  <Card
                    onClick={() => handleCardClick(emp.id)}
                    sx={{
                      borderRadius: "16px",
                      boxShadow: '2px 3px 1px -2px #ac8fff, 2px 2px 2px 0px rgba(0,0,0,0.14), 0px 1px 5px 0px rgba(0,0,0,0.12)',
                      width: "245px",
                      textAlign: "center",
                      transition: "transform 0.2s",
                      "&:hover": {
                        transform: "scale(1.03)",
                        cursor: "pointer",
                      },
                      backgroundColor: "#fff",
                    }}
                  >
                    <CardContent>
                      <Box
                        sx={{
                          width: 80,
                          height: 80,
                          borderRadius: "50%",
                          // overflow: "hidden",
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
                          onError={(e) => {
                            e.currentTarget.src = "/placeholder.jpg";
                          }}
                          alt={emp.name}
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
              <Typography variant="h6" sx={{ mt: 4 }}>
                No employees found.
              </Typography>
            )}
          </Grid>
        </Box>
      </Box>
    </Box>
  );
};

export default EmployeeData;
