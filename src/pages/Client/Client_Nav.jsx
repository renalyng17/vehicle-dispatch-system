import React from "react";
import { Home, GitPullRequest, User, LogOut } from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import logo from "../../assets/logo.png";
import Client_NavItem from "./Client_NavItem";

export default function Client_Nav() {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const handleLogout = () => {
    // Clear all auth storage
    localStorage.clear();
    sessionStorage.clear();
    navigate("/login");
  };

  // Improved active route detection
  const activePath = pathname.split('/')[2] || 'home';

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
        <img src={logo} alt="User" className="w-10 h-10 rounded-full" />
        <Link
          to="/client/profile"
          className="flex-1 text-md font-semibold hover:text-lime-300 transition"
        >
          John Doe
        </Link>
        <button
          onClick={handleLogout}
          className="text-white hover:text-lime-300 transition"
          aria-label="Logout"
        >
          <LogOut className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
}