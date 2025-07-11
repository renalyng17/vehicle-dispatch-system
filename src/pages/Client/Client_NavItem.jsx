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
      <span>{label}</span>
    </Link>
  );
}