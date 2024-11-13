// File: src/components/Dashboard.js


import React, { useState, useEffect, useMemo } from 'react';
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
  const [totalDiscount, setTotalDiscount] = useState(null);
  const [mostOrderedProducts, setMostOrderedProducts] = useState([]);
  const [orderComparisonData, setOrderComparisonData] = useState([]);
  const [employeeTasks, setEmployeeTasks] = useState([]); // New state for employee tasks data
  const [discounts, setDiscounts] = useState([]);
  const [nonActiveDiscounts, setNonActiveDiscounts] = useState([]);
  const [newDiscount, setNewDiscount] = useState({code: '', name: '', description: '', percentOff: '', expireyDate: formattedDate});
  const [page, setPage] = useState(1);
  const [selectedDiscount, setSelectedDiscount] = useState();
  const [page2, setPage2] = useState(1);
  const [usedProductsPage, setUsedProductsPage] = useState(1);

  const rowsPerPage = 5;
  const pages = Math.ceil(discounts.length / rowsPerPage);
  const changedDiscounts = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return discounts.slice(start, end);
  }, [page, discounts]);

  const pages2 = Math.ceil(nonActiveDiscounts.length / rowsPerPage);
  const changedDiscounts2 = useMemo(() => {
    const start = (page2 - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return nonActiveDiscounts.slice(start, end);
  }, [page2, nonActiveDiscounts]);

  const usedProductsPages = Math.ceil(mostOrderedProducts.length / rowsPerPage);
  const usedProductsChange = useMemo(() => {
    const start = (usedProductsPage - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return mostOrderedProducts.slice(start, end);
  }, [usedProductsPage, mostOrderedProducts]);


  useEffect(() => {
    fetchProducts();

    fetchRevenue();
    fetchMostOrderedProducts();
    fetchOrderComparison();
    fetchEmployeeTasks(); // Fetch employee tasks data on component load
    fetchDiscounts();
    fetchNonActiveDiscounts();
    fetchDiscount();

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

  // For Revenue Totals Table
  const fetchDiscount = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/totalDiscount');
      const data = await response.json();
      setTotalDiscount(data.totalDiscount);
    } catch (error) {
      console.error('Error fetching discount:', error);
    }
  }

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
    } catch (error) {
      console.error('Error fetching discounts:', error);
    }
  }

  const fetchNonActiveDiscounts = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/getNonActiveDiscounts');
      const data = await response.json();
      setNonActiveDiscounts(data);
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

  const handleDiscountStatusChange = async (discountID, statusID) => {
    try {
      await fetch(`http://localhost:5000/api/setDiscountStatus/${discountID}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({statusID: statusID}),
      });
      fetchDiscounts();
      fetchNonActiveDiscounts();
    } catch (error) {
      console.error('Error updating discount status', error);
    }
  };

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
        <h3>Financial Totals</h3>
        <Table>
          <TableHeader>
            <TableColumn>Total Finding</TableColumn>
            <TableColumn>Amount</TableColumn>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>Revenue</TableCell>
              <TableCell>{totalRevenue !== null ? `$${totalRevenue.toFixed(2)}` : 'Loading...'}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Discounts</TableCell>
              <TableCell>{totalDiscount !== null ? `-$${totalDiscount.toFixed(2)}` : 'Loading...'}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Profit</TableCell>
              <TableCell><b>{totalRevenue !== null ? `$${(totalRevenue - totalDiscount).toFixed(2)}` : 'Loading...'}</b></TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>

      {/* Employee Tasks Table */}
      <div className="dashboard-item employee-tasks">
        <h3>Your Time - Employee Tasks</h3>
        <Table>
          <TableHeader>
              <TableColumn>Employee Name</TableColumn>
              <TableColumn>Tasks Assigned</TableColumn>
              <TableColumn>Tasks Completed</TableColumn>
          </TableHeader>
          <TableBody>
            {employeeTasks.map((task, index) => (
              <TableRow key={index}>
                <TableCell>{task.employeeName}</TableCell>
                <TableCell>{task.tasksAssigned}</TableCell>
                <TableCell>{task.tasksCompleted}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Most Ordered Products Table */}
      <div className="dashboard-item products">
        <h3>Most Purchased Products</h3>
        <Table
        className='mostOrderedProductsTable'
        bottomContent={
          <div className="flex w-full justify-center">
            <Pagination
              isCompact
              showControls
              showShadow
              color="secondary"
              page={usedProductsPage}
              total={usedProductsPages}
              onChange={(usedProductsPage) => setUsedProductsPage(usedProductsPage)}
            />
          </div>
        }>
          <TableHeader>
              <TableColumn>Product</TableColumn>
              <TableColumn>Purchased</TableColumn>
              <TableColumn>Total Revenue</TableColumn>
          </TableHeader>
          <TableBody>
            {usedProductsChange.map((product, index) => (
              <TableRow key={index}>
                <TableCell>{product.productName}</TableCell>
                <TableCell>{product.totalOrders}</TableCell>
                <TableCell>${product.totalRevenue.toFixed(2)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
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
                        <TableColumn key="Ddate">Official Expiration</TableColumn>
                        <TableColumn key="Dactions">Action</TableColumn>
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
                        <TableCell>
                          <div className="flex gap-3 items-center">
                            <Button
                              className="quantity-button"
                              onClick={() => handleDiscountStatusChange(discount.discountID, 17)}
                              size="sm"
                              color="danger"
                            >
                              Deactivate
                            </Button>
                          </div>
                        </TableCell>
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
                        <TableColumn key="D2date">Official Expiration</TableColumn>
                        <TableColumn key="D2actions">Action</TableColumn>
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
                        <TableCell>
                          <div className="flex gap-3 items-center">
                            <Button
                              className="quantity-button"
                              onClick={() => handleDiscountStatusChange(discount.discountID, 16)}
                              size="sm"
                              color="success"
                            >
                              Activate
                            </Button>
                          </div>
                        </TableCell>
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
                </ModalBody>
              </>
            )}
          </ModalContent>
        </Modal>
        <h3>Discount Management</h3>
        <h2><b>Click Me!</b></h2>
    </div>
  </div>
  );
};

export default Dashboard;
