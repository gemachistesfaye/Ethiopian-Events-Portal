import React, { useState, useEffect } from "react";
import EventCalendar from "./components/Calendar";
import EventCard from "./components/EventCard";
import EventDetails from "./components/EventDetails";
import MyReminders from "./components/MyReminders";
import eventsData from "./data/events.json";
import { convertToGregorian, convertToEthiopian } from "./utils/dateConverter";


function App() {
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isEthiopian, setIsEthiopian] = useState(true);
  const [reminders, setReminders] = useState(
    JSON.parse(localStorage.getItem("reminders") || "{}")
  );


  const currentUserId = "localUser";

  const handleDateClick = (date) => {
    setSelectedDate(date);
  };

  const handleAddReminder = (reminder) => {
    const userReminders = reminders[currentUserId] || [];
    const updated = {
      ...reminders,
      [currentUserId]: [...userReminders, reminder],
    };
    setReminders(updated);
    localStorage.setItem("reminders", JSON.stringify(updated));
    alert(`Reminder added for ${reminder.eventName}`);
  };

  // Filter events for selected date respecting calendar toggle
  const eventsForDate = selectedDate
    ? eventsData.filter((e) => {
        const eventDate = isEthiopian ? e.eth_date : e.greg_date;
const selected = isEthiopian
  ? convertToEthiopian(selectedDate)
  : convertToGregorian(selectedDate);

        return eventDate === selected;
      })
    : [];

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <h1 className="text-2xl font-bold mb-4 text-center">
        Ethiopian Events & Festivals Portal
      </h1>

      {/* Calendar Toggle */}
      <div className="flex justify-center mb-4">
        <button
          onClick={() => setIsEthiopian(!isEthiopian)}
          className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
        >
          {isEthiopian ? "Show Gregorian" : "Show Ethiopian"}
        </button>
      </div>

      {/* Calendar */}
      <EventCalendar onDateClick={handleDateClick} isEthiopian={isEthiopian} />


      {/* Events for selected date */}
      <div className="mt-6">
        {selectedDate && eventsForDate.length === 0 && (
          <p className="text-center text-gray-500">No events on this date.</p>
        )}

        {eventsForDate.map((event) => (
          <EventCard
            key={event.id}
            event={event}
            onClick={() => setSelectedEvent(event)}
          />
        ))}
      </div>

      {/* Event Details Modal */}
      {selectedEvent && (
        <EventDetails
          event={selectedEvent}
          onClose={() => setSelectedEvent(null)}
          onAddReminder={handleAddReminder}
          isEthiopian={isEthiopian}
        />
      )}

      {/* My Reminders Section */}
      <MyReminders
        reminders={reminders[currentUserId] || []}
        isEthiopian={isEthiopian}
      />
    </div>
  );
}

export default App;
