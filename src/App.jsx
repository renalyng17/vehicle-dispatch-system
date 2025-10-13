// src/App.jsx
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./Context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import ErrorBoundary from "./components/ErrorBoundary";

import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import Unauthorized from "./pages/Unauthorized";

// Admin Components
import AdminDashboard from "./pages/Admin/Dashboard";
import AdminHome from "./pages/Admin/Home";
import AdminCalendar from "./pages/Admin/Calendar";
import AdminRequests from "./pages/Admin/Requests";
import AdminManagement from "./pages/Admin/Management";
import AdminProfile from "./pages/Admin/Profile";

// Client Components  
import Client_Dashboard from "./pages/Client/Client_Dashboard";
import ClientHome from "./pages/Client/ClientHome";
import ClientRequests from "./pages/Client/Client_Requests";
import ClientProfile from "./pages/Client/Client_Profile";

// Layout
import Layout from "./components/Layout";

const App = () => {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/unauthorized" element={<Unauthorized />} />

          {/* Admin protected routes */}
          <Route 
            path="/admin/*" 
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          >
            <Route index element={<AdminHome />} />
            <Route path="home" element={<AdminHome />} />
            <Route path="calendar" element={<AdminCalendar />} />
            <Route path="requests" element={<AdminRequests />} />
            <Route path="management" element={<AdminManagement />} />
            <Route path="profile" element={<AdminProfile />} />
          </Route>

          {/* Client protected routes */}
          <Route 
            path="/client/*" 
            element={
              <ProtectedRoute allowedRoles={["client"]}>
                <Client_Dashboard />
              </ProtectedRoute>
            }
          >
            <Route index element={<ClientHome />} />
            <Route path="home" element={<ClientHome />} />
            <Route path="requests" element={<ClientRequests />} />
            <Route path="profile" element={<ClientProfile />} />
          </Route>

          {/* Redirects */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </AuthProvider>
    </ErrorBoundary>
  );
};

// ADD THIS LINE - DEFAULT EXPORT
export default App;