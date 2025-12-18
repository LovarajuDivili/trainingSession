import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  Typography,
  TextField,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  IconButton,
  MenuItem,
  ListItemIcon,
  Avatar,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import CodeIcon from "@mui/icons-material/Code";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import BugReportIcon from "@mui/icons-material/BugReport";
import PeopleIcon from "@mui/icons-material/People";
import CloudIcon from "@mui/icons-material/Cloud";
import BuildCircleIcon from "@mui/icons-material/BuildCircle";
import { useFormik } from "formik";
import * as Yup from "yup";
import type { Employee } from "../common/types";

const primaryColor = "#906aff";

interface AddEmployeeDialogProps {
  open: boolean;
  onClose: () => void;
  onAddEmployee: (
    employee: Employee & { projectName?: string; image?: string }
  ) => Promise<void>;
}

const roles = [
  { label: "Developer", icon: <CodeIcon fontSize="small" /> },
  { label: "Admin", icon: <AdminPanelSettingsIcon fontSize="small" /> },
  { label: "Tester", icon: <BugReportIcon fontSize="small" /> },
  { label: "HR", icon: <PeopleIcon fontSize="small" /> },
  { label: "AWS", icon: <CloudIcon fontSize="small" /> },
  { label: "DevOps", icon: <BuildCircleIcon fontSize="small" /> },
];

const textFieldSx = {
  "& .MuiOutlinedInput-root": {
    borderRadius: "40px",
  },
  "& .MuiOutlinedInput-notchedOutline": {
    borderColor: "#e0e0e0",
  },
  "&:hover .MuiOutlinedInput-notchedOutline": {
    borderColor: "#e0e0e0",
  },
  "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
    borderColor: "#e0e0e0",
  },
};

const convertToBase64 = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
  });

const AddEmployeeDialog: React.FC<AddEmployeeDialogProps> = ({
  open,
  onClose,
  onAddEmployee,
}) => {
  const [skillInput, setSkillInput] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const formik = useFormik({
    initialValues: {
      id: "",
      name: "",
      role: "",
      email: "",
      joinDate: "",
      skills: [] as string[],
      projectName: "",
      image: "",
    },
    validationSchema: Yup.object({
      id: Yup.string().required("ID is required"),
      name: Yup.string().min(3).required("Name is required"),
      role: Yup.string().required("Role is required"),
      email: Yup.string().email().required("Email is required"),
      joinDate: Yup.string().required("Join date is required"),
    }),
    onSubmit: async (values) => {
      await onAddEmployee(values);
      handleClose();
    },
  });

  const isFormValid = formik.isValid && Object.keys(formik.touched).length > 0;

  useEffect(() => {
    if (!open) {
      formik.resetForm();
      setSkillInput("");
      setImagePreview(null);
    }
  }, [open]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const base64 = await convertToBase64(file);
    formik.setFieldValue("image", base64);
    setImagePreview(base64);
  };

  const handleSkillKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if ((e.key === "Enter" || e.key === ",") && skillInput.trim()) {
      e.preventDefault();
      if (!formik.values.skills.includes(skillInput.trim())) {
        formik.setFieldValue("skills", [
          ...formik.values.skills,
          skillInput.trim(),
        ]);
      }
      setSkillInput("");
    }
  };

  const handleClose = () => {
    onClose();
    formik.resetForm();
    setSkillInput("");
    setImagePreview(null);
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      PaperProps={{
        sx: {
          width: "55vw",
          maxWidth: 900,
          borderRadius: "12px",
          overflow: "hidden",
        },
      }}
    >
      <DialogTitle sx={{ display: "flex", justifyContent: "space-between" }}>
        Add New Employee
        <IconButton onClick={handleClose}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ overflow: "hidden" }}>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <Box>
            <Typography fontSize={13} mb={1}>
              Profile Image
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Avatar
                sx={{ width: 56, height: 56, bgcolor: primaryColor }}
                src={imagePreview || undefined}
              />
              <input
                type="file"
                hidden
                ref={fileInputRef}
                accept="image/*"
                onChange={handleImageUpload}
              />
              <Button
                variant="outlined"
                sx={{
                  borderRadius: "20px",
                  borderColor: primaryColor,
                  color: primaryColor,
                }}
                onClick={() => fileInputRef.current?.click()}
              >
                Add Image
              </Button>
            </Box>
          </Box>

          <Box sx={{ display: "flex", gap: 2 }}>
            <TextField
              fullWidth
              label="ID"
              sx={textFieldSx}
              {...formik.getFieldProps("id")}
            />
            <TextField
              fullWidth
              label="Name"
              sx={textFieldSx}
              {...formik.getFieldProps("name")}
            />
          </Box>

          <Box sx={{ display: "flex", gap: 2 }}>
            <TextField
              select
              fullWidth
              label="Role"
              sx={textFieldSx}
              {...formik.getFieldProps("role")}
            >
              {roles.map((r) => (
                <MenuItem key={r.label} value={r.label}>
                  <ListItemIcon>{r.icon}</ListItemIcon>
                  {r.label}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              fullWidth
              label="Email"
              sx={textFieldSx}
              {...formik.getFieldProps("email")}
            />
          </Box>

          <Box sx={{ display: "flex", gap: 2 }}>
            <TextField
              fullWidth
              type="date"
              label="Join Date"
              InputLabelProps={{ shrink: true }}
              sx={textFieldSx}
              {...formik.getFieldProps("joinDate")}
            />
            <TextField
              fullWidth
              label="Project Name"
              sx={textFieldSx}
              {...formik.getFieldProps("projectName")}
            />
          </Box>

          <Box>
            <TextField
              fullWidth
              placeholder="Press Enter to add skill"
              sx={textFieldSx}
              value={skillInput}
              onChange={(e) => setSkillInput(e.target.value)}
              onKeyDown={handleSkillKeyDown}
            />
            <Box sx={{ display: "flex", gap: 1, mt: 1, flexWrap: "wrap" }}>
              {formik.values.skills.map((skill) => (
                <Chip
                  key={skill}
                  label={skill}
                  onDelete={() =>
                    formik.setFieldValue(
                      "skills",
                      formik.values.skills.filter((s) => s !== skill)
                    )
                  }
                />
              ))}
            </Box>
          </Box>
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={handleClose} sx={{ borderRadius: "20px" }}>
          Cancel
        </Button>
        <Button
          variant="contained"
          disabled={!isFormValid}
          onClick={formik.submitForm}
          sx={{ borderRadius: "20px" }}
        >
          Add Employee
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddEmployeeDialog;
