import React from "react";
import { Routes, Route } from "react-router-dom";
import Nav from "../Admin/nav";
import NotificationBar from "../Admin/NotificationBar";

import Home from "./Home";
import Calendar from "./Calendar";
import Requests from "./Requests";
import Management from "./Management";
import Profile from "./Profile";

const Dashboard = () => {
  return (
    <div className="flex min-h-screen">
      <Nav />
      <div className="flex-1 flex flex-col">
        <NotificationBar />
        <div className="p-6 bg-[#F9FFF5] flex-1">
          <Routes>
            <Route path="/home" element={<Home />} /> {/* Default route under /dashboard */}
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