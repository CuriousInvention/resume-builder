import axios from 'axios';

const API = 'http://localhost:5000/users';

export const signup = (user) => axios.post(API, user);

export const login = async (email, password) => {
  const res = await axios.get(`${API}?email=${email}&password=${password}`);
  return res.data.length > 0 ? res.data[0] : null;
};
