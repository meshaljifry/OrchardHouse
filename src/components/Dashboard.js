// File: src/components/Dashboard.js
import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, PieChart, Pie, Cell, LineChart, Line, CartesianGrid, Legend } from 'recharts';
import './Dashboard.css';

const Dashboard = () => {
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({ name: '', price: '' });

  // Load initial products
  useEffect(() => {
    fetchProducts();
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
      fetchProducts(); // Refresh product list
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
      setNewProduct({ name: '', price: '' }); // Clear form
      fetchProducts(); // Refresh product list
    } catch (error) {
      console.error('Error adding product:', error);
    }
  };

  return (
    <div className="dashboard-container">
      {/* Existing Dashboard Content */}
      <div className="dashboard-item revenue">
        <h3>Revenue</h3>
        <BarChart width={350} height={200} data={[
          { name: 'Jan', revenue: 4000 },
          { name: 'Feb', revenue: 3000 },
          { name: 'Mar', revenue: 2000 },
          { name: 'Apr', revenue: 2780 },
          { name: 'May', revenue: 1890 },
        ]}>
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="revenue" fill="#8884d8" />
        </BarChart>
      </div>

      <div className="dashboard-item time-pie">
        <h3>Your Time</h3>
        <PieChart width={350} height={200}>
          <Pie data={[
            { name: 'Tasks', value: 70 },
            { name: 'Farm', value: 30 },
          ]} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} fill="#8884d8">
            <Cell fill="#0088FE" />
            <Cell fill="#00C49F" />
          </Pie>
          <Tooltip />
        </PieChart>
      </div>

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
            {[
              { product: 'Product A', orders: 100, revenue: 1200 },
              { product: 'Product B', orders: 80, revenue: 950 },
              { product: 'Product C', orders: 60, revenue: 700 },
            ].map((product, index) => (
              <tr key={index}>
                <td>{product.product}</td>
                <td>{product.orders}</td>
                <td>${product.revenue}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="dashboard-item order-comparison">
        <h3>Orders Comparison (This Week vs Last Week)</h3>
        <LineChart width={350} height={200} data={[
          { name: 'Monday', lastWeek: 20, thisWeek: 25 },
          { name: 'Tuesday', lastWeek: 40, thisWeek: 35 },
          { name: 'Wednesday', lastWeek: 50, thisWeek: 45 },
          { name: 'Thursday', lastWeek: 30, thisWeek: 40 },
          { name: 'Friday', lastWeek: 35, thisWeek: 50 },
        ]}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
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
