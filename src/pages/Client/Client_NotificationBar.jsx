import { Bell, Check, X, Car, User } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../../../services/api"; // Using your API service

export default function NotificationBar() {
  const [isOpen, setIsOpen] = useState(false);
  const [bellPosition, setBellPosition] = useState({ top: 0, right: 10 });
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [unreadCount, setUnreadCount] = useState(0);

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

    fetchNotifications();
    fetchUnreadCount();
  }, []);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const data = await api.getNotifications();
      setNotifications(data);
    } catch (err) {
      setError("Failed to fetch notifications");
      console.error("Error fetching notifications:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchUnreadCount = async () => {
    try {
      const data = await api.getUnreadNotificationsCount();
      setUnreadCount(data.count);
    } catch (err) {
      console.error("Error fetching unread count:", err);
    }
  };

  const markAsRead = async (notificationId) => {
    try {
      await api.markNotificationAsRead(notificationId);
      // Update local state
      setNotifications(prev => 
        prev.map(notif => 
          notif.id === notificationId ? { ...notif, read: true } : notif
        )
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (err) {
      console.error("Error marking notification as read:", err);
    }
  };

  const markAllAsRead = async () => {
    try {
      // This would require a new API endpoint
      await Promise.all(
        notifications
          .filter(notif => !notif.read)
          .map(notif => api.markNotificationAsRead(notif.id))
      );
      setNotifications(prev => 
        prev.map(notif => ({ ...notif, read: true }))
      );
      setUnreadCount(0);
    } catch (err) {
      console.error("Error marking all as read:", err);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now - date) / (1000 * 60 * 60);

    if (diffInHours < 1) {
      return 'Just now';
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}h ago`;
    } else {
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric' 
      });
    }
  };

  const handleViewClick = async (notification) => {
    // Mark as read when viewed
    if (!notification.read) {
      await markAsRead(notification.id);
    }
    
    // Navigate to request details
    navigate(`/requests/${notification.requestId}`);
    setIsOpen(false);
  };

  const getNotificationIcon = (status, type) => {
    if (type === 'new_request') {
      return <Bell className="w-4 h-4 text-blue-500" />;
    }
    
    switch (status) {
      case 'accepted':
        return <Check className="w-4 h-4 text-green-500" />;
      case 'declined':
        return <X className="w-4 h-4 text-red-500" />;
      default:
        return <Bell className="w-4 h-4 text-gray-500" />;
    }
  };

  const getNotificationStyle = (status, type) => {
    if (type === 'new_request') {
      return 'bg-blue-50 border border-blue-200';
    }
    
    switch (status) {
      case 'accepted':
        return 'bg-green-50 border border-green-200';
      case 'declined':
        return 'bg-red-50 border border-red-200';
      default:
        return 'bg-gray-50 border border-gray-200';
    }
  };

  const getStatusText = (status, type) => {
    if (type === 'new_request') {
      return 'New Request Created';
    }
    
    switch (status) {
      case 'accepted':
        return 'Request Accepted';
      case 'declined':
        return 'Request Declined';
      default:
        return 'Status Updated';
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
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-green-500" />
        )}
      </button>

      {isOpen && (
        <div
          className="fixed bg-white rounded-lg shadow-xl z-50 border border-gray-200"
          style={{
            top: `calc(${bellPosition.top}px + 2rem)`,
            right: `calc(${bellPosition.right}px + 1rem)`,
            width: "380px",
            maxHeight: "500px",
            transform: "translateY(10px)",
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold text-lg text-gray-800">Notifications</h3>
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="text-xs text-blue-600 hover:text-blue-800 font-medium"
                >
                  Mark all as read
                </button>
              )}
            </div>
            
            {loading ? (
              <div className="text-center text-sm text-gray-500 py-8">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto mb-2"></div>
                Loading notifications...
              </div>
            ) : error ? (
              <div className="text-center text-sm text-red-500 py-8">
                {error}
              </div>
            ) : notifications.length > 0 ? (
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {notifications.map((notification) => {
                  const isUnread = !notification.read;
                  
                  return (
                    <div
                      key={notification.id}
                      className={`p-3 rounded-lg cursor-pointer transition-all duration-200 ${
                        getNotificationStyle(notification.status, notification.type)
                      } ${isUnread ? 'ring-1 ring-blue-200' : ''}`}
                      onClick={() => handleViewClick(notification)}
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 mt-0.5">
                          {getNotificationIcon(notification.status, notification.type)}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className={`font-medium text-sm ${
                                notification.status === 'accepted' ? 'text-green-800' :
                                notification.status === 'declined' ? 'text-red-800' :
                                'text-gray-800'
                              }`}>
                                {getStatusText(notification.status, notification.type)}
                              </div>
                              
                              <div className="text-xs text-gray-600 mt-1">
                                {notification.destination && (
                                  <span className="font-medium">To: {notification.destination}</span>
                                )}
                                {notification.requestingOffice && (
                                  <span className="ml-2">• {notification.requestingOffice}</span>
                                )}
                              </div>

                              {notification.status === 'accepted' && (
                                <div className="mt-2 space-y-1">
                                  {notification.driver && (
                                    <div className="flex items-center gap-1 text-xs text-gray-600">
                                      <User className="w-3 h-3" />
                                      <span>Driver: {notification.driver}</span>
                                    </div>
                                  )}
                                  {notification.vehicleType && (
                                    <div className="flex items-center gap-1 text-xs text-gray-600">
                                      <Car className="w-3 h-3" />
                                      <span>Vehicle: {notification.vehicleType} ({notification.plateNo})</span>
                                    </div>
                                  )}
                                </div>
                              )}

                              {notification.status === 'declined' && notification.reason && (
                                <div className="mt-2 text-xs text-gray-600 bg-white bg-opacity-50 p-2 rounded border">
                                  <span className="font-medium">Reason:</span> {notification.reason}
                                </div>
                              )}
                            </div>
                            
                            <div className="flex flex-col items-end gap-1">
                              <span className="text-xs text-gray-500 whitespace-nowrap">
                                {formatDate(notification.updatedAt || notification.createdAt)}
                              </span>
                              {isUnread && (
                                <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                              )}
                            </div>
                          </div>
                          
                          <button
                            className="mt-2 text-xs font-medium text-blue-600 hover:text-blue-800"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleViewClick(notification);
                            }}
                          >
                            View Details
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center text-sm text-gray-500 py-8">
                <Bell className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                No notifications yet
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}