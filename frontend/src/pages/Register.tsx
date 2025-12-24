import React, { useState, useEffect, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, Paper, TextField, Typography, GlobalStyles } from '@mui/material';

const Register: React.FC = () => {
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    document.documentElement.style.overflow = 'hidden';
    document.body.style.overflow = 'hidden';
    return () => {
      document.documentElement.style.overflow = '';
      document.body.style.overflow = '';
    };
  }, []);

  const enableRegister = Boolean(name && email && password);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage('');

    try {
      const res = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });

      if (res.ok) {
        navigate('/');
      } else {
        const data = await res.json();
        setMessage(data.message || 'Registration failed');
      }
    } catch {
      setMessage('Network error');
    }
  };

  const textFieldSx = {
    '& .MuiOutlinedInput-root': {
      '& fieldset': { borderColor: '#e0e0e0' },
      '&:hover fieldset': { borderColor: '#e0e0e0' },
      '&.Mui-focused fieldset': { borderColor: '#e0e0e0' },
    },
  };

  return (
    <>
      <GlobalStyles
        styles={{
          html: {
            height: '100%',
            boxSizing: 'border-box',
            margin: 0,
            padding: 0,
            fontSize: 14,
          },
          body: {
            height: '100%',
            margin: 0,
            padding: 0,
            boxSizing: 'border-box',
            fontSize: 14,
          },
          '#root': {
            height: '100%',
            margin: 0,
            padding: 0,
            boxSizing: 'border-box',
            fontSize: 14,
          },
          '*': {
            boxSizing: 'border-box',
            fontSize: 14,
          },
        }}
      />

      <Box
        sx={{
          position: 'fixed',
          inset: 0,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
          minWidth: '100vw',
          backgroundImage: 'url(/images/image.png)',
          backgroundSize: '115% 115%',
          backgroundPosition: '60% center',
          backgroundRepeat: 'no-repeat',
        }}
      >
        <Paper
          elevation={3}
          sx={{
            width: 400, 
            maxWidth: '95vw',
            p: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            borderRadius: '16px',
          }}
        >
          <Typography
            variant="h5"
            align="center"
            fontWeight={700}
            mb={3}
            sx={{ fontSize: 14 }}
          >
            Register
          </Typography>

          <form onSubmit={handleSubmit} style={{ width: '100%' }}>
            <Box mb={2}>
              <Typography fontWeight={500}>Name*</Typography>
              <TextField
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                fullWidth
                margin="dense"
                required
                variant="outlined"
                placeholder="Full Name"
                sx={textFieldSx}
              />
            </Box>

            <Box mb={2}>
              <Typography fontWeight={500}>Email*</Typography>
              <TextField
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                fullWidth
                margin="dense"
                required
                variant="outlined"
                placeholder="Email"
                sx={textFieldSx}
              />
            </Box>

            <Box mb={3}>
              <Typography fontWeight={500}>Password*</Typography>
              <TextField
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                fullWidth
                margin="dense"
                required
                variant="outlined"
                placeholder="Password"
                sx={textFieldSx}
              />
            </Box>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={!enableRegister}
              sx={{
                backgroundColor: '#906aff',
                color: 'white',
                fontWeight: 700,
                letterSpacing: 1,
                borderRadius: '16px',
                boxShadow: 'none',
                my: 1,
                textTransform: 'none',
              }}
            >
              Register
            </Button>

            {message && (
              <Typography color="error" mt={1} sx={{ fontSize: 14 }}>
                {message}
              </Typography>
            )}

            <Typography variant="body2" align="center" sx={{ mt: 2 }}>
              Already registered?{' '}
              <Typography
                component="span"
                sx={{
                  color: '#906aff',
                  cursor: 'pointer',
                  marginLeft: 0.5,
                  fontWeight: 600,
                }}
                onClick={() => navigate('/login')}
              >
                Login
              </Typography>
            </Typography>
          </form>
        </Paper>
      </Box>
    </>
  );
};

export default Register;
