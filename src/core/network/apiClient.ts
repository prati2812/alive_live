import axios from 'axios';

// Currently placeholder, configure as per API requirements
const API_URL = 'https://api.example.com';

const apiClient = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use(
  async (config) => {
    // Inject auth token here if needed
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle global errors here
    return Promise.reject(error);
  }
);

export default apiClient;
