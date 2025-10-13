import { Bell } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function NotificationBar() {
  const [isOpen, setIsOpen] = useState(false);
  const [bellPosition, setBellPosition] = useState({ top: 0, right: 10 });
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  // Fetch notifications
  const fetchNotifications = async () => {
    try {
      const response = await axios.get('http://localhost:3001/api/notifications');
      setNotifications(response.data);
      console.log("Fetched notifications:", response.data); // 👈 Debug log
    } catch (err) {
      setError("Failed to fetch notifications");
      console.error("Error fetching notifications:", err);
    } finally {
      setLoading(false);
    }
  };

  // Get bell position on mount and window resize
  useEffect(() => {
    const updateBellPosition = () => {
      const bell = document.getElementById("notification-bell");
      if (bell) {
        const rect = bell.getBoundingClientRect();
        setBellPosition({
          top: rect.top + window.scrollY,
          right: window.innerWidth - rect.right,
        });
      }
    };

    updateBellPosition();
    window.addEventListener("resize", updateBellPosition);
    return () => window.removeEventListener("resize", updateBellPosition);
  }, []);

  // Fetch on mount
  useEffect(() => {
    fetchNotifications();
  }, []);

  // Poll every 30 seconds for new notifications
  useEffect(() => {
    const interval = setInterval(() => {
      fetchNotifications();
    }, 30000); // 30 seconds

    return () => clearInterval(interval);
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleViewClick = (notificationId) => {
    navigate(`/requests/${notificationId}`);
    setIsOpen(false);
  };

  // Optional: Mark all as read (if backend supports it)
  const handleMarkAllRead = async () => {
    try {
      await axios.post('http://localhost:3001/api/notifications/mark-read');
      setNotifications([]); // or refetch
      fetchNotifications(); // refresh list
    } catch (err) {
      console.error("Failed to mark notifications as read:", err);
    }
  };

  return (
    <>
      <button
        id="notification-bell"
        className="fixed top-5 right-7 hover:text-lime-200 transition duration-200 z-50"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Bell className="w-6 h-6" />
        {/* Show green dot only if there are notifications */}
        {notifications.length > 0 && (
          <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-green-500" />
        )}
      </button>

      {isOpen && (
        <div
          className="fixed bg-white rounded-md shadow-lg z-50 border border-gray-200"
          style={{
            top: `calc(${bellPosition.top}px + 2rem)`,
            right: `calc(${bellPosition.right}px + 1rem)`,
            width: "320px",
            transform: "translateY(10px)",
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold text-lg">Notifications</h3>
              {notifications.length > 0 && (
                <button
                  onClick={handleMarkAllRead}
                  className="text-xs text-blue-600 hover:underline"
                >
                  Mark all read
                </button>
              )}
            </div>
            
            {loading ? (
              <div className="text-center text-sm text-gray-500 py-4">Loading...</div>
            ) : error ? (
              <div className="text-center text-sm text-red-500 py-4">{error}</div>
            ) : notifications.length > 0 ? (
              notifications.map((notification) => {
                const isAccepted = notification.status === 'accepted';
                const bgColor = isAccepted ? 'bg-green-50' : 'bg-red-50';
                const textColor = isAccepted ? 'text-green-800' : 'text-red-800';
                const iconColor = isAccepted ? 'text-green-500' : 'text-red-500';

                return (
                  <div
                    key={notification._id}
                    className={`mb-3 p-3 rounded-lg ${bgColor} ${textColor} cursor-pointer hover:bg-opacity-90 transition`}
                    onClick={() => isAccepted && handleViewClick(notification.requestId)}
                  >
                    <div className="flex items-start gap-2">
                      {!isAccepted && <Bell className={`w-5 h-5 mt-0.5 ${iconColor}`} />}
                      <div className="flex-1">
                        <div className="font-medium text-sm">
                          {isAccepted 
                            ? 'Admin Accepted your Request' 
                            : 'Admin Declined your Request'}
                        </div>
                        {notification.reason && !isAccepted && (
                          <div className="text-xs mt-1 flex items-center gap-1">
                            <span className="text-gray-600">💬</span>
                            <span>{notification.reason}</span>
                          </div>
                        )}
                      </div>
                      <span className="text-xs text-gray-500 whitespace-nowrap">
                        {formatDate(notification.updatedAt)}
                      </span>
                    </div>

                    {isAccepted && (
                      <button
                        className="mt-2 text-xs font-medium text-green-600 hover:underline"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleViewClick(notification.requestId);
                        }}
                      >
                        View
                      </button>
                    )}
                  </div>
                );
              })
            ) : (
              <div className="text-center text-sm text-gray-500 py-4">
                No notifications
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}