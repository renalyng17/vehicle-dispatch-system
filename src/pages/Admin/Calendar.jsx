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
          details: req, // full request object as returned by backend
        }));

        setEvents(mappedEvents);
      } catch (error) {
        console.error("Failed to load calendar events:", error);
        // Optional: show toast or set error state
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
    return d.toLocaleDateString("en-PH"); // e.g., 10/18/2025
  };

  return (
    <div className="p-7 relative font-sans">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Calendar</h1>

      {/* Top Bar */}
      <div className="flex justify-between items-center mb-1 relative">
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
            className="p-2 rounded border border-transparent hover:border-green-300 hover:bg-green-100 hover:text-green-800 font-semibold transition"
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

        <h1 className="absolute left-1/2 transform -translate-x-1/2 text-xl font-semibold text-gray-700">
          {currentDate.toLocaleDateString("default", {
            month: "long",
            year: "numeric",
          })}
        </h1>

        <div className="w-[80px]"></div>
      </div>

      {/* Calendar Grid */}
     <div className="grid grid-cols-7 gap-px bg-gray-300 rounded text-center text-sm font-medium">
  {daysOfWeek.map((day) => (
    <div
      key={day}
      className="bg-green-600 py-2 text-white font-semibold tracking-wide"
    >
      {day}
    </div>
  ))}

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
                className="bg-white h-24 p-1 text-left border border-gray-200 relative hover:bg-green-50 transition-colors duration-200"
              >
                {date && (
                  <>
                    <div
                      className={`text-xs font-semibold mb-1 inline-block px-2 py-1 rounded-full ${
                        isToday ? "bg-green-600 text-white" : "text-gray-700"
                      }`}
                    >
                      {date.getDate()}
                    </div>

                    {dayEvents.map((e, idx) => (
                      <div
                        key={idx}
                        onClick={() => setSelectedEvent(e.details)}
                        className="text-[10px] bg-green-100 text-green-800 rounded px-1 py-[1px] mb-1 cursor-pointer truncate"
                      >
                        {e.title}
                      </div>
                    ))}
                  </>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Modal */}
      {selectedEvent && (
       <div className="fixed inset-0 flex items-center justify-center z-50  backdrop-blur-[1px]">
          <div
            className="bg-white p-6 rounded-lg shadow-xl w-[400px] relative z-50"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-lg font-semibold text-center w-full text-gray-700">
                DISPATCH INFORMATION
              </h4>
              <button
                onClick={() => setSelectedEvent(null)}
                className="absolute right-4 top-4 text-gray-500 hover:text-gray-00 text-xl"
              >
                ✕
              </button>
            </div>
            <div className="grid grid-cols-2 gap-y-3 text-sm text-gray-800">
              <div className="text-gray-500">Driver:</div>
              <div className="font-semibold">{selectedEvent.driver || "—"} </div>

              <div className="text-gray-500">Office/Department:</div>
              <div className="font-semibold">{selectedEvent.requestingOffice || "—"}</div>

              <div className="text-gray-500">Date:</div>
              <div className="font-semibold">{formatDate(selectedEvent.fromDate)}</div>

              <div className="text-gray-500">Time:</div>
              <div className="font-semibold">
                {selectedEvent.fromTime} – {selectedEvent.toTime}
              </div>

              <div className="col-span-2 text-gray-500">Destination</div>
              <div className="col-span-2 font-semibold">{selectedEvent.destination || "—"}</div>

              <div className="text-gray-500">Vehicle Type</div>
              <div className="font-semibold">{selectedEvent.vehicleType || "—"}</div>

              <div className="text-gray-500">Plate No.</div>
              <div className="font-semibold">{selectedEvent.plateNo || "—"}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Calendar;