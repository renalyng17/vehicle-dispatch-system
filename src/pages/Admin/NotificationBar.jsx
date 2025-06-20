import { Bell } from "lucide-react";
import { useState, useEffect } from "react";

export default function NotificationBar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isDeclineModalOpen, setIsDeclineModalOpen] = useState(false);
  const [isAcceptModalOpen, setIsAcceptModalOpen] = useState(false);
  const [bellPosition, setBellPosition] = useState({ top: 0, right: 0 });

  // Get bell icon position when component mounts
  useEffect(() => {
    const bell = document.getElementById('notification-bell');
    if (bell) {
      const rect = bell.getBoundingClientRect();
      setBellPosition({
        top: rect.top + window.scrollY,
        right: window.innerWidth - rect.right
      });
    }
  }, []);

  const handleButtonClick = (e, action) => {
    e.stopPropagation();
    if (action === 'decline') {
      setIsDeclineModalOpen(true);
    } else if (action === 'accept') {
      setIsAcceptModalOpen(true);
    }
  };

  return (
    <>
      {/* Bell Icon - Fixed Position */}
      <button
    
  id="notification-bell"
  className="fixed top-5 right-7 hover:text-lime-200 transition duration-200 z-50"
  onClick={() => setIsOpen(!isOpen)}
>
  <Bell className="w-6 h-6" />
  <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500" />
</button>

      {/* Notification Dropdown - Fixed Position */}
      {isOpen && (
  <div 
    className="fixed bg-white rounded-md shadow-lg z-50"
    style={{
      top: `calc(${bellPosition.top}px + 2 rem)`,  // Using CSS calc
      right: `calc(${bellPosition.left}px - 1rem)`,
      width: '320px',
      transform: 'translateX(+715px) translateY(+50px)' 
     // Optional fine adjustment
    }}
    onClick={(e) => e.stopPropagation()}
  >
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

              <div className="flex justify-end gap-x-2 mt-4">
                <button
                  onClick={(e) => handleButtonClick(e, 'decline')}
                  className="px-5 py-2 bg-red-500 text-white rounded-md text-sm"
                >
                  Decline
                </button>
                <button
                  onClick={(e) => handleButtonClick(e, 'accept')}
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

      {/* Decline Modal - Fixed Position */}
      {isDeclineModalOpen && (
        <div 
          className="fixed inset-0bg-opacity-30 flex items-center justify-center z-[60]"
          onClick={() => setIsDeclineModalOpen(false)}
        >
          <div 
            className="fixed bg-white p-5 rounded-lg shadow-lg"
            style={{
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '400px'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-2xl font-bold text-center text-green-800 mb-6">
              DECLINE REQUEST
            </h2>

            <div className="text-gray-800 space-y-3 text-xs">
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
                className="px-3 py-2 bg-gray-300 text-sm rounded-md"
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

      {/* Accept Modal - Fixed Position */}
      {isAcceptModalOpen && (
        <div 
          className="fixed inset-0bg-opacity-30 flex items-center justify-center z-[60]"
          onClick={() => setIsAcceptModalOpen(false)}
        >
          <div 
            className="fixed bg-white p-6 rounded-lg shadow-lg"
            style={{
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '400px'
            }}
            onClick={(e) => e.stopPropagation()}
          >
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
    </>
  );
}

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