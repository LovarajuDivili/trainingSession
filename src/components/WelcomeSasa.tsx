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
import { useThemeColors } from "../hooks/useThemeColors";

const WelcomeSasa = () => {
  const [dropdownValue, setDropdownValue] = useState<string>("admin");
  const navigate = useNavigate();
  const colors = useThemeColors();

  const handleProceed = () => {
    // Store role in sessionStorage
    sessionStorage.setItem("role", dropdownValue);
    // Navigate to the selected role's page
    navigate(`/${dropdownValue}`);
  };

  return (
    <Box
      sx={{
        minHeight: "70vh",
        backgroundColor: colors.background.white,
      }}
    >
      {/* Pass empty role to Header to indicate welcome page */}
      <Header role="" />
      <Box
        sx={{
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          mt: 25,
          backgroundColor: colors.background.white,
        }}
      >
        {/* Your existing WelcomeSasa content */}
        <Typography
          sx={{
            marginLeft: "-4px",
            fontSize: "20px",
            color: colors.text.primary,
          }}
          variant="h6"
          gutterBottom
        >
          {Welcome_Msgs.WELCOME_MSG}
          <span style={{ color: colors.primary.main }}>
            {Cerebro_Sasa.CEREBRO_SASA}
          </span>
        </Typography>

        <Typography
          sx={{
            marginLeft: "-3px",
            fontSize: "15px",
            color: colors.text.primary,
          }}
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
                    ? `2px solid ${colors.border.primary}`
                    : `1px solid ${colors.border.light}`,
                backgroundColor: role.active
                  ? colors.background.white
                  : colors.background.disabled,
                opacity: role.active ? 1 : 0.6,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "20px",
                position: "relative",
                transition: "0.3s",
                "&:hover": {
                  boxShadow: role.active
                    ? `0px 0px 10px ${colors.state.hover}`
                    : "none",
                },
              }}
            >
              {!role.active && (
                <Box
                  sx={{
                    position: "absolute",
                    top: "8px",
                    left: "15px",
                    backgroundColor: colors.primary.lighter,
                    color: colors.primary.main,
                    padding: "2px 10px",
                    fontSize: "12px",
                    borderRadius: "12px",
                    fontWeight: "600",
                    zIndex: 2,
                  }}
                >
                  Coming Soon
                </Box>
              )}

              <Box>
                <Typography
                  sx={{
                    fontWeight: "bold",
                    fontSize: "16px",
                    color: colors.text.primary, 
                  }}
                >
                  {role.label}
                </Typography>
                <Typography
                  sx={{
                    fontSize: "13px",
                    color: colors.text.secondary,
                  }}
                >
                  {role.description}
                </Typography>
              </Box>

              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: colors.text.primary, 
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
            height: "50px",
            width: "280px",
            mt: 5,
            backgroundColor: dropdownValue
              ? colors.primary.main
              : colors.primary.light,
            color: colors.text.white,
            borderRadius: "20px",
            "&:hover": {
              backgroundColor: dropdownValue
                ? colors.primary.dark
                : colors.primary.light,
            },
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