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

// Response interceptor - handle token expiration
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401 || error.response?.status === 403) {
      // Token expired or invalid - clear storage and redirect to login
      localStorage.removeItem('auth_token');
      localStorage.removeItem('auth_state');
      localStorage.removeItem('auth_role');
      localStorage.removeItem('auth_user_info');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default apiClient;