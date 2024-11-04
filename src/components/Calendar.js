import React, { useState } from 'react';
import Calendar from 'react-calendar';
import './Calendar.css';

const CalendarPage = () => {
  const [date, setDate] = useState(new Date());

  const onDateChange = (selectedDate) => {
    setDate(selectedDate);
  };

  return (
    <div className="calendar-page">
      <header className="calendar-header">
        <h2 className="calendar-title">Calendar</h2>
        <input type="text" placeholder="Search events..." className="calendar-search" />
      </header>
      <div className="calendar-container">
        <Calendar
          onChange={onDateChange}
          value={date}
          calendarType="gregory"
        />
      </div>
      <div className="selected-date">
        <h3>Selected Date: {date.toDateString()}</h3>
      </div>
    </div>
  );
};

export default CalendarPage;
