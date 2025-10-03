import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from './Context/AuthProvider';
import { ProtectedRoute } from "./components/ProtectedRoute";

import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import Unauthorized from "./pages/Unauthorized";

// Admin
import AdminDashboard from "./pages/Admin/Dashboard";
import AdminHome from "./pages/Admin/Home";
import AdminCalendar from "./pages/Admin/Calendar";
import AdminRequests from "./pages/Admin/Requests";
import AdminManagement from "./pages/Admin/Management";
import AdminProfile from "./pages/Admin/Profile";

// Client
import Client_Dashboard from "./pages/Client/Client_Dashboard";
import ClientHome from "./pages/Client/Client_Home";
import ClientRequests from "./pages/Client/Client_Requests";
import ClientProfile from "./pages/Client/Client_Profile";

// Layout
import Layout from "./components/Layout";

const App = () => {
  return (
    <AuthProvider>
      <Routes>
        {/* Public routes */}
        <Route element={<Layout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/unauthorized" element={<Unauthorized />} />
        </Route>

        {/* Admin routes */}
        <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
          <Route path="/admin" element={<AdminDashboard />}>
            <Route index element={<AdminHome />} />
            <Route path="home" element={<AdminHome />} />
            <Route path="calendar" element={<AdminCalendar />} />
            <Route path="requests" element={<AdminRequests />} />
            <Route path="management" element={<AdminManagement />} />
            <Route path="profile" element={<AdminProfile />} />
            <Route path="*" element={<Navigate to="/admin/home" replace />} />
          </Route>
        </Route>

        {/* Client routes */}
        <Route element={<ProtectedRoute allowedRoles={['client']} />}>
          <Route path="/client" element={<Client_Dashboard />}>
            <Route index element={<ClientHome />} />
            <Route path="home" element={<ClientHome />} />
            <Route path="requests" element={<ClientRequests />} />
            <Route path="profile" element={<ClientProfile />} />
            <Route path="*" element={<Navigate to="/client/home" replace />} />
          </Route>
        </Route>

        {/* Global redirects */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </AuthProvider>
  );
};

export default App;