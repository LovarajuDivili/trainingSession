import React from "react";
import {
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Paper,
} from "@mui/material";
import CloudIcon from "@mui/icons-material/Cloud";

interface LLMModel {
  modelName: string;
  url: string;
  key: string;
  vendor: string;
  model: string;
  outputCostPerToken: number;
  inputCostPerToken: number;
  isDefault?: boolean;
}

const llmModels: LLMModel[] = [
  {
    modelName: "Gpt-4-o3",
    url: "https://sasa-openai-demo-url-1.com",
    key: "FRRDTgtrZIF55xCg...",
    vendor: "Cloud",
    model: "o3",
    outputCostPerToken: 8,
    inputCostPerToken: 2,
    isDefault: true,
  },
  {
    modelName: "GPT-4o-55k",
    url: "https://sasa-openai-demo-url-2.com",
    key: "FRRDTgtrZIF55xCg...",
    vendor: "Cloud",
    model: "gpt-4o",
    outputCostPerToken: 4.5,
    inputCostPerToken: 3.4,
  },
];

const LLMGarden: React.FC = () => {
  return (
    <Box>
      <Typography
        variant="h6"
        sx={{
          mb: 2,
          fontWeight: "600",
          bgcolor: "#2e3b55",
          color: "#fff",
          p: 1.5,
          borderRadius: 1,
        }}
      >
        My Large Language Models (LLM) ({llmModels.length})
      </Typography>

      <TableContainer component={Paper} elevation={0}>
        <Table size="small">
          <TableHead>
            <TableRow
              sx={{
                backgroundColor: "#f5f7fb",
              }}
            >
              <TableCell sx={{ fontWeight: "bold", fontSize: 13 }}>MODEL NAME</TableCell>
              <TableCell sx={{ fontWeight: "bold", fontSize: 13 }}>URL</TableCell>
              <TableCell sx={{ fontWeight: "bold", fontSize: 13 }}>KEY</TableCell>
              <TableCell sx={{ fontWeight: "bold", fontSize: 13 }}>VENDOR</TableCell>
              <TableCell sx={{ fontWeight: "bold", fontSize: 13 }}>MODEL</TableCell>
              <TableCell sx={{ fontWeight: "bold", fontSize: 13, textAlign: "center" }}>
                OUTPUT COST PER TOKEN
              </TableCell>
              <TableCell sx={{ fontWeight: "bold", fontSize: 13, textAlign: "center" }}>
                INPUT COST PER TOKEN
              </TableCell>
              <TableCell />
            </TableRow>
          </TableHead>

          <TableBody>
            {llmModels.map((model) => (
              <TableRow key={model.modelName} hover>
                <TableCell>{model.modelName}</TableCell>
                <TableCell
                  sx={{
                    maxWidth: 160,
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {model.url}
                </TableCell>
                <TableCell
                  sx={{
                    maxWidth: 140,
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {model.key}
                </TableCell>
                <TableCell sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                  <CloudIcon color="primary" />
                  {model.vendor}
                </TableCell>
                <TableCell>{model.model}</TableCell>
                <TableCell sx={{ textAlign: "center" }}>{model.outputCostPerToken}</TableCell>
                <TableCell sx={{ textAlign: "center" }}>{model.inputCostPerToken}</TableCell>
                <TableCell>
                  {model.isDefault ? (
                    <Button
                      variant="contained"
                      size="small"
                      sx={{
                        bgcolor: "#007bff",
                        color: "#fff",
                        textTransform: "none",
                        borderRadius: 2,
                        fontWeight: "600",
                        "&:hover": {
                          bgcolor: "#0056b3",
                        },
                      }}
                      disabled
                    >
                      SET AS DEFAULT
                    </Button>
                  ) : (
                    <Button
                      variant="outlined"
                      size="small"
                      sx={{
                        textTransform: "none",
                        borderRadius: 2,
                        fontWeight: "600",
                      }}
                    >
                      SET AS DEFAULT
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default LLMGarden;
