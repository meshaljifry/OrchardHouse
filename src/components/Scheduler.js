import React, { useState } from 'react';
import './Scheduler.css';

const Scheduler = () => {
  const [availableEmployees, setAvailableEmployees] = useState([
    { id: 1, name: 'John Doe' },
    { id: 2, name: 'Jane Smith' },
    { id: 3, name: 'Alice Johnson' },
    { id: 4, name: 'Bob Brown' }
  ]);
  const [selectedEmployees, setSelectedEmployees] = useState([]);
  const [schedule, setSchedule] = useState(null);

  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

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

    const shifts = daysOfWeek.map((day) => ({
      day,
      shifts: [
        { shift: '8AM-4PM', employee: selectedEmployees[0].name },
        { shift: '4PM-7PM', employee: selectedEmployees[1].name }
      ]
    }));

    setSchedule(shifts);
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
                <button
                  className="move-btn"
                  onClick={() => handleMoveToSelected(employee)}
                >
                  &gt;
                </button>
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
                <button
                  className="move-btn"
                  onClick={() => handleMoveToAvailable(employee)}
                >
                  &lt;
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <button className="generate-btn" onClick={generateSchedule}>
        Generate Weekly Schedule
      </button>

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
                      {shiftIndex === 0 && (
                        <td rowSpan="2">{daySchedule.day}</td>
                      )}
                      <td>{shift.shift}</td>
                      <td>{shift.employee}</td>
                    </tr>
                  ))}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Scheduler;
