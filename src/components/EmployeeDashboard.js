
import React, { useState } from 'react';
import './Dashboard.css';

const mockTasks = [
  { task: 'Feed the animals', assignedTo: 'John Doe', dueDate: 'Oct 7, 2023' },
  { task: 'Clean the barn', assignedTo: 'Jane Smith', dueDate: 'Oct 8, 2023' },
  { task: 'Repair fences', assignedTo: 'Alex Brown', dueDate: 'Oct 9, 2023' },
];

const mockSchedule = [
  { employee: 'John Doe', shift: '8:00 AM - 4:00 PM', day: 'Monday' },
  { employee: 'Jane Smith', shift: '9:00 AM - 5:00 PM', day: 'Tuesday' },
  { employee: 'Alex Brown', shift: '10:00 AM - 6:00 PM', day: 'Wednesday' },
];

const mockAnimalStatus = [
  { animal: 'Cow', healthStatus: 'Healthy', location: 'Barn A' },
  { animal: 'Sheep', healthStatus: 'Sick', location: 'Pasture 1' },
  { animal: 'Chicken', healthStatus: 'Healthy', location: 'Coop 2' },
];

const EmployeeDashboard = () => {
  const [posInput, setPosInput] = useState({ itemNumber: '', price: '', creditCard: '' });

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setPosInput((prev) => ({ ...prev, [name]: value }));
  };

  const handlePosSubmit = () => {
    // Here, we would normally handle payment submission logic
    console.log('POS data submitted:', posInput);
    setPosInput({ itemNumber: '', price: '', creditCard: '' });
  };

  return (
    <div className="dashboard-container">

      {/* Employee Tasks Section */}
      <div className="dashboard-item employee-tasks">
        <h3>Employee Tasks</h3>
        <ul>
          {mockTasks.map((task, index) => (
            <li key={index}>
              <strong>{task.task}</strong> - Assigned to: {task.assignedTo} (Due: {task.dueDate})
            </li>
          ))}
        </ul>
      </div>

      {/* Employee Schedule Section */}
      <div className="dashboard-item employee-schedule">
        <h3>Employee Schedule</h3>
        <table>
          <thead>
            <tr>
              <th>Employee</th>
              <th>Shift</th>
              <th>Day</th>
            </tr>
          </thead>
          <tbody>
            {mockSchedule.map((schedule, index) => (
              <tr key={index}>
                <td>{schedule.employee}</td>
                <td>{schedule.shift}</td>
                <td>{schedule.day}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Animal Status Section */}
      <div className="dashboard-item animal-status">
        <h3>Animal Status</h3>
        <table>
          <thead>
            <tr>
              <th>Animal</th>
              <th>Health Status</th>
              <th>Location</th>
            </tr>
          </thead>
          <tbody>
            {mockAnimalStatus.map((animal, index) => (
              <tr key={index}>
                <td>{animal.animal}</td>
                <td>{animal.healthStatus}</td>
                <td>{animal.location}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* POS System Section */}
      <div className="dashboard-item pos-system">
        <h3>POS System</h3>
        <form onSubmit={(e) => e.preventDefault()}>
          <label>
            Item Number:
            <input
              type="text"
              name="itemNumber"
              value={posInput.itemNumber}
              onChange={handleInputChange}
            />
          </label>
          <label>
            Price:
            <input
              type="text"
              name="price"
              value={posInput.price}
              onChange={handleInputChange}
            />
          </label>
          <label>
            Credit Card Info:
            <input
              type="text"
              name="creditCard"
              value={posInput.creditCard}
              onChange={handleInputChange}
            />
          </label>
          <button type="button" onClick={handlePosSubmit}>
            Submit
          </button>
        </form>
      </div>
      
    </div>
  );
};

export default EmployeeDashboard;
