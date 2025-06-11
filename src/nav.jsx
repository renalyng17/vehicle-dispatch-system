import {
  Home,
  CalendarDays,
  GitPullRequest,
  UserCog,
  User,
  LogOut,
} from "lucide-react";
import dalogo from "./assets/dalogo.png";
import NavItem from "./NavItem";

export default function Nav() {
  return (
    <div className="h-screen w-72 bg-green-800 text-white flex flex-col justify-between px-4 py-6">
      {/* Top Logo and Nav Items */}
      <div>
        <div className="flex flex-col items-center mb-6">
          <img src={dalogo} alt="Logo" className="w-20 h-20 rounded-full" />
          <h1 className="font-bold tracking-wider text-lg text-center mt-2">
            VEHICLE DISPATCH
          </h1>
        </div>

        <ul className="space-y-4 ml-2">
          <li>
            <NavItem href="#" icon={Home} label="Home" />
          </li>
          <li>
            <NavItem href="#" icon={CalendarDays} label="Calendar" />
          </li>
          <li>
            <NavItem href="#" icon={GitPullRequest} label="Requests" />
          </li>
          <li>
            <NavItem href="#" icon={UserCog} label="Management" />
          </li>
          <li>
            <NavItem href="#" icon={User} label="Profile" />
          </li>
        </ul>
      </div>

      {/*Logout */}
      <div className="ml-2 flex items-center space-x-3 mt-4 p-2 border-t-2 border-white">
        <img
          src={dalogo}
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
