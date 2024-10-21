// Imports
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Dashboard.css';

// Create mock events to display
const mockEvents = [
  { name: 'Apple Picking Festival', date: 'Oct 15, 2023' },
  { name: 'Harvest Dinner', date: 'Nov 1, 2023' },
  { name: 'Winter Market', date: 'Dec 5, 2023' },
];

// Create farm photos to display
const farmPhotos = [
  'https://example.com/photo1.jpg',
  'https://example.com/photo2.jpg',
  'https://example.com/photo3.jpg',
  'https://example.com/photo4.jpg',
];

// UserDashboard
const UserDashboard = () => {
  const [tickets, setTickets] = useState([]);
  const [ticketCounts, setTicketCounts] = useState({});
  const [forecast, setForecast] = useState(null);
  const [loadingWeather, setLoadingWeather] = useState(true);
  const [errorWeather, setErrorWeather] = useState(null);

  // Coordinates for weather api
  const lat = 44.8755; // provided latitude
  const lon = -91.9193; // provided longitude

  // Get data and error handling
  useEffect(() => {
    const currentDate = new Date();
    const startDate = currentDate.toISOString().split('T')[0]; // Get current date in YYYY-MM-DD format
    const endDate = new Date(currentDate);
    endDate.setDate(currentDate.getDate() + 6); // Add 6 days to the current date for a total of 7 days
    const endDateString = endDate.toISOString().split('T')[0]; // Get end date in YYYY-MM-DD format

    axios.get(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=temperature_2m_max,temperature_2m_min,weathercode&timezone=auto&start_date=${startDate}&end_date=${endDateString}`)
      .then(response => {
        console.log("Weather API response:", response.data);

        const dailyForecast = response.data.daily;
        setForecast(dailyForecast);

        setLoadingWeather(false);
      })
      .catch(error => {
        setErrorWeather('Error fetching weather data');
        setLoadingWeather(false);
      });
  }, [lat, lon]);

  // Convert celcius to fahrenheit
  const celsiusToFahrenheit = (celsius) => {
    return ((celsius * 9 / 5) + 32).toFixed(1);
  };

  // Get the weather icon
  const getWeatherIcon = (weatherCode) => {
    switch (weatherCode) {
      // Clear weather
      case 0:
        return '☀️'; // Clear sky
  
      // Partly cloudy
      case 1:
      case 2:
        return '🌤️'; // Partly cloudy
  
      // Overcast and cloudy
      case 3:
        return '☁️'; // Cloudy
  
      // Fog and hazy conditions
      case 45:
      case 48:
        return '🌫️'; // Fog
  
      // Drizzle
      case 51:
        return '🌦️'; // Light drizzle
      case 53:
        return '🌦️'; // Moderate drizzle
      case 55:
        return '🌦️'; // Dense drizzle
  
      // Freezing drizzle
      case 56:
      case 57:
        return '❄️🌧️'; // Freezing drizzle
  
      // Rain
      case 61:
        return '🌧️'; // Light rain
      case 63:
        return '🌧️'; // Moderate rain
      case 65:
        return '🌧️'; // Heavy rain
  
      // Freezing rain
      case 66:
      case 67:
        return '❄️🌧️'; // Freezing rain
  
      // Snowfall
      case 71:
        return '❄️'; // Light snowfall
      case 73:
        return '❄️'; // Moderate snowfall
      case 75:
        return '❄️'; // Heavy snowfall
  
      // Snow grains
      case 77:
        return '🌨️'; // Snow grains
  
      // Rain showers
      case 80:
        return '🌦️'; // Light rain showers
      case 81:
        return '🌧️'; // Moderate rain showers
      case 82:
        return '🌧️'; // Violent rain showers
  
      // Snow showers
      case 85:
        return '🌨️'; // Light snow showers
      case 86:
        return '🌨️'; // Heavy snow showers
  
      // Thunderstorms
      case 95:
        return '⛈️'; // Thunderstorm
      case 96:
        return '⛈️❄️'; // Thunderstorm with light hail
      case 99:
        return '⛈️❄️'; // Thunderstorm with heavy hail
  
      // Default case for unknown weather codes
      default:
        return '❓'; // Unknown weather condition
    }
  };
  
  // Handle ticket quantity changes
  const handleQuantityChange = (name, delta) => {
    setTicketCounts(prevCounts => ({
      ...prevCounts,
      [name]: Math.max(0, prevCounts[name] + delta)
    }));
  };

  // Format day of the week
  const formatDayOfWeek = (dateString) => {
    const date = new Date(dateString + 'T00:00:00'); // Force midnight time to avoid time zone issues
    return date.toLocaleDateString('en-US', { weekday: 'short' });
  };

  // HTML return
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

      {/* 7-Day Weather Forecast Section */}
      <div className="dashboard-item weather-section">
        <h3>7-Day Weather Forecast</h3>
        {loadingWeather ? (
          <p>Loading weather...</p>
        ) : errorWeather ? (
          <p>{errorWeather}</p>
        ) : forecast ? (
          <div className="forecast-container">
            <div className="forecast-grid">
              {forecast.time.map((date, index) => (
                <div key={index} className="forecast-box">
                  <p className="forecast-day">{formatDayOfWeek(date)}</p>
                  <p>{getWeatherIcon(forecast.weathercode[index])}</p>
                  <p className="forecast-condition">{forecast.weathercode[index] === 0 ? "Clear" : (forecast.weathercode[index] === 1 || forecast.weathercode[index] === 2) ? "Partly Cloudy" : forecast.weathercode[index] === 3 ? "Cloudy" : (forecast.weathercode[index] === 45 || forecast.weathercode[index] === 48) ? "Foggy" : ((forecast.weathercode[index] >= 51 && forecast.weathercode[index] <= 55) || (forecast.weathercode[index] >= 61 && forecast.weathercode[index] <= 65) || (forecast.weathercode[index] >= 80 && forecast.weathercode[index] <= 82)) ? "Rainy" : (forecast.weathercode[index] >= 95 && forecast.weathercode[index] <= 99) ? "Storms" : ((forecast.weathercode[index] >= 71 && forecast.weathercode[index] <= 75) || (forecast.weathercode[index] === 77) || (forecast.weathercode[index] === 85 || forecast.weathercode[index] === 86)) ? "Snow" : "Other"}</p>
                  <p className="forecast-temp">High: {celsiusToFahrenheit(forecast.temperature_2m_max[index])}°F</p>
                  <p className="forecast-temp">Low: {celsiusToFahrenheit(forecast.temperature_2m_min[index])}°F</p>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <p>No weather data available.</p>
        )}
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

// Export
export default UserDashboard;