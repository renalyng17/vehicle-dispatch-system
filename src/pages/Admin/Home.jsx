import React from "react";
import { Users, User, Car } from "lucide-react";


export default function Home() {
  return (
       <div className="bg-[#F9FFF5] px-0 mt-0">
      <h1 className="alignment-top p-6 text-3xl font-bold">Home</h1>

      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded shadow p-4">
          <h2 className="mt-5 text-4xl font-bold">30</h2>
          <p className="text-gray-800 text-m flex items-center mb-5 gap-2">
          Users <Users className="w-4 h-4" />
          </p>
        </div>
        <div className="bg-white rounded shadow p-4">
          <h2 className="mt-5 text-4xl font-bold">20 </h2>
          <p className="text-gray-800 text-m flex items-center mb-5 gap-2">
           Drivers <User className=" w-4 h-4" />
          </p>
        </div>
        <div className="bg-white rounded shadow p-4">
          <h2 className="mt-5 text-4xl font-bold">20</h2>
          <p className="text-gray-800 text-m flex items-center mb-5 gap-2">
            Vehicles <Car className="w-4 h-4" />
          </p>
        </div>
      </div>

      <div className="bg-white rounded shadow h-[300px]"></div>
    </div>
  );
}
