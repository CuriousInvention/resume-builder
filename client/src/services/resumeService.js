import axios from 'axios';

const API = 'http://localhost:5000/resumes';

export const saveResume = (resume) => axios.post(API, resume);
export const updateResume = (id, resume) => axios.put(`${API}/${id}`, resume);
export const getResume = (id) => axios.get(`${API}/${id}`);
export const getAllResumes = () => axios.get(API);

export const getSuggestions = async () => {
  const res = await axios.get(api);
  return res.data;
};
