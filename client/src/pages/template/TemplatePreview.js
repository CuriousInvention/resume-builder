import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Typography,
  Container,
  Box,
  Button,
  CircularProgress,
  Card,
  CardMedia,
  CardContent,
  Stack
} from '@mui/material';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';

const TemplatePreview = () => {
  const { id } = useParams(); // templateId
  const navigate = useNavigate();
  const [template, setTemplate] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`http://localhost:5000/templates/${id}`)
      .then((res) => setTemplate(res.data))
      .catch((err) => console.error('Failed to load template:', err))
      .finally(() => setLoading(false));
  }, [id]);

  const handleUseTemplate = async () => {
    const newResume = {
      id: uuidv4(),
      templateId: id,
      name: '',
      email: '',
      skills: '',
      summary: ''
    };

    await axios.post('http://localhost:5000/resumes', newResume);
    navigate(`/resume/${newResume.id}`);
  };

  if (loading || !template) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="70vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="md">
      <Card sx={{ mt: 4 }}>
        <CardMedia
          component="img"
          height="400"
          image={template.previewImage}
          alt={template.name}
        />
        <CardContent>
          <Typography variant="h4" gutterBottom>
            {template.name}
          </Typography>
          <Typography variant="body1" gutterBottom>
            {template.description}
          </Typography>
          <Stack direction="row" spacing={2} mt={3}>
            <Button variant="contained" onClick={handleUseTemplate}>
              Use This Template
            </Button>
            <Button variant="outlined" onClick={() => navigate('/dashboard')}>
              Back to Dashboard
            </Button>
          </Stack>
        </CardContent>
      </Card>
    </Container>
  );
};

export default TemplatePreview;
