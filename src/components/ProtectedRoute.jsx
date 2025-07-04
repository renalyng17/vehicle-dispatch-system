import React, { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { AuthContext } from '../Context/AuthContext';
import LoadingSpinner from './LoadingSpinner';

export const ProtectedRoute = ({ allowedRoles }) => {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.user_type)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
};

// Usage in App.js:
// <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
//   <Route path="/admin/*" element={<AdminLayout />} />
// </Route>