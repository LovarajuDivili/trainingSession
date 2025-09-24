import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  Typography,
  TextField,
  Button,
  Stack,
  Box,
  Chip,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

interface AddEmployeeProps {
  openDialog: boolean;
  setOpenDialog: React.Dispatch<React.SetStateAction<boolean>>;
  onSave: (employee: Omit<Employee, "id">) => void;
}

interface Employee {
  name: string;
  email: string;
  role: string;
  joinDate: string;
  skills: string[];
}

const AddEmployee: React.FC<AddEmployeeProps> = ({
  openDialog,
  setOpenDialog,
  onSave,
}) => {
  const [newEmployee, setNewEmployee] = useState<Employee>({
    name: "",
    email: "",
    role: "",
    joinDate: "",
    skills: [],
  });

  const [skillInput, setSkillInput] = useState("");

  const handleAddSkill = () => {
    if (skillInput.trim()) {
      setNewEmployee((prev) => ({
        ...prev,
        skills: [...prev.skills, skillInput.trim()],
      }));
      setSkillInput("");
    }
  };

  const handleRemoveSkill = (skill: string) => {
    setNewEmployee((prev) => ({
      ...prev,
      skills: prev.skills.filter((s) => s !== skill),
    }));
  };

  const isFormValid =
    newEmployee.name.trim() !== "" &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newEmployee.email);

  const handleSave = () => {
    onSave(newEmployee);
    setNewEmployee({ name: "", email: "", role: "", joinDate: "", skills: [] });
    setSkillInput("");
    setOpenDialog(false);
  };

  const inputStyle = {
    "& .MuiOutlinedInput-root": {
      borderRadius: "27px",
      minHeight: 55,
    },
  };

  const labelStyle = { fontWeight: 500, marginBottom: 4, display: "block" };

  return (
    <Dialog open={openDialog} maxWidth="md" fullWidth>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          p: 2,
          borderBottom: 1,
          borderColor: "divider",
        }}
      >
        <Typography variant="h6">Add New Employee</Typography>
        <Stack direction="row" spacing={1}>
          <Button variant="outlined" onClick={() => setOpenDialog(false)}>
            Close
          </Button>
          <Button
            variant="contained"
            onClick={handleSave}
            disabled={!isFormValid}
          >
            Save
          </Button>
        </Stack>
      </Box>

      <DialogContent dividers sx={{ minHeight: 300 }}>
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
          <Box sx={{ flex: "1 1 45%" }}>
            <label style={labelStyle}>Name</label>
            <TextField
              fullWidth
              size="small"
              placeholder="Enter name"
              value={newEmployee.name}
              onChange={(e) =>
                setNewEmployee({ ...newEmployee, name: e.target.value })
              }
              sx={inputStyle}
            />
          </Box>

          <Box sx={{ flex: "1 1 45%" }}>
            <label style={labelStyle}>Email</label>
            <TextField
              fullWidth
              size="small"
              type="email"
              placeholder="Enter email"
              value={newEmployee.email}
              required
              onChange={(e) =>
                setNewEmployee({ ...newEmployee, email: e.target.value })
              }
              error={
                newEmployee.email.trim() === "" ||
                !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newEmployee.email)
              }
              helperText={
                newEmployee.email.trim() === ""
                  ? "Email is required"
                  : !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newEmployee.email)
                  ? "Enter a valid email address"
                  : ""
              }
              sx={inputStyle}
            />
          </Box>

          <Box sx={{ flex: "1 1 45%" }}>
            <label style={labelStyle}>Role</label>
            <TextField
              fullWidth
              size="small"
              placeholder="Enter role"
              value={newEmployee.role}
              onChange={(e) =>
                setNewEmployee({ ...newEmployee, role: e.target.value })
              }
              sx={inputStyle}
            />
          </Box>

          <Box sx={{ flex: "1 1 45%" }}>
            <label style={labelStyle}>Join Date</label>
            <TextField
              fullWidth
              size="small"
              type="date"
              InputLabelProps={{ shrink: true }}
              value={newEmployee.joinDate}
              onChange={(e) =>
                setNewEmployee({ ...newEmployee, joinDate: e.target.value })
              }
              sx={inputStyle}
            />
          </Box>

          <Box sx={{ flex: "1 1 100%" }}>
            <label style={labelStyle}>Add Skill</label>
            <TextField
              fullWidth
              size="small"
              placeholder="Enter skill and press Enter"
              value={skillInput}
              onChange={(e) => setSkillInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleAddSkill();
                }
              }}
              sx={inputStyle}
            />
            <Box mt={1} sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
              {newEmployee.skills.map((skill, index) => (
                <Chip
                  key={index}
                  label={skill}
                  onDelete={() => handleRemoveSkill(skill)}
                  deleteIcon={<CloseIcon />}
                  color="primary"
                  variant="outlined"
                />
              ))}
            </Box>
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default AddEmployee;
