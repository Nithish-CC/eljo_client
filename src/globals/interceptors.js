import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_BASE_URL, // our API base URL
});

// Request interceptor for adding the bearer token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token'); // Assuming you store the token in localStorage
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      config.headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, GET, OPTIONS, PUT, DELETE',
        'Access-Control-Allow-Headers': 'Content-Type, Accept, Origin, X-Requested-With',
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api; 