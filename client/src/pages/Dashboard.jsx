import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Typography,
  Button,
  Stack,
  Grid,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  CircularProgress,
  Box,
} from '@mui/material';
import axios from 'axios';

const Dashboard = () => {
  const navigate = useNavigate();
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    axios.get('http://localhost:5000/templates') // Adjust API URL if needed
      .then((res) => setTemplates(res.data))
      .catch((err) => console.error('Failed to fetch templates:', err))
      .finally(() => setLoading(false));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/');
  };

  const handleEdit = (id) => navigate(`/resume/${id}`);
  const handlePreview = (id) => navigate(`/template/${id}`);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="80vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box padding={4}>
      <Typography variant="h4" gutterBottom>
        {user ? `Hello, ${user.email}` : 'Welcome!'}
      </Typography>

      <Stack direction="row" spacing={2} sx={{ mt: 2, mb: 4 }}>
        <Button variant="contained" color="primary" onClick={() => navigate('/templates')}>
          Create New Resume
        </Button>
        <Button variant="outlined" color="error" onClick={handleLogout}>
          Logout
        </Button>
      </Stack>

      <Typography variant="h5" gutterBottom>
        Available Resume Templates
      </Typography>

      <Grid container spacing={3}>
        {templates.map((tpl) => (
          <Grid item xs={12} sm={6} md={4} key={tpl.id}>
            <Card sx={{ height: '100%' }}>
              <CardMedia
                component="img"
                height="180"
                image={tpl.previewImage || '/placeholder.jpg'} // previewImage should come from API
                alt={tpl.name}
              />
              <CardContent>
                <Typography variant="h6" gutterBottom>{tpl.name}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {tpl.description || 'A clean, modern resume template with customizable fields.'}
                </Typography>
              </CardContent>
              <CardActions>
                <Button size="small" onClick={() => handlePreview(tpl.id)}>Preview</Button>
                <Button size="small" variant="contained" onClick={() => handleEdit(tpl.id)}>Edit</Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Dashboard;
