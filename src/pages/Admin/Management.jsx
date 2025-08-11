import React, { useState, useEffect } from "react";     
import { ChevronsUpDown, Archive, Plus, X, Check, ChevronUp, ChevronDown } from "lucide-react";

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
    `py-3 px-6 text-sm font-medium transition-colors ${
      activeTab === tab
        ? "text-green-600 border-b-2 border-green-600 bg-green-50"
        : "text-gray-500 hover:text-green-600 hover:bg-green-50"
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

  // Toggle archive view
  const toggleArchiveView = () => {
    setActiveTab(activeTab === "archive" ? "vehicle" : "archive");
  };

  return (
    <div className="p-6 relative pb-16 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl md:text-3xl font-bold mb-6 text-gray-800">Management</h1>

        {(activeTab === "vehicle" || activeTab === "driver") && (
          <div className="flex justify-end mb-4">
            <button
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors text-sm"
              onClick={handleAddClick}
            >
              <Plus size={16} />
              Add New
            </button>
          </div>
        )}
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden mb-6">
          <div className="flex border-b">
            <button 
              className={tabClass("vehicle")} 
              onClick={() => setActiveTab("vehicle")}
            >
              Vehicle Details
            </button>
            <button 
              className={tabClass("driver")} 
              onClick={() => setActiveTab("driver")}
            >
              Driver Information
            </button>
          </div>

          <div className="p-4">
            {activeTab === "vehicle" && (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-green-600">
                    <tr className="text-left text-xs font-medium text-white -500 uppercase tracking-wider">
                      <th className="px-6 py-3">Vehicle</th>
                      <th className="px-6 py-3">Plate No.</th>
                      <th className="px-6 py-3 text-center">Capacity</th>
                      <th className="px-6 py-3">Fuel Type</th>
                      <th className="px-6 py-3">Fleet Card</th>
                      <th className="px-6 py-3">RFID</th>
                      <th className="px-6 py-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {vehicles.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="px-6 py-4 text-center text-gray-500">
                          No vehicles added yet
                        </td>
                      </tr>
                    ) : (
                      vehicles.map((v, idx) => (
                        <tr key={idx} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {v.vehicleType}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {v.plateNo}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                            {v.capacity}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-semibold">
                            {v.fuelType}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              v.fleetCard?.toLowerCase() === "available" 
                                ? "bg-green-100 text-green-800" 
                                : "bg-red-100 text-red-800"
                            }`}>
                              {v.fleetCard?.toUpperCase()}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              v.rfid?.toLowerCase() === "available" 
                                ? "bg-green-100 text-green-800" 
                                : "bg-red-100 text-red-800"
                            }`}>
                              {v.rfid?.toUpperCase()}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <button
                              className="text-red-600 hover:text-red-900 flex items-center gap-1"
                              onClick={() => handleDeleteVehicle(idx)}
                            >
                              <Archive size={14} />
                              <span>Archive</span>
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
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-green-600">
                    <tr className="text-left text-xs font-medium text-white -500 uppercase tracking-wider">
                      <th className="px-6 py-3">Name</th>
                      <th className="px-6 py-3">Contact No.</th>
                      <th className="px-6 py-3">Email Address</th>
                      <th className="px-6 py-3">Status</th>
                      <th className="px-6 py-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {drivers.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                          No drivers added yet
                        </td>
                      </tr>
                    ) : (
                      drivers.map((d, idx) => (
                        <tr key={idx} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {d.name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {d.contact}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {d.email}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              {d.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <button
                              className="text-red-600 hover:text-red-900 flex items-center gap-1"
                              onClick={() => handleDeleteDriver(idx)}
                            >
                              <Archive size={14} />
                              <span>Archive</span>
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
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                  <div className="px-6 py-4 border-b border-gray-200">
                    <h2 className="text-lg font-semibold text-gray-800">Archived Vehicles</h2>
                  </div>
                  <div className="p-4">
                    {archivedVehicles.length === 0 ? (
                      <p className="text-gray-500 text-center py-4">No archived vehicles</p>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead className="bg-gray-50">
                            <tr className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              <th className="px-6 py-3">Vehicle</th>
                              <th className="px-6 py-3">Plate No.</th>
                              <th className="px-6 py-3 text-center">Capacity</th>
                              <th className="px-6 py-3">Fuel Type</th>
                              <th className="px-6 py-3">Fleet Card</th>
                              <th className="px-6 py-3">RFID</th>
                              <th className="px-6 py-3 text-right">Actions</th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {archivedVehicles.map((v, idx) => (
                              <tr key={idx} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                  {v.vehicleType}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                  {v.plateNo}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                                  {v.capacity}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                  {v.fuelType}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                    {v.fleetCard?.toUpperCase()}
                                  </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                    {v.rfid?.toUpperCase()}
                                  </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                  <button
                                    className="text-green-600 hover:text-green-900"
                                    onClick={() => handleRestore("vehicle", idx)}
                                  >
                                    Restore
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                </div>

                {/* Archived Drivers */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                  <div className="px-6 py-4 border-b border-gray-200">
                    <h2 className="text-lg font-semibold text-gray-800">Archived Drivers</h2>
                  </div>
                  <div className="p-4">
                    {archivedDrivers.length === 0 ? (
                      <p className="text-gray-500 text-center py-4">No archived drivers</p>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead className="bg-gray-50">
                            <tr className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              <th className="px-6 py-3">Name</th>
                              <th className="px-6 py-3">Contact No.</th>
                              <th className="px-6 py-3">Email Address</th>
                              <th className="px-6 py-3">Status</th>
                              <th className="px-6 py-3 text-right">Actions</th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {archivedDrivers.map((d, idx) => (
                              <tr key={idx} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                  {d.name}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                  {d.contact}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                  {d.email}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                    {d.status}
                                  </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                  <button
                                    className="text-green-600 hover:text-green-900"
                                    onClick={() => handleRestore("driver", idx)}
                                  >
                                    Restore
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Modal for Vehicle Information */}
        {activeTab === "vehicle" && showModal && (
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-lg w-full max-w-md">
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold text-gray-800">Add New Vehicle</h2>
                  <button 
                    onClick={() => setShowModal(false)}
                    className="text-gray-400 hover:text-gray-500"
                  >
                    <X size={20} />
                  </button>
                </div>
                <form className="space-y-4" onSubmit={handleVehicleSubmit}>
                  {/* Vehicle Type */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Vehicle Type</label>
                    <input
                      type="text"
                      className={`w-full border ${document.activeElement === this ? 'border-green-500 ring-2 ring-green-200' : 'border-gray-300'} rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-green-500`}
                      value={vehicleForm.vehicleType}
                      onChange={e => setVehicleForm({ ...vehicleForm, vehicleType: e.target.value })}
                      onFocus={() => {
                        setShowFuelTypeDropdown(false);
                        setShowFleetCardDropdown(false);
                        setShowRfidDropdown(false);
                      }}
                      required
                    />
                  </div>

                  {/* Plate No. and Capacity */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Plate No.</label>
                      <input
                        type="text"
                        className={`w-full border ${document.activeElement === this ? 'border-green-500 ring-2 ring-green-200' : 'border-gray-300'} rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-green-500`}
                        value={vehicleForm.plateNo}
                        onChange={e => {
                          let val = e.target.value.toUpperCase();
                          val = val.replace(/[^A-Z0-9\- ]/g, "");
                          const match = val.match(/^([A-Z]{0,3})([\- ]?)([0-9]{0,4})$/);
                          if (match) {
                            setVehicleForm({ ...vehicleForm, plateNo: val });
                          }
                        }}
                        onFocus={() => {
                          setShowFuelTypeDropdown(false);
                          setShowFleetCardDropdown(false);
                          setShowRfidDropdown(false);
                        }}
                        maxLength={8}
                        pattern="^[A-Za-z]{3}[\- ]?[0-9]{3,4}$"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Capacity</label>
                      <div className="relative">
                        <input
                          type="text"
                          inputMode="numeric"
                          pattern="[0-9]*"
                          className={`w-full border ${document.activeElement === this ? 'border-green-500 ring-2 ring-green-200' : 'border-gray-300'} rounded-lg px-3 py-2 text-center focus:ring-2 focus:ring-green-500 focus:border-green-500`}
                          value={vehicleForm.capacity}
                          onChange={e => {
                            let val = e.target.value.replace(/[^0-9]/g, "").slice(0, 2);
                            if (val === "" || (parseInt(val) >= 1 && parseInt(val) <= 20)) {
                              setVehicleForm({ ...vehicleForm, capacity: val });
                            }
                          }}
                          onFocus={() => {
                            setShowFuelTypeDropdown(false);
                            setShowFleetCardDropdown(false);
                            setShowRfidDropdown(false);
                          }}
                          maxLength={2}
                          required
                        />
                        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex flex-col space-y-0.5">
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
                            <ChevronUp size={16} />
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
                            <ChevronDown size={16} />
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
                      className={`w-full border ${showFuelTypeDropdown ? 'border-green-500 ring-2 ring-green-200' : 'border-gray-300'} rounded-lg px-3 py-2 flex items-center justify-between hover:bg-gray-50`}
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowFuelTypeDropdown(!showFuelTypeDropdown);
                        setShowFleetCardDropdown(false);
                        setShowRfidDropdown(false);
                      }}
                    >
                      <span className={vehicleForm.fuelType ? "text-gray-900" : "text-gray-400"}>
                        {vehicleForm.fuelType || "Select Fuel Type"}
                      </span>
                      <ChevronDown 
                        className={`h-4 w-4 text-gray-400 transition-transform ${showFuelTypeDropdown ? "rotate-180" : ""}`}
                      />
                    </button>
                    {showFuelTypeDropdown && (
                      <div 
                        className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg transition-all duration-200 ease-in-out transform origin-top"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {["BIO-DIESEL", "DIESEL", "KEROSENE"].map((type) => (
                          <button
                            key={type}
                            type="button"
                            className={`w-full text-left px-3 py-2 hover:bg-gray-100 text-sm ${
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
                      className={`w-full border ${showFleetCardDropdown ? 'border-green-500 ring-2 ring-green-200' : 'border-gray-300'} rounded-lg px-3 py-2 flex items-center justify-between hover:bg-gray-50`}
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowFleetCardDropdown(!showFleetCardDropdown);
                        setShowFuelTypeDropdown(false);
                        setShowRfidDropdown(false);
                      }}
                    >
                      <span className={vehicleForm.fleetCard ? "text-gray-900" : "text-gray-400"}>
                        {vehicleForm.fleetCard || "Select Fleet Card"}
                      </span>
                      <ChevronDown 
                        className={`h-4 w-4 text-gray-400 transition-transform ${showFleetCardDropdown ? "rotate-180" : ""}`}
                      />
                    </button>
                    {showFleetCardDropdown && (
                      <div 
                        className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg transition-all duration-200 ease-in-out transform origin-top"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {["Available", "Unavailable"].map((status) => (
                          <button
                            key={status}
                            type="button"
                            className={`w-full text-left px-3 py-2 hover:bg-gray-100 text-sm ${
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
                      className={`w-full border ${showRfidDropdown ? 'border-green-500 ring-2 ring-green-200' : 'border-gray-300'} rounded-lg px-3 py-2 flex items-center justify-between hover:bg-gray-50`}
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowRfidDropdown(!showRfidDropdown);
                        setShowFuelTypeDropdown(false);
                        setShowFleetCardDropdown(false);
                      }}
                    >
                      <span className={vehicleForm.rfid ? "text-gray-900" : "text-gray-400"}>
                        {vehicleForm.rfid || "Select RFID"}
                      </span>
                      <ChevronDown 
                        className={`h-4 w-4 text-gray-400 transition-transform ${showRfidDropdown ? "rotate-180" : ""}`}
                      />
                    </button>
                    {showRfidDropdown && (
                      <div 
                        className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg transition-all duration-200 ease-in-out transform origin-top"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {["Available", "Unavailable"].map((status) => (
                          <button
                            key={status}
                            type="button"
                            className={`w-full text-left px-3 py-2 hover:bg-gray-100 text-sm ${
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
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className={`px-4 py-2 bg-green-600 rounded-lg font-medium text-white hover:bg-green-700 transition-colors ${
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
          <div className="fixed inset-0  flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-lg w-full max-w-md">
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold text-gray-800">Add New Driver</h2>
                  <button 
                    onClick={() => setShowModal(false)}
                    className="text-gray-400 hover:text-gray-500"
                  >
                    <X size={20} />
                  </button>
                </div>
                <form className="space-y-4" onSubmit={handleDriverSubmit}>
                  {/* Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                    <input
                      type="text"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-green-500"
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
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-gray-100"
                          value="+63"
                          readOnly
                        />
                      </div>
                      <div className="flex-1">
                        <input
                          type="text"
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-green-500"
                          maxLength={13}
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
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-green-500"
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
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className={`px-4 py-2 bg-green-600 rounded-lg font-medium text-white hover:bg-green-700 transition-colors ${
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
          <div className="fixed inset-0 z-50 flex items-center justify-center ">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-xs p-6 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100 mb-4">
                <X className="h-6 w-6 text-red-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Already Exists</h3>
              <div className="mb-6 text-gray-500 text-sm">
                This {duplicateModal.type} already exists in the system.
              </div>
              <button
                className="w-full px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                onClick={() => setDuplicateModal({ show: false, type: "" })}
              >
                OK
              </button>
            </div>
          </div>
        )}

        {/* Archive Confirmation Modal */}
        {confirmDelete.type && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-xs p-6 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100 mb-4">
                <Archive className="h-6 w-6 text-red-600" />
              </div>
              <h3 className="text-lg font-medium mb-2">Confirm Archive</h3>
              <div className="mb-6 text-gray-500 text-sm">
                Are you sure you want to archive this {confirmDelete.type}?
                <br />
                (It will be moved to the Archive tab)
              </div>
              <div className="flex gap-3">
                <button
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                  onClick={cancelDeleteAction}
                >
                  Cancel
                </button>
                <button
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
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
          className={`fixed bottom-4 right-13 py-2 px-4 rounded-lg hover:bg-green-500 hover:text-white transition-colors flex items-center gap-2 shadow-sm mb-8 ${
            activeTab === "archive" ? "bg-green-600 text-white" : "bg-white text-green-600"
          }`}
          onClick={toggleArchiveView}
        >
          <Archive size={18} />
          <span className="text-sm">Archive</span>
        </button>
      </div>
    </div>
  );
}