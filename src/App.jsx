import React from "react";
import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword.jsx";
import Dashboard from "./pages/Admin/Dashboard";


const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/forgot-password/:token" element={<ForgotPassword />} />
      <Route path="/dashboard/*" element={<Dashboard />} />
    </Routes>
  );
};

export default App;
