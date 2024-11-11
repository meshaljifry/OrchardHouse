
import React, { useState, useEffect } from 'react';
import {Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure, Spacer, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Autocomplete, AutocompleteItem, RadioGroup, Radio, Input} from "@nextui-org/react";
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
  //const [posInput, setPosInput] = useState({ itemNumber: '', price: '', creditCard: '' });
  const {isOpen, onOpen, onOpenChange} = useDisclosure();
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [productValue, setProductValue] = useState();
  const [selectedPayment, setSelectedPayment] = useState("card");
  const [payment, setPayment] = useState({paymentType: '', cardNumber: '', cardExpiration: '', cardCode: '', cashGiven: ''});
  const [newTransaction, setNewTransaction] = useState({date: '', userID: ''});
  const [selectedDiscount, setSelectedDiscount] = useState([]);
  const [discounts, setDiscounts] = useState([]);

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
    fetchDiscount();
    fetchProducts();
  }, []);

  const changeDiscount = () => {

    const codeInput = document.getElementById('discountInput').value;
    const isFound = discounts.find(discount => discount.code === codeInput);

    if (isFound != null) {
      //Set found discount
      setSelectedDiscount(isFound);

    } else {
      alert(codeInput + " is not a valid discount code.");
    }
  }

  const fetchDiscount = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/getDiscounts');
      const data = await response.json();
      setDiscounts(data);
    } catch (error) {
      console.error('Error fetching discounts', error);
    }
  }

  const handlePaymentOptionVisibility = () => {
    const cardDiv = document.getElementById("cardDiv");
    const cashDiv = document.getElementById("cashDiv");

    if (selectedPayment === "cash") {
      cardDiv.style.display = "block";
      cashDiv.style.display = "none";
      setPayment({...payment, paymentType: "card"})
    } else {
      cardDiv.style.display = "none";
      cashDiv.style.display = "block";
      setPayment({...payment, paymentType: "cash"})
    }
  }

  const handleCartQuantityChange = (productId, delta) => {
    if (delta === 0) {
      setCart((cart).filter(item => item.itemID !== +productId))
    } else if (delta === -1) {
      setCart(prevCart => prevCart.map((item) =>
        item.itemID === +productId
          ? {...item, quantity: Math.max(1, item.quantity - 1)}
          : item
      ))
    } else {
      setCart(prevCart => prevCart.map((item) =>
        item.itemID === +productId
          ? {...item, quantity: item.quantity + 1}
          : item
      ))
    }
  };

  const calculateTotal = (toCalculate) => {
    
    const totalItemsCombined = cart.reduce((total, item) => total + item.price * item.quantity, 0);
    var discount = 0;

    if(selectedDiscount.discountID != null){
      discount = totalItemsCombined * (selectedDiscount.percentOff*.01);
    }
    const tax = (totalItemsCombined - discount) * 0.06;

    if (toCalculate === 0) {
      //Return Pre-Tax Total
      return totalItemsCombined.toFixed(2);

    } else if (toCalculate === 1) {
      //Return Tax
      return tax.toFixed(2);

    } else if (toCalculate === 4){
      //Return amount taken off by discounts
      return discount.toFixed(2)
      
    } else {
      //Return Total
      return (totalItemsCombined + tax - discount).toFixed(2);
    }
  }

  const clearTransaction = () => {
    payment.cardNumber = '';
    payment.cardExpiration = '';
    payment.cardCode = '';
    payment.cashGiven = '';
    payment.cashGiven = '';
    setCart((cart).filter(item => item.itemID === -1));
    document.getElementById('cardNumber').value = '';
    document.getElementById('cardExpiration').value = '';
    document.getElementById('cardCode').value = '';
    document.getElementById('cashGiven').value = '';
    document.getElementById('changeGiven').value = '';
    document.getElementById('search').value = '';
    document.getElementById('discountInput').value = '';
    setSelectedDiscount(0);
  }

  const handlePOSSubmit = async () => {
    //Handle Transaction and Payment Submission Logic

    var safeToSubmit = true;
    
    //Check to ensure that the transaction is full and has data
    if (cart.size < 1) {
      //cart is empty
      alert('Please add an item to the transaction')
      safeToSubmit = false;
    }

    if (payment.paymentType === null) {
      //payment is empty
      safeToSubmit = false;
      alert('Please submit payment information');
    }

    if (safeToSubmit) {
    //submit transaction and recieve id back
      newTransaction.date = new Date().toISOString().split('T')[0];
      newTransaction.userID = localStorage.getItem('userID');
      newTransaction.cart = cart;
      newTransaction.paymentType = payment.paymentType;
      newTransaction.cardNumber = payment.cardNumber;
      newTransaction.cardExpiration = payment.cardExpiration;
      newTransaction.cardCode = payment.cardCode;
      newTransaction.discount = selectedDiscount.discountID;
      try {
        await fetch('http://localhost:5000/api/createTransaction', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newTransaction),
        });
      } catch (error) {
        console.error('Error creating transaction:');
      }

    }
  };

  const addToCart = (productValue) => {
    const productToAdd = products.find(product => product.itemID === +productValue);
    const productInCart = cart.find((product) => product.itemID === +productValue);
    if (productInCart) {
      // Update quantity if product already in cart
      setCart(prevCart => prevCart.map((item) =>
          item.itemID === +productToAdd.itemID
            ? {...item, quantity: item.quantity + 1}
            : item
        ))
      } else {
        // Add new product to cart
       setCart(prevCart => [...prevCart, {itemID: productToAdd.itemID, name: productToAdd.name, description: productToAdd.description, price: productToAdd.price, quantity: 1}])
      }
  }

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
          onOpenChange={() => {onOpenChange(); handlePaymentOptionVisibility();}}
          size="full" //maybe change based on inputs
        >
        <ModalContent>
        {(onClose) => (
              <>
                <ModalHeader className="flex flex-col gap-1">
                  POS
                </ModalHeader>
                <ModalBody>
                <div className="flex w-full flex-wrap md:flex-nowrap mb-6 md:mb-0 gap-4" >
                {/* Search for Product or Scan Products Into Here */}
                <Spacer x='10'/><Autocomplete
                    labelPlacement="inside"
                    placeholder="Search products..."
                    classname="max-w-xs"
                    bordered
                    id="search"
                    defaultItems={products}
                    className="max-w-xs"
                    selectedKey={productValue}
                    onSelectionChange={setProductValue}
                    //onChange={addToCart(productValue)} causes site to crash
                   >
                    {products.map((product) => (
                      <AutocompleteItem key={product.itemID}>
                        {product.name}
                      </AutocompleteItem>
                    ))}
                    </Autocomplete>
                    <Button
                     color="primary" 
                     onPress={() => {addToCart(productValue);}}
                     size="md"
                    >
                    Add Product to Transaction
                    </Button>
                  </div>
                <div className="dashboard-container">
                    <div className="dashboard-item">
                      <Table aria-label="Example empty table">
                        <TableHeader>
                          <TableColumn key="name">Product</TableColumn>
                          <TableColumn key="height">Unit Price</TableColumn>
                          <TableColumn key="quantity">Quantity</TableColumn>
                          <TableColumn>Product Total</TableColumn>
                          <TableColumn>Actions</TableColumn>
                        </TableHeader>
                        <TableBody 
                          emptyContent={"Search for a product to add to the transaction."}
                          items={cart}
                        >
                        {(item) => (
                          <TableRow key={item.itemID}>
                            <TableCell>{item.name}</TableCell>
                            <TableCell>${item.price.toFixed(2)}</TableCell>
                            <TableCell>{item.quantity}</TableCell>
                            <TableCell>${(item.price * item.quantity).toFixed(2)}</TableCell>
                            <TableCell>
                              <div className="flex gap-3 items-center">
                                <Button
                                  className="quantity-button"
                                  onClick={() => handleCartQuantityChange(item.itemID, +1)}
                                  size="sm"
                                  color="success"
                                >
                                  +
                                </Button>
                                <Button
                                  className="quantity-button"
                                  onClick={() => handleCartQuantityChange(item.itemID, -1)}
                                  size="sm"
                                  color="warning"
                                >
                                  -
                                </Button>
                                <Button
                                  className="quantity-button"
                                  onClick={() => handleCartQuantityChange(item.itemID, 0)}
                                  size="sm"
                                  color="danger"
                                >
                                  Delete
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                          )}
                        </TableBody>
                      </Table>
                    </div>
                    <div className='dashboarditem'>
                      <Table hideHeader aria-label="Example empty table">
                        <TableHeader>
                          <TableColumn></TableColumn>
                          <TableColumn></TableColumn>
                        </TableHeader>
                        <TableBody emptyContent={"No rows to display."}>
                          <TableRow key="PreTotal">
                            <TableCell>Sub Total</TableCell>
                            <TableCell>${calculateTotal(0)}</TableCell>
                          </TableRow>
                          <TableRow key="Discounts">
                            <TableCell>Discount</TableCell>
                            <TableCell>-${calculateTotal(4)}</TableCell>
                          </TableRow>
                          <TableRow key="Tax">
                            <TableCell>Tax</TableCell>
                            <TableCell>${calculateTotal(1)}</TableCell>
                          </TableRow>
                          <TableRow key="Total">
                            <TableCell>Combined Total</TableCell>
                            <TableCell>${calculateTotal(2)}</TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                      <Spacer y="3"/>
                      <div className="flex w-full flex-wrap md:flex-nowrap mb-6 md:mb-0 gap-4">
                      <Input
                      id="discountInput"
                      label="Enter Discount Code"
                      isClearable
                      bordered
                      className="max-w-xs"
                      size="md"
                    />
                    <Button
                      color="primary" 
                      onPress={() => {changeDiscount();}}
                      size="md"
                      className="max-w-xs"
                    >
                      Try Discount Code
                    </Button>
                    </div>
                      <Spacer y="3"/>

                      <RadioGroup
                        label="Select Mode of Payment"
                        orientation='horizontal'
                        onValueChange={setSelectedPayment}
                        onChange={handlePaymentOptionVisibility}
                        value={selectedPayment}
                      >
                        <Radio value="card">Credit/Debit</Radio>
                        <Radio value="cash">Cash</Radio>
                      </RadioGroup>
                  <div id="cardDiv">
                    <Input
                      id="cardNumber"
                      label="Card Number"
                      isClearable
                      bordered
                      size="md"
                      placeholder='xxxxxxxxxxxxxxxx'
                      labelPlacement='outside-left'
                      value={payment.cardNumber}
                      onChange={(e) => {setPayment({...payment,cardCode: e.target.value})}}
                    />

                    <Spacer y="2.5"/>

                    <Input
                      id="cardExpiration"
                      label="Card Expiration Date"
                      isClearable
                      bordered
                      size="md"
                      labelPlacement='outside-left'
                      placeholder='x/xx'
                      value={payment.cardExpiration}
                      onChange={(e) => {setPayment({...payment, cardExpiration: e.target.value})}}
                    />

                    <Spacer y="2.5"/>

                    <Input
                      id="cardCode"
                      label="Card Security Code"
                      isClearable
                      bordered
                      size="md"
                      placeholder="xxx"
                      labelPlacement='outside-left'
                      value={payment.cardCode}
                      onChange={(e) => {setPayment({...payment,cardCode: e.target.value})}}
                      />
                  </div>

                  <Spacer y='2.5' />

                  <div>
                    <div id="cashDiv">
                      <Input
                        id="cashGiven"
                        label="Cash Received"
                        isClearable
                        placeholder='0.00'
                        bordered
                        labelPlacement='outside-left'
                        value={payment.cashGiven}
                        type="number"
                        size="md"
                        startContent={
                          <div className="pointer-events-none flex items-center">
                            <span className="text-default-400 text-small">$</span>
                          </div>
                        }
                        onChange={(e) => {setPayment({...payment,cashGiven: e.target.value})}}
                      />
                      <Spacer y="2.5"/>
                      <Input
                        id="changeGiven"
                        label="Change"
                        bordered
                        readOnly
                        labelPlacement='outside-left'
                        type="number"
                        placeholder='0.00'
                        size="md"
                        value={(payment.cashGiven - calculateTotal(2)).toFixed(2)}
                        startContent={
                          <div className="pointer-events-none flex items-center">
                            <span className="text-default-400 text-small">$</span>
                          </div>
                        }
                      /> 
                    </div>
                  </div>
                    </div>
                </div>
                {/* See Selected Products */}
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
                  <Spacer x="2.5"/>
                  <Button
                   color="primary" 
                   onPress={() => {handlePOSSubmit(); clearTransaction();}}
                   size="lg"
                  >
                    Submit Transaction
                  </Button>
                </ModalFooter>
              </>
              )}
          </ModalContent>
        </Modal>
        <h3>POS System</h3>
        <p>Open the POS system to assist a customer take home their purchases.</p>
      </div>
      
    </div>
  );
};

export default EmployeeDashboard;
