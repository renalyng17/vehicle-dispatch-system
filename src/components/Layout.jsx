// src/components/Layout.jsx
import React from "react";
import { Outlet } from "react-router-dom";

const Layout = () => {
  return (
    <div>
      {/* Optional: Navbar/Header */}
      <Outlet />
      {/* Optional: Footer */}
    </div>
  );
};

export default Layout;
