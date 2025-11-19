// src/pages/Home.jsx
import { useEffect, useState } from "react";
import {
  CalendarCheck2,
  CalendarClock,
  ChevronRight,
  RefreshCw,
  AlertCircle
} from "lucide-react";
import { api } from "../../services/api";
import { useTimeAgo } from "../../hooks/useTimeAgo"; // ✅ CORRECT PATH// ✅ DEFINE getStatusColor ONCE — at module level
const getStatusColor = (status) => {
  switch (status?.toLowerCase()) {
    case 'accepted':
    case 'available':
      return 'text-green-600 bg-green-100 px-2 py-1 rounded-full text-xs';
    case 'pending':
      return 'text-yellow-600 bg-yellow-100 px-2 py-1 rounded-full text-xs';
    case 'declined':
    case 'maintenance':
      return 'text-red-600 bg-red-100 px-2 py-1 rounded-full text-xs';
    case 'in use':
      return 'text-blue-600 bg-blue-100 px-2 py-1 rounded-full text-xs';
    default:
      return 'text-gray-600 bg-gray-100 px-2 py-1 rounded-full text-xs';
  }
};

// ✅ RequestItem now uses the shared getStatusColor
function RequestItem({ request }) {
  const timeAgo = useTimeAgo(request.created_at);

  return (
    <div className="border-b border-gray-100 pb-4 last:border-b-0 last:pb-0">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-1">
            <span className="font-medium text-gray-900">{request.id}</span>
            <span className={getStatusColor(request.status)}>
              {request.status}
            </span>
          </div>
          <div className="text-sm text-gray-600 mb-1">{request.destination}</div>
          <div className="text-sm text-gray-600">{request.passenger}</div>
        </div>
        <div className="text-right">
          <div className="text-sm text-gray-500 whitespace-nowrap">
            {timeAgo}
          </div>
        </div>
      </div>
    </div>
  );
}

// Main Home Component
export default function Home() {
  const [recentRequests, setRecentRequests] = useState([]);
  const [vehicleStatus, setVehicleStatus] = useState([]);
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

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [allRequests, vehicles] = await Promise.all([
          api.getRequests(),
          api.getVehicles()
        ]);

        const now = new Date();
        const currentYear = now.getFullYear();
        const currentMonth = now.getMonth();
        const totalRequests = allRequests.length;
        const pendingApproval = allRequests.filter(req => req.status === "Pending").length;
        const completedTrips = allRequests.filter(req => req.status === "Accepted").length;
        const thisMonth = allRequests.filter(req => {
          if (req.status !== "Accepted" || !req.created_at) return false;
          const createdAt = new Date(req.created_at);
          return createdAt.getFullYear() === currentYear && createdAt.getMonth() === currentMonth;
        }).length;

        setStats({ totalRequests, pendingApproval, completedTrips, thisMonth });

        const sortedRequests = [...allRequests]
          .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
          .slice(0, 3);
        setRecentRequests(sortedRequests);

   setVehicleStatus(vehicles.map(v => ({
  plateNo: v.plateNo,
  status: v.currentStatus || 'available',
  model: v.vehicleType,
  driver: v.currentDriver || 'Unassigned',
  totalSeats: v.totalSeats || v.capacity,
  availableSeats: v.availableSeats || (v.capacity ?? 4)
})));

        setLoading(false);
      } catch (err) {
        setError(err.message || 'Failed to load dashboard data');
        console.error('Fetch error:', err);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const vehicles = await api.getVehicles();
       setVehicleStatus(vehicles.map(v => ({
  plateNo: v.plateNo,
  status: v.currentStatus || 'available',
  model: v.vehicleType,
  driver: v.currentDriver || 'Unassigned',
  totalSeats: v.totalSeats || v.capacity,
  availableSeats: v.availableSeats || (v.capacity ?? 4)
})));
      } catch (err) {
        console.warn('Auto-refresh failed:', err.message);
      }
    }, 20000);
    return () => clearInterval(interval);
  }, []);

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

  if (loading) {
    return (
      <div className="bg-[#F9FFF5] min-h-screen p-6 flex items-center justify-center">
        <div className="flex flex-col items-center">
          <RefreshCw className="w-8 h-8 animate-spin text-green-600 mb-2" />
          <span className="text-gray-600">Loading dashboard...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#F9FFF5] min-h-screen p-6">
      <h1 className="text-3xl font-bold mb-6">Home</h1>

      {/* Stats */}
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
              <p className="text-gray-500 text-sm">Completed Trips</p>
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
        <div className="bg-white rounded-xl shadow p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-xl font-semibold">Recent Travel Requests</h2>
              <p className="text-gray-500 text-sm">Latest travel requests and their current status</p>
            </div>
            <button className="text-green-600 text-sm font-medium flex items-center">
              View All <ChevronRight className="w-4 h-4 ml-1" />
            </button>
          </div>
          {recentRequests.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No recent requests found</p>
          ) : (
            <div className="space-y-4">
              {recentRequests.map((request) => (
                <RequestItem key={request.id} request={request} />
              ))}
            </div>
          )}
        </div>

        {/* Vehicle Status */}
        <div className="bg-white rounded-xl shadow p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-xl font-semibold">Vehicle Status</h2>
              <p className="text-gray-500 text-sm">Real-time status of your fleet</p>
            </div>
            <button 
              onClick={async () => {
                try {
                  const vehicles = await api.getVehicles();
                 setVehicleStatus(vehicles.map(v => ({
  plateNo: v.plateNo,
  status: v.currentStatus || 'available',
  model: v.vehicleType,
  driver: v.currentDriver || 'Unassigned',
  totalSeats: v.totalSeats || v.capacity,
  availableSeats: v.availableSeats || (v.capacity ?? 4)
})));
                } catch (err) {
                  console.error('Vehicle refresh failed:', err);
                  setError('Failed to refresh vehicles');
                }
              }}
              className="text-blue-600 hover:text-blue-800"
              title="Refresh"
            >
              <RefreshCw className="w-5 h-5" />
            </button>
          </div>
          {vehicleStatus.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No vehicles found</p>
          ) : (
            <div className="space-y-4">
              {vehicleStatus.map((vehicle) => (
  <div key={vehicle.plateNo} className="border-b border-gray-100 pb-4 last:border-b-0 last:pb-0">
    <div className="flex justify-between items-start">
      <div className="flex-1">
        <div className="flex items-center gap-3 mb-1">
          <span className="font-medium text-gray-900">{vehicle.plateNo}</span>
          <span className={getStatusColor(vehicle.status)}>
            {vehicle.status}
          </span>
        </div>
        <div className="text-sm text-gray-600 mb-1">{vehicle.model}</div>
        <div className="text-sm text-gray-600">
          Driver: {vehicle.driver}
        </div>
      </div>
      <div className="text-right">
        <div className="text-sm font-medium text-gray-900 whitespace-nowrap">
          {vehicle.availableSeats}/{vehicle.totalSeats} seats
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