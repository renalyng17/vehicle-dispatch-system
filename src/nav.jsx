import { Home, CalendarDays, GitPullRequest, UserCog, User } from "lucide-react";
import dalogo from "./assets/dalogo.png";
import NavItem from "./NavItem";

export default function Nav() {
  return (
    <div className="h-screen w-74 bg-green-800 text-white p-4">
      
      <div className="mb-8 flex flex-col items-center">
        <img src={dalogo} alt="Logo" className="w-20 h-20 rounded-full" />
        <h1 className="font-bold tracking-wider text-lg">VEHICLE DISPATCH</h1>
      </div>

      
      <ul className="space-y-4 ml-2">
        <li><NavItem href="#" icon={Home} label="Home" /></li>
        <li><NavItem href="#" icon={CalendarDays} label="Calendar" /></li>
        <li><NavItem href="#" icon={GitPullRequest} label="Requests" /></li>
        <li><NavItem href="#" icon={UserCog} label="Management" /></li>
        <li><NavItem href="#" icon={User} label="Profile" /></li>
      </ul>
    </div>
  );
}
