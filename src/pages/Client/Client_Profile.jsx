import React, { useState, useEffect } from "react";
import axios from "axios";
import profile from "../../assets/profile.png";

function Profile() {
  const [isEditing, setIsEditing] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [profileData, setProfileData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    contact_no: "",
    user_type: "Client",
    office: ""
  });
  const [isLoading, setIsLoading] = useState(true);

  // Fetch profile data
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get('/api/profile', {
          withCredentials: true
        });
        setProfileData(response.data);
      } catch (error) {
        console.error('Failed to fetch profile:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = async () => {
    try {
      await axios.put('/api/profile', {
        first_name: profileData.first_name,
        last_name: profileData.last_name,
        email: profileData.email,
        contact_no: profileData.contact_no
      }, {
        withCredentials: true
      });
      
      setShowPopup(true);
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update profile:', error);
      alert(error.response?.data?.message || 'Failed to update profile');
    }
  };

  if (isLoading) {
    return (
      <div className="pl-5 h-full bg-[#F9FFF5] flex items-center justify-center">
        <p>Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="pl-5 h-full bg-[#F9FFF5] overflow-auto">
      <div className="p-6 ml-0">
        <h1 className="text-3xl font-bold">Profile</h1>
      </div>

      {/* Profile Image Section */}
      <div
        className="mt-5 w-4/5 flex items-center justify-between border rounded-md p-4 mx-auto shadow-md"
        style={{ borderColor: "#DDC7C7" }}
      >
        <div className="flex items-center">
          <img
            src={profile}
            alt="User"
            className="w-25 h-25 rounded-full object-cover"
          />
          <p className="ml-5 text-xl font-bold">{`${profileData.first_name} ${profileData.last_name}`}</p>
        </div>

        {isEditing && (
          <button className="px-4 py-2 bg-green-700 text-white rounded-md text-sm">
            Upload Image
          </button>
        )}
      </div>

      {/* Personal Info Section */}
      <div
        className="mt-5 w-4/5 flex flex-col border rounded-md py-8 px-4 mx-auto shadow-md"
        style={{ borderColor: "#DDC7C7" }}
      >
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

        {/* First + Last Name */}
        <div className="mx-2 mt-4 flex justify-between w-4/5">
          <div className="w-1/2 pr-2">
            <p className="text-slate-600 font-poppins mb-2">First name</p>
            {isEditing ? (
              <input
                type="text"
                name="first_name"
                value={profileData.first_name}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-md mt-1"
              />
            ) : (
              <p className="font-medium font-poppins">{profileData.first_name}</p>
            )}
          </div>
          <div className="w-1/2 pl-2">
            <p className="text-slate-600 font-poppins mb-2">Last name</p>
            {isEditing ? (
              <input
                type="text"
                name="last_name"
                value={profileData.last_name}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-md mt-1"
              />
            ) : (
              <p className="font-medium font-poppins">{profileData.last_name}</p>
            )}
          </div>
        </div>

        {/* Email, Contact, Role */}
        <div className="mx-2 mt-10 flex justify-between w-4/5">
          <div className="w-1/3 pr-2">
            <p className="text-slate-600 font-poppins mb-2">Email address</p>
            {isEditing ? (
              <input
                type="email"
                name="email"
                value={profileData.email}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-md mt-1"
              />
            ) : (
              <p className="font-poppins">{profileData.email}</p>
            )}
          </div>
          <div className="w-1/3 px-2">
            <p className="text-slate-600 font-poppins mb-2">Contact Number</p>
            {isEditing ? (
              <input
                type="text"
                name="contact_no"
                value={profileData.contact_no}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-md mt-1"
              />
            ) : (
              <p className="font-poppins">{profileData.contact_no}</p>
            )}
          </div>
          <div className="w-1/3 pl-2">
            <p className="text-slate-600 font-poppins mb-2">User role</p>
            <p className="font-poppins">{profileData.user_type}</p>
          </div>
        </div>

        {profileData.office && (
          <div className="mx-2 mt-10 w-4/5">
            <p className="text-slate-600 font-poppins mb-2">Office</p>
            <p className="font-poppins">{profileData.office}</p>
          </div>
        )}

        {/* Save Confirmation Popup */}
        {showPopup && (
          <div className="fixed inset-0 flex items-center justify-center z-50">
            <div
              className="p-6 rounded-lg shadow-lg text-center"
              style={{ backgroundColor: "#E0F2E9" }}
            >
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