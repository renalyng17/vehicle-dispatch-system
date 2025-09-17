// services/api.js
const API_BASE_URL = 'http://localhost:3001/api';

// Helper function to handle API calls
const apiRequest = async (endpoint, options = {}) => {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
};

export const api = {
  // Requests
  getRequests: () => apiRequest('/requests'),
  getRequest: (id) => apiRequest(`/requests/${id}`),
  createRequest: (data) => 
    apiRequest('/requests', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  updateRequest: (id, data) => 
    apiRequest(`/requests/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  deleteRequest: (id) => 
    apiRequest(`/requests/${id}`, {
      method: 'DELETE',
    }),

  // Notifications
  getNotifications: () => apiRequest('/notifications'),
  markNotificationAsRead: (id) => 
    apiRequest(`/notifications/${id}`, {
      method: 'PUT',
    }),
  getUnreadNotificationsCount: () => apiRequest('/notifications/unread/count'),

  // Drivers and Vehicles
  getDrivers: () => apiRequest('/drivers'),
  getVehicles: () => apiRequest('/vehicles'),
};