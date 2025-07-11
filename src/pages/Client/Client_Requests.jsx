import React, { useState, useEffect, useRef } from "react";
import { CalendarDays, Clock3, ChevronDown } from "lucide-react";
import io from 'socket.io-client';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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
  const [formData, setFormData] = useState({
    destination: "",
    names: [""],
    requestingOffice: "",
    status: "Pending",
    fromDate: "",
    fromTime: "",
    toDate: "",
    toTime: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const socketRef = useRef(null);

  // Initialize WebSocket connection
  useEffect(() => {
    socketRef.current = io('http://localhost:5000', {
      withCredentials: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, []);

  // Fetch initial requests
  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/requests', {
          credentials: 'include'
        });
        if (!response.ok) throw new Error('Failed to fetch requests');
        const data = await response.json();
        setRequests(data);
      } catch (error) {
        console.error('Error fetching requests:', error);
        toast.error('Failed to load requests');
      }
    };

    fetchRequests();
  }, []);

  // Prevent page scroll
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const newRequest = {
        destination: formData.destination,
        date: formData.fromDate,
        end_date: formData.toDate,
        time: formData.fromTime,
        names: formData.names.filter(name => name.trim() !== ""),
        requesting_office: formData.requestingOffice,
        status: "Pending"
      };

      const response = await fetch('http://localhost:5000/api/requests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newRequest),
        credentials: 'include'
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create request');
      }

      const createdRequest = await response.json();
      
      // Update local state
      setRequests(prev => [...prev, createdRequest]);
      
      // Notify admin via socket
      if (socketRef.current) {
        socketRef.current.emit('new-request', createdRequest);
      }

      resetFormData();
      setShowModal(false);
      toast.success('Request submitted successfully!');
    } catch (error) {
      console.error('Error submitting request:', error);
      toast.error(error.message || 'Failed to submit request');
    } finally {
      setIsLoading(false);
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

  const filteredRequests = sortStatus === "All"
    ? requests
    : requests.filter((req) => req.status === sortStatus);

  const formatDateTime = (date, time) => {
    if (!date) return "";
    const options = { month: "short", day: "numeric" };
    return `${new Date(date).toLocaleDateString("en-US", options)} at ${time}`;
  };

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
                className="border border-gray-300 px-4 py-2 rounded-lg bg-white shadow-sm flex items-center gap-2 hover:bg-gray-50 transition-colors"
                onClick={() => setShowSort((prev) => !prev)}
              >
                Sort
                <ChevronDown
                  className={`transition-transform ${showSort ? "rotate-180" : ""}`}
                  size={16}
                />
              </button>
              {showSort && (
                <div className="absolute right-0 mt-2 w-36 bg-white border border-gray-200 rounded-lg shadow-lg z-10 overflow-hidden">
                  {["All", "Accept", "Decline", "Pending"].map((status) => (
                    <button
                      key={status}
                      className={`block w-full text-left px-4 py-2 hover:bg-gray-100 ${
                        sortStatus === status ? "bg-gray-100 font-medium" : ""
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
                  className="p-6 hover:bg-gray-50 transition-colors"
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
                          onClick={() => handlePendingClick(req)}
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColors[req.status]}`}
                        >
                          {req.status.toUpperCase()}
                        </button>
                      </div>
                      <div className="mt-2 flex flex-col sm:flex-row sm:items-center gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <Clock3 size={14} className="text-gray-400" />
                          <span>{formatDateTime(req.date || req.fromDate, req.time || req.fromTime)}</span>
                        </div>
                        <span className="hidden sm:inline">→</span>
                        <div className="flex items-center gap-1">
                          <Clock3 size={14} className="text-gray-400" />
                          <span>{formatDateTime(req.end_date || req.toDate, req.end_time || req.toTime)}</span>
                        </div>
                      </div>
                      {req.requesting_office && (
                        <div className="mt-2 text-sm text-gray-600">
                          <span className="font-medium">Office:</span> {req.requesting_office}
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
                      formData.names.length >= 2 
                        ? 'max-h-[120px] overflow-y-auto custom-scroll' 
                        : ''
                    }`}
                  >
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
                              onClick={() => setFormData(prev => ({
                                ...prev,
                                names: [...prev.names, ""]
                              }))}
                              className="h-full bg-gray-100 text-gray-600 w-8 flex items-center justify-center hover:bg-gray-200 border-0"
                            >
                              +
                            </button>
                          )}
                          {index > 0 && (
                            <button
                              type="button"
                              onClick={() => setFormData(prev => ({
                                ...prev,
                                names: prev.names.filter((_, i) => i !== index)
                              }))}
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
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
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
                    <div className="absolute mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg z-10 max-h-40 overflow-y-auto text-sm">
                      {officeOptions.map((office, idx) => (
                        <button
                          key={idx}
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
                    className={`px-4 py-2 bg-green-700 rounded-lg font-medium text-white hover:bg-green-800 transition-colors ${
                      isLoading ? "opacity-75 cursor-not-allowed" : ""
                    }`}
                    disabled={isLoading}
                  >
                    {isLoading ? 'Submitting...' : 'Submit Request'}
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

      {/* PENDING REQUEST DETAILS MODAL */}
      {showPendingModal && selectedRequest && (
        <div className="fixed inset-0 bg-opacity-30 flex items-center justify-center z-[60] p-4">
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
                  <p className="text-sm">
                    {formatDateTime(selectedRequest.date || selectedRequest.fromDate, selectedRequest.time || selectedRequest.fromTime)}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500">To</p>
                  <p className="text-sm">
                    {formatDateTime(selectedRequest.end_date || selectedRequest.toDate, selectedRequest.end_time || selectedRequest.toTime)}
                  </p>
                </div>
              </div>
              
              {selectedRequest.requesting_office && (
                <div className="mb-4">
                  <p className="text-xs font-medium text-gray-500">Office</p>
                  <p className="text-sm">{selectedRequest.requesting_office}</p>
                </div>
              )}
              
              <div className="mb-4">
                <p className="text-xs font-medium text-gray-500">Status</p>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColors[selectedRequest.status]}`}>
                  {selectedRequest.status.toUpperCase()}
                </span>
              </div>
              
              {/* Driver Information Section */}
              <div className="mt-6 border-t pt-4">
                <h3 className="font-semibold text-lg mb-3">Driver's Name</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs font-medium text-gray-500">Contact No.</p>
                    <p className="text-sm mt-1">-</p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-500">Email Address</p>
                    <p className="text-sm mt-1">-</p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-500">Vehicle Type</p>
                    <p className="text-sm mt-1">-</p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-500">Fuel Type</p>
                    <p className="text-sm mt-1">-</p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-500">Plate no.</p>
                    <p className="text-sm mt-1">-</p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-500">Capacity</p>
                    <p className="text-sm mt-1">-</p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-500">RFID</p>
                    <p className="text-sm mt-1">-</p>
                  </div>
                </div>
              </div>    
              
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