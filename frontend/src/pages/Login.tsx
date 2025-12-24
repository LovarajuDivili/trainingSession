import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { UserContext } from '../components/UserContext';
import { Box, Paper, Typography, TextField, Button, GlobalStyles } from '@mui/material';

const textFieldSx = {
  '& .MuiOutlinedInput-root': {
    '& fieldset': { borderColor: '#e0e0e0' },
    '&:hover fieldset': { borderColor: '#e0e0e0' },
    '&.Mui-focused fieldset': { borderColor: '#e0e0e0' },
  },
};

const Login: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { setUser, setToken } = useContext(UserContext);
  const state = location.state as { message?: string } | null;

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [blockedMessage, setBlockedMessage] = useState('');

  useEffect(() => {
    if (localStorage.getItem('needsLoginMessage')) {
      setBlockedMessage('Please log in to view page');
      localStorage.removeItem('needsLoginMessage');
    }
  }, []);

  const enableSignIn = Boolean(email && password);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage('');
    setBlockedMessage('');

    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.message || 'Invalid credentials');

      localStorage.setItem('user', JSON.stringify(data.user));
      localStorage.setItem('token', data.token);

      setUser(data.user);
      setToken(data.token);

      navigate('/account-type-selection', { replace: true });
    } catch (error: any) {
      setErrorMessage(error.message);
    }
  }

  return (
    <>
      <GlobalStyles
        styles={{
          html: { height: '100%', boxSizing: 'border-box', margin: 0, padding: 0, fontSize: 14 },
          body: { height: '100%', margin: 0, padding: 0, boxSizing: 'border-box', fontSize: 14 },
          '#root': { height: '100%', margin: 0, padding: 0, boxSizing: 'border-box', fontSize: 14 },
          '*': { boxSizing: 'border-box', fontSize: 14 },
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
          <Typography variant="h5" align="center" fontWeight={700} mb={3} sx={{ fontSize: 14 }}>
            Login
          </Typography>

          {state?.message && (
            <Box mb={1}>
              <Typography color="error" sx={{ textAlign: 'center' }}>
                {state.message}
              </Typography>
            </Box>
          )}

          <form style={{ width: '100%' }} onSubmit={handleSubmit}>
            <Box mb={2}>
              <Typography fontWeight={500}>Email</Typography>
              <TextField
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                fullWidth
                required
                placeholder="Email"
                margin="dense"
                variant="outlined"
                sx={textFieldSx}
              />
            </Box>

            <Box mb={3} sx={{ position: 'relative' }}>
              <Typography fontWeight={500}>Password</Typography>
              <TextField
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                fullWidth
                required
                placeholder="Password"
                margin="dense"
                variant="outlined"
                sx={textFieldSx}
              />

              <Typography
                variant="body2"
                color="error"
                sx={{
                  fontSize: 12,
                  position: 'absolute',
                  right: 0,
                  bottom: -20,
                  cursor: 'pointer',
                  fontWeight: 500,
                }}
                onClick={() => navigate('/forgot-password')}
              >
                Forgot password?
              </Typography>
            </Box>

            {errorMessage && (
              <Box mb={1}>
                <Typography color="error">{errorMessage}</Typography>
              </Box>
            )}

            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={!enableSignIn}
              sx={{
                backgroundColor: '#906aff',
                color: 'white',
                fontWeight: 700,
                letterSpacing: 1,
                borderRadius: '16px',
                boxShadow: 'none',
                my: 1,
                textTransform: 'none',
                '&:hover': {
                  backgroundColor: '#906aff',
                  boxShadow: 'none',
                },
              }}
            >
              Sign In
            </Button>

            {blockedMessage && (
              <Box mb={1}>
                <Typography color="error" sx={{ textAlign: 'center' }}>
                  {blockedMessage}
                </Typography>
              </Box>
            )}
          </form>

          <Typography variant="body2" align="center" sx={{ mt: 2 }}>
            Don't have an account?{' '}
            <Typography
              component="span"
              sx={{
                color: '#906aff',
                cursor: 'pointer',
                marginLeft: 0.5,
                fontWeight: 600,
              }}
              onClick={() => navigate('/register')}
            >
              Register here
            </Typography>
          </Typography>
        </Paper>
      </Box>
    </>
  );
};

export default Login;
