import React, { useState } from "react";

export default function Management() {
  const [activeTab, setActiveTab] = useState("vehicle");

  const tabClass = (tab) =>
    `py-2 px-4 text-sm font-medium ${
      activeTab === tab
        ? "text-green-700 border-b-2 border-green-700"
        : "text-gray-600 hover:text-green-700"
    }`;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Management</h1>

      {/* Tabs */}
      <div className="relative flex border-b mb-4 space-x-2">
        <button className={tabClass("vehicle")} onClick={() => setActiveTab("vehicle")}>
          VEHICLE DETAIL
        </button>
        <button className={tabClass("client")} onClick={() => setActiveTab("client")}>
          CLIENT INFORMATION
        </button>
        <button className={tabClass("driver")} onClick={() => setActiveTab("driver")}>
          DRIVER INFORMATION
        </button>

        {/* ADD button */}
        <div className="absolute right-0 top-0">
          <button className="py-1 px-7 bg-green-500 text-white rounded-md hover:bg-green-700 transition duration-300 flex items-center space-x-1 text-sm">
            <span className="text-lg">+</span>
            <span>ADD</span>
          </button>
        </div>
      </div>

      {/* Table Data */}
      {activeTab === "vehicle" && (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200 rounded-md shadow-md text-sm">
            <thead className="bg-gray-100">
              <tr className="text-left">
                <th className="p-3">VEHICLE</th>
                <th className="p-3">PLATE NO.</th>
                <th className="p-3">CAPACITY</th>
                <th className="p-3">FUEL TYPE</th>
                <th className="p-3">FLEET CARD</th>
                <th className="p-3">RFID</th>
              </tr>
            </thead>
            <tbody>
              {[1].map((row) => (
                <tr key={row} className="border-t">
                  <td className="p-3">INNOVA</td>
                  <td className="p-3">NAP 3344</td>
                  <td className="p-3">9</td>
                  <td className="p-3 font-semibold">BIO–DIESEL</td>
                  <td className="p-3">
                    <span className="bg-green-100 text-green-700 px-2 py-1 rounded-md text-xs">AVAILABLE</span>
                  </td>
                  <td className="p-3">
                    <span className="bg-green-100 text-green-700 px-2 py-1 rounded-md text-xs">AVAILABLE</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === "client" && (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200 rounded-md shadow-md text-sm">
            <thead className="bg-gray-100">
              <tr className="text-left">
                <th className="p-3">NAME</th>
                <th className="p-3">CONTACT NO.</th>
                <th className="p-3">EMAIL ADDRESS</th>
              </tr>
            </thead>
            <tbody>
              {[1].map((row) => (
                <tr key={row} className="border-t">
                  <td className="p-3">ANA </td>
                  <td className="p-3">0912-345-6789</td>
                  <td className="p-3">Ana@gmail.com</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === "driver" && (
       <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200 rounded-md shadow-md text-sm">
            <thead className="bg-gray-100">
              <tr className="text-left">
                <th className="p-3">NAME</th>
                <th className="p-3">CONTACT NO.</th>
                <th className="p-3">EMAIL ADDRESS</th>
                <th className="p-3">STATUS</th>
                
              </tr>
            </thead>
            <tbody>
              {[1].map((row) => (
                <tr key={row} className="border-t">
                  <td className="p-3">MARK JOHN </td>
                  <td className="p-3">0912-345-6789</td>
                  <td className="p-3">Ana@gmail.com</td>
                  <td className="p-3">
                    <span className="bg-green-100 text-green-700 px-2 py-1 rounded-md text-xs">AVAILABLE</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>  
        </div>
      )}
    </div>
  );
}
