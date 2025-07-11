import { Outlet } from 'react-router-dom';
import Nav from "./nav";
import NotificationBar from "./NotificationBar";

const AdminDashboard = () => {
  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Navigation */}
      <Nav />
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Notification Bar */}
        <NotificationBar />
        
        {/* Content Area - THIS IS WHERE OUTLET GOES */}
        <main className="flex-1 overflow-y-auto p-6 bg-[#F9FFF5]">
          <Outlet /> {/* This will render the nested routes */}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;