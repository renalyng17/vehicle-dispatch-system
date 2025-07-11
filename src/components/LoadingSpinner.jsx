import React from 'react';

const LoadingSpinner = () => (
  <div className="flex justify-center items-center py-6">
    <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-green-600"></div>
    <span className="ml-2 text-green-600 text-sm">Loading...</span>
  </div>
);

export default LoadingSpinner;
