const API_BASE_URL = 'http://localhost:3001/api';

// 🔑 Helper: Get auth token
const getAuthToken = () => {
  return localStorage.getItem('token');
};

// 🌐 Enhanced API request handler with better error handling
const apiRequest = async (endpoint, options = {}) => {
  const token = getAuthToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` }),
    ...options.headers,
  };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
      credentials: 'include',
    });

    const data = await response.json();

    if (!response.ok) {
      // If the backend returns an error object with 'error' property
      const errorMessage = data.error || data.message || `Request failed with status ${response.status}`;
      throw new Error(errorMessage);
    }

    return data;

  } catch (error) {
    console.error(`❌ API request to ${endpoint} failed:`, error);
    
    // More specific error messages
    if (error.name === 'TypeError' && error.message.includes('Failed to fetch')) {
      throw new Error('Network error: Unable to connect to server');
    }
    
    throw error;
  }
};

// 🚀 Export all API methods
export const api = {
  // 🔐 Authentication
  login: (credentials) => apiRequest('/auth/login', { method: 'POST', body: JSON.stringify(credentials) }),
  register: (userData) => apiRequest('/auth/register', { method: 'POST', body: JSON.stringify(userData) }),
  logout: () => apiRequest('/auth/logout', { method: 'POST' }),
  getProfile: () => apiRequest('/auth/profile'),
  resetPassword: (data) => apiRequest('/auth/reset-password', { method: 'POST', body: JSON.stringify(data) }),

  // 📝 REQUESTS
  getRequests: () => apiRequest('/requests'),
  getRequest: (id) => apiRequest(`/requests/${id}`),
  createRequest: (data) => apiRequest('/requests', { method: 'POST', body: JSON.stringify(data) }),
  updateRequestStatus: (id, data) => apiRequest(`/requests/${id}/status`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteRequest: (id) => apiRequest(`/requests/${id}`, { method: 'DELETE' }),

  // 🔔 NOTIFICATIONS
  getNotifications: () => apiRequest('/notifications'),
  markNotificationAsRead: (id) => 
    apiRequest(`/notifications/${id}/read`, { method: 'PUT' }),
  getUnreadNotificationsCount: () => apiRequest('/notifications/unread/count'),
  markAllNotificationsAsRead: () => 
    apiRequest('/notifications/mark-all-read', { method: 'PUT' }),

  // 🚗 VEHICLES
  getVehicles: async () => {
    try {
      const data = await apiRequest('/vehicles');
      // Ensure we always return an array
      return Array.isArray(data) ? data : [];
    } catch (error) {
      console.error('Error in getVehicles:', error);
      return []; // Return empty array on error
    }
  },
  
  createVehicle: (data) => apiRequest('/vehicles', { method: 'POST', body: JSON.stringify(data) }),
  archiveVehicle: (id) => apiRequest(`/vehicles/${id}/archive`, { method: 'PATCH' }),
  restoreVehicle: (id) => apiRequest(`/vehicles/${id}/restore`, { method: 'PUT' }),
  getArchivedVehicles: async () => {
    try {
      const data = await apiRequest('/vehicles/archived');
      return Array.isArray(data) ? data : [];
    } catch (error) {
      console.error('Error in getArchivedVehicles:', error);
      return [];
    }
  },

  // 👨‍✈️ DRIVERS
  getDrivers: async () => {
    try {
      const data = await apiRequest('/drivers');
      // Ensure we always return an array
      return Array.isArray(data) ? data : [];
    } catch (error) {
      console.error('Error in getDrivers:', error);
      return []; // Return empty array on error
    }
  },
  
  createDriver: (data) => apiRequest('/drivers', { method: 'POST', body: JSON.stringify(data) }),
  archiveDriver: (id) => apiRequest(`/drivers/${id}/archive`, { method: 'PATCH' }),
  restoreDriver: (id) => apiRequest(`/drivers/${id}/restore`, { method: 'PUT' }),
  getArchivedDrivers: async () => {
    try {
      const data = await apiRequest('/drivers/archived');
      return Array.isArray(data) ? data : [];
    } catch (error) {
      console.error('Error in getArchivedDrivers:', error);
      return [];
    }
  },
};