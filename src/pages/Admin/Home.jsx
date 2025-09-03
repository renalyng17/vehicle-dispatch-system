import { useEffect, useState } from "react";
import { CalendarCheck2, CalendarClock, ChevronRight, Clock, User, Car, RefreshCw, AlertCircle } from "lucide-react";

export default function Client_Home() {
  const [recentRequests, setRecentRequests] = useState([]);
  const [vehicleStatus, setVehicleStatus] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Prevent page scroll
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  // Fetch data from database
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // In a real application, these would be actual API endpoints
        // For demo purposes, we'll use the mock data directly
        setTimeout(() => {
          setRecentRequests([
            { 
              id: "TR-001", 
              status: "approved", 
              destination: "Airport Terminal 3", 
              passenger: "John Smith",
              timeAgo: "2 hours ago"
            },
            { 
              id: "TR-002", 
              status: "pending", 
              destination: "Downtown Office", 
              passenger: "Sarah Wilson",
              timeAgo: "4 hours ago"
            },
            { 
              id: "TR-003", 
              status: "completed", 
              destination: "Client Meeting - Plaza", 
              passenger: "Mike Johnson",
              timeAgo: "1 day ago"
            }
          ]);
          setVehicleStatus([
            { 
              id: "V-101", 
              status: "available", 
              model: "Toyota Camry", 
              driver: "Robert Chen",
              fuel: 85
            },
            { 
              id: "V-102", 
              status: "in use", 
              model: "Honda Civic", 
              driver: "Maria Garcia",
              fuel: 62
            },
            { 
              id: "V-103", 
              status: "maintenance", 
              model: "Ford Explorer", 
              driver: "Unassigned",
              fuel: 95
            }
          ]);
          setLoading(false);
        }, 1000);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching data:', err);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Helper function to determine status color
  const getStatusColor = (status) => {
    switch(status.toLowerCase()) {
      case 'approved':
      case 'completed':
      case 'available':
        return 'text-green-600 bg-green-100 px-2 py-1 rounded-full text-xs';
      case 'pending':
        return 'text-yellow-600 bg-yellow-100 px-2 py-1 rounded-full text-xs';
      case 'in use':
        return 'text-blue-600 bg-blue-100 px-2 py-1 rounded-full text-xs';
      case 'maintenance':
        return 'text-red-600 bg-red-100 px-2 py-1 rounded-full text-xs';
      default:
        return 'text-gray-600 bg-gray-100 px-2 py-1 rounded-full text-xs';
    }
  };



  if (error) {
    return (
      <div className="bg-[#F9FFF5] min-h-screen p-6">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6 flex items-center">
          <AlertCircle className="w-6 h-6 mr-2" />
          <span>Error: {error}. Please try again.</span>
        </div>
        <h1 className="text-3xl font-bold mb-6">Home</h1>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow p-5">
            <h2 className="text-xl font-semibold mb-4">Recent Travel Requests</h2>
            <p className="text-gray-500">Unable to load recent requests</p>
          </div>
          <div className="bg-white rounded-lg shadow p-5">
            <h2 className="text-xl font-semibold mb-4">Vehicle Status</h2>
            <p className="text-gray-500">Unable to load vehicle status</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#F9FFF5] min-h-screen p-6">
      <h1 className="text-3xl font-bold mb-6">Home</h1>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {/* Total Requests Card */}
        <div className="bg-white rounded-xl shadow p-6">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-500 text-sm">Total Requests</p>
              <h2 className="text-3xl font-bold mt-1">12</h2>
            </div>
            <div className="bg-blue-100 p-2 rounded-lg">
              <CalendarCheck2 className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        {/* Pending Approval Card */}
        <div className="bg-white rounded-xl shadow p-6">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-500 text-sm">Pending Approval</p>
              <h2 className="text-3xl font-bold mt-1">3</h2>
            </div>
            <div className="bg-yellow-100 p-2 rounded-lg">
              <CalendarClock className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </div>

        {/* Completed Trips Card */}
        <div className="bg-white rounded-xl shadow p-6">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-500 text-sm">Completed Trips</p>
              <h2 className="text-3xl font-bold mt-1">8</h2>
            </div>
            <div className="bg-green-100 p-2 rounded-lg">
              <CalendarCheck2 className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        {/* This Month Card */}
        <div className="bg-white rounded-xl shadow p-6">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-500 text-sm">This Month</p>
              <h2 className="text-3xl font-bold mt-1">5</h2>
            </div>
            <div className="bg-purple-100 p-2 rounded-lg">
              <CalendarCheck2 className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Travel Requests */}
        <div className="bg-white rounded-xl shadow p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-xl font-semibold">Recent Travel Requests</h2>
              <p className="text-gray-500 text-sm">Latest travel requests and their current status</p>
            </div>
            <button className="text-green-600 text-sm font-medium flex items-center">
              View All <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          
          {recentRequests.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No recent requests found</p>
          ) : (
            <div className="space-y-4">
              {recentRequests.map((request) => (
                <div key={request.id} className="border-b border-gray-100 pb-4 last:border-b-0 last:pb-0">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <span className="font-medium text-gray-900">{request.id}</span>
                        <span className={getStatusColor(request.status)}>
                          {request.status}
                        </span>
                      </div>
                      <div className="text-sm text-gray-600 mb-1">
                        {request.destination}
                      </div>
                      <div className="text-sm text-gray-600">
                        {request.passenger}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-gray-500 whitespace-nowrap">
                        {request.timeAgo}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Vehicle Status */}
        <div className="bg-white rounded-xl shadow p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-xl font-semibold">Vehicle Status</h2>
              <p className="text-gray-500 text-sm">Current status and assignments of your vehicle fleet</p>
            </div>
          </div>
          
          {vehicleStatus.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No vehicle status found</p>
          ) : (
            <div className="space-y-4">
              {vehicleStatus.map((vehicle) => (
                <div key={vehicle.id} className="border-b border-gray-100 pb-4 last:border-b-0 last:pb-0">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <span className="font-medium text-gray-900">{vehicle.id}</span>
                        <span className={getStatusColor(vehicle.status)}>
                          {vehicle.status}
                        </span>
                      </div>
                      <div className="text-sm text-gray-600 mb-1">
                        {vehicle.model}
                      </div>
                      <div className="text-sm text-gray-600">
                        {vehicle.driver}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium text-gray-900 whitespace-nowrap">
                        Fuel: {vehicle.fuel}%
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}