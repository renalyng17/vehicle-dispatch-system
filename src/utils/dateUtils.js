// src/utils/dateUtils.js
export const formatDate = (dateString) => {
  if (!dateString) return "—";
  const date = new Date(dateString); 
  return date.toLocaleDateString('en-US', { 
    weekday: 'short', 
    month: 'short', 
    day: 'numeric' 
  }) + " at " + date.toLocaleTimeString('en-US', { 
    hour: '2-digit', 
    minute: '2-digit' 
  });
};

export const getStatusColor = (status) => {
  switch (status?.toLowerCase()) {
    case 'accepted':
    case 'approved':
    case 'completed':
    case 'confirmed':
      return 'text-green-600 bg-green-100 px-2 py-1 rounded-full text-xs';
    case 'pending':
      return 'text-yellow-600 bg-yellow-100 px-2 py-1 rounded-full text-xs';
    case 'declined':
      return 'text-red-600 bg-red-100 px-2 py-1 rounded-full text-xs';
    default:
      return 'text-gray-600 bg-gray-100 px-2 py-1 rounded-full text-xs';
  }
};