import Calendar from 'react-calendar';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure, Input, Checkbox } from "@nextui-org/react";
import React, { useState, useEffect } from 'react';
import './Calendar.css';

const CalendarPage = () => {
  const { isOpen: isCreateOpen, onOpen: onCreateOpen, onOpenChange: onCreateOpenChange } = useDisclosure();
  const [date, setDate] = useState(new Date());
  const onDateChange = (selectedDate) => {
    setDate(selectedDate);
  };
  const [events, setEvents] = useState([]);
  const [selectedDateEvents, setSelectedDateEvents] = useState([]);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTitle, setSelectedTitle] = useState('');
  const [selectedDescription, setSelectedDescription] = useState('');
  const [isPrivate, setIsPrivate] = useState(false);

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
    const roleID = localStorage.getItem('roleID');
    console.log(roleID);
    if (roleID >= 1 && roleID <= 3) {
      try {
        const response = await fetch('http://localhost:5000/api/getEventList');
        const data = await response.json();
        setEvents(data);
      } catch (error) {
        console.error('Error fetching events:', error);
      }
    }
    else {
      try {
        const response = await fetch('http://localhost:5000/api/getEventList?isPrivate=0');
        const data = await response.json();
        console.log(data);
        setEvents(data);
      } catch (error) {
        console.error('Error fetching events:', error);
      }
    }
  };

  const createEvent = async () => {
    try {
      await fetch('http://localhost:5000/api/createEvent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ scheduledDate: selectedDate, isPrivate: isPrivate, title: selectedTitle, description: selectedDescription }),
      });
      await fetchEvents();
    } catch (error) {
      console.error('Error creating task:', error);
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

  const clearNewEvent = () => {
    setSelectedDate('');
    setIsPrivate('');
    setSelectedTitle('');
    setSelectedDescription('');
  };

  return (
    <div className="calendar-page">
      <header className="calendar-header">
        <h2 className="calendar-title">Calendar</h2>
        <input type="text" placeholder="Search events..." className="calendar-search" />
      </header>

      <div className="button-div">
      <Button onPress={() => {onCreateOpen(); clearNewEvent();}} className="button-spacing">Create Event</Button>
      <Modal isOpen={isCreateOpen} onOpenChange={onCreateOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>Create Event</ModalHeader>
              <ModalBody>

                {/* Select Date for Event */}
                <Input
                  color="primary"
                  label="Choose Scheduled Date for Event"
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                />

                {/* Choose Event Title */}
                <Input
                  clearable
                  bordered
                  fullWidth
                  color="primary"
                  size="lg"
                  labelPlacement="inside"
                  label="Enter Event Title"
                  id="eventTitle"
                  value={selectedTitle}
                  onChange={(e) => setSelectedTitle(e.target.value)}
                />

                {/* Choose Event Description */}
                <Input
                  clearable
                  bordered
                  fullWidth
                  color="primary"
                  size="lg"
                  labelPlacement="inside"
                  label="Enter Event Description"
                  id="eventDescription"
                  value={selectedDescription}
                  onChange={(e) => setSelectedDescription(e.target.value)}
                />

                {/* Checkbox to determine if the event is public or private */}
                <Checkbox
                  isSelected={isPrivate}
                  color="primary"
                  onChange={(e) => setIsPrivate(e.target.checked)}
                >
                  Private Event?
                </Checkbox>

              </ModalBody>
              <ModalFooter>
                <Button onPress={onClose}>Close</Button>
                <Button onPress={() => { createEvent(); onClose(); }}>Create</Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
      </div>

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
