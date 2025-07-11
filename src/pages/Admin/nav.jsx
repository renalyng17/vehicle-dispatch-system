import React from "react";
import { Home, CalendarDays, GitPullRequest, UserCog, User, LogOut } from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import logo from "../../assets/logo.png";
import NavItem from "./NavItem";

export default function Nav() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.clear();
    sessionStorage.clear();
    navigate("/login");
  };

  // Improved active path detection
  const getActivePath = () => {
    const path = location.pathname;
    if (path.startsWith("/admin/calendar")) return "calendar";
    if (path.startsWith("/admin/requests")) return "requests";
    if (path.startsWith("/admin/management")) return "management";
    if (path.startsWith("/admin/profile")) return "profile";
    return "home"; // Default to home
  };

  const activePath = getActivePath();

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
 
<NavItem
  href="/admin/home"  // Must match exactly with your route path
  icon={Home}
  label="Home"
  active={location.pathname === '/admin/home'}
/>
          </li>
          <li>
            <NavItem
              href="/admin/calendar"
              icon={CalendarDays}
              label="Calendar"
              active={activePath === "calendar"}
            />
          </li>
          <li>
            <NavItem
              href="/admin/requests"
              icon={GitPullRequest}
              label="Requests"
              active={activePath === "requests"}
            />
          </li>
          <li>
            <NavItem
              href="/admin/management"
              icon={UserCog}
              label="Management"
              active={activePath === "management"}
            />
          </li>
          <li>
            <NavItem
              href="/admin/profile"
              icon={User}
              label="Profile"
              active={activePath === "profile"}
            />
          </li>
        </ul>
      </nav>

<<<<<<< HEAD
      {/* Footer Section with User and Logout */}
      <div className="ml-2 flex items-center space-x-3 mt-64 p-2 border-t-2 border-white">
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
=======
      {/* Footer Section */}
      <div className="ml-2 flex items-center space-x-3 p-2 border-t-2 border-white">
        <img src={logo} alt="User" className="w-10 h-10 rounded-full" />
        <Link
          to="/admin/profile"
          className="flex-1 text-md font-semibold hover:text-lime-300 transition"
        >
          John Doe
        </Link>
>>>>>>> 51b73d99c076a8d216668d38333b2c46e02f5923
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