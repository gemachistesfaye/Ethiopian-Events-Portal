import React, { useState } from "react";

const ReminderForm = ({ event, onSave, onClose }) => {
  const [note, setNote] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!note) return;

    const reminder = {
      id: Date.now(),
      eventId: event.id,
      eventName: event.name,
      note,
      date: event.greg_date, 
    };

    onSave(reminder);
    setNote("");
  };

  return (
    <div className="mt-4">
      <form onSubmit={handleSubmit} className="flex flex-col gap-2">
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Enter your reminder note..."
          className="border p-2 rounded w-full"
        />
        <div className="flex gap-2">
          <button
            type="submit"
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Save Reminder
          </button>
          <button
            type="button"
            onClick={onClose}
            className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default ReminderForm;
