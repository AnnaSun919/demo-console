import axios from 'axios';
import { API_BASE_URL } from "../config";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000, // 10 seconds
});

 apiClient.interceptors.request.use(
  (config) => {
    const auth_token = localStorage.getItem('auth_token');
    if (auth_token) {
      const token = JSON.parse(auth_token)
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default apiClient;