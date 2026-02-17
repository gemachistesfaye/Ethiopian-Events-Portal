import React, { useState } from "react";
import { convertToEthiopian, convertToGregorian } from "../utils/dateConverter";
import eventsData from "../data/events.json";

const monthNamesGregorian = [
  "Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"
];

const monthNamesEthiopian = [
  "Meskerem", "Tikimt", "Hidar", "Tahsas", "Tir", "Yekatit",
  "Megabit", "Miyazya", "Ginbot", "Sene", "Hamle", "Nehase", "Pagumen"
];

const EventCalendar = ({ onDateClick, isEthiopian }) => {
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());

  // Build days for current month
  const daysInMonth = Array.from({ length: 31 }, (_, i) => {
    const date = new Date(currentYear, currentMonth, i + 1);
    if (date.getMonth() !== currentMonth) return null; // skip overflow
    return date;
  }).filter(Boolean);

  // Map event dates for easy lookup
  const eventDates = eventsData.map(e => new Date(e.greg_date).toDateString());

  // Helpers
  const isToday = (date) => date.toDateString() === today.toDateString();
  const hasEvent = (date) => eventDates.includes(date.toDateString());

  // Month navigation
  const prevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else setCurrentMonth(currentMonth - 1);
  };
  const nextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else setCurrentMonth(currentMonth + 1);
  };

  return (
    <div className="bg-white rounded shadow p-4 max-w-md mx-auto">
      {/* Month Header */}
      <div className="flex justify-between items-center mb-4">
        <button onClick={prevMonth} className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300">◀</button>
        <div className="font-bold">
          {isEthiopian
            ? monthNamesEthiopian[currentMonth] + " " + currentYear
            : monthNamesGregorian[currentMonth] + " " + currentYear
          }
        </div>
        <button onClick={nextMonth} className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300">▶</button>
      </div>

      {/* Week Days */}
      <div className="grid grid-cols-7 text-center font-medium mb-2">
        {["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].map((d) => (
          <div key={d}>{d}</div>
        ))}
      </div>

      {/* Days Grid */}
      <div className="grid grid-cols-7 gap-1 text-center">
        {daysInMonth.map((date) => {
          const dayNumber = isEthiopian
            ? convertToEthiopian(date).split(" ")[0]
            : date.getDate();

          return (
            <div
              key={date.toDateString()}
              onClick={() => onDateClick(date)}
              className={`
                p-2 cursor-pointer rounded 
                ${isToday(date) ? "bg-blue-400 text-white" : ""}
                ${hasEvent(date) ? "border-2 border-yellow-400" : ""}
                hover:bg-blue-200
              `}
            >
              {dayNumber}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default EventCalendar;
