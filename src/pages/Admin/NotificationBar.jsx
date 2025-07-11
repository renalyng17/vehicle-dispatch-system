import { Bell } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import io from 'socket.io-client';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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
  const [notifications, setNotifications] = useState([]);
  const [currentNotification, setCurrentNotification] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const socketRef = useRef(null);
  const navigate = useNavigate();

  // Initialize WebSocket connection and fetch initial notifications
  useEffect(() => {
    const initializeNotifications = async () => {
      try {
        // Fetch initial pending notifications
        const response = await fetch('http://localhost:5000/api/notifications?status=Pending', {
          credentials: 'include'
        });
        
        if (!response.ok) throw new Error('Failed to fetch notifications');
        
        const data = await response.json();
        setNotifications(data);

        // Setup WebSocket connection
        socketRef.current = io('http://localhost:5000', {
          withCredentials: true,
          reconnectionAttempts: 5,
          reconnectionDelay: 1000,
        });

        // Register as admin
        socketRef.current.emit('register-admin');

        // Listen for new requests
        socketRef.current.on('new-request', (newRequest) => {
          setNotifications(prev => [newRequest, ...prev]);
          toast.info(`New request from ${newRequest.name}`);
        });

        // Listen for updates to existing requests
        socketRef.current.on('notification-updated', (updatedRequest) => {
          setNotifications(prev => prev.filter(n => n.id !== updatedRequest.id));
        });

      } catch (error) {
        console.error('Notification initialization error:', error);
        toast.error('Failed to load notifications');
      }
    };

    initializeNotifications();

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, []);

  // Position the notification bell dynamically
  useEffect(() => {
    const updateBellPosition = () => {
      const bell = document.getElementById("notification-bell");
      if (bell) {
        const rect = bell.getBoundingClientRect();
        setBellPosition({
          top: rect.top + window.scrollY,
          right: window.innerWidth - rect.right,
        });
      }
    };

    updateBellPosition();
    window.addEventListener('resize', updateBellPosition);

    return () => window.removeEventListener('resize', updateBellPosition);
  }, [notifications]);

  const handleButtonClick = (e, action, notification) => {
    e.stopPropagation();
    setCurrentNotification(notification);
    setFormValues({
      driver: notification.driver || "",
      vehicleType: notification.vehicle_type || "",
      plateNo: notification.plate_no || "",
      reason: notification.reason || ""
    });
    
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

  const isAcceptFormValid = formValues.driver && formValues.vehicleType && formValues.plateNo;

  const handleProcess = async (action) => {
    if (!currentNotification) return;
    
    setIsLoading(true);
    
    try {
      const response = await fetch(`http://localhost:5000/api/notifications/${currentNotification.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: action === "accept" ? "Accepted" : "Declined",
          driver: formValues.driver,
          vehicle_type: formValues.vehicleType,
          plate_no: formValues.plateNo,
          reason: formValues.reason
        }),
        credentials: 'include'
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update request');
      }

      const updatedRequest = await response.json();
      
      // Update local state
      setNotifications(prev => prev.filter(n => n.id !== currentNotification.id));
      
      // Show success message
      toast.success(`Request ${action === "accept" ? "approved" : "declined"} successfully`);
      
      navigate("/dashboard/requests", {
        state: {
          action,
          request: updatedRequest
        }
      });

    } catch (error) {
      console.error("Error processing request:", error);
      toast.error(error.message || "Failed to process request");
    } finally {
      setIsLoading(false);
      setFormValues({ driver: "", vehicleType: "", plateNo: "", reason: "" });
      setIsDeclineModalOpen(false);
      setIsAcceptModalOpen(false);
      setIsOpen(false);
      setCurrentNotification(null);
    }
  };

  const formatDateRange = (startDate, endDate) => {
    try {
      const start = new Date(startDate);
      const end = new Date(endDate);
      return `${start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${end.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;
    } catch {
      return "Invalid date";
    }
  };

  return (
    <>
      <button
        id="notification-bell"
        className="fixed top-5 right-7 hover:text-lime-200 transition duration-200 z-50"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Notifications"
      >
        <Bell className="w-6 h-6" />
        {notifications.length > 0 && (
          <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-green-500 animate-pulse" />
        )}
      </button>

      {isOpen && (
        <div
          className="fixed bg-white rounded-md shadow-lg z-50 max-h-[70vh] overflow-y-auto"
          style={{
            top: `calc(${bellPosition.top}px + 2rem)`,
            right: `calc(${bellPosition.right}px + 1rem)`,
            width: "320px",
            transform: "translateY(10px)",
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-4">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-semibold text-lg">Notifications</h3>
              <span className="text-sm text-gray-500">
                {notifications.length} pending
              </span>
            </div>
            
            {notifications.length > 0 ? (
              notifications.map((notification) => (
                <div key={notification.id} className="border-b pb-3 mb-3 last:border-b-0">
                  <div className="flex justify-between items-start">
                    <h4 className="font-medium">{notification.name}, Travel Request</h4>
                    <span className="text-xs text-gray-500">
                      {new Date(notification.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    Date: {formatDateRange(notification.date, notification.end_date)}
                  </p>
                  <p className="text-sm text-gray-600">Time: {notification.time}</p>
                  <p className="text-sm text-gray-600">Destination: {notification.destination}</p>
                  <p className="text-sm text-gray-600">
                    Status: <span className={`font-semibold ${
                      notification.status === 'Pending' ? 'text-orange-500' : 
                      notification.status === 'Accepted' ? 'text-green-500' : 'text-red-500'
                    }`}>
                      {notification.status}
                    </span>
                  </p>

                  <div className="flex justify-end gap-x-2 mt-4">
                    <button
                      onClick={(e) => handleButtonClick(e, "decline", notification)}
                      className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded-md text-sm transition-colors"
                    >
                      Decline
                    </button>
                    <button
                      onClick={(e) => handleButtonClick(e, "accept", notification)}
                      className="px-3 py-1 bg-green-500 hover:bg-green-600 text-white rounded-md text-sm transition-colors"
                    >
                      Accept
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-4 text-gray-500">
                No pending notifications
              </div>
            )}
          </div>
        </div>
      )}

      {/* Decline Modal */}
      {isDeclineModalOpen && currentNotification && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-[60]">
          <div className="bg-white p-5 rounded-lg shadow-2xl w-[400px] max-w-[95vw]">
            <h2 className="text-2xl font-bold text-center text-green-800 mb-6">
              DECLINE REQUEST
            </h2>

            <div className="text-gray-800 space-y-3 text-sm">
              <Input label="Employee Name" value={currentNotification.name} />
              <div className="flex gap-2">
                <Input 
                  label="Date" 
                  value={formatDateRange(currentNotification.date, currentNotification.end_date)} 
                />
                <Input label="Time" value={currentNotification.time} />
              </div>
              <Input label="Destination" value={currentNotification.destination} />
              <Input label="Requesting Office" value={currentNotification.requesting_office} />
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
              <button
                onClick={() => setIsDeclineModalOpen(false)}
                className="px-4 py-2 bg-gray-300 text-sm rounded shadow hover:bg-gray-400 transition-colors"
                disabled={isLoading}
              >
                Cancel
              </button>
              <button
                onClick={() => handleProcess("decline")}
                className="px-4 py-2 bg-green-600 text-white text-sm rounded shadow hover:bg-green-800 transition-colors"
                disabled={isLoading}
              >
                {isLoading ? 'Processing...' : 'Confirm Decline'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Accept Modal */}
      {isAcceptModalOpen && currentNotification && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-[60]">
          <div className="bg-white p-6 rounded-lg shadow-2xl w-[400px] max-w-[95vw]">
            <h2 className="text-2xl font-bold text-center text-green-800 mb-6">
              APPROVE REQUEST
            </h2>

            <div className="space-y-3 text-sm text-gray-800">
              <Input label="Employee Name" value={currentNotification.name} />
              <div className="flex gap-2">
                <Input 
                  label="Date" 
                  value={formatDateRange(currentNotification.date, currentNotification.end_date)} 
                />
                <Input label="Time" value={currentNotification.time} />
              </div>
              <Input label="Destination" value={currentNotification.destination} />
              <Input label="Requesting Office" value={currentNotification.requesting_office} />

              <div>
                <label className="block font-medium">Driver*</label>
                <select 
                  name="driver"
                  value={formValues.driver}
                  onChange={handleInputChange}
                  className="w-full border rounded-md px-3 py-2 mt-1"
                  required
                  disabled={isLoading}
                >
                  <option value="">Select Driver</option>
                  <option value="Juan Dela Cruz">Juan Dela Cruz</option>
                  <option value="Maria Santos">Maria Santos</option>
                </select>
              </div>

              <div className="flex gap-2">
                <div className="w-1/2">
                  <label className="block font-medium">Vehicle Type*</label>
                  <select 
                    name="vehicleType"
                    value={formValues.vehicleType}
                    onChange={handleInputChange}
                    className="w-full border rounded-md px-3 py-2 mt-1"
                    required
                    disabled={isLoading}
                  >
                    <option value="">Select Vehicle</option>
                    <option value="Van">Van</option>
                    <option value="Car">Car</option>
                    <option value="Truck">Truck</option>
                  </select>
                </div>
                <div className="w-1/2">
                  <label className="block font-medium">Plate No.*</label>
                  <select 
                    name="plateNo"
                    value={formValues.plateNo}
                    onChange={handleInputChange}
                    className="w-full border rounded-md px-3 py-2 mt-1"
                    required
                    disabled={isLoading}
                  >
                    <option value="">Select Plate</option>
                    <option value="ABC-1234">ABC-1234</option>
                    <option value="XYZ-5678">XYZ-5678</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-x-2 mt-6">
              <button
                onClick={() => setIsAcceptModalOpen(false)}
                className="px-4 py-2 bg-gray-300 text-sm rounded shadow hover:bg-gray-400 transition-colors"
                disabled={isLoading}
              >
                Cancel
              </button>
              <button
                onClick={() => handleProcess("accept")}
                disabled={!isAcceptFormValid || isLoading}
                className={`px-4 py-2 bg-green-600 text-white text-sm rounded shadow hover:bg-green-800 transition-colors ${
                  (!isAcceptFormValid || isLoading) ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {isLoading ? 'Processing...' : 'Confirm Approval'}
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
        className="w-full border rounded-md px-3 py-2 mt-1 bg-gray-50"
      />
    </div>
  );
}