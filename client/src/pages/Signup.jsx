import React, { useState } from 'react';
import { signup } from '../services/authService';
import { useNavigate } from 'react-router-dom';
import { TextField, Button, Typography } from '@mui/material';

const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSignup = async () => {
    await signup({ email, password });
    navigate('/login');
  };

  return (
    <div style={{ padding: 20 }}>
      <Typography variant="h4">Signup</Typography>
      <TextField fullWidth label="Email" onChange={e => setEmail(e.target.value)} />
      <TextField fullWidth label="Password" type="password" onChange={e => setPassword(e.target.value)} />
      <Button onClick={handleSignup} variant="contained" color="primary" style={{ marginTop: 10 }}>Signup</Button>
    </div>
  );
};

export default Signup;
