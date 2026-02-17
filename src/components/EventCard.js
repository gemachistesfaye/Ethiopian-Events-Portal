import React from "react";

const EventCard = ({ event, onClick }) => {
  return (
    <div
      className="bg-white shadow rounded p-4 mb-4 flex items-center cursor-pointer hover:bg-gray-100"
      onClick={onClick}
    >
      <img
        src={event.image}
        alt={event.name}
        className="w-24 h-24 object-cover rounded mr-4"
      />
      <div>
        <h2 className="text-lg font-bold">{event.name}</h2>
        <p className="text-sm text-gray-600">
          Ethiopian: {event.eth_date} | Gregorian: {event.greg_date}
        </p>
        <p className="text-sm">{event.location}</p>
      </div>
    </div>
  );
};

export default EventCard; 
