import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import ForgotPassword from './pages/ForgotPassword.jsx';
import Dashboard from "./pages/Admin/Dashboard.jsx";
import NotificationBar from './pages/Admin/NotificationBar.jsx'; // Adjust the path as needed


const App = () => {
  
  return (
 
<Routes>
  <Route path="/" element={<Login />} />
  <Route path="/dashboard" element={<Dashboard />} />
  <Route path="/register" element={<Register />} />
  <Route path="/forgot-password" element={<ForgotPassword />} />
   
</Routes>

  );
};

export default App;
