import React from "react";
<<<<<<< HEAD
import { Routes, Route, Navigate } from "react-router-dom";
import Client_Nav from "./Client_nav";
import Client_NotificationBar from "./Client_NotificationBar";

import Client_Home from "./Client_Home";
import Requests from "./Client_Requests";
import Profile from "./Client_Profile";  

const Client_Dashboard = () => {
  return (
    <div className="flex min-h-screen">
      <Client_Nav />
      <div className="flex-1 flex flex-col">
        <Client_NotificationBar />
        <div className="p-6 bg-[#F9FFF5] flex-1">
          <Routes>
            <Route path="/Client_Home" element={<Client_Home />} />
            <Route path="/Client_Requests" element={<Requests />} />
            <Route path="/Client_Profile" element={<Profile />} />
          </Routes>
        </div>
=======
import { Outlet } from "react-router-dom";
import Client_Nav from "./Client_Nav";
import Client_NotificationBar from "./Client_NotificationBar";

const Client_Dashboard = () => {
  return (
    <div className="flex min-h-screen">
      {/* Client Navigation Sidebar */}
      <Client_Nav />
      
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Notification Bar */}
        <Client_NotificationBar />
        
        {/* Dashboard Content - Outlet for nested routes */}
        <main className="p-6 bg-[#F9FFF5] flex-1">
          <Outlet />
        </main>
>>>>>>> 51b73d99c076a8d216668d38333b2c46e02f5923
      </div>
    </div>
  );
};

export default Client_Dashboard;