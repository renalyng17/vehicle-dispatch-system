import React, { useState, useEffect } from "react";
import { CalendarDays, Clock3, ChevronDown } from "lucide-react";

const statusColors = {
  Pending: "bg-orange-100 text-orange-700",
  Decline: "bg-red-100 text-red-700",
  Accept: "bg-green-100 text-green-700",
};


const officeOptions = ["SysADD"];


function Client_Requests() {
  const [setShowOfficeDropdown] = useState(false);
  const [showSort, setShowSort] = useState(false);
  const [sortStatus, setSortStatus] = useState("All");
  const [showModal, setShowModal] = useState(false);
  const [showPendingModal, setShowPendingModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [requests, setRequests] = useState([]);
  const [formData, setFormData] = useState({
    destination: "",
    names: [""],
    requestingOffice: "",
    status: "Pending",
    fromDate: "",
    fromTime: "",
    toDate: "",
    toTime: "",
    driverName: "",
    contactNo: "",
    email: "",
    vehicleType: "",
    plateNo: "",
    capacity: "",
    fuelType: ""
  });

  // Prevent page scroll
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  // Helper function to format time in 12-hour format with AM/PM
  const formatTimeWithAMPM = (time) => {
    if (!time) return "";
    
    let [hours, minutes] = time.split(':');
    hours = parseInt(hours, 10);
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    return `${hours}:${minutes} ${ampm}`;
  };

  const formatDateTime = (date, time) => {
    if (!date) return "";
    const options = { month: "short", day: "numeric" };
    return `${new Date(date).toLocaleDateString("en-US", options)} at ${formatTimeWithAMPM(time)}`;
  };

  const formatFullDate = (date) => {
    if (!date) return "";
    return new Date(date).toLocaleDateString('en-US', { 
      month: 'long', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  const resetFormData = () => {
    setFormData({
      destination: "",
      names: [""],
      requestingOffice: "",
      status: "Pending",
      fromDate: "",
      fromTime: "",
      toDate: "",
      toTime: "",
      driverName: "",
      contactNo: "",
      email: "",
      vehicleType: "",
      plateNo: "",
      capacity: "",
      fuelType: ""
    });
    setShowOfficeDropdown(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith("name-")) {
      const index = parseInt(name.split("-")[1]);
      const newNames = [...formData.names];
      newNames[index] = value;
      setFormData((prev) => ({ ...prev, names: newNames }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newRequest = {
      destination: formData.destination,
      fromDate: formData.fromDate,
      fromTime: formData.fromTime,
      toDate: formData.toDate,
      toTime: formData.toTime,
      status: formData.status,
      names: formData.names.filter((name) => name.trim() !== ""),
      requestingOffice: formData.requestingOffice,
      driverName: formData.driverName,
      contactNo: formData.contactNo,
      email: formData.email,
      vehicleType: formData.vehicleType,
      plateNo: formData.plateNo,
      capacity: formData.capacity,
      fuelType: formData.fuelType
    };
    setRequests((prev) => [...prev, newRequest]);
    resetFormData();
    setShowModal(false);
  };

  const handleCancel = () => {
    resetFormData();
    setShowModal(false);
  };

  const handlePendingClick = (request) => {
    setSelectedRequest(request);
    setShowPendingModal(true);
  };

  const filteredRequests = sortStatus === "All"
    ? requests
    : requests.filter((req) => req.status === sortStatus);

  return (
    <div className="min-h-screen bg-[#F9FFF5]">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Requests</h1>
          <div className="flex gap-4 items-center">
            <button
              className="fixed bottom-6 right-4 py-4 px-6 bg-green-700 text-white text-sm rounded-md hover:bg-green-600 transition duration-300 flex items-center space-x-1 shadow-lg"
              onClick={() => setShowModal(true)}
            >
              <span>Create a Request</span>
            </button>
            <div className="relative">
              <button
                className="border border-gray-300 px-4 py-2 rounded-lg text-sm bg-white shadow-sm flex items-center gap-2 hover:bg-gray-50 transition-colors"
                onClick={() => setShowSort((prev) => !prev)}
              >
                Sort
                <ChevronDown
                  className={`transition-transform ${showSort ? "rotate-180" : ""}`}
                  size={16}
                />
              </button>
              {showSort && (
                <div className="absolute right-0 mt-2 w-36 text-sm bg-white border border-gray-200 rounded-m shadow-m z-10 overflow-hidden">
                  {["All", "Accept", "Decline", "Pending"].map((status) => (
                    <button
                      key={status}
                      className={`block w-full text-left px-4 py-2 hover:bg-gray-100 ${
                        sortStatus === status ? "bg-gray-100 text-sm" : ""
                      }`}
                      onClick={() => {
                        setSortStatus(status);
                        setShowSort(false);
                      }}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
        <hr className="border-green-500 mb-5 my-2" />
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          {filteredRequests.length > 0 ? (
            <div className="divide-y divide-gray-200">
              {filteredRequests.map((req, idx) => (
                <div
                  key={idx}
                  className="p-6 hover:bg-gray-50 transition-colors cursor-pointer"
                  onClick={(e) => {
                    if (!e.target.closest('.status-button')) {
                      handlePendingClick(req);
                    }
                  }}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      handlePendingClick(req);
                    }
                  }}
                  aria-label={`View details for request to ${req.destination}`}
                >
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-blue-50 rounded-lg text-black-600">
                      <CalendarDays size={24} />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-bold text-lg text-gray-800">
                            {req.destination}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {req.names.join(", ")}
                          </p>
                        </div>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            handlePendingClick(req);
                          }}
                          className={`status-button px-3 py-1 rounded-full text-xs font-semibold ${statusColors[req.status]}`}
                        >
                          {req.status.toUpperCase()}
                        </button>
                      </div>
                      <div className="mt-2 flex flex-col sm:flex-row sm:items-center gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <Clock3 size={14} className="text-gray-400" />
                          <span>{formatDateTime(req.fromDate, req.fromTime)}</span>
                        </div>
                        <span className="hidden sm:inline">→</span>
                        <div className="flex items-center gap-1">
                          <Clock3 size={14} className="text-gray-400" />
                          <span>{formatDateTime(req.toDate, req.toTime)}</span>
                        </div>
                      </div>
                      {req.requestingOffice && (
                        <div className="mt-2 text-sm text-gray-600">
                          <span className="font-medium">Office:</span> {req.requestingOffice}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <CalendarDays size={40} className="text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-700">No requests found</h3>
              <p className="mt-1 text-gray-500">Get started by creating a new request</p>
            </div>
          )}
        </div>
      </div>
      
      {/* CREATE NEW REQUEST Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-opacity-30 flex items-center justify-center z-[60] p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md relative overflow-y-auto">
            <div className="p-5">
              <h2 className="text-xl font-bold text-gray-800 mb-5">Create New Request</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Schedule Section */}
                  <div>
                    <h3 className="font-semibold text-gray-700 mb-3 border-b pb-2">Schedule</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">From Date</label>
                        <input
                          type="date"
                          name="fromDate"
                          value={formData.fromDate}
                          onChange={handleInputChange}
                          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">From Time</label>
                        <input
                          type="time"
                          name="fromTime"
                          value={formData.fromTime}
                          onChange={handleInputChange}
                          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">To Date</label>
                        <input
                          type="date"
                          name="toDate"
                          value={formData.toDate}
                          onChange={handleInputChange}
                          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">To Time</label>
                        <input
                          type="time"
                          name="toTime"
                          value={formData.toTime}
                          onChange={handleInputChange}
                          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* Passenger Information Modal */}
                  <div>
                    <h3 className="font-semibold text-gray-700 mb-3 border-b pb-2">Passenger Information</h3>
                    <div className="mb-4">
                      <label className="block text-xs font-medium text-gray-700 mb-1">Names</label>
                      <div className="space-y-2 max-h-30 overflow-y-auto">
                        {formData.names.map((name, index) => (
                          <div key={index} className="flex gap-2 items-center">
                            <input
                              type="text"
                              name={`name-${index}`}
                              value={name}
                              onChange={handleInputChange}
                              className="flex-1 border border-gray-300 rounded-md px-3 py-2 text-sm"
                              placeholder="Enter name"
                              required={index === 0}
                            />
                            {index === 0 ? (
                              <button
                                type="button"
                                onClick={() => setFormData(prev => ({
                                  ...prev,
                                  names: [...prev.names, ""]
                                }))}
                                className="w-8 h-8 bg-gray-100 text-gray-600 rounded-md flex items-center justify-center hover:bg-gray-200"
                              >
                                +
                              </button>
                            ) : (
                              <button
                                type="button"
                                onClick={() => setFormData(prev => ({
                                  ...prev,
                                  names: prev.names.filter((_, i) => i !== index)
                                }))}
                                className="w-8 h-8 bg-gray-100 text-gray-600 rounded-md flex items-center justify-center hover:bg-gray-200"
                              >
                                -
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="mb-4">
                      <label className="block text-xs font-medium text-gray-700 mb-1">Destination</label>
                      <input
                        type="text"
                        name="destination"
                        value={formData.destination}
                        onChange={handleInputChange}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                        required
                        placeholder="Enter destination"
                      />
                    </div>

                    <div className="mb-4 relative">
                      <label className="block text-xs font-medium text-gray-700 mb-1">Requesting Office</label>
                      <div className="relative">
                        <select
                          name="requestingOffice"
                          value={formData.requestingOffice}
                          onChange={handleInputChange}
                          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm appearance-none bg-white"
                          required
                        >
                          <option value="">Select an office</option>
                          {officeOptions.map((office, idx) => (
                            <option key={idx} value={office}>
                              {office}
                            </option>
                          ))}
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                          <ChevronDown size={16} />
                        </div>
                      </div>
                    </div>
                  </div>
                

                {/* Buttons */}
                <div className="flex justify-end gap-3 pt-4">
                  <button
                    type="button"
                    className="px-4 py-2 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                    onClick={handleCancel}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-green-700 rounded-lg font-medium text-white hover:bg-green-800 transition-colors"
                  >
                    Submit Request
                  </button>
                </div>
              </form>
            </div>
            <button
              className="absolute top-4 right-4 p-1 rounded-full hover:bg-gray-100 transition-colors"
              onClick={handleCancel}
              aria-label="Close"
            >
              <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* REQUEST DETAILS MODAL for Pending, Accepted and Declined Requests */}
      {showPendingModal && selectedRequest && (
        <div className="fixed inset-0 bg-opacity-30 flex items-center justify-center z-[60] p-4">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-2xl relative max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                    <span className="inline-block">
                      <svg  className="w-5 h-5 text-gray-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 2h6v4H9V2z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16v14H4V6z" />
                      </svg>
                    </span>
                    {selectedRequest.destination}
                  </h1>
                  <div className="flex items-center gap-2 mt-1">
                    <button
                      className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[selectedRequest.status] || ''}`}
                    >
                      {selectedRequest.status.toUpperCase()}
                    </button>
                    <span className="text-sm text-gray-500">
                      {selectedRequest.requestingOffice}
                    </span>
                  </div>
                </div>
                <button
                  className="p-1 rounded-full hover:bg-gray-100 transition-colors"
                  onClick={() => setShowPendingModal(false)}
                  aria-label="Close"
                >
                  <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">

                {/* Schedule and Passengers Modal for clicking Pending, Accepted and Decline */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h2 className="font-semibold text-gray-700 mb-3">Schedule</h2>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-start">
                      <CalendarDays size={16} className="text-gray-500 mt-0.5 mr-2 flex-shrink-0" />
                      <div>
                        <p className="font-medium">From</p>
                        <p>{formatFullDate(selectedRequest.fromDate)} at {formatTimeWithAMPM(selectedRequest.fromTime)}</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <CalendarDays size={16} className="text-gray-500 mt-0.5 mr-2 flex-shrink-0" />
                      <div>
                        <p className="font-medium">To</p>
                        <p>{formatFullDate(selectedRequest.toDate)} at {formatTimeWithAMPM(selectedRequest.toTime)}</p>
                      </div>
                    </div>
                  </div>
                  
                  <h2 className="font-semibold text-gray-700 mt-4 mb-3">Passengers</h2>
                  <ul className="text-sm space-y-1">
                    {selectedRequest.names.map((name, index) => (
                      <li key={index} className="flex items-start">
                        <span className="w-2 h-2 rounded-full bg-gray-400 mt-2 mr-2"></span>
                        <span>{name}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Driver and Vehicle Information for clicking Pending, Accepted and Decline */}
                <div className="space-y-6">
                  {/* Driver Information */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h2 className="font-semibold text-gray-700 mb-3">Driver Information</h2>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center">
                      </div>
                      {(selectedRequest.contactNo || selectedRequest.email) ? (
                        <div className="pl-7 space-y-1">
                          <p>{selectedRequest.contactNo || <span className="text-gray-400">No contact</span>}</p>
                          <p>{selectedRequest.email || <span className="text-gray-400">No email</span>}</p>
                        </div>
                      ) : (
                        <div className="pl-7 text-gray-400">No driver assign yet</div>
                      )}
                    </div>
                  </div>

                  {/* Vehicle Information */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h2 className="font-semibold text-gray-700 mb-3">Vehicle Information</h2>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <p className="text-gray-500 text-xs">Type</p>
                        <p className="font-medium">
                          {selectedRequest.vehicleType ? selectedRequest.vehicleType : <span className="text-gray-400">N/A</span>}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-500 text-xs">Plate No.</p>
                        <p className="font-medium">
                          {selectedRequest.plateNo ? selectedRequest.plateNo : <span className="text-gray-400">N/A</span>}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-500 text-xs">Capacity</p>
                        <p className="font-medium">
                          {selectedRequest.capacity ? selectedRequest.capacity : <span className="text-gray-400">N/A</span>}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-500 text-xs">Fuel Type</p>
                        <p className="font-medium">
                          {selectedRequest.fuelType ? selectedRequest.fuelType : <span className="text-gray-400">N/A</span>}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Client_Requests;