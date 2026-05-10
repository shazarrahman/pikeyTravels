import axios from 'axios';

const instance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

instance.interceptors.request.use(
  (config) => {
    // Prefer provider token when present, else fallback to regular user token
    const provToken = localStorage.getItem('pikey_provider_token');
    const token = provToken || localStorage.getItem('pikey_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

instance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const provToken = localStorage.getItem('pikey_provider_token');
      // clear both tokens
      localStorage.removeItem('pikey_token');
      localStorage.removeItem('pikey_provider_token');
      localStorage.removeItem('pikey_user');
      localStorage.removeItem('pikey_provider');
      window.location.href = provToken ? '/provider/login' : '/login';
    }
    return Promise.reject(error);
  }
);

export default instance;
