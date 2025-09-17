// NotificationBar.js (updated)
import { Bell } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../../services/api";

// ... (Input and SelectInput components remain the same)

export default function NotificationBar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isDeclineModalOpen, setIsDeclineModalOpen] = useState(false);
  const [isAcceptModalOpen, setIsAcceptModalOpen] = useState(false);
  const [bellPosition, setBellPosition] = useState({ top: 0, right: 10 });
  const [notifications, setNotifications] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);

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
    // Fetch notifications
    const fetchNotifications = async () => {
      try {
        const data = await api.getNotifications();
        setNotifications(data);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };

    // Fetch drivers and vehicles
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

    // Set up polling for new notifications
    const interval = setInterval(fetchNotifications, 10000); // Poll every 10 seconds

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

  const handleButtonClick = async (e, action) => {
    e.stopPropagation();
    
    if (action === "decline") {
      setIsDeclineModalOpen(true);
    } else {
      setIsAcceptModalOpen(true);
    }
    
    // Fetch the request details for the selected notification
    if (latestNotification) {
      try {
        const request = await api.getRequest(latestNotification.requestId);
        setSelectedRequest(request);
      } catch (error) {
        console.error("Error fetching request details:", error);
      }
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleProcess = async (action) => {
    try {
      if (!selectedRequest) {
        throw new Error("No request selected");
      }

      // Update the request status
      await api.updateRequest(selectedRequest.id, {
        status: action === "accept" ? "Accepted" : "Declined",
        ...formValues
      });

      // Mark notification as read
      await api.markNotificationAsRead(latestNotification.id);

      // Reset form and close modals
      setFormValues({ driver: "", vehicleType: "", plateNo: "", reason: "" });
      setIsDeclineModalOpen(false);
      setIsAcceptModalOpen(false);
      setIsOpen(false);
      setSelectedRequest(null);

      // Navigate to requests page
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

  const isAcceptFormValid =
    formValues.driver && formValues.vehicleType && formValues.plateNo;

  // Get unique vehicle types for dropdown
  const vehicleTypes = [...new Set(vehicles.map(v => v.type))];
  
  // Get plate numbers for selected vehicle type
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
                <button onClick={(e) => handleButtonClick(e, "decline")} className="px-5 py-2 bg-red-500 text-white rounded-md text-sm">Decline</button>
                <button onClick={(e) => handleButtonClick(e, "accept")} className="px-5 py-2 bg-green-500 text-white rounded-md text-sm">Accept</button>
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