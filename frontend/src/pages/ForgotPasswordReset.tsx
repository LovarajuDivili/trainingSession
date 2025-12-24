import * as React from 'react';
import { TextField, Button, Box, Typography, Paper, GlobalStyles } from '@mui/material';

interface ForgotPasswordResetProps {
  email: string;
  onResetComplete: () => void;
}

const ForgotPasswordReset: React.FC<ForgotPasswordResetProps> = (props) => {
  const [resetCode, setResetCode] = React.useState('');
  const [newPassword, setNewPassword] = React.useState('');
  const [reenterPassword, setReenterPassword] = React.useState('');
  const [message, setMessage] = React.useState('');
  const [isSuccess, setIsSuccess] = React.useState(false);

  React.useEffect(() => {
    document.documentElement.style.overflow = 'hidden';
    document.body.style.overflow = 'hidden';
    return () => {
      document.documentElement.style.overflow = '';
      document.body.style.overflow = '';
    };
  }, []);

  const inputSx = {
    fontSize: 14,
    height: 56,
    borderRadius: 2,
    background: '#fff',
    boxSizing: 'border-box'
  };

  const textFieldSx = {
    mt: 0,
    mb: 0,
    borderRadius: 2,
    fontSize: 14,
    '& .MuiOutlinedInput-root': {
      borderRadius: 2
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

  const handleResetPassword = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (newPassword !== reenterPassword) {
      setMessage('Passwords do not match.');
      setIsSuccess(false);
      return;
    }

    fetch('http://localhost:5000/api/auth/reset-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: props.email,
        resetCode,
        newPassword
      })
    })
      .then(async (res) => {
        const data = await res.json();
        if (res.ok) {
          setMessage('Password reset completed.');
          setIsSuccess(true);
          setTimeout(() => props.onResetComplete(), 2000);
        } else {
          setMessage(data.message || 'Password reset failed.');
          setIsSuccess(false);
        }
      })
      .catch(() => {
        setMessage('Network error');
        setIsSuccess(false);
      });
  };

  const isFormComplete = resetCode.trim() && newPassword.trim() && reenterPassword.trim();

  return (
    <>
      <GlobalStyles
        styles={{
          html: { height: '100%', boxSizing: 'border-box', margin: 0, padding: 0, fontSize: 14 },
          body: { height: '100%', margin: 0, padding: 0, boxSizing: 'border-box', fontSize: 14 },
          '#root': { height: '100%', margin: 0, padding: 0, boxSizing: 'border-box', fontSize: 14 },
          '*': { boxSizing: 'border-box', fontSize: 14 }
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
          backgroundRepeat: 'no-repeat'
        }}
      >
        <Paper
          elevation={3}
          sx={{
            width: 480,
            maxWidth: '95vw',
            p: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            borderRadius: '16px',
            boxSizing: 'border-box',
            fontSize: 14
          }}
        >
          <Box sx={{ width: '100%' }}>
            <Typography variant="h5" align="center" fontWeight={700} mb={3} sx={{ fontSize: 14 }}>
              Reset Password
            </Typography>

            <form onSubmit={handleResetPassword}>
              <Typography sx={{ fontWeight: 500, fontSize: 14, mb: 0, lineHeight: 1.2 }}>
                Reset Code
              </Typography>
              <TextField
                value={resetCode}
                onInput={(e) => setResetCode((e.target as HTMLInputElement).value)}
                fullWidth
                margin="dense"
                required
                variant="outlined"
                placeholder="Reset Code"
                InputProps={{ sx: inputSx }}
                sx={textFieldSx}
                inputProps={{ style: { fontSize: 14 } }}
              />

              <Typography sx={{ fontWeight: 500, fontSize: 14, mb: 0, lineHeight: 1.2, mt: 2 }}>
                New Password
              </Typography>
              <TextField
                type="password"
                value={newPassword}
                onInput={(e) => setNewPassword((e.target as HTMLInputElement).value)}
                fullWidth
                margin="dense"
                required
                variant="outlined"
                placeholder="New Password"
                InputProps={{ sx: inputSx }}
                sx={textFieldSx}
                inputProps={{ style: { fontSize: 14 } }}
              />

              <Typography sx={{ fontWeight: 500, fontSize: 14, mb: 0, lineHeight: 1.2, mt: 2 }}>
                Re-enter New Password
              </Typography>
              <TextField
                type="password"
                value={reenterPassword}
                onInput={(e) => setReenterPassword((e.target as HTMLInputElement).value)}
                fullWidth
                margin="dense"
                required
                variant="outlined"
                placeholder="Re-enter New Password"
                InputProps={{ sx: inputSx }}
                sx={textFieldSx}
                inputProps={{ style: { fontSize: 14 } }}
              />

              <Box sx={{ mt: 2 }}>
                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  disabled={!isFormComplete || isSuccess}
                  sx={{
                    background: '#906aff',
                    color: 'white',
                    fontWeight: 700,
                    letterSpacing: 1,
                    fontSize: 14,
                    borderRadius: 2,
                    my: 1,
                    boxShadow: 'none',
                    textTransform: 'none'
                  }}
                >
                  Reset Password
                </Button>
              </Box>

              <Box sx={{ mt: 2 }}>
                {message && (
                  <Typography
                    color={isSuccess ? 'success.main' : 'error'}
                    align="center"
                    sx={{ fontSize: 14 }}
                  >
                    {message}
                  </Typography>
                )}
              </Box>
            </form>
          </Box>
        </Paper>
      </Box>
    </>
  );
};

export default ForgotPasswordReset;
