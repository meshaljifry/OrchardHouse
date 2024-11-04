// File: src/components/Dashboard.js

import React, { useState, useEffect } from 'react';
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend
} from 'recharts';

import './Dashboard.css';
import { Modal, ModalContent, ModalHeader, ModalBody, useDisclosure, Table, TableBody, TableRow, TableHeader, TableCell, TableColumn, Button, Input, Pagination, RadioGroup, Radio } from '@nextui-org/react';

const Dashboard = () => {
  const currentDate = new Date();
  const formattedDate = currentDate.toISOString().split('T')[0];
  const {isOpen, onOpen, onOpenChange} = useDisclosure();
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({ name: '', price: '' });
  const [totalRevenue, setTotalRevenue] = useState(null);
  const [mostOrderedProducts, setMostOrderedProducts] = useState([]);
  const [orderComparisonData, setOrderComparisonData] = useState([]);
  const [employeeTasks, setEmployeeTasks] = useState([]); // New state for employee tasks data
  const [discounts, setDiscounts] = useState([]);
  const [nonActiveDiscounts, setNonActiveDiscounts] = useState([]);
  const [newDiscount, setNewDiscount] = useState({code: '', name: '', description: '', percentOff: '', expireyDate: formattedDate});
  const [page, setPage] = useState(1);
  const [selectedDiscount, setSelectedDiscount] = useState();
  const [page2, setPage2] = useState(1);

  const rowsPerPage = 5;
  const pages = Math.ceil(discounts.length / rowsPerPage);
  const changedDiscounts = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return discounts.slice(start, end);
  }, [page, discounts]);

  const pages2 = Math.ceil(nonActiveDiscounts.length / rowsPerPage);
  const changedDiscounts2 = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return nonActiveDiscounts.slice(start, end);
  }, [page2, nonActiveDiscounts]);


  useEffect(() => {
    fetchProducts();

    fetchRevenue();
    fetchMostOrderedProducts();
    fetchOrderComparison();
    fetchEmployeeTasks(); // Fetch employee tasks data on component load
    fetchDiscounts();
    fetchNonActiveDiscounts();

  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/Item');
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };


  const fetchRevenue = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/totalRevenue');
      const data = await response.json();
      setTotalRevenue(data.totalRevenue);
    } catch (error) {
      console.error('Error fetching revenue:', error);
    }
  };

  const fetchMostOrderedProducts = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/mostOrderedProducts');
      const data = await response.json();
      setMostOrderedProducts(data);
    } catch (error) {
      console.error('Error fetching most ordered products:', error);
    }
  };

  const fetchOrderComparison = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/orderComparison');
      const data = await response.json();
      setOrderComparisonData(data);
    } catch (error) {
      console.error('Error fetching order comparison data:', error);
    }
  };

  // Fetch employee tasks data from backend
  const fetchEmployeeTasks = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/employeeTasks');
      const data = await response.json();
      setEmployeeTasks(data);
    } catch (error) {
      console.error('Error fetching employee tasks data:', error);
    }
  };
  const fetchDiscounts = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/getDiscounts');
      const data = await response.json();
      setDiscounts(data);
      console.log(data);
    } catch (error) {
      console.error('Error fetching discounts:', error);
    }
  }

  const fetchNonActiveDiscounts = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/getNonActiveDiscounts');
      const data = await response.json();
      setNonActiveDiscounts(data);
      console.log(data);
    } catch (error) {
      console.error('Error fetching discounts:', error);
    }
  }

  const handleDiscountVisibility = () => {
    const activeDiv = document.getElementById("activeDiv");
    const nonActiveDiv = document.getElementById("nonActiveDiv");

    if (selectedDiscount === "activeDiscounts") {
      nonActiveDiv.style.display = "block";
      activeDiv.style.display = "none";
    } else {
      nonActiveDiv.style.display = "none";
      activeDiv.style.display = "block";
    }
  }

  const createNewDiscount = async () => {
    try {
      await fetch('http://localhost:5000/api/createDiscount', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newDiscount),
      });
      await fetchDiscounts();
    } catch (error) {
      console.error('Error creating discount:', error);
    }
  }

  const clearNewDiscount = () => {
    setNewDiscount({code: '', name: '', description: '', percentOff: '', expireyDate: formattedDate});
  }

  const handleEditProduct = (id, field, value) => {
    setProducts((prevProducts) =>
      prevProducts.map((product) =>
        product.id === id ? { ...product, [field]: value } : product
      )
    );
  };

  const updateProduct = async (product) => {
    try {
      await fetch(`http://localhost:5000/api/Item/${product.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: product.name, price: product.price }),
      });
      fetchProducts();
    } catch (error) {
      console.error('Error updating product:', error);
    }
  };

  const addProduct = async () => {
    try {
      await fetch('http://localhost:5000/api/Item', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newProduct),
      });
      setNewProduct({ name: '', price: '' });
      fetchProducts();
    } catch (error) {
      console.error('Error adding product:', error);
    }
  };

  return (
    <div className="dashboard-container">
      {/* Revenue Display */}
      <div className="dashboard-item revenue">
        <h3>Total Revenue</h3>
        <p className="revenue-amount">
          {totalRevenue !== null ? `$${totalRevenue.toFixed(2)}` : 'Loading...'}
        </p>
      </div>

      {/* Employee Tasks Table */}
      <div className="dashboard-item employee-tasks">
        <h3>Your Time - Employee Tasks</h3>
        <table>
          <thead>
            <tr>
              <th>Employee Name</th>
              <th>Tasks Assigned</th>
              <th>Tasks Completed</th>
            </tr>
          </thead>
          <tbody>
            {employeeTasks.map((task, index) => (
              <tr key={index}>
                <td>{task.employeeName}</td>
                <td>{task.tasksAssigned}</td>
                <td>{task.tasksCompleted}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Most Ordered Products Table */}
      <div className="dashboard-item products">
        <h3>Most Ordered Products</h3>
        <table>
          <thead>
            <tr>
              <th>Product</th>
              <th>Orders</th>
              <th>Revenue</th>
            </tr>
          </thead>
          <tbody>
            {mostOrderedProducts.map((product, index) => (
              <tr key={index}>
                <td>{product.productName}</td>
                <td>{product.totalOrders}</td>
                <td>${product.totalRevenue.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Order Comparison Chart */}
      <div className="dashboard-item order-comparison">
        <h3>Orders Comparison (This Week vs Last Week)</h3>
        <LineChart width={350} height={200} data={orderComparisonData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="dayName" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="lastWeek" stroke="#8884d8" />
          <Line type="monotone" dataKey="thisWeek" stroke="#82ca9d" />
        </LineChart>
      </div>

      {/* Product Management Section */}
      <div className="dashboard-item product-management">
        <h3>Manage Products</h3>
        <table className="product-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Price</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id}>
                <td>
                  <input
                    type="text"
                    value={product.name}
                    onChange={(e) => handleEditProduct(product.id, 'name', e.target.value)}
                  />
                </td>
                <td>
                  <input
                    type="number"
                    value={product.price}
                    onChange={(e) => handleEditProduct(product.id, 'price', parseFloat(e.target.value))}
                  />
                </td>
                <td>
                  <button onClick={() => updateProduct(product)}>Update</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <h3>Add New Product</h3>
        <div className="add-product-form">
          <input
            type="text"
            placeholder="Product Name"
            value={newProduct.name}
            onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
          />
          <input
            type="number"
            placeholder="Price"
            value={newProduct.price}
            onChange={(e) => setNewProduct({ ...newProduct, price: parseFloat(e.target.value) })}
          />
          <button onClick={addProduct}>Add Product</button>
        </div>
      </div>

      {/* Discount Management Section */}
      <div className="dashboard-item discount-management" onClick={onOpen}>
        <Modal
          isOpen={isOpen}
          onOpenChange={() => {onOpenChange();}}
          size="5xl"
        >
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader className="flex flex-col gap-1">
                  Discount Management
                </ModalHeader>
                <ModalBody>
                  <table id="discountShowTable">
                    <tbody>
                      <tr>
                        <td class="discountShowTableData">Show </td>
                        <td class="discountShowTableData">
                          <RadioGroup
                          color="secondary"
                          defaultValue="activeDiscounts"
                          orientation='horizontal'
                          onValueChange={setSelectedDiscount}
                          onChange={handleDiscountVisibility}
                          value={selectedDiscount}
                         >
                          <Radio value="activeDiscounts">Active</Radio>
                          <Radio value="nonActiveDiscounts">Non-Active</Radio>
                         </RadioGroup>
                      </td>
                      </tr>
                    </tbody>
                  </table>
                  
                  <h3>Review Discounts</h3>
                <div id="activeDiv">
                  <Table 
                    className="discount-table"
                    bottomContent={
                      <div className="flex w-full justify-center">
                        <Pagination
                          isCompact
                          showControls
                          showShadow
                          color="secondary"
                          page={page}
                          total={pages}
                          onChange={(page) => setPage(page)}
                        />
                      </div>
                    }
                  >
                    <TableHeader>
                        <TableColumn key="Dcode">Code</TableColumn>
                        <TableColumn key="Dname">Name</TableColumn>
                        <TableColumn key="DpercentOff">PercentOff</TableColumn>
                        <TableColumn key="Ddescription">Description</TableColumn>
                        <TableColumn key="Ddate">Date</TableColumn>
                        {/* <TableColumn key="Dactions">Actions</TableColumn> */}
                    </TableHeader>
                    <TableBody
                      emptyContent={"No discounts to show."}
                    >
                      {changedDiscounts.map((discount) => (
                      <TableRow key={discount.id}>
                        <TableCell>{discount.code}</TableCell>
                        <TableCell>{discount.name}</TableCell>
                        <TableCell>{discount.percentOff}%</TableCell>
                        <TableCell>{discount.description}</TableCell>
                        <TableCell>{new Date(discount.expireyDate).toISOString().split('T')[0]}</TableCell>
                        {/* <TableCell>
                          <div className="flex gap-3 items-center">
                            <Button
                              className="quantity-button"
                              onClick={() => handleDiscountStatusChange(discount.id, 0)}
                              size="sm"
                              color="danger"
                            >
                              Deactivate
                            </Button>
                          </div>
                        </TableCell> */}
                      </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  </div>

                  <div id="nonActiveDiv" display="none">
                  <Table 
                    className="discount-table"
                    bottomContent={
                      <div className="flex w-full justify-center">
                        <Pagination
                          isCompact
                          showControls
                          showShadow
                          color="secondary"
                          page={page2}
                          total={pages2}
                          onChange={(page2) => setPage2(page2)}
                        />
                      </div>
                    }
                  >
                    <TableHeader>
                        <TableColumn key="D2code">Code</TableColumn>
                        <TableColumn key="D2name">Name</TableColumn>
                        <TableColumn key="D2percentOff">PercentOff</TableColumn>
                        <TableColumn key="D2description">Description</TableColumn>
                        <TableColumn key="D2date">Date</TableColumn>
                        {/* <TableColumn key="D2actions">Actions</TableColumn> */}
                    </TableHeader>
                    <TableBody
                      emptyContent={"No discounts to show."}
                    >
                      {changedDiscounts2.map((discount) => (
                      <TableRow key={discount.id}>
                        <TableCell>{discount.code}</TableCell>
                        <TableCell>{discount.name}</TableCell>
                        <TableCell>{discount.percentOff}%</TableCell>
                        <TableCell>{discount.description}</TableCell>
                        <TableCell>{new Date(discount.expireyDate).toISOString().split('T')[0]}</TableCell>
                        {/* <TableCell>
                          <div className="flex gap-3 items-center">
                            <Button
                              className="quantity-button"
                              onClick={() => handleDiscountStatusChange(discount.id, 1)}
                              size="sm"
                              color="success"
                            >
                              Activate
                            </Button>
                          </div>
                        </TableCell> */}
                      </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  </div>

                  <h3>Create a Discount</h3>
                  <Table>
                    <TableHeader>
                    <TableColumn key="CDcode">Code</TableColumn>
                        <TableColumn key="CDname">Name</TableColumn>
                        <TableColumn key="CDpercentOff">Percent Off</TableColumn>
                        <TableColumn key="CDdescription">Description</TableColumn>
                        <TableColumn key="CDdate">Expirey Date</TableColumn>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell>
                          <Input
                            clearable
                            isRequired
                            bordered
                            color="primary"
                            size="md"
                            id="discountCode"
                            value={newDiscount.code}
                            onChange={(e) => {setNewDiscount({...newDiscount, code: e.target.value})}}
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            clearable
                            isRequired
                            bordered
                            color="primary"
                            size="md"
                            id="discountName"
                            value={newDiscount.name}
                            onChange={(e) => {setNewDiscount({...newDiscount, name: e.target.value})}}
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            clearable
                            isRequired
                            bordered
                            type="number"
                            color="primary"
                            size="md"
                            id="discountPercentOff"
                            value={newDiscount.percentOff}
                            endContent={
                              <div className="pointer-events-none flex items-center">
                                <span className="text-default-400 text-small">%</span>
                              </div>
                            }
                            onChange={(e) => {setNewDiscount({...newDiscount, percentOff: e.target.value})}}
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            clearable
                            isRequired
                            bordered
                            color="primary"
                            size="md"
                            id="discountDescription"
                            value={newDiscount.description}
                            onChange={(e) => {setNewDiscount({...newDiscount, description: e.target.value})}}
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            clearable
                            isRequired
                            bordered
                            color="primary"
                            size="md"
                            type="date"
                            id="discountExpireyDate"
                            value={newDiscount.expireyDate}
                            onChange={(e) => {setNewDiscount({...newDiscount, expireyDate: e.target.value})}}
                          />
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                  <Button 
                    size="md" 
                    color="success"
                    onClick={() => {createNewDiscount(); clearNewDiscount();}}
                  > 
                    Create New Discount 
                  </Button>

                  {/* <h3>Add New Product</h3>
                  <div className="add-product-form">
                    <input
                      type="text"
                      placeholder="Product Name"
                      value={newProduct.name}
                      onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                    />
                    <input
                      type="number"
                      placeholder="Price"
                      value={newProduct.price}
                      onChange={(e) => setNewProduct({ ...newProduct, price: parseFloat(e.target.value) })}
                    />
                    <button onClick={addProduct}>Add Product</button>
                  </div> */}
                </ModalBody>
              </>
            )}
          </ModalContent>
        </Modal>
        <h3>Discount Management</h3>
        <p>Click to open the Discount Management Modal to see and create discounts.</p>
    </div>
  </div>
  );
};

export default Dashboard;
