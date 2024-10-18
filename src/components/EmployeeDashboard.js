
import React, { useState, useEffect } from 'react';
import {Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure, Spacer, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Autocomplete, AutocompleteItem, listbox} from "@nextui-org/react";
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
  
  const {isOpen, onOpen, onOpenChange} = useDisclosure();
  const [searchTerm, setSearchTerm] = useState('');
  const [products, setProducts] = useState([]);
  const [hideSuggestions, setHideSuggestions] = useState(true);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setPosInput((prev) => ({ ...prev, [name]: value }));
  };

  const handlePosSubmit = () => {
    // Here, we would normally handle payment submission logic
    console.log('POS data submitted:', posInput);
    setPosInput({ itemNumber: '', price: '', creditCard: '' });
  };

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/Item');
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, []);

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
      <div className="dashboard-item pos-system" onClick={onOpen}>
        <Modal 
          isOpen={isOpen} 
          onOpenChange={onOpenChange}
          size="5xl" //maybe change based on inputs

        >
        <ModalContent>
        {(onClose) => (
              <>
                <ModalHeader className="flex flex-col gap-1">
                  POS
                </ModalHeader>
                <ModalBody>
                {/* Search for Product or Scan Products Into Here */}
                <Autocomplete
                    labelPlacement="inside"
                    placeholder="Search products..."
                    classname="max-w-xs"
                    bordered
                    items={products}
                    //onChange={handleSearchChange}
                    className="max-w-xs"
                    //onSelectionChange={list.setFilterText(key)}
                   >
                    {products.map((product) => (
                      <AutocompleteItem key={product.itemID}>
                        {product.itemID} {product.name}
                      </AutocompleteItem>
                    ))}
                    </Autocomplete>
                {/* See Selected Products */}
                <Table aria-label="Example empty table">
                  <TableHeader>
                    <TableColumn>Product</TableColumn>
                    <TableColumn>Unit Price</TableColumn>
                    <TableColumn>Quantity</TableColumn>
                    <TableColumn>Product Total</TableColumn>
                  </TableHeader>
                  <TableBody emptyContent={"Search for a product to add to the transaction."}>{[]}</TableBody>
                </Table>

                <Table hideHeader aria-label="Example empty table">
                  <TableHeader>
                    <TableColumn></TableColumn>
                    <TableColumn></TableColumn>
                  </TableHeader>
                  <TableBody emptyContent={"No rows to display."}>
                    <TableRow key="PreTotal">
                      <TableCell>Pre-Tax Total</TableCell>
                      <TableCell>$00.00</TableCell>
                    </TableRow>
                    <TableRow key="Tax">
                      <TableCell>Tax</TableCell>
                      <TableCell>$00.00</TableCell>
                    </TableRow>
                    <TableRow key="Total">
                      <TableCell>Combined Total</TableCell>
                      <TableCell>$00.00</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
                  
                </ModalBody>
                <ModalFooter>
                   <Button 
                    color="danger" 
                    variant="light" 
                    onPress={() => {onClose();}}
                    size="md"
                  >
                    Close POS System
                  </Button>
                  <Spacer y="2.5"/>
                  <Button
                   color="primary" 
                   onPress={() => {onClose();}}
                   size="lg"
                  >
                    Submit Transaction - Change to not close the screen
                  </Button>
                </ModalFooter>
              </>
              )}
          </ModalContent>
        </Modal>
        <h3>POS System</h3>
        <p>Image of POS Modal Here Possibly Idk</p>
        {/* <form onSubmit={(e) => e.preventDefault()}>
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
        </form> */}
      </div>
      
    </div>
  );
};

export default EmployeeDashboard;
