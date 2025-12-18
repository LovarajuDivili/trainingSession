import React from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { Box, TextField, MenuItem, Typography, Divider } from "@mui/material";
import type { Project } from "../common/types";

const statusOptions = [
  { value: "active", label: "Active" },
  { value: "inactive", label: "Inactive" },
  { value: "inProgress", label: "In Progress" },
  { value: "notStarted", label: "Not Started" },
];

export interface CreateProjectProps {
  onValidityChange: (valid: boolean) => void;
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
        const { startDate } = this.parent;
        if (!value || !startDate) return true;
        return new Date(value) > new Date(startDate);
      }
    ),
});

const initialValues: FormValues = {
  name: "",
  jiraCode: "",
  startDate: "",
  endDate: "",
  status: "",
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

const CreateProject: React.FC<CreateProjectProps> = ({
  onValidityChange,
  onSave,
}) => {
  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      validate={(values) => {
        const isValid = validationSchema.isValidSync(values);
        onValidityChange(isValid);
      }}
      onSubmit={(values) => {
        const proj: Project = {
          ...values,
          jiraCode: Number(values.jiraCode),
          owner: ""
        };
        onSave(proj);
      }}
    >
      {({ values, errors, touched, handleChange, handleBlur }) => (
        <Form>
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
            <Box sx={{ flex: "1 1 100%" }}>
              <Typography sx={{ fontSize: 13, mb: 0.5 }}>
                Project Name
                <span style={{ color: "black", fontWeight: "bold" }}>*</span>
              </Typography>
              <Divider />
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
                InputLabelProps={{ shrink: false }}
                sx={commonFieldStyle}
              />
            </Box>

            <Box sx={{ flex: "1 1 48%" }}>
              <Typography sx={{ fontSize: 13, mb: 0.5 }}>
                Jira Code
                <span style={{ color: "black", fontWeight: "bold" }}>*</span>
              </Typography>
              <Field
                as={TextField}
                fullWidth
                placeholder="Jira Code"
                type="text"
                name="jiraCode"
                value={values.jiraCode}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.jiraCode && Boolean(errors.jiraCode)}
                helperText={touched.jiraCode && errors.jiraCode}
                inputProps={{ inputMode: "numeric", pattern: "[0-9]*", min: 0 }}
                InputLabelProps={{ shrink: false }}
                sx={commonFieldStyle}
              />
            </Box>

            <Box sx={{ flex: "1 1 48%" }}>
              <Typography sx={{ fontSize: 13, mb: 0.5 }}>Start Date</Typography>
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

            <Box sx={{ flex: "1 1 48%" }}>
              <Typography sx={{ fontSize: 13, mb: 0.5 }}>End Date</Typography>
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
                <span style={{ color: "black", fontWeight: "bold" }}>*</span>
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
        </Form>
      )}
    </Formik>
  );
};

export default CreateProject;
