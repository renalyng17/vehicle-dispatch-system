import React, { useState, useEffect } from "react";
import axios from "axios";
import profile from "../../assets/profile.png";
import { useLocation } from "react-router-dom";

axios.defaults.baseURL = "http://localhost:3001";

function Profile() {
  const location = useLocation();
  const [isEditing, setIsEditing] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [userData, setUserData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    contact: "",
    userType: "",
    office: "",
  });

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  useEffect(() => {
    const loadUserData = async () => {
      try {
        setIsLoading(true);
        
        if (location.state?.registrationSuccess) {
          const { userData } = location.state;
          setUserData({
            firstName: userData.firstName,
            lastName: userData.lastName,
            email: userData.email,
            contact: userData.contact,
            userType: userData.userType,
            office: userData.office || "",
          });
          return;
        }

        const local = localStorage.getItem("userData");
        if (local) {
          setUserData(JSON.parse(local));
          return;
        }

        const session = sessionStorage.getItem("userData");
        if (session) {
          setUserData(JSON.parse(session));
          return;
        }

        const userId = localStorage.getItem("userId");
        const token = localStorage.getItem("token");

        if (!userId || !token) {
          throw new Error("User not authenticated");
        }

        const response = await axios.get(`/api/auth/user/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = response.data;
        const parsedUser = {
          firstName: data.first_name || "",
          lastName: data.last_name || "",
          email: data.email || "",
          contact: data.contact_no || "",
          userType: data.user_type || "",
          office: data.office || "",
        };

        setUserData(parsedUser);
        localStorage.setItem("userData", JSON.stringify(parsedUser));
      } catch (err) {
        console.error("Failed to fetch user data:", err);
      } finally {
        setIsLoading(false);
      }
    };

    loadUserData();
  }, [location.state]);

  const handleSave = async () => {
    try {
      setIsLoading(true);
      const userId = localStorage.getItem("userId");
      const token = localStorage.getItem("token");

      if (!userId || !token) {
        throw new Error("User not authenticated");
      }

      localStorage.setItem("userData", JSON.stringify(userData));
      sessionStorage.setItem("userData", JSON.stringify(userData));

      await axios.put(
        `/api/auth/user/${userId}`,
        {
          first_name: userData.firstName,
          last_name: userData.lastName,
          contact_no: userData.contact,
          office: userData.office,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setIsEditing(false);
      setShowPopup(true);
    } catch (error) {
      console.error("Failed to update profile:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen ">
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen  p-6 font-sans">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Profile Settings</h1>
              <p className="text-gray-500 mt-2">
                Manage your personal information and account details
              </p>
            </div>
            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center px-5 py-2.5 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-all hover:border-green-500 group"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2 text-gray-500 group-hover:text-green-600 transition-colors"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                </svg>
                <span className="font-medium text-gray-700 group-hover:text-green-600 transition-colors">
                  Edit Profile
                </span>
              </button>
            )}
          </div>
          <div className="border-b border-gray-200 mt-6"></div>
        </div>

        {/* Profile Card */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
          <div className="p-8 flex flex-col lg:flex-row">
            {/* Avatar Section */}
            <div className="lg:w-1/4 flex flex-col items-center lg:items-start lg:pr-8 mb-8 lg:mb-0">
              <div className="relative group">
                <div className="w-40 h-40 rounded-full bg-gradient-to-br from-green-100 to-gray-100 overflow-hidden border-4 border-white shadow-md">
                  <img
                    src={profile}
                    alt="User"
                    className="w-full h-full object-cover"
                  />
                </div>
                {isEditing && (
                  <button className="absolute bottom-2 right-2 bg-white p-2 rounded-full shadow-md hover:bg-gray-50 transition-all transform hover:scale-105  border border-gray-200">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-gray-600"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M4 5a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2h-1.586a1 1 0 01-.707-.293l-1.121-1.121A2 2 0 0011.172 3H8.828a2 2 0 00-1.414.586L6.293 4.707A1 1 0 015.586 5H4zm6 9a3 3 0 100-6 3 3 0 000 6z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                )}
              </div>
              
              <div className="mt-6 text-center lg:text-left">
                <h2 className="text-2xl font-semibold text-gray-800">
                  {`${userData.firstName} ${userData.lastName}`}
                </h2>
                <div className="mt-2 inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 capitalize">
                  {userData.userType}
                </div>
                <div className="mt-4 text-sm text-gray-500">
                  Member since {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}
                </div>
              </div>
            </div>

            {/* Information Section */}
            <div className="lg:w-3/4 lg:pl-8 border-l border-gray-100 lg:border-l lg:border-gray-200">
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  Personal Information
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-600">
                      First Name
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="firstName"
                        value={userData.firstName}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                        placeholder="Enter your first name"
                      />
                    ) : (
                      <p className="text-gray-800 py-2.5 px-1">{userData.firstName}</p>
                    )}
                  </div>

                  <div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-600">
                      Last Name
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="lastName"
                        value={userData.lastName}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                        placeholder="Enter your last name"
                      />
                    ) : (
                      <p className="text-gray-800 py-2.5 px-1">{userData.lastName}</p>
                    )}
                  </div>

                  <div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-600">
                      Email Address
                    </label>
                    {isEditing ? (
                      <input
                        type="email"
                        name="email"
                        value={userData.email}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                        placeholder="Enter your email"
                      />
                    ) : (
                      <p className="text-gray-800 py-2.5 px-1">{userData.email}</p>
                    )}
                  </div>

                  <div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-600">
                      Contact Number
                    </label>
                    {isEditing ? (
                      <input
                        type="tel"
                        name="contact"
                        value={userData.contact}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                        placeholder="Enter your phone number"
                      />
                    ) : (
                      <p className="text-gray-800 py-2.5 px-1">{userData.contact}</p>
                    )}
                  </div>

                  {userData.office && (
                    <div className="md:col-span-2 space-y-1">
                      <label className="block text-sm font-medium text-gray-600">
                        Office
                      </label>
                      {isEditing ? (
                        <input
                          type="text"
                          name="office"
                          value={userData.office}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                          placeholder="Enter your office"
                        />
                      ) : (
                        <p className="text-gray-800 py-2.5 px-1">{userData.office}</p>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {isEditing && (
                <div className="flex justify-end space-x-3 pt-6 border-t border-gray-100">
                  <button
                    onClick={() => setIsEditing(false)}
                    className="px-6 py-2.5 border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50 transition-all font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={isLoading}
                    className="px-6 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all font-medium flex items-center disabled:opacity-70"
                  >
                    {isLoading ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Saving...
                      </>
                    ) : (
                      "Save Changes"
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Success Popup */}
      {showPopup && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-30 backdrop-blur-sm">
          <div className="bg-white p-8 rounded-xl shadow-xl max-w-md w-full animate-fade-in">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-50 mb-4">
                <svg
                  className="h-8 w-8 text-green-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                Profile Updated Successfully
              </h3>
              <p className="text-gray-500 mb-6">
                Your changes have been saved.
              </p>
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