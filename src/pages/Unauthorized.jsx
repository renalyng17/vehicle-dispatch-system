// src/pages/Unauthorized.jsx
import React from "react";

const Unauthorized = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen text-center">
      <h1 className="text-4xl font-bold text-red-600 mb-4">403 - Unauthorized</h1>
      <p className="text-lg text-gray-600">You do not have permission to view this page.</p>
    </div>
  );
};

export default Unauthorized;
