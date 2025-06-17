import React from "react";
import {
  Home,
  CalendarDays,
  GitPullRequest,
  UserCog,
  User,
  LogOut,
} from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import logo from "../../assets/logo.png";
import NavItem from "./NavItem";

export default function Nav() {
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
          <NavItem
            href="/dashboard/Home"
            icon={Home}
            label="Home"
            active={isActive("/dashboard/Home")}
          />
        </li>
        <li>
          <NavItem
            href="/dashboard/calendar"
            icon={CalendarDays}
            label="Calendar"
            active={isActive("/dashboard/calendar")}
          />
        </li>
        <li>
          <NavItem
            href="/dashboard/requests"
            icon={GitPullRequest}
            label="Requests"
            active={isActive("/dashboard/requests")}
          />
        </li>
        <li>
          <NavItem
            href="/dashboard/management"
            icon={UserCog}
            label="Management"
            active={isActive("/dashboard/management")}
          />
        </li>
        <li>
          <NavItem
            href="/dashboard/profile"
            icon={User}
            label="Profile"
            active={isActive("/dashboard/profile")}
          />
        </li>
      </ul>

      {/* Footer Section with User and Logout */}
      <div className="ml-2 flex items-center space-x-3 mt-40 p-2 border-t-2 border-white">
        <img
          src={logo}
          alt="User"
          className="w-10 h-10 rounded-full object-cover"
        />

        {/* Clickable User Name */}
        <div className="flex-1">
          <Link
            to="/dashboard/profile"
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
