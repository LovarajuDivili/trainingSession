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
import LibraryBooksIcon from "@mui/icons-material/LibraryBooks";

interface DashboardHeaderProps {
  activeSection: string;
  searchQuery: string;
  setSearchQuery: (val: string) => void;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  activeSection,
  searchQuery,
  setSearchQuery,
}) => {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        px: 3,
        py: 2,
        background: "white",
        borderBottom: "1px solid #eee",
      }}
    >
      <Typography
        variant="h6"
        sx={{ display: "flex", alignItems: "center", gap: 1, fontWeight: 600 }}
      >
        <Box
          component="span"
          sx={{
            px: 2,
            py: 0.6,
            borderRadius: "50px",
            background: "#8e6bf9ff",
            color: "white",
            display: "flex",
            alignItems: "center",
            gap: 0.5,
          }}
        >
          <LibraryBooksIcon fontSize="small" /> LLM Garden
        </Box>
        - {activeSection}
      </Typography>

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
        >
          Add New <AddSharpIcon sx={{ ml: 0.5 }} />
        </Button>
      </Box>
    </Box>
  );
};

export default DashboardHeader;
