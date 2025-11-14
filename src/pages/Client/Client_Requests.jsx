// Client_Requests.jsx
import React, { useState, useEffect } from "react";
import { CalendarDays, Clock3, ChevronDown } from "lucide-react";
import { api } from "../../services/api";
import NotificationBar from '../../pages/Client/Client_NotificationBar';

const statusColors = {
  Pending: "bg-orange-100 text-orange-700",
  Decline: "bg-red-100 text-red-700",
  Accept: "bg-green-100 text-green-700",
};

const officeOptions = ["SysADD"];

function Client_Requests() {
  const [showOfficeDropdown, setShowOfficeDropdown] = useState(false);
  const [showSort, setShowSort] = useState(false);
  const [sortStatus, setSortStatus] = useState("All");
  const [showModal, setShowModal] = useState(false);
  const [showPendingModal, setShowPendingModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    destination: "",
    names: [""],
    requestingOffice: "",
    fromDate: "",
    fromTime: "",
    toDate: "",
    toTime: "",
  });
  const [expandedRequestId, setExpandedRequestId] = useState(null);

  // Fetch requests on mount
  useEffect(() => {
    fetchRequests();
  }, []);

  // Prevent body scroll (optional: consider if needed)
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const data = await api.getRequests();
      setRequests(data);
    } catch (error) {
      console.error("Error fetching requests:", error);
      alert(`Failed to load requests: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const resetFormData = () => {
    setFormData({
      destination: "",
      names: [""],
      requestingOffice: "",
      fromDate: "",
      fromTime: "",
      toDate: "",
      toTime: "",
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

  // Submit via API
  const handleSubmit = async (e) => {
    e.preventDefault();
    const newRequest = {
      destination: formData.destination,
      names: formData.names.filter((name) => name.trim() !== ""),
      requestingOffice: formData.requestingOffice,
      fromDate: formData.fromDate,
      fromTime: formData.fromTime,
      toDate: formData.toDate,
      toTime: formData.toTime,
      // status will be set to "Pending" by backend
    };

    try {
      const savedRequest = await api.createRequest(newRequest);
      setRequests((prev) => [...prev, savedRequest]);
      resetFormData();
      setShowModal(false);
    } catch (error) {
      console.error("Failed to create request:", error);
      alert(`Error: ${error.message}`);
    }
  };

  const handleCancel = () => {
    resetFormData();
    setShowModal(false);
  };

  const handlePendingClick = (request) => {
    setSelectedRequest(request);
    setShowPendingModal(true);
  };

  const toggleRequestExpansion = (requestId) => {
    setExpandedRequestId(prevId => prevId === requestId ? null : requestId);
  };

  // Handle updates from NotificationBar
  const handleRequestUpdate = (updatedRequest) => {
    setRequests((prev) =>
      prev.map((req) => (req.id === updatedRequest.id ? updatedRequest : req))
    );
  };

  const filteredRequests = sortStatus === "All"
    ? requests
    : requests.filter((req) => req.status === sortStatus);

  const formatDateTime = (date, time) => {
    if (!date) return "";
    const options = { month: "short", day: "numeric" };
    return `${new Date(date).toLocaleDateString("en-US", options)} at ${time}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F9FFF5] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-700 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading requests...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-[#F9FFF5] flex flex-col">
      <NotificationBar onRequestUpdate={handleRequestUpdate} />

      <div className="container mx-auto px-4 py-8 flex-1 overflow-hidden">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Requests</h1>
          <div className="flex gap-4 items-center overflow-hidden">
            <button
              className="fixed bottom-6 right-4 py-4 px-6 bg-green-700 text-white text-sm rounded-md hover:bg-green-600 transition duration-300 flex items-center space-x-1 shadow-lg z-40"
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
                <div className="absolute right-0 mt-2 w-36 text-sm bg-white border border-gray-200 rounded-md shadow-md z-10 overflow-hidden">
                  {["Accept", "Decline", "Pending"].map((status) => (
                    <button
                      key={status}
                      className={`block w-full text-left px-4 py-2 hover:bg-gray-100 ${
                        sortStatus === status ? "bg-gray-100" : ""
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
        
        {/* Main content container with adjustable height */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden flex-1 flex flex-col h-[calc(100vh-200px)]">
          {filteredRequests.length > 0 ? (
            <div className="overflow-y-auto flex-1" style={{scrollbarWidth: 'none', msOverflowStyle: 'none'}}>
              <style>{`
                .overflow-y-auto::-webkit-scrollbar {
                  display: none;
                }
              `}</style>
              <div className="divide-y divide-gray-200 p-2">
                {filteredRequests.map((req) => (
                  <div key={req.id} className="border border-gray-100 rounded-lg m-2 shadow-sm overflow-hidden">
                    {/* Collapsible Header */}
                    <div 
                      className="p-4 hover:bg-gray-50 transition-colors cursor-pointer flex items-start gap-4"
                      onClick={() => toggleRequestExpansion(req.id)}
                    >
                      <div className="p-2 bg-blue-50 rounded-lg text-gray-600">
                        <CalendarDays size={20} />
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-bold text-base text-gray-800">
                              {req.destination}
                            </h3>
                            <p className="text-xs text-gray-600">
                              {req.names.join(", ")}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                          </div>
                        </div>
                        <div className="mt-1 flex flex-col sm:flex-row sm:items-center gap-2 text-xs text-gray-600">
                          <div className="flex items-center gap-1">
                            <Clock3 size={12} className="text-gray-400" />
                            <span>{formatDateTime(req.fromDate, req.fromTime)}</span>
                          </div>
                          <span className="hidden sm:inline">→</span>
                          <div className="flex items-center gap-1">
                            <Clock3 size={12} className="text-gray-400" />
                            <span>{formatDateTime(req.toDate, req.toTime)}</span>
                          </div>
                        </div>
                        {req.requestingOffice && (
                          <div className="mt-1 text-xs text-gray-600">
                            <span className="font-medium">Office:</span> {req.requestingOffice}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Collapsible Content */}
                    {expandedRequestId === req.id && (
                      <div className="px-4 pb-4 border-t border-gray-100 pt-2">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                          <div>
                            <p className="text-xs font-medium text-gray-500">From</p>
                            <p className="text-xs">{formatDateTime(req.fromDate, req.fromTime)}</p>
                          </div>
                          <div>
                            <p className="text-xs font-medium text-gray-500">To</p>
                            <p className="text-xs">{formatDateTime(req.toDate, req.toTime)}</p>
                          </div>
                        </div>

                        {req.requestingOffice && (
                          <div className="mb-3">
                            <p className="text-xs font-medium text-gray-500">Office</p>
                            <p className="text-xs">{req.requestingOffice}</p>
                          </div>
                        )}

                        <div className="mb-3">
                          <p className="text-xs font-medium text-gray-500">Status</p>
                          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${statusColors[req.status]}`}>
                            {req.status.toUpperCase()}
                          </span>
                        </div>

                        {/* Driver Info - Only if accepted */}
                        {req.status === "Accept" && (
                          <div className="mt-4 border-t pt-3">
                            <h3 className="font-semibold text-base mb-2">Driver's Information</h3>
                            <div className="grid grid-cols-2 gap-3">
                              <div>
                                <p className="text-xs font-medium text-gray-500">Driver Name</p>
                                <p className="text-xs mt-1">{req.driver || "-"}</p>
                              </div>
                              <div>
                                <p className="text-xs font-medium text-gray-500">Contact No.</p>
                                <p className="text-xs mt-1">{req.driverContact || "-"}</p>
                              </div>
                              <div>
                                <p className="text-xs font-medium text-gray-500">Vehicle Type</p>
                                <p className="text-xs mt-1">{req.vehicleType || "-"}</p>
                              </div>
                              <div>
                                <p className="text-xs font-medium text-gray-500">Plate No.</p>
                                <p className="text-xs mt-1">{req.plateNo || "-"}</p>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center py-8">
                <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-3">
                  <CalendarDays size={32} className="text-gray-400" />
                </div>
                <h3 className="text-base font-medium text-gray-700">No requests found</h3>
                <p className="mt-1 text-gray-500">Get started by creating a new request</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* CREATE NEW REQUEST Modal */}
      {showModal && (
       <div className="fixed inset-0 flex items-center justify-center z-50 backdrop-blur-[1px]">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-sm relative">
            <div className="p-5">
              <h2 className="text-xl font-bold text-gray-800 mb-5">Create New Request</h2>
              <form onSubmit={handleSubmit}>
                {/* From Date and Time */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
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
                </div>

                {/* To Date and Time */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
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

                {/* Names */}
                <div className="mb-4">
                  <label className="block text-xs font-medium text-gray-700 mb-1">Names</label>
                  <div
                    className={`flex flex-col gap-2 ${
                      formData.names.length >= 2 ? "max-h-[120px] overflow-y-auto" : ""
                    }`}
                    style={formData.names.length >= 2 ? {scrollbarWidth: 'none', msOverflowStyle: 'none'} : {}}
                  >
                    {formData.names.length >= 2 && (
                      <style>{`
                        .max-h-\\[120px\\]::-webkit-scrollbar {
                          display: none;
                        }
                      `}</style>
                    )}
                    {formData.names.map((name, index) => (
                      <div key={index} className="group relative flex min-h-[42px]">
                        <input
                          type="text"
                          name={`name-${index}`}
                          value={name}
                          onChange={handleInputChange}
                          className="w-full border border-gray-300 rounded-md px-3 py-2 pr-10 text-sm focus:border-black focus:ring-0"
                          placeholder="Enter name"
                          required={index === 0}
                        />
                        <div className="absolute right-0 top-0 h-full flex border-l border-gray-300 rounded-r-md overflow-hidden">
                          {index === 0 && (
                            <button
                              type="button"
                              onClick={() =>
                                setFormData((prev) => ({
                                  ...prev,
                                  names: [...prev.names, ""],
                                }))
                              }
                              className="h-full bg-gray-100 text-gray-600 w-8 flex items-center justify-center hover:bg-gray-200 border-0"
                            >
                              +
                            </button>
                          )}
                          {index > 0 && (
                            <button
                              type="button"
                              onClick={() =>
                                setFormData((prev) => ({
                                  ...prev,
                                  names: prev.names.filter((_, i) => i !== index),
                                }))
                              }
                              className="h-full bg-gray-100 text-gray-600 w-8 flex items-center justify-center hover:bg-gray-200 border-0"
                            >
                              -
                            </button>
                          )}
                        </div>
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
                  />
                </div>

                {/* Requesting Office Dropdown */}
                <div className="mb-6 relative">
                  <label className="block text-xs font-medium text-gray-700 mb-1">Requesting Office</label>
                  <button
                    type="button"
                    className="w-full border border-gray-300 px-3 py-2 rounded-md bg-white flex items-center justify-between hover:bg-gray-50 transition-colors text-sm"
                    onClick={() => setShowOfficeDropdown((prev) => !prev)}
                  >
                    {formData.requestingOffice || "Select an office"}
                    <svg
                      className={`w-4 h-4 transition-transform ${showOfficeDropdown ? "rotate-180" : ""}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {showOfficeDropdown && (
                    <div className="absolute mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg z-10 max-h-40 overflow-y-auto text-sm" style={{scrollbarWidth: 'none', msOverflowStyle: 'none'}}>
                      <style>{`
                        .max-h-40::-webkit-scrollbar {
                          display: none;
                        }
                      `}</style>
                      {officeOptions.map((office, idx) => (
                        <button
                          key={idx}
                          type="button"
                          className={`block w-full text-left px-3 py-2 hover:bg-gray-100 ${
                            formData.requestingOffice === office ? "bg-gray-100 font-medium" : ""
                          }`}
                          onClick={() => {
                            handleInputChange({ target: { name: "requestingOffice", value: office } });
                            setShowOfficeDropdown(false);
                          }}
                        >
                          {office}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Buttons */}
                <div className="flex justify-end gap-3">
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

      {/* REQUEST DETAILS MODAL */}
      {showPendingModal && selectedRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-[60] p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md relative">
            <div className="p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Request Details</h2>

              <div className="mb-4">
                <h3 className="text-lg font-semibold">{selectedRequest.destination}</h3>
                <p className="text-sm text-gray-600">{selectedRequest.names.join(", ")}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-xs font-medium text-gray-500">From</p>
                  <p className="text-sm">{formatDateTime(selectedRequest.fromDate, selectedRequest.fromTime)}</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500">To</p>
                  <p className="text-sm">{formatDateTime(selectedRequest.toDate, selectedRequest.toTime)}</p>
                </div>
              </div>

              {selectedRequest.requestingOffice && (
                <div className="mb-4">
                  <p className="text-xs font-medium text-gray-500">Office</p>
                  <p className="text-sm">{selectedRequest.requestingOffice}</p>
                </div>
              )}

              <div className="mb-4">
                <p className="text-xs font-medium text-gray-500">Status</p>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColors[selectedRequest.status]}`}>
                  {selectedRequest.status.toUpperCase()}
                </span>
              </div>

              {/* Driver Info - Only if accepted */}
              {selectedRequest.status === "Accept" && (
                <div className="mt-6 border-t pt-4">
                  <h3 className="font-semibold text-lg mb-3">Driver's Information</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs font-medium text-gray-500">Driver Name</p>
                      <p className="text-sm mt-1">{selectedRequest.driver || "-"}</p>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-gray-500">Contact No.</p>
                      <p className="text-sm mt-1">{selectedRequest.driverContact || "-"}</p>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-gray-500">Vehicle Type</p>
                      <p className="text-sm mt-1">{selectedRequest.vehicleType || "-"}</p>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-gray-500">Plate No.</p>
                      <p className="text-sm mt-1">{selectedRequest.plateNo || "-"}</p>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex justify-end mt-6">
                <button
                  onClick={() => setShowPendingModal(false)}
                  className="px-4 py-2 bg-green-700 text-white rounded-lg hover:bg-green-800 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Client_Requests;