import React, { useState } from "react";
import { Home, GitPullRequest, User, LogOut } from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../Context/AuthContext";
import logo from "../../assets/logo.png";
import Client_NavItem from "./Client_NavItem";
import profile from "../../assets/profile2.png";

export default function Client_Nav() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [showLogoutModal, setShowLogoutModal] = useState(false); // 👈 Modal state

  const handleLogout = () => {
    localStorage.clear();
    sessionStorage.clear();
    navigate("/login");
  };

  const confirmLogout = () => {
    setShowLogoutModal(true);
  };

  const handleLogoutConfirm = () => {
    setShowLogoutModal(false);
    handleLogout();
  };

  const activePath = pathname.split('/')[2] || 'home';

  const fullName = user
    ? `${user.first_name || user.firstName || ''} ${user.last_name || user.lastName || ''}`.trim()
    : "User";

  return (
    <div className="h-screen w-74 bg-green-800 text-white p-4 flex flex-col">
      {/* Logo and title */}
      <div className="mb-8 flex flex-col items-center">
        <img src={logo} alt="Logo" className="w-20 h-20 rounded-full" />
        <h1 className="font-bold tracking-wider text-lg">VEHICLE DISPATCH</h1>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1">
        <ul className="list-none space-y-4 ml-2">
          <li>
            <Client_NavItem
              href="/client/home"
              icon={Home}
              label="Home"
              active={activePath === 'home'}
            />
          </li>
          <li>
            <Client_NavItem
              href="/client/requests"
              icon={GitPullRequest}
              label="Requests"
              active={activePath === 'requests'}
            />
          </li>
          <li>
            <Client_NavItem
              href="/client/profile"
              icon={User}
              label="Profile"
              active={activePath === 'profile'}
            />
          </li>
        </ul>
      </nav>

      {/* Footer Section */}
      <div className="ml-2 flex items-center space-x-3 p-2 border-t-2 border-white">
        <img src={profile} alt="User" className="w-5 h-5 rounded-full" />
        <Link
          to="/client/profile"
          className="flex-1 text-md font-semibold hover:text-lime-300 transition truncate"
        >
          {fullName}
        </Link>
        <button
          onClick={confirmLogout} // 👈 Trigger modal instead of direct logout
          className="text-white hover:text-lime-300 transition"
          aria-label="Logout"
        >
          <LogOut className="w-6 h-6" />
        </button>
      </div>

{/* Logout Confirmation Modal */}
{showLogoutModal && (
  <div 
    className="fixed inset-0 bg-black-20 bg-opacity-30 backdrop-blur-sm flex items-center justify-center z-50"
    onClick={() => setShowLogoutModal(false)} // Optional: close on outside click
  >
    <div 
      className="bg-white rounded-lg p-6 w-80 max-w-sm border border-gray-300 shadow-xl"
      onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside modal
    >
      <h3 className="text-lg font-semibold text-gray-800 mb-2">Confirm Logout</h3>
      <p className="text-gray-600 mb-4">
        Are you sure you want to log out?
      </p>
      <div className="flex justify-end space-x-3">
        <button
          onClick={() => setShowLogoutModal(false)}
          className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md transition border border-gray-300"
        >
          Cancel
        </button>
        <button
          onClick={handleLogoutConfirm}
          className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition border border-green-600"
        >
          OK
        </button>
      </div>
    </div>
  </div>
)}
      
    </div>
  );
}