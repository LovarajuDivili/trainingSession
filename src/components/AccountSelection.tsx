import React, { useState } from "react";
import {
  Container,
  Paper,
  Typography,
  FormControl,
  SelectChangeEvent,
  Select,
  MenuItem,
  Button,
  ListItemIcon,
  ListItemText,
  Box,
} from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { GoArrowRight } from "react-icons/go";
import { AccountSelectionProps } from "../common/types";
import { accountTypes } from "../common/accountTypes";
import { LABELS } from "../common/labelConstants";
import { useNavigate } from "react-router-dom";

const AccountSelection: React.FC<AccountSelectionProps> = ({
  setAccountType,
}) => {
  const [selectedAccount, setSelectedAccount] = useState<string>("Admin"); // initial Admin
  const navigate = useNavigate();

  const handleChange = (event: SelectChangeEvent) => {
    setSelectedAccount(event.target.value as string);
  };

  const handleProceed = () => {
    setAccountType(selectedAccount);
    navigate("/dashboard");
  };

  const selected = accountTypes.find((item) => item.value === selectedAccount);

  return (
    <Container
      maxWidth="md"
      sx={{
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "center",
        mt: 25,
      }}
    >
      <Paper
        elevation={4}
        sx={{
          p: 6,
          borderRadius: 4,
          textAlign: "center",
          width: "100%",
          maxWidth: 500,
        }}
      >
        <Typography variant="h5" sx={{ fontWeight: 600, mb: 2 }}>
          {LABELS.WELCOME_TITLE}{" "}
          <span style={{ color: "#906aff" }}>{LABELS.APP_NAME}</span>
        </Typography>

        <Typography variant="body1" sx={{ mb: 2 }}>
          {LABELS.SELECT_ACCOUNT}
        </Typography>

        <Typography
          variant="subtitle2"
          sx={{ textAlign: "left", fontWeight: 500, mb: 1, color: "#888" }}
        >
          {LABELS.ACCOUNT_TYPE}
        </Typography>

        <FormControl fullWidth sx={{ mb: 3 }}>
          <Select
            value={selectedAccount}
            onChange={handleChange}
            displayEmpty
            IconComponent={KeyboardArrowDownIcon}
            renderValue={() => (
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                {selected?.icon}
                <span>{selected?.label}</span>
              </Box>
            )}
            sx={{
              borderRadius: 3,
              bgcolor: "#f1ecff",
              py: 0.5,
              px: 1.5,
              "& .MuiOutlinedInput-notchedOutline": { border: "none" },
              "& .MuiSelect-icon": { color: "#906aff" },
            }}
          >
            {accountTypes.map((item) => (
              <MenuItem key={item.value} value={item.value}>
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.label} />
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Button
          variant="contained"
          fullWidth
          sx={{
            bgcolor: "#906aff",
            color: "#fff",
            fontWeight: 600,
            borderRadius: 3,
            py: 1.5,
            "&:hover": { bgcolor: "#ac8fff" },
          }}
          onClick={handleProceed}
        >
          {LABELS.PROCEED_BUTTON}{" "}
          <GoArrowRight style={{ fontSize: 21, marginLeft: 5 }} />
        </Button>
      </Paper>
    </Container>
  );
};

export default AccountSelection;
