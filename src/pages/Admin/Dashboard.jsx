import React from "react";
import Nav from "../Admin/Nav";
import NotificationBar from "../Admin/NotificationBar"; // update path if needed

const Dashboard = () => {
  return (
    <div className="flex min-h-screen">
      <Nav />

      {/* Main content area */}
      <div className="flex-1 flex flex-col">
        <NotificationBar />

        <div className="p-6 bg-gray-50 flex-1">
          <h1 className="text-3xl font-bold mb-4">Home</h1>
          <p>Welcome to the Vehicle Dispatch System!</p>
          {/* Add more dashboard content here */}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
