import React, { useState } from "react";
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import background from "../assets/background.png";
import car from "../assets/car.png";
import logo from "../assets/logo.png";

const Register = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    contactNumber: "",
    email: "",
    password: "",
    confirmPassword: "",
    userType: ""
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.password !== form.confirmPassword) {
      return alert("Passwords do not match!");
    }

    try {
      const res = await axios.post("http://localhost:3000/api/auth/register", {
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        password: form.password,
        userType: form.userType
      });

      alert(res.data.message);
      navigate("/"); // Redirect to login page
    } catch (err) {
      alert(err.response?.data?.message || "Registration failed");
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
        <h1 className="text-xl font-semibold mb-0 text-center text-green-700">Register</h1>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-xs font-medium text-gray-700">Last Name</label>
            <input name="lastName" type="text" value={form.lastName} onChange={handleChange}
              className="w-70 px-2 py-1 border rounded-md text-xs" required />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700">First Name</label>
            <input name="firstName" type="text" value={form.firstName} onChange={handleChange}
              className="w-70 px-2 py-1 border rounded-md text-xs" required />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700">Contact Number</label>
            <input name="contactNumber" type="text" value={form.contactNumber} onChange={handleChange}
              className="w-70 px-2 py-1 border rounded-md text-xs" required />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700">Email</label>
            <input name="email" type="email" value={form.email} onChange={handleChange}
              className="w-70 px-2 py-1 border rounded-md text-xs" required />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700">Password</label>
            <input name="password" type="password" value={form.password} onChange={handleChange}
              className="w-70 px-2 py-1 border rounded-md text-xs" required />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700">Confirm Password</label>
            <input name="confirmPassword" type="password" value={form.confirmPassword} onChange={handleChange}
              className="w-70 px-2 py-1 border rounded-md text-xs" required />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700">User Type</label>
            <select name="userType" value={form.userType} onChange={handleChange}
              className="w-70 px-2 py-1 border rounded-md text-xs" required>
              <option value="">Select User Type</option>
              <option value="admin">Admin</option>
              <option value="client">Client</option>
            </select>
          </div>

          <button type="submit"
            className="w-70 py-2 bg-green-700 text-white rounded-md hover:bg-green-800 text-xs">
            Register
          </button>
        </form>

        <p className="mt-1 text-xs text-center text-gray-600">
          Already have an account?{" "}
          <Link to="/" className="text-green-700 hover:underline">
            Log-in
          </Link>
        </p>
      </div>

      <img src={car} alt="Car" className="absolute bottom-0 right-0 w-1/2 object-contain h-auto" />
    </div>
  );
};

export default Register;
