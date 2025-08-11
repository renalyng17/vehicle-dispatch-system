import { Bell } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// Reusable read-only text input
function Input({ label, value }) {
  return (
    <div>
      <label className="block font-medium">{label}</label>
      <input
        type="text"
        value={value || ""}
        readOnly
        className="w-full border rounded-md px-3 py-2 mt-1 bg-gray-50"
      />
    </div>
  );
}

// Reusable dropdown select input
function SelectInput({ label, name, value, onChange, options = [], required }) {
  return (
    <div className="w-full">
      <label className="block font-medium">
        {label}{required && '*'}
      </label>
      <select
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        className="w-full border rounded-md px-3 py-2 mt-1"
      >
        <option value="">Select {label}</option>
        {options.map((opt, idx) => (
          <option key={idx} value={opt}>{opt}</option>
        ))}
      </select>
    </div>
  );
}

export default function NotificationBar({ notifications = [] }) {
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
  const latestNotification = notifications.at(-1); // cleanest way to get the latest

  useEffect(() => {
    const bell = document.getElementById("notification-bell");
    if (bell && isOpen) {
      const rect = bell.getBoundingClientRect();
      setBellPosition({
        top: rect.top + window.scrollY,
        right: window.innerWidth - rect.right
      });
    }
  }, [isOpen]);

  const handleButtonClick = (e, action) => {
    e.stopPropagation();
    action === "decline" ? setIsDeclineModalOpen(true) : setIsAcceptModalOpen(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleProcess = (action) => {
    const processedRequest = {
      ...latestNotification,
      status: action === "accept" ? "Accepted" : "Declined",
      processedDate: new Date().toISOString().split("T")[0],
      ...formValues,
    };

    navigate("/dashboard/requests", {
      state: { newRequest: processedRequest, action },
    });

    // Reset all
    setFormValues({ driver: "", vehicleType: "", plateNo: "", reason: "" });
    setIsDeclineModalOpen(false);
    setIsAcceptModalOpen(false);
    setIsOpen(false);
  };

  const isAcceptFormValid =
    formValues.driver && formValues.vehicleType && formValues.plateNo;

  return (
    <>
      {/* Bell Button */}
      <button
        id="notification-bell"
        className="fixed top-5 right-7 hover:text-lime-200 transition duration-200 z-50"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Notifications"
      >
        <Bell className="w-6 h-6" />
        {notifications.length > 0 && (
          <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-green-500" />
        )}
      </button>

      {/* Dropdown Notification */}
      {isOpen && latestNotification && (
        <div
          className="fixed bg-white rounded-md shadow-lg z-50"
          style={{
            top: `calc(${bellPosition.top}px + 2rem)`,
            right: `calc(${bellPosition.right}px + 1rem)`,
            width: "320px",
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-4">
            <h3 className="font-semibold text-lg mb-2">Notification</h3>
            <div className="border-b pb-3 mb-3 text-sm">
              <h4 className="font-medium">{latestNotification.name}, Have Travel!</h4>
              <p>Date: {new Date(latestNotification.date).toLocaleDateString()} - {new Date(latestNotification.endDate).toLocaleDateString()}</p>
              <p>Time: {latestNotification.time}</p>
              <p>Destination: {latestNotification.destination}</p>
              <div className="flex justify-end gap-x-2 mt-4">
                <button onClick={(e) => handleButtonClick(e, "decline")} className="px-5 py-2 bg-red-500 text-white rounded-md text-sm">Decline</button>
                <button onClick={(e) => handleButtonClick(e, "accept")} className="px-5 py-2 bg-green-500 text-white rounded-md text-sm">Accept</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Decline Modal */}
      {isDeclineModalOpen && latestNotification && (
        <div className="fixed inset-0 bg-opacity-30 flex items-center justify-center z-[60]">
          <div className="bg-white p-5 rounded-lg shadow-2xl w-[400px]">
            <h2 className="text-2xl font-bold text-center text-red-700 mb-6">DECLINE REQUEST</h2>
            <div className="space-y-3 text-xs text-gray-800">
              <Input label="Employee Name" value={latestNotification.name} />
              <div className="flex gap-2">
                <Input label="Date" value={`${latestNotification.date} - ${latestNotification.endDate}`} />
                <Input label="Time" value={latestNotification.time} />
              </div>
              <Input label="Destination" value={latestNotification.destination} />
              <Input label="Office Department" value={latestNotification.department} />
              <div>
                <label className="block font-medium">Reason (optional)</label>
                <textarea
                  name="reason"
                  value={formValues.reason}
                  onChange={handleInputChange}
                  rows="3"
                  placeholder="Enter reason here..."
                  className="w-full border rounded-md px-3 py-2 mt-1"
                />
              </div>
            </div>
            <div className="flex justify-end gap-x-3 mt-6">
              <button onClick={() => setIsDeclineModalOpen(false)} className="px-3 py-1 bg-gray-300 text-sm rounded hover:bg-gray-400">Cancel</button>
              <button onClick={() => handleProcess("decline")} className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-800">Process</button>
            </div>
          </div>
        </div>
      )}

      {/* Accept Modal */}
      {isAcceptModalOpen && latestNotification && (
        <div className="fixed inset-0 bg-opacity-30 flex items-center justify-center z-[60]">
          <div className="bg-white p-6 rounded-lg shadow-2xl w-[400px]">
            <h2 className="text-2xl font-bold text-center text-green-800 mb-6">APPROVE REQUEST</h2>
            <div className="space-y-3 text-xs text-gray-800">
              <Input label="Employee Name" value={latestNotification.name} />
              <div className="flex gap-2">
                <Input label="Date" value={`${latestNotification.date} - ${latestNotification.endDate}`} />
                <Input label="Time" value={latestNotification.time} />
              </div>
              <Input label="Destination" value={latestNotification.destination} />
              <Input label="Office Department" value={latestNotification.department} />
              <SelectInput
                label="Driver"
                name="driver"
                value={formValues.driver}
                onChange={handleInputChange}
                options={["Juan Dela Cruz", "Maria Santos"]}
                required
              />
              <div className="flex gap-2">
                <SelectInput
                  label="Vehicle Type"
                  name="vehicleType"
                  value={formValues.vehicleType}
                  onChange={handleInputChange}
                  options={["Van", "Car", "Truck"]}
                  required
                />
                <SelectInput
                  label="Plate No."
                  name="plateNo"
                  value={formValues.plateNo}
                  onChange={handleInputChange}
                  options={["ABC-1234", "XYZ-5678"]}
                  required
                />
              </div>
            </div>
            <div className="flex justify-end gap-x-2 mt-6">
              <button onClick={() => setIsAcceptModalOpen(false)} className="px-3 py-1 bg-gray-300 text-sm rounded hover:bg-gray-400">Cancel</button>
              <button
                onClick={() => handleProcess("accept")}
                disabled={!isAcceptFormValid}
                className={`px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-800 ${
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
