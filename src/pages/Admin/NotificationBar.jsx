import { Bell } from "lucide-react";
import { useState } from "react";

export default function NotificationBar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="flex items-center space-x-4 mr-7 relative">
      <button 
        className="relative hover:text-lime-200 transition duration-200"
        onClick={() => setIsOpen(!isOpen)}
      >
         <Bell className="absolute top-5 left-250 w-6 h-6" />
          <span className="absolute top-5 left-253 block h-2 w-2 rounded-full bg-red-500 animate-ping"></span></button>

      {/* Notification Modal */}
      {isOpen && (
        <div className="absolute right-0 top-12 w-80 bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 z-50">
          <div className="p-4">
            <h3 className="font-semibold text-lg mb-2">Notification</h3>
            
            <div className="border-b border-gray-200 dark:border-gray-700 pb-3 mb-3">
              <div className="flex justify-between items-start">
                <h4 className="font-medium">John Manuel, Have Travel!</h4>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                Date: June 01 Sun - June 04 Wed
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Time: 3:00 PM
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Destination: Terminal 2
              </p>
              
              {/* Action Buttons */}
              <div className="flex justify-between mt-4">
                <button className="px-7 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition duration-200 text-sm">
                  Decline
                </button>
                <button className="px-7 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition duration-200 text-sm">
                  Accept
                </button>
              </div>
            </div>
            
            {/* You can add more notifications here */}
            <div className="text-center text-sm text-gray-500 dark:text-gray-400">
              No more notifications
            </div>
          </div>
        </div>
      )}
    </div>
  );
}