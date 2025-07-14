
import React, { useState } from "react";
import React, { useState, useEffect } from "react";     
import { ChevronsUpDown } from "lucide-react";

export default function Management() {
  // State for dropdown visibility
  const [showFuelTypeDropdown, setShowFuelTypeDropdown] = useState(false);
  const [showFleetCardDropdown, setShowFleetCardDropdown] = useState(false);
  const [showRfidDropdown, setShowRfidDropdown] = useState(false);

  // Rest of your existing state
  const [activeTab, setActiveTab] = useState("vehicle");
  const [showModal, setShowModal] = useState(false);
  const [vehicles, setVehicles] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [archivedVehicles, setArchivedVehicles] = useState([]);
  const [archivedDrivers, setArchivedDrivers] = useState([]);
  const [confirmDelete, setConfirmDelete] = useState({ type: null, idx: null });
  const [duplicateModal, setDuplicateModal] = useState({ show: false, type: "" });
  
  // Prevent page scroll
    useEffect(() => {
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = "auto";
      };
    }, []);
    
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

  // Tab styling function
  const tabClass = (tab) =>
    `py-2 px-4 text-sm font-medium ${
      activeTab === tab
        ? "text-green-600 border-b-3 border-green-700"
        : "text-gray-600 hover:text-green-700"
    }`;

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

  // Confirm deletion - moves to archive
  const confirmDeleteAction = () => {
    if (confirmDelete.type === "vehicle") {
      const vehicleToArchive = vehicles[confirmDelete.idx];
      setArchivedVehicles([...archivedVehicles, vehicleToArchive]);
      setVehicles(vehicles.filter((_, i) => i !== confirmDelete.idx));
    } else if (confirmDelete.type === "driver") {
      const driverToArchive = drivers[confirmDelete.idx];
      setArchivedDrivers([...archivedDrivers, driverToArchive]);
      setDrivers(drivers.filter((_, i) => i !== confirmDelete.idx));
    }
    setConfirmDelete({ type: null, idx: null });
  };

  // Cancel deletion
  const cancelDeleteAction = () => {
    setConfirmDelete({ type: null, idx: null });
  };

  // Handle restoring items from archive
  const handleRestore = (type, idx) => {
    if (type === "vehicle") {
      const vehicleToRestore = archivedVehicles[idx];
      setVehicles([...vehicles, vehicleToRestore]);
      setArchivedVehicles(archivedVehicles.filter((_, i) => i !== idx));
    } else if (type === "driver") {
      const driverToRestore = archivedDrivers[idx];
      setDrivers([...drivers, driverToRestore]);
      setArchivedDrivers(archivedDrivers.filter((_, i) => i !== idx));
    }
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
    <div className="p-6 relative pb-16">
      <h1 className="text-3xl font-bold mb-6">Management</h1>

      <div className="relative flex border-b mb-4 space-x-2">
        <button className={tabClass("vehicle")} onClick={() => setActiveTab("vehicle")}>
          VEHICLE DETAIL
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

      {activeTab === "vehicle" && (
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-200 rounded-xl shadow-md text-sm">
            <thead>
              <tr className="bg-green-700 md:bg-green-600 text-white text-left">
                <th className="p-3">VEHICLE</th>
                <th className="p-3">PLATE NO.</th>
                <th className="p-3 text-center">CAPACITY</th>
                <th className="p-3">FUEL TYPE</th>
                <th className="p-3">FLEET CARD</th>
                <th className="p-3">RFID</th>
                <th className="p-3 text-center"></th>
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
                      <span className={`px-2 py-1 rounded-md text-xs bg-green-100
                        ${v.fleetCard?.toLowerCase() === "available" ? "md:bg-green-200 text-green-700" : "md:bg-red-200 text-red-700"}`}>
                        {v.fleetCard?.toUpperCase()}
                      </span>
                    </td>
                    <td className="p-3">
                      <span className={`px-2 py-1 rounded-md text-xs bg-green-100
                        ${v.rfid?.toLowerCase() === "available" ? "md:bg-green-200 text-green-700" : "md:bg-red-200 text-red-700"}`}>
                        {v.rfid?.toUpperCase()}
                      </span>
                    </td>
                    <td className="p-3 text-center">
                      <button
                        className="px-3 py-1 bg-red-500 md:bg-red-600 text-white rounded hover:bg-red-700 transition text-xs"
                        type="button"
                        onClick={() => handleDeleteVehicle(idx)}
                      >
                        Archive
                      </button>
                    </td>
                  </tr>
                ))
              )}
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
                <th className="p-3 text-center"></th>
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
                        Archive
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === "archive" && (
        <div className="space-y-6">
          {/* Archived Vehicles */}
          <div>
            <h2 className="text-xl font-semibold mb-3">Archived Vehicles</h2>
            {archivedVehicles.length === 0 ? (
              <p className="text-gray-400">No archived vehicles</p>
            ) : (
              <table className="min-w-full border border-gray-200 rounded-md shadow-md text-sm">
                <thead>
                  <tr className="bg-gray-600 text-white text-left">
                    <th className="p-3">VEHICLE</th>
                    <th className="p-3">PLATE NO.</th>
                    <th className="p-3 text-center">CAPACITY</th>
                    <th className="p-3">FUEL TYPE</th>
                    <th className="p-3">FLEET CARD</th>
                    <th className="p-3">RFID</th>
                    <th className="p-3 text-center">...</th>
                  </tr>
                </thead>
                <tbody>
                  {archivedVehicles.map((v, idx) => (
                    <tr key={idx} className="border-t text-black">
                      <td className="p-3">{v.vehicleType}</td>
                      <td className="p-3">{v.plateNo}</td>
                      <td className="p-3 text-center">{v.capacity}</td>
                      <td className="p-3 font-semibold">{v.fuelType}</td>
                      <td className="p-3">
                        <span className="bg-gray-200 text-gray-700 px-2 py-1 rounded-md text-xs">
                          {v.fleetCard?.toUpperCase()}
                        </span>
                      </td>
                      <td className="p-3">
                        <span className="bg-gray-200 text-gray-700 px-2 py-1 rounded-md text-xs">
                          {v.rfid?.toUpperCase()}
                        </span>
                      </td>
                      <td className="p-3 text-center">
                        <button
                          className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 transition text-xs"
                          onClick={() => handleRestore("vehicle", idx)}
                        >
                          Restore
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {/* Archived Drivers */}
          <div>
            <h2 className="text-xl font-semibold mb-3">Archived Drivers</h2>
            {archivedDrivers.length === 0 ? (
              <p className="text-gray-400">No archived drivers</p>
            ) : (
              <table className="min-w-full border border-gray-200 rounded-md shadow-md text-sm">
                <thead>
                  <tr className="bg-gray-600 text-white text-left">
                    <th className="p-3">NAME</th>
                    <th className="p-3">CONTACT NO.</th>
                    <th className="p-3">EMAIL ADDRESS</th>
                    <th className="p-3">STATUS</th>
                    <th className="p-3 text-center">...</th>
                  </tr>
                </thead>
                <tbody>
                  {archivedDrivers.map((d, idx) => (
                    <tr key={idx} className="border-t text-black">
                      <td className="p-3">{d.name}</td>
                      <td className="p-3">{d.contact}</td>
                      <td className="p-3">{d.email}</td>
                      <td className="p-3">
                        <span className="bg-gray-200 text-gray-700 px-2 py-1 rounded-md text-xs">
                          {d.status}
                        </span>
                      </td>
                      <td className="p-3 text-center">
                        <button
                          className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 transition text-xs"
                          onClick={() => handleRestore("driver", idx)}
                        >
                          Restore
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}

      {/* Modal for Vehicle Information */}
      {activeTab === "vehicle" && showModal && (
        <div className="fixed inset-0 bg-opacity-30 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md relative">
            <div className="p-6">
               <h2 className="text-xl font-bold text-gray-800 mb-4 text-center">Vehicle Information</h2> 
              <form className="space-y-4" onSubmit={handleVehicleSubmit}>
                {/* Vehicle Type */}
                <div>
                  <label className="block text-sm font-medium align-center text-gray-700 mb-1">Vehicle Type</label>
                  <input
                    type="text"
                    className="w-full border border-gray-700 rounded-lg px-3 py-2"
                    value={vehicleForm.vehicleType}
                    onChange={e => setVehicleForm({ ...vehicleForm, vehicleType: e.target.value })}
                    required
                  />
                </div>

                {/* Plate No. and Capacity */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Plate No.</label>
                      <input
                        type="text"
                        className="w-full border border-gray-700 rounded-lg px-3 py-2"
                        value={vehicleForm.plateNo}
                        onChange={e => {
                          let val = e.target.value.toUpperCase();
                          val = val.replace(/[^A-Z0-9\- ]/g, "");
                          const match = val.match(/^([A-Z]{0,3})([\- ]?)([0-9]{0,4})$/);
                          if (match) {
                            setVehicleForm({ ...vehicleForm, plateNo: val });
                          }
                        }}
                        maxLength={8}
                        pattern="^[A-Za-z]{3}[\- ]?[0-9]{3,4}$"
                        required
                      />
                    </div>
                    <div>
                      {/* Capacity */}
                      <label className="block text-sm font-medium text-gray-700 mb-1">Capacity</label>
                      <div className="relative">
                        <input
                          type="text"
                          inputMode="numeric"
                          pattern="[0-9]*"
                          className="w-full border border-gray-700 rounded-lg px-3 py-2 text-center"
                          value={vehicleForm.capacity}
                          onChange={e => {
                            let val = e.target.value.replace(/[^0-9]/g, "").slice(0, 2);
                            if (val === "" || (parseInt(val) >= 1 && parseInt(val) <= 20)) {
                              setVehicleForm({ ...vehicleForm, capacity: val });
                            }
                          }}
                          maxLength={2}
                          required
                        />
                        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex flex-col">
                          <button
                            type="button"
                            className="text-gray-500 hover:text-gray-700 focus:outline-none"
                            onClick={() => {
                              const current = parseInt(vehicleForm.capacity) || 0;
                              if (current < 20) {
                                setVehicleForm({ ...vehicleForm, capacity: (current + 1).toString() });
                              }
                            }}
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                            </svg>
                          </button>
                          <button
                            type="button"
                            className="text-gray-500 hover:text-gray-700 focus:outline-none"
                            onClick={() => {
                              const current = parseInt(vehicleForm.capacity) || 1;
                              if (current > 1) {
                                setVehicleForm({ ...vehicleForm, capacity: (current - 1).toString() });
                              }
                            }}
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                {/* Fuel Type Dropdown */}
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-1">Fuel Type</label>
                <button
                  type="button"
                  className="w-full border border-gray-700 rounded-lg px-3 py-2 flex items-center justify-between hover:bg-gray-50"
                  onClick={() => setShowFuelTypeDropdown(!showFuelTypeDropdown)}
                >
                  <span className="text-gray-400">{vehicleForm.fuelType || "Select Fuel Type"}</span>
                  <ChevronsUpDown className="h-4 w-4 text-gray-400" />
                </button>
                {showFuelTypeDropdown && (
                  <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg">
                    {["BIO-DIESEL", "DIESEL", "KEROSENE"].map((type) => (
                      <button
                        key={type}
                        type="button"
                        className={`w-full text-left px-3 py-2 hover:bg-gray-100 ${
                          vehicleForm.fuelType === type ? "bg-gray-100 font-medium" : ""
                        }`}
                        onClick={() => {
                          setVehicleForm({ ...vehicleForm, fuelType: type });
                          setShowFuelTypeDropdown(false);
                        }}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Fleet Card Dropdown */}
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-1">Fleet Card</label>
                <button
                  type="button"
                  className="w-full border border-gray-700 rounded-lg px-3 py-2 flex items-center justify-between hover:bg-gray-50"
                  onClick={() => setShowFleetCardDropdown(!showFleetCardDropdown)}
                >
                  <span className="text-gray-400">{vehicleForm.fleetCard || "Select Fleet Card"}</span>
                  <ChevronsUpDown className="h-4 w-4 text-gray-400" />
                </button>
                {showFleetCardDropdown && (
                  <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg">
                    {["Available", "Unavailable"].map((status) => (
                      <button
                        key={status}
                        type="button"
                        className={`w-full text-left px-3 py-2 hover:bg-gray-100 ${
                          vehicleForm.fleetCard === status ? "bg-gray-100 font-medium" : ""
                        }`}
                        onClick={() => {
                          setVehicleForm({ ...vehicleForm, fleetCard: status });
                          setShowFleetCardDropdown(false);
                        }}
                      >
                        {status}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* RFID Dropdown */}
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-1">RFID</label>
                <button
                  type="button"
                  className="w-full border border-gray-700 rounded-lg px-3 py-2 flex items-center justify-between hover:bg-gray-50"
                  onClick={() => setShowRfidDropdown(!showRfidDropdown)}
                >
                  <span className="text-gray-400">{vehicleForm.rfid || "Select RFID"}</span>
                  <ChevronsUpDown className="h-4 w-4 text-gray-400" />
                </button>
                {showRfidDropdown && (
                  <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg">
                    {["Available", "Unavailable"].map((status) => (
                      <button
                        key={status}
                        type="button"
                        className={`w-full text-left px-3 py-2 hover:bg-gray-100 ${
                          vehicleForm.rfid === status ? "bg-gray-100 font-medium" : ""
                        }`}
                        onClick={() => {
                          setVehicleForm({ ...vehicleForm, rfid: status });
                          setShowRfidDropdown(false);
                        }}
                      >
                        {status}
                      </button>
                    ))}
                  </div>
                )}
              </div>

                {/* Buttons */}
                <div className="flex justify-end gap-3 pt-4">
                  <button
                    type="button"
                    className="px-4 py-2 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                    onClick={() => setShowModal(false)}
                  >
                    Discard
                  </button>
                  <button
                    type="submit"
                    className={`px-4 py-2 bg-green-700 rounded-lg font-medium text-white hover:bg-green-800 transition-colors ${
                      !isVehicleFormValid() ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                    disabled={!isVehicleFormValid()}
                  >
                    Add Vehicle
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Modal for Driver Information */}
          {activeTab === "driver" && showModal && (
            <div className="fixed inset-0 bg-opacity-30 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-xl shadow-xl w-full max-w-md relative">
                <div className="p-6">
                  <h2 className="text-xl font-bold text-gray-800 mb-4">Driver Information</h2>
                  <form className="space-y-4" onSubmit={handleDriverSubmit}>
                    
                    {/* Name */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                      <input
                        type="text"
                        className="w-full border border-gray-700 rounded-lg px-3 py-2"
                        value={driverForm.name}
                        onChange={e => setDriverForm({ ...driverForm, name: e.target.value })}
                        required
                      />
                    </div>
                    
                   {/* Contact No. */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Contact No.</label>
                      <div className="flex"> 
                        <div className="w-20 mr-2">
                          <input
                            type="text"
                            className="w-full border border-gray-700 rounded-lg px-3 py-2"
                            value="+63"
                            readOnly
                          />
                        </div>
                        <div className="flex-1">
                          <input
                            type="text"
                            className="w-full border border-gray-700 rounded-lg px-3 py-2"
                            maxLength={13} // 10 digits + 2 spaces
                            value={driverForm.contact.replace('+63 ', '')}
                            onChange={handleContactChange}
                            placeholder="912 345 6789"
                            required
                          />
                        </div>
                      </div>
                    </div>
                    
                    {/* Email Address */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                      <input
                        type="email"
                        className="w-full border border-gray-700 rounded-lg px-3 py-2"
                        value={driverForm.email}
                        onChange={e => setDriverForm({ ...driverForm, email: e.target.value })}
                        required
                      />
                    </div>

                    {/* Buttons */}
                    <div className="flex justify-end gap-3 pt-4">
                      <button
                        type="button"
                        className="px-4 py-2 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                        onClick={() => setShowModal(false)}
                      >
                        Discard
                      </button>
                      <button
                        type="submit"
                        className={`px-4 py-2 bg-green-700 rounded-lg font-medium text-white hover:bg-green-800 transition-colors ${
                          !isDriverFormValid() ? "opacity-50 cursor-not-allowed" : ""
                        }`}
                        disabled={!isDriverFormValid()}
                      >
                        Add Driver
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          )}

      {/* Duplicate Modal - Already Exists on the list */}
      {duplicateModal.show && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-opacity-40">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-xs p-8 text-center">
            <div className="text-lg font-semibold mb-4 text-red-600">Already Exists</div>
            <div className="mb-6 text-gray-700">
              This {duplicateModal.type} already exists in the system.
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

      {/* Archive Confirmation Modal */}
      {confirmDelete.type && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-opacity-40">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-xs p-8 text-center">
            <div className="text-lg font-semibold mb-4 text-red-600">Confirm Archive</div>
            <div className="mb-6 text-gray-700 text-sm">
              Are you sure you want to archive this {confirmDelete.type === "vehicle" ? "vehicle" : "driver"}?
              <br />
              (It will be moved to the Archive tab)
            </div>
            <div className="flex justify-center space-x-4">
              <button
                className="px-6 py-2 bg-gray-200 text-gray-800 text-sm rounded hover:bg-gray-300"
                onClick={cancelDeleteAction}
              >
                Cancel
              </button>
              <button
                className="px-4 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700"
                onClick={confirmDeleteAction}
              >
                Archive
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Archive button in bottom right corner */}
      <button
        className="fixed bottom-4 right-13 py-1 px-4 bg-gray-600 text-white text-sm rounded-md hover:bg-gray-700 transition duration-300 flex items-center space-x-1 shadow-lg"
        onClick={() => setActiveTab("archive")}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path d="M5 4a1 1 0 00-2 0v7.268a2 2 0 000 3.464V16a1 1 0 102 0v-1.268a2 2 0 000-3.464V4zM11 4a1 1 0 10-2 0v1.268a2 2 0 000 3.464V16a1 1 0 102 0V8.732a2 2 0 000-3.464V4zM16 3a1 1 0 011 1v7.268a2 2 0 010 3.464V16a1 1 0 11-2 0v-1.268a2 2 0 010-3.464V4a1 1 0 011-1z" />
        </svg>
        <span>Archive</span>
      </button>
    </div>
  );
}