// src/axiosInstance.js
import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:3000/api/auth', // change if your backend uses a different port
  withCredentials: true, // optional: if using cookies
});

export default axiosInstance;
