// NotificationBar.js
import { Bell } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../../services/api";

// Input Component (Read-only display)
const Input = ({ label, value }) => (
  <div>
    <label className="block font-medium text-xs text-gray-500 mb-1">{label}</label>
    <div className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 text-sm bg-gray-50">
      {value}
    </div>
  </div>
);

// SelectInput Component
const SelectInput = ({ label, name, value, onChange, options, required = false }) => (
  <div>
    <label className="block font-medium text-xs text-gray-500 mb-1">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <select
      name={name}
      value={value}
      onChange={onChange}
      className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
      required={required}
    >
      <option value="">Select {label}</option>
      {options.map((option, index) => (
        <option key={index} value={option}>
          {option}
        </option>
      ))}
    </select>
  </div>
);

export default function NotificationBar({ onRequestUpdate }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isDeclineModalOpen, setIsDeclineModalOpen] = useState(false);
  const [isAcceptModalOpen, setIsAcceptModalOpen] = useState(false);
  const [bellPosition, setBellPosition] = useState({ top: 0, right: 10 });
  const [notifications, setNotifications] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [formValues, setFormValues] = useState({
    driver: "",
    vehicleType: "",
    plateNo: "",
    reason: "",
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [drivers, setDrivers] = useState([]);
  const [vehicles, setVehicles] = useState([]); // ✅ NEW: fetch vehicles

  const navigate = useNavigate();

  // Fetch pending requests
  useEffect(() => {
    const fetchPendingRequests = async () => {
      try {
        const allRequests = await api.getRequests();
        const pending = allRequests.filter((req) => req.status === "Pending");
        setNotifications(pending);
      } catch (error) {
        console.error("Failed to fetch notifications:", error);
      }
    };

    fetchPendingRequests();
    const interval = setInterval(fetchPendingRequests, 30000);
    return () => clearInterval(interval);
  }, []);

  // ✅ Fetch active drivers AND vehicles
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [driversData, vehiclesData] = await Promise.all([
          api.getDrivers(),
          api.getVehicles(),
        ]);
        const activeDrivers = driversData.filter(driver => !driver.archivedAt);
        setDrivers(activeDrivers);
        setVehicles(vehiclesData || []);
      } catch (error) {
        console.error("Failed to fetch drivers or vehicles:", error);
      }
    };
    fetchData();
  }, []);

  const latestNotification = notifications.length > 0 ? notifications[0] : null;

  // Position dropdown under bell
  useEffect(() => {
    const bell = document.getElementById("notification-bell");
    if (bell && isOpen) {
      const rect = bell.getBoundingClientRect();
      setBellPosition({
        top: rect.top + window.scrollY,
        right: window.innerWidth - rect.right,
      });
    }
  }, [isOpen]);

  const handleButtonClick = (e, action) => {
    e.stopPropagation();
    setSelectedRequest(latestNotification);
    if (action === "decline") {
      setIsDeclineModalOpen(true);
    } else {
      setIsAcceptModalOpen(true);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  // ✅ Derive unique vehicle types
  const vehicleTypes = [...new Set(
    vehicles.map(v => v.vehicleType || v.vehicle_model).filter(Boolean)
  )];

  // ✅ Derive plate numbers based on selected vehicle type
  const plateNumbers = formValues.vehicleType
    ? vehicles
        .filter(v => (v.vehicleType || v.vehicle_model) === formValues.vehicleType)
        .map(v => v.plateNo || v.plate_no)
        .filter(Boolean)
    : [];

  const availableDrivers = drivers.map(d => d.name);

  const isAcceptFormValid = formValues.driver && formValues.vehicleType && formValues.plateNo;

  const handleProcess = async (action) => {
    if (!selectedRequest?.id) return;

    setIsProcessing(true);
    try {
      let updateData;
      if (action === "accept") {
        // Find selected driver for contact info if needed
        const selectedDriver = drivers.find(d => d.name === formValues.driver);
        updateData = {
          status: "Accepted",
          driver_name: formValues.driver,
          contact_no: selectedDriver?.contact || selectedDriver?.contact_no || "",
          vehicle_type: formValues.vehicleType,
          plate_no: formValues.plateNo,
        };
      } else {
        updateData = {
          status: "Declined",
          reason_for_decline: formValues.reason || "No reason provided",
        };
      }

      const updatedRequest = await api.updateRequestStatus(selectedRequest.id, updateData);

      if (onRequestUpdate) {
        onRequestUpdate(updatedRequest);
      }

      setFormValues({ driver: "", vehicleType: "", plateNo: "", reason: "" });
      setIsDeclineModalOpen(false);
      setIsAcceptModalOpen(false);
      setIsOpen(false);
      setSelectedRequest(null);
    } catch (error) {
      console.error("Error processing request:", error);
      alert(`Failed to ${action} request: ${error.message}`);
    } finally {
      setIsProcessing(false);
    }
  };

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

      {/* Dropdown */}
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
              <p>
                New travel request from {latestNotification.names?.join(", ")} ({latestNotification.requestingOffice}) 
                to {latestNotification.destination} from {latestNotification.fromDate} to {latestNotification.toDate}
              </p>
              <div className="flex justify-end gap-x-2 mt-4">
                <button
                  onClick={(e) => handleButtonClick(e, "decline")}
                  className="px-5 py-2 bg-red-500 text-white rounded-md text-sm hover:bg-red-600"
                  disabled={isProcessing}
                >
                  {isProcessing ? "Processing..." : "Decline"}
                </button>
                <button
                  onClick={(e) => handleButtonClick(e, "accept")}
                  className="px-5 py-2 bg-green-500 text-white rounded-md text-sm hover:bg-green-600"
                  disabled={isProcessing}
                >
                  {isProcessing ? "Processing..." : "Accept"}
                </button>
              </div>
            </div>
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
                  className="w-full border rounded-md px-3 py-2 mt-1"
                />
              </div>
            </div>
            <div className="flex justify-end gap-x-3 mt-6">
              <button
                onClick={() => setIsDeclineModalOpen(false)}
                className="px-3 py-1 bg-gray-300 text-sm rounded hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={() => handleProcess("decline")}
                disabled={isProcessing}
                className={`px-3 py-1 ${
                  isProcessing ? "bg-red-400" : "bg-red-600 hover:bg-red-800"
                } text-white text-sm rounded`}
              >
                {isProcessing ? "Processing..." : "Process"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Accept Modal — NOW USES DYNAMIC VEHICLE DATA */}
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
                options={availableDrivers}
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
                onClick={() => setIsAcceptModalOpen(false)}
                className="px-3 py-1 bg-gray-300 text-sm rounded hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={() => handleProcess("accept")}
                disabled={!isAcceptFormValid || isProcessing}
                className={`px-3 py-1 text-white text-sm rounded ${
                  !isAcceptFormValid || isProcessing
                    ? "bg-green-400 opacity-50 cursor-not-allowed"
                    : "bg-green-600 hover:bg-green-800"
                }`}
              >
                {isProcessing ? "Processing..." : "Process"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}