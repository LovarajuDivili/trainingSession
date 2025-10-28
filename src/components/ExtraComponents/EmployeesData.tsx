/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Box,
  Typography,
  TextField,
  Button,
  InputAdornment,
  Grid,
  Card,
  CardContent,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../hooks/reduxHooks";
import { fetchEmployees } from "../../store/EmployeesSlice";
import Header from "../../components/Header"; // ✅ added header import

const EmployeeData = () => {
  const dispatch = useAppDispatch();
  const employees = useAppSelector((state) => state.employees.employees);
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    dispatch(fetchEmployees());
  }, [dispatch]);

  // Filter employees based on search input
  const filteredEmployees = employees.filter(
    (emp) =>
      emp.name.toLowerCase().includes(searchText.toLowerCase()) ||
      emp.id.toLowerCase().includes(searchText.toLowerCase()) ||
      emp.role.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <Box sx={{ minHeight: "70vh", backgroundColor: "white" }}>
      <Header role={""} />

      <Box sx={{ mt: 6 }}>
        {/* Header Section */}
        <Box
          sx={{
            width: "100%",
            height: 300,
            background: "#ac8fff",
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
            {[1, 2, 3, 4, 5, 6].map((num) => (
              <Box
                key={num}
                component="img"
                src={`https://randomuser.me/api/portraits/men/${num}.jpg`}
                alt="user"
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
              boxShadow: 3,
              width: { xs: "90%", sm: "70%", md: "50%" },
              p: 1,
              zIndex: 1,
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
                    <SearchIcon sx={{ color: "#888" }} />
                  </InputAdornment>
                ),
              }}
              sx={{ mx: 1 }}
            />

            <Button
              variant="contained"
              sx={{
                borderRadius: "50%",
                minWidth: 40,
                backgroundColor: "#4caf50",
                "&:hover": { backgroundColor: "#43a047" },
              }}
            >
              <SearchIcon />
            </Button>
          </Box>
        </Box>

        {/* Employees Card Section */}
        <Box sx={{ p: 4 }}>
          <Grid container spacing={3} justifyContent="center">
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
                    }}
                  >
                    <CardContent>
                      {/* Employee Profile Image */}
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
                            (emp as any).image ||
                            (emp as any).photo ||
                            `https://randomuser.me/api/portraits/men/${Math.floor(
                              Math.random() * 80
                            )}.jpg`
                          }
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
                        <strong>Joined:</strong>{" "}
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
