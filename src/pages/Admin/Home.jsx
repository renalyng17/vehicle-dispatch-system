import { useEffect, useState } from "react";
import {
  CalendarCheck2,
  CalendarClock,
  RefreshCw,
  AlertCircle,
  MapPin,
  Clock,
  Car
} from "lucide-react";
import { api } from "../../services/api";
import { useTimeAgo } from "../../hooks/useTimeAgo";

// Shared status styling
const getStatusColor = (status) => {
  switch (status?.toLowerCase()) {
    case 'accepted':
    case 'approved':
    case 'available':
      return 'text-green-600 bg-green-100 px-2 py-1 rounded-full text-xs';
    case 'pending':
      return 'text-yellow-600 bg-yellow-100 px-2 py-1 rounded-full text-xs';
    case 'declined':
    case 'maintenance':
    case 'unavailable':
      return 'text-red-600 bg-red-100 px-2 py-1 rounded-full text-xs';
    case 'in use':
      return 'text-blue-600 bg-blue-100 px-2 py-1 rounded-full text-xs';
    default:
      return 'text-gray-600 bg-gray-100 px-2 py-1 rounded-full text-xs';
  }
};

// Helper: Determine real-time display status
const getDisplayStatus = (vehicle) => {
  if (vehicle.currentDriver && vehicle.currentStatus !== 'available') {
    return 'Unavailable';
  }
  return vehicle.currentStatus || 'available';
};

// ✅ Fixed RequestItem: no conditional hook call
function RequestItem({ request }) {
  // Safely normalize date for useTimeAgo
  const safeDate = (() => {
    if (!request.created_at) return new Date().toISOString();
    try {
      const d = new Date(request.created_at);
      return isNaN(d.getTime()) ? new Date().toISOString() : request.created_at;
    } catch {
      return new Date().toISOString();
    }
  })();

  const timeAgo = useTimeAgo(safeDate);

  return (
    <div className="border-b border-gray-100 pb-5 last:border-b-0 last:pb-0">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <span className="font-medium text-gray-900">#{request.id}</span>
            <span className={getStatusColor(request.status)}>
              {request.status}
            </span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
            <MapPin className="w-4 h-4" />
            <span>{request.destination || "—"}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Clock className="w-4 h-4" />
            <span>{timeAgo}</span>
          </div>
        </div>
        {/* Optional: Add "Details" button if needed later */}
      </div>
    </div>
  );
}

// ✅ VehicleItem styled like "Upcoming Trips"
function VehicleItem({ vehicle }) {
  return (
    <div className="border-b border-gray-100 pb-5 last:border-b-0 last:pb-0">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <span className="font-medium text-gray-900">{vehicle.plateNo}</span>
            <span className={getStatusColor(vehicle.status)}>
              {vehicle.status}
            </span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
            <Car className="w-4 h-4" />
            <span>{vehicle.model || "—"}</span>
          </div>
          <div className="bg-gray-50 p-3 rounded-lg mt-3">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span className="font-medium">Status:</span>
              <span>{vehicle.status}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

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
          .slice(0, 3);
        setRecentRequests(sortedRequests);

        setVehicleStatus(vehicles.map(v => ({
          plateNo: v.plateNo,
          status: getDisplayStatus(v),
          model: v.vehicleType
        })));

        setLoading(false);
      } catch (err) {
        console.error('Initial fetch error:', err);
        setError(err.message || 'Failed to load dashboard data');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Auto-refresh every 20s
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const vehicles = await api.getVehicles();
        setVehicleStatus(vehicles.map(v => ({
          plateNo: v.plateNo,
          status: getDisplayStatus(v),
          model: v.vehicleType
        })));
      } catch (err) {
        console.warn('Auto-refresh warning:', err.message);
      }
    }, 20000);

    return () => clearInterval(interval);
  }, []);

  const handleRefresh = async () => {
    try {
      const [allRequests, vehicles] = await Promise.all([
        api.getRequests(),
        api.getVehicles()
      ]);

      const sortedRequests = [...allRequests]
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
        .slice(0, 3);
      setRecentRequests(sortedRequests);

      setVehicleStatus(vehicles.map(v => ({
        plateNo: v.plateNo,
        status: getDisplayStatus(v),
        model: v.vehicleType
      })));
    } catch (err) {
      console.error('Manual refresh error:', err);
      setError('Failed to refresh data');
    }
  };

  if (error) {
    return (
      <div className="bg-[#F9FFF5] min-h-screen p-6">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6 flex items-center">
          <AlertCircle className="w-6 h-6 mr-2" />
          <span>Error: {error}</span>
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

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {[
          { label: "Total Requests", value: stats.totalRequests, icon: CalendarCheck2, bg: "bg-blue-100", color: "text-blue-600" },
          { label: "Pending Approval", value: stats.pendingApproval, icon: CalendarClock, bg: "bg-yellow-100", color: "text-yellow-600" },
          { label: "Approved Trips", value: stats.completedTrips, icon: CalendarCheck2, bg: "bg-green-100", color: "text-green-600" },
          { label: "This Month", value: stats.thisMonth, icon: CalendarCheck2, bg: "bg-purple-100", color: "text-purple-600" }
        ].map((stat, i) => (
          <div key={i} className="bg-white rounded-xl shadow p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-500 text-sm">{stat.label}</p>
                <h2 className="text-3xl font-bold mt-1">{stat.value}</h2>
              </div>
              <div className={`${stat.bg} p-2 rounded-lg`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Travel Requests — styled like Client's Recent Requests */}
        <div className="bg-white rounded-xl shadow p-6 flex flex-col min-h-[400px]">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Recent Travel Requests</h2>
            <button 
              onClick={handleRefresh}
              className="text-blue-600 hover:text-blue-800"
              title="Refresh"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
          
          {recentRequests.length === 0 ? (
            <div className="flex-1 flex items-center justify-center">
              <p className="text-gray-500 text-center py-4">No recent requests found</p>
            </div>
          ) : (
            <div className="space-y-5">
              {recentRequests.map(request => (
                <RequestItem key={request.id} request={request} />
              ))}
            </div>
          )}
        </div>

        {/* Vehicle Status — styled like Client's Upcoming Trips */}
        <div className="bg-white rounded-xl shadow p-6 flex flex-col min-h-[400px]">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Vehicle Status</h2>
            <button 
              onClick={handleRefresh}
              className="text-blue-600 hover:text-blue-800"
              title="Refresh"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
          
          {vehicleStatus.length === 0 ? (
            <div className="flex-1 flex items-center justify-center">
              <p className="text-gray-500 text-center py-4">No vehicles found</p>
            </div>
          ) : (
            <div className="space-y-5">
              {vehicleStatus.map(vehicle => (
                <VehicleItem key={vehicle.plateNo} vehicle={vehicle} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}