import React, { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedEvent, setSelectedEvent] = useState(null);

  const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);

  const startDay = startOfMonth.getDay();
  const daysInMonth = endOfMonth.getDate();
  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const dayCells = [];
  for (let i = 0; i < startDay; i++) {
    dayCells.push(null);
  }
  for (let day = 1; day <= daysInMonth; day++) {
    dayCells.push(new Date(currentDate.getFullYear(), currentDate.getMonth(), day));
  }

  const weeks = [];
  for (let i = 0; i < dayCells.length; i += 7) {
    weeks.push(dayCells.slice(i, i + 7));
  }

  const events = [
    { day: 5, title: "Dispatch A", description: "Dispatch to Site A" },
    { day: 12, title: "Dispatch B", description: "Dispatch to Site B" },
    { day: 18, title: "Meeting", description: "Team strategy meeting" },
  ];

  const today = new Date();

  return (
    <div className="p-7 relative font-sans">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Calendar</h1>

      {/* Top Bar */}
      <div className="flex justify-between items-center mb-1 relative">
        <div className="flex gap-2">
          {/* Previous Month */}
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

          {/* Today Button */}
          <button
            onClick={() => setCurrentDate(new Date())}
            className="p-2 rounded border border-transparent hover:border-green-300 hover:bg-green-100 hover:text-green-800 font-semibold transition text-gr-700"
          >
            Today
          </button>

          {/* Next Month */}
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

        {/* Centered Month/Year */}
        <h1 className="absolute left-1/2 transform -translate-x-1/2 text-xl font-semibold text-gray-700">
          {currentDate.toLocaleDateString("default", {
            month: "long",
            year: "numeric",
          })}
        </h1>

        <div className="w-[80px]"></div>
      </div>

      {/* Calendar */}
      <div className="grid grid-cols-7 gap-px border border-transparent rounded bg-gray-300 text-center text-sm font-medium overflow-hidden">
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

            return (
              <div
                key={`${i}-${j}`}
                className="bg-white h-17 p-2 text-left border border-gray-200 relative hover:bg-green-50 transition-colors duration-200 cursor-pointer"
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

                    {events
                      .filter((e) => e.day === date.getDate())
                      .map((e, i) => (
                        <div
                          key={i}
                          onClick={() => setSelectedEvent(e)}
                          className="text-[10px] bg-green-100 text-green-800 rounded px-1 py-[1px] mb-1 cursor-pointer hover:bg-green-100 transition-colors duration-200"
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
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div
            className="absolute inset-0"
            onClick={() => setSelectedEvent(null)}
          ></div>
          <div
            className="bg-white p-6 rounded-lg shadow-xl w-[400px] relative z-50"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-lg font-semibold text-center w-full text-gray-700">
                INFORMATION
              </h4>
              <button
                onClick={() => setSelectedEvent(null)}
                className="absolute right-4 top-4 text-gray-500 hover:text-gray-700 text-xl"
              >
                ✕
              </button>
            </div>
            <div className="grid grid-cols-2 gap-y-4 text-sm text-gray-800">
              <div className="text-gray-500">Name of Driver:</div>
              <div className="font-semibold">{selectedEvent.title}</div>
              <div className="text-gray-500">Office/Department:</div>
              <div className="font-semibold">SysADD</div>
              <div className="text-gray-500">Date:</div>
              <div className="font-semibold">
                07/{String(selectedEvent.day).padStart(2, "0")}/2025
              </div>
              <div className="text-gray-500">Time:</div>
              <div className="font-semibold">1:00 PM</div>
              <div className="col-span-2 text-gray-500">Destination</div>
              <div className="col-span-2 font-semibold">
                Pasay City, 1300 Metro Manila
              </div>
              <div className="text-gray-500">Vehicle Type</div>
              <div className="font-semibold">Innova</div>
              <div className="text-gray-500">Capacity</div>
              <div className="font-semibold">5 Seats</div>
              <div className="text-gray-500">Plate No.</div>
              <div className="font-semibold">AKA 1022</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Calendar;
