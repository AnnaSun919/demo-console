import axios from 'axios';
import { API_BASE_URL } from "../config";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000, // 10 seconds
});

 apiClient.interceptors.request.use(
  (config) => {
    //const token = localStorage.getItem('user_token'); // Or use a state manager like Redux/Pinia
		const token = "v3.local.p8MTLxS6bkq97NFsOlroDI8UFmt9FVxxPEu_2nX1BN6C9uAR7uNjV4RyxP5vJLZYeoM1v9Q-EoAzKTRYlstof5f2K-LPctA6CG_uQVrYX3Tjd7k6wkMY4eLIoabYMQMzOl755-Fd2imK1UbY0JFVQA5l7_sVlm6NCFBf-viIJrLHd6wDjVOTxwj26EkMgz3KXXXagi_jOEutXs2vn87I48wGmC0.UE9DLVBBU0VUTw";
		console.log("testing token")
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