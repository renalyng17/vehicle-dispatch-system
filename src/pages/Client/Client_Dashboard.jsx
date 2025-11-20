import React from "react";
import { Outlet } from "react-router-dom";
import Client_nav from "./Client_nav";
import Client_NotificationBar from "./Client_NotificationBar";

const Client_Dashboard = () => {
  return (
    <div className="flex min-h-screen">
      <Client_Nav /> {/* Correct usage */}
      {/* Client Navigation Sidebar */}
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        <Client_NotificationBar />
        <div className="p-6 bg-[#F9FFF5] flex-1">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Client_Dashboard;