import { useLocation } from "react-router-dom";
import { useState, useEffect } from "react";

function Requests() {
  const location = useLocation();
  const { newRequest, action } = location.state || {};

  const [requests, setRequests] = useState(() => {
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
        name: "Jane Smith",
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

  //  Removed scroll button logic since scroll is disabled

  //  Prevent scroll on full page always
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

  //  Prevent scroll when notification appears (still included for safety)
  useEffect(() => {
    if (notification) {
      document.body.style.overflow = 'hidden';
    }
  }, [notification]);

  useEffect(() => {
    localStorage.setItem('vehicleRequests', JSON.stringify(requests));
  }, [requests]);

  useEffect(() => {
    if (newRequest) {
      const requestWithId = {
        ...newRequest,
        id: Date.now().toString(),
        status: action === 'accept' ? 'Accepted' : 'Declined'
      };

      setRequests(prevRequests => {
        const exists = prevRequests.some(req =>
          req.id === requestWithId.id ||
          (req.name === requestWithId.name &&
            req.date === requestWithId.date)
        );

        if (!exists) {
          setNotification({
            type: action === 'accept' ? 'success' : 'error',
            message: `Request ${action === 'accept' ? 'accepted' : 'declined'} successfully`
          });

          setTimeout(() => setNotification(null), 3000);
          return [requestWithId, ...prevRequests];
        }
        return prevRequests;
      });

      window.history.replaceState({}, document.title);
    }
  }, [newRequest, action]);

  return (
    
    <div className="min-h-screen p-4 md:p-8 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div>
           <h1 className="text-3xl font-bold mb-6 text-gray-800">Request List</h1>
            <p className="text-gray-500 mt-1">Manage all vehicle reservation requests</p>
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
                  <th className="py-3 px-6 text-left text-xs font-medium text-white -500 uppercase tracking-wider">Requester</th>
                  <th className="py-3 px-6 text-left text-xs font-medium text-white -500 uppercase tracking-wider">Department</th>
                  <th className="py-3 px-6 text-left text-xs font-medium text-white -500 uppercase tracking-wider">Vehicle</th>
                  <th className="py-3 px-6 text-left text-xs font-medium text-white -500 uppercase tracking-wider">Date & Time</th>
                  <th className="py-3 px-6 text-left text-xs font-medium text-white -500 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-green-600">
                {requests.map((req) => (
                  <tr key={req.id} className="hover:bg-green-100 transition-colors">
                    <td className="py-4 px-6">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-500">
                          {req.name.charAt(0)}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{req.name}</div>
                          <div className="text-sm text-gray-500">{req.destination}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-sm text-gray-600">{req.department}</td>
                    <td className="py-4 px-6 text-sm text-gray-600">{req.vehicle}</td>
                    <td className="py-4 px-6 text-sm text-gray-600">
                      <div className="flex flex-col">
                        <span className="font-medium">
                          {new Date(req.date).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric"
                          })}
                          {req.endDate && req.endDate !== req.date && (
                            <span className="font-normal">
                              {" "}- {new Date(req.endDate).toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric"
                              })}
                            </span>
                          )}
                        </span>
                        <span className="text-gray-500">{req.time}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        req.status === "Accepted"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}>
                        {req.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
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
