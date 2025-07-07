import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Client_Nav from "./Client_Nav";
import Client_NotificationBar from "./Client_NotificationBar";

import ClientHome from "./ClientHome";
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
            <Route path="/ClientHome" element={<ClientHome />} />
            <Route path="/Client_Requests" element={<Requests />} />
            <Route path="/Client_Profile" element={<Profile />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default Client_Dashboard;