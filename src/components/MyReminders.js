import React from "react";

const MyReminders = ({ reminders, isEthiopian }) => {
  if (!reminders || reminders.length === 0) return null;

  return (
    <div className="mt-8">
      <h2 className="text-xl font-bold mb-3">My Reminders</h2>
      {reminders.map((r) => (
        <div key={r.id} className="bg-white p-3 mb-2 rounded shadow">
          <p className="font-bold">{r.eventName}</p>
          <p>{r.note}</p>
          <p className="text-sm text-gray-500">
            Event Date: {isEthiopian ? r.eth_date : r.greg_date || r.date}
          </p>
        </div>
      ))}
    </div>
  );
};

export default MyReminders;
