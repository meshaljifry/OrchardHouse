// File: src/components/Dashboard.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Dashboard.css';

const mockEvents = [
  { name: 'Apple Picking Festival', date: 'Oct 15, 2023' },
  { name: 'Harvest Dinner', date: 'Nov 1, 2023' },
  { name: 'Winter Market', date: 'Dec 5, 2023' },
];

const farmPhotos = [
  'https://example.com/photo1.jpg',
  'https://example.com/photo2.jpg',
  'https://example.com/photo3.jpg',
  'https://example.com/photo4.jpg',
];

const UserDashboard = () => {
  const [tickets, setTickets] = useState([]);
  const [ticketCounts, setTicketCounts] = useState({});

  // Fetch tickets from the database on mount
  useEffect(() => {
    axios.get('/api/Item')
      .then(response => {
        const ticketItems = response.data.filter(item => item.name.includes('Ticket'));
        setTickets(ticketItems);
        // Initialize ticket counts
        const initialCounts = {};
        ticketItems.forEach(item => initialCounts[item.name] = 0);
        setTicketCounts(initialCounts);
      })
      .catch(error => console.error('Error fetching ticket items:', error));
  }, []);

  // Handle ticket quantity changes
  const handleQuantityChange = (name, delta) => {
    setTicketCounts(prevCounts => ({
      ...prevCounts,
      [name]: Math.max(0, prevCounts[name] + delta)
    }));
  };

  return (
    <div className="dashboard-container">

      {/* Ticket Purchasing Section */}
      <div className="dashboard-item ticket-purchasing">
        <h3>Ticket Purchasing</h3>
        {tickets.length ? (
          <table>
            <thead>
              <tr>
                <th>Item</th>
                <th>Price</th>
                <th>Quantity</th>
              </tr>
            </thead>
            <tbody>
              {tickets.map((ticket, index) => (
                <tr key={index}>
                  <td>{ticket.name}</td>
                  <td>${ticket.price}</td>
                  <td>
                    <button onClick={() => handleQuantityChange(ticket.name, -1)}>-</button>
                    <span>{ticketCounts[ticket.name]}</span>
                    <button onClick={() => handleQuantityChange(ticket.name, 1)}>+</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>Loading ticket items...</p>
        )}
      </div>

      {/* Weather Section */}
      <div className="dashboard-item weather-section">
        <h3>Weather</h3>
        {/* Weather API integration goes here */}
      </div>

      {/* Farm Photos Section */}
      <div className="dashboard-item farm-photos">
        <h3>Farm Photos</h3>
        <div className="photo-grid">
          {farmPhotos.map((url, index) => (
            <img key={index} src={url} alt={`Farm ${index}`} className="farm-photo" />
          ))}
        </div>
      </div>

      {/* Events Section */}
      <div className="dashboard-item events">
        <h3>Events</h3>
        <ul>
          {mockEvents.map((event, index) => (
            <li key={index}>
              <strong>{event.name}</strong>: {event.date}
            </li>
          ))}
        </ul>
      </div>
      
    </div>
  );
};

export default UserDashboard;
