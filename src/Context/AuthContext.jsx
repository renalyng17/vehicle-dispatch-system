// src/Context/AuthContext.jsx
import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      try {
        const token = localStorage.getItem('token') || sessionStorage.getItem('token');
        const userData = localStorage.getItem('user') || sessionStorage.getItem('user');
        
        if (token && userData) {
          const parsedUser = JSON.parse(userData);
          setUser({
            id: parsedUser.user_id || parsedUser.id,
            user_id: parsedUser.user_id || parsedUser.id,
            user_type: parsedUser.user_type,
            email: parsedUser.email,
            first_name: parsedUser.first_name,
            last_name: parsedUser.last_name,
            ...parsedUser
          });
        }
      } catch (error) {
        console.error('Auth check error:', error);
        logout();
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email, password, rememberMe = false) => {
    try {
      setLoading(true);
      
      const response = await fetch('http://localhost:3001/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
        credentials: 'include'
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Login failed: ${response.status}`);
      }

      const data = await response.json();
      
      const userData = {
        id: data.user.user_id || data.user.id,
        user_id: data.user.user_id || data.user.id,
        user_type: data.user.user_type,
        email: data.user.email,
        first_name: data.user.first_name,
        last_name: data.user.last_name,
        ...data.user
      };

      const storage = rememberMe ? localStorage : sessionStorage;
      storage.setItem('token', data.token);
      storage.setItem('user', JSON.stringify(userData));
      
      setUser(userData);
      return { success: true, user: userData };

    } catch (error) {
      console.error('Login error:', error);
      return { 
        success: false, 
        error: error.message || 'Login failed. Please try again.' 
      };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('user');
    setUser(null);
    
    fetch('http://localhost:3001/api/auth/logout', {
      method: 'POST',
      credentials: 'include'
    }).catch(console.error);
  };

  // ✅ NEW: Update user data in context and storage
  const updateUser = (updatedUserData) => {
    // Normalize to match expected user shape
    const normalizedUser = {
      id: updatedUserData.user_id || updatedUserData.id,
      user_id: updatedUserData.user_id || updatedUserData.id,
      user_type: updatedUserData.user_type,
      email: updatedUserData.email,
      first_name: updatedUserData.first_name,
      last_name: updatedUserData.last_name,
      ...updatedUserData
    };

    setUser(normalizedUser);

    // Persist to whichever storage is active
    if (localStorage.getItem('user')) {
      localStorage.setItem('user', JSON.stringify(normalizedUser));
    } else {
      sessionStorage.setItem('user', JSON.stringify(normalizedUser));
    }
  };

  const isAuthenticated = () => {
    return !!(user && (user.id || user.user_id));
  };

  const value = {
    user,
    login,
    logout,
    updateUser, // ✅ Expose it
    loading,
    isAuthenticated
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;