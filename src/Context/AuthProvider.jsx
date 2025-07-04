import React, { useEffect, useState } from 'react';
import { AuthContext } from './AuthContext';
import axiosInstance from "../axiosInstance";


export const AuthProvider = ({ children }) => {
  const [authUser, setAuthUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const login = async (email, password, rememberMe) => {
    try {
      const res = await axiosInstance.post('/auth/login', {
        email,
        password,
        rememberMe,
      });

      const user = res.data.user;

      if (rememberMe) {
        localStorage.setItem('user', JSON.stringify(user));
      } else {
        sessionStorage.setItem('user', JSON.stringify(user));
      }

      setAuthUser(user);
      return { success: true, user };
    } catch (err) {
      console.error('Login error:', err);
      return {
        success: false,
        error: err.response?.data?.message || 'Login failed',
      };
    }
  };

  useEffect(() => {
    const storedUser = localStorage.getItem('user') || sessionStorage.getItem('user');
    if (storedUser) setAuthUser(JSON.parse(storedUser));
    setLoading(false);
  }, []);

  return (
    <AuthContext.Provider value={{ authUser, setAuthUser, login, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
