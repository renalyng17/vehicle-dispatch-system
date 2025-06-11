import {
  Home,
  CalendarDays,
  GitPullRequest,
  UserCog,
  User,
  LogOut,
} from "lucide-react";
import logo from "../../assets/logo.png";
import React from "react";
import { Link } from "react-router-dom";
import NavItem from "./NavItem";


export default function Nav() {
  return (


    <div className="h-screen w-74 bg-green-800 text-white p-4">
      
      <div className="mb-8 flex flex-col items-center">
        <img src={logo} alt="Logo" className="w-20 h-20 rounded-full" />
        <h1 className="font-bold tracking-widnr text-lg">VEHICLE DISPATCH</h1>
      </div>

      <ul className="space-y-4 ml-2">
        <li><NavItem href="#" icon={Home} label="Home" /></li>
        <li><NavItem href="#" icon={CalendarDays} label="Calendar" /></li>
        <li><NavItem href="#" icon={GitPullRequest} label="Requests" /></li>
        <li><NavItem href="#" icon={UserCog} label="Management" /></li>
        <li><NavItem href="#" icon={User} label="Profile" /></li>
      </ul>
      
    
     <div className="ml-2 flex items-center space-x-3 mt-40 p-2 border-t-2 border-white">
        <img
          src={logo}
          alt="User"
          className="w-10 h-10 rounded-full object-cover"
        />

        {/* User Info */}
        <div className="flex-1 ">
          <p className="text-md font-semibold">John Doe</p>{" "}
          {/* Replace with actual user name */}
        </div>

        {/* Logout Icon */}
        <LogOut className="w-6 h-6 cursor-pointer hover:text-lime-300 transition" />
      </div>
    </div>
  

  );
}