import React, { useState } from "react";
import Calendar from "react-calendar";
import 'react-calendar/dist/Calendar.css';
import eventsData from "../data/events.json";

const EventCalendar = ({ onDateClick }) => {
  const [date, setDate] = useState(new Date());

  // Get all event dates
  const eventDates = eventsData.map(e => new Date(e.greg_date));

  // Highlight tiles that have events
  const tileClassName = ({ date, view }) => {
    if (eventDates.find(d => d.toDateString() === date.toDateString())) {
      return "bg-yellow-200 rounded"; 
    }
  };

  return (
    <div className="p-4 bg-white rounded shadow">
      <Calendar
        value={date}
        onChange={setDate}
        tileClassName={tileClassName}
        onClickDay={onDateClick}
      />
    </div>
  );
};

export default EventCalendar;
