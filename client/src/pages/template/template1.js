import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  Typography,
  Box,
  Divider,
  CircularProgress,
  Container,
  Stack
} from '@mui/material';
import axios from 'axios';

const Template1 = () => {
  const { id } = useParams(); // resume id
  const [resume, setResume] = useState(null);

  useEffect(() => {
    axios.get(`http://localhost:5000/resumes/${id}`)
      .then((res) => setResume(res.data))
      .catch((err) => console.error('Failed to load resume:', err));
  }, [id]);

  if (!resume) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="80vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="md" sx={{ padding: 4, backgroundColor: '#fff', boxShadow: 2 }}>
      {/* Header */}
      <Box textAlign="center" mb={3}>
        <Typography variant="h4" fontWeight="bold">{resume.name || 'Your Name'}</Typography>
        <Typography variant="subtitle1">{resume.email || 'youremail@example.com'}</Typography>
      </Box>

      <Divider sx={{ my: 2 }} />

      {/* Summary */}
      <Box mb={3}>
        <Typography variant="h6" fontWeight="medium">Summary</Typography>
        <Typography variant="body1">
          {resume.summary || 'A brief summary of your qualifications, career goals, and experience.'}
        </Typography>
      </Box>

      {/* Skills */}
      <Box mb={3}>
        <Typography variant="h6" fontWeight="medium">Skills</Typography>
        <Stack direction="row" spacing={1} flexWrap="wrap">
          {resume.skills
            ? resume.skills.split(',').map((skill, i) => (
                <Box
                  key={i}
                  px={2}
                  py={0.5}
                  bgcolor="#e0f2f1"
                  borderRadius={1}
                  fontSize={14}
                  m={0.5}
                >
                  {skill.trim()}
                </Box>
              ))
            : <Typography variant="body2">No skills added</Typography>}
        </Stack>
      </Box>

      {/* More sections like Education, Work Experience can be added here */}
    </Container>
  );
};

export default Template1;
