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
import { GoArrowRight } from "react-icons/go";
import { AccountSelectionProps } from "../common/types";
import { accountTypes } from "../common/accountTypes";
import { LABELS, DIALOG_TEXTS } from "../common/labelConstants";

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
          {LABELS.PROCEED_BUTTON}{" "}
          <GoArrowRight style={{ fontSize: 21, marginLeft: 5 }} />
        </Button>
      </Paper>

      <Dialog
        open={openDialog}
        onClose={handleCancel}
        PaperProps={{
          sx: {
            borderRadius: 3,
          },
        }}
      >
        <DialogTitle sx={{ fontWeight: 600, textAlign: "center" }}>
          {DIALOG_TEXTS.CONFIRM_TITLE}
        </DialogTitle>
        <DialogContent sx={{ textAlign: "center" }}>
          {DIALOG_TEXTS.CONFIRM_MESSAGE}{" "}
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
            {DIALOG_TEXTS.CANCEL}
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
            {DIALOG_TEXTS.OK}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default AccountSelection;
