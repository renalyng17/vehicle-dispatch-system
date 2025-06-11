import { Bell } from "lucide-react";

export default function NotificationBar() {
  return (
    <div className="w-full bg-green-800 text-white px-6 py-5 flex items-center justify-between shadow-md">
      <div></div>

      <div className="flex items-center space-x-4 mr-7">
        <button className="relative hover:text-lime-200 transition duration-200">
          <Bell className="w-8 h-8" />
          <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500 animate-ping"></span>
        </button>
      </div>
    </div>
  );
}
