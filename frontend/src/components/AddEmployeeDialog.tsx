import React, { useState, useEffect, useRef } from 'react';
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
  Avatar
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import CodeIcon from '@mui/icons-material/Code';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import BugReportIcon from '@mui/icons-material/BugReport';
import PeopleIcon from '@mui/icons-material/People';
import CloudIcon from '@mui/icons-material/Cloud';
import BuildCircleIcon from '@mui/icons-material/BuildCircle';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import type { Employee } from '../common/types';

const primaryColor = '#906aff';

interface AddEmployeeDialogProps {
  open: boolean;
  onClose: () => void;
  onAddEmployee: (employee: Employee & { projectName?: string; image?: string }) => Promise<void>;
}

const roles = [
  { label: 'Developer', icon: <CodeIcon fontSize="small" /> },
  { label: 'Admin', icon: <AdminPanelSettingsIcon fontSize="small" /> },
  { label: 'Tester', icon: <BugReportIcon fontSize="small" /> },
  { label: 'HR', icon: <PeopleIcon fontSize="small" /> },
  { label: 'AWS', icon: <CloudIcon fontSize="small" /> },
  { label: 'DevOps', icon: <BuildCircleIcon fontSize="small" /> }
];

const textFieldSx = {
  '& .MuiOutlinedInput-root': {
    borderRadius: '10px'
  },
  '& .MuiOutlinedInput-notchedOutline': {
    borderColor: '#e0e0e0'
  },
  '&:hover .MuiOutlinedInput-notchedOutline': {
    borderColor: '#e0e0e0'
  },
  '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
    borderColor: '#e0e0e0'
  }
};

const convertToBase64 = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = err => reject(err);
  });

const AddEmployeeDialog: React.FC<AddEmployeeDialogProps> = ({ open, onClose, onAddEmployee }) => {
  const [skillInput, setSkillInput] = useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFileName, setImageFileName] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const formik = useFormik({
    initialValues: {
      id: '',
      name: '',
      role: '',
      email: '',
      joinDate: '',
      skills: [] as string[],
      projectName: '',
      image: ''
    },
    validationSchema: Yup.object({
      id: Yup.string().required('ID is required'),
      name: Yup.string().min(3, 'Name must be at least 3 characters').required('Name is required'),
      role: Yup.string().required('Role is required'),
      email: Yup.string().email('Invalid email format').required('Email is required'),
      joinDate: Yup.string().required('Join date is required')
    }),
    onSubmit: async values => {
      await onAddEmployee(values);
      handleClose();
    }
  });

  const isFormValid = formik.isValid && Object.keys(formik.touched).length > 0;

  useEffect(() => {
    if (!open) {
      formik.resetForm();
      setSkillInput('');
      setImagePreview(null);
      setImageFileName('');
    }
  }, [open]);

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const base64Image = await convertToBase64(file);

      if (formik.values.id) {
        localStorage.setItem(`employee_image_${formik.values.id}`, base64Image);
      }

      formik.setFieldValue('image', base64Image);
      setImagePreview(base64Image);
      setImageFileName(file.name);
    } catch (err) {
      console.error('Error converting image to base64', err);
    }
  };

  const handleAddImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleSkillKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if ((e.key === 'Enter' || e.key === ',') && skillInput.trim()) {
      e.preventDefault();
      const newSkill = skillInput.trim();
      if (!formik.values.skills.includes(newSkill)) {
        formik.setFieldValue('skills', [...formik.values.skills, newSkill]);
      }
      setSkillInput('');
    }
  };

  const handleDeleteSkill = (skillToDelete: string) => {
    formik.setFieldValue(
      'skills',
      formik.values.skills.filter(skill => skill !== skillToDelete)
    );
  };

  const handleClose = () => {
    onClose();
    formik.resetForm();
    setSkillInput('');
    setImagePreview(null);
    setImageFileName('');
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      PaperProps={{
        sx: { width: '55vw', maxWidth: 900, borderRadius: '12px', p: '8px 0' }
      }}
    >
      <DialogTitle
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          fontSize: '1.4rem',
          px: 3,
          pt: 2
        }}
      >
        Add New Employee
        <IconButton onClick={handleClose}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <Box sx={{ borderBottom: '1px solid #e0e0e0', mx: 3 }} />

      <DialogContent sx={{ px: 3 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <Box>
            <Typography sx={{ fontSize: 13, mb: 1.5 }}>Profile Image </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
              <Avatar
                sx={{
                  width: 80,
                  height: 80,
                  bgcolor: primaryColor
                }}
                src={imagePreview || undefined}
              />

              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                onChange={handleImageUpload}
                style={{ display: 'none' }}
              />

              <Box sx={{ flex: 1 }}>
                <Button
                  variant="outlined"
                  //startIcon={<PhotoCameraIcon />}
                  onClick={handleAddImageClick}
                  sx={{
                    borderRadius: '20px',
                    textTransform: 'none',
                    borderColor: primaryColor,
                    color: primaryColor,
                    px: 3,
                    '&:hover': {
                      borderColor: '#7a53e3',
                      backgroundColor: '#7a53e3',
                      color: 'white'
                    }
                  }}
                >
                  Add Image
                </Button>

                {imageFileName && (
                  <Typography
                    variant="caption"
                    sx={{ display: 'block', mt: 0.5, color: 'text.secondary' }}
                  >
                    {imageFileName}
                  </Typography>
                )}
              </Box>
            </Box>
          </Box>

          <Box sx={{ display: 'flex', gap: 2 }}>
            <Box sx={{ flex: 1 }}>
              <Typography sx={{ fontSize: 13, mb: 0.5 }}>
                ID<span style={{ color: 'black', fontWeight: 'bold' }}>*</span>
              </Typography>
              <TextField
                fullWidth
                variant="outlined"
                placeholder="Enter ID"
                {...formik.getFieldProps('id')}
                error={formik.touched.id && Boolean(formik.errors.id)}
                helperText={formik.touched.id && formik.errors.id}
                InputLabelProps={{ shrink: false }}
                sx={textFieldSx}
              />
            </Box>
            <Box sx={{ flex: 1 }}>
              <Typography sx={{ fontSize: 13, mb: 0.5 }}>
                Name<span style={{ color: 'black', fontWeight: 'bold' }}>*</span>
              </Typography>
              <TextField
                fullWidth
                variant="outlined"
                placeholder="Enter Name"
                {...formik.getFieldProps('name')}
                error={formik.touched.name && Boolean(formik.errors.name)}
                helperText={formik.touched.name && formik.errors.name}
                InputLabelProps={{ shrink: false }}
                sx={textFieldSx}
              />
            </Box>
          </Box>

          <Box sx={{ display: 'flex', gap: 2 }}>
            <Box sx={{ flex: 1 }}>
              <Typography sx={{ fontSize: 13, mb: 0.5 }}>
                Role<span style={{ color: 'black', fontWeight: 'bold' }}>*</span>
              </Typography>
              <TextField
                fullWidth
                select
                variant="outlined"
                {...formik.getFieldProps('role')}
                error={formik.touched.role && Boolean(formik.errors.role)}
                helperText={formik.touched.role && formik.errors.role}
                InputLabelProps={{ shrink: false }}
                sx={textFieldSx}
              >
                {roles.map(({ label, icon }) => (
                  <MenuItem key={label} value={label}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <ListItemIcon sx={{ minWidth: 0 }}>{icon}</ListItemIcon>
                      <Typography variant="body2">{label}</Typography>
                    </Box>
                  </MenuItem>
                ))}
              </TextField>
            </Box>
            <Box sx={{ flex: 1 }}>
              <Typography sx={{ fontSize: 13, mb: 0.5 }}>
                Email<span style={{ color: 'black', fontWeight: 'bold' }}>*</span>
              </Typography>
              <TextField
                fullWidth
                variant="outlined"
                placeholder="Enter Email"
                {...formik.getFieldProps('email')}
                error={formik.touched.email && Boolean(formik.errors.email)}
                helperText={formik.touched.email && formik.errors.email}
                InputLabelProps={{ shrink: false }}
                sx={textFieldSx}
              />
            </Box>
          </Box>

          <Box sx={{ display: 'flex', gap: 2 }}>
            <Box sx={{ flex: 1 }}>
              <Typography sx={{ fontSize: 13, mb: 0.5 }}>
                Join Date<span style={{ color: 'black', fontWeight: 'bold' }}>*</span>
              </Typography>
              <TextField
                fullWidth
                type="date"
                {...formik.getFieldProps('joinDate')}
                error={formik.touched.joinDate && Boolean(formik.errors.joinDate)}
                helperText={formik.touched.joinDate && formik.errors.joinDate}
                InputLabelProps={{ shrink: true }}
                sx={textFieldSx}
              />
            </Box>
            <Box sx={{ flex: 1 }}>
              <Typography sx={{ fontSize: 13, mb: 0.5 }}>Project Name</Typography>
              <TextField
                fullWidth
                variant="outlined"
                placeholder="Enter Project Name"
                {...formik.getFieldProps('projectName')}
                InputLabelProps={{ shrink: false }}
                sx={textFieldSx}
              />
            </Box>
          </Box>

          <Box>
            <Typography sx={{ fontSize: 13, mb: 0.5 }}>Skills</Typography>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Press Enter or comma to add skill"
              value={skillInput}
              onChange={e => setSkillInput(e.target.value)}
              onKeyDown={handleSkillKeyDown}
              InputLabelProps={{ shrink: false }}
              sx={textFieldSx}
            />
            <Typography sx={{ fontSize: '0.8rem', mt: 0.5 }}>
              Press Enter or comma to add skill
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
              {formik.values.skills.map(skill => (
                <Chip key={skill} label={skill} onDelete={() => handleDeleteSkill(skill)} />
              ))}
            </Box>
          </Box>
        </Box>
      </DialogContent>

      <Box sx={{ borderTop: '1px solid #e0e0e0', mx: 3 }} />

      <DialogActions sx={{ justifyContent: 'flex-end', px: 3, pb: 3 }}>
        <Button
          variant="outlined"
          onClick={handleClose}
          sx={{
            mr: 1,
            borderRadius: '20px',
            px: 4,
            textTransform: 'none',
            background: primaryColor,
            color: '#fff',
            '&:hover': { background: '#7a53e3' }
          }}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          disabled={!isFormValid || formik.isSubmitting}
          onClick={formik.submitForm}
          sx={{
            borderRadius: '20px',
            px: 4,
            textTransform: 'none',
            background: isFormValid ? primaryColor : '#d3d3d3',
            color: '#fff',
            '&:hover': { background: isFormValid ? '#7a53e3' : '#d3d3d3' }
          }}
        >
          Add Employee
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddEmployeeDialog;
