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

const Template = ({ resumeData, id: externalId, hideLoading = false }) => {
  const { id: routeId } = useParams();
  const id = externalId || routeId;

  const [resume, setResume] = useState(null);
  const [layout, setLayout] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (resumeData) {
      setResume(resumeData);
      axios.get(`http://localhost:5000/templates/${resumeData.templateId}`)
        .then(templateRes => setLayout(templateRes.data.layout))
        .catch(console.error)
        .finally(() => setLoading(false));
    } else {
      axios.get(`http://localhost:5000/resumes/${id}`)
        .then(res => {
          setResume(res.data);
          return axios.get(`http://localhost:5000/templates/${res.data.templateId}`);
        })
        .then(templateRes => setLayout(templateRes.data.layout))
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [id, resumeData]);

  if ((loading || !resume || !layout) && !hideLoading) {
    return (
      <Box height="80vh" display="flex" alignItems="center" justifyContent="center">
        <CircularProgress />
      </Box>
    );
  }

  if (!resume || !layout) return null;

  const { order, styles } = layout;

  return (
    <Box p={4} sx={{ backgroundColor: '#fff' }}>
      {/* Header */}
      {order.includes('header') && (
        <Box
          textAlign={styles?.header?.align || 'left'}
          bgcolor={styles?.header?.bgColor || 'transparent'}
          p={2}
        >
          <Typography variant="h4" sx={{ fontSize: styles?.header?.fontSize || '24px' }}>
            {resume.name}
          </Typography>
          <Typography>{resume.email} | {resume.phone}</Typography>
        </Box>
      )}

      <Divider sx={{ my: 2 }} />

      {/* Summary */}
      {order.includes('summary') && (
        <Section title="Summary" styles={styles?.sectionTitle}>
          <Typography>{resume.summary}</Typography>
        </Section>
      )}

      {/* Skills */}
      {order.includes('skills') && (
        <Section title="Skills" styles={styles?.sectionTitle}>
          <Stack direction="row" spacing={1} flexWrap="wrap">
            {(Array.isArray(resume.skills)
              ? resume.skills
              : resume.skills?.split(',') || []).map((skill, idx) => (
                <Box
                  key={idx}
                  px={2}
                  py={0.5}
                  bgcolor="#e0f7fa"
                  borderRadius={1}
                  fontSize="14px"
                >
                  {skill.trim()}
                </Box>
              ))}
          </Stack>
        </Section>
      )}

      {/* Education */}
      {order.includes('education') && (
        <Section title="Education" styles={styles?.sectionTitle}>
          {resume.education?.map((edu, idx) => (
            <Box key={idx} mb={1}>
              <Typography fontWeight="bold">{edu.degree}</Typography>
              <Typography>{edu.institution} ({edu.startYear} - {edu.endYear})</Typography>
            </Box>
          ))}
        </Section>
      )}

      {/* Experience */}
      {order.includes('experience') && (
        <Section title="Experience" styles={styles?.sectionTitle}>
          {resume.experience?.map((exp, idx) => (
            <Box key={idx} mb={1}>
              <Typography fontWeight="bold">{exp.position} - {exp.company}</Typography>
              <Typography variant="body2">{exp.startDate} to {exp.endDate}</Typography>
              <Typography>{exp.description}</Typography>
            </Box>
          ))}
        </Section>
      )}

      {/* Projects */}
      {order.includes('projects') && (
        <Section title="Projects" styles={styles?.sectionTitle}>
          {resume.projects?.map((proj, idx) => (
            <Box key={idx} mb={1}>
              <Typography fontWeight="bold">{proj.name}</Typography>
              <Typography>{proj.description}</Typography>
              {proj.techStack?.length > 0 && (
                <Typography variant="caption">Tech: {proj.techStack.join(', ')}</Typography>
              )}
            </Box>
          ))}
        </Section>
      )}
    </Box>
  );
};

export default Template;
