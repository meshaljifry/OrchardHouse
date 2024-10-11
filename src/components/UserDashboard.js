// File: src/components/Dashboard.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Dashboard.css';

const UserDashboard = () => {
  const [tickets, setTickets] = useState([]);
  const [ticketCounts, setTicketCounts] = useState({});
  const [forecast, setForecast] = useState(null);
  const [loadingWeather, setLoadingWeather] = useState(true);
  const [errorWeather, setErrorWeather] = useState(null);

  // Coordinates of the orchard
  const lat = 44.8755; 
  const lon = -91.9193;

  // Helper function to create a range
  const range = (start, stop, step) => {
    return Array.from({ length: (stop - start) / step }, (_, i) => start + i * step);
  };

  // Fetch 5-day weather forecast from Open-Meteo API
  useEffect(() => {
    const params = {
      latitude: lat,
      longitude: lon,
      hourly: "temperature_2m"
    };

    const fetchWeatherApi = async (url, params) => {
      try {
        const response = await axios.get(url, { params });
        return [response.data]; // Wrap response in array for consistency
      } catch (error) {
        console.error('Error fetching weather:', error);
        setErrorWeather('Error fetching weather data');
        setLoadingWeather(false);
      }
    };

    const getWeatherData = async () => {
      const url = "https://api.open-meteo.com/v1/forecast";
      const responses = await fetchWeatherApi(url, params);
      const response = responses[0]; // Process first location (as in your original TypeScript code)

      if (!response) {
        setErrorWeather('No weather data available');
        return;
      }

      // Attributes for timezone and location
      const utcOffsetSeconds = response.utc_offset_seconds;
      const timezone = response.timezone;
      const timezoneAbbreviation = response.timezone_abbreviation;
      const latitude = response.latitude;
      const longitude = response.longitude;

      const hourly = response.hourly;

      // Create weather data structure
      const weatherData = {
        hourly: {
          time: range(Number(hourly.time[0]), Number(hourly.time[hourly.time.length - 1]), hourly.time_interval).map(
            (t) => new Date((t + utcOffsetSeconds) * 1000)
          ),
          temperature2m: hourly.temperature_2m,
        },
      };

      // Log weather data
      console.log('Weather Data:', weatherData);

      // Processed data for the 5-day forecast display
      setForecast(weatherData);
      setLoadingWeather(false);
    };

    getWeatherData();
  }, [lat, lon]);

  // Function to convert Celsius to Fahrenheit
  const celsiusToFahrenheit = (celsius) => {
    return ((celsius * 9/5) + 32).toFixed(1);
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
                    {/* <button onClick={() => handleQuantityChange(ticket.name, -1)}>-</button>
                    <span>{ticketCounts[ticket.name]}</span>
                    <button onClick={() => handleQuantityChange(ticket.name, 1)}>+</button> */}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>Loading ticket items...</p>
        )}
      </div>

      {/* 5-Day Weather Forecast Section */}
      <div className="dashboard-item weather-section">
        <h3>5-Day Weather Forecast</h3>
        {loadingWeather ? (
          <p>Loading weather...</p>
        ) : errorWeather ? (
          <p>{errorWeather}</p>
        ) : forecast ? (
          <div className="forecast-grid">
            {forecast.hourly.time.map((time, index) => (
              <div key={index} className="forecast-box">
                <p className="forecast-day">{time.toLocaleString()}</p>
                <p className="forecast-temp">Temp: {celsiusToFahrenheit(forecast.hourly.temperature2m[index])}°F</p>
              </div>
            ))}
          </div>
        ) : (
          <p>No weather data available.</p>
        )}
      </div>

      {/* Farm Photos Section */}
      {/* <div className="dashboard-item farm-photos">
        <h3>Farm Photos</h3>
        <div className="photo-grid">
          {farmPhotos.map((url, index) => (
            <img key={index} src={url} alt={`Farm ${index}`} className="farm-photo" />
          ))}
        </div>
      </div> */}

      {/* Events Section */}
      {/* <div className="dashboard-item events">
        <h3>Events</h3>
        <ul>
          {mockEvents.map((event, index) => (
            <li key={index}>
              <strong>{event.name}</strong>: {event.date}
            </li>
          ))}
        </ul>
      </div> */}

    </div>
  );
};

export default UserDashboard;
