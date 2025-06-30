import { Outlet } from 'react-router-dom';
import NotificationBar from "./NotificationBar";

function MainLayout() {
  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="w-64 bg-gray-800 text-white p-4">
        <h2 className="text-xl font-bold mb-6">VEHICLE DISPATCH</h2>
        <nav>
          <ul className="space-y-2">
            <li><a href="/admin/dashboard" className="block py-2 px-4 rounded hover:bg-gray-700">Home</a></li>
            <li><a href="#" className="block py-2 px-4 rounded hover:bg-gray-700">Calendar</a></li>
            <li><a href="/admin/requests" className="block py-2 px-4 rounded bg-gray-700">Requests</a></li>
            <li><a href="#" className="block py-2 px-4 rounded hover:bg-gray-700">Management</a></li>
            <li><a href="#" className="block py-2 px-4 rounded hover:bg-gray-700">Profile</a></li>
          </ul>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <NotificationBar />
        <Outlet /> {/* This will render either Dashboard or Requests based on route */}
      </div>
    </div>
  );
}

export default MainLayout;