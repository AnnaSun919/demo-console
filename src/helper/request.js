import axios from 'axios';
import LocalStorageHelper from './local_storage_helper';

const apiClient = axios.create({
  baseURL: '/api',
  timeout: 10000, // 10 seconds
});

 apiClient.interceptors.request.use(
  (config) => {
    const token = LocalStorageHelper.getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default apiClient;