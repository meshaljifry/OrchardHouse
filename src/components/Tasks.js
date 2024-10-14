import {Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure, Input, Textarea, Autocomplete, AutocompleteItem} from "@nextui-org/react";
import {Table, TableHeader, TableColumn, TableBody, TableRow, TableCell} from "@nextui-org/react";
import './Tasks.css';
import React, { useState, useEffect } from 'react';

const Tasks = () => {
  const {isOpen, onOpen, onOpenChange} = useDisclosure();
  
  const [animals, setAnimals] = useState();
  const [plants, setPlants] = useState();
  const [supplies, setSupplies] = useState();
  const [reports, setReports] = useState();
  const [newTask, setNewTask] = useState({code: '', name: '', description: '', animalID: '', plantID: '', supplyID: '', reportID: ''});
  const [animalValue, setAnimalValue] = useState();
  const [plantValue, setPlantValue] = useState();
  const [supplyValue, setSupplyValue] = useState();
  const [reportValue, setReportValue] = useState();
  const [tasks, setTasks] = useState([]);
  // Fetch Animal, Plant, Supply, and Report Lists
  useEffect(() => {
    fetchAnimals();
    fetchPlants();
    fetchSupplies();
    fetchReports();
    fetchTasks();
  },[]);

  const fetchAnimals = async () => {
     try {
      const response = await fetch('http://localhost:5000/api/getAnimalList')
      const data1 = await response.json();
   
      setAnimals(data1);
    } catch (error){
      console.error('Error fetching animals:', error);
    }
  };

  const fetchPlants  = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/getPlantList')
      const data = await response.json();
   
      setPlants(data);
    } catch (error){
      console.error('Error fetching plants:', error);
    }
  };

   const fetchSupplies  = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/getSupplyList')
      const data = await response.json();
   
      setSupplies(data);
    } catch (error){
      console.error('Error fetching supplies:', error);
    }
  };

  const fetchReports  = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/getReportList')
      const data = await response.json();
    
      setReports(data);
    } catch (error){
      console.error('Error fetching reports:', error);
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

  const clearNewTask = async () => {
    newTask.code = '';
    newTask.name = '';
    newTask.description = '';
    newTask.animalID = '';
    newTask.plantID = '';
    newTask.supplyID = '';
    newTask.reportID = '';

  }

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
                  <Button disabled={!(newTask.name.length > 1) & !(newTask.description.length > 1)} color="primary" onPress={() => {createTask(); onClose();}}>
                    Create
                  </Button>
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
            className="custom-table"
          >
            <TableHeader>
              <TableColumn>TASK ID</TableColumn>
              <TableColumn>NAME</TableColumn>
              <TableColumn>Description</TableColumn>
            </TableHeader>
            <TableBody>
              {tasks.map((task) => (
                <TableRow key={task.id}>
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
  }
  export default Tasks;
  