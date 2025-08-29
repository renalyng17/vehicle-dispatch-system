import React, { useState, useEffect } from "react";
import { CalendarDays, Clock3, ChevronDown } from "lucide-react";
import axios from "axios";
import { useAuth } from "../../Context/AuthContext"; 

const statusColors = {
  Pending: "bg-orange-100 text-orange-700",
  Decline: "bg-red-100 text-red-700",
  Accept: "bg-green-100 text-green-700",
};


function Client_Requests() {
  const { user } = useAuth();
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

  // Fetch requests from database
  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await axios.get('/api/requests', {
          withCredentials: true
        });
        setRequests(response.data);
      } catch (error) {
        console.error('Error fetching requests:', error);
      } finally {
        setLoading(false);
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

  const formatTimeWithAMPM = (time) => {
    if (!time) return "";
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours, 10);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
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
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // Calculate trip duration
      const fromDateTime = new Date(`${formData.fromDate}T${formData.fromTime}`);
      const toDateTime = new Date(`${formData.toDate}T${formData.toTime}`);
      const tripDurationDays = Math.ceil((toDateTime - fromDateTime) / (1000 * 60 * 60 * 24));

      const newRequest = {
        user_id: user.id,
        departure_time: `${formData.fromDate}T${formData.fromTime}`,
        arrival_time: `${formData.toDate}T${formData.toTime}`,
        destination: formData.destination,
        trip_duration_days: tripDurationDays,
        status: "Pending",
        passenger_names: formData.names.filter(name => name.trim() !== ""),
        requesting_office: formData.requestingOffice,
        driver_name: formData.driverName,
        contact_no: formData.contactNo,
        email: formData.email,
        vehicle_type: formData.vehicleType,
        plate_no: formData.plateNo,
        capacity: formData.capacity,
        fuel_type: formData.fuelType
      };

      const response = await axios.post('/api/requests', newRequest, {
        withCredentials: true
      });

      setRequests(prev => [...prev, response.data]);
      resetFormData();
      setShowModal(false);
    } catch (error) {
      console.error('Error creating request:', error);
      // Add error notification here
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

  const updateRequestStatus = async (status, reason) => {
    try {
      const response = await axios.put(
        `/api/requests/${selectedRequest.request_id}/status`,
        { status, reason_for_dec: reason },
        { withCredentials: true }
      );
      
      setRequests(prev => 
        prev.map(req => 
          req.request_id === selectedRequest.request_id ? response.data : req
        )
      );
      setShowPendingModal(false);
    } catch (error) {
      console.error('Error updating request status:', error);
    }
  };

  const filteredRequests = sortStatus === "All"
    ? requests
    : requests.filter((req) => req.status === sortStatus);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F9FFF5] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-700"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F9FFF5]">
      {/* Main Content */}
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
        
        {/* Requests List */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          {filteredRequests.length > 0 ? (
            <div className="divide-y divide-gray-200">
              {filteredRequests.map((req) => (
                <div
                  key={req.request_id}
                  className="p-6 hover:bg-gray-50 transition-colors cursor-pointer"
                  onClick={() => handlePendingClick(req)}
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
                            {req.passenger_names?.join(", ")}
                          </p>
                        </div>
                        <button 
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColors[req.status]}`}
                        >
                          {req.status.toUpperCase()}
                        </button>
                      </div>
                      <div className="mt-2 flex flex-col sm:flex-row sm:items-center gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <Clock3 size={14} className="text-gray-400" />
                          <span>{formatDateTime(req.departure_time?.split('T')[0], req.departure_time?.split('T')[1])}</span>
                        </div>
                        <span className="hidden sm:inline">→</span>
                        <div className="flex items-center gap-1">
                          <Clock3 size={14} className="text-gray-400" />
                          <span>{formatDateTime(req.arrival_time?.split('T')[0], req.arrival_time?.split('T')[1])}</span>
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

      {/* Create Request Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-[60] p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md relative max-h-[90vh] overflow-y-auto">
            <div className="p-5">
              <h2 className="text-xl font-bold text-gray-800 mb-5">Create New Request</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Form fields remain the same as your original */}
                {/* ... */}
                
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

      {/* Request Details Modal */}
      {showPendingModal && selectedRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-[60] p-4">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-2xl relative max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                    <CalendarDays size={20} />
                    {selectedRequest.destination}
                  </h1>
                  <div className="flex items-center gap-2 mt-1">
                    <button
                      className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[selectedRequest.status] || ''}`}
                    >
                      {selectedRequest.status.toUpperCase()}
                    </button>
                    <span className="text-sm text-gray-500">
                      {selectedRequest.requesting_office}
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
                {/* Left Column */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h2 className="font-semibold text-gray-700 mb-3">Schedule</h2>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-start">
                      <Clock3 size={16} className="text-gray-500 mt-0.5 mr-2 flex-shrink-0" />
                      <div>
                        <p className="font-medium">From</p>
                        <p>{formatFullDate(selectedRequest.departure_time?.split('T')[0])} at {formatTimeWithAMPM(selectedRequest.departure_time?.split('T')[1])}</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <Clock3 size={16} className="text-gray-500 mt-0.5 mr-2 flex-shrink-0" />
                      <div>
                        <p className="font-medium">To</p>
                        <p>{formatFullDate(selectedRequest.arrival_time?.split('T')[0])} at {formatTimeWithAMPM(selectedRequest.arrival_time?.split('T')[1])}</p>
                      </div>
                    </div>
                  </div>
                  
                  <h2 className="font-semibold text-gray-700 mt-4 mb-3">Passengers</h2>
                  <ul className="text-sm space-y-1">
                    {selectedRequest.passenger_names?.map((name, index) => (
                      <li key={index} className="flex items-start">
                        <span className="w-2 h-2 rounded-full bg-gray-400 mt-2 mr-2"></span>
                        <span>{name}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Right Column */}
                <div className="space-y-6">
                  {/* Driver Information */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h2 className="font-semibold text-gray-700 mb-3">Driver Information</h2>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center">
                        <span className="font-medium">{selectedRequest.driver_name || 'Not assigned'}</span>
                      </div>
                      {(selectedRequest.contact_no || selectedRequest.email) && (
                        <div className="pl-7 space-y-1">
                          <p>{selectedRequest.contact_no || ''}</p>
                          <p>{selectedRequest.email || ''}</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Vehicle Information */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h2 className="font-semibold text-gray-700 mb-3">Vehicle Information</h2>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      {/* Vehicle details fields */}
                      {/* ... */}
                    </div>
                  </div>

                  {/* Status Update Section (for admin) */}
                  {user.role === 'admin' && selectedRequest.status === 'Pending' && (
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h2 className="font-semibold text-gray-700 mb-3">Update Status</h2>
                      <div className="flex gap-2">
                        <button
                          onClick={() => updateRequestStatus('Accept', 'Approved')}
                          className="px-3 py-1 bg-green-100 text-green-700 rounded-md text-sm"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => {
                            const reason = prompt('Enter reason for decline:');
                            if (reason) updateRequestStatus('Decline', reason);
                          }}
                          className="px-3 py-1 bg-red-100 text-red-700 rounded-md text-sm"
                        >
                          Decline
                        </button>
                      </div>
                    </div>
                  )}
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