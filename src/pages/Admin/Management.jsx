import React, { useState } from "react";

export default function Management() {
  const [activeTab, setActiveTab] = useState("vehicle");
<<<<<<< HEAD
=======
  const [showModal, setShowModal] = useState(false);
>>>>>>> 8a62f4317298bb4666f4087c3acc7bb736472e2b

  const tabClass = (tab) =>
    `py-2 px-4 text-sm font-medium ${
      activeTab === tab
        ? "text-green-700 border-b-2 border-green-700"
        : "text-gray-600 hover:text-green-700"
    }`;

  // Handler for modal submit
  const handleModalSubmit = (e) => {
    e.preventDefault();
    setShowModal(false);
    // Optionally, you can reset form fields or add logic here
  };

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

<<<<<<< HEAD
        {/* ADD button */}
        <div className="absolute right-0 top-0">
          <button className="py-1 px-7 bg-green-500 text-white rounded-md hover:bg-green-700 transition duration-300 flex items-center space-x-1 text-sm">
            <span className="text-lg">+</span>
            <span>ADD</span>
          </button>
        </div>
=======
        {/* ADD button - show in VEHICLE DETAIL and DRIVER INFORMATION tabs */}
        {(activeTab === "vehicle" || activeTab === "driver") && (
          <div className="absolute right-0 top-0">
            <button
              className="py-1 px-7 bg-green-500 text-white rounded-md hover:bg-green-700 transition duration-300 flex items-center space-x-1 text-sm"
              onClick={() => setShowModal(true)}
            >
              <span className="text-lg">+</span>
              <span>ADD</span>
            </button>
          </div>
        )}
>>>>>>> 8a62f4317298bb4666f4087c3acc7bb736472e2b
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
<<<<<<< HEAD
       <div className="overflow-x-auto">
=======
        <div className="overflow-x-auto">
>>>>>>> 8a62f4317298bb4666f4087c3acc7bb736472e2b
          <table className="min-w-full bg-white border border-gray-200 rounded-md shadow-md text-sm">
            <thead className="bg-gray-100">
              <tr className="text-left">
                <th className="p-3">NAME</th>
                <th className="p-3">CONTACT NO.</th>
                <th className="p-3">EMAIL ADDRESS</th>
                <th className="p-3">STATUS</th>
<<<<<<< HEAD
                
=======
>>>>>>> 8a62f4317298bb4666f4087c3acc7bb736472e2b
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
<<<<<<< HEAD
          </table>  
=======
          </table>
        </div>
      )}

      {/* Modal for VEHICLE DETAIL tab */}
      {activeTab === "vehicle" && showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-opacity-40">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-8 relative">
            <form className="space-y-4" onSubmit={handleModalSubmit}>
              <div>
                <label className="block text-sm mb-1">Vehicle Type</label>
                <input
                  type="text"
                  className="w-full border rounded px-3 py-2"
                  placeholder=""
                  defaultValue=""
                />
              </div>
              <div className="flex space-x-2">
                <div className="flex-1">
                  <label className="block text-sm mb-1">Plate Name</label>
                  <input
                    type="text"
                    className="w-full border rounded px-3 py-2"
                    placeholder=""
                    defaultValue=""
                  />
                </div>
                <div className="w-1/3">
                  <label className="block text-sm mb-1">Capacity</label>
                  <input
                    type="number"
                    min="1"
                    max="14"
                    className="w-full border rounded px-3 py-2"
                    placeholder=""
                    defaultValue=""
                    onKeyDown={(e) => {
                      if (!/[0-9]/.test(e.key) && e.key !== "Backspace" && e.key !== "Tab") {
                        e.preventDefault();
                      }
                    }}
                    onInput={(e) => {
                      let value = parseInt(e.target.value, 10);
                      if (value < 1) e.target.value = 1;
                      if (value > 14) e.target.value = 14;
                    }}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm mb-1">Fuel Type</label>
                <select className="w-full border rounded px-3 py-2" defaultValue="">
                  <option value="" disabled hidden>Select Fuel Type</option>
                  <option>BIO- DIESEL</option>
                  <option>DIESEL</option>
                </select>
              </div>
              <div>
                <label className="block text-sm mb-1">Fleet card</label>
                <select className="w-full border rounded px-3 py-2" defaultValue="">
                  <option value="" disabled hidden>Select Fleet Card</option>
                  <option>Available</option>
                  <option>Unavailable</option>
                </select>
              </div>
              <div>
                <label className="block text-sm mb-1">RFID</label>
                <select className="w-full border rounded px-3 py-2" defaultValue="">
                  <option value="" disabled hidden>Select RFID</option>
                  <option>Available</option>
                  <option>Unavailable</option>
                </select>
              </div>
              <div className="flex justify-end space-x-2 mt-6">
                <button
                  type="button"
                  className="px-4 py-2 border rounded text-gray-700 hover:bg-gray-100"
                  onClick={() => setShowModal(false)}
                >
                  Discard
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                >
                  Add
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal for DRIVER INFORMATION tab */}
      {activeTab === "driver" && showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-opacity-40">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-8 relative">
            <form className="space-y-6" onSubmit={handleModalSubmit}>
              <div>
                <label className="block text-sm mb-1">Name</label>
                <input
                  type="text"
                  className="w-full border rounded px-3 py-2"
                  placeholder=""
                  defaultValue=""
                />
              </div>
              <div>
                <label className="block text-sm mb-1">Contact No.</label>
                <input
                  type="text"
                  className="w-full border rounded px-3 py-2"
                  placeholder=""
                  defaultValue=""
                />
              </div>
              <div>
                <label className="block text-sm mb-1">Email Address</label>
                <input
                  type="email"
                  className="w-full border rounded px-3 py-2"
                  placeholder=""
                  defaultValue=""
                />
              </div>
              <div className="flex justify-end space-x-2 mt-6">
                <button
                  type="button"
                  className="px-4 py-2 border rounded text-gray-700 hover:bg-gray-100 shadow"
                  onClick={() => setShowModal(false)}
                >
                  Discard
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-green-700 text-white rounded shadow hover:bg-green-800"
                >
                  Add
                </button>
              </div>
            </form>
          </div>
>>>>>>> 8a62f4317298bb4666f4087c3acc7bb736472e2b
        </div>
      )}
    </div>
  );
<<<<<<< HEAD
}
=======
}
>>>>>>> 8a62f4317298bb4666f4087c3acc7bb736472e2b
