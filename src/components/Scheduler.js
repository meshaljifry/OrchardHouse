// File: src/components/Scheduler.js
import React, { useState, useEffect } from 'react';
import './Scheduler.css';

const Scheduler = () => {
  const [availableEmployees, setAvailableEmployees] = useState([]);
  const [selectedEmployees, setSelectedEmployees] = useState([]);
  const [schedule, setSchedule] = useState(null);

  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const shifts = ['8AM-12PM', '12PM-4PM'];

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await fetch(`${BACKEND_URL}:5000/api/employeesWithRoles`);
        const data = await response.json();

        console.log("Filtered employees:", data); // Log to check if the correct data is fetched

        setAvailableEmployees(data); // Set the filtered employees
      } catch (error) {
        console.error("Error fetching employees:", error);
      }
    };
    fetchEmployees();

    // Load schedule from local storage if it exists
    const savedSchedule = localStorage.getItem('generatedSchedule');
    if (savedSchedule) {
      setSchedule(JSON.parse(savedSchedule));
    }
  }, []);

  const handleMoveToSelected = (employee) => {
    setAvailableEmployees(availableEmployees.filter((e) => e.id !== employee.id));
    setSelectedEmployees([...selectedEmployees, employee]);
  };

  const handleMoveToAvailable = (employee) => {
    setSelectedEmployees(selectedEmployees.filter((e) => e.id !== employee.id));
    setAvailableEmployees([...availableEmployees, employee]);
  };

  const generateSchedule = () => {
    if (selectedEmployees.length < 2) {
      alert('Please select at least two employees to generate a schedule.');
      return;
    }

    const generatedSchedule = daysOfWeek.map((day) => {
      const dayShifts = shifts.map((shift, index) => {
        const employee = selectedEmployees[(day.length + index) % selectedEmployees.length];
        return { shift, employee: employee.name };
      });

      return { day, shifts: dayShifts };
    });

    setSchedule(generatedSchedule);
    localStorage.setItem('generatedSchedule', JSON.stringify(generatedSchedule));
  };

  const deleteSchedule = () => {
    setSchedule(null);
    localStorage.removeItem('generatedSchedule');
  };

  return (
    <div className="scheduler-container">
      <h2>Weekly Work Schedule Generator</h2>

      <div className="employee-selection-container">
        <div className="employee-list">
          <h3>Available Employees</h3>
          <ul>
            {availableEmployees.map((employee) => (
              <li key={employee.id}>
                {employee.name}{' '}
                <button className="move-btn" onClick={() => handleMoveToSelected(employee)}>&gt;</button>
              </li>
            ))}
          </ul>
        </div>

        <div className="employee-list">
          <h3>Selected Employees</h3>
          <ul>
            {selectedEmployees.map((employee) => (
              <li key={employee.id}>
                {employee.name}{' '}
                <button className="move-btn" onClick={() => handleMoveToAvailable(employee)}>&lt;</button>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <button className="generate-btn" onClick={generateSchedule}>Generate Weekly Schedule</button>

      {schedule && (
        <div className="schedule-output">
          <h3>Generated Weekly Schedule</h3>
          <table>
            <thead>
              <tr>
                <th>Day</th>
                <th>Shift</th>
                <th>Employee</th>
              </tr>
            </thead>
            <tbody>
              {schedule.map((daySchedule, index) => (
                <React.Fragment key={index}>
                  {daySchedule.shifts.map((shift, shiftIndex) => (
                    <tr key={shiftIndex}>
                      {shiftIndex === 0 && <td rowSpan="2">{daySchedule.day}</td>}
                      <td>{shift.shift}</td>
                      <td>{shift.employee}</td>
                    </tr>
                  ))}
                </React.Fragment>
              ))}
            </tbody>
          </table>
          <button className="delete-btn" onClick={deleteSchedule}>Delete Schedule</button>
        </div>
      )}
    </div>
  );
};

export default Scheduler;
