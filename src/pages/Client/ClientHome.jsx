import { useEffect, useState } from "react";
import { CalendarCheck2, CalendarClock, ChevronRight, MapPin, Clock, User, Car } from "lucide-react";

export default function Client_Home() {
  const [recentRequests, setRecentRequests] = useState([]);
  const [upcomingTrips, setUpcomingTrips] = useState([]);

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
            { id: "TR-001", status: "approved", destination: "Airport Terminal 3", date: "2024-03-15 09:00" },
            { id: "TR-002", status: "pending", destination: "Downtown Office", date: "2024-03-15 14:00" },
            { id: "TR-003", status: "completed", destination: "Client Meeting - Plaza", date: "2024-03-16 10:00" }
          ]);
          setUpcomingTrips([
            { id: "TR-001", status: "Confirmed", destination: "Airport Terminal 3", date: "2024-03-15 09:00", car: "Toyota Camry (V-101)", driver: "Robert Chen" }
          ]);
          setStats({ accepted: 30, declined: 20, pending: 20 });
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

  // Helper function to format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }) + 
           " at " + 
           date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  // Helper function to determine status color
  const getStatusColor = (status) => {
    switch(status.toLowerCase()) {
      case 'approved':
      case 'completed':
      case 'confirmed':
        return 'text-green-600 bg-green-100 px-2 py-1 rounded-full text-xs';
      case 'pending':
        return 'text-yellow-600 bg-yellow-100 px-2 py-1 rounded-full text-xs';
      default:
        return 'text-gray-600 bg-gray-100 px-2 py-1 rounded-full text-xs';
    }
  };

  return (
    <div className="bg-[#F9FFF5] min-h-screen p-6">
      <h1 className="text-3xl font-bold mb-6">Home</h1>

      {/* Statistics Cards - Updated to match the image */}
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
        {/* Recent Requests */}
        <div className="bg-white rounded-xl shadow p-6 flex flex-col min-h-[400px]">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Recent Request</h2>
            <button className="text-green-600 text-sm font-medium flex items-center">
              View All <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          
          {recentRequests.length === 0 ? (
            <div className="flex-1 flex items-center justify-center">
              <p className="text-gray-500 text-center py-4">No recent requests found</p>
            </div>
          ) : (
            <div className="space-y-5">
              {recentRequests.map((request) => (
                <div key={request.id} className="border-b border-gray-100 pb-5 last:border-b-0 last:pb-0">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="font-medium text-gray-900">{request.id}</span>
                        <span className={getStatusColor(request.status)}>
                          {request.status}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                        <MapPin className="w-4 h-4" />
                        <span>{request.destination}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Clock className="w-4 h-4" />
                        <span>{formatDate(request.date)}</span>
                      </div>
                    </div>
                    <button className="text-green-600 hover:text-green-700 text-sm font-medium flex items-center">
                      Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Upcoming Trips */}
        <div className="bg-white rounded-xl shadow p-6 flex flex-col min-h-[400px]">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Upcoming Trips</h2>
            <button className="text-green-600 text-sm font-medium flex items-center">
              View All <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          
          {upcomingTrips.length === 0 ? (
            <div className="flex-1 flex items-center justify-center">
              <p className="text-gray-500 text-center py-4">No upcoming trips found</p>
            </div>
          ) : (
            <div className="space-y-5">
              {upcomingTrips.map((trip) => (
                <div key={trip.id} className="border-b border-gray-100 pb-5 last:border-b-0 last:pb-0">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="font-medium text-gray-900">{trip.id}</span>
                        <span className={getStatusColor(trip.status)}>
                          {trip.status}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                        <MapPin className="w-4 h-4" />
                        <span>{trip.destination}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
                        <Clock className="w-4 h-4" />
                        <span>{formatDate(trip.date)}</span>
                      </div>
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                          <Car className="w-4 h-4" />
                          <span>{trip.car}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <User className="w-4 h-4" />
                          <span>{trip.driver}</span>
                        </div>
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