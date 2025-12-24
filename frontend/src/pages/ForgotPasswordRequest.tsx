import * as React from 'react';
import { TextField, Button, Box, Typography, Paper, GlobalStyles } from '@mui/material';

interface ForgotPasswordRequestProps {
  onOTPSent: (email: string) => void;
}

const ForgotPasswordRequest: React.FC<ForgotPasswordRequestProps> = (props) => {
  const [email, setEmail] = React.useState('');
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

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage('');
    setIsSuccess(false);

    fetch('http://localhost:5000/api/auth/forgot-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    })
      .then(async (res) => {
        const data = await res.json();
        if (res.ok) {
          setMessage('Code sent to your email');
          setIsSuccess(true);
          setTimeout(() => props.onOTPSent(email), 8000);
        } else {
          setMessage(data.message || 'Failed to send Code');
          setIsSuccess(false);
        }
      })
      .catch(() => {
        setMessage('Network error');
        setIsSuccess(false);
      });
  };

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
              Forgot Password
            </Typography>

            <form onSubmit={handleSubmit}>
              <Typography sx={{ fontWeight: 500, fontSize: 14, mb: 0, lineHeight: 1.2 }}>
                Email
              </Typography>
              <TextField
                type="email"
                value={email}
                onInput={(e) => setEmail((e.target as HTMLInputElement).value)}
                fullWidth
                margin="dense"
                required
                variant="outlined"
                placeholder="Email"
                InputProps={{ sx: inputSx }}
                sx={textFieldSx}
                inputProps={{ style: { fontSize: 14 } }}
              />

              <Box sx={{ mt: 2 }}>
                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  disabled={!email}
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
                  Send Code
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

export default ForgotPasswordRequest;
