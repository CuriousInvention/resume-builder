import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  TextField, Typography, Button, Container, Box, Stack,
  CircularProgress, Snackbar, Alert, Grid
} from '@mui/material';
import axios from 'axios';
import html2pdf from 'html2pdf.js';
import Template from './template/Template'

const ResumeEditor = () => {
  const { id } = useParams();
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
      .then(() => {
        setSnackbarOpen(true);
        setTimeout(() => {
          const element = document.getElementById('resume-pdf');
          if (element) {
            html2pdf().set({
              margin: 0,
              filename: `${resume.name || 'resume'}.pdf`,
              html2canvas: { scale: 2 },
              jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
            }).from(element).save();
          } else {
            console.error("resume-pdf element not found");
          }
        }, 800); // delay to ensure Template is fully rendered
      })
      .finally(() => setSaving(false));
  };




  const handleNestedChange = (section, index, field, value) => {
    const updated = [...(resume[section] || [])];
    if (!updated[index]) updated[index] = {}; // initialize if missing
    updated[index] = {
      ...updated[index],
      [field]: value
    };
    setResume(prev => ({
      ...prev,
      [section]: updated
    }));
  };


  if (!resume) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="70vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>Edit Resume</Typography>

      <Stack spacing={3}>
        {/* Personal Info */}
        <TextField label="Full Name" name="name" value={resume.name || ''} onChange={handleChange} fullWidth />
        <TextField label="Email" name="email" value={resume.email || ''} onChange={handleChange} fullWidth />
        <TextField label="Phone" name="phone" value={resume.phone || ''} onChange={handleChange} fullWidth />
        <TextField label="LinkedIn" name="linkedin" value={resume.linkedin || ''} onChange={handleChange} fullWidth />
        <TextField label="GitHub" name="github" value={resume.github || ''} onChange={handleChange} fullWidth />
        <TextField label="Portfolio" name="portfolio" value={resume.portfolio || ''} onChange={handleChange} fullWidth />
        <TextField label="Summary" name="summary" value={resume.summary || ''} onChange={handleChange} multiline rows={3} fullWidth />
        <TextField label="Skills (comma-separated)" name="skills" value={resume.skills || ''} onChange={handleChange} fullWidth />


        {/* Education */}
        <Typography variant="h6">Education</Typography>
        {resume.education?.map((edu, i) => (
          <Grid container spacing={2} key={i}>
            <Grid item xs={6}>
              <TextField label="Institution" fullWidth value={edu.institution} onChange={e => handleNestedChange("education", i, "institution", e.target.value)} />
            </Grid>
            <Grid item xs={6}>
              <TextField label="Degree" fullWidth value={edu.degree} onChange={e => handleNestedChange("education", i, "degree", e.target.value)} />
            </Grid>
            <Grid item xs={6}>
              <TextField label="Start Year" fullWidth value={edu.startYear} onChange={e => handleNestedChange("education", i, "startYear", e.target.value)} />
            </Grid>
            <Grid item xs={6}>
              <TextField label="End Year" fullWidth value={edu.endYear} onChange={e => handleNestedChange("education", i, "endYear", e.target.value)} />
            </Grid>
          </Grid>
        ))}

        <Button onClick={() => {
          setResume(prev => ({
            ...prev,
            education: [...(prev.education || []), {
              institution: '',
              degree: '',
              startYear: '',
              endYear: ''
            }]
          }));
        }}>+ Add Education</Button>

        {/* Experience */}
        <Typography variant="h6">Experience</Typography>
        {resume.experience?.map((exp, i) => (
          <Stack spacing={2} key={i}>
            <TextField label="Company" value={exp.company} onChange={e => handleNestedChange("experience", i, "company", e.target.value)} fullWidth />
            <TextField label="Position" value={exp.position} onChange={e => handleNestedChange("experience", i, "position", e.target.value)} fullWidth />
            <TextField label="Start Date" value={exp.startDate} onChange={e => handleNestedChange("experience", i, "startDate", e.target.value)} fullWidth />
            <TextField label="End Date" value={exp.endDate} onChange={e => handleNestedChange("experience", i, "endDate", e.target.value)} fullWidth />
            <TextField label="Description" value={exp.description} onChange={e => handleNestedChange("experience", i, "description", e.target.value)} fullWidth multiline rows={2} />
          </Stack>
        ))}

        <Button onClick={() => {
          setResume(prev => ({
            ...prev,
            experience: [...(prev.experience || []), {
              company: '',
              position: '',
              startDate: '',
              endDate: '',
              description: ''
            }]
          }));
        }}>
          + Add Experience
        </Button>


        {/* Projects */}
        <Typography variant="h6">Projects</Typography>
        {resume.projects?.map((proj, i) => (
          <Stack spacing={2} key={i}>
            <TextField label="Title" value={proj.title} onChange={e => handleNestedChange("projects", i, "title", e.target.value)} fullWidth />
            <TextField label="Description" value={proj.description} onChange={e => handleNestedChange("projects", i, "description", e.target.value)} fullWidth />
            <TextField label="Link" value={proj.link} onChange={e => handleNestedChange("projects", i, "link", e.target.value)} fullWidth />
          </Stack>
        ))}

        <Button onClick={() => {
          setResume(prev => ({
            ...prev,
            projects: [...(prev.projects || []), {
              title: '',
              description: '',
              link: '',
              techStack: []
            }]
          }));
        }}>
          + Add Project
        </Button>


        {/* Certifications */}
        <Typography variant="h6">Certifications</Typography>
        {resume.certifications?.map((cert, i) => (
          <Grid container spacing={2} key={i}>
            <Grid item xs={6}>
              <TextField label="Title" fullWidth value={cert.title} onChange={e => handleNestedChange("certifications", i, "title", e.target.value)} />
            </Grid>
            <Grid item xs={4}>
              <TextField label="Issuer" fullWidth value={cert.issuer} onChange={e => handleNestedChange("certifications", i, "issuer", e.target.value)} />
            </Grid>
            <Grid item xs={2}>
              <TextField label="Year" fullWidth value={cert.year} onChange={e => handleNestedChange("certifications", i, "year", e.target.value)} />
            </Grid>
          </Grid>
        ))}

        {/* Languages & Interests */}
        <TextField label="Languages (comma-separated)" name="languages" value={resume.languages?.join(', ') || ''} onChange={(e) => setResume({ ...resume, languages: e.target.value.split(',').map(x => x.trim()) })} fullWidth />
        <TextField label="Interests (comma-separated)" name="interests" value={resume.interests?.join(', ') || ''} onChange={(e) => setResume({ ...resume, interests: e.target.value.split(',').map(x => x.trim()) })} fullWidth />

        {/* Actions */}
        <Stack direction="row" spacing={2}>
          <Button variant="contained" onClick={handleSave} disabled={saving}>
            {saving ? 'Saving...' : 'Save'}
          </Button>
          <Button variant="outlined" onClick={() => navigate('/dashboard')}>Cancel</Button>
        </Stack>
      </Stack>

      {/* Hidden printable view */}
      <Box id="resume-pdf" sx={{ visibility: 'hidden', position: 'absolute', top: 0, left: 0, width: '100%', zIndex: -1 }}>
        <Template resumeData={resume} />
      </Box>

      <Snackbar open={snackbarOpen} autoHideDuration={3000} onClose={() => setSnackbarOpen(false)}>
        <Alert severity="success" onClose={() => setSnackbarOpen(false)}>
          Resume updated successfully!
        </Alert>
      </Snackbar>
    </Container>

  );
};

export default ResumeEditor;
