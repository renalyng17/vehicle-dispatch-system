import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from './Context/AuthProvider';
import { ProtectedRoute } from "./components/ProtectedRoute";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import Unauthorized from "./pages/Unauthorized";
import AdminDashboard from "./pages/Admin/Dashboard";
import ClientDashboard from "./pages/Client/Client_Dashboard";
import Layout from "./components/Layout";

const App = () => {
  return (
    <AuthProvider>
      <Routes>
        {/* Public routes with layout */}
        <Route element={<Layout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/unauthorized" element={<Unauthorized />} />
        </Route>

        {/* Admin protected routes */}
        <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
          <Route path="/admin/*" element={<AdminDashboard />} />
        </Route>

        {/* Client protected routes */}
        <Route element={<ProtectedRoute allowedRoles={['client']} />}>
          <Route path="/client/*" element={<ClientDashboard />} />
        </Route>

        {/* Default redirects */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </AuthProvider>
  );
};

export default App;