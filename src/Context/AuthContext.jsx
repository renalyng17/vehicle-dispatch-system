import React, { createContext, useState, useEffect } from 'react';// ✅ make sure this path is correct
import { useNavigate } from 'react-router-dom';
import axiosInstance from "../axiosInstance";



export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const [authUser, setAuthUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = localStorage.getItem('user') || sessionStorage.getItem('user');
    if (user) {
      setAuthUser(JSON.parse(user));
    }
    setLoading(false);
  }, []);

  const login = async (email, password, rememberMe) => {
  try {
    const response = await axiosInstance.post("/auth/login", {
      email,
      password,
      rememberMe,
    });
    return { success: true, user: response.data.user };
  } catch (error) {
    console.error("Login error:", error);
    return { success: false, error: error.response?.data?.message || "Login failed" };
  }
};


  const logout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('accessToken');
    sessionStorage.removeItem('user');
    sessionStorage.removeItem('accessToken');
    setAuthUser(null);
    navigate('/login');
  };

  return (
    <AuthContext.Provider value={{ authUser, setAuthUser, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
