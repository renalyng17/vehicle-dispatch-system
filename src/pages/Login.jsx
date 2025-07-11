import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import background from "../assets/background.png";
import car from "../assets/car.png";
import logo from "../assets/logo.png";

const Login = () => {
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();
  

  const handleSubmit = (e) => {
  e.preventDefault();

  // Simulate successful login
  console.log("Remember Me:", rememberMe);
  

  // Navigate to dashboard or page with Nav component
  // After login success
  navigate("/dashboard/home");
};

 // Prevent page scroll
        useEffect(() => {
          document.body.style.overflow = "hidden";
          return () => {
            document.body.style.overflow = "auto";
          };
        }, []);
  return (
    <div
      className="min-h-screen bg-cover bg-center relative flex items-center justify-start pl-35"
      style={{ backgroundImage: `url(${background})` }}
    >
      {/* Logo in top-left */}
      <div className="absolute top-1 left-6 flex items-center space-x-2">
        <img src={logo} alt="VDS Logo" className="h-15 w-auto" />
        <h1 className="text-black text-xl font-bold">Vehicle Dispatch System</h1>
      </div>

      {/* Form Box */}
      <div className=" bg-opacity-90 rounded-xl p-11 w-90 max-w-md z-10">
        <h1 className="text-xl font-semibold mb-6 text-center text-green-700">Welcome Back to VDS</h1>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-xs p-1 font-medium text-gray-700">Email</label>
            <input
              type="email"
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-600 text-xs"
              required
            />
          </div>

          <div>
            <label className="block text-xs p-1 font-medium text-gray-700">Password</label>
            <input
              type="password"
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-600 text-xs"
              required
            />
          </div>

          <div className="flex justify-between items-center text-xs text-gray-700 mt-2">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={() => setRememberMe(!rememberMe)}
                className="mr-2"
              />
              Remember me
            </label>
            <Link to="/forgot-password" className="hover:underline">Forgot Password?</Link>
          </div>

          <button
            type="submit"
            className="w-full py-2 bg-green-700 text-white rounded-md hover:bg-green-800 transition text-xs"
          >
            Sign In
          </button>
        </form>

        <p className="mt-4 text-xs text-center text-gray-600">
          Don’t have an account?{" "}
          <Link to="/register" className="text-green-700 hover:underline">
            Register
          </Link>
        </p>
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

export default Login;