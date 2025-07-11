// components/ClientRoute.js
import { Navigate, Outlet } from 'react-router-dom';
import { isClient } from '../utils/auth';

const ClientRoute = () => {
  return isClient() ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ClientRoute;