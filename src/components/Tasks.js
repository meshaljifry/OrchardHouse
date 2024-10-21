import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure, Input, Textarea, Autocomplete, AutocompleteItem } from "@nextui-org/react";
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from "@nextui-org/react";
import './Tasks.css';
import React, { useState, useEffect } from 'react';

const Tasks = () => {
  const {isOpen, onOpen, onOpenChange} = useDisclosure();
  const { isOpen: isAssignOpen, onOpen: onAssignOpen, onOpenChange: onAssignOpenChange } = useDisclosure();
  const { isOpen: isCommentOpen, onOpen: onCommentOpen, onOpenChange: onCommentOpenChange } = useDisclosure();

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
  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState('');

  // Fetch Animal, Plant, Supply, Report, User, and Task Lists
  useEffect(() => {
    fetchAnimals();
    fetchPlants();
    fetchSupplies();
    fetchReports();
    fetchUsers();
    fetchTasks();
    fetchComments();
  }, []);

  const fetchAnimals = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/getAnimalList');
      const data = await response.json();
      setAnimals(data);
    } catch (error) {
      console.error('Error fetching animals:', error);
    }
  };

  const fetchPlants = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/getPlantList');
      const data = await response.json();
      setPlants(data);
    } catch (error) {
      console.error('Error fetching plants:', error);
    }
  };

  const fetchSupplies = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/getSupplyList');
      const data = await response.json();
      setSupplies(data);
    } catch (error) {
      console.error('Error fetching supplies:', error);
    }
  };

  const fetchReports = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/getReportList');
      const data = await response.json();
      setReports(data);
    } catch (error) {
      console.error('Error fetching reports:', error);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/getUserList');
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const fetchTasks = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/getTasks');
      const data = await response.json();
      setTasks(data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  const fetchComments = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/getComments');
      const data = await response.json();
      setComments(data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  const createTask = async () => {
    newTask.animalID = animalValue;
    newTask.plantID = plantValue;
    newTask.supplyID = supplyValue;
    newTask.reportID = reportValue;
    try {
      console.log(newTask);
      await fetch('http://localhost:5000/api/createTask', {
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
      await fetch('http://localhost:5000/api/assignTask', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ taskID: selectedTaskID, userID: selectedUser, assignerID: localStorage.getItem('roleID') }),
      });
      await fetchTasks();
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
      await fetch('http://localhost:5000/api/commentTask', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ assignedTaskID: selectedTaskID, comment: comment }),
      });
      await fetchTasks();
      setComment('');
    } catch (error) {
      console.error('Error assigning task:', error);
    }
  };

  const clearNewTask = () => {
    setNewTask({ code: '', name: '', description: '', animalID: '', plantID: '', supplyID: '', reportID: '' });
  };

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-4">Tasks</h1>
      {/* 'Create Task' Button and Pop-up Modal*/}
      <Button onPress={() => {onOpen(); clearNewTask();}}>Create Task</Button>
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
      <Button onPress={onAssignOpen}>Assign Task</Button>
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
              </ModalBody>
              <ModalFooter>
                <Button onPress={onClose}>Close</Button>
                <Button onPress={() => { assignTask(); onClose(); }}>Assign</Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      <Button onPress={onCommentOpen}>Comment</Button>
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

      {/* Display tasks and enable row selection */}
      <div>
        <h2 className="text-lg font-semibold mt-4">Tasks List</h2>
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
            <TableColumn>COMMENTS</TableColumn>
          </TableHeader>
          <TableBody>
            {tasks.map((task) => (
              <TableRow key={task.taskID}>
                <TableCell>{task.taskID}</TableCell>
                <TableCell>{task.name}</TableCell>
                <TableCell>{task.description}</TableCell>
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
      </div>
    </div>
  );
};

export default Tasks;
