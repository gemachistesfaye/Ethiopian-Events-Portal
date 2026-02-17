import React from "react";
import EventCalendar from "./components/Calendar";

function App() {
  const handleDateClick = (date) => {
    console.log("Selected date:", date);
   
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <h1 className="text-2xl font-bold mb-4 text-center">
        Ethiopian Events & Festivals Portal
      </h1>
      <EventCalendar onDateClick={handleDateClick} />
    </div>
  );
}

export default App;
