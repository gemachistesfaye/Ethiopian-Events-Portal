import React, { useState } from "react";
import EventCalendar from "./components/Calendar";
import EventCard from "./components/EventCard";
import EventDetails from "./components/EventDetails";
import eventsData from "./data/events.json";

function App() {
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);

  const handleDateClick = (date) => {
    setSelectedDate(date);
  };

  const handleAddReminder = (event) => {
    console.log("Reminder added for:", event.name);
    // Later: store reminder in localStorage or Firebase per user
    alert(`Reminder added for ${event.name}`);
  };

  const eventsForDate = selectedDate
    ? eventsData.filter(
        (e) =>
          new Date(e.greg_date).toDateString() === selectedDate.toDateString()
      )
    : [];

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <h1 className="text-2xl font-bold mb-4 text-center">
        Ethiopian Events & Festivals Portal
      </h1>

      <EventCalendar onDateClick={handleDateClick} />

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
        />
      )}
    </div>
  );
}

export default App;
