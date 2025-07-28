import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Typography, CircularProgress, Stack, Divider } from '@mui/material';
import axios from 'axios';

const Section = ({ title, children, styles = {} }) => (
  <Box mt={3}>
    <Typography sx={{ ...styles }}>{title}</Typography>
    <Box mt={1}>{children}</Box>
  </Box>
);

const Template = () => {
  const { id } = useParams(); // resume ID
  const [resume, setResume] = useState(null);
  const [layout, setLayout] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Step 1: Get resume by ID
    axios.get(`http://localhost:5000/resumes/${id}`)
      .then(res => {
        setResume(res.data);
        // Step 2: Get corresponding template layout
        return axios.get(`http://localhost:5000/templates/${res.data.templateId}`);
      })
      .then(templateRes => {
        setLayout(templateRes.data.layout);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  if (loading || !resume || !layout) {
    return (
      <Box height="80vh" display="flex" alignItems="center" justifyContent="center">
        <CircularProgress />
      </Box>
    );
  }

  const { order, styles } = layout;

  return (
    <Box p={4} sx={{ backgroundColor: '#fff' }}>
      {order.includes('header') && (
        <Box textAlign={styles?.header?.align || 'left'} bgcolor={styles?.header?.bgColor || 'transparent'} p={2}>
          <Typography variant="h4" sx={{ fontSize: styles?.header?.fontSize || '24px' }}>
            {resume.name}
          </Typography>
          <Typography>{resume.email} | {resume.phone}</Typography>
        </Box>
      )}

      <Divider sx={{ my: 2 }} />

      {order.includes('summary') && (
        <Section title="Summary" styles={styles?.sectionTitle}>
          <Typography>{resume.summary}</Typography>
        </Section>
      )}

      {order.includes('skills') && (
        <Section title="Skills" styles={styles?.sectionTitle}>
          <Stack direction="row" spacing={1} flexWrap="wrap">
            {resume.skills?.map((skill, idx) => (
              <Box key={idx} px={2} py={0.5} bgcolor="#e0f7fa" borderRadius={1}>{skill}</Box>
            ))}
          </Stack>
        </Section>
      )}

      {order.includes('education') && (
        <Section title="Education" styles={styles?.sectionTitle}>
          {resume.education?.map((edu, idx) => (
            <Box key={idx}>
              <Typography fontWeight="bold">{edu.degree}</Typography>
              <Typography>{edu.institution} ({edu.startYear} - {edu.endYear})</Typography>
            </Box>
          ))}
        </Section>
      )}

      {order.includes('experience') && (
        <Section title="Experience" styles={styles?.sectionTitle}>
          {resume.experience?.map((exp, idx) => (
            <Box key={idx}>
              <Typography fontWeight="bold">{exp.position} - {exp.company}</Typography>
              <Typography variant="body2">{exp.startDate} to {exp.endDate}</Typography>
              <Typography>{exp.description}</Typography>
            </Box>
          ))}
        </Section>
      )}

      {order.includes('projects') && (
        <Section title="Projects" styles={styles?.sectionTitle}>
          {resume.projects?.map((proj, idx) => (
            <Box key={idx}>
              <Typography fontWeight="bold">{proj.name}</Typography>
              <Typography>{proj.description}</Typography>
              <Typography variant="caption">Tech: {proj.techStack?.join(', ')}</Typography>
            </Box>
          ))}
        </Section>
      )}
    </Box>
  );
};

export default Template;
