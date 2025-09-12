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
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import BuildIcon from "@mui/icons-material/Build";
import CodeIcon from "@mui/icons-material/Code";
import SettingsApplicationsIcon from "@mui/icons-material/SettingsApplications";
import SyncAltIcon from "@mui/icons-material/SyncAlt";
import BugReportIcon from "@mui/icons-material/BugReport";
import { Select_Account, Welcome_Msgs } from "../common/labelConstants";
import ArrowRightAltIcon from "@mui/icons-material/ArrowRightAlt";
import { useNavigate } from "react-router-dom";


// TODO- will do in further steps
// const dropDowns = [
//     {
//       label: "Admin",
//       icon: <AdminPanelSettingsIcon sx={{ color: "#1976d2" }} />,
//     },
//     {
//       label: "Technical",
//       icon: <AdminPanelSettingsIcon sx={{ color: "#1976d2" }} />,
//     },
//   ];

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
          <span style={{ color: "#906aff" }}>Cerebro SASA</span>
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
            <strong>Account Type</strong>
          </Typography>
          {/* {dropDowns?.map((each) => {
            <Box>
              <Typography>{each.label}</Typography>
            </Box>;
          })} */}

          <Select
            id="my-dropdown"
            value={dropdownValue}
            onChange={handleDropdownChange}
            displayEmpty
            sx={{
              borderRadius: "20px",
            }}
          >
            <MenuItem value="admin">
              <ListItemIcon>
                <AdminPanelSettingsIcon sx={{ color: "#1976d2" }} />{" "}
              </ListItemIcon>
              Admin
            </MenuItem>
            <MenuItem value="technical">
              <ListItemIcon>
                <BuildIcon sx={{ color: "#b9d219ff" }} />
              </ListItemIcon>
              Technical
            </MenuItem>
            <MenuItem value="developer">
              <ListItemIcon>
                <CodeIcon sx={{ color: "black" }} />
              </ListItemIcon>
              Developer
            </MenuItem>
            <MenuItem value="functional">
              <ListItemIcon>
                <SettingsApplicationsIcon sx={{ color: "#ffbeb5ff" }} />
              </ListItemIcon>
              Functional
            </MenuItem>
            <MenuItem value="migrator">
              <ListItemIcon>
                <SyncAltIcon sx={{ color: "#19d23eff" }} />
              </ListItemIcon>
              Migrator
            </MenuItem>
            <MenuItem value="tester">
              <ListItemIcon>
                <BugReportIcon sx={{ color: "#d21919ff" }} />
              </ListItemIcon>
              Tester
            </MenuItem>
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
          Proceed <ArrowRightAltIcon />
        </Button>
      </Box>
    </Box>
  );
};

export default WelcomeSasa;
