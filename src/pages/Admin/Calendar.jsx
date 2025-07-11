import React, { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedEvent, setSelectedEvent] = useState(null); // For modal

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
    <div className="p-7 relative">
      
    <h1 className="text-3xl font-bold mb-6">Calendar</h1>
      {/* Top Bar */}
      <div className="flex justify-between items-center mb-1">
  <div className="flex gap-2">
    <button
      onClick={() =>
        setCurrentDate(
          new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1)
        )
      }
      className="p-2 border rounded"
    >
      <ChevronLeft size={20} />
    </button>

    <button
      onClick={() => setCurrentDate(new Date())}
      className="p-2 border rounded bg-green-100 text-green-800 font-semibold"
    >
      Today
    </button>

    <button
      onClick={() =>
        setCurrentDate(
          new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1)
        )
      }
      className="p-1 border rounded"
    >
      <ChevronRight size={20} />    
    </button>
  </div>

  <h1 className="text-xl font-bold">
    {currentDate.toLocaleDateString("default", {
      month: "long",
      year: "numeric",
    })}
  </h1>

  {/* Empty space to balance flex layout */}
  <div className="w-[80px]"></div>
</div>

      {/* Calendar */}
      <div className="grid grid-cols-7 gap-px border rounded bg-gray-400 text-center text-sm  font- bold-large">
        {daysOfWeek.map((day) => (
          <div key={day} className="bg- bg-green-600 py-  text-white">
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
                className="bg-white h-17 p-2 text-left align-top  border-gray-200 relative"
              >
                {date && (
                  <>
                    <div
                      className={`text-xs  font-semibold mb-1 inline-block px-2 py-1 rounded-full ${
                        isToday ? "bg-green-600 text-white" : ""
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
                          className="text-[10px] bg-green-100 text-green-800 rounded px-1 py-[1px] mb-1 cursor-pointer hover:bg-green-200"
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
  <div className="fixed inset-0 flex items-center justify-center z-20">
    <div
      className="absolute inset-0 bg-opacity-30"
      onClick={() => setSelectedEvent(null)}
    ></div>
    <div
      className="bg-white p-6 rounded-lg shadow-lg w-[400px] relative z-30"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="flex justify-between items-center mb-4">
        <h4 className="text-lg font-semibold text-center w-full">INFORMATION</h4>
        <button
          onClick={() => setSelectedEvent(null)}
          className="absolute right-4 top-4 text-gray-500 hover:text-gray-700 text-xl"
        >
          ✕
        </button>
      </div>
      <div className="grid grid-cols-2 gap-y-4 text-sm">
        <div className="text-gray-500">Name of Driver:</div>
        <div className="font-semibold">{selectedEvent.title}</div>
        <div className="text-gray-500">Office/Department:</div>
        <div className="font-semibold">SysADD</div>
        <div className="text-gray-500">Date:</div>
        <div className="font-semibold">07/{String(selectedEvent.day).padStart(2, "0")}/2025</div>
        <div className="text-gray-500">Time:</div>
        <div className="font-semibold">1:00 PM</div>
        <div className="col-span-2 text-gray-500">Destination</div>
        <div className="col-span-2 font-semibold">Pasay City, 1300 Metro Manila</div>
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