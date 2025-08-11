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

  useEffect(() => {
    const bell = document.getElementById("notification-bell");
    if (bell) {
      const rect = bell.getBoundingClientRect();
      setBellPosition({
        top: rect.top + window.scrollY,
        right: window.innerWidth - rect.right,
      });
    }

    const fetchNotifications = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/notifications');
        setNotifications(response.data);
      } catch (err) {
        setError("Failed to fetch notifications");
        console.error("Error fetching notifications:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
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

  return (
    <>
      <button
        id="notification-bell"
        className="fixed top-5 right-7 hover:text-lime-200 transition duration-200 z-50"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Bell className="w-6 h-6" />
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
            <h3 className="font-semibold text-lg mb-4">Notification</h3>
            
            {loading ? (
              <div className="text-center text-sm text-gray-500 py-4">Loading...</div>
            ) : error ? (
              <div className="text-center text-sm text-red-500 py-4">{error}</div>
            ) : notifications.length > 0 ? (
              notifications.map((notification) => (
                <div 
                  key={notification._id} 
                  className={`mb-4 p-3 rounded border-l-4 ${
                    notification.status === 'accepted' ? 'border-green-500' : 'border-red-500'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <h4 className="font-medium text-sm">
                      {notification.status === 'accepted' 
                        ? 'Admin Accepted your Request' 
                        : 'Admin Declined your Request'}
                    </h4>
                    <span className="text-xs text-gray-500">
                      {formatDate(notification.updatedAt)}
                    </span>
                  </div>
                  
                  {notification.status === 'declined' && notification.reason && (
                    <p className="text-sm text-gray-600 mt-1">
                      {notification.reason}
                    </p>
                  )}
                  
                  {notification.status === 'accepted' && (
                    <button 
                      className="mt-2 text-sm text-green-600 hover:underline"
                      onClick={() => handleViewClick(notification.requestId)}
                    >
                      View
                    </button>
                  )}
                </div>
              ))
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