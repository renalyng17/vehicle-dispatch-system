import React, { useState } from "react";

export default function Management() {
  const [activeTab, setActiveTab] = useState("vehicle");
  const [showModal, setShowModal] = useState(false);

  // State for vehicle and driver data
  const [vehicles, setVehicles] = useState([]);
  const [drivers, setDrivers] = useState([]);

  // State for delete confirmation modal
  const [confirmDelete, setConfirmDelete] = useState({ type: null, idx: null });

  // State for duplicate modal
  const [duplicateModal, setDuplicateModal] = useState({ show: false, type: "" });

  // Form state for modals
  const [vehicleForm, setVehicleForm] = useState({
    vehicleType: "",
    plateNo: "",
    capacity: "",
    fuelType: "",
    fleetCard: "",
    rfid: "",
  });
  const [driverForm, setDriverForm] = useState({
    name: "",
    contact: "",
    email: "",
  });

  const tabClass = (tab) =>
    `py-2 px-4 text-sm font-medium ${
      activeTab === tab
        ? "text-green-600 border-b-3 border-green-700"
        : "text-gray-600 hover:text-green-700"
    }`;

  // Handle modal open and reset form
  const handleAddClick = () => {
    setShowModal(true);
    setVehicleForm({
      vehicleType: "",
      plateNo: "",
      capacity: "",
      fuelType: "",
      fleetCard: "",
      rfid: "",
    });
    setDriverForm({
      name: "",
      contact: "",
      email: "",
    });
  };

  // Handle vehicle modal submit
  const handleVehicleSubmit = (e) => {
    e.preventDefault();
    // Check for duplicate plate number
    if (
      vehicles.some(
        (v) =>
          v.plateNo.trim().toLowerCase() === vehicleForm.plateNo.trim().toLowerCase()
      )
    ) {
      setDuplicateModal({ show: true, type: "vehicle" });
      return;
    }
    setVehicles([
      ...vehicles,
      {
        vehicleType: vehicleForm.vehicleType,
        plateNo: vehicleForm.plateNo,
        capacity: vehicleForm.capacity,
        fuelType: vehicleForm.fuelType,
        fleetCard: vehicleForm.fleetCard,
        rfid: vehicleForm.rfid,
      },
    ]);
    setShowModal(false);
  };

  // Handle driver modal submit
  const handleDriverSubmit = (e) => {
    e.preventDefault();
    // Check for duplicate email or contact
    if (
      drivers.some(
        (d) =>
          d.email.trim().toLowerCase() === driverForm.email.trim().toLowerCase() ||
          d.contact.replace(/\D/g, "") === driverForm.contact.replace(/\D/g, "")
      )
    ) {
      setDuplicateModal({ show: true, type: "driver" });
      return;
    }
    setDrivers([
      ...drivers,
      {
        name: driverForm.name,
        contact: driverForm.contact,
        email: driverForm.email,
        status: "AVAILABLE",
      },
    ]);
    setShowModal(false);
  };

  // Open confirmation modal for vehicle
  const handleDeleteVehicle = (idx) => {
    setConfirmDelete({ type: "vehicle", idx });
  };

  // Open confirmation modal for driver
  const handleDeleteDriver = (idx) => {
    setConfirmDelete({ type: "driver", idx });
  };

  // Confirm deletion
  const confirmDeleteAction = () => {
    if (confirmDelete.type === "vehicle") {
      setVehicles(vehicles.filter((_, i) => i !== confirmDelete.idx));
    } else if (confirmDelete.type === "driver") {
      setDrivers(drivers.filter((_, i) => i !== confirmDelete.idx));
    }
    setConfirmDelete({ type: null, idx: null });
  };

  // Cancel deletion
  const cancelDeleteAction = () => {
    setConfirmDelete({ type: null, idx: null });
  };

  // Format contact number as 0912-234-2345
  const formatContact = (value) => {
    let digits = value.replace(/\D/g, "").slice(0, 11);
    let formatted = digits;
    if (digits.length > 4 && digits.length <= 7) {
      formatted = `${digits.slice(0, 4)}-${digits.slice(4)}`;
    } else if (digits.length > 7) {
      formatted = `${digits.slice(0, 4)}-${digits.slice(4, 7)}-${digits.slice(7)}`;
    }
    return formatted;
  };

  // Handle contact input change
  const handleContactChange = (e) => {
    const formatted = formatContact(e.target.value);
    setDriverForm({ ...driverForm, contact: formatted });
  };

  // Validation for vehicle form
  const isVehicleFormValid = () => {
    return (
      vehicleForm.vehicleType.trim() &&
      vehicleForm.plateNo.trim() &&
      vehicleForm.capacity &&
      vehicleForm.fuelType &&
      vehicleForm.fleetCard &&
      vehicleForm.rfid
    );
  };

  // Validation for driver form
  const isDriverFormValid = () => {
    return (
      driverForm.name.trim() &&
      driverForm.contact.trim() &&
      driverForm.email.trim()
    );
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Management</h1>

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

        {(activeTab === "vehicle" || activeTab === "driver") && (
          <div className="absolute right-0 top-0">
            <button
              className="py-1 px-7 bg-green-500 text-white rounded-md hover:bg-green-700 transition duration-300 flex items-center space-x-1 text-sm"
              onClick={handleAddClick}
            >
              <span className="text-lg">+</span>
              <span>ADD</span>
            </button>
          </div>
        )}
      </div>

          {/**Information  Vehicle Table */}  
      {activeTab === "vehicle" && (
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-200 rounded-md shadow-md text-sm">
            <thead>
              {/* Header row for vehicle information */}
              <tr className="bg-green-700 md:bg-green-600 text-white text-left">
                <th className="p-3">VEHICLE</th>
                <th className="p-3">PLATE NO.</th>
                <th className="p-3 text-center">CAPACITY</th>
                <th className="p-3">FUEL TYPE</th>
                <th className="p-3">FLEET CARD</th>
                <th className="p-3">RFID</th>
                <th className="p-3 text-center"></th> {/* New column */}
              </tr>
            </thead>
            <tbody>
  {vehicles.length === 0 ? (
    <tr>
      <td colSpan={7} className="p-3 text-center text-gray-400">No data</td>
    </tr>
  ) : (
    vehicles.map((v, idx) => (
      <tr key={idx} className="border-t text-black">
        <td className="p-3">{v.vehicleType}</td>
        <td className="p-3">{v.plateNo}</td>
        <td className="p-3 text-center">{v.capacity}</td>
        <td className="p-3 font-semibold">{v.fuelType}</td>
        <td className="p-3">
          <span className="bg-green-100 md:bg-green-200 text-green-700 px-2 py-1 rounded-md text-xs">
            {v.fleetCard?.toUpperCase()}
          </span>
        </td>
        <td className="p-3">
          <span className="bg-green-100 md:bg-green-200 text-green-700 px-2 py-1 rounded-md text-xs">
            {v.rfid?.toUpperCase()}
          </span>
        </td>
        <td className="p-3 text-center">
          <button
            className="px-3 py-1 bg-red-500 md:bg-red-600 text-white rounded hover:bg-red-700 transition text-xs"
            type="button"
            onClick={() => handleDeleteVehicle(idx)}
          >
            Delete
          </button>
          </td>
           </tr>
           ))
            )}
        </tbody>
          </table>
        </div>
      )}

      {activeTab === "client" && (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white text-white border border-gray-200 rounded-md shadow-md text-sm">
            <thead className="bg-green-700 md:bg-green-600">
              <tr className="text-left">
                <th className="p-3">NAME</th>
                <th className="p-3">CONTACT NO.</th>
                <th className="p-3">EMAIL ADDRESS</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-t text-black-100">
                <td colSpan={4} className="p-3 text-center text-gray-400">No data</td>
              </tr>
            </tbody>
          </table>
        </div>
      )}

      {activeTab === "driver" && (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white text-white border border-gray-200 rounded-md shadow-md text-sm">
            <thead className="bg-green-700 md:bg-green-600">
              <tr className="text-left">
                <th className="p-3">NAME</th>
                <th className="p-3">CONTACT NO.</th>
                <th className="p-3">EMAIL ADDRESS</th>
                <th className="p-3">STATUS</th>
                <th className="p-3 text-center"></th> {/* New column */}
              </tr>
            </thead>
           <tbody>
  {drivers.length === 0 ? (
    <tr>
      <td colSpan={5} className="p-3 text-center text-gray-400">No data</td>
    </tr>
  ) : (
    drivers.map((d, idx) => (
      <tr key={idx} className="border-t text-black">
        <td className="p-3">{d.name}</td>
        <td className="p-3">{d.contact}</td>
        <td className="p-3">{d.email}</td>
        <td className="p-3">
          <span className="bg-green-100 md:bg-green-200 text-green-700 px-2 py-1 rounded-md text-xs">{d.status}</span>
        </td>
        <td className="p-3 text-center">
          <button
            className="px-3 py-1 bg-red-500 md:bg-red-600 text-white rounded hover:bg-red-700 transition text-xs"
            type="button"
            onClick={() => handleDeleteDriver(idx)}
          >
            Delete
          </button>
        </td>
           </tr>
           ))
          )}
        </tbody>
          </table>
        </div>
      )}

          {/*Modal for Vehicle Information */}
      {activeTab === "vehicle" && showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-opacity-40">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-8 relative">
            <form className="space-y-4" onSubmit={handleVehicleSubmit}>
              <div>
                <label className="block text-sm mb-1">Vehicle Type</label>
                <input
                  type="text"
                  className="w-full border rounded px-3 py-1"
                  value={vehicleForm.vehicleType}
                  onChange={e => setVehicleForm({ ...vehicleForm, vehicleType: e.target.value })}
                  required
                />
              </div>
              <div className="flex space-x-2">
                <div className="flex-1">
                  <label className="block text-sm mb-1">Plate No.</label>
                  <input
                    type="text"
                    className="w-full border rounded px-3 py-1"
                    value={vehicleForm.plateNo}
                    onChange={e => setVehicleForm({ ...vehicleForm, plateNo: e.target.value })}
                    required
                  />
                </div>
              <div className="w-1/3">
                <label className="block text-sm mb-1">Capacity</label>
                   <input
                     type="number"
                     min="1"
                     max="14"
                     className="w-full border rounded px-3 py-1 text-center"
                     value={vehicleForm.capacity}
                     onChange={e => {
                       // Only allow up to 2 digits
                    const val = e.target.value.replace(/\D/g, '').slice(0, 2);
                    setVehicleForm({ ...vehicleForm, capacity: val });
                  }}
                    required
                  />
                    </div>
              </div>
              <div>
                <label className="block text-sm mb-1">Fuel Type</label>
                <select
                  className="w-full border rounded px-3 py-1"
                  value={vehicleForm.fuelType}
                  onChange={e => setVehicleForm({ ...vehicleForm, fuelType: e.target.value })}
                  required>
                  <option value="" disabled hidden>Select Fuel Type</option>
                  <option>BIO- DIESEL</option>
                  <option>DIESEL</option>
                </select>
              </div>
              <div>
                <label className="block text-sm mb-1">Fleet card</label>
                <select
                  className="w-full border rounded px-3 py-1"
                  value={vehicleForm.fleetCard}
                  onChange={e => setVehicleForm({ ...vehicleForm, fleetCard: e.target.value })}
                  required
                >
                  <option value="" disabled hidden>Select Fleet Card</option>
                  <option>Available</option>
                  <option>Unavailable</option>
                </select>
              </div>
              <div>
                <label className="block text-sm mb-1">RFID</label>
                <select
                  className="w-full border rounded px-3 py-1"
                  value={vehicleForm.rfid}
                  onChange={e => setVehicleForm({ ...vehicleForm, rfid: e.target.value })}
                  required
                >
                  <option value="" disabled hidden>Select RFID</option>
                  <option>Available</option>
                  <option>Unavailable</option>
                </select>
              </div>
              <div className="flex justify-end space-x-2 mt-6">
                <button
                  type="button"
                  className="px-3 py-1 border rounded text-gray-700 hover:bg-gray-100"
                  onClick={() => setShowModal(false)}
                >
                  Discard
                </button>
                <button
                  type="submit"
                  className={`px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 ${!isVehicleFormValid() ? "opacity-50 cursor-not-allowed" : ""}`}
                  disabled={!isVehicleFormValid()}
                >
                  Add
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Modal for Driver Information */}
      {activeTab === "driver" && showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-opacity-40">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-8 relative">
            <form className="space-y-6" onSubmit={handleDriverSubmit}>
              <div>
                <label className="block text-sm mb-1">Name</label>
                <input
                  type="text"
                  className="w-full border rounded px-3 py-1"
                  value={driverForm.name}
                  onChange={e => setDriverForm({ ...driverForm, name: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="block text-sm mb-1">Contact No.</label>
                <input
                  type="text"
                  className="w-full border rounded px-3 py-1"
                  maxLength={13}
                  placeholder="0912-234-2345"
                  value={driverForm.contact}
                  onChange={handleContactChange}
                  required
                />
              </div>
              <div>
                <label className="block text-sm mb-1">Email Address</label>
                <input
                  type="email"
                  className="w-full border rounded px-3 py-1"
                  value={driverForm.email}
                  onChange={e => setDriverForm({ ...driverForm, email: e.target.value })}
                  required
                />
              </div>
              <div className="flex justify-end space-x-2 mt-6">
                <button
                  type="button"
                  className="px-3 py-1 border rounded text-gray-700 hover:bg-gray-100 shadow"
                  onClick={() => setShowModal(false)}
                >
                  Discard
                </button>
                <button
                  type="submit"
                  className={`px-3 py-1 bg-green-600 text-white rounded shadow hover:bg-green-800 ${!isDriverFormValid() ? "opacity-50 cursor-not-allowed" : ""}`}
                  disabled={!isDriverFormValid()}
                >
                  Add
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Duplicate Modal - Already Exists on the list */}
      {duplicateModal.show && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-opacity-40">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-xs p-8 text-center">
            <div className="text-lg font-semibold mb-4 text-red-600">Already Exists</div>
            <div className="mb-6 text-gray-700">
              
            </div>
            <button
              className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              onClick={() => setDuplicateModal({ show: false, type: "" })}
            >
              OK
            </button>
          </div>
        </div>
      )}

      {confirmDelete.type && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-opacity-40">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-xs p-8 text-center">
            <div className="text-lg font-semibold mb-4 text-red-600">Confirm Delete</div>
            <div className="mb-6 text-gray-700">
              Are you sure you want to delete this {confirmDelete.type === "vehicle" ? "vehicle" : "driver"}?
            </div>
            <div className="flex justify-center space-x-4">
              <button
                className="px-6 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
                onClick={cancelDeleteAction}
              >
                Cancel
              </button>
              <button
                className="px-6 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                onClick={confirmDeleteAction}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}