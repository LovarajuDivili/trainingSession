import React from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  InputAdornment,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import AddSharpIcon from "@mui/icons-material/AddSharp";
import ViewComfyIcon from "@mui/icons-material/ViewComfy";

interface DashboardHeaderProps {
  activeSection: string;
  searchQuery: string;
  setSearchQuery: (val: string) => void;
  onAddClick: () => void;
  viewMode: boolean;
  setViewMode: React.Dispatch<React.SetStateAction<boolean>>;
  filteredCount: number;
  isgrid: boolean;
}

const AdminHeader: React.FC<DashboardHeaderProps> = ({
  activeSection,
  searchQuery,
  setSearchQuery,
  onAddClick,
  filteredCount,
  setViewMode,
  viewMode,
  isgrid,
}) => {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        px: 3,
        py: 2,
        borderBottom: "1px solid #eee",
      }}
    >
      <Box
        sx={{
          display: "flex",
          gap: "10px",
        }}
      >
        <Box
          sx={{
            display: "flex",
            gap: 2,
            justifyItems: "center",
            alignItems: "center",
          }}
        >
          <Typography
            variant="h6"
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              fontWeight: 600,
            }}
          >
            {activeSection} ({filteredCount})
          </Typography>
          {isgrid === true ? (
            <Typography
              sx={{ cursor: "pointer" }}
              onClick={() => {
                setViewMode(!viewMode);
              }}
            >
              <ViewComfyIcon sx={{ mt: 1.2 }} />
            </Typography>
          ) : (
            <></>
          )}
        </Box>
      </Box>

      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        <TextField
          placeholder="Search"
          size="small"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          sx={{
            width: 280,
            "& .MuiOutlinedInput-root": {
              borderRadius: "50px",
              background: "#fafafa",
            },
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon fontSize="small" />
              </InputAdornment>
            ),
          }}
        />

        <Button
          variant="contained"
          sx={{
            textTransform: "none",
            bgcolor: "#906aff",
            "&:hover": { bgcolor: "#7a54f6" },
            borderRadius: "50px",
            px: 3,
            py: 1,
          }}
          onClick={onAddClick}
        >
          Add New <AddSharpIcon sx={{ ml: 0.5 }} />
        </Button>
      </Box>
    </Box>
  );
};

export default AdminHeader;
