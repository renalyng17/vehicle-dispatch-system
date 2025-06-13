import React from 'react';
import { Routes, Route } from "react-router-dom";
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import ForgotPassword from './pages/ForgotPassword.jsx';
import Dashboard from "./pages/Admin/Dashboard.jsx";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      
      {/* Dashboard layout and subroutes */}
      <Route path="/dashboard/*" element={<Dashboard />} />
    </Routes>
  );
};

export default App;
