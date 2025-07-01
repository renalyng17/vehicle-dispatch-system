import React, { useState } from "react";
import { FaSuitcase } from "react-icons/fa";

const requestsData = [
  {
    destination: "Ninoy Aquino International Airport",
    date: "2025-06-05",
    time: "3:00 PM",
    status: "Pending",
  },
  {
    destination: "Ninoy Aquino International Airport",
    date: "2025-06-05",
    time: "3:00 PM",
    status: "Decline",
  },
  {
    destination: "Ninoy Aquino International Airport",
    date: "2025-06-05",
    time: "3:00 PM",
    status: "Accept",
  },
];

const statusColors = {
  Pending: "bg-orange-100 text-orange-700",
  Decline: "bg-red-100 text-red-700",
  Accept: "bg-green-100 text-green-700",
};

function Client_Requests() {
  const [showSort, setShowSort] = useState(false);
  const [sortStatus, setSortStatus] = useState("All");

  const filteredRequests =
    sortStatus === "All"
      ? requestsData
      : requestsData.filter((req) => req.status === sortStatus);

  return (
    <div className="min-h-screen bg-white">
      <div className="flex justify-between items-center pt-8 px-8">
        <h1 className="text-3xl font-bold">Request</h1>
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
      <hr className="border-green-500 mt-2 mb-6 mx-8" />

      <div className="flex flex-col gap-6 px-8">
        {filteredRequests.map((req, idx) => (
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
        ))}
      </div>

      <div className="fixed right-8 bottom-8">
        <button className="bg-green-700 text-white px-6 py-3 rounded shadow font-semibold text-lg hover:bg-green-800">
          Create a Request
        </button>
      </div>
    </div>
  );
}
export default Client_Requests;