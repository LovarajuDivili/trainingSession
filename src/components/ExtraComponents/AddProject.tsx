import { Box, Typography, TextField, Button } from "@mui/material";

const AddProject = () => {
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        Add New Project
      </Typography>

      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 2,
          mt: 2,
          maxWidth: 500,
        }}
      >
        <TextField label="Project Name" fullWidth />
        <TextField label="Project Owner" fullWidth />
        <TextField label="Jira ID" fullWidth />
        <TextField label="Status" fullWidth />
        <TextField
          type="date"
          label="Start Date"
          InputLabelProps={{ shrink: true }}
          fullWidth
        />
        <TextField
          type="date"
          label="End Date"
          InputLabelProps={{ shrink: true }}
          fullWidth
        />

        <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
          <Button variant="contained" color="primary">
            Save
          </Button>
          <Button variant="outlined" color="secondary">
            Cancel
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default AddProject;
