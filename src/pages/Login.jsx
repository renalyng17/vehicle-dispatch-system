import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import background from "../assets/background.png";
import car from "../assets/car.png";
import logo from "../assets/logo.png";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post("http://localhost:3000/api/auth/login", {
        email,
        password,
      });

      const { token, user } = res.data;

      // Save token depending on rememberMe
      if (rememberMe) {
        localStorage.setItem("token", token);
      } else {
        sessionStorage.setItem("token", token);
      }

      alert("Login successful!");

      // Redirect based on user type
      if (user.user_type === "admin") {
        navigate("/admin/dashboard");
      } else if (user.user_type === "client") {
        navigate("/client/dashboard");
      } else {
        navigate("/dashboard");
      }
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center relative flex items-center justify-start pl-35"
      style={{ backgroundImage: `url(${background})` }}
    >
      <div className="absolute top-1 left-6 flex items-center space-x-2">
        <img src={logo} alt="VDS Logo" className="h-15 w-auto" />
        <h1 className="text-black text-xl font-bold">Vehicle Dispatch System</h1>
      </div>

      <div className="bg-opacity-90 rounded-xl p-11 w-90 max-w-md z-10">
        <h1 className="text-xl font-semibold mb-6 text-center text-green-700">Welcome Back to VDS</h1>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-xs font-medium text-gray-700">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-600 text-xs"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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

      <img
        src={car}
        alt="Car"
        className="absolute bottom-0 right-0 w-1/2 md:w-1/2 object-contain h-auto"
      />
    </div>
  );
};

export default Login;
