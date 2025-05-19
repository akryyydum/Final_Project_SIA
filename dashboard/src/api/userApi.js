import axios from 'axios';

const USER_API_BASE = 'http://localhost:5000/api/users';

export const loginUser = ({ email, password }) =>
  axios.post(`${USER_API_BASE}/login`, { email, password });

export const registerUser = ({ name, email, password }) =>
  axios.post(`${USER_API_BASE}/register`, { name, email, password });
