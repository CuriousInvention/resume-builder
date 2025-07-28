import { useState } from 'react';
import { login } from '../services/authService';
import { useNavigate } from 'react-router-dom';
import { TextField, Button, Typography } from '@mui/material';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    const user = await login(email, password);
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
      navigate('/dashboard');
    } else {
      alert('Invalid credentials');
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <Typography variant="h4">Login</Typography>
      <TextField fullWidth label="Email" onChange={e => setEmail(e.target.value)} />
      <TextField fullWidth label="Password" type="password" onChange={e => setPassword(e.target.value)} />
      <Button onClick={handleLogin} variant="contained" color="primary" style={{ marginTop: 10 }}>Login</Button>
    </div>
  );
}

export default Login;
