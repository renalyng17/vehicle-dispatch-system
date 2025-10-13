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

    // Set up polling for new notifications
    const interval = setInterval(() => {
      fetchNotifications();
      fetchUnreadCount();
    }, 10000); // Poll every 10 seconds

    return () => clearInterval(interval);
  }, []);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const data = await api.getNotifications();
      console.log("📥 Notifications fetched:", data);
      setNotifications(data || []);
      setError(null);
    } catch (err) {
      setError("Failed to fetch notifications");
      console.error("❌ Error fetching notifications:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchUnreadCount = async () => {
    try {
      const data = await api.getUnreadNotificationsCount();
      console.log("🔔 Unread count:", data.count);
      setUnreadCount(data.count || 0);
    } catch (err) {
      console.error("❌ Error fetching unread count:", err);
      setUnreadCount(0);
    }
  };

  const markAsRead = async (notificationId) => {
    try {
      console.log("📝 Marking notification as read:", notificationId);
      await api.markNotificationAsRead(notificationId);
      
      // Update local state
      setNotifications(prev => 
        prev.map(notif => 
          notif.id === notificationId ? { ...notif, read: true } : notif
        )
      );
      
      // Update unread count
      setUnreadCount(prev => Math.max(0, prev - 1));
      
      console.log("✅ Notification marked as read");
    } catch (err) {
      console.error("❌ Error marking notification as read:", err);
    }
  };

  const markAllAsRead = async () => {
    try {
      console.log("📝 Marking all notifications as read");
      
      // Mark all unread notifications as read
      const unreadNotifications = notifications.filter(notif => !notif.read);
      await Promise.all(
        unreadNotifications.map(notif => api.markNotificationAsRead(notif.id))
      );
      
      // Update local state
      setNotifications(prev => 
        prev.map(notif => ({ ...notif, read: true }))
      );
      setUnreadCount(0);
      
      console.log("✅ All notifications marked as read");
    } catch (err) {
      console.error("❌ Error marking all as read:", err);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Recently';
    
    try {
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
    } catch (error) {
      return 'Recently';
    }
  };

  const handleViewClick = async (notification) => {
    console.log("👁️ Viewing notification:", notification);
    
    // Mark as read when viewed if it's unread
    if (!notification.read) {
      await markAsRead(notification.id);
    }
    
    // Navigate to request details if requestId exists
    if (notification.requestId) {
      navigate(`/requests/${notification.requestId}`);
    } else {
      // Fallback: navigate to requests page
      navigate('/requests');
    }
    
    setIsOpen(false);
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'new_request':
        return <Bell className="w-4 h-4 text-blue-500" />;
      case 'status_update':
        return <Check className="w-4 h-4 text-green-500" />;
      default:
        return <Bell className="w-4 h-4 text-gray-500" />;
    }
  };

  const getNotificationStyle = (type) => {
    switch (type) {
      case 'new_request':
        return 'bg-blue-50 border border-blue-200';
      case 'status_update':
        return 'bg-green-50 border border-green-200';
      default:
        return 'bg-gray-50 border border-gray-200';
    }
  };

  const getStatusText = (notification) => {
    // Extract status from message or use type
    const message = notification.message || '';
    
    if (notification.type === 'new_request') {
      return 'New Travel Request';
    }
    
    if (notification.type === 'status_update') {
      if (message.toLowerCase().includes('accepted')) {
        return 'Request Accepted';
      } else if (message.toLowerCase().includes('declined')) {
        return 'Request Declined';
      } else {
        return 'Status Updated';
      }
    }
    
    return 'Notification';
  };

  const getRequestDetails = (notification) => {
    // Try to extract destination from message
    const message = notification.message || '';
    const destinationMatch = message.match(/to (.+?) from/);
    const officeMatch = message.match(/from (.+)$/);
    
    return {
      destination: destinationMatch ? destinationMatch[1] : null,
      requestingOffice: officeMatch ? officeMatch[1] : null
    };
  };

  return (
    <>
      <button
        id="notification-bell"
        className="fixed top-5 right-7 hover:text-lime-200 transition duration-200 z-50"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Notifications"
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
                <button 
                  onClick={fetchNotifications}
                  className="block mx-auto mt-2 text-xs text-blue-600 hover:text-blue-800"
                >
                  Retry
                </button>
              </div>
            ) : notifications.length > 0 ? (
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {notifications.map((notification) => {
                  const isUnread = !notification.read;
                  const requestDetails = getRequestDetails(notification);
                  const statusText = getStatusText(notification);
                  
                  return (
                    <div
                      key={notification.id}
                      className={`p-3 rounded-lg cursor-pointer transition-all duration-200 ${
                        getNotificationStyle(notification.type)
                      } ${isUnread ? 'ring-1 ring-blue-200' : ''}`}
                      onClick={() => handleViewClick(notification)}
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 mt-0.5">
                          {getNotificationIcon(notification.type)}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className={`font-medium text-sm ${
                                notification.type === 'new_request' ? 'text-blue-800' :
                                notification.type === 'status_update' ? 
                                  (notification.message?.toLowerCase().includes('accepted') ? 'text-green-800' :
                                   notification.message?.toLowerCase().includes('declined') ? 'text-red-800' :
                                   'text-gray-800') :
                                'text-gray-800'
                              }`}>
                                {statusText}
                              </div>
                              
                              <div className="text-xs text-gray-600 mt-1">
                                {notification.message && (
                                  <p className="text-gray-700">{notification.message}</p>
                                )}
                                
                                {requestDetails.destination && (
                                  <span className="font-medium block mt-1">
                                    To: {requestDetails.destination}
                                  </span>
                                )}
                                {requestDetails.requestingOffice && (
                                  <span className="block">
                                    From: {requestDetails.requestingOffice}
                                  </span>
                                )}
                              </div>

                              {/* Display additional request details if available */}
                              {notification.driver && (
                                <div className="mt-2 space-y-1">
                                  <div className="flex items-center gap-1 text-xs text-gray-600">
                                    <User className="w-3 h-3" />
                                    <span>Driver: {notification.driver}</span>
                                  </div>
                                </div>
                              )}
                              {notification.vehicleType && (
                                <div className="flex items-center gap-1 text-xs text-gray-600">
                                  <Car className="w-3 h-3" />
                                  <span>Vehicle: {notification.vehicleType} {notification.plateNo && `(${notification.plateNo})`}</span>
                                </div>
                              )}

                              {notification.reason && (
                                <div className="mt-2 text-xs text-gray-600 bg-white bg-opacity-50 p-2 rounded border">
                                  <span className="font-medium">Reason:</span> {notification.reason}
                                </div>
                              )}
                            </div>
                            
                            <div className="flex flex-col items-end gap-1">
                              <span className="text-xs text-gray-500 whitespace-nowrap">
                                {formatDate(notification.updatedAt || notification.createdAt || notification.timestamp)}
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
                <p className="text-xs mt-1">You'll see notifications here when you have new requests</p>
              </div>
            )}
            
            {/* Debug info - remove in production */}
            {process.env.NODE_ENV === 'development' && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <details className="text-xs text-gray-500">
                  <summary className="cursor-pointer">Debug Info</summary>
                  <div className="mt-2 space-y-1">
                    <div>Total: {notifications.length}</div>
                    <div>Unread: {unreadCount}</div>
                    <div>API: {api ? 'Connected' : 'Disconnected'}</div>
                  </div>
                </details>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}