// NotificationBar.js (final corrected version)
import { Bell } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../../services/api";

// --- Input Components (ensure these are defined or imported) ---
function Input({ label, value, onChange, name, required = false }) {
  return (
    <div className="mb-2">
      <label className="block text-xs font-medium text-gray-700">{label}</label>
      <input
        type="text"
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        readOnly
        className="w-full border rounded-md px-3 py-2 text-xs bg-gray-50"
      />
    </div>
  );
}

function SelectInput({ label, name, value, onChange, options = [], required = false }) {
  return (
    <div className="mb-2">
      <label className="block text-xs font-medium text-gray-700">{label}</label>
      <select
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        className="w-full border rounded-md px-3 py-2 text-xs"
      >
        <option value="">Select...</option>
        {options.map((opt, i) => (
          <option key={i} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    </div>
  );
}

// --- Main Component ---
export default function NotificationBar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isDeclineModalOpen, setIsDeclineModalOpen] = useState(false);
  const [isAcceptModalOpen, setIsAcceptModalOpen] = useState(false);
  const [bellPosition, setBellPosition] = useState({ top: 0, right: 10 });
  const [notifications, setNotifications] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [isLoadingRequest, setIsLoadingRequest] = useState(false); // 👈 NEW

  const [formValues, setFormValues] = useState({
    driver: "",
    vehicleType: "",
    plateNo: "",
    reason: ""
  });

  const navigate = useNavigate();
  
  // Get unread notifications
  const unreadNotifications = notifications.filter(n => !n.read && n.type === "new_request");
  const latestNotification = unreadNotifications.at(-1);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const data = await api.getNotifications();
        setNotifications(data);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };

    const fetchData = async () => {
      try {
        const [driversData, vehiclesData] = await Promise.all([
          api.getDrivers(),
          api.getVehicles()
        ]);
        setDrivers(driversData);
        setVehicles(vehiclesData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchNotifications();
    fetchData();

    const interval = setInterval(fetchNotifications, 10000);
    return () => clearInterval(interval);
  }, []);

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

  // ✅ FIXED: Only open modal AFTER request is loaded
  const handleButtonClick = async (e, action) => {
    e.stopPropagation();

    if (!latestNotification?.requestId) {
      alert("Request ID is missing. Cannot process.");
      return;
    }

    setIsLoadingRequest(true);

    try {
      const request = await api.getRequest(latestNotification.requestId);
      setSelectedRequest(request);

      if (action === "decline") {
        setIsDeclineModalOpen(true);
      } else {
        setIsAcceptModalOpen(true);
      }
    } catch (error) {
      console.error("Error fetching request details:", error);
      alert("Failed to load request details. Please try again.");
    } finally {
      setIsLoadingRequest(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleProcess = async (action) => {
    try {
      if (!selectedRequest || !latestNotification) {
        throw new Error("Missing request or notification data");
      }

      await api.updateRequest(selectedRequest.id, {
        status: action === "accept" ? "Accepted" : "Declined",
        ...formValues
      });

      await api.markNotificationAsRead(latestNotification.id);

      // Reset
      setFormValues({ driver: "", vehicleType: "", plateNo: "", reason: "" });
      setIsDeclineModalOpen(false);
      setIsAcceptModalOpen(false);
      setIsOpen(false);
      setSelectedRequest(null);

      navigate("/dashboard/requests", { 
        state: { 
          message: `Request ${action === "accept" ? "accepted" : "declined"} successfully` 
        } 
      });
    } catch (error) {
      console.error("Error processing request:", error);
      alert("Error processing request. Please try again.");
    }
  };

  const handleCloseModals = () => {
    setIsDeclineModalOpen(false);
    setIsAcceptModalOpen(false);
    setSelectedRequest(null); // 👈 Important cleanup
  };

  const isAcceptFormValid =
    formValues.driver && formValues.vehicleType && formValues.plateNo;

  const vehicleTypes = [...new Set(vehicles.map(v => v.type))];
  const plateNumbers = formValues.vehicleType 
    ? vehicles.filter(v => v.type === formValues.vehicleType).map(v => v.plateNo)
    : [];

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
        {unreadNotifications.length > 0 && (
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
              <h4 className="font-medium">New Travel Request!</h4>
              <p>{latestNotification.message}</p>
              <div className="flex justify-end gap-x-2 mt-4">
                <button 
                  onClick={(e) => handleButtonClick(e, "decline")} 
                  className="px-5 py-2 bg-red-500 text-white rounded-md text-sm"
                  disabled={isLoadingRequest}
                >
                  {isLoadingRequest ? "Loading..." : "Decline"}
                </button>
                <button 
                  onClick={(e) => handleButtonClick(e, "accept")} 
                  className="px-5 py-2 bg-green-500 text-white rounded-md text-sm"
                  disabled={isLoadingRequest}
                >
                  {isLoadingRequest ? "Loading..." : "Accept"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Optional: Global Loading Overlay */}
      {isLoadingRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-20 flex items-center justify-center z-[55]">
          <div className="bg-white p-4 rounded-lg shadow-lg">
            <p className="text-sm">Loading request details...</p>
          </div>
        </div>
      )}

      {/* Decline Modal */}
      {isDeclineModalOpen && selectedRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-[60]">
          <div className="bg-white p-5 rounded-lg shadow-2xl w-[400px]">
            <h2 className="text-2xl font-bold text-center text-red-700 mb-6">DECLINE REQUEST</h2>
            <div className="space-y-3 text-xs text-gray-800">
              <Input label="Employee Name" value={selectedRequest.names?.join(", ") || ""} />
              <div className="flex gap-2">
                <Input label="Date" value={`${selectedRequest.fromDate} - ${selectedRequest.toDate}`} />
                <Input label="Time" value={`${selectedRequest.fromTime} - ${selectedRequest.toTime}`} />
              </div>
              <Input label="Destination" value={selectedRequest.destination} />
              <Input label="Office Department" value={selectedRequest.requestingOffice} />
              <div>
                <label className="block font-medium text-xs">Reason (optional)</label>
                <textarea
                  name="reason"
                  value={formValues.reason}
                  onChange={handleInputChange}
                  rows="3"
                  placeholder="Enter reason here..."
                  className="w-full border rounded-md px-3 py-2 mt-1 text-xs"
                />
              </div>
            </div>
            <div className="flex justify-end gap-x-3 mt-6">
              <button 
                onClick={handleCloseModals} 
                className="px-3 py-1 bg-gray-300 text-sm rounded hover:bg-gray-400"
              >
                Cancel
              </button>
              <button 
                onClick={() => handleProcess("decline")} 
                className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-800"
              >
                Process
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Accept Modal */}
      {isAcceptModalOpen && selectedRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-[60]">
          <div className="bg-white p-6 rounded-lg shadow-2xl w-[400px]">
            <h2 className="text-2xl font-bold text-center text-green-800 mb-6">APPROVE REQUEST</h2>
            <div className="space-y-3 text-xs text-gray-800">
              <Input label="Employee Name" value={selectedRequest.names?.join(", ") || ""} />
              <div className="flex gap-2">
                <Input label="Date" value={`${selectedRequest.fromDate} - ${selectedRequest.toDate}`} />
                <Input label="Time" value={`${selectedRequest.fromTime} - ${selectedRequest.toTime}`} />
              </div>
              <Input label="Destination" value={selectedRequest.destination} />
              <Input label="Office Department" value={selectedRequest.requestingOffice} />
              <SelectInput
                label="Driver"
                name="driver"
                value={formValues.driver}
                onChange={handleInputChange}
                options={drivers.map(d => d.name)}
                required
              />
              <div className="flex gap-2">
                <SelectInput
                  label="Vehicle Type"
                  name="vehicleType"
                  value={formValues.vehicleType}
                  onChange={handleInputChange}
                  options={vehicleTypes}
                  required
                />
                <SelectInput
                  label="Plate No."
                  name="plateNo"
                  value={formValues.plateNo}
                  onChange={handleInputChange}
                  options={plateNumbers}
                  required
                />
              </div>
            </div>
            <div className="flex justify-end gap-x-2 mt-6">
              <button 
                onClick={handleCloseModals} 
                className="px-3 py-1 bg-gray-300 text-sm rounded hover:bg-gray-400"
              >
                Cancel
              </button>
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