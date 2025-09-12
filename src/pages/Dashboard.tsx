import React from "react";
import {
  Box,
  Container,
  Typography,
  TextField,
  InputAdornment,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Divider,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import Sidebar from "../components/Sidebar";
import LibraryBooksIcon from "@mui/icons-material/LibraryBooks";
import AddSharpIcon from "@mui/icons-material/AddSharp";

type DashboardProps = {
  accountType: string;
};

const rows = [
  {
    name: "Gpt-4-o3",
    url: "https://sasa-openai-d...",
    key: "FRRDTgtrZIF55xCg...",
    vendor: "Azure",
    model: "o3",
    output: 8,
    input: 2,
  },
  {
    name: "GPT-4o-55k",
    url: "https://sasa-openai-d...",
    key: "FRRDTgtrZIF55xCg...",
    vendor: "Azure",
    model: "gpt-4o",
    output: 4.5,
    input: 3.4,
  },
];

const Dashboard: React.FC<DashboardProps> = () => {
  return (
    <Box sx={{ display: "flex" }}>
      <Sidebar />
      <Box component="main" sx={{ flexGrow: 1, p: 2, marginTop: "56px" }}>
        <Container maxWidth="xl" disableGutters>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              mb: 2,
              gap: 2,
              background: "white",
              padding: 1.5,
            }}
          >
            <Typography
              variant="h6"
              sx={{ display: "flex", alignItems: "center", gap: 1 }}
            >
              <LibraryBooksIcon />
              LLM Garden
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <TextField
                placeholder="Search"
                size="small"
                sx={{
                  width: 320,
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "50px",
                  },
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Box
                        sx={{
                          bgcolor: "#e0e0e0",
                          p: 0.5,
                          borderRadius: "50%",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <SearchIcon fontSize="small" />
                      </Box>
                    </InputAdornment>
                  ),
                }}
              />
              <Button
                variant="contained"
                sx={{
                  textTransform: "none",
                  bgcolor: "#906aff",
                  "&:hover": { bgcolor: "#ac8fff" },
                  borderRadius: 5,
                  padding: 1,
                }}
              >
                Add New <AddSharpIcon />
              </Button>
            </Box>
          </Box>

          <Paper
            elevation={0}
            sx={{
              borderRadius: 2,
              overflow: "hidden",
              border: 1,
              borderColor: "divider",
              marginTop: 3,
            }}
          >
            <Box
              sx={{
                bgcolor: "#37424f",
                color: "white",
                px: 2,
                py: 1.5,
              }}
            >
              <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                My Large Language Models (LLM)
              </Typography>
            </Box>

            <TableContainer>
              <Table size="medium">
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 700, py: 2 }}>
                      MODEL NAME
                    </TableCell>
                    <TableCell sx={{ fontWeight: 700, py: 2 }}>URL</TableCell>
                    <TableCell sx={{ fontWeight: 700, py: 2 }}>KEY</TableCell>
                    <TableCell sx={{ fontWeight: 700, py: 2 }}>
                      VENDOR
                    </TableCell>
                    <TableCell sx={{ fontWeight: 700, py: 2 }}>MODEL</TableCell>
                    <TableCell sx={{ fontWeight: 700, py: 2 }}>
                      OUTPUT COST PER TOKEN
                    </TableCell>
                    <TableCell sx={{ fontWeight: 700, py: 2 }}>
                      INPUT COST PER TOKEN
                    </TableCell>
                    <TableCell sx={{ fontWeight: 700, py: 2 }}></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rows.map((r) => (
                    <TableRow key={r.name} hover>
                      <TableCell sx={{ py: 1.5 }}>
                        <Box
                          sx={{ display: "flex", alignItems: "center", gap: 1 }}
                        >
                          <Typography>{r.name}</Typography>
                          {r.name === "Gpt-4-o3" && (
                            <Box
                              sx={{
                                fontSize: 11,
                                px: 1,
                                py: 0.25,
                                bgcolor: "#e9ddff",
                                color: "#6f47ff",
                                borderRadius: 1,
                                fontWeight: 700,
                              }}
                            >
                              SET AS DEFAULT
                            </Box>
                          )}
                        </Box>
                      </TableCell>
                      <TableCell sx={{ py: 1.5 }}>{r.url}</TableCell>
                      <TableCell sx={{ py: 1.5 }}>{r.key}</TableCell>
                      <TableCell sx={{ py: 1.5 }}>
                        <Box
                          sx={{ display: "flex", alignItems: "center", gap: 1 }}
                        >
                          {r.vendor}
                        </Box>
                      </TableCell>
                      <TableCell sx={{ py: 1.5 }}>{r.model}</TableCell>
                      <TableCell sx={{ py: 1.5 }}>{r.output}</TableCell>
                      <TableCell sx={{ py: 1.5 }}>{r.input}</TableCell>
                      <TableCell align="right" sx={{ py: 1.5 }}>
                        ⋮
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            <Divider />
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                px: 2,
                py: 1.25,
              }}
            >
              <Typography variant="body2">Rows per page: 10</Typography>
              <Typography variant="body2">
                1–{rows.length} of {rows.length}
              </Typography>
            </Box>
          </Paper>
        </Container>
      </Box>
    </Box>
  );
};

export default Dashboard;
