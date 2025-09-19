// src/Context/AuthProvider.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { AuthContext } from './AuthContext';

const AuthProvider = ({ children }) => {
  const [authUser, setAuthUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      setError(null);
      const token = localStorage.getItem('token');
      
      if (!token) {
        setIsLoading(false);
        return;
      }

      const response = await axios.get('/api/auth/verify', {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        withCredentials: true
      });
      
      setAuthUser(response.data.user);
      
    } catch (error) {
      console.error('Auth verification failed:', error);
      localStorage.removeItem('token');
      setAuthUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (credentials) => {
    try {
      setError(null);
      
      const response = await axios.post('api/auth/login', credentials, {
        headers: {
          'Content-Type': 'application/json'
        },
        withCredentials: true
      });
      
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        setAuthUser(response.data.user);
        return { success: true };
      }
    } catch (error) {
      const errorMsg = error.response?.data?.error || 'Login failed';
      setError(errorMsg);
      return { 
        success: false, 
        error: errorMsg 
      };
    }
  };

  const logout = async () => {
    try {
      await axios.post('/api/auth/logout', {}, { 
        withCredentials: true 
      });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('token');
      setAuthUser(null);
      setError(null);
    }
  };

  const value = {
    authUser,
    login,
    logout,
    isLoading,
    error,
    checkAuthStatus
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;