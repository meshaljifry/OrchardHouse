import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure, Input, Textarea, Autocomplete, AutocompleteItem } from "@nextui-org/react";
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from "@nextui-org/react";
import './Tasks.css';
import React, { useState, useEffect } from 'react';

const Tasks = () => {
  const { isOpen: isCreateOpen, onOpen: onCreateOpen, onOpenChange: onCreateOpenChange } = useDisclosure();
  const { isOpen: isAssignOpen, onOpen: onAssignOpen, onOpenChange: onAssignOpenChange } = useDisclosure();

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
  const [selectedTaskID, setSelectedTaskID] = useState();
  const [tasks, setTasks] = useState([]);

  // Fetch Animal, Plant, Supply, Report, User, and Task Lists
  useEffect(() => {
    fetchAnimals();
    fetchPlants();
    fetchSupplies();
    fetchReports();
    fetchUsers();
    fetchTasks();
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
    try {
      await fetch('http://localhost:5000/api/assignTask', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ taskID: selectedTaskID, userID: selectedUser }),
      });
      await fetchTasks();
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

      {/* 'Create Task' Button and Modal */}
      <Button onPress={() => { onCreateOpen(); clearNewTask(); }}>Create Task</Button>
      <Modal isOpen={isCreateOpen} onOpenChange={onCreateOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>Create Task</ModalHeader>
              <ModalBody>
                {/* Task Creation Fields */}
                <Input
                  label="Enter Task Code"
                  value={newTask.code}
                  onChange={(e) => setNewTask({ ...newTask, code: e.target.value })}
                />
                <Input
                  label="Enter Task Title"
                  value={newTask.name}
                  onChange={(e) => setNewTask({ ...newTask, name: e.target.value })}
                />
                <Textarea
                  label="Enter Task Description"
                  value={newTask.description}
                  onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                />
                {/* Dropdowns for Animal, Plant, Supply, Report */}
                {/* Autocomplete for each item */}
                {/* Similar to the original Create Task */}
              </ModalBody>
              <ModalFooter>
                <Button onPress={onClose}>Close</Button>
                <Button onPress={() => { createTask(); onClose(); }}>Create</Button>
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
                {/* Select Task */}
                <Autocomplete
                  label="Select Task"
                  items={tasks}
                  selectedKey={selectedTaskID}
                  onSelectionChange={setSelectedTaskID}
                >
                  {tasks.map((task) => (
                    <AutocompleteItem key={task.taskID}>{task.name}</AutocompleteItem>
                  ))}
                </Autocomplete>

                {/* Select User */}
                <Autocomplete
                  label="Select User"
                  items={users}
                  selectedKey={selectedUser}
                  onSelectionChange={setSelectedUser}
                >
                  {users.map((user) => (
                    <AutocompleteItem key={user.userID}>{user.firstName} {user.lastName}</AutocompleteItem>
                  ))}
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

      {/* Display tasks below the "Create Task" button */}
      <div>
        <h2 className="text-lg font-semibold mt-4">Tasks List</h2>
        <Table
          color={"primary"}
          selectionMode="single"
          defaultSelectedKeys={["2"]}
          aria-label="Example static collection table"
        >
          <TableHeader>
            <TableColumn>TASK ID</TableColumn>
            <TableColumn>NAME</TableColumn>
            <TableColumn>DESCRIPTION</TableColumn>
          </TableHeader>
          <TableBody>
            {tasks.map((task) => (
              <TableRow key={task.taskID}>
                <TableCell>{task.taskID}</TableCell>
                <TableCell>{task.name}</TableCell>
                <TableCell>{task.description}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default Tasks;
