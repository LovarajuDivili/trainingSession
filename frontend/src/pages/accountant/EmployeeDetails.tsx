import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Avatar,
  TextField,
  Chip,
  Button,
} from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";

const EmployeeDetails: React.FC = () => {
  const location = useLocation();
  const nav = useNavigate();

  const params = new URLSearchParams(location.search);
  const empId = params.get("id");

  const [employee, setEmployee] = useState<any>(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!empId) return;

    fetch(`http://localhost:5000/api/employees/${empId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setEmployee(data))
      .catch((err) => console.log("Error:", err));
  }, [empId]);

  if (!employee) {
    return (
      <Typography sx={{ mt: 10, textAlign: "center" }}>
        Loading employee info...
      </Typography>
    );
  }

  const storedImage = localStorage.getItem(`employee_image_${employee.id}`);

  const darkInput = {
    color: "#333",
    fontWeight: 500,
  };

  return (
    <Box sx={{ p: 4 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Typography sx={{ fontSize: 24, fontWeight: 600 }}>
          Employee Information
        </Typography>

        <Button
          variant="contained"
          onClick={() => nav(-1)}
          sx={{
            background: "#9c6bff",
            textTransform: "none",
            borderRadius: "20px",
            px: 3,
            '&:hover':{ backgroundColor: '#906aff'}
          }}
        >
          Close
        </Button>
      </Box>

      <Box sx={{ borderBottom: "1px solid #ddd", mb: 3 }} />
      <Box sx={{ display: "flex", alignItems: "center", gap: 4 }}>
        <Box sx={{ ml: 8}}>
          <Typography sx={{ fontSize: 16, mb: 1 }}>Profile Image</Typography>
          <Avatar
            src={storedImage ?? undefined}
            sx={{ width: 140, height: 140, bgcolor: "#9c6bff" }}
          />
        </Box>

        <Box sx={{ width: "100%", display: "flex", flexWrap: "wrap", gap: 3 }}>
          
          <Box sx={{ flex: 1, minWidth: "220px" }}>
            <Typography sx={{ fontSize: 14 }}>Employee Name</Typography>
            <TextField
              fullWidth
              value={employee.name}
              disabled
              InputProps={{ style: darkInput }}
            />
          </Box>

          <Box sx={{ flex: 1, minWidth: "220px" }}>
            <Typography sx={{ fontSize: 14 }}>Role</Typography>
            <TextField
              fullWidth
              value={employee.role}
              disabled
              InputProps={{ style: darkInput }}
            />
          </Box>

          <Box sx={{ flex: 1, minWidth: "220px" }}>
            <Typography sx={{ fontSize: 14 }}>Employee ID</Typography>
            <TextField
              fullWidth
              value={employee.id}
              disabled
              InputProps={{ style: darkInput }}
            />
          </Box>

          <Box sx={{ flex: 1, minWidth: "220px" }}>
            <Typography sx={{ fontSize: 14 }}>Email</Typography>
            <TextField
              fullWidth
              value={employee.email}
              disabled
              InputProps={{ style: darkInput }}
            />
          </Box>

          <Box sx={{ flex: 1, minWidth: "220px" }}>
            <Typography sx={{ fontSize: 14 }}>Join Date</Typography>
            <TextField
              fullWidth
              value={new Date(employee.joinDate).toLocaleDateString()}
              disabled
              InputProps={{ style: darkInput }}
            />
          </Box>

          <Box sx={{ flex: 1, minWidth: "220px" }}>
            <Typography sx={{ fontSize: 14 }}>Project Name</Typography>
            <TextField
              fullWidth
              value={employee.projectName || "—"}
              disabled
              InputProps={{ style: darkInput }}
            />
          </Box>
        </Box>
      </Box>
      <Box sx={{ mt: 4 }}>
        <Typography sx={{ fontSize: 14, fontWeight: 600, mb: 1 }}>
          Skills
        </Typography>

        <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
          {(employee.skills || []).length > 0 ? (
            employee.skills.map((skill: string) => (
              <Chip
                key={skill}
                label={skill}
                sx={{
                  backgroundColor: "#E5D4FF",
                  color: "#000",
                  fontSize: 14,       
                  fontWeight: 500,
                  borderRadius: "18px",
                  px: 1.5,
                }}
              />
            ))
          ) : (
            <Typography sx={{ opacity: 0.7 }}>No skills listed</Typography>
          )}
        </Box>
      </Box>

    </Box>
  );
};

export default EmployeeDetails;
