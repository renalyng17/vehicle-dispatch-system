import { useLocation } from "react-router-dom";
import { useState, useEffect } from "react";

function Requests() {
  const location = useLocation();
  const { newRequest, action } = location.state || {};

  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState(null);

  // 🌐 FETCH REQUESTS FROM BACKEND
  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/requests');
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();

        // ✅ Normalize data to match UI expectations
        const normalizedData = data.map(req => ({
          ...req,
          name: req.names?.[0] || 'Unknown',           // Use first name as requester
          department: req.requestingOffice || 'N/A',   // Rename field for consistency
          status: req.status === "Decline" ? "Declined" : req.status, // Standardize display
        }));

        setRequests(normalizedData);
      } catch (error) {
        console.error("Failed to fetch requests:", error);
        // Fallback to localStorage
        const saved = localStorage.getItem('vehicleRequests');
        if (saved) setRequests(JSON.parse(saved));
        else alert("Failed to load requests from server.");
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, []);

  // 🔁 SYNC WITH LOCALSTORAGE (optional cache/fallback)
  useEffect(() => {
    localStorage.setItem('vehicleRequests', JSON.stringify(requests));
  }, [requests]);

  // 🚫 PREVENT PAGE SCROLL
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    document.body.style.position = 'fixed';
    document.body.style.width = '100%';
    return () => {
      document.body.style.overflow = 'auto';
      document.body.style.position = '';
      document.body.style.width = '';
    };
  }, []);

  // 🚫 ALSO PREVENT SCROLL WHEN NOTIFICATION IS VISIBLE
  useEffect(() => {
    if (notification) {
      document.body.style.overflow = 'hidden';
    }
  }, [notification]);

  // ➕ HANDLE NEW ACCEPTED/DECLINED REQUEST — UPDATE VIA BACKEND
  useEffect(() => {
    if (newRequest && newRequest.id) {
      const updateRequestStatus = async () => {
        try {
          // Prepare payload for backend
          const payload = {
            status: action === 'accept' ? 'Accepted' : 'Declined',
            processedDate: new Date().toISOString().split('T')[0], // Match backend format
          };

          // If accepted, include driver/vehicle (if available in newRequest)
          if (action === 'accept') {
            payload.driver = newRequest.driver || "Not Assigned";
            payload.vehicleType = newRequest.vehicleType || "Not Assigned";
            payload.plateNo = newRequest.plateNo || "Not Assigned";
          }

          // Send PUT request to update status
          const response = await fetch(`http://localhost:3001/api/requests/${newRequest.id}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
          });

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to update request');
          }

          const updatedRequest = await response.json();

          // Normalize updated request too
          const normalizedUpdated = {
            ...updatedRequest,
            name: updatedRequest.names?.[0] || 'Unknown',
            department: updatedRequest.requestingOffice || 'N/A',
            status: updatedRequest.status === "Decline" ? "Declined" : updatedRequest.status,
          };

          // ✅ Update local state with fresh data from backend
          setRequests(prev => 
            prev.map(req => 
              req.id === normalizedUpdated.id ? normalizedUpdated : req
            )
          );

          // ✅ Show notification
          setNotification({
            type: action === 'accept' ? 'success' : 'error',
            message: `Request ${action === 'accept' ? 'accepted' : 'declined'} successfully`
          });

          setTimeout(() => setNotification(null), 3000);

        } catch (error) {
          console.error("Error updating transaction:", error);
          alert(`Failed to record transaction: ${error.message}`);
        }

        // Clear location state to prevent re-submission on refresh
        window.history.replaceState({}, document.title);
      };

      updateRequestStatus();
    }
  }, [newRequest, action]);

  // 🌀 SHOW LOADING STATE
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-xl text-gray-600 flex flex-col items-center">
          <svg className="animate-spin h-8 w-8 mb-4 text-green-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Loading vehicle requests...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 md:p-8 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div>
            <h1 className="text-3xl font-bold mb-6 text-gray-800">Request List</h1>
          </div>

          {notification && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className={`px-6 py-4 rounded-lg shadow-lg max-w-sm w-full bg-white ${
                notification.type === 'success'
                  ? 'border-l-4 border-green-500'
                  : 'border-l-4 border-red-500'
              }`}>
                <div className="flex items-center">
                  <div className={`mr-3 flex-shrink-0 ${
                    notification.type === 'success' ? 'text-green-500' : 'text-red-500'
                  }`}>
                    {notification.type === 'success' ? (
                      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    ) : (
                      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">
                      {notification.message}
                    </h3>
                  </div>
                </div>
              </div> 
            </div>
          )}
        </div>

        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-green-600">
                <tr className="border-b border-gray-200">
                  <th className="py-3 px-6 text-left text-xs font-medium text-white uppercase tracking-wider">Requester</th>
                  <th className="py-3 px-6 text-left text-xs font-medium text-white uppercase tracking-wider">Department</th>
                  <th className="py-3 px-6 text-left text-xs font-medium text-white uppercase tracking-wider">Vehicle</th>
                  <th className="py-3 px-6 text-left text-xs font-medium text-white uppercase tracking-wider">Date & Time</th>
                  <th className="py-3 px-6 text-left text-xs font-medium text-white uppercase tracking-wider">Status & Details</th>
                </tr>
              </thead>
            </table>

            {/* 👇 FIXED: No more cutoff — responsive height */}
            <div className="max-h-[calc(100vh-240px)] overflow-y-auto pr-2 custom-scroll">
              <table className="w-full">
                <tbody className="divide-y divide-green-600">
                  {requests.map((req) => (
                    <tr key={req.id} className="hover:bg-green-100 transition-colors">
                      <td className="py-4 px-6">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-500">
                            {req.name?.charAt(0) || '?'}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{req.name}</div>
                            <div className="text-sm text-gray-500">{req.destination || 'N/A'}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-sm text-gray-600">{req.department}</td>
                      <td className="py-4 px-6 text-sm text-gray-600">
                        {req.vehicleType && req.plateNo 
                          ? `${req.vehicleType} (${req.plateNo})`
                          : req.vehicle || 'Not Assigned'}
                      </td>
                      <td className="py-4 px-6 text-sm text-gray-600">
                        <div className="flex flex-col">
                          <span className="font-medium">
                            {req.fromDate 
                              ? new Date(req.fromDate).toLocaleDateString("en-US", {
                                  month: "short",
                                  day: "numeric",
                                  year: "numeric"
                                })
                              : 'Invalid Date'}
                            {req.toDate && req.toDate !== req.fromDate && (
                              <span className="font-normal">
                                {" "} - {new Date(req.toDate).toLocaleDateString("en-US", {
                                  month: "short",
                                  day: "numeric"
                                })}
                              </span>
                            )}
                          </span>
                          <span className="text-gray-500">
                            {req.fromTime || 'N/A'} → {req.toTime || 'N/A'}
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex flex-col gap-1.5">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium w-fit ${
                            req.status === "Accepted"
                              ? "bg-green-100 text-green-800"
                              : req.status === "Declined"
                              ? "bg-red-100 text-red-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}>
                            {req.status}
                          </span>
                          <div className="text-xs text-gray-600 leading-tight">
                            <span className="font-medium text-gray-700">By:</span> {req.name} • {req.department}
                          </div>
                          {req.status !== "Pending" && req.processedDate && (
                            <div className="text-xs text-gray-600 leading-tight">
                              <span className="font-medium text-gray-700">
                                {req.status === "Accepted" ? "Accepted" : "Declined"} on:
                              </span>{" "}
                              {new Date(req.processedDate).toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              })}
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {requests.length === 0 && (
            <div className="p-12 text-center">
              <h3 className="text-lg font-medium text-gray-900">No requests</h3>
              <p className="mt-1 text-sm text-gray-500">Get started by approving new vehicle requests.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Requests;