import { useState } from "react";
import {
  Box,
  FormControl,
  Select,
  MenuItem,
  Button,
  Typography,
  ListItemIcon,
} from "@mui/material";
import Header from "./Header";
import type { SelectChangeEvent } from "@mui/material";
import { Account_Type, Cerebro_Sasa, Proceed, Select_Account, Welcome_Msgs } from "../common/labelConstants";
import ArrowRightAltIcon from "@mui/icons-material/ArrowRightAlt";
import { useNavigate } from "react-router-dom";
import { roleDropdowns } from "../common/utility";


const WelcomeSasa = () => {
  const [dropdownValue, setDropdownValue] = useState<string>("admin");
  const navigate = useNavigate();

  const handleDropdownChange = (event: SelectChangeEvent) => {
    setDropdownValue(event.target.value);
  };
  const handleProceed = () => {
    switch (dropdownValue) {
      case "admin":
        navigate("/admin");
        break;
      case "technical":
        navigate("/technical");
        break;
      case "developer":
        navigate("/developer");
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
          sx={{ marginLeft: "-42px", fontSize: "14px" }}
          variant="h6"
          gutterBottom
        >
          {Welcome_Msgs.WELCOME_MSG}
          <span style={{ color: "#906aff" }}>{Cerebro_Sasa.CEREBRO_SASA}</span>
        </Typography>
        <Typography
          sx={{ marginLeft: "-3px", fontSize: "13px" }}
          variant="body1"
          gutterBottom
        >
          {Select_Account.SELECT_ACCOUNT}
        </Typography>

        <FormControl sx={{ width: "250px", mt: 2 }}>
          <Typography
            variant="subtitle1"
            sx={{ mb: 1, fontSize: "13px", marginLeft: "0px" }}
          >
            <strong>{Account_Type.ACCOUNT_TYPE}</strong>
          </Typography>

          <Select
            id="my-dropdown"
            value={dropdownValue}
            onChange={handleDropdownChange}
            displayEmpty
            sx={{
              borderRadius: "20px",
            }}
          >
            {roleDropdowns.map((item) => (
              <MenuItem key={item.value} value={item.value}>
                <ListItemIcon>{item.icon}</ListItemIcon>
                {item.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Button
          variant="contained"
          color="primary"
          sx={{
            width: "250px !important",
            mt: 3,
            backgroundColor: "#906aff !important",
            borderRadius: "19px",
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
