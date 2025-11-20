// NotificationBar.js
import { Bell, AlertTriangle } from "lucide-react";
import { useState, useEffect, useRef, useMemo } from "react";

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
        <svg
          className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
        </svg>
      </div>

      {isOpen && (
        <ul className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
          {options.length > 0 ? (
            options.map((option, index) => (
              <li
                key={index}
                className="px-3 py-2 text-sm cursor-pointer hover:bg-teal-50 hover:text-green-800 transition-colors"
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

export default function NotificationBar({ onRequestUpdate }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isDeclineModalOpen, setIsDeclineModalOpen] = useState(false);
  const [isAcceptModalOpen, setIsAcceptModalOpen] = useState(false);
  const [isConflictModalOpen, setIsConflictModalOpen] = useState(false);
  const [conflictMessage, setConflictMessage] = useState("");
  const [bellPosition, setBellPosition] = useState({ top: 0, right: 10 });
  const [notifications, setNotifications] = useState([]);
  const [allActiveRequests, setAllActiveRequests] = useState([]);
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
  
  const previousNotificationsRef = useRef([]);
  const [newNotificationCount, setNewNotificationCount] = useState(0);



  // Fetch requests - RUNS IMMEDIATELY AND EVERY 5 SECONDS
  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const allRequests = await api.getRequests();
        const pending = allRequests.filter((req) => req.status === "Pending");
        const active = allRequests.filter(
          (req) => req.status === "Pending" || req.status === "Accepted"
        );
        
        // Sort by creation date (newest first)
        const sortedPending = pending.sort((a, b) => 
          new Date(b.createdAt) - new Date(a.createdAt)
        );
        
        // Calculate new notifications
        const previousIds = new Set(previousNotificationsRef.current.map(n => n.id));
        const newNotifications = sortedPending.filter(n => !previousIds.has(n.id));
        
        setNotifications(sortedPending);
        
        // Update new notification count
        if (previousNotificationsRef.current.length > 0) {
          setNewNotificationCount(prev => prev + newNotifications.length);
        }
        
        // Update ref with current notifications
        previousNotificationsRef.current = sortedPending;
        
        setAllActiveRequests(active);
      } catch (error) {
        console.error("Failed to fetch notifications:", error);
        setConflictMessage("Failed to load notifications. Please try again.");
        setIsConflictModalOpen(true);
      }
    };

    // Initial fetch
    fetchRequests();
    
    // Set up interval to fetch every 5 seconds
    const interval = setInterval(fetchRequests, 5000);
    return () => clearInterval(interval);
  }, []);

  // Fetch drivers & vehicles
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
        setConflictMessage("Failed to load drivers or vehicles.");
        setIsConflictModalOpen(true);
      }
    };
    fetchData();
  }, []);

  // Bell position for dropdown
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

  // Reset form on Accept modal open
  useEffect(() => {
    if (isAcceptModalOpen) {
      setFormValues({ driver: "", vehicleType: "", plateNo: "", reason: "" });
    }
  }, [isAcceptModalOpen]);

  // Reset new notification count when dropdown opens
  useEffect(() => {
    if (isOpen) {
      setNewNotificationCount(0);
    }
  }, [isOpen]);

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
    
    // AUTO-SYNC: When plate number changes, auto-fill correct vehicle type
    if (name === "plateNo") {
      const selectedVehicle = vehicles.find(v => 
        (v.plateNo || v.plate_no)?.trim() === value.trim()
      );
      
      if (selectedVehicle) {
        const correctVehicleType = selectedVehicle.vehicleType || selectedVehicle.vehicle_model;
        setFormValues((prev) => ({ 
          ...prev, 
          plateNo: value,
          vehicleType: correctVehicleType // Auto-fill the correct vehicle type
        }));
        return;
      }
    }
    
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  // Compute booked resources using ALL active requests FOR THE SELECTED REQUEST'S DATE ONLY
  const { bookedDrivers, bookedVehicles } = useMemo(() => {
    if (!selectedRequest) {
      return { bookedDrivers: new Set(), bookedVehicles: new Set() };
    }

    const date = selectedRequest.fromDate;
    const bookedDrivers = new Set();
    const bookedVehicles = new Set();

    // FILTER BY DATE: Only consider requests on the SAME DATE as the selected request
    allActiveRequests.forEach((req) => {
      if (req.fromDate === date && (req.status === "Accepted" || req.status === "Pending")) {
        if (req.driver_name) bookedDrivers.add(req.driver_name.trim());
        if (req.plate_no) bookedVehicles.add(req.plate_no.trim());
      }
    });

    return { bookedDrivers, bookedVehicles };
  }, [selectedRequest, allActiveRequests]); // Dependencies remain the same

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

  // Helper function to convert time to minutes
  const timeToMinutes = (timeStr) => {
    if (!timeStr) return 0;
    const [hours, minutes] = timeStr.split(':').map(Number);
    return hours * 60 + minutes;
  };

  const handleProcess = async (action) => {
    if (!selectedRequest?.id) return;

    if (action === "accept") {
      // CRITICAL VALIDATION BEFORE SUBMISSION
      // 1. Validate Vehicle Type matches Plate Number
      const selectedVehicle = vehicles.find(v => 
        (v.plateNo || v.plate_no)?.trim().toLowerCase() === formValues.plateNo.trim().toLowerCase()
      );

      if (!selectedVehicle) {
        setConflictMessage(`Error: Plate number "${formValues.plateNo}" not found in the system!`);
        setIsConflictModalOpen(true);
        return;
      }

      const correctVehicleType = selectedVehicle.vehicleType || selectedVehicle.vehicle_model;
      
      if (correctVehicleType?.trim().toLowerCase() !== formValues.vehicleType.trim().toLowerCase()) {
        setConflictMessage(
          `❌ Vehicle Mismatch Error!\n\n` +
          `Plate No: ${formValues.plateNo}\n` +
          `Expected Vehicle: ${correctVehicleType}\n` +
          `You Selected: ${formValues.vehicleType}\n\n` +
          `Please select the correct vehicle type for this plate number.`
        );
        setIsConflictModalOpen(true);
        return;
      }

      // 2. Find ALL existing active requests for this driver on the same date
      const driverConflicts = allActiveRequests.filter(req =>
        req.fromDate === selectedRequest.fromDate && // Same date
        (req.status === "Accepted" || req.status === "Pending") &&
        req.driver_name?.trim() === formValues.driver.trim() &&
        req.id !== selectedRequest.id // Exclude the current request itself
      );

      if (driverConflicts.length > 0) {
        // Check if the new request is for the EXACT SAME TRIP (date, dest, driver, vehicle)
        const isSameTrip = driverConflicts.some(req =>
          req.destination === selectedRequest.destination &&
          req.plate_no?.trim() === formValues.plateNo.trim()
        );

        if (!isSameTrip) {
          // If it's NOT the same trip, reject it because driver is already assigned to a different trip
          const conflictingTrip = driverConflicts[0]; // Show details of the first conflicting trip
          setConflictMessage(
            `❌ Driver Conflict!\n\n` +
            `Driver "${formValues.driver}" is already assigned to another trip on ${selectedRequest.fromDate}.\n\n` +
            `Existing Trip Details:\n` +
            `Destination: ${conflictingTrip.destination}\n` +
            `Time: ${conflictingTrip.fromTime} - ${conflictingTrip.toTime}\n` +
            `Vehicle: ${conflictingTrip.plate_no}\n\n` +
            `A driver can only be assigned to ONE trip per day.`
          );
          setIsConflictModalOpen(true);
          return;
        }
        // If it IS the same trip, proceed to capacity check (step 3)
      }

      // 3. Validate Vehicle Assignment - A vehicle can only be assigned to one driver per day
      const vehicleAssignedToDifferentDriver = allActiveRequests.some(req =>
        req.fromDate === selectedRequest.fromDate && // CRUCIAL: Filter by date
        (req.status === "Accepted" || req.status === "Pending") &&
        req.plate_no?.trim() === formValues.plateNo.trim() &&
        req.driver_name?.trim() !== formValues.driver.trim() &&
        req.id !== selectedRequest.id // Exclude the current request itself
      );

      if (vehicleAssignedToDifferentDriver) {
        setConflictMessage(
          `❌ Vehicle Assignment Conflict!\n\n` +
          `The vehicle "${formValues.plateNo}" is already assigned to another driver on ${selectedRequest.fromDate}.\n\n` +
          `A vehicle can only be assigned to ONE driver per day.`
        );
        setIsConflictModalOpen(true);
        return;
      }

      // 4. Check vehicle capacity for the specific trip (same destination/date/driver/vehicle)
      // Calculate total passengers for this exact trip (same date, destination, driver, vehicle)
      const assignedToSameTrip = allActiveRequests
        .filter(req => 
          req.plate_no?.trim().toUpperCase() === formValues.plateNo.trim().toUpperCase() && 
          req.fromDate === selectedRequest.fromDate &&
          req.destination === selectedRequest.destination &&
          req.driver_name === formValues.driver &&
          req.id !== selectedRequest.id // Exclude the current request itself
        )
        .reduce((sum, req) => sum + (req.names?.length || 1), 0);

      const currentPassengers = selectedRequest.names?.length || 1;
      const totalPassengers = assignedToSameTrip + currentPassengers;
      const availableSeats = (selectedVehicle.capacity || 0) - totalPassengers;

      if (availableSeats < 0) {
        setConflictMessage(
          `❌ Capacity Exceeded!\n\n` +
          `Vehicle: ${formValues.plateNo}\n` +
          `Destination: ${selectedRequest.destination}\n` +
          `Available Seats: ${(selectedVehicle.capacity || 0) - assignedToSameTrip}\n` +
          `Requested Seats: ${currentPassengers}\n` +
          `Total Required: ${totalPassengers}\n\n` +
          `Not enough seats available for this trip.`
        );
        setIsConflictModalOpen(true);
        return;
      }
    }

    setIsProcessing(true);
    try {
      let updatedRequest;
      if (action === "accept") {
        const selectedDriver = drivers.find(d => d.name === formValues.driver);
        const mainUpdate = {
          status: "Accepted",
          driver_name: formValues.driver,
          contact_no: selectedDriver?.contact || selectedDriver?.contact_no || "",
          vehicle_type: formValues.vehicleType,
          plate_no: formValues.plateNo,
        };
        updatedRequest = await api.updateRequestStatus(selectedRequest.id, mainUpdate);
        if (onRequestUpdate) onRequestUpdate({ ...selectedRequest, ...mainUpdate });
      } else {
        const updateData = {
          status: "Declined",
          reason_for_decline: formValues.reason || "No reason provided",
        };
        updatedRequest = await api.updateRequestStatus(selectedRequest.id, updateData);
        if (onRequestUpdate) onRequestUpdate(updatedRequest);
      }

      // Reset & close
      setFormValues({ driver: "", vehicleType: "", plateNo: "", reason: "" });
      setIsDeclineModalOpen(false);
      setIsAcceptModalOpen(false);
      setIsConflictModalOpen(false);
      setIsOpen(false);
      setSelectedRequest(null);
    } catch (error) {
      console.error("Error processing request:", error);
      setConflictMessage(`Failed to ${action} request: ${error.message || "Unknown error"}`);
      setIsConflictModalOpen(true);
    } finally {
      setIsProcessing(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Recently';
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffInHours = (now - date) / (1000 * 60 * 60);
      if (diffInHours < 1) return 'Just now';
      if (diffInHours < 24) return `${Math.floor(diffInHours)}h ago`;
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    } catch {
      return 'Recently';
    }
  };

  const getNotificationIcon = () => <Bell className="w-4 h-4 text-green-500" />;
  const getNotificationStyle = () => 'bg-white border border-teal-100';

  return (
    <>
      {/* Bell Button */}
      <button
        id="notification-bell"
        className="fixed top-5 right-7 hover:text-green-500 transition duration-200 z-50"
        onClick={() => setIsOpen(!isOpen)}
        aria-label={`Notifications${notifications.length > 0 ? `, ${notifications.length} new` : ''}`}
      >
        <Bell className="w-6 h-6" />
        {(notifications.length > 0 || newNotificationCount > 0) && (
          <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-green-500" />
        )}
        {newNotificationCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
            {newNotificationCount > 9 ? '9+' : newNotificationCount}
          </span>
        )}
      </button>

      {/* Notification Dropdown */}
      {isOpen && (
        <div
          className="fixed bg-white rounded-lg shadow-xl z-50 border border-gray-200"
          style={{
            top: `calc(${bellPosition.top}px + 2rem)`,
            right: `calc(${bellPosition.right}px + 1rem)`,
            width: "380px",
            maxHeight: "500px",
            transform: "translateY(10px)",
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-4">
            <h3 className="font-semibold text-lg text-gray-800 mb-4">
              Notifications
              {newNotificationCount > 0 && (
                <span className="ml-2 text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                  {newNotificationCount} new
                </span>
              )}
            </h3>
            {notifications.length > 0 ? (
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {notifications.map((request) => {
                  const isNew = previousNotificationsRef.current.slice(0, newNotificationCount)
                    .some(n => n.id === request.id);
                  
                  return (
                    <div
                      key={request.id}
                      className={`p-3 rounded-lg ${getNotificationStyle()} ring-1 ring-white ${
                        isNew ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 mt-0.5">
                          {getNotificationIcon()}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="font-medium text-sm text-green-700">
                                New Travel Request
                                {isNew && (
                                  <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded-full">
                                    NEW
                                  </span>
                                )}
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
                              </div>
                            </div>
                            <div className="flex flex-col items-end gap-1">
                              <span className="text-xs text-gray-500 whitespace-nowrap">
                                {formatDate(request.createdAt)}
                              </span>
                              {isNew && (
                                <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                              )}
                            </div>
                          </div>
                          <div className="mt-3 flex justify-end gap-2">
                            <button
                              onClick={(e) => handleButtonClick(e, "decline", request)}
                              className="px-3 py-1 bg-red-500 text-white text-xs rounded hover:bg-red-600 disabled:opacity-50"
                              disabled={isProcessing}
                            >
                              Decline
                            </button>
                            <button
                              onClick={(e) => handleButtonClick(e, "accept", request)}
                              className="px-3 py-1 bg-green-800 text-white text-xs rounded hover:bg-green-700 disabled:opacity-50"
                              disabled={isProcessing}
                            >
                              Accept
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center text-sm text-gray-500 py-8">
                <Bell className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                No pending requests
              </div>
            )}
          </div>
        </div>
      )}

      {/* Decline Modal */}
      {isDeclineModalOpen && selectedRequest && (
        <div 
          className="fixed inset-0 flex items-center justify-center z-50  bg-opacity-20 backdrop-blur-[1px]"
          onClick={() => setIsDeclineModalOpen(false)}
        >
          <div 
            className="bg-white p-6 rounded-lg shadow-2xl w-full max-w-md mx-4"
            onClick={(e) => e.stopPropagation()}
          >
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
        <div 
          className="fixed inset-0 flex items-center justify-center z-50  bg-opacity-20 backdrop-blur-[1px]"
          onClick={() => setIsAcceptModalOpen(false)}
        >
          <div 
            className="bg-white p-4 rounded-lg shadow-2xl w-full max-w-md mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-xl font-bold text-center text-green-800 mb-3">APPROVE REQUEST</h2>

            {/* Request Info */}
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
              label="Driver"
              name="driver"
              value={formValues.driver}
              onChange={handleInputChange}
              options={availableDrivers}
              required
            />

            <div className="grid grid-cols-2 gap-2 mb-2 mt-2">
              <SelectInput
                label="Type"
                name="vehicleType"
                value={formValues.vehicleType}
                onChange={handleInputChange}
                options={vehicleTypes}
                required
              />
              <SelectInput
                label="Plate"
                name="plateNo"
                value={formValues.plateNo}
                onChange={handleInputChange}
                options={availableVehiclesByType}
                required
              />
            </div>

            {/* Vehicle Capacity */}
            {formValues.plateNo && (
              <div className="mb-3 p-2 bg-blue-50 rounded border border-blue-200 text-xs">
                <div className="font-medium text-blue-800">Vehicle Capacity</div>
                {(() => {
                  const normalizedPlate = formValues.plateNo.trim().toUpperCase();
                  const vehicle = vehicles.find(v => 
                    (v.plateNo || v.plate_no)?.trim().toUpperCase() === normalizedPlate
                  );

                  const totalSeats = vehicle?.capacity || 0;
                  
                  // Count passengers for the same trip (same destination, date, driver)
                  const assignedToSameTrip = allActiveRequests
                    .filter(req => 
                      (req.plate_no || req.plate_no)?.trim().toUpperCase() === normalizedPlate && 
                      req.fromDate === selectedRequest.fromDate &&
                      req.destination === selectedRequest.destination &&
                      req.driver_name === formValues.driver
                    )
                    .reduce((sum, req) => sum + (req.names?.length || 1), 0);

                  const currentPassengers = selectedRequest.names?.length || 1;
                  const usedSeats = assignedToSameTrip + currentPassengers; // Include current request
                  const available = Math.max(0, totalSeats - usedSeats);

                  return (
                    <>
                      <div>{usedSeats} / {totalSeats} seats used for this specific trip</div>
                      <div className={`mt-1 ${available >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {available > 0 
                          ? `${available} seats available` 
                          : available === 0 
                            ? 'No seats left!' 
                            : `Over capacity by ${Math.abs(available)} seats`}
                      </div>
                    </>
                  );
                })()}
              </div>
            )}

            {/* Actions */}
            <div className="flex justify-end gap-x-2 mt-3">
              <button
                onClick={() => {
                  setIsAcceptModalOpen(false);
                  setFormValues({ driver: "", vehicleType: "", plateNo: "", reason: "" });
                }}
                className="px-3 py-1.5 bg-gray-300 text-xs rounded hover:bg-gray-400 transition"
              >
                Cancel
              </button>
              <button
                onClick={() => handleProcess("accept")}
                disabled={!isAcceptFormValid || isProcessing}
                className={`px-3 py-1.5 text-white text-xs rounded transition ${
                  !isAcceptFormValid || isProcessing
                    ? "bg-green-400 opacity-50 cursor-not-allowed"
                    : "bg-green-600 hover:bg-teal-700"
                }`}
              >
                {isProcessing ? "Assigning..." : "Assign"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Conflict / Error Modal */}
      {isConflictModalOpen && (
        <div 
          className="fixed inset-0 flex items-center justify-center z-50  bg-opacity-20 backdrop-blur-[1px]"
          onClick={() => setIsConflictModalOpen(false)}
        >
          <div 
            className="bg-white p-5 rounded-lg shadow-2xl w-full max-w-sm mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-center">
              <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <AlertTriangle className="w-6 h-6 text-amber-600" />
              </div>
              <h3 className="font-bold text-gray-800 text-lg mb-2">Validation Error</h3>
              <p className="text-sm text-gray-600 mb-4 whitespace-pre-line">{conflictMessage}</p>
              <button
                onClick={() => setIsConflictModalOpen(false)}
                className="px-4 py-2 bg-green-800 text-white text-sm rounded-md hover:bg-green-700 transition focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}