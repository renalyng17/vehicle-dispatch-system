import React, { useState } from "react";
import { FaSuitcase } from "react-icons/fa";

const statusColors = {
  Pending: "bg-orange-100 text-orange-700",
  Decline: "bg-red-100 text-red-700",
  Accept: "bg-green-100 text-green-700",
};

function Client_Requests() {
  const [showSort, setShowSort] = useState(false);
  const [sortStatus, setSortStatus] = useState("All");
  const [showModal, setShowModal] = useState(false);
  const [requests, setRequests] = useState([]);
  const [formData, setFormData] = useState({
    destination: "",
    date: "",
    time: "",
    name: "",
    requestingOffice: "",
    status: "Pending", // Default status for new requests
    fromDate: "",
    fromTime: "",
    toDate: "",
    toTime: ""
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newRequest = {
      destination: formData.destination,
      date: formData.toDate,
      time: formData.toTime,
      status: formData.status,
      name: formData.name,
      requestingOffice: formData.requestingOffice
    };
    
    setRequests(prev => [...prev, newRequest]);
    setShowModal(false);
    // Reset form
    setFormData({
      destination: "",
      date: "",
      time: "",
      name: "",
      requestingOffice: "",
      status: "Pending",
      fromDate: "",
      fromTime: "",
      toDate: "",
      toTime: ""
    });
  };

  const filteredRequests =
    sortStatus === "All"
      ? requests
      : requests.filter((req) => req.status === sortStatus);

  return (
    <div className="min-h-screen bg-white">
      <div className="flex justify-between items-center pt-8 px-8">
        <h1 className="text-3xl font-bold">Request</h1>
        <div className="flex gap-4 items-center">
          <button
            className="bg-green-700 text-white px-4 py-2 rounded shadow font-semibold text-base hover:bg-green-800"
            onClick={() => setShowModal(true)}
          >
            Create a Request
          </button>
          <div className="relative">
            <button
              className="border px-4 py-2 rounded bg-white shadow-sm flex items-center gap-2"
              onClick={() => setShowSort((prev) => !prev)}
            >
              Sort
              <svg
                className="w-4 h-4 ml-1"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {showSort && (
              <div className="absolute right-0 mt-2 w-36 bg-white border rounded shadow z-10">
                <button
                  className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                  onClick={() => {
                    setSortStatus("All");
                    setShowSort(false);
                  }}
                >
                  All
                </button>
                <button
                  className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                  onClick={() => {
                    setSortStatus("Accept");
                    setShowSort(false);
                  }}
                >
                  Accept
                </button>
                <button
                  className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                  onClick={() => {
                    setSortStatus("Decline");
                    setShowSort(false);
                  }}
                >
                  Decline
                </button>
                <button
                  className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                  onClick={() => {
                    setSortStatus("Pending");
                    setShowSort(false);
                  }}
                >
                  Pending
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      <hr className="border-green-500 mt-2 mb-6 mx-8" />

      <div className="flex flex-col gap-6 px-8">
        {filteredRequests.length > 0 ? (
          filteredRequests.map((req, idx) => (
            <div
              key={idx}
              className="flex items-center bg-white border rounded-lg shadow-sm px-6 py-4 gap-4"
            >
              <FaSuitcase className="text-4xl text-gray-700" />
              <div className="flex-1">
                <div className="font-bold text-lg">{req.destination}</div>
                <div className="text-sm text-gray-600">
                  {new Date(req.date).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "2-digit",
                  })}
                </div>
                <div className="text-sm text-gray-600">{req.time}</div>
              </div>
              <span
                className={`ml-4 px-4 py-1 rounded font-semibold text-sm ${statusColors[req.status]}`}
              >
                {req.status.toUpperCase()}
              </span>
            </div>
          ))
        ) : (
          <div className="text-center py-8 text-gray-500">
            No requests found. Create your first request!
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-lg relative">
            <h2 className="text-xl font-bold mb-4">Create a Request</h2>
            <form onSubmit={handleSubmit}>
              <div className="flex gap-4 mb-4">
                <div className="flex-1">
                  <label className="block text-sm mb-1">To</label>
                  <input 
                    type="date" 
                    name="toDate"
                    value={formData.toDate}
                    onChange={handleInputChange}
                    className="w-full border rounded px-2 py-1 mb-2" 
                    required
                  />
                  <label className="block text-sm mb-1">Time</label>
                  <input 
                    type="time" 
                    name="toTime"
                    value={formData.toTime}
                    onChange={handleInputChange}
                    className="w-full border rounded px-2 py-1" 
                    required
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-sm mb-1">From</label>
                  <input 
                    type="date" 
                    name="fromDate"
                    value={formData.fromDate}
                    onChange={handleInputChange}
                    className="w-full border rounded px-2 py-1 mb-2" 
                    required
                  />
                  <label className="block text-sm mb-1">Time</label>
                  <input 
                    type="time" 
                    name="fromTime"
                    value={formData.fromTime}
                    onChange={handleInputChange}
                    className="w-full border rounded px-2 py-1" 
                    required
                  />
                </div>
              </div>
              <div className="mb-2">
                <label className="block text-sm mb-1">Name</label>
                <input 
                  type="text" 
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full border rounded px-2 py-1" 
                  required
                />
              </div>
              <div className="mb-2">
                <label className="block text-sm mb-1">Destination</label>
                <input 
                  type="text" 
                  name="destination"
                  value={formData.destination}
                  onChange={handleInputChange}
                  className="w-full border rounded px-2 py-1" 
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm mb-1">Requesting Office</label>
                <input 
                  type="text" 
                  name="requestingOffice"
                  value={formData.requestingOffice}
                  onChange={handleInputChange}
                  className="w-full border rounded px-2 py-1" 
                  required
                />
              </div>
              <div className="flex justify-end gap-4">
                <button
                  type="button"
                  className="border px-6 py-2 rounded shadow bg-white font-semibold"
                  onClick={() => setShowModal(false)}
                >
                  Discard
                </button>
                <button
                  type="submit"
                  className="bg-green-700 text-white px-6 py-2 rounded shadow font-semibold hover:bg-green-800"
                >
                  Create a Request
                </button>
              </div>
            </form>
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-2xl"
              onClick={() => setShowModal(false)}
              aria-label="Close"
            >
              &times;
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Client_Requests;