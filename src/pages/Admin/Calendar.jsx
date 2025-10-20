// src/components/Calendar.js
import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { api } from "../../services/api";

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [events, setEvents] = useState([]);

  // Fetch accepted requests
  useEffect(() => {
    const fetchAcceptedRequests = async () => {
      try {
        const allRequests = await api.getRequests();
        const accepted = allRequests.filter(req => req.status === "Accepted");

        const mappedEvents = accepted.map(req => ({
          date: new Date(req.fromDate),
          title: `Dispatch: ${req.names?.[0] || "User"}`,
          details: req,
        }));

        setEvents(mappedEvents);
      } catch (error) {
        console.error("Failed to load calendar events:", error);
      }
    };

    fetchAcceptedRequests();
  }, []);

  // Calendar rendering logic
  const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
  const startDay = startOfMonth.getDay();
  const daysInMonth = endOfMonth.getDate();
  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const dayCells = [];
  for (let i = 0; i < startDay; i++) dayCells.push(null);
  for (let day = 1; day <= daysInMonth; day++) {
    dayCells.push(new Date(currentDate.getFullYear(), currentDate.getMonth(), day));
  }

  const weeks = [];
  for (let i = 0; i < dayCells.length; i += 7) {
    weeks.push(dayCells.slice(i, i + 7));
  }

  const today = new Date();

  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-PH");
  };

  return (
    <div className="p-4 sm:p-6 md:p-8 font-sans">
      {/* Centered container */}
      <div className="max-w-4xl mx-auto">
        {/* Top Bar */}
        <div className="flex justify-between items-center mb-4 relative">
          <div className="flex gap-2">
            <button
              onClick={() =>
                setCurrentDate(
                  new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1)
                )
              }
              className="p-2 rounded border border-transparent hover:border-green-300 hover:bg-gray-100 transition"
              aria-label="Previous Month"
            >
              <ChevronLeft size={20} className="text-gray-600" />
            </button>

            <button
              onClick={() => setCurrentDate(new Date())}
              className="px-3 py-1.5 rounded border border-transparent hover:border-green-300 hover:bg-green-100 hover:text-green-800 font-medium text-sm transition"
            >
              Today
            </button>

            <button
              onClick={() =>
                setCurrentDate(
                  new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1)
                )
              }
              className="p-2 rounded border border-transparent hover:border-green-300 hover:bg-gray-100 transition"
              aria-label="Next Month"
            >
              <ChevronRight size={20} className="text-gray-600" />
            </button>
          </div>

          <h1 className="absolute left-1/2 transform -translate-x-1/2 text-xl sm:text-2xl font-bold text-gray-700 whitespace-nowrap">
            {currentDate.toLocaleDateString("default", {
              month: "long",
              year: "numeric",
            })}
          </h1>

          <div className="w-[80px]"></div>
        </div>

        {/* ✅ NO SCROLLBAR — Fixed height, always fits */}
        <div className="border border-gray-300 rounded-lg shadow-sm bg-white overflow-hidden">
          {/* Calendar Header */}
          <div className="grid grid-cols-7 gap-px bg-green-600 text-white text-xs font-semibold uppercase tracking-wide">
            {daysOfWeek.map((day) => (
              <div key={day} className="py-1.5 text-center">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Body — No overflow, no scroll */}
          <div className="grid grid-cols-7 gap-px">
            {weeks.map((week, i) =>
              week.map((date, j) => {
                const isToday =
                  date &&
                  date.getDate() === today.getDate() &&
                  date.getMonth() === today.getMonth() &&
                  date.getFullYear() === today.getFullYear();

                const dayEvents = events.filter(e => {
                  return (
                    date &&
                    e.date.getDate() === date.getDate() &&
                    e.date.getMonth() === date.getMonth() &&
                    e.date.getFullYear() === date.getFullYear()
                  );
                });

                return (
                  <div
                    key={`${i}-${j}`}
                    className="bg-white h-16 p-1 border border-gray-200 relative hover:bg-green-50 transition-colors duration-200"
                  >
                    {date && (
                      <>
                        <div
                          className={`text-[10px] font-semibold mb-1 inline-block px-1.5 py-0.5 rounded-full ${
                            isToday ? "bg-green-600 text-white" : "text-gray-700"
                          }`}
                        >
                          {date.getDate()}
                        </div>

                        <div className="space-y-0.5 overflow-hidden">
                          {dayEvents.map((e, idx) => (
                            <div
                              key={idx}
                              onClick={() => setSelectedEvent(e.details)}
                              className="text-[8px] bg-green-100 text-green-800 rounded px-1 py-0.5 cursor-pointer truncate"
                            >
                              {e.title}
                            </div>
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* Modal */}
      {selectedEvent && (
        <div className="fixed inset-0 flex items-center justify-center z-50 backdrop-blur-[1px]">
          <div
            className="bg-white p-5 rounded-lg shadow-xl w-full max-w-md mx-4 relative z-50"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-start mb-3">
              <h4 className="text-base font-semibold text-gray-700 text-center w-full">
                DISPATCH INFORMATION
              </h4>
              <button
                onClick={() => setSelectedEvent(null)}
                className="text-gray-500 hover:text-gray-800 text-lg"
              >
                ✕
              </button>
            </div>
            <div className="grid grid-cols-2 gap-y-2 text-xs text-gray-800">
              <div className="text-gray-500">Driver:</div>
              <div className="font-medium">{selectedEvent.driver || "—"}</div>

              <div className="text-gray-500">Office/Department:</div>
              <div className="font-medium">{selectedEvent.requestingOffice || "—"}</div>

              <div className="text-gray-500">Date:</div>
              <div className="font-medium">{formatDate(selectedEvent.fromDate)}</div>

              <div className="text-gray-500">Time:</div>
              <div className="font-medium">
                {selectedEvent.fromTime} – {selectedEvent.toTime}
              </div>

              <div className="col-span-2 text-gray-500">Destination</div>
              <div className="col-span-2 font-medium">{selectedEvent.destination || "—"}</div>

              <div className="text-gray-500">Vehicle Type</div>
              <div className="font-medium">{selectedEvent.vehicleType || "—"}</div>

              <div className="text-gray-500">Plate No.</div>
              <div className="font-medium">{selectedEvent.plateNo || "—"}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Calendar;