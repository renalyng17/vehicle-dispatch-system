import { useState } from "react";
import Nav from "./nav.jsx";
import NotificationBar from "./NotificationBar.jsx";
import profile from "./assets/profile.png";

function App() {
  const [isEditing, setIsEditing] = useState(false);
  const [firstName, setFirstName] = useState("John");
  const [lastName, setLastName] = useState("Doe");
  const [email, setEmail] = useState("Admin123@gmail.com");
  const [contact, setContact] = useState("1234-5678-910");

  return (
    <div className="relative h-screen overflow-hidden">
      <NotificationBar />
      <div className="absolute top-0 left-0 z-2 h-full">
        <Nav />
      </div>

      <div
        className="pl-72 pt-[35px] h-full bg-gray-50 overflow-auto"
        style={{ backgroundColor: "#FBFFF5" }}
      >
        <div className="p-6 ml-4">
          <h1 className="text-3xl font-bold">PROFILE</h1>
        </div>

        {/* Profile Image Section */}
        <div className="mt-5 w-4/5 flex items-center justify-between border rounded-md p-4 mx-auto shadow-md" style={{ borderColor: "#DDC7C7" }}>
          <div className="flex items-center">
            <img
              src={profile}
              alt="User"
              className="w-25 h-25 rounded-full object-cover"
            />
            <p className="ml-5 text-xl font-bold">{firstName} {lastName}</p>
            <p></p>
          </div>

          {isEditing && (
            <button className="px-4 py-2 bg-green-700 text-white rounded-md text-sm">Upload Image</button>
          )}
        </div>

        {/* Personal Info Section */}
        <div className="mt-5 w-4/5 flex flex-col border rounded-md py-8 px-4 mx-auto shadow-md" style={{ borderColor: "#DDC7C7" }}>
          <div className="flex items-center justify-between w-full">
            <p className="ml-2 text-xl font-medium">PERSONAL INFORMATION</p>
            <button
              className="px-5 py-2 text-sm font-medium rounded-md shadow"
              style={{ backgroundColor: "#F9CA9C" }}
              onClick={() => setIsEditing(true)}
            >
              Edit
            </button>
          </div>

          {/* First + Last Name */}
          <div className="mx-2 mt-4 flex justify-between w-4/5">
            <div className="w-1/2 pr-2">
              <p className="text-slate-600 font-poppins mb-2">First name</p>
              {isEditing ? (
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full p-2 border rounded-md mt-1"
                />
              ) : (
                <p className="font-medium font-poppins">{firstName}</p>
              )}
            </div>
            <div className="w-1/2 pl-2">
              <p className="text-slate-600 font-poppins mb-2">Last name</p>
              {isEditing ? (
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full p-2 border rounded-md mt-1"
                />
              ) : (
                <p className="font-medium font-poppins">{lastName}</p>
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
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-2 border rounded-md mt-1"
                />
              ) : (
                <p className="font-poppins">{email}</p>
              )}
            </div>
            <div className="w-1/3 px-2">
              <p className="text-slate-600 font-poppins mb-2">Contact Number</p>
              {isEditing ? (
                <input
                  type="text"
                  value={contact}
                  onChange={(e) => setContact(e.target.value)}
                  className="w-full p-2 border rounded-md mt-1"
                />
              ) : (
                <p className="font-poppins">{contact}</p>
              )}
            </div>
            <div className="w-1/3 pl-2">
              <p className="text-slate-600 font-poppins mb-2">User role</p>
              <p className="font-poppins">Admin</p>
            </div>
          </div>

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
                className="px-4 py-2 bg-green-600 text-white rounded-md"
                onClick={() => setIsEditing(false)}
              >
                Save
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
