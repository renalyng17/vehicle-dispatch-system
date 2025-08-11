import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from 'react-router-dom';
import background from "../assets/background.png";
import car from "../assets/car.png";
import logo from "../assets/logo.png";

axios.defaults.baseURL = 'http://localhost:3001';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    contact_no: '',
    email: '',
    password: '',
    confirmPassword: '',
    user_type: '',
    office: ''
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.last_name.trim()) newErrors.last_name = 'Last name is required';
    if (!formData.first_name.trim()) newErrors.first_name = 'First name is required';
    if (!formData.contact_no.trim()) newErrors.contact_no = 'Contact number is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    if (!formData.user_type) newErrors.user_type = 'Please select user type';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');
    if (!validateForm()) return;
    setLoading(true);

    try {
      const { ForgotPassword, ...dataToSend } = formData;
      const response = await axios.post('/api/auth/register', dataToSend);

      if (response.data.status === 'success') {
        navigate('/login', {
          state: {
            registrationSuccess: true,
            registeredEmail: formData.email
          },
          replace: true
        });
      }
    } catch (err) {
      setServerError(
        err.response?.data?.message ||
        err.message ||
        'Registration failed. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-cover bg-center relative flex" style={{ backgroundImage: `url(${background})` }}>
      {/* Logo at top left */}
      <div className="absolute top-1 left-6 flex items-center space-x-2">
        <img src={logo} alt="VDS Logo" className="h-15 w-auto" />
        <h1 className="text-gray-700 text-xl font-bold">Vehicle Dispatch System</h1>
      </div>

      {/* Form on left side */}
      <div className="w-1/2 flex items-center justify-center">
        <div className="rounded-xl p-8 w-full max-w-md">
          <h1 className="text-xl font-semibold mb-6 text-center text-green-700">Register</h1>
          {serverError && (
            <div className="p-3 mb-4 text-red-700 bg-red-100 rounded-md text-xs">
              <p>{serverError}</p>
            </div>
          )}
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="flex space-x-4">
              <div className="flex-1">
                <label className="block text-xs font-medium text-gray-700 mb-1">Last Name</label>
                <input
                  type="text"
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-500 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500 text-xs"
                  required
                />
                {errors.last_name && <span className="text-red-300 text-xs">{errors.last_name}</span>}
              </div>
              <div className="flex-1">
                <label className="block text-xs font-medium text-gray-700 mb-1">First Name</label>
                <input
                  type="text"
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-700 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500 text-xs"
                  required
                />
                {errors.first_name && <span className="text-red-300 text-xs">{errors.first_name}</span>}
              </div>
            </div>
            
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Contact Number</label>
              <input
                type="text"
                name="contact_no"
                value={formData.contact_no}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-700 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500 text-xs"
                required
              />
              {errors.contact_no && <span className="text-red-300 text-xs">{errors.contact_no}</span>}
            </div>
            
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-700 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500 text-xs"
                required
              />
              {errors.email && <span className="text-red-300 text-xs">{errors.email}</span>}
            </div>
            
            <div className="flex space-x-4">
              <div className="flex-1">
                <label className="block text-xs font-medium text-gray-700 mb-1">Password</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-700 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500 text-xs"
                  required
                />
                {errors.password && <span className="text-red-300 text-xs">{errors.password}</span>}
              </div>
              <div className="flex-1">
                <label className="block text-xs font-medium text-gray-700 mb-1">Confirm Password</label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-700 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500 text-xs"
                  required
                />
                {errors.confirmPassword && <span className="text-red-300 text-xs">{errors.confirmPassword}</span>}
              </div>
            </div>
            
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">User Type</label>
              <select
                name="user_type"
                value={formData.user_type}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-700 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500 text-xs"
                required
              >
                <option value="" disabled hidden>Select User Type</option>
                <option value="admin">Admin</option>
                <option value="client">Client</option>
              </select>
              {errors.user_type && <span className="text-red-300 text-xs">{errors.user_type}</span>}
            </div>
            
            <button
              type="submit"
              className="w-full py-2 bg-green-700 text-white rounded-md hover:bg-green-800 transition-colors text-xs font-medium"
              disabled={loading}
            >
              {loading ? "Registering..." : "Register"}
            </button>
          </form>
          <p className="mt-4 text-xs text-center text-gray-700">
            Already have an account?{' '}
            <Link to="/login" className="text-green-700 hover:underline">
              Log-in
            </Link>
          </p>
        </div>
      </div>

      {/* Car image on right side */}
      <img
              src={car}
              alt="Car"
              className="absolute bottom-0 right-0 w-1/2 md:w-1/2 object-contain h-auto"
            />
    </div>
  );
};

export default Register;