import { Bell } from "lucide-react";
import { useState } from "react";

export default function NotificationBar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isDeclineModalOpen, setIsDeclineModalOpen] = useState(false);
  const [isAcceptModalOpen, setIsAcceptModalOpen] = useState(false);

  return (
    <div className="flex items-center space-x-4 mr-7 relative">
      {/* Bell Icon */}
      <button
        className="relative hover:text-lime-200 transition duration-200"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Bell className="absolute top-5 left-250 w-6 h-6" />
        <span className="absolute top-5 left-253 block h-2 w-2 rounded-full bg-red-500" />
      </button>

      {/* Notification Dropdown */}
      {isOpen && (
        <div className="absolute right-0 top-12 w-80 bg-white rounded-md shadow-lg  z-50">
          <div className="p-4">
            <h3 className="font-semibold text-lg mb-2">Notification</h3>
            <div className="border-b pb-3 mb-3">
              <div className="flex justify-between items-start">
                <h4 className="font-medium">John Manuel, Have Travel!</h4>
              </div>
              <p className="text-sm text-gray-600 mt-1">
                Date: June 01 Sun - June 04 Wed
              </p>
              <p className="text-sm text-gray-600">Time: 3:00 PM</p>
              <p className="text-sm text-gray-600">Destination: Terminal 2</p>

              {/* Buttons */}
              <div className="flex justify-end gap-x-2 mt-4">
                <button
                  onClick={() => setIsDeclineModalOpen(true)}
                  className="px-5 py-2 bg-red-500 text-white rounded-md text-sm"
                >
                  Decline
                </button>
                <button
                  onClick={() => setIsAcceptModalOpen(true)}
                  className="px-5 py-2 bg-green-500 text-white rounded-md text-sm"
                >
                  Accept
                </button>
              </div>
            </div>

            <div className="text-center text-sm text-gray-500">
              No more notifications
            </div>
          </div>
        </div>
      )}

      {/* Decline Modal */}
      {isDeclineModalOpen && (
        <div className="fixed inset-0 bg-opacity-1 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-[400px] shadow-lg relative">
            <h2 className="text-2xl font-bold text-center text-green-800 mb-6">
              DECLINE REQUEST
            </h2>

            <div className="text-gray-800 space-y-3 text-xs ">
              <Input label="Employee Name" value="Robert Tim" />
              <div className="flex gap-2">
                <Input label="Date" value="05/30/2025 - 05/31/2025" />
                <Input label="Time" value="1:00pm - 5:00pm" />
              </div>
              <Input label="Destination" value="Palawan" />
              <Input label="Office Department" value="SysADD" />
              <div>
                <label className="block font-medium">Reason (optional)</label>
                <textarea
                  rows="3"
                  placeholder="Enter reason here..."
                  className="w-full border-1 shadow-lg rounded-md px-3 py-2"
                ></textarea>
              </div>
            </div>

            <div className="flex justify-end gap-x-3 mt-6">
              <button
                onClick={() => setIsDeclineModalOpen(false)}
                className="px-3 py-2 bg-gray-300  text-sm rounded-md"
              >
                Discard
              </button>
              <button className="px-3 py-2 bg-green-700 text-white text-sm rounded-md">
                Process
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Accept Modal */}
      {isAcceptModalOpen && (
        <div className="fixed inset-0 bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-[400px] shadow-lg relative">
            <h2 className="text-2xl font-bold text-center text-green-800 mb-6">
              ACCEPT REQUEST
            </h2>

            <div className="space-y-3 text-xs text-gray-800">
              <Input label="Employee Name" value="Robert Tim" />
              <div className="flex gap-2">
                <Input label="Date" value="05/30/2025 - 05/31/2025" />
                <Input label="Time" value="1:00pm - 5:00pm" />
              </div>
              <Input label="Destination" value="Palawan" />
              <Input label="Office Department" value="SysADD" />

              {/* Dropdowns */}
              <div>
                <label className="block font-medium">Driver</label>
                <select className="w-full border rounded-md px-3 py-2">
                  <option>Select Driver</option>
                  <option>Juan Dela Cruz</option>
                  <option>Maria Santos</option>
                </select>
              </div>

              <div className="flex gap-2">
                <div className="w-1/2">
                  <label className="block font-medium">Vehicle Type</label>
                  <select className="w-full border rounded-md px-3 py-2">
                    <option>Select Vehicle</option>
                    <option>Van</option>
                    <option>Car</option>
                    <option>Truck</option>
                  </select>
                </div>
                <div className="w-1/2">
                  <label className="block font-medium">Plate No.</label>
                  <select className="w-full border rounded-md px-3 py-2">
                    <option>Select Plate</option>
                    <option>ABC-1234</option>
                    <option>XYZ-5678</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-x-2 mt-6">
              <button
                onClick={() => setIsAcceptModalOpen(false)}
                className="px-5 py-2 bg-gray-300 text-sm rounded-md"
              >
                Discard
              </button>
              <button className="px-5 py-2 bg-green-700 text-white text-sm rounded-md">
                Process
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Reusable Input Field Component
function Input({ label, value }) {
  return (
    <div>
      <label className="block font-medium">{label}</label>
      <input
        type="text"
        value={value}
        readOnly
        className="w-full border rounded-md px-3 py-2"
      />
    </div>
  );
}
