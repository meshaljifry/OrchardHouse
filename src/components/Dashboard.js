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

const Dashboard = () => {
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({ name: '', price: '' });
  const [totalRevenue, setTotalRevenue] = useState(null);
  const [mostOrderedProducts, setMostOrderedProducts] = useState([]);
  const [orderComparisonData, setOrderComparisonData] = useState([]);
  const [employeeTasks, setEmployeeTasks] = useState([]); // New state for employee tasks data

  useEffect(() => {
    fetchProducts();
    fetchRevenue();
    fetchMostOrderedProducts();
    fetchOrderComparison();
    fetchEmployeeTasks(); // Fetch employee tasks data on component load
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
    </div>
  );
};

export default Dashboard;
