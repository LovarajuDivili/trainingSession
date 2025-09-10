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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";

import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import SettingsIcon from "@mui/icons-material/Settings";
import CodeIcon from "@mui/icons-material/Code";
import BuildIcon from "@mui/icons-material/Build";
import TransformIcon from "@mui/icons-material/Transform";
import BugReportIcon from "@mui/icons-material/BugReport";
import { GoArrowRight } from "react-icons/go";

interface AccountSelectionProps {
  accountType: string;
  setAccountType: (type: string) => void;
}

const accountTypes = [
  {
    value: "Admin",
    label: "Admin",
    icon: <AdminPanelSettingsIcon sx={{ color: "#a084e8" }} />,
  },
  {
    value: "Technical",
    label: "Technical",
    icon: <SettingsIcon sx={{ color: "#5bc0f8" }} />,
  },
  {
    value: "Developer",
    label: "Developer",
    icon: <CodeIcon sx={{ color: "#00b894" }} />,
  },
  {
    value: "Functional",
    label: "Functional",
    icon: <BuildIcon sx={{ color: "#fd7e14" }} />,
  },
  {
    value: "Migrator",
    label: "Migrator",
    icon: <TransformIcon sx={{ color: "#ff6f61" }} />,
  },
  {
    value: "Tester",
    label: "Tester",
    icon: <BugReportIcon sx={{ color: "#ff9f1c" }} />,
  },
];

const AccountSelection: React.FC<AccountSelectionProps> = ({
  accountType,
  setAccountType,
}) => {
  const [openDialog, setOpenDialog] = useState(false);

  const handleChange = (event: SelectChangeEvent) => {
    setAccountType(event.target.value as string);
  };

  const handleProceed = () => {
    setOpenDialog(true);
  };

  const handleCancel = () => {
    setOpenDialog(false);
  };

  const handleConfirm = () => {
    setOpenDialog(false);
  };

  const selected = accountTypes.find((item) => item.value === accountType);
  return (
    <Container
      maxWidth="md"
      sx={{
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "center",
        mt: 15,
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
          Hello, welcome to{" "}
          <span style={{ color: "#906aff" }}>Cerebro SASA.</span>
        </Typography>

        <Typography variant="body1" sx={{ mb: 2 }}>
          Please select an account type to proceed !
        </Typography>

        <Typography
          variant="subtitle2"
          sx={{ textAlign: "left", fontWeight: 500, mb: 1, color: "#888" }}
        >
          Account Type
        </Typography>

        <FormControl fullWidth sx={{ mb: 3 }}>
          <Select
            value={accountType}
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
              "& .MuiOutlinedInput-notchedOutline": {
                border: "none",
              },
              "& .MuiSelect-icon": {
                color: "#906aff",
              },
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
            "&:hover": {
              bgcolor: "#ac8fff",
            },
          }}
          onClick={handleProceed}
        >
          Proceed <GoArrowRight style={{ fontSize: 21, marginLeft: 5 }} />
        </Button>
      </Paper>
      <Dialog
        open={openDialog}
        onClose={handleCancel}
        PaperProps={{
          sx: {
            position: "absolute",
            top: 20,
            m: 0,
          },
        }}
      >
        <DialogTitle sx={{ fontWeight: 600, textAlign: "center" }}>
          Confirm Proceed
        </DialogTitle>
        <DialogContent sx={{ textAlign: "center" }}>
          Are you sure you want to proceed as{" "}
          <span style={{ fontWeight: 600, color: "#906aff" }}>
            {accountType}
          </span>
          ?
        </DialogContent>
        <DialogActions sx={{ justifyContent: "center" }}>
          <Button
            onClick={handleCancel}
            sx={{ color: "#4b2db7", fontWeight: 600 }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirm}
            variant="contained"
            sx={{
              background: "linear-gradient(90deg, #906aff, #ac8fff)",
              color: "#fff",
              fontWeight: 600,
              "&:hover": { opacity: 0.9 },
            }}
          >
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default AccountSelection;
