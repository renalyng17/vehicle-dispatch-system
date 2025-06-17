import React from "react";
import background from "../assets/background.png";
import car from "../assets/car.png";
import logo from "../assets/logo.png";
import { Link } from 'react-router-dom';

const Register = () => {
  return (
    <div
      className="min-h-screen bg-cover bg-center relative flex items-center justify-start pl-35"
      style={{ backgroundImage: `url(${background})` }}
    >
      {/* Logo in top-left */}
      <div className="absolute top-1 left-6 flex items-center space-x-2">
        <img src={logo} alt="VDS Logo" className="h-15 w-auto" />
        <h1 className="text-green-700 text-xl font-bold">Vehicle Dispatch System</h1>
        
      </div>
      {/* Form Box */}
      <div className="bg-opacity-90 rounded-xl p-11 w-90 max-w-md z-10">    
        <h1 className="text-xl font-semibold mb-0 text-center text-green-700">Register</h1>

        <form className="space-y-4">      
          <div>
            <label className="block text-xs p-0 font-medium mt-0 text-gray-700">Last Name</label>
            <input
              type="lastname"
              className="w-70 px-0 py-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-600 text-xs"
              required
            />
          </div>

          <div>
            <label className="block text-xs p-0 font-medium mt-0 text-gray-700">First Name</label>
            <input
              type="firstname"
              className="w-70 px-0 py-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-600 text-xs"
              required
            />
            </div>

               <div>
            <label className="block text-xs p-0 font-medium mt-0 text-gray-700">Contact Number</label>
            <input
              type="contactnumber"
              className="w-70 px-0 py-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-600 text-xs"
              required
            />
            </div> 

             <div>
            <label className="block text-xs p-0 font-medium mt-0 text-gray-700">Email</label>
            <input
              type="email"
              className="w-70 px-0 py-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-600 text-xs"
              required
            />
            </div> 

             <div>
            <label className="block text-xs p-0 font-medium mt-0 text-gray-700">Password</label>
            <input
              type="password"
              className="w-70 px-0 py-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-600 text-xs"
              required
            />
            </div>

             <div>
            <label className="block text-xs p-0 font-medium mt-0 text-gray-700">Confirm Password</label>
            <input
              type="confirmpassword"
              className="w-70 px-0 py-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-600 text-xs"
              required
            />
            </div>

            <div>
            <label className="block text-xs p-1 font-medium text-gray-700">User Type</label>
            <select
           className="w-70 px-0 py-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-600 text-xs"
           required
           >
           <option value="">Select User Type</option>
          <option value="admin">Admin</option>
          <option value="client">Client</option>
          </select>
          </div>

          <button
            type="submit"
            className="w-70 py-2 bg-green-700 text-white rounded-md mt-0.5 hover:bg-green-800 transition text-xs"
          >
            Register
          </button>
        </form>

   <p className="mt-0.5 text-xs text-center text-gray-600">
        Already have an accoun?{' '}
       <Link to="/" className="text-green-700 hover:underline">
        Log-in </Link>
        </p>
      </div>

      {/* Car Image at bottom right */}
      <img
        src={car}
        alt="Car"
        className="absolute bottom-0 right-0 w-1/2 md:w-1/2 object-contain h-auto"
      />
    </div>
  );
};

export default Register;
