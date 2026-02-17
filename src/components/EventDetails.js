import React, { useState } from "react";
import ReminderForm from "./ReminderForm";

const EventDetails = ({ event, onClose }) => {
  const [showForm, setShowForm] = useState(false);
  const [reminders, setReminders] = useState(
    JSON.parse(localStorage.getItem("reminders") || "[]")
  );

  const handleSaveReminder = (reminder) => {
    const updated = [...reminders, reminder];
    setReminders(updated);
    localStorage.setItem("reminders", JSON.stringify(updated));
    alert("Reminder saved!");
    setShowForm(false);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg max-w-lg w-full p-6 relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-600 hover:text-gray-900"
        >
          ✖
        </button>

        {/* Event Image */}
        <img
          src={event.image}
          alt={event.name}
          className="w-full h-48 object-cover rounded mb-4"
        />

        {/* Event Info */}
        <h2 className="text-2xl font-bold mb-2">{event.name}</h2>
        <p className="text-sm text-gray-600 mb-1">Ethiopian Date: {event.eth_date}</p>
        <p className="text-sm text-gray-600 mb-2">Gregorian Date: {event.greg_date}</p>
        <p className="mb-4">{event.description}</p>
        <p className="font-medium mb-4">Location: {event.location}</p>

        {/* Add Reminder Button */}
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Add Reminder
          </button>
        )}

        {/* Reminder Form */}
        {showForm && (
          <ReminderForm
            event={event}
            onSave={handleSaveReminder}
            onClose={() => setShowForm(false)}
          />
        )}
      </div>
    </div>
  );
};

export default EventDetails;
