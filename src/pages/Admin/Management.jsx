// src/components/Management.js
import React, { useState, useEffect } from "react";
import { ChevronsUpDown, Archive, Plus, X, Check, ChevronUp, ChevronDown } from "lucide-react";
import { api } from "../../services/api";

export default function Management() {
  // Dropdown states
  const [showFuelTypeDropdown, setShowFuelTypeDropdown] = useState(false);
  const [showFleetCardDropdown, setShowFleetCardDropdown] = useState(false);
  const [showRfidDropdown, setShowRfidDropdown] = useState(false);

  // Main states
  const [activeTab, setActiveTab] = useState("vehicle");
  const [showModal, setShowModal] = useState(false);
  const [vehicles, setVehicles] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [archivedVehicles, setArchivedVehicles] = useState([]);
  const [archivedDrivers, setArchivedDrivers] = useState([]);
  const [confirmDelete, setConfirmDelete] = useState({ type: null, idx: null });
  const [duplicateModal, setDuplicateModal] = useState({ show: false, type: "" });
  const [isSubmittingVehicle, setIsSubmittingVehicle] = useState(false);
  const [isSubmittingDriver, setIsSubmittingDriver] = useState(false);

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

  // PREVENT PAGE SCROLL
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    document.body.style.position = 'fixed';
    document.body.style.width = '100%';
    return () => {
      document.body.style.overflow = 'auto';
      document.body.style.position = '';
      document.body.style.width = '';
    };
  }, []);

  // Prevent background scroll when modals are open
  useEffect(() => {
    const hasModalOpen = showModal || duplicateModal.show || confirmDelete.type;
    document.body.style.overflow = hasModalOpen ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [showModal, duplicateModal.show, confirmDelete.type]);

  // Fetch all data on mount
  useEffect(() => {
    let mounted = true;
    const fetchData = async () => {
      try {
        const [
          vehiclesData,
          driversData,
          archivedVehiclesData,
          archivedDriversData,
        ] = await Promise.all([
          api.getVehicles(),
          api.getDrivers(),
          api.getArchivedVehicles(),
          api.getArchivedDrivers(),
        ]);
        if (!mounted) return;
        setVehicles(vehiclesData || []);
        setDrivers(driversData || []);
        setArchivedVehicles(archivedVehiclesData || []);
        setArchivedDrivers(archivedDriversData || []);
      } catch (err) {
        console.error("Failed to fetch data:", err);
      }
    };
    fetchData();
    return () => {
      mounted = false;
    };
  }, []);

  // Reset form and open modal
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

  // Tab styling helper
  const tabClass = (tab) =>
    `py-3 px-6 text-sm font-medium transition-colors ${
      activeTab === tab
        ? "text-green-600 border-b-2 border-green-600 bg-green-50"
        : "text-gray-500 hover:text-green-600 hover:bg-green-50"
    }`;

  // Format contact number (Philippines style)
  const formatContact = (value) => {
    let digits = value.replace(/\D/g, "").slice(0, 11);
    if (digits.length > 4 && digits.length <= 7) {
      return `${digits.slice(0, 4)}-${digits.slice(4)}`;
    } else if (digits.length > 7) {
      return `${digits.slice(0, 4)}-${digits.slice(4, 7)}-${digits.slice(7)}`;
    }
    return digits;
  };

  const handleContactChange = (e) => {
    const formatted = formatContact(e.target.value);
    setDriverForm({ ...driverForm, contact: formatted });
  };

  // Normalize to E.164
  const toE164 = (contact) => {
    let clean = contact.replace(/\D/g, "");
    if (clean.startsWith("9") && clean.length === 10) {
      return "+63" + clean;
    }
    if (clean.startsWith("63") && clean.length === 11) {
      return "+" + clean;
    }
    return "+" + clean;
  };

  // Form validation
  const isVehicleFormValid = () =>
    vehicleForm.vehicleType.trim() &&
    vehicleForm.plateNo.trim() &&
    vehicleForm.capacity &&
    vehicleForm.fuelType &&
    vehicleForm.fleetCard &&
    vehicleForm.rfid;

  const isDriverFormValid = () =>
    driverForm.name.trim() &&
    driverForm.contact.trim() &&
    driverForm.email.trim();

  // Submit handlers
  const handleVehicleSubmit = async (e) => {
    e.preventDefault();
    if (vehicles.some(v => v.plateNo?.trim().toLowerCase() === vehicleForm.plateNo.trim().toLowerCase())) {
      setDuplicateModal({ show: true, type: "vehicle" });
      return;
    }
    setIsSubmittingVehicle(true);
    try {
      const payload = {
        vehicleType: vehicleForm.vehicleType,
        plateNo: vehicleForm.plateNo,
        capacity: parseInt(vehicleForm.capacity, 10),
        fuelType: vehicleForm.fuelType,
        fleetCard: vehicleForm.fleetCard,
        rfid: vehicleForm.rfid,
      };
      const newVehicle = await api.createVehicle(payload);
      setVehicles((prev) => [...prev, newVehicle]);
      setShowModal(false);
    } catch (err) {
      if (err.response?.status === 409) {
        setDuplicateModal({ show: true, type: "vehicle" });
      } else {
        console.error("Vehicle submit error:", err);
        alert("Could not add vehicle. See console for details.");
      }
    } finally {
      setIsSubmittingVehicle(false);
    }
  };

  const handleDriverSubmit = async (e) => {
    e.preventDefault();
    if (drivers.some(d => d.email?.trim().toLowerCase() === driverForm.email.trim().toLowerCase())) {
      setDuplicateModal({ show: true, type: "driver" });
      return;
    }
    setIsSubmittingDriver(true);
    try {
      const payload = {
        name: driverForm.name,
        contact: toE164(driverForm.contact),
        email: driverForm.email,
      };
      const newDriver = await api.createDriver(payload);
      setDrivers((prev) => [...prev, newDriver]);
      setShowModal(false);
    } catch (err) {
      if (err.response?.status === 409) {
        setDuplicateModal({ show: true, type: "driver" });
      } else {
        console.error("Driver submit error:", err);
        alert("Could not add driver. See console for details.");
      }
    } finally {
      setIsSubmittingDriver(false);
    }
  };

  // Delete/archive handlers
  const handleDeleteVehicle = (idx) => setConfirmDelete({ type: "vehicle", idx });
  const handleDeleteDriver = (idx) => setConfirmDelete({ type: "driver", idx });

  const confirmDeleteAction = async () => {
    const { type, idx } = confirmDelete;
    try {
      if (type === "vehicle") {
        const vehicle = vehicles[idx];
        await api.archiveVehicle(vehicle.id);
        setArchivedVehicles((prev) => [...prev, vehicle]);
        setVehicles((prev) => prev.filter((_, i) => i !== idx));
      } else if (type === "driver") {
        const driver = drivers[idx];
        await api.archiveDriver(driver.id);
        setArchivedDrivers((prev) => [...prev, driver]);
        setDrivers((prev) => prev.filter((_, i) => i !== idx));
      }
    } catch (err) {
      console.error("Archive error:", err);
      alert(`Failed to archive ${type}.`);
    } finally {
      setConfirmDelete({ type: null, idx: null });
    }
  };

  const cancelDeleteAction = () => {
    setConfirmDelete({ type: null, idx: null });
  };

  // Restore from archive
  const handleRestore = async (type, idx) => {
    try {
      if (type === "vehicle") {
        const vehicle = archivedVehicles[idx];
        await api.restoreVehicle(vehicle.id);
        setVehicles((prev) => [...prev, vehicle]);
        setArchivedVehicles((prev) => prev.filter((_, i) => i !== idx));
      } else if (type === "driver") {
        const driver = archivedDrivers[idx];
        await api.restoreDriver(driver.id);
        setDrivers((prev) => [...prev, driver]);
        setArchivedDrivers((prev) => prev.filter((_, i) => i !== idx));
      }
    } catch (err) {
      console.error("Restore error:", err);
      alert(`Failed to restore ${type}.`);
    }
  };

  const toggleArchiveView = () => {
    setActiveTab(activeTab === "archive" ? "vehicle" : "archive");
  };

  // Render helpers
  const getVehicleField = (v, key) => {
    const map = {
      vehicleType: v.vehicleType || v.vehicle_model,
      plateNo: v.plateNo || v.plate_no,
      fuelType: v.fuelType || v.fuel_type,
      fleetCard: v.fleetCard || v.fleet_card_status,
      rfid: v.rfid || v.rfid_status,
    };
    return map[key] || v[key];
  };

  const getDriverField = (d, key) => {
    const map = {
      contact: d.contact || d.contact_no,
      email: d.email || d.email_address,
      status: d.status || (d.assigned_boolean ? "AVAILABLE" : "UNAVAILABLE"),
    };
    return map[key] || d[key];
  };

  return (
    <div className="p-4 sm:p-6 pt-8 pb-16 overflow-x-hidden">
      <div className="max-w-6xl mx-auto">
        {/* Add New Button */}
        {(activeTab === "vehicle" || activeTab === "driver") && (
          <div className="flex justify-end mb-3">
            <button
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors text-sm"
              onClick={handleAddClick}
            >
              <Plus size={16} />
              Add New
            </button>
          </div>
        )}

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="flex border-b">
            <button className={tabClass("vehicle")} onClick={() => setActiveTab("vehicle")}>
              Vehicle Details
            </button>
            <button className={tabClass("driver")} onClick={() => setActiveTab("driver")}>
              Driver Information
            </button>
          </div>
          <div className="p-4">
            {/* VEHICLE TABLE */}
            {activeTab === "vehicle" && (
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <div className="max-h-[60vh] overflow-y-auto">
                  <table className="w-full divide-y divide-gray-200 table-fixed">
                    <thead className="bg-green-600 sticky top-0">
                      <tr>
                        <th className="px-3 py-2 text-left text-[10px] font-medium text-white uppercase tracking-wider w-1/5">Vehicle</th>
                        <th className="px-3 py-2 text-left text-[10px] font-medium text-white uppercase tracking-wider w-1/6">Plate No.</th>
                        <th className="px-3 py-2 text-center text-[10px] font-medium text-white uppercase tracking-wider w-1/12">Capacity</th>
                        <th className="px-3 py-2 text-left text-[10px] font-medium text-white uppercase tracking-wider w-1/6">Fuel Type</th>
                        <th className="px-3 py-2 text-left text-[10px] font-medium text-white uppercase tracking-wider w-1/6">Fleet Card</th>
                        <th className="px-3 py-2 text-left text-[10px] font-medium text-white uppercase tracking-wider w-1/6">RFID</th>
                        <th className="px-3 py-2 text-right text-[10px] font-medium text-white uppercase tracking-wider w-20"></th>
                      </tr>
                    </thead>
                    <tbody className="bg-white">
                      {vehicles.length === 0 ? (
                        <tr>
                          <td colSpan={7} className="px-3 py-4 text-center text-gray-500 text-sm">
                            No vehicles added yet
                          </td>
                        </tr>
                      ) : (
                        vehicles.map((v, idx) => (
                          <tr key={idx} className="hover:bg-gray-50">
                            <td className="px-3 py-2 text-sm font-medium text-gray-900 truncate">
                              {getVehicleField(v, "vehicleType")}
                            </td>
                            <td className="px-3 py-2 text-sm text-gray-500 truncate">
                              {getVehicleField(v, "plateNo")}
                            </td>
                            <td className="px-3 py-2 text-sm text-gray-500 text-center">
                              {v.capacity}
                            </td>
                            <td className="px-3 py-2 text-sm text-gray-500 truncate">
                              {getVehicleField(v, "fuelType")}
                            </td>
                            <td className="px-3 py-2">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                getVehicleField(v, "fleetCard")?.toLowerCase() === "available"
                                  ? "bg-green-100 text-green-800"
                                  : "bg-red-100 text-red-800"
                              }`}>
                                {getVehicleField(v, "fleetCard")?.toUpperCase()}
                              </span>
                            </td>
                            <td className="px-3 py-2">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                getVehicleField(v, "rfid")?.toLowerCase() === "available"
                                  ? "bg-green-100 text-green-800"
                                  : "bg-red-100 text-red-800"
                              }`}>
                                {getVehicleField(v, "rfid")?.toUpperCase()}
                              </span>
                            </td>
                            <td className="px-3 py-2 text-right text-sm font-medium">
                              <button
                                className="text-red-600 hover:text-red-900 flex items-center gap-1 justify-end"
                                onClick={() => handleDeleteVehicle(idx)}
                              >
                                <Archive size={14} />
                                <span></span>
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* DRIVER TABLE */}
            {activeTab === "driver" && (
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <div className="max-h-[60vh] overflow-y-auto">
                  <table className="w-full divide-y divide-gray-200 table-fixed">
                    <thead className="bg-green-600 sticky top-0">
                      <tr>
                        <th className="px-3 py-2 text-left text-[10px] font-medium text-white uppercase tracking-wider w-1/4">Name</th>
                        <th className="px-3 py-2 text-left text-[10px] font-medium text-white uppercase tracking-wider w-1/5">Contact No.</th>
                        <th className="px-3 py-2 text-left text-[10px] font-medium text-white uppercase tracking-wider w-1/4">Email Address</th>
                        <th className="px-3 py-2 text-left text-[10px] font-medium text-white uppercase tracking-wider w-1/6">Status</th>
                        <th className="px-3 py-2 text-right text-[10px] font-medium text-white uppercase tracking-wider w-20"></th>
                      </tr>
                    </thead>
                    <tbody className="bg-white">
                      {drivers.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="px-3 py-4 text-center text-gray-500 text-sm">
                            No drivers added yet
                          </td>
                        </tr>
                      ) : (
                        drivers.map((d, idx) => (
                          <tr key={idx} className="hover:bg-gray-50">
                            <td className="px-3 py-2 text-sm font-medium text-gray-900 truncate">
                              {d.name}
                            </td>
                            <td className="px-3 py-2 text-sm text-gray-500 truncate">
                              {getDriverField(d, "contact")}
                            </td>
                            <td className="px-3 py-2 text-sm text-gray-500 truncate">
                              {getDriverField(d, "email")}
                            </td>
                            <td className="px-3 py-2">
                              <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                {getDriverField(d, "status")}
                              </span>
                            </td>
                            <td className="px-3 py-2 text-right text-sm font-medium">
                              <button
                                className="text-red-600 hover:text-red-900 flex items-center gap-1 justify-end"
                                onClick={() => handleDeleteDriver(idx)}
                              >
                                <Archive size={14} />
                                <span></span>
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* ARCHIVE SECTION — FIXED */}
            {activeTab === "archive" && (
              <div className="space-y-6 max-w-4xl mx-auto">
                {/* Archived Vehicles */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                  <div className="px-4 py-3 border-b border-gray-200">
                    <h2 className="text-base font-semibold text-gray-800 text-center">Archived Vehicles</h2>
                  </div>
                  <div className="p-4">
                    {archivedVehicles.length === 0 ? (
                      <p className="text-gray-500 text-center py-4 text-sm">No archived vehicles</p>
                    ) : (
                      <div className="border border-gray-200 rounded-lg overflow-hidden">
                        <div className="max-h-[200px] overflow-y-auto">
                          <table className="w-full divide-y divide-gray-200 table-fixed">
                            <thead className="bg-gray-50 sticky top-0">
                              <tr>
                                <th className="px-3 py-2 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider w-1/5">Vehicle</th>
                                <th className="px-3 py-2 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider w-1/6">Plate No.</th>
                                <th className="px-3 py-2 text-center text-[10px] font-medium text-gray-500 uppercase tracking-wider w-1/12">Capacity</th>
                                <th className="px-3 py-2 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider w-1/6">Fuel Type</th>
                                <th className="px-3 py-2 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider w-1/6">Fleet Card</th>
                                <th className="px-3 py-2 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider w-1/6">RFID</th>
                                <th className="px-3 py-2 text-right text-[10px] font-medium text-gray-500 uppercase tracking-wider w-20"></th>
                              </tr>
                            </thead>
                            <tbody className="bg-white">
                              {archivedVehicles.map((v, idx) => (
                                <tr key={idx} className="hover:bg-gray-50">
                                  <td className="px-3 py-2 text-sm text-gray-500 truncate">
                                    {getVehicleField(v, "vehicleType")}
                                  </td>
                                  <td className="px-3 py-2 text-sm text-gray-500 truncate">
                                    {getVehicleField(v, "plateNo")}
                                  </td>
                                  <td className="px-3 py-2 text-sm text-gray-500 text-center">
                                    {v.capacity}
                                  </td>
                                  <td className="px-3 py-2 text-sm text-gray-500 truncate">
                                    {getVehicleField(v, "fuelType")}
                                  </td>
                                  <td className="px-3 py-2">
                                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                      {getVehicleField(v, "fleetCard")?.toUpperCase()}
                                    </span>
                                  </td>
                                  <td className="px-3 py-2">
                                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                      {getVehicleField(v, "rfid")?.toUpperCase()}
                                    </span>
                                  </td>
                                  <td className="px-3 py-2 text-right text-sm font-medium">
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
                      </div>
                    )}
                  </div>
                </div>

                {/* Archived Drivers */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                  <div className="px-4 py-3 border-b border-gray-200">
                    <h2 className="text-base font-semibold text-gray-800 text-center">Archived Drivers</h2>
                  </div>
                  <div className="p-4">
                    {archivedDrivers.length === 0 ? (
                      <p className="text-gray-500 text-center py-4 text-sm">No archived drivers</p>
                    ) : (
                      <div className="border border-gray-200 rounded-lg overflow-hidden">
                        <div className="max-h-[200px] overflow-y-auto">
                          <table className="w-full divide-y divide-gray-200 table-fixed">
                            <thead className="bg-gray-50 sticky top-0">
                              <tr>
                                <th className="px-3 py-2 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider w-1/4">Name</th>
                                <th className="px-3 py-2 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider w-1/5">Contact No.</th>
                                <th className="px-3 py-2 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider w-1/4">Email Address</th>
                                <th className="px-3 py-2 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider w-1/6">Status</th>
                                <th className="px-3 py-2 text-right text-[10px] font-medium text-gray-500 uppercase tracking-wider w-20"></th>
                              </tr>
                            </thead>
                            <tbody className="bg-white">
                              {archivedDrivers.map((d, idx) => (
                                <tr key={idx} className="hover:bg-gray-50">
                                  <td className="px-3 py-2 text-sm text-gray-500 truncate">
                                    {d.name}
                                  </td>
                                  <td className="px-3 py-2 text-sm text-gray-500 truncate">
                                    {getDriverField(d, "contact")}
                                  </td>
                                  <td className="px-3 py-2 text-sm text-gray-500 truncate">
                                    {getDriverField(d, "email")}
                                  </td>
                                  <td className="px-3 py-2">
                                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                      {getDriverField(d, "status")}
                                    </span>
                                  </td>
                                  <td className="px-3 py-2 text-right text-sm font-medium">
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
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ===== MODALS ===== */}
        {activeTab === "vehicle" && showModal && (
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-lg w-full max-w-md">
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold text-gray-800">Add New Vehicle</h2>
                  <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-500">
                    <X size={20} />
                  </button>
                </div>
                <form className="space-y-4" onSubmit={handleVehicleSubmit}>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Vehicle Type</label>
                    <input
                      type="text"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2"
                      value={vehicleForm.vehicleType}
                      onChange={(e) => setVehicleForm({ ...vehicleForm, vehicleType: e.target.value })}
                      onFocus={() => {
                        setShowFuelTypeDropdown(false);
                        setShowFleetCardDropdown(false);
                        setShowRfidDropdown(false);
                      }}
                      required
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Plate No.</label>
                      <input
                        type="text"
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-black-300"
                        value={vehicleForm.plateNo}
                        onChange={(e) => {
                          let val = e.target.value.toUpperCase().replace(/[^A-Z0-9\- ]/g, "");
                          const match = val.match(/^([A-Z]{0,3})([- ]?)([0-9]{0,4})$/);
                          if (match) setVehicleForm({ ...vehicleForm, plateNo: val });
                        }}
                        maxLength={8}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Capacity</label>
                      <div className="relative">
                        <input
                          type="text"
                          inputMode="numeric"
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-center focus:ring-black-300"
                          value={vehicleForm.capacity}
                          onChange={(e) => {
                            let val = e.target.value.replace(/[^0-9]/g, "").slice(0, 2);
                            if (val === "" || (parseInt(val) >= 1 && parseInt(val) <= 20)) {
                              setVehicleForm({ ...vehicleForm, capacity: val });
                            }
                          }}
                          maxLength={2}
                          required
                        />
                        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex flex-col space-y-0.5">
                          <button
                            type="button"
                            className="text-gray-500 hover:text-gray-700"
                            onClick={() => {
                              const current = parseInt(vehicleForm.capacity) || 0;
                              if (current < 20) setVehicleForm({ ...vehicleForm, capacity: (current + 1).toString() });
                            }}
                          >
                            <ChevronUp size={16} />
                          </button>
                          <button
                            type="button"
                            className="text-gray-500 hover:text-gray-700"
                            onClick={() => {
                              const current = parseInt(vehicleForm.capacity) || 1;
                              if (current > 1) setVehicleForm({ ...vehicleForm, capacity: (current - 1).toString() });
                            }}
                          >
                            <ChevronDown size={16} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* Fuel Type */}
                  <div className="relative">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Fuel Type</label>
                    <button
                      type="button"
                      className={`w-full border ${showFuelTypeDropdown ? 'border-black-100 ring-1' : 'border-gray-300'} rounded-lg px-3 py-2 flex items-center justify-between`}
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
                      <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform ${showFuelTypeDropdown ? "rotate-180" : ""}`} />
                    </button>
                    {showFuelTypeDropdown && (
                      <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg">
                        {["BIO-DIESEL", "DIESEL", "KEROSENE"].map((type) => (
                          <button
                            key={type}
                            type="button"
                            className={`w-full text-left px-3 py-2 hover:bg-gray-100 text-sm ${vehicleForm.fuelType === type ? "bg-gray-100 font-medium" : ""}`}
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
                  {/* Fleet Card */}
                  <div className="relative">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Fleet Card</label>
                    <button
                      type="button"
                      className={`w-full border ${showFleetCardDropdown ? 'border-black-100 ring-1' : 'border-gray-300'} rounded-lg px-3 py-2 flex items-center justify-between`}
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
                      <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform ${showFleetCardDropdown ? "rotate-180" : ""}`} />
                    </button>
                    {showFleetCardDropdown && (
                      <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg">
                        {["Available", "Unavailable"].map((status) => (
                          <button
                            key={status}
                            type="button"
                            className={`w-full text-left px-3 py-2 hover:bg-gray-100 text-sm ${vehicleForm.fleetCard === status ? "bg-gray-100 font-medium" : ""}`}
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
                  {/* RFID */}
                  <div className="relative">
                    <label className="block text-sm font-medium text-gray-700 mb-1">RFID</label>
                    <button
                      type="button"
                      className={`w-full border ${showRfidDropdown ? 'border-black-100 ring-1 ring-black-200' : 'border-gray-300'} rounded-lg px-3 py-2 flex items-center justify-between`}
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
                      <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform ${showRfidDropdown ? "rotate-180" : ""}`} />
                    </button>
                    {showRfidDropdown && (
                      <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg">
                        {["Available", "Unavailable"].map((status) => (
                          <button
                            key={status}
                            type="button"
                            className={`w-full text-left px-3 py-2 hover:bg-gray-100 text-sm ${vehicleForm.rfid === status ? "bg-gray-100 font-medium" : ""}`}
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
                  <div className="flex justify-end gap-3 pt-4">
                    <button
                      type="button"
                      className="px-4 py-2 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50"
                      onClick={() => setShowModal(false)}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className={`px-4 py-2 bg-green-600 rounded-lg font-medium text-white hover:bg-green-700 ${
                        !isVehicleFormValid() || isSubmittingVehicle ? "opacity-50 cursor-not-allowed" : ""
                      }`}
                      disabled={!isVehicleFormValid() || isSubmittingVehicle}
                    >
                      {isSubmittingVehicle ? "Adding..." : "Add Vehicle"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {activeTab === "driver" && showModal && (
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-lg w-full max-w-md">
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold text-gray-800">Add New Driver</h2>
                  <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-500">
                    <X size={20} />
                  </button>
                </div>
                <form className="space-y-4" onSubmit={handleDriverSubmit}>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                    <input
                      type="text"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-black-500"
                      value={driverForm.name}
                      onChange={(e) => setDriverForm({ ...driverForm, name: e.target.value })}
                      required
                    />
                  </div>
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
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-black-500"
                          value={driverForm.contact.replace('+63 ', '')}
                          onChange={handleContactChange}
                          placeholder="912 345 6789"
                          required
                        />
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                    <input
                      type="email"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-black-500"
                      value={driverForm.email}
                      onChange={(e) => setDriverForm({ ...driverForm, email: e.target.value })}
                      required
                    />
                  </div>
                  <div className="flex justify-end gap-3 pt-4">
                    <button
                      type="button"
                      className="px-4 py-2 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50"
                      onClick={() => setShowModal(false)}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className={`px-4 py-2 bg-green-600 rounded-lg font-medium text-white hover:bg-green-700 ${
                        !isDriverFormValid() || isSubmittingDriver ? "opacity-50 cursor-not-allowed" : ""
                      }`}
                      disabled={!isDriverFormValid() || isSubmittingDriver}
                    >
                      {isSubmittingDriver ? "Adding..." : "Add Driver"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {duplicateModal.show && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
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

        {/* Archive Toggle Button */}
        <button
          className={`fixed bottom-4 right-4 py-2 px-4 rounded-lg transition-colors flex items-center gap-2 shadow-sm ${
            activeTab === "archive" ? "bg-green-600 text-white" : "bg-white text-green-600 border border-green-600"
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