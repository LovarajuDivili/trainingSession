import React, { useMemo } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  TextField,
  MenuItem,
  Typography,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import type { Project } from "../common/types";

const statusOptions = [
  { value: "active", label: "Active" },
  { value: "inactive", label: "Inactive" },
  { value: "inProgress", label: "In Progress" },
  { value: "notStarted", label: "Not Started" },
];

export interface EditProjectDialogProps {
  open: boolean;
  project: Project | null;
  onClose: () => void;
  onSave: (project: Project) => void;
}

interface FormValues {
  name: string;
  jiraCode: string;
  startDate: string;
  endDate: string;
  status: string;
}

const validationSchema = Yup.object({
  name: Yup.string().trim().required("Project name is required"),
  jiraCode: Yup.number()
    .typeError("Jira Code must be a number")
    .required("Jira Code is required"),
  status: Yup.string().trim().required("Status is required"),
  startDate: Yup.string().nullable(),
  endDate: Yup.string()
    .nullable()
    .test(
      "is-after-start",
      "End date must be after start date",
      function (value) {
        const { startDate } = this.parent as { startDate?: string };
        if (!value || !startDate) return true;
        return new Date(value) > new Date(startDate);
      }
    ),
});

const normalizeDate = (value?: string | null): string => {
  if (!value) return "";
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) return value;
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "";
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
};

const commonFieldStyle = {
  "& .MuiOutlinedInput-root": {
    borderRadius: "10px",
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

const EditProjectDialog: React.FC<EditProjectDialogProps> = ({
  open,
  project,
  onClose,
  onSave,
}) => {
  if (!project) return null;

  const initialValues: FormValues = useMemo(
    () => ({
      name: project.name || "",
      jiraCode: String(project.jiraCode ?? ""),
      startDate: normalizeDate(project.startDate),
      endDate: normalizeDate(project.endDate),
      status: project.status || "",
    }),
    [project]
  );

  const actionButtonSx = {
    textTransform: "none" as const,
    borderRadius: 12,
    minWidth: 140,
    height: 44,
    px: 4,
    fontWeight: 500,
    fontSize: 14,
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          maxHeight: "80vh",
        },
      }}
    >
      <DialogTitle
        sx={{
          fontWeight: 400,
          fontSize: 20,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          pr: 1,
        }}
      >
        <span>Edit Project</span>
        <IconButton aria-label="close" onClick={onClose} sx={{ color: "#555" }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        enableReinitialize
        validateOnMount
        onSubmit={(values, helpers) => {
          const proj: Project = {
            ...project,
            ...values,
            jiraCode: Number(values.jiraCode),
          };
          onSave(proj);
          helpers.setSubmitting(false);
        }}
      >
        {({
          values,
          errors,
          touched,
          handleChange,
          handleBlur,
          isSubmitting,
          isValid,
        }) => {
          const hasChanges =
            values.name !== (project.name || "") ||
            values.jiraCode !== String(project.jiraCode ?? "") ||
            values.startDate !== normalizeDate(project.startDate) ||
            values.endDate !== normalizeDate(project.endDate) ||
            values.status !== (project.status || "");

          const canSave = hasChanges && isValid && !isSubmitting;

          return (
            <Form>
              <DialogContent dividers sx={{ pt: 2, pb: 3 }}>
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
                  {/* Project Name - full width row */}
                  <Box sx={{ flex: "1 1 100%" }}>
                    <Typography sx={{ fontSize: 13, mb: 0.5 }}>
                      Project Name
                      <span style={{ color: "black", fontWeight: "bold" }}>
                        *
                      </span>
                    </Typography>
                    <Field
                      as={TextField}
                      fullWidth
                      placeholder="Project Name"
                      name="name"
                      value={values.name}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.name && Boolean(errors.name)}
                      helperText={touched.name && errors.name}
                      sx={commonFieldStyle}
                    />
                  </Box>

                  <Box sx={{ flex: "1 1 48%" }}>
                    <Typography sx={{ fontSize: 13, mb: 0.5 }}>
                      Jira Code
                      <span style={{ color: "black", fontWeight: "bold" }}>
                        *
                      </span>
                    </Typography>
                    <Field
                      as={TextField}
                      fullWidth
                      type="text"
                      placeholder="Jira Code"
                      name="jiraCode"
                      value={values.jiraCode}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.jiraCode && Boolean(errors.jiraCode)}
                      helperText={touched.jiraCode && errors.jiraCode}
                      inputProps={{
                        inputMode: "numeric",
                        pattern: "[0-9]*",
                        min: 0,
                      }}
                      sx={commonFieldStyle}
                    />
                  </Box>

                  <Box sx={{ flex: "1 1 48%" }}>
                    <Typography sx={{ fontSize: 13, mb: 0.5 }}>
                      Start Date
                    </Typography>
                    <Field
                      as={TextField}
                      fullWidth
                      type="date"
                      name="startDate"
                      value={values.startDate}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      InputLabelProps={{ shrink: true }}
                      sx={commonFieldStyle}
                    />
                  </Box>

                  {/* End Date and Status - one row */}
                  <Box sx={{ flex: "1 1 48%" }}>
                    <Typography sx={{ fontSize: 13, mb: 0.5 }}>
                      End Date
                    </Typography>
                    <Field
                      as={TextField}
                      fullWidth
                      type="date"
                      name="endDate"
                      value={values.endDate}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.endDate && Boolean(errors.endDate)}
                      helperText={touched.endDate && errors.endDate}
                      InputLabelProps={{ shrink: true }}
                      sx={commonFieldStyle}
                    />
                  </Box>

                  <Box sx={{ flex: "1 1 48%" }}>
                    <Typography sx={{ fontSize: 13, mb: 0.5 }}>
                      Status
                      <span style={{ color: "black", fontWeight: "bold" }}>
                        *
                      </span>
                    </Typography>
                    <Field
                      as={TextField}
                      fullWidth
                      select
                      name="status"
                      value={values.status}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.status && Boolean(errors.status)}
                      helperText={touched.status && errors.status}
                      InputLabelProps={{ shrink: true }}
                      sx={commonFieldStyle}
                    >
                      {statusOptions.map((opt) => (
                        <MenuItem key={opt.value} value={opt.value}>
                          {opt.label}
                        </MenuItem>
                      ))}
                    </Field>
                  </Box>
                </Box>
              </DialogContent>

              <DialogActions
                sx={{
                  px: 4,
                  py: 2.5,
                  justifyContent: "flex-end",
                  gap: 2,
                }}
              >
                <Button
                  onClick={onClose}
                  sx={{
                    ...actionButtonSx,
                    color: "#fff",
                    px: 4,
                    padding: "20px 32px",
                    boxShadow: "0 4px 10px rgba(0,0,0,0.15)",
                    background: "linear-gradient(90deg,#ab80ff,#8a4dff)",
                    "&:hover": {
                      backgroundColor: "linear-gradient(90deg,#9c70ff,#7a3df5)",
                    },
                  }}
                >
                  Cancel
                </Button>

                <Button
                  type="submit"
                  variant="contained"
                  disabled={!canSave}
                  sx={{
                    ...actionButtonSx,
                    background: !canSave
                      ? "#e1d4ff"
                      : "linear-gradient(90deg, #906aff 0%, #b077ff 100%)",
                    color: "#ffffff",
                    "&:hover": {
                      background: !canSave
                        ? "#e1d4ff"
                        : "linear-gradient(90deg, #7b57f5 0%, #9b63f5 100%)",
                    },
                  }}
                >
                  Save
                </Button>
              </DialogActions>
            </Form>
          );
        }}
      </Formik>
    </Dialog>
  );
};

export default EditProjectDialog;
  