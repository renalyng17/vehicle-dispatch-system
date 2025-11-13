// Client_NotificationBar.js
import { Bell, ChevronDown } from "lucide-react";
import { useState, useEffect, useRef, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../../services/api";

// Unified Input Component (Read-only)
const Input = ({ label, value, className = "" }) => (
  <div className={className}>
    <label className="block font-medium text-xs text-gray-500 mb-1">{label}</label>
    <div className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm bg-white">
      {value}
    </div>
  </div>
);

// Unified SelectInput with animated chevron
const SelectInput = ({ label, name, value, onChange, options, required = false }) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (selectRef.current && !selectRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (optionValue) => {
    onChange({ target: { name, value: optionValue } });
    setIsOpen(false);
  };

  const displayValue = value
    ? options.find(opt => opt === value) || value
    : `Select ${label}`;

  return (
    <div className="relative" ref={selectRef}>
      <label className="block font-medium text-xs text-gray-500 mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div
        className="w-full flex items-center justify-between px-3 py-2 text-sm border border-gray-300 rounded-md bg-white cursor-pointer hover:bg-gray-50 transition-colors"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className={`${value ? "text-gray-800" : "text-gray-400"}`}>
          {displayValue}
        </span>
        <ChevronDown
          className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </div>

      {isOpen && (
        <ul className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
          {options.length > 0 ? (
            options.map((option, index) => (
              <li
                key={index}
                className="px-3 py-2 text-sm cursor-pointer hover:bg-green-50 hover:text-green-800 transition-colors"
                onClick={() => handleSelect(option)}
              >
                {option}
              </li>
            ))
          ) : (
            <li className="px-3 py-2 text-sm text-gray-500">No options available</li>
          )}
        </ul>
      )}
    </div>
  );
};

// Improved date formatting function
const formatDate = (dateString) => {
  if (!dateString) return 'Just now';

  try {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffSecs = Math.floor(diffMs / 1000);
    const diffMins = Math.floor(diffSecs / 60);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffSecs < 60) {
      return 'Just now';
    } else if (diffMins < 60) {
      return `${diffMins}m ago`;
    } else if (diffHours < 24) {
      return `${diffHours}h ago`;
    } else if (diffDays === 1) {
      return 'Yesterday';
    } else if (diffDays < 7) {
      return `${diffDays}d ago`;
    } else {
      // Show date like "Nov 13", or "Nov 13, 2025" if different year
      const isSameYear = date.getFullYear() === now.getFullYear();
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        ...(isSameYear ? {} : { year: 'numeric' })
      });
    }
  } catch {
    return 'Just now';
  }
};

export default function NotificationBar({ onRequestUpdate }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isDeclineModalOpen, setIsDeclineModalOpen] = useState(false);
  const [isAcceptModalOpen, setIsAcceptModalOpen] = useState(false);
  const [bellPosition, setBellPosition] = useState({ top: 0, right: 0 });
  const [notifications, setNotifications] = useState([]); // Now filtered for Accepted/Declined
  const [allActiveRequests, setAllActiveRequests] = useState([]); // Pending + Accepted + Declined
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [formValues, setFormValues] = useState({
    driver: "",
    vehicleType: "",
    plateNo: "",
    reason: "",
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [drivers, setDrivers] = useState([]);
  const [vehicles, setVehicles] = useState([]);

  const navigate = useNavigate();
  const bellRef = useRef(null);

  // Fetch all requests and split into notifications (Accepted or Declined) and allActive (Pending + Accepted + Declined)
  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const allRequests = await api.getRequests();
        
        // Filter for requests that are either Accepted or Declined
        const processedRequests = allRequests.filter((req) => 
          req.status === "Accepted" || req.status === "Declined"
        );
        
        // Sort processed requests by updated_at (or created_at if updated_at is missing) descending (newest first)
        const sortedProcessedRequests = processedRequests.sort((a, b) => {
          // Try updated_at first, fall back to created_at if updated_at is not present
          const dateA = new Date(a.updated_at || a.createdAt);
          const dateB = new Date(b.updated_at || b.createdAt);
          return dateB - dateA; // Sort newest first
        });
        
        // Use sortedProcessedRequests for the notification dropdown
        setNotifications(sortedProcessedRequests);
        
        // Keep the allActiveRequests logic as is for resource booking (includes Pending)
        const active = allRequests.filter(
          (req) => req.status === "Pending" || req.status === "Accepted" || req.status === "Declined"
        );
        setAllActiveRequests(active);
      } catch (error) {
        console.error("Failed to fetch notifications:", error);
      }
    };

    fetchRequests();
    const interval = setInterval(fetchRequests, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

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

  useEffect(() => {
    const updatePosition = () => {
      if (bellRef.current) {
        const rect = bellRef.current.getBoundingClientRect();
        setBellPosition({
          top: rect.bottom + window.scrollY,
          right: window.innerWidth - rect.right
        });
      }
    };

    updatePosition();
    window.addEventListener("resize", updatePosition);
    window.addEventListener("scroll", updatePosition, { passive: true });

    return () => {
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("scroll", updatePosition);
    };
  }, [isOpen]);

  // Reset form when Accept modal opens
  useEffect(() => {
    if (isAcceptModalOpen) {
      setFormValues({ driver: "", vehicleType: "", plateNo: "", reason: "" });
    }
  }, [isAcceptModalOpen]);

  const handleButtonClick = (e, action, request) => {
    e.stopPropagation();
    setSelectedRequest(request);
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

  // Compute booked resources using ALL active requests (Pending + Accepted)
  const { bookedDrivers, bookedVehicles } = useMemo(() => {
    if (!selectedRequest) {
      return { bookedDrivers: new Set(), bookedVehicles: new Set() };
    }

    const date = selectedRequest.fromDate;
    const bookedDrivers = new Set();
    const bookedVehicles = new Set();

    allActiveRequests.forEach((req) => {
      if (req.fromDate === date && (req.status === "Accepted" || req.status === "Pending")) {
        if (req.driver_name) bookedDrivers.add(req.driver_name.trim());
        if (req.plate_no) bookedVehicles.add(req.plate_no.trim());
      }
    });

    return { bookedDrivers, bookedVehicles };
  }, [selectedRequest, allActiveRequests]);

  const availableDrivers = drivers
    .filter((d) => !bookedDrivers.has(d.name?.trim()))
    .map((d) => d.name);

  const vehicleTypes = [...new Set(
    vehicles.map(v => v.vehicleType || v.vehicle_model).filter(Boolean)
  )];

  const availableVehiclesByType = formValues.vehicleType
    ? vehicles
        .filter(v => 
          (v.vehicleType || v.vehicle_model) === formValues.vehicleType &&
          !bookedVehicles.has((v.plateNo || v.plate_no)?.trim())
        )
        .map(v => v.plateNo || v.plate_no)
        .filter(Boolean)
    : [];

  const isAcceptFormValid = formValues.driver && formValues.vehicleType && formValues.plateNo;

  const handleProcess = async (action) => {
    if (!selectedRequest?.id) return;

    // Final validation to prevent race conditions or stale UI
    if (action === "accept") {
      const driverConflict = allActiveRequests.some(req =>
        req.fromDate === selectedRequest.fromDate &&
        (req.status === "Accepted" || req.status === "Pending") &&
        req.driver_name?.trim() === formValues.driver.trim()
      );

      const vehicleConflict = allActiveRequests.some(req =>
        req.fromDate === selectedRequest.fromDate &&
        (req.status === "Accepted" || req.status === "Pending") &&
        req.plate_no?.trim() === formValues.plateNo.trim()
      );

      if (driverConflict) {
        alert("This driver is already assigned to another trip on this date.");
        return;
      }
      if (vehicleConflict) {
        alert("This vehicle is already assigned on this date.");
        return;
      }
    }

    setIsProcessing(true);
    try {
      if (action === "accept") {
        const selectedDriver = drivers.find(d => d.name === formValues.driver);
        const mainUpdate = {
          status: "Accepted",
          driver_name: formValues.driver,
          contact_no: selectedDriver?.contact || selectedDriver?.contact_no || "",
          vehicle_type: formValues.vehicleType,
          plate_no: formValues.plateNo,
        };
        await api.updateRequestStatus(selectedRequest.id, mainUpdate);
        if (onRequestUpdate) onRequestUpdate({ ...selectedRequest, ...mainUpdate });
      } else {
        const updateData = {
          status: "Declined",
          reason_for_decline: formValues.reason || "No reason provided",
        };
        const updatedRequest = await api.updateRequestStatus(selectedRequest.id, updateData);
        if (onRequestUpdate) onRequestUpdate(updatedRequest);
      }

      // Reset
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

  // Get notification icon based on status
  const getNotificationIcon = (status) => {
    if (status === "Accepted") {
      return <span className="text-green-500 font-bold">✓</span>; // Green Check
    } else if (status === "Declined") {
      return <span className="text-red-500 font-bold">✗</span>; // Red Cross
    }
    return <Bell className="w-4 h-4 text-red-500" />; // Fallback for other statuses if any slip through
  };

  // Get notification style based on status
  const getNotificationStyle = (status) => {
    if (status === "Accepted") {
      return 'bg-white border border-green-200';
    } else if (status === "Declined") {
      return 'bg-white border border-red-200';
    }
    return 'bg-white border border-gray-200'; // fallback for other statuses
  };

  return (
    <>
      {/* Bell Button */}
      <button
        ref={bellRef}
        className="fixed top-5 right-7 hover:text-lime-200 transition duration-200 z-50"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Notifications"
      >
        <Bell className="w-6 h-6" />
        {notifications.length > 0 && (
          <span className="absolute -top-1 -right-1 flex h-2 w-2 items-center justify-center rounded-full bg-green-500"></span>
        )}
      </button>

      {/* Notification Dropdown */}
      {isOpen && (
        <div
          className="fixed bg-white rounded-lg shadow-xl z-50 border border-gray-200"
          style={{
            top: `${bellPosition.top}px`,
            right: `${bellPosition.right}px`,
            width: "380px",
            maxHeight: "500px",
            transform: "translateY(8px)",
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-4">
            <h3 className="font-semibold text-lg text-gray-800 mb-4">Notifications</h3>
            {notifications.length > 0 ? (
              <div className="space-y-3 max-h-96 overflow-y-auto custom-scrollbar">
                {notifications.map((request) => (
                  <div
                    key={request.id}
                    className={`p-3 rounded-lg ${getNotificationStyle(request.status)} ring-1 ring-white`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 mt-0.5">
                        {/* Use the new function to get the icon */}
                        {getNotificationIcon(request.status)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            {/* Update title based on status - Green for Accepted, Red for Declined */}
                            <div className="font-medium text-sm">
                              {request.status === "Accepted" ? 
                                <span className="text-green-700">Request Accepted</span> : 
                                <span className="text-red-700">Request Declined</span>}
                            </div>
                            <div className="text-xs text-gray-600 mt-1">
                              <p className="text-gray-700">
                                From: {request.names?.join(", ")} ({request.requestingOffice})
                              </p>
                              <span className="font-medium block mt-1">
                                To: {request.destination}
                              </span>
                              <span className="block">
                                Date: {request.fromDate} – {request.toDate}
                              </span>
                              <span className="text-xs text-gray-500">
                                Passengers: {request.names?.length || 1}
                              </span>
                              {/* ✅ Show reason if Declined */}
                              {request.status === "Declined" && request.reason_for_decline && (
                                <span className="block text-xs text-red-600 mt-1">
                                  Reason: {request.reason_for_decline}
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="flex flex-col items-end gap-1">
                            <span className="text-xs text-gray-500 whitespace-nowrap">
                              {/* ✅ Use updated_at for display if available, otherwise created_at */}
                              {formatDate(request.updated_at || request.createdAt)}
                            </span>
                            {/* ✅ Update status indicator */}
                            <span className={`w-2 h-2 rounded-full ${request.status === "Accepted" ? "bg-green-500" : "bg-red-500"}`}></span>
                          </div>
                        </div>
                        {/* ✅ Hide action buttons for processed requests */}
                        {/* <div className="mt-3 flex justify-end gap-2">
                          <button
                            onClick={(e) => handleButtonClick(e, "decline", request)}
                            className="px-3 py-1 bg-red-500 text-white text-xs rounded hover:bg-red-600"
                            disabled={isProcessing}
                          >
                            Decline
                          </button>
                          <button
                            onClick={(e) => handleButtonClick(e, "accept", request)}
                            className="px-3 py-1 bg-green-500 text-white text-xs rounded hover:bg-green-600"
                            disabled={isProcessing}
                          >
                            Accept
                          </button>
                        </div> */}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center text-sm text-gray-500 py-8">
                <Bell className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                No processed requests
              </div>
            )}
          </div>
        </div>
      )}

      {/* Decline Modal */}
      {isDeclineModalOpen && selectedRequest && (
        <div className="fixed inset-0 flex items-center justify-center z-50 backdrop-blur-[1px]">
          <div className="bg-white p-6 rounded-lg shadow-2xl w-full max-w-md mx-4">
            <h2 className="text-2xl font-bold text-center text-red-700 mb-6">DECLINE REQUEST</h2>
            <div className="space-y-4 text-xs text-gray-800">
              <Input label="Employee Name" value={selectedRequest.names?.join(", ") || ""} />
              <div className="grid grid-cols-2 gap-3">
                <Input label="Date" value={`${selectedRequest.fromDate} - ${selectedRequest.toDate}`} />
                <Input label="Time" value={`${selectedRequest.fromTime} - ${selectedRequest.toTime}`} />
              </div>
              <Input label="Destination" value={selectedRequest.destination} />
              <Input label="Office Department" value={selectedRequest.requestingOffice} />
              <div>
                <label className="block font-medium text-xs text-gray-500 mb-1">
                  Reason (optional)
                </label>
                <textarea
                  name="reason"
                  value={formValues.reason}
                  onChange={handleInputChange}
                  rows="3"
                  placeholder="Enter reason here..."
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                />
              </div>
            </div>
            <div className="flex justify-end gap-x-3 mt-6">
              <button
                onClick={() => setIsDeclineModalOpen(false)}
                className="px-4 py-2 bg-gray-300 text-sm rounded hover:bg-gray-400 transition"
              >
                Cancel
              </button>
              <button
                onClick={() => handleProcess("decline")}
                disabled={isProcessing}
                className={`px-4 py-2 text-white text-sm rounded transition ${
                  isProcessing ? "bg-red-400 opacity-50 cursor-not-allowed" : "bg-red-600 hover:bg-red-800"
                }`}
              >
                {isProcessing ? "Processing..." : "Process"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Accept Modal */}
      {isAcceptModalOpen && selectedRequest && (
        <div className="fixed inset-0 flex items-center justify-center z-50 backdrop-blur-[1px]">
          <div className="bg-white p-4 rounded-lg shadow-2xl w-full max-w-md mx-4">
            <h2 className="text-xl font-bold text-center text-green-800 mb-3">APPROVE REQUEST</h2>

            {/* Request Info - Compact Grid */}
            <div className="grid grid-cols-2 gap-2 text-xs text-gray-800 mb-3">
              <Input label="Name" value={selectedRequest.names?.join(", ") || ""} className="col-span-2" />
              <Input label="Date" value={`${selectedRequest.fromDate} - ${selectedRequest.toDate}`} />
              <Input label="Time" value={`${selectedRequest.fromTime} - ${selectedRequest.toTime}`} />
              <Input label="Dest." value={selectedRequest.destination} className="col-span-2" />
              <Input label="Pax" value={selectedRequest.names?.length || 1} />
              <Input label="Dept." value={selectedRequest.requestingOffice} />
            </div>

            {/* Driver & Vehicle */}
            <SelectInput
              label="Driver *"
              name="driver"
              value={formValues.driver}
              onChange={handleInputChange}
              options={availableDrivers}
              required
              className="mb-2"
            />

            <div className="grid grid-cols-2 gap-2 mb-2">
              <SelectInput
                label="Type *"
                name="vehicleType"
                value={formValues.vehicleType}
                onChange={handleInputChange}
                options={vehicleTypes}
                required
              />
              <SelectInput
                label="Plate *"
                name="plateNo"
                value={formValues.plateNo}
                onChange={handleInputChange}
                options={availableVehiclesByType}
                required
              />
            </div>

            {/* Vehicle Capacity - Show ONLY for current selected car */}
           {formValues.plateNo && (
          <div className="mb-3 p-2 bg-blue-50 rounded border border-blue-200 text-xs">
            <div className="font-medium text-blue-800">Vehicle Capacity</div>
            {(() => {
              const normalizedPlate = formValues.plateNo.trim().toUpperCase();
              const vehicle = vehicles.find(v => 
                v.plateNo?.trim().toUpperCase() === normalizedPlate
              );

              const totalSeats = vehicle?.capacity || 0; // ✅ FIXED: Use 'capacity'

              const assignedToThisVehicle = allActiveRequests
                .filter(req => 
                  req.plate_no?.trim().toUpperCase() === normalizedPlate && 
                  req.fromDate === selectedRequest.fromDate &&
                  req.status === "Accepted"
                )
                .reduce((sum, req) => sum + (req.names?.length || 1), 0);

              const currentPassengers = selectedRequest.names?.length || 1;
              const usedSeats = assignedToThisVehicle + currentPassengers;
              const available = Math.max(0, totalSeats - usedSeats);

              return (
                <>
                  <div>{usedSeats} / {totalSeats} seats used</div>
                  <div className={`mt-1 ${available > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {available > 0 ? `${available} left` : 'No seats left!'}
                  </div>
                </>
              );
            })()}
          </div>
        )} 
        </div>
        </div>
      )}
    </>
  );
}

// Add this CSS to your global styles or component
const styles = `
.custom-scrollbar {
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE/Edge */
}

.custom-scrollbar::-webkit-scrollbar {
  display: none; /* Chrome, Safari, Opera */
}
`;

// Inject styles if not already present
if (!document.querySelector('#notification-scrollbar-styles')) {
  const styleElement = document.createElement('style');
  styleElement.id = 'notification-scrollbar-styles';
  styleElement.textContent = styles;
  document.head.appendChild(styleElement);
}