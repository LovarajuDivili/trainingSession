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
  Avatar
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import type { Employee } from '../common/types';

const primaryColor = '#906aff';

type EmployeeWithProject = Employee & { projectName?: string; image?: string };

interface EditEmployeeDialogProps {
  open: boolean;
  employee: EmployeeWithProject | null;
  onClose: () => void;
  onUpdateEmployee: (updatedEmployee: EmployeeWithProject) => void;
}

const roles = ['Developer', 'Admin', 'Tester', 'HR', 'AWS', 'DEVOPS'];

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

// convert file to base64 string
const convertToBase64 = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = err => reject(err);
  });

const EditEmployeeDialog: React.FC<EditEmployeeDialogProps> = ({
  open,
  employee,
  onClose,
  onUpdateEmployee
}) => {
  const [editEmployee, setEditEmployee] = useState<EmployeeWithProject>({
    id: '',
    name: '',
    role: '',
    email: '',
    joinDate: '',
    skills: [],
    projectName: '',
    image: ''
  });

  const [originalEmployee, setOriginalEmployee] = useState<EmployeeWithProject>({
    id: '',
    name: '',
    role: '',
    email: '',
    joinDate: '',
    skills: [],
    projectName: '',
    image: ''
  });

  const [skillInput, setSkillInput] = useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFileName, setImageFileName] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const emailValid = emailRegex.test(editEmployee.email.trim());

  const isFormValid =
    editEmployee.id.trim() &&
    editEmployee.name.trim() &&
    editEmployee.role.trim() &&
    editEmployee.email.trim() &&
    emailValid &&
    editEmployee.joinDate.trim() &&
    editEmployee.skills.length > 0;

  const hasChanged =
    editEmployee.id !== originalEmployee.id ||
    editEmployee.name !== originalEmployee.name ||
    editEmployee.role !== originalEmployee.role ||
    editEmployee.email !== originalEmployee.email ||
    editEmployee.joinDate !== originalEmployee.joinDate ||
    (editEmployee.projectName || '') !== (originalEmployee.projectName || '') ||
    editEmployee.skills.join(',') !== originalEmployee.skills.join(',') ||
    (editEmployee.image || '') !== (originalEmployee.image || '');

  // load selected employee (including image) when dialog opens
  useEffect(() => {
    if (employee) {
      const normalized: EmployeeWithProject = {
        ...employee,
        skills: Array.isArray(employee.skills) ? employee.skills : [],
        projectName: employee.projectName ?? '',
        joinDate: employee.joinDate ? employee.joinDate.slice(0, 10) : '',
        image: employee.image ?? ''
      };

      // prefer image from localStorage if it exists for this id
      if (employee.id) {
        const storedImg = localStorage.getItem(`employee_image_${employee.id}`);
        if (storedImg) {
          normalized.image = storedImg;
        }
      }

      setEditEmployee(normalized);
      setOriginalEmployee(normalized);
      setSkillInput('');
      setImagePreview(normalized.image || null); // this makes Avatar show the saved pic
      setImageFileName('');
    }
  }, [employee]);

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const base64Image = await convertToBase64(file);

      if (editEmployee.id) {
        localStorage.setItem(`employee_image_${editEmployee.id}`, base64Image);
      }

      setEditEmployee(prev => ({ ...prev, image: base64Image }));
      setImagePreview(base64Image); // immediately update avatar preview
      setImageFileName(file.name);
    } catch (err) {
      console.error('Error converting image to base64', err);
    }
  };

  const handleAddImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleSkillKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      if (skillInput.trim() && !editEmployee.skills.includes(skillInput.trim())) {
        e.preventDefault();
        setEditEmployee(prev => ({
          ...prev,
          skills: [...prev.skills, skillInput.trim()]
        }));
        setSkillInput('');
      }
    }
  };

  const handleDeleteSkill = (skillToDelete: string) => {
    setEditEmployee(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill !== skillToDelete)
    }));
  };

  const handleSubmit = () => {
    if (!isFormValid || !hasChanged) return;
    onUpdateEmployee({
      ...editEmployee,
      projectName: editEmployee.projectName?.trim() || undefined,
      image: editEmployee.image || undefined
    });
    onClose();
  };

  const handleClose = () => {
    onClose();
    setEditEmployee({
      id: '',
      name: '',
      role: '',
      email: '',
      joinDate: '',
      skills: [],
      projectName: '',
      image: ''
    });
    setOriginalEmployee({
      id: '',
      name: '',
      role: '',
      email: '',
      joinDate: '',
      skills: [],
      projectName: '',
      image: ''
    });
    setSkillInput('');
    setImagePreview(null);
    setImageFileName('');
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      PaperProps={{
        sx: {
          width: '55vw',
          maxWidth: 900,
          borderRadius: '12px',
          p: '8px 0'
        }
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
        Edit Employee
        <IconButton onClick={handleClose}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <Box sx={{ borderBottom: '1px solid #e0e0e0', mx: 3 }} />

      <DialogContent sx={{ px: 3 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <Box>
            <Typography sx={{ fontSize: 13, mb: 1.5 }}>Profile Image</Typography>
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
                  Change Image
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
              <Typography sx={{ fontSize: 13, mb: 0.5 }}>ID</Typography>
              <TextField
                fullWidth
                variant="outlined"
                placeholder="Enter ID"
                value={editEmployee.id}
                onChange={e => setEditEmployee({ ...editEmployee, id: e.target.value })}
                sx={textFieldSx}
              />
            </Box>

            <Box sx={{ flex: 1 }}>
              <Typography sx={{ fontSize: 13, mb: 0.5 }}>Name</Typography>
              <TextField
                fullWidth
                variant="outlined"
                placeholder="Enter Name"
                value={editEmployee.name}
                onChange={e => setEditEmployee({ ...editEmployee, name: e.target.value })}
                sx={textFieldSx}
              />
            </Box>
          </Box>

          <Box sx={{ display: 'flex', gap: 2 }}>
            <Box sx={{ flex: 1 }}>
              <Typography sx={{ fontSize: 13, mb: 0.5 }}>Role</Typography>
              <TextField
                fullWidth
                select
                variant="outlined"
                value={editEmployee.role}
                onChange={e => setEditEmployee({ ...editEmployee, role: e.target.value })}
                sx={textFieldSx}
              >
                {roles.map(role => (
                  <MenuItem key={role} value={role}>
                    {role}
                  </MenuItem>
                ))}
              </TextField>
            </Box>

            <Box sx={{ flex: 1 }}>
              <Typography sx={{ fontSize: 13, mb: 0.5 }}>Email</Typography>
              <TextField
                fullWidth
                variant="outlined"
                placeholder="Enter Email"
                value={editEmployee.email}
                error={!emailValid && editEmployee.email !== ''}
                helperText={!emailValid && editEmployee.email !== '' ? 'Invalid email' : ''}
                onChange={e => setEditEmployee({ ...editEmployee, email: e.target.value })}
                sx={textFieldSx}
              />
            </Box>
          </Box>

          <Box sx={{ display: 'flex', gap: 2 }}>
            <Box sx={{ flex: 1 }}>
              <Typography sx={{ fontSize: 13, mb: 0.5 }}>Join Date</Typography>
              <TextField
                fullWidth
                type="date"
                variant="outlined"
                value={editEmployee.joinDate}
                onChange={e => setEditEmployee({ ...editEmployee, joinDate: e.target.value })}
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
                value={editEmployee.projectName || ''}
                onChange={e =>
                  setEditEmployee({ ...editEmployee, projectName: e.target.value })
                }
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
              sx={textFieldSx}
            />

            <Typography sx={{ fontSize: '0.8rem', mt: 0.5 }}>
              Press Enter or comma to add skill
            </Typography>

            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
              {editEmployee.skills.map(skill => (
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
            textTransform: 'none',
            px: 4,
            background: primaryColor,
            color: '#fff'
          }}
        >
          Cancel
        </Button>

        <Button
          variant="contained"
          disabled={!isFormValid || !hasChanged}
          onClick={handleSubmit}
          sx={{
            borderRadius: '20px',
            textTransform: 'none',
            px: 4,
            background: isFormValid && hasChanged ? primaryColor : '#d3d3d3',
            color: '#fff',
            '&:hover':{
              backgroundColor: isFormValid && hasChanged ? primaryColor : '#d3d3d3',
            }
          }}
        >
          Update Employee
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditEmployeeDialog;
