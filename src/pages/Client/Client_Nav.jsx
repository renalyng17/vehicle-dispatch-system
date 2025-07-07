import React from "react";
import {
  Home,
  GitPullRequest,
  User,
  LogOut,
} from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import logo from "../../assets/logo.png";
import Client_NavItem from "./Client_NavItem";


export default function Client_Nav() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    // You can add any logout logic like clearing local storage/session here
    console.log("User logged out");
    navigate("/"); // Redirect to login or landing page
  };

  const isActive = (path) => location.pathname === path;

  return (
    <div className="h-screen w-74 bg-green-800 text-white p-4">
      {/* Logo and title */}
      <div className="mb-8 flex flex-col items-center">
        <img src={logo} alt="Logo" className="w-20 h-20 rounded-full" />
        <h1 className="font-bold tracking-wider text-lg">VEHICLE DISPATCH</h1>
      </div>

      {/* Navigation Links */}
<ul className="list-none space-y-4 ml-2">
  <li>
    <Client_NavItem
      href="/Client_Dashboard/Client_Home"
      icon={Home}
      label="Home"
      active={isActive("/Client_Dashboard/Client_Home")}
    />
  </li>
  <li>
    <Client_NavItem
      href="/Client_Dashboard/Client_Requests"
      icon={GitPullRequest}
      label="Requests"
      active={isActive("/Client_Dashboard/Client_Requests")}
    />
  </li>
  <li>
    <Client_NavItem
      href="/Client_Dashboard/Client_Profile"
      icon={User}
      label="Profile"
      active={isActive("/Client_Dashboard/Client_Profile")}
    />
  </li>
</ul>

      {/* Footer Section with User and Logout */}
      <div className="ml-2 flex items-center space-x-3 mt-70 p-2 border-t-2 border-white">
        <img
          src={logo}
          alt="User"
          className="w-10 h-10 rounded-full object-cover"
        />

        {/* Clickable User Name */}
        <div className="flex-1">
          <Link
            to="/Client_Dashboard/Client_Profile"
            className="text-md font-semibold hover:text-lime-300 transition"
          >
            John Doe
          </Link>
        </div>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="text-white hover:text-lime-300 transition"
        >
          <LogOut className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
}