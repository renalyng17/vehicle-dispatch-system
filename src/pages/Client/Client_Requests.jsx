  import React, { useState } from "react";
  import { CalendarDays, Clock3, ChevronDown, Plus } from "lucide-react";

  const statusColors = {
    Pending: "bg-orange-100 text-orange-700",
    Decline: "bg-red-100 text-red-700",
    Accept: "bg-green-100 text-green-700",
  };

  const officeOptions = [
    "Admin",
    "SysADD",
    "ICTS",
  ];

  function Client_Requests() {
    const [showSort, setShowSort] = useState(false);
    const [sortStatus, setSortStatus] = useState("All");
    const [showModal, setShowModal] = useState(false);
    const [showOfficeDropdown, setShowOfficeDropdown] = useState(false);
    const [requests, setRequests] = useState([]);
    const [formData, setFormData] = useState({
      destination: "",
      name: "",
      requestingOffice: "",
      status: "Pending",
      fromDate: "",
      fromTime: "",
      toDate: "",
      toTime: ""
    });

    const handleInputChange = (e) => {
      const { name, value } = e.target;
      setFormData(prev => ({ ...prev, [name]: value }));
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
        name: formData.name,
        requestingOffice: formData.requestingOffice
      };
      
      setRequests(prev => [...prev, newRequest]);
      setShowModal(false);
      setFormData({
        destination: "",
        name: "",
        requestingOffice: "",
        status: "Pending",
        fromDate: "",
        fromTime: "",
        toDate: "",
        toTime: ""
      });
    };

    const filteredRequests = sortStatus === "All" 
      ? requests 
      : requests.filter(req => req.status === sortStatus);

    const formatDateTime = (date, time) => {
      if (!date) return "";
      const options = { month: 'short', day: 'numeric' };
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
                {/*SORT STYLING*/}
                <button
                  className="border border-gray-300 px-4 py-2 rounded-lg bg-white shadow-sm flex items-center gap-2 hover:bg-gray-50 transition-colors"
                  onClick={() => setShowSort(prev => !prev)}
                >
                  Sort
                  <ChevronDown className={`transition-transform ${showSort ? 'rotate-180' : ''}`} size={16} />
                </button>
                {showSort && (
                  <div className="absolute right-0 mt-2 w-36 bg-white border border-gray-200 rounded-lg shadow-lg z-10 overflow-hidden">
                    {["All", "Accept", "Decline", "Pending"].map((status) => (
                      <button
                        key={status}
                        className={`block w-full text-left px-4 py-2 hover:bg-gray-100 ${sortStatus === status ? 'bg-gray-100 font-medium' : ''}`}
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
      {/* Green Divider Line */}
      <hr className="border-green-500 mb-5 my-2" />

          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            {filteredRequests.length > 0 ? (
              <div className="divide-y divide-gray-200">
                {filteredRequests.map((req, idx) => (
                  <div key={idx} className="p-6 hover:bg-gray-50 transition-colors">
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-blue-50 rounded-lg text-blue-600">
                        <CalendarDays size={24} />
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-bold text-lg text-gray-800">{req.destination}</h3>
                            <p className="text-sm text-gray-600">{req.name}</p>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColors[req.status]}`}>
                            {req.status.toUpperCase()}
                          </span>
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

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-opacity-30 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-md relative">
              <div className="p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-4">Create New Request</h2>
                <form onSubmit={handleSubmit}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">From Date</label>
                      <div className="relative">
                        <input
                          type="date"
                          name="fromDate"
                          value={formData.fromDate}
                          onChange={handleInputChange}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">From Time</label>
                      <input
                        type="time"
                        name="fromTime"
                        value={formData.fromTime}
                        onChange={handleInputChange}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">To Date</label>
                      <input
                        type="date"
                        name="toDate"
                        value={formData.toDate}
                        onChange={handleInputChange}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">To Time</label>
                      <input
                        type="time"
                        name="toTime"
                        value={formData.toTime}
                        onChange={handleInputChange}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                    <button
                        type="button"
                        className="mt-2 p-1 text-black-500 absolute top-55 left-96 right-4 rounded-full"
                        onClick={() => setFormData(prev => ({ ...prev, name: '' }))}
                        aria-label="Clear"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <circle cx="12" cy="12" r="10" />
                          <line x1="12" y1="8" x2="12" y2="16" />
                          <line x1="8" y1="12" x2="16" y2="12" />
                        </svg>
                      </button>
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Destination</label>
                    <input
                      type="text"
                      name="destination"
                      value={formData.destination}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>

                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Requesting Office</label>
                    <div className="relative">
                      <button
                        type="button"
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-left flex justify-between items-center focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        onClick={() => setShowOfficeDropdown(!showOfficeDropdown)}
                      >
                        {formData.requestingOffice || "Select an office"}
                        <ChevronDown size={16} className={`text-gray-400 transition-transform ${showOfficeDropdown ? 'rotate-180' : ''}`} />
                      </button>
                      {showOfficeDropdown && (
                        <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-auto">
                          {officeOptions.map((office) => (
                            <div
                              key={office}
                              className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                              onClick={() => {
                                setFormData(prev => ({ ...prev, requestingOffice: office }));
                                setShowOfficeDropdown(false);
                              }}
                            >
                              {office}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex justify-end gap-3">
                    <button
                      type="button"
                      className="px-4 py-2 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                      onClick={() => setShowModal(false)}
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
                onClick={() => setShowModal(false)}
                aria-label="Close"
              >
                <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  export default Client_Requests;