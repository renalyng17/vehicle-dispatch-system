import { Bell } from "lucide-react";

export default function NotificationBar() {
  return (
  

      <div className="flex items-center space-x-4 mr-7">
        <button className="relative hover:text-lime-200 transition duration-200">
          <Bell className="absolute top-5 left-250 w-6 h-6" />
          <span className="absolute top-5 left-253 block h-2 w-2 rounded-full bg-red-500 animate-ping"></span>
        </button>
      </div>
   
  );
}