// src/pages/Client/ClientHome.jsx
import { useEffect, useState } from "react";
import {
  CalendarCheck2,
  CalendarClock,
  ChevronRight,
  MapPin,
  Clock,
  User,
  Car,
  AlertCircle,
  RefreshCw
} from "lucide-react";
import { useTimeAgo } from "../../hooks/useTimeAgo";
import { formatDate, getStatusColor } from "../../utils/dateUtils";

function RequestItem({ request }) {
  const timeAgo = useTimeAgo(request.date);

  return (
    <div className="border-b border-gray-100 pb-5 last:border-b-0 last:pb-0">
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
            <span>{timeAgo}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ClientHome() {
  const [recentRequests, setRecentRequests] = useState([]);
  const [upcomingTrips, setUpcomingTrips] = useState([]);
  const [stats, setStats] = useState({
    totalRequests: 0,
    pendingApproval: 0,
    completedTrips: 0,
    thisMonth: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('http://localhost:3001/api/requests');
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      
      const allRequests = await response.json();

      const now = new Date();
      const currentYear = now.getFullYear();
      const currentMonth = now.getMonth();

      setStats({
        totalRequests: allRequests.length,
        pendingApproval: allRequests.filter(req => req.status === "Pending").length,
        completedTrips: allRequests.filter(req => req.status === "Accepted").length,
        thisMonth: allRequests.filter(req => {
          if (req.status !== "Accepted" || !req.created_at) return false;
          const createdAt = new Date(req.created_at);
          return createdAt.getFullYear() === currentYear && createdAt.getMonth() === currentMonth;
        }).length
      });

      const sortedRequests = [...allRequests]
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
        .slice(0, 3)
        .map(req => ({
          id: req.id,
          status: req.status === "Accepted" ? "approved" : 
                 req.status === "Pending" ? "pending" : "completed",
          destination: req.destination || "—",
          date: req.created_at
        }));

      setRecentRequests(sortedRequests);

      const trips = allRequests
        .filter(req => 
          req.status === "Accepted" && 
          req.fromDate && 
          new Date(req.fromDate) > new Date()
        )
        .sort((a, b) => new Date(a.fromDate) - new Date(b.fromDate))
        .map(req => ({
          id: req.id,
          status: "Confirmed",
          destination: req.destination || "—",
          date: req.fromDate + "T" + (req.fromTime || "00:00"),
          car: `${req.vehicleType} (${req.plateNo})`,
          driver: req.driver || "TBD"
        }))
        .slice(0, 3);

      setUpcomingTrips(trips);
      setLoading(false);
    } catch (err) {
      console.error('Fetch error:', err);
      setError(err.message || 'Failed to load data');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  if (error) {
    return (
      <div className="bg-[#F9FFF5] min-h-screen p-6">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6 flex items-center">
          <AlertCircle className="w-6 h-6 mr-2" />
          <span>Error: {error}</span>
        </div>
        <h1 className="text-3xl font-bold mb-6">Home</h1>
      </div>
    );
  }

  return (
    <div className="bg-[#F9FFF5] min-h-screen p-6">
      <h1 className="text-3xl font-bold mb-6">Home</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow p-6">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-500 text-sm">Total Requests</p>
              <h2 className="text-3xl font-bold mt-1">{stats.totalRequests}</h2>
            </div>
            <div className="bg-blue-100 p-2 rounded-lg">
              <CalendarCheck2 className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow p-6">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-500 text-sm">Pending Approval</p>
              <h2 className="text-3xl font-bold mt-1">{stats.pendingApproval}</h2>
            </div>
            <div className="bg-yellow-100 p-2 rounded-lg">
              <CalendarClock className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow p-6">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-500 text-sm">Approved Trips</p>
              <h2 className="text-3xl font-bold mt-1">{stats.completedTrips}</h2>
            </div>
            <div className="bg-green-100 p-2 rounded-lg">
              <CalendarCheck2 className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow p-6">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-500 text-sm">This Month</p>
              <h2 className="text-3xl font-bold mt-1">{stats.thisMonth}</h2>
            </div>
            <div className="bg-purple-100 p-2 rounded-lg">
              <CalendarCheck2 className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Requests */}
        <div className="bg-white rounded-xl shadow p-6 flex flex-col min-h-[400px]">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Recent Requests</h2>
            <button 
              onClick={fetchData}
              className="text-blue-600 hover:text-blue-800"
              title="Refresh"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
          
          {loading ? (
            <div className="flex-1 flex items-center justify-center">
              <RefreshCw className="w-6 h-6 animate-spin text-green-600" />
            </div>
          ) : recentRequests.length === 0 ? (
            <div className="flex-1 flex items-center justify-center">
              <p className="text-gray-500 text-center py-4">No recent requests</p>
            </div>
          ) : (
            <div className="space-y-5">
              {recentRequests.map((request) => (
                <RequestItem key={request.id} request={request} />
              ))}
            </div>
          )}
        </div>

        {/* Upcoming Trips */}
        <div className="bg-white rounded-xl shadow p-6 flex flex-col min-h-[400px]">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Upcoming Trips</h2>
            <button 
              onClick={fetchData}
              className="text-blue-600 hover:text-blue-800"
              title="Refresh"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
          
          {loading ? (
            <div className="flex-1 flex items-center justify-center">
              <RefreshCw className="w-6 h-6 animate-spin text-green-600" />
            </div>
          ) : upcomingTrips.length === 0 ? (
            <div className="flex-1 flex items-center justify-center">
              <p className="text-gray-500 text-center py-4">No upcoming trips</p>
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