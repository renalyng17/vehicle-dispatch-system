import axios from "axios";
import { refreshToken } from "./utils/auth";

const baseURL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3001/api";

const getToken = () =>
  localStorage.getItem("token") || sessionStorage.getItem("token");

const setToken = (token) => {
  localStorage.setItem("token", token);
};

const axiosInstance = axios.create({
  baseURL,
  timeout: 10000,
  headers: { "Content-Type": "application/json" },
  withCredentials: true, // ✅ send cookies (refresh token/session)
});

// Request interceptor: attach token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: auto-refresh token on 401
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const newToken = await refreshToken();
        if (newToken) {
          setToken(newToken);
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return axiosInstance(originalRequest); // retry request
        }
      } catch (refreshError) {
        console.error("Token refresh failed:", refreshError);
        if (window.location.pathname !== "/login") {
          window.location.href = "/login"; // redirect if refresh fails
        }
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
