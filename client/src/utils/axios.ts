import axios from 'axios';

const clientUrl = import.meta.env.PROD
  ? 'https://biolink-mevn.onrender.com/api/v1'
  : '/api/v1';

const ax = axios.create({
  baseURL: clientUrl,
  withCredentials: true,
});

// Add request interceptor for debugging
ax.interceptors.request.use((config) => {
  console.log(
    'Request:',
    config.method?.toUpperCase(),
    config.baseURL! + config.url
  );
  return config;
});

// Add response interceptor for debugging
ax.interceptors.response.use(
  (response) => {
    console.log('Response:', response.status, response.config.url);
    return response;
  },
  (error) => {
    console.error(
      'Response Error:',
      error.response?.status,
      error.config?.url,
      error.message
    );
    return Promise.reject(error);
  }
);

export default ax;
