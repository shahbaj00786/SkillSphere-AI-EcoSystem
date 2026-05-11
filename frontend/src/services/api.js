import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api/v1',
});

// attach token to every request automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.token = token;
  }
  return config;
});

export default api;