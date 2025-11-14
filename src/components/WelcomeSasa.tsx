import { useState } from "react";
import { Box, Button, Typography } from "@mui/material";
import Header from "./Header";

import {
  Cerebro_Sasa,
  Proceed,
  Select_Account,
  Welcome_Msgs,
} from "../common/labelConstants";
import ArrowRightAltIcon from "@mui/icons-material/ArrowRightAlt";
import { useNavigate } from "react-router-dom";
import { roles } from "../common/utility";

const WelcomeSasa = () => {
  const [dropdownValue, setDropdownValue] = useState<string>("admin");
  const navigate = useNavigate();

  const handleProceed = () => {
    switch (dropdownValue) {
      case "admin":
        navigate("/admin");
        break;
      case "accountant":
        navigate("/accountant");
        break;
      case "developer":
        navigate("/developer");
        break;
      case "functional":
        navigate("/functional");
        break;
      case "migrator":
        navigate("/migrator");
        break;
      case "tester":
        navigate("/tester");
        break;
      case "hrteam":
        navigate("/hrteam");
        break;
      default:
        alert("Please select a valid role");
    }
    sessionStorage.setItem("role", dropdownValue);

    navigate(`/${dropdownValue}`);
  };

  return (
    <Box>
      <Header role={""} />
      <Box
        sx={{
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          mt: 25,
        }}
      >
        <Typography
          sx={{ marginLeft: "-4px", fontSize: "20px" }}
          variant="h6"
          gutterBottom
        >
          {Welcome_Msgs.WELCOME_MSG}
          <span style={{ color: "#906aff" }}>{Cerebro_Sasa.CEREBRO_SASA}</span>
        </Typography>
        <Typography
          sx={{ marginLeft: "-3px", fontSize: "15px" }}
          variant="body1"
          gutterBottom
        >
          {Select_Account.SELECT_ACCOUNT}
        </Typography>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 260px)",
            gap: 3,
            mt: 6,
          }}
        >
          {roles.map((role) => (
            <Box
              key={role.value}
              onClick={() => role.active && setDropdownValue(role.value)}
              sx={{
                height: "90px",
                borderRadius: "18px",
                cursor: role.active ? "pointer" : "not-allowed",
                border:
                  dropdownValue === role.value
                    ? "2px solid #906aff"
                    : "1px solid #dcdcdc",
                backgroundColor: role.active ? "#ffffff" : "#f0f0f0",
                opacity: role.active ? 1 : 0.6,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "20px",
                transition: "0.3s",
                "&:hover": {
                  boxShadow: role.active
                    ? "0px 0px 10px rgba(144, 106, 255, 0.4)"
                    : "none",
                },
              }}
            >
              {/* Left Side */}
              <Box>
                <Typography sx={{ fontWeight: "bold", fontSize: "16px" }}>
                  {role.label}
                </Typography>
                <Typography sx={{ fontSize: "13px", color: "#555" }}>
                  {role.description}
                </Typography>
              </Box>

              {/* Right Icon */}
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  
                }}
              >
                {role.icon}
              </Box>
            </Box>
          ))}
        </Box>

        <Button
          variant="contained"
          sx={{
            width: "250px",
            mt: 5,
            backgroundColor: dropdownValue ? "#906aff" : "#d2c7ff",
            color: "white",
            borderRadius: "20px",
          }}
          disabled={!dropdownValue}
          onClick={handleProceed}
        >
          {Proceed.PROCEED} <ArrowRightAltIcon />
        </Button>
      </Box>
    </Box>
  );
};

export default WelcomeSasa;
