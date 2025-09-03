import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Client_Nav from "./Client_Nav";
import Client_NotificationBar from "./Client_NotificationBar";

import Client_Home from "./Client_Home";
import Client_Requests from "./Client_Requests";
import Client_Profile from "./Client_Profile";  

const Client_Dashboard = () => {
  return (
    <div className="flex min-h-screen">
      <Client_Nav />
      <div className="flex-1 flex flex-col">
        <Client_NotificationBar />
        <div className="p-6 bg-[#F9FFF5] flex-1">
          <Routes>
          <Route path="/home" element={<Client_Home />} />
          <Route path="/requests" element={<Client_Requests />} />
          <Route path="/profile" element={<Client_Profile />} />
        </Routes>
        </div>
      </div>
    </div>
  );
};

export default Client_Dashboard;