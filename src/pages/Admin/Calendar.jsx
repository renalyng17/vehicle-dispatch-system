import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from "lucide-react";

const Calendar = () => {
  const [openModal, setOpenModal] = useState(null);
  const [currentDate, setCurrentDate] = useState(new Date());

  // Prevent body scroll
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  const toggleModal = (eventId) => {
    setOpenModal(openModal === eventId ? null : eventId);
  };

  const allHours = Array.from({ length: 24 }, (_, i) => i);
  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const getCalendarWeek = () => {
    const start = new Date(currentDate);
    start.setDate(start.getDate() - start.getDay());
    return Array.from({ length: 7 }, (_, i) => {
      const date = new Date(start);
      date.setDate(start.getDate() + i);
      return date;
    });
  };

  const calendarWeek = getCalendarWeek();

  const events = [
    { id: 1, day: 1, hour: 3, duration: 5, name: 'Juan DelaCruz' },
    { id: 2, day: 2, hour: 6, duration: 6, name: 'Juan DelaCruz' },
    { id: 3, day: 3, hour: 8, duration: 2, name: 'Juan DelaCruz' },
    { id: 4, day: 4, hour: 2, duration: 4, name: 'Juan DelaCruz' },
  ];

  return (
     <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Calendar</h1>
   <div className="p-4 font-sans flex flex-col overflow-hidden h-screen">

      {/* Top Bar */}
      <div className="relative flex justify-between items-center mb-4">
        <button
          className="border px-2 py-1 z-10 bg-green-100 text-green-800 font-bold"
          onClick={() => setCurrentDate(new Date())}
        >
          Today
        </button>
        <h1 className="absolute left-1/2 transform -translate-x-1/2 text-2xl font-bold">
          {currentDate.toLocaleDateString('default', { month: 'long', year: 'numeric' })}
        </h1>
        <div className="z-10">
          <button
            className="border px-2 py-1 mr-1"
            onClick={() => setCurrentDate(new Date(currentDate.setDate(currentDate.getDate() - 7)))}
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            className="border px-2 py-1"
            onClick={() => setCurrentDate(new Date(currentDate.setDate(currentDate.getDate() + 7)))}
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Calendar Container */}
      <div className="border rounded-lg overflow-auto flex-1">
        {/* Day Headers Row */}
        <div className="grid grid-cols-7 sticky top-0 bg-white z-10">
          {calendarWeek.map((date, index) => {
            const isToday = date.toDateString() === new Date().toDateString();
            return (
              <div
                key={index}
                className={`border-b border-r h-12 p-1 text-center font-bold ${
                  isToday ? 'bg-green-100 text-green-800' : ''
                }`}
              >
                <div>{daysOfWeek[date.getDay()]}</div>
                <div className="text-sm font-normal">
                  {String(date.getDate()).padStart(2, '0')}
                </div>
              </div>
            );
          })}
        </div>

        {/* Time Slots Grid */}
        <div className="grid grid-cols-7">
          {allHours.map((hour) =>
            calendarWeek.map((_, dayIndex) => (
              <div key={`${hour}-${dayIndex}`} className="relative border-b border-r h-24">
                {events.map(
                  (event) =>
                    event.day === dayIndex &&
                    event.hour === hour && (
                      <div
                        key={event.id}
                        className="absolute top-1 left-1 right-1 bg-white shadow-md border rounded p-2 cursor-pointer"
                        onClick={() => toggleModal(event.id)}
                      >
                        <div className="font-semibold text-sm">{event.name}</div>
                        <div className="text-xs text-gray-500">
                          {event.hour % 12 === 0 ? 12 : event.hour % 12}
                          {event.hour < 12 ? 'AM' : 'PM'} →{' '}
                          {(event.hour + event.duration) % 12 === 0
                            ? 12
                            : (event.hour + event.duration) % 12}
                          {(event.hour + event.duration) < 12 ? 'AM' : 'PM'}
                        </div>
                      </div>
                    )
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Modal */}
      {openModal && (
        <div className="fixed inset-0 flex items-center justify-center z-20">
          <div
            className="absolute inset-0"
            onClick={() => setOpenModal(null)}
          ></div>
          <div
            className="bg-white p-6 rounded-lg shadow-lg w-[400px] relative z-30"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-lg font-semibold text-center w-full">INFORMATION</h4>
              <button
                onClick={() => setOpenModal(null)}
                className="absolute right-4 top-4 text-gray-500 hover:text-gray-700 text-xl"
              >
                ✕
              </button>
            </div>
            <div className="grid grid-cols-2 gap-y-4 text-sm">
              <div className="text-gray-500">Name of Driver:</div>
              <div className="font-semibold">Juan Delacruz</div>
              <div className="text-gray-500">Office/Department:</div>
              <div className="font-semibold">SysADD</div>
              <div className="text-gray-500">Date:</div>
              <div className="font-semibold">05/30/25</div>
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
    </div>
  );
};

export default Calendar;