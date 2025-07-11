<<<<<<< HEAD

import React from "react";
import { Link, useLocation } from "react-router-dom";

export default function NavItem({ href, icon: Icon, label }) {
  const location = useLocation();
  const isActive = location.pathname === href;
  return (
    <Link
      to={href}
      className={`flex items-center space-x-2 px-3 py-2 rounded-md transition 
        ${isActive ? "bg-green-600 text-white " : "hover:text-green-600 text-white"}`}
    >
      <Icon className="w-5 h-5" /> {/* Adjusted icon size for consistency */}
=======
import React from "react";
import { Link } from "react-router-dom";

export default function Client_NavItem({ href, icon: Icon, label, active }) {
  return (
    <Link
      to={href}
      className={`flex items-center space-x-2 px-3 py-2 rounded-md transition-colors
        ${active 
          ? "bg-green-600 text-white shadow-md"
          : "text-white hover:bg-green-700 hover:shadow-sm"
        }`}
    >
      <Icon className="w-5 h-5" />
>>>>>>> 51b73d99c076a8d216668d38333b2c46e02f5923
      <span>{label}</span>
    </Link>
  );
}