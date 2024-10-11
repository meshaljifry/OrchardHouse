import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Dashboard.css';

const UserDashboard = () => {
  const [tickets, setTickets] = useState([]);
  const [ticketCounts, setTicketCounts] = useState({});
  const [forecast, setForecast] = useState(null);
  const [loadingWeather, setLoadingWeather] = useState(true);
  const [errorWeather, setErrorWeather] = useState(null);

  const lat = 44.8755; // provided latitude
  const lon = -91.9193; // provided longitude

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

  const celsiusToFahrenheit = (celsius) => {
    return ((celsius * 9 / 5) + 32).toFixed(1);
  };

  const getWeatherIcon = (weatherCode) => {
    switch (weatherCode) {
      case 0:
        return '☀️'; // clear sky
      case 1:
      case 2:
        return '🌤️'; // partly cloudy
      case 3:
        return '☁️'; // cloudy
      case 61:
        return '🌧️'; // light rain
      case 63:
        return '🌧️'; // moderate rain
      case 71:
        return '❄️'; // light snow
      default:
        return '❓'; // unknown
    }
  };

  const formatDayOfWeek = (dateString) => {
    const date = new Date(dateString + 'T00:00:00'); // Force midnight time to avoid time zone issues
    return date.toLocaleDateString('en-US', { weekday: 'short' });
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
                  <p className="forecast-condition">{forecast.weathercode[index] === 0 ? "Clear" : forecast.weathercode[index] === 3 ? "Cloudy" : "Other"}</p>
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
    </div>
  );
};

export default UserDashboard;
