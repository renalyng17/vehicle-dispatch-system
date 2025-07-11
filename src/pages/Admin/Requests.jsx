import { useLocation } from "react-router-dom";
import { useState, useEffect } from "react";

function Requests() {
  const location = useLocation();
  const { newRequest, action } = location.state || {};

  // Initialize state with default requests
  const [requests, setRequests] = useState(() => {
    // Load from localStorage if available, otherwise use defaults
    const savedRequests = localStorage.getItem('vehicleRequests');
    return savedRequests ? JSON.parse(savedRequests) : [
      {
        id: '1',
        name: "John Doe",
        department: "Logistics",
        vehicle: "Toyota Hilux",
        date: "2025-06-10",
        endDate: "2025-06-11",
        time: "09:00",
        destination: "Main Office",
        status: "Accepted",
        processedDate: "2025-06-08"
      },
      {
        id: '2',
        name: "Jane Smi",
        department: "Finance",
        vehicle: "Mitsubishi L300",
        date: "2025-06-09",
        endDate: "2025-06-09",
        time: "13:00",
        destination: "Client Site",
        status: "Declined",
        processedDate: "2025-06-07"
      }
    ];
  });

  const [notification, setNotification] = useState(null);

   // Prevent page scroll
        useEffect(() => {
          document.body.style.overflow = "hidden";
          return () => {
            document.body.style.overflow = "auto";
          };
      }, []);

  useEffect(() => {
    // Save requests to localStorage whenever they change
    localStorage.setItem('vehicleRequests', JSON.stringify(requests));
  }, [requests]);

  useEffect(() => {
    if (newRequest) {
      // Generate a unique ID for the new request
      const requestWithId = {
        ...newRequest,
        id: Date.now().toString(),
        status: action === 'accept' ? 'Accepted' : 'Declined'
      };

      // Add the new request to the state
      setRequests(prevRequests => {
        // Check if this request already exists to avoid duplicates
        const exists = prevRequests.some(req => 
          req.id === requestWithId.id || 
          (req.name === requestWithId.name && 
           req.date === requestWithId.date)
        );
        
        if (!exists) {
          // Show notification
          setNotification({
            type: action === 'accept' ? 'success' : 'error',
            message: `Request ${action === 'accept' ? 'accepted' : 'declined'} successfully`
          });
          
          // Clear notification after 3 seconds
          setTimeout(() => setNotification(null), 3000);
          
          // Add the new request to the beginning of the list
          return [requestWithId, ...prevRequests];
        }
        return prevRequests;
      });
      
      // Clear the location state to prevent duplicate additions on refresh
      window.history.replaceState({}, document.title);
    }
  }, [newRequest, action]);

  return (
    <div className="h-full bg-[#F9FFF5] overflow-auto">
      <div className="p-6 ml-1">
        <h1 className="text-3xl font-bold">Request List</h1>
        {notification && (
          <div className={`mt-2 p-2 rounded-md ${
            notification.type === 'success' 
              ? 'bg-green-100 text-green-800' 
              : 'bg-red-100 text-red-800'
          }`}>
            {notification.message}
          </div>
        )}
      </div>

      <div className="border rounded-lg overflow-auto border-gray-700 flex-1 mx-4 mb-4">
        <table className="w-full text-left border-collapse">
          <thead className="bg-green-700 text-white">
            <tr>
              <th className="py-3 px-4">Name</th>
              <th className="py-3 px-4">Office/Department</th>
              <th className="py-3 px-4">Vehicle Type</th>
              <th className="py-3 px-4">Travel Dates</th>
              <th className="py-3 px-4">Status</th>
            </tr>
          </thead>
          <tbody>
            {requests.map((req) => (
              <tr key={req.id} className="border-b border-gray-200 hover:bg-gray-50">
                <td className="py-3 px-4">{req.name}</td>
                <td className="py-3 px-4">{req.department}</td>
                <td className="py-3 px-4">{req.vehicle}</td>
                <td className="px-6 py-4">
                  {new Date(req.date).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "2-digit",
                  })}
                  {req.endDate && req.endDate !== req.date && (
                    <> - {new Date(req.endDate).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "2-digit",
                    })}</>
                  )}
                </td>
                <td className="py-3 px-4">
                  <span
                    className={`px-4 py-1 rounded-md text-sm font-medium ${
                      req.status === "Accepted"
                        ? "bg-green-300 text-green-900"
                        : "bg-rose-300 text-rose-900"
                    }`}
                  >
                    {req.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {requests.length === 0 && (
          <div className="p-4 text-center text-gray-500">
            No requests found
          </div>
        )}
      </div>
    </div>
  );
}

export default Requests;