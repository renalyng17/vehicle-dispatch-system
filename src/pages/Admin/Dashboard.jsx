import React from "react";
import Nav from "../Admin/nav";
import NotificationBar from "../Admin/NotificationBar";
import { Routes, Route } from "react-router-dom";

// Subpages
import Calendar from "./Calendar.jsx";
import Requests from "./Requests.jsx";
import Management from "./Management.jsx";
import Profile from "./Profile.jsx";

const Dashboard = () => {
  return (
    <div className="flex min-h-screen">
      <Nav />
      <div className="flex-1 flex flex-col">
        <NotificationBar />

        <div className="p-6 bg-gray-50 flex-1">
          <Routes>
            <Route path="/" element={
              <>
                <h1 className="text-3xl font-bold mb-4">Home</h1>
                <p>Welcome to the Vehicle Dispatch System!</p>
              </>
            } />
            <Route path="calendar" element={<Calendar />} />
            <Route path="requests" element={<Requests />} />
            <Route path="management" element={<Management />} />
            <Route path="profile" element={<Profile />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
