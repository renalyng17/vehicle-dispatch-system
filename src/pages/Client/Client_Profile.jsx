import React, { useState, useEffect } from "react";
import axios from "axios";
import profile from "../../assets/profile.png";
// If you use useLocation, uncomment below:
// import { useLocation } from 'react-router-dom';

function Profile() {
  // const location = useLocation(); // only if needed
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

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get('/api/profile', { withCredentials: true });
        setProfileData(response.data);
      } catch (error) {
        console.error('Failed to fetch profile:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProfile();
  }, []);

   // Prevent body scroll (optional: consider if needed)
    useEffect(() => {
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = "auto";
      };
    }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      await axios.put('/api/profile', {
        first_name: profileData.first_name,
        last_name: profileData.last_name,
        email: profileData.email,
        contact_no: profileData.contact_no,
        office: profileData.office
      }, { withCredentials: true });

      setShowPopup(true);
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update profile:', error);
      alert(error.response?.data?.message || 'Failed to update profile');
    }
  };

  const handleCancel = () => {
    // Optionally refetch to reset changes
    setIsEditing(false);
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

      {/* === Keep only the better profile card (the second one) === */}
      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
          <div className="p-8 flex flex-col lg:flex-row">
            {/* Avatar */}
            <div className="lg:w-1/4 flex flex-col items-center lg:items-start lg:pr-8 mb-8 lg:mb-0">
              <div className="relative group">
                <div className="w-40 h-40 rounded-full bg-gradient-to-br from-green-100 to-gray-100 overflow-hidden border-4 border-white shadow-md">
                  <img src={profile} alt="User" className="w-full h-full object-cover" />
                </div>
                {isEditing && (
                  <button className="absolute bottom-2 right-2 bg-white p-2 rounded-full shadow-md hover:bg-gray-50 transition-all transform hover:scale-105 border border-gray-200">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4 5a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2h-1.586a1 1 0 01-.707-.293l-1.121-1.121A2 2 0 0011.172 3H8.828a2 2 0 00-1.414.586L6.293 4.707A1 1 0 015.586 5H4zm6 9a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                    </svg>
                  </button>
                )}
              </div>
              <div className="mt-6 text-center lg:text-left">
                <h2 className="text-2xl font-semibold text-gray-800">
                  {`${profileData.first_name} ${profileData.last_name}`}
                </h2>
                <div className="mt-2 inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 capitalize">
                  {profileData.user_type}
                </div>
                <div className="mt-4 text-sm text-gray-500">
                  Member since {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}
                </div>
              </div>
            </div>

            {/* Info */}
            <div className="lg:w-3/4 lg:pl-8 border-l border-gray-100 lg:border-l lg:border-gray-200">
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Personal Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-600">First Name</label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="first_name"
                        value={profileData.first_name}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                      />
                    ) : (
                      <p className="text-gray-800 py-2.5 px-1">{profileData.first_name}</p>
                    )}
                  </div>

                  <div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-600">Last Name</label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="last_name"
                        value={profileData.last_name}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                      />
                    ) : (
                      <p className="text-gray-800 py-2.5 px-1">{profileData.last_name}</p>
                    )}
                  </div>

                  <div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-600">Email Address</label>
                    <p className="text-gray-800 py-2.5 px-1 break-all">{profileData.email}</p>
                  </div>

                  <div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-600">Contact Number</label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="contact_no"
                        value={profileData.contact_no}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                      />
                    ) : (
                      <p className="text-gray-800 py-2.5 px-1">{profileData.contact_no}</p>
                    )}
                  </div>

                  {(profileData.office || isEditing) && (
                    <div className="md:col-span-2 space-y-1">
                      <label className="block text-sm font-medium text-gray-600">Office</label>
                      {isEditing ? (
                        <input
                          type="text"
                          name="office"
                          value={profileData.office}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                        />
                      ) : (
                        <p className="text-gray-800 py-2.5 px-1">{profileData.office}</p>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {isEditing && (
                <div className="flex justify-end space-x-3 pt-6 border-t border-gray-100">
                  <button
                    onClick={handleSave}
                    disabled={isLoading}
                    className="px-6 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all font-medium"
                  >
                    {isLoading ? "Saving..." : "Save Changes"}
                  </button>
                  <button
                    onClick={handleCancel}
                    className="px-6 py-2.5 border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50 transition-all font-medium"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ✅ Clean Success Popup (only one!) */}
      {showPopup && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-30 backdrop-blur-sm">
          <div className="bg-white p-8 rounded-xl shadow-xl max-w-md w-full animate-fade-in">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-50 mb-4">
                <svg className="h-8 w-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Profile Updated Successfully</h3>
              <p className="text-gray-500 mb-6">Your changes have been saved.</p>
              <button
                onClick={() => setShowPopup(false)}
                className="w-full max-w-xs mx-auto py-2.5 px-6 bg-green-600 hover:bg-green-700 text-white rounded-lg shadow-sm transition-all font-medium"
              >
                Continue
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Profile;