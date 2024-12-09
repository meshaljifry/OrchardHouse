import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure, Input, Textarea, Autocomplete, AutocompleteItem } from "@nextui-org/react";
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from "@nextui-org/react";
import './Tasks.css';
import React, { useState, useEffect } from 'react';
import { BACKEND_URL } from '../config.js';

const Tasks = () => {
  const {isOpen, onOpen, onOpenChange} = useDisclosure();
  const { isOpen: isAssignOpen, onOpen: onAssignOpen, onOpenChange: onAssignOpenChange } = useDisclosure();
  const { isOpen: isCommentOpen, onOpen: onCommentOpen, onOpenChange: onCommentOpenChange } = useDisclosure();
  const { isOpen: isDetailsOpen, onOpen: onDetailsOpen, onOpenChange: onDetailsOpenChange } = useDisclosure();

  const [animals, setAnimals] = useState([]);
  const [plants, setPlants] = useState([]);
  const [supplies, setSupplies] = useState([]);
  const [reports, setReports] = useState([]);
  const [users, setUsers] = useState([]);
  const [newTask, setNewTask] = useState({ code: '', name: '', description: '', animalID: '', plantID: '', supplyID: '', reportID: '' });
  const [animalValue, setAnimalValue] = useState();
  const [plantValue, setPlantValue] = useState();
  const [supplyValue, setSupplyValue] = useState();
  const [reportValue, setReportValue] = useState();
  const [selectedUser, setSelectedUser] = useState();
  const [selectedTaskID, setSelectedTaskID] = useState(null); // Selected task ID from highlighted row
  const [tasks, setTasks] = useState([]);
  const [assignedTasks, setAssignedTasks] = useState([]);
  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState('');
  const [dateScheduledFor, setDateScheduledFor] = useState('');
  const [taskDetails, setTaskDetails] = useState(null);
  const currentDate = new Date();
  const formattedDate = currentDate.toISOString().split('T')[0];

  // Fetch the logged-in user's userID and roleID
  const loggedInUserID = localStorage.getItem('userID');
  const roleID = localStorage.getItem('roleID'); // Fetch roleID to check if the user is admin

  // Fetch Animal, Plant, Supply, Report, User, and Task Lists
  useEffect(() => {
    fetchAnimals();
    fetchPlants();
    fetchSupplies();
    fetchReports();
    fetchUsers();
    fetchTasks();
    fetchComments();
    fetchAssignedTasks();
  }, []);

  const fetchAnimals = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}:5000/api/getAnimalList`);
      const data = await response.json();
      setAnimals(data);
    } catch (error) {
      console.error('Error fetching animals:', error);
    }
  };

  const fetchPlants = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}:5000/api/getPlantList`);
      const data = await response.json();
      setPlants(data);
    } catch (error) {
      console.error('Error fetching plants:', error);
    }
  };

  const fetchSupplies = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}:5000/api/getSupplyList`);
      const data = await response.json();
      setSupplies(data);
    } catch (error) {
      console.error('Error fetching supplies:', error);
    }
  };

  const fetchReports = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}:5000/api/getReportList`);
      const data = await response.json();
      setReports(data);
    } catch (error) {
      console.error('Error fetching reports:', error);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}:5000/api/getUserList`);
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const fetchTasks = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}:5000/api/getTasks`);
      const data = await response.json();
      setTasks(data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  const fetchComments = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}:5000/api/getComments`);
      const data = await response.json();
      setComments(data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  const fetchAssignedTasks = async () => {
    const loggedInUserID = localStorage.getItem('userID'); // Get the logged-in user ID
    try {
      const response = await fetch(`${BACKEND_URL}:5000/api/getAssignedTasks?userID=${loggedInUserID}`);
      const data = await response.json();
      setAssignedTasks(data);
    } catch (error) {
      console.error('Error fetching assigned tasks:', error);
    }
  };

  const updateStatus = async () => {
    try {
      await fetch(`${BACKEND_URL}:5000/api/TaskStatus/${selectedTaskID}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ statusID: 4 }),
      });
      await fetchTasks();
      await fetchAssignedTasks();
    } catch (error) {
      console.error('Error updating product:', error);
    }
  };

  const createTask = async () => {
    newTask.animalID = animalValue;
    newTask.plantID = plantValue;
    newTask.supplyID = supplyValue;
    newTask.reportID = reportValue;
    try {
      console.log(newTask);
      await fetch(`${BACKEND_URL}:5000/api/createTask`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newTask),
      });
      await fetchTasks();
    } catch (error) {
      console.error('Error creating task:', error);
    }
  };

  const assignTask = async () => {
    if (!selectedTaskID) {
      alert('Please select a task by highlighting a row');
      return;
    }
    try {
      await fetch(`${BACKEND_URL}:5000/api/assignTask`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ taskID: selectedTaskID, userID: selectedUser, assignerID: localStorage.getItem('roleID'), dateScheduledFor: dateScheduledFor, date: formattedDate }),
      });
      await fetchTasks();
      await fetchAssignedTasks();
    } catch (error) {
      console.error('Error assigning task:', error);
    }
  };

  const commentOnTask = async () => {
    if (!selectedTaskID) {
      alert('Please select a task by highlighting a row');
      return;
    }
    try {
      await fetch(`${BACKEND_URL}:5000/api/commentTask`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ assignedTaskID: selectedTaskID, comment: comment }),
      });
      await fetchTasks();
      await fetchComments();
      setComment('');
    } catch (error) {
      console.error('Error assigning task:', error);
    }
  };

  const clearNewTask = () => {
    setNewTask({ code: '', name: '', description: '', animalID: '', plantID: '', supplyID: '', reportID: '' });
  };

  
  // Filter tasks for the logged-in user if not an admin (roleID !== 1)
const userAssignedTasks = tasks.filter(task => {
  const isAssignedToUser = assignedTasks.some(assignedTask => 
    assignedTask.taskID === task.taskID && assignedTask.userID === parseInt(loggedInUserID)
  );

  const isIncomplete = assignedTasks.some(assignedTask => 
    assignedTask.taskID === task.taskID && assignedTask.statusID === 3
  );

  // If roleID is 1 or 2, show all tasks
  if (roleID === '1' || roleID === '2') {
    return true; // Show all tasks
  }

  // If roleID is 3, exclude completed tasks
  if (roleID === '3') {
    return isAssignedToUser && isIncomplete;
  }

  // Otherwise, include all assigned tasks
  return isAssignedToUser;
});

const openTaskDetails = (taskID) => {
  console.log('Opening details for Task ID:', taskID); // Debugging line
  const task = tasks.find(t => t.taskID.toString() === taskID.toString());
  if (task) {
    setTaskDetails(task);
    onDetailsOpen();
  } else {
    console.error('Task not found for Task ID:', taskID);
  }
};

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-4">Tasks</h1>
      {/* 'Create Task' Button and Pop-up Modal */}
      <Button onPress={() => {onOpen(); clearNewTask();}} className="button-spacing">Create Task</Button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">Create Task</ModalHeader>
            <ModalBody>
              <Input
                clearable
                bordered
                fullWidth
                color="primary"
                size="lg"
                labelPlacement="inside"
                label="Enter Task Code"
                id="taskCode"
                value={newTask.code}
                onChange={(e) => {setNewTask({ ...newTask, code: e.target.value })}}
              />
              <Input
                clearable
                isRequired
                bordered
                fullWidth
                color="primary"
                size="lg"
                labelPlacement="inside"
                label="Enter Task Title"
                id="taskName"
                onChange={(e) => {setNewTask({ ...newTask, name: e.target.value })}}
              />
              <Textarea 
                maxlength="100"
                clearable
                isRequired
                bordered
                fullWidth
                color="primary"
                size="lg"
                labelPlacement="inside"
                label="Enter Task Description"
                id="taskDescription"
                onChange={(e) => {setNewTask({ ...newTask, description: e.target.value })}}
              />
              Enter the following fields if applicable:
              <Autocomplete
                classname="max-w-xs"
                color="primary"
                bordered
                labelPlacement="inside"
                label="Select an Animal"
                id="taskAnimal"
                items={animals}
                selectedKey={animalValue}
                onSelectionChange={setAnimalValue}
                onChange={(e) => setNewTask({ ...newTask, animalID: e.target.animalValue })}
                >
                {animals.map((animal) => (
                  <AutocompleteItem 
                    key={animal.animalID} 
                  >
                    {animal.name}
                  </AutocompleteItem>
                ))}
                </Autocomplete>
                <Autocomplete
                labelPlacement="inside"
                label="Select a Plant"
                classname="max-w-xs"
                color="primary"
                bordered
                id="taskPlant"
                items={plants}
                selectedKey={plantValue}
                onSelectionChange={setPlantValue}
                onChange={(e) => setNewTask({ ...newTask, plantID: e.target.plantValue })}
                >
                {plants.map((plant) => (
                  <AutocompleteItem key={plant.plantID}>
                    {plant.name}
                  </AutocompleteItem>
                ))}
                </Autocomplete>
                <Autocomplete
                labelPlacement="inside"
                label="Select a Supply"
                classname="max-w-xs"
                color="primary"
                bordered
                id="taskSupply"
                items={supplies}
                selectedKey={supplyValue}
                onSelectionChange={setSupplyValue}
                onChange={(e) => setNewTask({ ...newTask, supplyID: e.target.supplyValue })}
                >
                {supplies.map((supply) => (
                  <AutocompleteItem key={supply.supplyID}>
                    {supply.name}
                  </AutocompleteItem>
                ))}
                </Autocomplete>
                <Autocomplete
                labelPlacement="inside"
                label="Select a Report"
                classname="max-w-xs"
                color="primary"
                bordered
                id="taskReport"
                items={reports}
                selectedKey={reportValue}
                onSelectionChange={setReportValue}
                onChange={(e) => setNewTask({ ...newTask, reportID: e.target.reportValue })}
                >
                {reports.map((report) => (
                  <AutocompleteItem key={report.reportID}>
                    {report.description}
                  </AutocompleteItem>
                ))}
                </Autocomplete>
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="light" onPress={() => {onClose();}}>
                Close
              </Button>
              <Button disabled={!(newTask.name.length > 1) && !(newTask.description.length > 1)} color="primary" onPress={() => {createTask(); onClose();}}>
                Create
              </Button>
            </ModalFooter>
          </>
          )}
        </ModalContent>
      </Modal>

      {/* 'Assign Task' Button and Modal */}
      <Button onPress={onAssignOpen} className="button-spacing">Assign Task</Button>
      <Modal isOpen={isAssignOpen} onOpenChange={onAssignOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>Assign Task</ModalHeader>
              <ModalBody>
                {/* Select User */}
                <Autocomplete
                  label="Select User"
                  items={users}
                  selectedKey={selectedUser}
                  onSelectionChange={setSelectedUser}
                >
                  {users.map((user) => {
                    const fullName = `${user.firstName} ${user.lastName}`; // Combine first and last name
                    return (
                      <AutocompleteItem key={user.userID}>
                        {fullName}
                      </AutocompleteItem>
                    );
                  })}
                </Autocomplete>
                {/* Select Date for Task */}
                <Input
                  label="Choose Scheduled Date"
                  type="date"
                  value={dateScheduledFor}
                  onChange={(e) => setDateScheduledFor(e.target.value)}
                />
              </ModalBody>
              <ModalFooter>
                <Button onPress={onClose}>Close</Button>
                <Button onPress={() => { assignTask(); onClose(); }}>Assign</Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      <Button onPress={onCommentOpen} className="button-spacing">Comment</Button>
      <Modal isOpen={isCommentOpen} onOpenChange={onCommentOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>Comment</ModalHeader>
              <ModalBody>
                {/* Write comment */}
                <Input
                  clearable
                  bordered
                  fullWidth
                  color="primary"
                  size="lg"
                  labelPlacement="inside"
                  label="Write Comment Here"
                  id="comment"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                />
              </ModalBody>
              <ModalFooter>
                <Button onPress={onClose}>Close</Button>
                <Button onPress={() => { commentOnTask(); onClose(); }}>Comment</Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      <Button onPress={updateStatus} className="button-spacing">Mark Complete</Button>

      <Button onPress={() => openTaskDetails(selectedTaskID)} className="button-spacing" disabled={!selectedTaskID}>View Details</Button>
      <Modal isOpen={isDetailsOpen} onOpenChange={onDetailsOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>Task Details</ModalHeader>
              <ModalBody>
                {taskDetails ? (
                  <div>
                    <p><strong>Task ID:</strong> {taskDetails.taskID}</p>
                    <p><strong>Name:</strong> {taskDetails.name}</p>
                    <p><strong>Description:</strong> {taskDetails.description}</p>
                    <p><strong>Animal ID:</strong> {taskDetails.animalID || "N/A"}</p>
                    <p><strong>Plant ID:</strong> {taskDetails.plantID || "N/A"}</p>
                    <p><strong>Supply ID:</strong> {taskDetails.supplyID || "N/A"}</p>
                    <p><strong>Report ID:</strong> {taskDetails.reportID || "N/A"}</p>
                  </div>
                ) : (
                  <p>No task selected.</p>
                )}
              </ModalBody>
              <ModalFooter>
                <Button onPress={onClose}>Close</Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      {/* Display tasks and enable row selection */}
      <div>
        <h2 className="text-lg font-semibold mt-4">Tasks Assigned to You</h2>

        {userAssignedTasks.length === 0 ? (
          <p>No tasks are assigned to you.</p>
        ) : (
          <Table
            color={"primary"}
            selectionMode="single" 
            aria-label="Example static collection table"
            className="custom-table"
            selectedKeys={selectedTaskID ? [selectedTaskID] : []}
            onSelectionChange={(keys) => setSelectedTaskID(Array.from(keys)[0])} // Handle row selection
          >
            <TableHeader>
              <TableColumn>TASK ID</TableColumn>
              <TableColumn>NAME</TableColumn>
              <TableColumn>DESCRIPTION</TableColumn>
              <TableColumn>STATUS</TableColumn>
              <TableColumn>DATE SCHEDULED FOR</TableColumn>
              <TableColumn>COMMENTS</TableColumn>
            </TableHeader>
            <TableBody>
              {userAssignedTasks.map((task) => (
                <TableRow key={task.taskID}>
                  <TableCell>{task.taskID}</TableCell>
                  <TableCell>{task.name}</TableCell>
                  <TableCell>{task.description}</TableCell>
                  <TableCell>
                    {assignedTasks
                    .filter((assignedTask) => assignedTask.taskID === task.taskID && assignedTask.statusID === 3)
                    .map((filteredAssignedTask, index) => (
                      <div key={index}>Incomplete</div>
                    ))}
                  </TableCell>
                  <TableCell>
                    {assignedTasks
                    .filter((assignedTask) => assignedTask.taskID === task.taskID && assignedTask.statusID === 3)
                    .map((filteredAssignedTask, index) => (
                      <div key={index}>{new Date(filteredAssignedTask.dateScheduledFor).toISOString().split('T')[0]}</div>
                    ))}
                  </TableCell>
                  <TableCell>
                  {comments
                    .filter((comment) => comment.assignedTaskID === task.taskID)
                    .map((filteredComment, index) => (
                      <div key={index}>{filteredComment.comment}</div>
                    ))}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
};

export default Tasks;
