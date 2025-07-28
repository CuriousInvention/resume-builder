// src/pages/Welcome.jsx
import React from 'react';
import { Typography, Button, Stack } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Welcome = () => {
  const navigate = useNavigate();

  return (
    <div style={{ padding: 40, textAlign: 'center' }}>
      <Typography variant="h3" gutterBottom>
        Welcome to Resume Builder
      </Typography>
      <Typography variant="subtitle1" gutterBottom>
        Build your professional resume with ease.
      </Typography>

      <Stack direction="row" spacing={2} justifyContent="center" sx={{ marginTop: 3 }}>
        <Button variant="contained" color="primary" onClick={() => navigate('/login')}>
          Login
        </Button>
        <Button variant="outlined" onClick={() => navigate('/signup')}>
          Signup
        </Button>
      </Stack>
    </div>
  );
};

export default Welcome;
