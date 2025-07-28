import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  TextField,
  Typography,
  Button,
  Container,
  Box,
  Stack,
  CircularProgress,
  Snackbar,
  Alert
} from '@mui/material';
import axios from 'axios';

const ResumeEditor = () => {
  const { id } = useParams(); // resume ID
  const navigate = useNavigate();
  const [resume, setResume] = useState(null);
  const [saving, setSaving] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  useEffect(() => {
    axios.get(`http://localhost:5000/resumes/${id}`)
      .then((res) => setResume(res.data))
      .catch((err) => console.error('Failed to load resume:', err));
  }, [id]);

  const handleChange = (e) => {
    setResume({ ...resume, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    setSaving(true);
    axios.put(`http://localhost:5000/resumes/${id}`, resume)
      .then(() => setSnackbarOpen(true))
      .finally(() => setSaving(false));
  };

  if (!resume) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="70vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" gutterBottom>
        Edit Resume
      </Typography>

      <Stack spacing={3}>
        <TextField
          label="Full Name"
          name="name"
          value={resume.name}
          onChange={handleChange}
          fullWidth
        />
        <TextField
          label="Email"
          name="email"
          value={resume.email}
          onChange={handleChange}
          fullWidth
        />
        <TextField
          label="Skills (comma-separated)"
          name="skills"
          value={resume.skills}
          onChange={handleChange}
          fullWidth
        />
        <TextField
          label="Summary"
          name="summary"
          value={resume.summary}
          multiline
          rows={4}
          onChange={handleChange}
          fullWidth
        />

        <Stack direction="row" spacing={2}>
          <Button variant="contained" onClick={handleSave} disabled={saving}>
            {saving ? 'Saving...' : 'Save'}
          </Button>
          <Button variant="outlined" color="secondary" onClick={() => navigate('/dashboard')}>
            Cancel
          </Button>
        </Stack>
      </Stack>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
      >
        <Alert severity="success" onClose={() => setSnackbarOpen(false)}>
          Resume saved successfully!
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default ResumeEditor;
