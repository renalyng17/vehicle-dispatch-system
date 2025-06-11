import { useState } from "react";
import Nav from "./nav.jsx";
import NotificationBar from "./NotificationBar.jsx";
import profile from "./assets/profile.png";

function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="relative h-screen overflow-hidden">
      {/* Top Notification Bar */}
      <NotificationBar />

      {/* Overlay Sidebar */}
      <div className="absolute top-0 left-0 z-2 h-full">
        <Nav />
      </div>

      {/* Main Page Content */}
      <div
        className="pl-72 pt-[35px] h-full bg-gray-50 overflow-auto"
        style={{ backgroundColor: "#FBFFF5" }}
      >
        <div className="p-6 ml-4">
          <h1 className="text-3xl font-bold">PROFILE</h1>
        </div>

        <div>
          <div
            className="mt-5 w-4/5 flex items-center border rounded-md p-4 mx-auto shadow-md"
            style={{ borderColor: "#DDC7C7" }}
          >
            {/* Profile Image */}
            <img
              src={profile}
              alt="User"
              className="w-25 h-25 rounded-full object-cover"
            />

            {/* User Name */}
            <p className="ml-5 text-xl font-bold">John Doe</p>
          </div>
        </div>

        <div>
          <div
            className="mt-5 w-4/5 flex flex-col border rounded-md p-4 mx-auto shadow-md"
            style={{ borderColor: "#DDC7C7" }}
          >
            <div className="flex items-center justify-between w-full">
              <p className="ml-2 text-xl font-medium">PERSONAL INFORMATION</p>
              <button
                className="px-5 py-2 text-sm font-medium rounded-md shadow"
                style={{ backgroundColor: "#F9CA9C" }}
              >
                Edit
              </button>


            </div>

            <div className="mx-2 mt-4 flex justify-between w-4/5">
              <div>
                <p className="text-slate-600 font-poppins">First name</p>
              </div>
              <div>
                <p className="text-slate-600 font-poppins">Last name</p>
              </div>
            </div>

            <div className="mx-2 my-4 flex justify-between w-4/5">
              <div>
                <p className="font-medium font-poppins">John</p>
              </div>
              <div>
                <p className="font-medium font-poppins">Doe</p>
              </div>
            </div>

            <div className="mx-2 mt-8 flex justify-between w-4/5">
              <div>
                <p className="text-slate-600 font-poppins">Email address</p>
              </div>
              <div>
                <p className="text-slate-600 font-poppins">Contact Number</p>
              </div>
              <div>
                <p className="text-slate-600 font-poppins">User role</p>
              </div>
            </div>

          <div className="mx-2 my-4 flex justify-between w-4/5">
              <div>
                <p className=" font-poppins">Admin123@gmail.com</p>
              </div>
              <div>
                <p className=" font-poppins">1234-5678-910</p>
              </div>
              <div>
                <p className=" font-poppins">Admin</p>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
