import React, { useState, useEffect } from "react";
import axios from "axios";
import profile from "../../assets/profile.png";
import { useNavigate } from "react-router-dom";

function Profile() {
  const [isEditing, setIsEditing] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [userData, setUserData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    contact_no: "",
    user_type: ""
  });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

useEffect(() => {
  const fetchProfile = async () => {
    try {
      // First verify authentication
      const authCheck = await axios.get('/api/auth/verify', { 
        withCredentials: true 
      });
      
      // Then fetch profile data
      const response = await axios.get('/api/profile', {
        withCredentials: true
      });
      
      setUserData(response.data);
    } catch (error) {
      console.error('Authentication check failed:', error);
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  fetchProfile();
}, [navigate]);
  const handleSave = async () => {
    try {
      const { first_name, last_name, email, contact_no } = userData;
      await axios.put("/api/profile", 
        { first_name, last_name, email, contact_no },
        { withCredentials: true }
      );
      setIsEditing(false);
      setShowPopup(true);
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData(prev => ({ ...prev, [name]: value }));
  };

  if (loading) {
    return <div className="pl-5 h-full bg-[#F9FFF5] flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="pl-5 h-full bg-[#F9FFF5] overflow-auto">
      {/* Header */}
      <div className="p-6 ml-0">
        <h1 className="text-3xl font-bold">Profile</h1>
      </div>

      {/* Profile Image Section */}
      <div className="mt-5 w-4/5 flex items-center justify-between border rounded-md p-4 mx-auto shadow-md" style={{ borderColor: "#DDC7C7" }}>
        <div className="flex items-center">
          <img
            src={profile}
            alt="User"
            className="w-25 h-25 rounded-full object-cover"
          />
          <p className="ml-5 text-xl font-bold">{`${userData.first_name} ${userData.last_name}`}</p>
        </div>
        {isEditing && (
          <button className="px-4 py-2 bg-green-700 text-white rounded-md text-sm">
            Upload Image
          </button>
        )}
      </div>

      {/* Personal Info Section */}
      <div className="mt-5 w-4/5 flex flex-col border rounded-md py-8 px-4 mx-auto shadow-md" style={{ borderColor: "#DDC7C7" }}>
        <div className="flex items-center justify-between w-full">
          <p className="ml-2 text-xl font-medium">PERSONAL INFORMATION</p>
          {!isEditing && (
            <button
              className="px-5 py-2 text-sm font-medium rounded-md shadow"
              style={{ backgroundColor: "#F9CA9C" }}
              onClick={() => setIsEditing(true)}
            >
              Edit
            </button>
          )}
        </div>

        {/* Name Fields */}
        <div className="mx-2 mt-4 flex justify-between w-4/5">
          <div className="w-1/2 pr-2">
            <p className="text-slate-600 font-poppins mb-2">First name</p>
            {isEditing ? (
              <input
                type="text"
                name="first_name"
                value={userData.first_name}
                onChange={handleChange}
                className="w-full p-2 border rounded-md mt-1"
              />
            ) : (
              <p className="font-medium font-poppins">{userData.first_name}</p>
            )}
          </div>
          <div className="w-1/2 pl-2">
            <p className="text-slate-600 font-poppins mb-2">Last name</p>
            {isEditing ? (
              <input
                type="text"
                name="last_name"
                value={userData.last_name}
                onChange={handleChange}
                className="w-full p-2 border rounded-md mt-1"
              />
            ) : (
              <p className="font-medium font-poppins">{userData.last_name}</p>
            )}
          </div>
        </div>

        {/* Contact Info */}
        <div className="mx-2 mt-10 flex justify-between w-4/5">
          <div className="w-1/3 pr-2">
            <p className="text-slate-600 font-poppins mb-2">Email address</p>
            {isEditing ? (
              <input
                type="email"
                name="email"
                value={userData.email}
                onChange={handleChange}
                className="w-full p-2 border rounded-md mt-1"
              />
            ) : (
              <p className="font-poppins">{userData.email}</p>
            )}
          </div>
          <div className="w-1/3 px-2">
            <p className="text-slate-600 font-poppins mb-2">Contact Number</p>
            {isEditing ? (
              <input
                type="text"
                name="contact_no"
                value={userData.contact_no}
                onChange={handleChange}
                className="w-full p-2 border rounded-md mt-1"
              />
            ) : (
              <p className="font-poppins">{userData.contact_no}</p>
            )}
          </div>
          <div className="w-1/3 pl-2">
            <p className="text-slate-600 font-poppins mb-2">User role</p>
            <p className="font-poppins capitalize">{userData.user_type}</p>
          </div>
        </div>

        {/* Success Popup */}
        {showPopup && (
          <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="p-6 rounded-lg shadow-lg text-center" style={{ backgroundColor: "#E0F2E9" }}>
              <h2 className="text-lg font-semibold mb-2">Successfully Saved!</h2>
              <button
                className="px-4 py-2 text-white rounded-md"
                style={{ backgroundColor: "#15803D" }}
                onClick={() => setShowPopup(false)}
              >
                OK
              </button>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        {isEditing && (
          <div className="flex justify-end gap-2 mt-6 pr-2">
            <button
              className="px-4 py-2 bg-gray-300 rounded-md"
              onClick={() => setIsEditing(false)}
            >
              Discard
            </button>
            <button
              className="px-4 py-2 bg-green-800 text-white rounded-md"
              onClick={handleSave}
            >
              Save
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Profile;