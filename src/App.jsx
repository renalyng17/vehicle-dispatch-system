import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from './Context/AuthProvider';
import { ProtectedRoute } from "./components/ProtectedRoute";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import Dashboard from "./pages/Admin/Dashboard";
import Requests from "./pages/Admin/Requests";
import { RequestProvider } from "./pages/Admin/RequestContext";
import Client_Dashboard from "./pages/Client/Client_Dashboard";

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


      <Route element={<ProtectedRoute allowedRoles={['client']} />}>
          <Route path="/client" element={<Client_Dashboard />}>
          <Route index element={<ClientHome />} />
          <Route path="home" element={<ClientHome />} />
          <Route path="requests" element={<ClientRequests />} />
          <Route path="profile" element={<ClientProfile />} />
          <Route path="*" element={<Navigate to="/client/home" replace />} />
          </Route>
      </Route>

        {/* Redirects */}
          <Route path="/" element={<Navigate to="/login" replace />} />
           <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
          </AuthProvider>
  );
};

export default App;
