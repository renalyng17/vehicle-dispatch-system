// src/pages/ChangePassword.jsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
import background from "../assets/background.png";
import car from "../assets/car.png";
import logo from "../assets/logo.png";

const ChangePassword = () => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    alert("Password changed successfully!");
    // You can integrate with backend here
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center relative flex items-center justify-start pl-35"
      style={{ backgroundImage: `url(${background})` }}
    >
      {/* Logo */}
      <div className="absolute top-1 left-6 flex items-center space-x-2">
        <img src={logo} alt="VDS Logo" className="h-15 w-auto" />
        <h1 className="text-black text-xl font-bold">Vehicle Dispatch System</h1>
      </div>

      {/* Form Box */}
      <div className=" bg-opacity-90 rounded-xl p-11 w-90 max-w-md z-10">
        <h1 className="text-xl font-semibold text-center mb-5 text-green-700">
          Change Password
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">New Password</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-600 text-xs"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Confirm Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-600 text-xs"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-2 bg-green-700 text-white text-sm rounded-md hover:bg-green-800 transition"
          >
            Save
          </button>

          <p className="mt-0.5 text-xs text-center text-gray-600">
            <Link to="/" className="text-green-700 hover:underline">
              Back to Login
            </Link>
          </p>
        </form>
      </div>

      {/* Car Image */}
      <img
        src={car}
        alt="Car"
        className="absolute bottom-0 right-0 w-1/2 md:w-1/2 object-contain h-auto"
      />
    </div>
  );
};

export default ChangePassword;
