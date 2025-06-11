import React from "react";
import { Link } from "react-router-dom";

const NavItem = ({ href, icon: Icon, label }) => {
  return (
    <Link
      to={href}
      className="flex items-center space-x-3 hover:bg-green-700 p-2 rounded-md"
    >
      <Icon className="w-5 h-5" />  
      <span>{label}</span>
    </Link>
  );
};


export default NavItem;
