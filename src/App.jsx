import React from "react";
import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import Dashboard from "./pages/Admin/Dashboard";
import Client_Dashboard from "./pages/Client/Client_Dashboard";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/dashboard/*" element={<Dashboard />} />
      <Route path="/Client_Dashboard/*" element={<Client_Dashboard />} />
      
    </Routes>
  );
};

export default App;
