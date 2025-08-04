import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from './Context/AuthProvider';
import { ProtectedRoute } from "./components/ProtectedRoute";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import Unauthorized from "./pages/Unauthorized";
import AdminDashboard from "./pages/Admin/Dashboard";
import Requests from "./pages/Admin/Requests";
import { RequestProvider } from "./pages/Admin/RequestContext";
import Client_Dashboard from "./pages/Client/Client_Dashboard";
import Layout from "./components/Layout";

// Import all your page components
import AdminHome from "./pages/Admin/Home";
import AdminCalendar from "./pages/Admin/Calendar";
import AdminRequests from "./pages/Admin/Requests";
import AdminManagement from "./pages/Admin/Management";
import AdminProfile from "./pages/Admin/Profile";
import ClientHome from "./pages/Client/ClientHome";
import ClientRequests from "./pages/Client/Client_Requests";
import ClientProfile from "./pages/Client/Client_Profile";

const App = () => {
  return (
    <AuthProvider>
      <Routes>
        {/* Public routes */}
        <Route element={<Layout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
         {/* <Route path="/reset-password/:token" element={<ResetPassword />} /> */}
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
       <Route path="/Client_Dashboard/*" element={<Client_Dashboard />} />
          </Routes>
          </AuthProvider>
  );
};

export default App; 