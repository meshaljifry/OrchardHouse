import Calendar from 'react-calendar';
import React, { useState, useEffect } from 'react';
import './Calendar.css';

const CalendarPage = () => {
  const [date, setDate] = useState(new Date());
  const onDateChange = (selectedDate) => {
    setDate(selectedDate);
  };
  const [events, setEvents] = useState([]);
  const [selectedDateEvents, setSelectedDateEvents] = useState([]);

  useEffect(() => {
    fetchEvents();
  }, []);

  useEffect(() => {
    const formattedDate = date.toISOString().split('T')[0];
    const eventsForDate = events.filter(event => {
      const eventDate = new Date(event.scheduledDate).toISOString().split('T')[0];
      return eventDate === formattedDate;
    });
    setSelectedDateEvents(eventsForDate);
  }, [date, events]);

  const fetchEvents = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/getEventList');
      const data = await response.json();
      console.log(data); // Add this line to check the fetched data
      setEvents(data);
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  };

  const tileContent = ({ date, view }) => {
    if (view === 'month') {
      const formattedDate = date.toISOString().split('T')[0];
      const eventsForDate = events.filter(event => {
        const eventDate = new Date(event.scheduledDate).toISOString().split('T')[0];
        return eventDate === formattedDate;
      });
  
      if (eventsForDate.length > 1) {
        return <div className="special-event">Multiple Events</div>;
      } else if (eventsForDate.length === 1) {
        return (
          <div className="special-event">Event</div>
        );
      }
    }
    return null;
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
          tileContent={tileContent}
        />
      </div>
      <div className="selected-date">
        <h3>Selected Date: {date.toDateString()}</h3>
        {selectedDateEvents.length > 0 ? (
          <ul className="event-list">
            {selectedDateEvents.map(event => (
              <li key={event.eventID} className="event-item">
                <strong>{event.title}</strong>: {event.description}
              </li>
            ))}
          </ul>
        ) : (
          <p>No events for this date.</p>
        )}
      </div>
    </div>
  );
};

export default CalendarPage;
