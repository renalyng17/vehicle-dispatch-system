import React from "react";
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
      </div>
    </div>
  );
};

export default Client_Dashboard;