import {
  Box,
  Typography,
  TextField,
  Button,
  InputAdornment,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import type { DashboardHeaderProps } from "../common/types";
import { useThemeColors } from "../hooks/useThemeColors";
import { useTheme } from "../context/ThemeContext";

const DashboardHeader = ({
  title,
  icon,
  count,
  showSearch = false,
  searchText = "",
  onSearchChange,
  showAddButton = false,
  onAddClick,
  addButtonLabel = "Add New",
  gridIcon,
}: DashboardHeaderProps) => {
  const colors = useThemeColors();
  const { themeMode } = useTheme(); // Add this import: import { useTheme } from "../context/ThemeContext";

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        mb: 2,
        p: 1,
        borderBottom: `1px solid ${colors.border.light}`,
        backgroundColor: colors.background.white,
        position: "sticky",
        top: 0,
        zIndex: 100,
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: "0px" }}>
        {icon && <Box sx={{ color: colors.text.primary }}>{icon}</Box>}
        <Typography variant="h5" sx={{ color: colors.text.primary }}>
          {title} {count !== undefined && `(${count})`}
        </Typography>

        {gridIcon && (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              color: colors.text.primary,
              fontSize: "m",
            }}
          >
            {gridIcon}
          </Box>
        )}
      </Box>

      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        {showSearch && (
          <TextField
            placeholder="Search"
            variant="outlined"
            size="small"
            sx={{
              width: "300px",
              "& .MuiOutlinedInput-root": {
                borderRadius: "50px",
                backgroundColor: colors.background.white,
                color: colors.text.primary,
                "& fieldset": {
                  borderColor:
                    themeMode === "dark" ? "#555555" : colors.border.light,
                },
                "&:hover fieldset": {
                  borderColor: colors.primary.main,
                },
                "&.Mui-focused fieldset": {
                  borderColor: colors.primary.main,
                },
              },
              "& .MuiInputBase-input::placeholder": {
                color: colors.text.secondary,
              },
            }}
            value={searchText}
            onChange={(e) => onSearchChange?.(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: colors.text.secondary }} />
                </InputAdornment>
              ),
            }}
          />
        )}

        {showAddButton && (
          <Button
            variant="contained"
            sx={{
              borderRadius: "20px",
              textTransform: "none",
              backgroundColor:
                themeMode === "dark" ? colors.text.white : colors.primary.main,
              color:
                themeMode === "dark" ? colors.primary.main : colors.text.white,
              fontWeight: 500,
              // "&:hover": {
              //   backgroundColor:
              //     themeMode === "dark"
              //       ? colors.state.hoverLight
              //       : colors.primary.dark,
              // },
            }}
            onClick={onAddClick}
            endIcon={<AddIcon />}
          >
            {addButtonLabel}
          </Button>
        )}
      </Box>
    </Box>
  );
};

export default DashboardHeader;
