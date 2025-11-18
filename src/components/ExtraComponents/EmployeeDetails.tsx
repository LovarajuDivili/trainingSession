import {
  Box,
  Typography,
  TextField,
  Grid,
  FormControl,
  Select,
  MenuItem,
  Button,
} from "@mui/material";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { useAppSelector } from "../../hooks/reduxHooks";
import { useEffect } from "react";
import { useThemeColors } from "../../hooks/useThemeColors";

const EmployeeDetails = () => {
  const { employeeId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const colors = useThemeColors();
  const employees = useAppSelector((state) => state.employees.employees);

  const employee = employees.find((emp) => emp.id === employeeId);

  useEffect(() => {
    if (!employee) {
      navigate("/accountant/employeedata");
    }
  }, [employee, navigate]);

  if (!employee) {
    return (
      <Box
        sx={{
          p: 3,
          backgroundColor: colors.background.white,
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Typography sx={{ color: colors.text.primary }}>
          Employee not found
        </Typography>
      </Box>
    );
  }

  const handleClose = () => {
    const fromRoute = location.state?.from || "/accountant/employeedata";
    navigate(fromRoute);
  };

  return (
    <Box
      sx={{
        p: 3,
        backgroundColor: colors.background.white,
        minHeight: "100vh",
        color: colors.text.primary,
      }}
    >
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderBottom: `1px solid ${colors.border.light}`,
          pb: 2,
          mb: 4,
        }}
      >
        <Typography
          variant="h4"
          fontWeight={600}
          sx={{ color: colors.text.primary }}
        >
          Employee Information
        </Typography>
        <Button
          onClick={handleClose}
          variant="contained"
          sx={{
            backgroundColor: colors.primary.main,
            color: colors.text.white,
            textTransform: "none",
            fontWeight: 600,
            borderRadius: "10px",
            px: 3,
            py: 1,
            boxShadow: `0 4px 12px ${colors.shadow.medium}`,
            "&:hover": {
              backgroundColor: colors.primary.dark,
              boxShadow: `0 6px 16px ${colors.shadow.dark}`,
            },
          }}
        >
          Close
        </Button>
      </Box>

      {/* Content Grid */}
      <Box sx={{ mx: "auto", maxWidth: 1200 }}>
        <Grid container spacing={5}>
          {/* Profile Image Section */}
          <Grid item xs={12} md={4}>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <Typography
                variant="subtitle1"
                fontWeight={600}
                gutterBottom
                sx={{ color: colors.text.primary, alignSelf: "flex-start" }}
              >
                Profile Image
              </Typography>
              <Box
                sx={{
                  width: 150,
                  height: 150,
                  borderRadius: "50%",
                  overflow: "hidden",
                  border: `2px solid ${colors.border.light}`,
                  backgroundColor: colors.background.lightGray,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: `0 4px 12px ${colors.shadow.light}`,
                }}
              >
                <Box
                  component="img"
                  src={
                    employee.image
                      ? `data:image/jpeg;base64,${employee.image}`
                      : "/placeholder.jpg"
                  }
                  onError={(e) => {
                    e.currentTarget.src = "/placeholder.jpg";
                  }}
                  alt={employee.name}
                  sx={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />
              </Box>
            </Box>
          </Grid>

          {/* Employee Details */}
          <Grid item xs={12} md={8}>
            <Grid container spacing={4}>
              {/* Employee Name */}
              <Grid item xs={12} sm={6}>
                <Typography
                  variant="subtitle1"
                  fontWeight={600}
                  gutterBottom
                  sx={{ color: colors.text.primary }}
                >
                  Employee Name
                </Typography>
                <TextField
                  fullWidth
                  value={employee.name}
                  placeholder="Enter employee name"
                  variant="outlined"
                  InputProps={{
                    readOnly: true,
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      backgroundColor: colors.background.lightGray,
                      "& fieldset": {
                        borderColor: colors.border.light,
                      },
                      "&:hover fieldset": {
                        borderColor: colors.primary.light,
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: colors.primary.main,
                      },
                    },
                    "& .MuiInputBase-input": {
                      color: colors.text.primary,
                      "&::placeholder": {
                        color: colors.text.secondary,
                      },
                    },
                  }}
                />
              </Grid>

              {/* Role */}
              <Grid item xs={12} sm={6}>
                <Typography
                  variant="subtitle1"
                  fontWeight={600}
                  gutterBottom
                  sx={{ color: colors.text.primary }}
                >
                  Role
                </Typography>
                <FormControl fullWidth>
                  <Select
                    value={employee.role}
                    displayEmpty
                    inputProps={{ readOnly: true }}
                    sx={{
                      backgroundColor: colors.background.lightGray,
                      "& .MuiOutlinedInput-notchedOutline": {
                        borderColor: colors.border.light,
                      },
                      "&:hover .MuiOutlinedInput-notchedOutline": {
                        borderColor: colors.primary.light,
                      },
                      "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                        borderColor: colors.primary.main,
                      },
                      "& .MuiSelect-select": {
                        color: colors.text.primary,
                      },
                    }}
                  >
                    <MenuItem value={employee.role}>{employee.role}</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              {/* Employee ID */}
              <Grid item xs={12} sm={6}>
                <Typography
                  variant="subtitle1"
                  fontWeight={600}
                  gutterBottom
                  sx={{ color: colors.text.primary }}
                >
                  Employee ID
                </Typography>
                <TextField
                  fullWidth
                  value={employee.id}
                  placeholder="Enter employee ID"
                  variant="outlined"
                  InputProps={{
                    readOnly: true,
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      backgroundColor: colors.background.lightGray,
                      "& fieldset": {
                        borderColor: colors.border.light,
                      },
                      "&:hover fieldset": {
                        borderColor: colors.primary.light,
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: colors.primary.main,
                      },
                    },
                    "& .MuiInputBase-input": {
                      color: colors.text.primary,
                      "&::placeholder": {
                        color: colors.text.secondary,
                      },
                    },
                  }}
                />
              </Grid>

              {/* Email */}
              <Grid item xs={12} sm={6}>
                <Typography
                  variant="subtitle1"
                  fontWeight={600}
                  gutterBottom
                  sx={{ color: colors.text.primary }}
                >
                  Email
                </Typography>
                <TextField
                  fullWidth
                  value={employee.email}
                  placeholder="Enter email"
                  variant="outlined"
                  InputProps={{
                    readOnly: true,
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      backgroundColor: colors.background.lightGray,
                      "& fieldset": {
                        borderColor: colors.border.light,
                      },
                      "&:hover fieldset": {
                        borderColor: colors.primary.light,
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: colors.primary.main,
                      },
                    },
                    "& .MuiInputBase-input": {
                      color: colors.text.primary,
                      "&::placeholder": {
                        color: colors.text.secondary,
                      },
                    },
                  }}
                />
              </Grid>

              {/* Join Date */}
              <Grid item xs={12} sm={6}>
                <Typography
                  variant="subtitle1"
                  fontWeight={600}
                  gutterBottom
                  sx={{ color: colors.text.primary }}
                >
                  Join Date
                </Typography>
                <TextField
                  fullWidth
                  value={
                    employee.joinDate
                      ? new Date(employee.joinDate).toLocaleDateString("en-GB")
                      : "dd-mm-yyyy"
                  }
                  placeholder="dd-mm-yyyy"
                  variant="outlined"
                  InputProps={{
                    readOnly: true,
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      backgroundColor: colors.background.lightGray,
                      "& fieldset": {
                        borderColor: colors.border.light,
                      },
                      "&:hover fieldset": {
                        borderColor: colors.primary.light,
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: colors.primary.main,
                      },
                    },
                    "& .MuiInputBase-input": {
                      color: colors.text.primary,
                      "&::placeholder": {
                        color: colors.text.secondary,
                      },
                    },
                  }}
                />
              </Grid>

              {/* Skills */}
              <Grid item xs={12}>
                <Typography
                  variant="subtitle1"
                  fontWeight={600}
                  gutterBottom
                  sx={{ color: colors.text.primary }}
                >
                  Skills
                </Typography>
                <Box
                  sx={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: 1,
                    p: 1,
                    backgroundColor: colors.background.lightGray,
                    borderRadius: 1,
                    minHeight: 60,
                    alignItems: "center",
                  }}
                >
                  {employee.skills && employee.skills.length > 0 ? (
                    employee.skills.map((each: string, index: number) => (
                      <Box
                        key={index}
                        sx={{
                          backgroundColor: colors.ui.chip.background,
                          color: colors.ui.chip.text,
                          padding: "6px 12px",
                          borderRadius: "6px",
                          fontSize: "14px",
                          fontWeight: 500,
                          border: `1px solid ${colors.ui.chip.border}`,
                        }}
                      >
                        {each}
                      </Box>
                    ))
                  ) : (
                    <Typography
                      variant="body2"
                      sx={{ color: colors.text.secondary, fontStyle: "italic" }}
                    >
                      No skills listed
                    </Typography>
                  )}
                </Box>
              </Grid>

              {/* Equipment Section */}
              <Grid item xs={12}>
                <Typography
                  variant="subtitle1"
                  fontWeight={600}
                  gutterBottom
                  sx={{ color: colors.text.primary }}
                >
                  Equipment Provided
                </Typography>
                <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
                  <Box
                    sx={{
                      px: 3,
                      py: 1.5,
                      backgroundColor: employee.laptop
                        ? colors.primary.main
                        : colors.background.lightGray,
                      color: employee.laptop
                        ? colors.text.white
                        : colors.text.secondary,
                      borderRadius: "8px",
                      border: employee.laptop
                        ? "none"
                        : `1px solid ${colors.border.light}`,
                      fontSize: "14px",
                      fontWeight: 500,
                      boxShadow: employee.laptop
                        ? `0 2px 8px ${colors.shadow.medium}`
                        : "none",
                      transition: "all 0.2s ease",
                    }}
                  >
                    Laptop
                  </Box>
                  <Box
                    sx={{
                      px: 3,
                      py: 1.5,
                      backgroundColor: employee.headphones
                        ? colors.primary.main
                        : colors.background.lightGray,
                      color: employee.headphones
                        ? colors.text.white
                        : colors.text.secondary,
                      borderRadius: "8px",
                      border: employee.headphones
                        ? "none"
                        : `1px solid ${colors.border.light}`,
                      fontSize: "14px",
                      fontWeight: 500,
                      boxShadow: employee.headphones
                        ? `0 2px 8px ${colors.shadow.medium}`
                        : "none",
                      transition: "all 0.2s ease",
                    }}
                  >
                    Headphones
                  </Box>
                  <Box
                    sx={{
                      px: 3,
                      py: 1.5,
                      backgroundColor: employee.monitor
                        ? colors.primary.main
                        : colors.background.lightGray,
                      color: employee.monitor
                        ? colors.text.white
                        : colors.text.secondary,
                      borderRadius: "8px",
                      border: employee.monitor
                        ? "none"
                        : `1px solid ${colors.border.light}`,
                      fontSize: "14px",
                      fontWeight: 500,
                      boxShadow: employee.monitor
                        ? `0 2px 8px ${colors.shadow.medium}`
                        : "none",
                      transition: "all 0.2s ease",
                    }}
                  >
                    Monitor
                  </Box>
                </Box>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default EmployeeDetails;
