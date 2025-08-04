import React, { useState , useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from 'react-router-dom';
import background from "../assets/background.png";
import car from "../assets/car.png";
import logo from "../assets/logo.png";

axios.defaults.baseURL = 'http://localhost:3001';

const Register = () => {

   // Prevent page scroll
           useEffect(() => {
             document.body.style.overflow = "hidden";
             return () => {
               document.body.style.overflow = "auto";
             };
           }, []);


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
    <div className="min-h-screen bg-cover bg-center relative flex items-center justify-start pl-35"
      style={{ backgroundImage: `url(${background})` }}>
      <div className="absolute top-1 left-6 flex items-center space-x-2">
        <img src={logo} alt="VDS Logo" className="h-15 w-auto" />
        <h1 className="text-black text-xl font-bold">Vehicle Dispatch System</h1>
      </div>
      <div className="bg-opacity-90 rounded-xl p-11 w-90 max-w-md z-10">
        <h1 className="text-xl font-semibold mb-0 text-center text-green-700">Register</h1>
        {serverError && (
          <div className="p-3 mb-4 text-red-700 bg-red-100 rounded-md">
            <p>{serverError}</p>
          </div>
        )}
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-xs p-0 font-medium mt-0 text-gray-700">Last Name</label>
            <input
              type="text"
              name="last_name"
              value={formData.last_name}
              onChange={handleChange}
              className="w-70 px-0 py-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-600 text-xs"
              required
            />
            {errors.last_name && <span className="text-red-600 text-xs">{errors.last_name}</span>}
          </div>
          <div>
            <label className="block text-xs p-0 font-medium mt-0 text-gray-700">First Name</label>
            <input
              type="text"
              name="first_name"
              value={formData.first_name}
              onChange={handleChange}
              className="w-70 px-0 py-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-600 text-xs"
              required
            />
            {errors.first_name && <span className="text-red-600 text-xs">{errors.first_name}</span>}
          </div>
          <div>
            <label className="block text-xs p-0 font-medium mt-0 text-gray-700">Contact Number</label>
            <input
              type="text"
              name="contact_no"
              value={formData.contact_no}
              onChange={handleChange}
              className="w-70 px-0 py-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-600 text-xs"
              required
            />
            {errors.contact_no && <span className="text-red-600 text-xs">{errors.contact_no}</span>}
          </div>
          <div>
            <label className="block text-xs p-0 font-medium mt-0 text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-70 px-0 py-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-600 text-xs"
              required
            />
            {errors.email && <span className="text-red-600 text-xs">{errors.email}</span>}
          </div>
          <div>
            <label className="block text-xs p-0 font-medium mt-0 text-gray-700">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-70 px-0 py-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-600 text-xs"
              required
            />
            {errors.password && <span className="text-red-600 text-xs">{errors.password}</span>}
          </div>
          <div>
            <label className="block text-xs p-0 font-medium mt-0 text-gray-700">Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-70 px-0 py-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-600 text-xs"
              required
            />
            {errors.confirmPassword && <span className="text-red-600 text-xs">{errors.confirmPassword}</span>}
          </div>
          <div>
            <label className="block text-xs p-1 font-medium text-gray-700">User Type</label>
            <select
              name="user_type"
              value={formData.user_type}
              onChange={handleChange}
              className="w-70 px-0 py-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-600 text-xs"
              required
            >
              <option value="">Select User Type</option>
              <option value="admin">Admin</option>
              <option value="client">Client</option>
            </select>
            {errors.user_type && <span className="text-red-600 text-xs">{errors.user_type}</span>}
          </div>
          <button
            type="submit"
            className="w-70 py-2 bg-green-700 text-white rounded-md mt-0.5 hover:bg-green-800 transition text-xs"
            disabled={loading}
          >
            {loading ? "Registering..." : "Register"}
          </button>
        </form>
        <p className="mt-0.5 text-xs text-center text-gray-600">
          Already have an account?{' '}
          <Link to="/login" className="text-green-700 hover:underline">
            Log-in
          </Link>
        </p>
      </div>
      <img src={car} alt="Car" className="absolute bottom-0 right-0 w-1/2 md:w-1/2 object-contain h-auto" />
    </div>
  );
};

export default Register;