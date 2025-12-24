import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Avatar,
  InputBase,
  IconButton,
} from "@mui/material";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import { useLocation, useNavigate } from "react-router-dom";

const EmployeeSearch: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const params = new URLSearchParams(location.search);
  const filterRole = params.get("role") || "";

  const [employees, setEmployees] = useState<any[]>([]);
  const [search, setSearch] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetch("http://localhost:5000/api/employees", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setEmployees(data);
      })
      .catch((err) => console.log("Error loading employees:", err));
  }, []);

  const normalizedRole = filterRole.trim().toLowerCase();

  let list = employees.filter((emp) => {
    if (!emp.role) return false;
    return emp.role.trim().toLowerCase() === normalizedRole;
  });

  list = list.filter((emp) => {
    if (!search) return true;
    const s = search.toLowerCase();
    return (
      emp.name?.toLowerCase().includes(s) ||
      emp.id?.toLowerCase().includes(s)
    );
  });

  return (
    <Box sx={{ width: "100%", p: 0 }}>
      <Box
        sx={{
          width: "100vw",
          position: "relative",
          left: "50%",
          right: "50%",
          marginLeft: "-50vw",
          marginRight: "-50vw",

          height: "200px",
          background: "linear-gradient(90deg, #9c6bff, #b388ff)",
          borderRadius: "0 0 30px 30px",

          top: "-80px",
          paddingTop: "70px",

          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          color: "white",
          textAlign: "center",
        }}
      >

        <IconButton
          onClick={() => navigate(-1)}
          sx={{
            position: "absolute",
            top: "80px",           
            right: "40px",
            background: "white",   
            color: "#444",         
            width: "38px",
            height: "38px",
            borderRadius: "50%",
            boxShadow: "0px 4px 12px rgba(0,0,0,0.25)",
            zIndex: 2000,
            "&:hover": { background: "#f2f2f2" },
          }}
        >
          <ArrowBackIosNewIcon sx={{ fontSize: 16 }} />
        </IconButton>

        <Typography sx={{ fontSize: 26, fontWeight: 600 }}>
          {filterRole ? `${filterRole} Team` : "Employee Team"}
        </Typography>

        <Box
          sx={{
            width: "60%",
            mt: 2,
            background: "white",
            borderRadius: "30px",
            px: 3,
            py: 1.5,
            display: "flex",
            alignItems: "center",
            boxShadow: "0px 4px 12px rgba(0,0,0,0.15)",
          }}
        >
          <InputBase
            placeholder="Employee Name or Employee ID"
            fullWidth
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </Box>
      </Box>

      <Box sx={{ mt: "-20px", px: 5, pb: 5 }}>
        {list.length === 0 ? (
          <Typography sx={{ textAlign: "center", mt: 5, color: "#666" }}>
            No employees found
          </Typography>
        ) : (
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 3 }}>
            {list.map((emp) => {
              const storedImage = emp.id
                ? localStorage.getItem(`employee_image_${emp.id}`)
                : null;

              return (
                <Box
                  key={emp.id}
                  onClick={() =>
                    navigate(`/accountant/employeedetails?id=${emp.id}`)
                  }
                  sx={{
                    width: 260,
                    p: 3,
                    borderRadius: 3,
                    boxShadow: "0px 3px 10px rgba(0,0,0,0.10)",
                    textAlign: "center",
                    background: "white",
                    cursor: "pointer",
                    transition: "0.2s",
                    "&:hover": { transform: "scale(1.03)" },
                  }}
                >
                  <Avatar
                    src={storedImage || undefined}
                    sx={{
                      width: 70,
                      height: 70,
                      mx: "auto",
                      mb: 2,
                      bgcolor: "#9c6bff",
                    }}
                  />

                  <Typography fontWeight={700}>{emp.name}</Typography>

                  <Typography sx={{ mt: 1, fontSize: 14 }}>
                    <b>ID:</b> {emp.id}
                  </Typography>

                  <Typography sx={{ fontSize: 14 }}>
                    <b>Email:</b> {emp.email}
                  </Typography>

                  <Typography sx={{ fontSize: 14 }}>
                    <b>Join Date:</b>{" "}
                    {new Date(emp.joinDate).toLocaleDateString()}
                  </Typography>
                </Box>
              );
            })}
          </Box>
        )}
      </Box>

    </Box>
  );
};

export default EmployeeSearch;
