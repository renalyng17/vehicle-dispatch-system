import React from 'react';
import { Bell } from 'lucide-react';

const Home = () => {
  return (
    <div className="p-6 text-xl font-semibold text-gray-800">
      Home Dashboard
    
    <div className="w-full text-black px-6 py-5 flex items-center justify-between">
      <div></div>

      <div className="flex items-center space-x-4 mr-7">
        <button className="relative hover:text-lime-200 transition duration-200">
          <Bell className="w-5 h-5" />
          <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500 animate-ping"></span>
        </button>
      </div>
    </div>
    </div>
  );
};

export default Home;