// components/AdminRoute.js
import { Navigate, Outlet } from 'react-router-dom';
import { isAdmin } from '../utils/auth';

const AdminRoute = () => {
  return isAdmin() ? <Outlet /> : <Navigate to="/login" replace />;
};

export default AdminRoute;