import { Bell } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function NotificationBar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isDeclineModalOpen, setIsDeclineModalOpen] = useState(false);
  const [isAcceptModalOpen, setIsAcceptModalOpen] = useState(false);
  const [bellPosition, setBellPosition] = useState({ top: 0, right: 10 });
  const [formValues, setFormValues] = useState({
    driver: "",
    vehicleType: "",
    plateNo: "",
    reason: ""
  });

  const navigate = useNavigate();

  // Notification data that matches what should appear in requests
  const notificationData = {
    name: "JOY MIA",
    department: "SysADD",
    vehicle: "Van",
    date: "2025-06-01",  // Updated to match notification dates
    endDate: "2025-06-04",
    time: "15:00",
    destination: "Palawan",
    status: "Pending"
  };

  useEffect(() => {
    const bell = document.getElementById("notification-bell");
    if (bell) {
      const rect = bell.getBoundingClientRect();
      setBellPosition({
        top: rect.top + window.scrollY,
        right: window.innerWidth - rect.right,
      });
    }
  }, []);

  const handleButtonClick = (e, action) => {
    e.stopPropagation();
    if (action === "decline") {
      setIsDeclineModalOpen(true);
      setIsAcceptModalOpen(false);
    } else if (action === "accept") {
      setIsAcceptModalOpen(true);
      setIsDeclineModalOpen(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues(prev => ({ ...prev, [name]: value }));
  };

  // Validate Accept Modal form
  const isAcceptFormValid = formValues.driver && formValues.vehicleType && formValues.plateNo;

  const handleProcess = (action) => {
    const processedRequest = {
      ...notificationData,
      status: action === "accept" ? "Accepted" : "Declined",
      processedDate: new Date().toISOString().split('T')[0],
      // Include form values
      driver: formValues.driver,
      vehicle: formValues.vehicleType || notificationData.vehicle,
      plateNo: formValues.plateNo,
      reason: formValues.reason
    };

    navigate("/dashboard/requests", { 
      state: { 
        newRequest: processedRequest,
        action: action 
      } 
    });

    // Reset form and close modals
    setFormValues({ driver: "", vehicleType: "", plateNo: "", reason: "" });
    setIsDeclineModalOpen(false);
    setIsAcceptModalOpen(false);
    setIsOpen(false);
  };

  return (
    <>
      <button
        id="notification-bell"
        className="fixed top-5 right-7 hover:text-lime-200 transition duration-200 z-50"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Bell className="w-6 h-6" />
        <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-green-500" />
      </button>

      {isOpen && (
        <div
          className="fixed bg-white rounded-md shadow-lg z-50"
          style={{
            top: `calc(${bellPosition.top}px + 2rem)`,
            right: `calc(${bellPosition.right}px + 1rem)`,
            width: "320px",
            transform: "translateY(10px)",
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-4">
            <h3 className="font-semibold text-lg mb-2">Notification</h3>
            <div className="border-b pb-3 mb-3">
              <div className="flex justify-between items-start">
                <h4 className="font-medium">{notificationData.name}, Have Travel!</h4>
              </div>
              <p className="text-sm text-gray-600 mt-1">
                Date: {new Date(notificationData.date).toLocaleDateString('en-US', { 
                  month: 'long', 
                  day: 'numeric', 
                  year: 'numeric' 
                })} - {new Date(notificationData.endDate).toLocaleDateString('en-US', { 
                  month: 'long', 
                  day: 'numeric', 
                  year: 'numeric' 
                })}
              </p>
              <p className="text-sm text-gray-600">Time: {notificationData.time}</p>
              <p className="text-sm text-gray-600">Destination: {notificationData.destination}</p>

              <div className="flex justify-end gap-x-2 mt-4">
                <button
                  onClick={(e) => handleButtonClick(e, "decline")}
                  className="px-5 py-2 bg-red-500 text-white rounded-md text-sm"
                >
                  Decline
                </button>
                <button
                  onClick={(e) => handleButtonClick(e, "accept")}
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

      {isDeclineModalOpen && (
        <div className="fixed inset-0 bg-opacity-30 flex items-center justify-center z-[60]">
          <div className="fixed bg-white p-5 rounded-lg shadow-2xl w-[400px]">
            <h2 className="text-2xl font-bold text-center text-green-800 mb-6">
              DECLINE REQUEST
            </h2>

            <div className="text-gray-800 space-y-3 text-xs">
              <Input label="Employee Name" value={notificationData.name} />
              <div className="flex gap-2">
                <Input 
                  label="Date" 
                  value={`${notificationData.date} - ${notificationData.endDate}`} 
                />
                <Input label="Time" value={notificationData.time} />
              </div>
              <Input label="Destination" value={notificationData.destination} />
              <Input label="Office Department" value={notificationData.department} />
              <div>
                <label className="block font-medium">Reason (optional)</label>
                <textarea
                  name="reason"
                  value={formValues.reason}
                  onChange={handleInputChange}
                  rows="3"
                  placeholder="Enter reason here..."
                  className="w-full border-1 shadow-lg rounded-md px-3 py-2"
                ></textarea>
              </div>
            </div>

            <div className="flex justify-end gap-x-3 mt-6">
              <button
                onClick={() => setIsDeclineModalOpen(false)}
                className="px-3 py-1 bg-gray-300 text-sm rounded shadow hover:bg-gray-400"
              >
                Discard
              </button>
              <button
                onClick={() => handleProcess("decline")}
                className="px-3 py-1 bg-green-600 text-white text-sm rounded shadow hover:bg-green-800"
              >
                Process
              </button>
            </div>
          </div>
        </div>
      )}

      {isAcceptModalOpen && (
        <div className="fixed inset-0 bg-opacity-30 flex items-center justify-center z-[60]">
          <div className="fixed bg-white p-6 rounded-lg shadow-2xl w-[400px]">
            <h2 className="text-2xl font-bold text-center text-green-800 mb-6">
              ACCEPT REQUEST
            </h2>

            <div className="space-y-3 text-xs text-gray-800">
              <Input label="Employee Name" value={notificationData.name} />
              <div className="flex gap-2">
                <Input 
                  label="Date" 
                  value={`${notificationData.date} - ${notificationData.endDate}`} 
                />
                <Input label="Time" value={notificationData.time} />
              </div>
              <Input label="Destination" value={notificationData.destination} />
              <Input label="Office Department" value={notificationData.department} />

              <div>
                <label className="block font-medium">Driver*</label>
                <select 
                  name="driver"
                  value={formValues.driver}
                  onChange={handleInputChange}
                  className="w-full border rounded-md px-3 py-2"
                  required
                >
                  <option value="">Select Driver</option>
                  <option>Juan Dela Cruz</option>
                  <option>Maria Santos</option>
                </select>
              </div>

              <div className="flex gap-2">
                <div className="w-1/2">
                  <label className="block font-medium">Vehicle Type*</label>
                  <select 
                    name="vehicleType"
                    value={formValues.vehicleType}
                    onChange={handleInputChange}
                    className="w-full border rounded-md px-3 py-2"
                    required
                  >
                    <option value="">Select Vehicle</option>
                    <option>Van</option>
                    <option>Car</option>
                    <option>Truck</option>
                  </select>
                </div>
                <div className="w-1/2">
                  <label className="block font-medium">Plate No.*</label>
                  <select 
                    name="plateNo"
                    value={formValues.plateNo}
                    onChange={handleInputChange}
                    className="w-full border rounded-md px-3 py-2"
                    required
                  >
                    <option value="">Select Plate</option>
                    <option>ABC-1234</option>
                    <option>XYZ-5678</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-x-2 mt-6">
              <button
                onClick={() => setIsAcceptModalOpen(false)}
                className="px-3 py-1 bg-gray-300 text-sm rounded shadow hover:bg-gray-400"
              >
                Discard
              </button>
              <button
                onClick={() => handleProcess("accept")}
                disabled={!isAcceptFormValid}
                className={`px-3 py-1 bg-green-600 text-white text-sm rounded shadow hover:bg-green-800 ${
                  !isAcceptFormValid ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
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