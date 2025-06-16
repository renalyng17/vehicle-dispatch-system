
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
      <Icon className="w-5 h-5" />
      <span>{label}</span>
    </Link>
  );
}