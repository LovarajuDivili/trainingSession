import {
  Box,
  Typography,
  IconButton,
  TextField,
  Grid,
  FormControl,
  Select,
  MenuItem,
  Button,
} from "@mui/material";
//import CloseIcon from "@mui/icons-material/Close";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { useAppSelector } from "../../hooks/reduxHooks";
import { useEffect } from "react";

const EmployeeDetails = () => {
  const { employeeId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const employees = useAppSelector((state) => state.employees.employees);

  const employee = employees.find((emp) => emp.id === employeeId);

  useEffect(() => {
    if (!employee) {
      navigate("/accountant/employeedata");
    }
  }, [employee, navigate]);

  if (!employee) {
    return <Typography>Employee not found</Typography>;
  }

  const handleClose = () => {
    const fromRoute = location.state?.from || "/accountant/employeedata";
    navigate(fromRoute);
  };

  return (
    <Box sx={{ p: 3, backgroundColor: "white", minHeight: "100vh" }}>
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderBottom: "1px solid #e0e0e0",
          pb: 2,
          mb: 4,
        }}
      >
        <Typography variant="h4" fontWeight={600}>
          Employee Information
        </Typography>
        <IconButton
          onClick={handleClose}
          sx={{
            color: "#000",
            "&:hover": {
              backgroundColor: "rgba(0, 0, 0, 0.04)",
            },
          }}
        >
          <Button
            variant="contained"
            sx={{
              backgroundColor: "#906aff",
              color: "white",
              textTransform: "none",
              fontWeight: 600,
              borderRadius: "10px",
              px: 3,
              py: 1,
              boxShadow: "0 3px 6px rgba(0,0,0,0.15)",
              "&:hover": {
                backgroundColor: "red",
                boxShadow: "0 4px 10px rgba(0,0,0,0.25)",
              },
            }}
          >
            Close
          </Button>
        </IconButton>
      </Box>
      {/* Profile Image Section */}
      <Grid item xs={12}>
        <Typography variant="subtitle1" fontWeight={600} gutterBottom>
          Profile Image
        </Typography>
        <Box
          sx={{
            width: 150,
            height: 150,
            borderRadius: "50%",
            overflow: "hidden",
            border: "2px solid #e0e0e0",
            backgroundColor: "#fafafa",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Box
            component="img"
            src={
              typeof employee.image === "string"
                ? employee.image.startsWith("http")
                  ? employee.image
                  : employee.image
                : employee.image
                ? URL.createObjectURL(employee.image as File)
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
      </Grid>
      <Box sx={{ mx: "auto" }}>
        <Grid container spacing={5}>
          {/* Employee Name */}
          <Grid item xs={12}>
            <Typography variant="subtitle1" fontWeight={600} gutterBottom>
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
                width: "320px",
                "& .MuiOutlinedInput-root": {
                  backgroundColor: "#fafafa",
                  "& fieldset": {
                    borderColor: "#e0e0e0",
                  },
                  "&:hover fieldset": {
                    borderColor: "#e0e0e0",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#e0e0e0",
                  },
                },
                "& .MuiInputBase-input": {
                  color: "text.primary",
                },
              }}
            />
          </Grid>

          {/* Role */}
          <Grid item xs={12}>
            <Typography variant="subtitle1" fontWeight={600} gutterBottom>
              Role
            </Typography>
            <FormControl fullWidth>
              <Select
                value={employee.role}
                displayEmpty
                inputProps={{ readOnly: true }}
                sx={{
                  backgroundColor: "#fafafa",
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#e0e0e0",
                  },
                  "&:hover .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#e0e0e0",
                  },
                  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#e0e0e0",
                  },
                  "& .MuiSelect-select": {
                    color: "text.primary",
                  },
                  width: "320px",
                }}
              >
                <MenuItem value={employee.role}>{employee.role}</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          {/* Employee ID */}
          <Grid item xs={12}>
            <Typography variant="subtitle1" fontWeight={600} gutterBottom>
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
                  backgroundColor: "#fafafa",
                  "& fieldset": {
                    borderColor: "#e0e0e0",
                  },
                  "&:hover fieldset": {
                    borderColor: "#e0e0e0",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#e0e0e0",
                  },
                },
                "& .MuiInputBase-input": {
                  color: "text.primary",
                },
                width: "320px",
              }}
            />
          </Grid>

          {/* Email */}
          <Grid item xs={12}>
            <Typography variant="subtitle1" fontWeight={600} gutterBottom>
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
                  backgroundColor: "#fafafa",
                  "& fieldset": {
                    borderColor: "#e0e0e0",
                  },
                  "&:hover fieldset": {
                    borderColor: "#e0e0e0",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#e0e0e0",
                  },
                },
                "& .MuiInputBase-input": {
                  color: "text.primary",
                },
                width: "320px",
              }}
            />
          </Grid>

          {/* Join Date */}
          <Grid item xs={12}>
            <Typography variant="subtitle1" fontWeight={600} gutterBottom>
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
                  backgroundColor: "#fafafa",
                  "& fieldset": {
                    borderColor: "#e0e0e0",
                  },
                  "&:hover fieldset": {
                    borderColor: "#e0e0e0",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#e0e0e0",
                  },
                },
                "& .MuiInputBase-input": {
                  color: "text.primary",
                },
                width: "320px",
              }}
            />
          </Grid>

          {/* Skills */}
          <Grid item xs={12}>
            <Typography variant="subtitle1" fontWeight={600} gutterBottom>
              Skills
            </Typography>
            <Box
              sx={{ display: "flex", flexWrap: "wrap", gap: 1, width: "320px" }}
            >
              {employee.skills && employee.skills.length > 0 ? (
                employee.skills.map((each: string, index: number) => (
                  <button
                    key={index}
                    style={{
                      margin: "5px",
                      backgroundColor: "#906aff",
                      color: "white",
                      padding: "6px 10px",
                      border: "none",
                      borderRadius: "6px",
                      cursor: "default",
                      fontSize: "14px",
                      fontWeight: 500,
                      height: "40px",
                    }}
                  >
                    {each}
                  </button>
                ))
              ) : (
                <Typography variant="body2" color="text.secondary">
                  No skills listed
                </Typography>
              )}
            </Box>
          </Grid>

          {/* Equipment Section */}
          <Grid item xs={12}>
            <Typography variant="subtitle1" fontWeight={600} gutterBottom>
              Equipment Provided
            </Typography>
            <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
              <Box
                sx={{
                  px: 3,
                  py: 1.5,
                  backgroundColor: employee.laptop ? "#906aff" : "#f5f5f5",
                  color: employee.laptop ? "white" : "text.secondary",
                  borderRadius: "8px",
                  border: employee.laptop ? "none" : "1px solid #e0e0e0",
                  fontSize: "14px",
                  fontWeight: 500,
                }}
              >
                Laptop
              </Box>
              <Box
                sx={{
                  px: 3,
                  py: 1.5,
                  backgroundColor: employee.headphones ? "#906aff" : "#f5f5f5",
                  color: employee.headphones ? "white" : "text.secondary",
                  borderRadius: "8px",
                  border: employee.headphones ? "none" : "1px solid #e0e0e0",
                  fontSize: "14px",
                  fontWeight: 500,
                }}
              >
                Headphones
              </Box>
              <Box
                sx={{
                  px: 3,
                  py: 1.5,
                  backgroundColor: employee.monitor ? "#906aff" : "#f5f5f5",
                  color: employee.monitor ? "white" : "text.secondary",
                  borderRadius: "8px",
                  border: employee.monitor ? "none" : "1px solid #e0e0e0",
                  fontSize: "14px",
                  fontWeight: 500,
                }}
              >
                Monitor
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default EmployeeDetails;
