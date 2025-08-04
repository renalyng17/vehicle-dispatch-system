// src/context/AuthProvider.jsx
import React, { useState, useEffect } from 'react';
import axiosInstance from "../axiosInstance";
import { AuthContext } from './AuthContext'; // Import from the new file

// AuthProvider.jsx
export const AuthProvider = ({ children }) => {
  const [authUser, setAuthUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Initialize auth state from storage
  // In AuthProvider.jsx
useEffect(() => {
  const storedUser = localStorage.getItem('user') || sessionStorage.getItem('user');
  const storedToken = localStorage.getItem('token') || sessionStorage.getItem('token');
  
  if (storedUser && storedToken) {
    setAuthUser(JSON.parse(storedUser));
    axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
  }
  setLoading(false);
}, []);

// Context/AuthProvider.jsx
// In your AuthProvider
// In your AuthProvider.jsx
const login = async (email, password, rememberMe) => {
  try {
    const res = await axiosInstance.post('/auth/login', { email, password, rememberMe });
    const { user, token } = res.data;
    
    // Store in appropriate storage
    const storage = rememberMe ? localStorage : sessionStorage;
    storage.setItem('user', JSON.stringify(user));
    storage.setItem('token', token);
    
    // Update axios defaults
    axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    
    // Update state
    setAuthUser(user);
    
    return { success: true, user };
  } catch (err) {
    return { success: false, error: err.response?.data?.message || 'Login failed' };
  }
};
  return (
    <AuthContext.Provider value={{ authUser, loading, login,  setAuthUser }}>
      {children}
    </AuthContext.Provider>
  );
};