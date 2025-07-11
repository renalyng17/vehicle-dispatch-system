import React, { useState, useContext } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../Context/AuthContext";
import background from "../assets/background.png";
import car from "../assets/car.png";
import logo from "../assets/logo.png";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = async (e) => {
  e.preventDefault();
  setError("");
  setLoading(true);
  
  try {
    const result = await login(email, password, rememberMe);
    
    if (result.success) {
      // FIRST define redirectTo, THEN use it
      const redirectTo = location.search.includes('redirect=')
        ? new URLSearchParams(location.search).get('redirect')
        : result.user.user_type === 'admin'
          ? '/admin/dashboard'
          : '/client/dashboard';

      console.log("Redirecting to:", redirectTo);
      navigate(redirectTo, { replace: true });
    } else {
      setError(result.error || "Login failed. Please try again.");
    }
  } catch (err) {
    setError("An unexpected error occurred. Please try again.");
    console.error("Login error:", err);
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
        <h1 className="text-xl font-semibold mb-6 text-center text-green-700">Welcome Back to VDS</h1>
        
        {location.search.includes('registered=true') && (
          <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-md text-sm">
            <p className="font-semibold">Registration successful!</p>
            <p>You can now login with your credentials</p>
          </div>
        )}

        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md text-sm">
            <p>{error}</p>
          </div>
        )}

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-xs font-medium text-gray-700">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-600 text-xs"
              required
              autoFocus
              autoComplete="username"
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
              autoComplete="current-password"
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
            <Link to="/forgot-password" className="text-green-700 hover:underline">Forgot Password?</Link>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 bg-green-700 text-white rounded-md hover:bg-green-800 transition text-xs flex justify-center items-center ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Signing In...
              </>
            ) : (
              "Sign In"
            )}
          </button>
        </form>

        <p className="mt-4 text-xs text-center text-gray-600">
          Don't have an account?{" "}
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