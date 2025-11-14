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
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        mb: 2,
        p: 1,
        borderBottom: "1px solid #ddd",
        backgroundColor: "#fff",
        position: "sticky",
        top: 0,
        zIndex: 100,
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: "0px" }}>
        {icon && <Box sx={{ color: "black" }}>{icon}</Box>}
        <Typography variant="h5">
          {title} {count !== undefined && `(${count})`}
        </Typography>

        {gridIcon && (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              color: "black",
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
              },
            }}
            value={searchText}
            onChange={(e) => onSearchChange?.(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
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
              backgroundColor: "#906aff",
              color: "white",
              fontWeight: 500,
              "&:hover": { backgroundColor: "#7a55d8" },
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
