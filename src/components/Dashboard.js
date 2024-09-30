// File: src/components/Dashboard.js
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, PieChart, Pie, Cell, LineChart, Line, CartesianGrid, Legend } from 'recharts';
import './Dashboard.css'; // Importing external CSS file

const mockRevenueData = [
  { name: 'Jan', revenue: 4000 },
  { name: 'Feb', revenue: 3000 },
  { name: 'Mar', revenue: 2000 },
  { name: 'Apr', revenue: 2780 },
  { name: 'May', revenue: 1890 },
];

const mockTimeData = [
  { name: 'Tasks', value: 70 },
  { name: 'Farm', value: 30 },
];

const COLORS = ['#0088FE', '#00C49F'];

const farmPhotos = [
  'https://example.com/photo1.jpg',
  'https://example.com/photo2.jpg',
  'https://example.com/photo3.jpg',
  'https://example.com/photo4.jpg',
];

const productsData = [
  { product: 'Product A', orders: 100, revenue: 1200 },
  { product: 'Product B', orders: 80, revenue: 950 },
  { product: 'Product C', orders: 60, revenue: 700 },
];

const orderComparisonData = [
  { name: 'Monday', lastWeek: 20, thisWeek: 25 },
  { name: 'Tuesday', lastWeek: 40, thisWeek: 35 },
  { name: 'Wednesday', lastWeek: 50, thisWeek: 45 },
  { name: 'Thursday', lastWeek: 30, thisWeek: 40 },
  { name: 'Friday', lastWeek: 35, thisWeek: 50 },
];

const Dashboard = () => {
  return (
    <div className="dashboard-container">
      <div className="dashboard-item revenue">
        <h3>Revenue</h3>
        <BarChart width={350} height={200} data={mockRevenueData}>
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="revenue" fill="#8884d8" />
        </BarChart>
      </div>

      <div className="dashboard-item time-pie">
        <h3>Your Time</h3>
        <PieChart width={350} height={200}>
          <Pie data={mockTimeData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} fill="#8884d8">
            {mockTimeData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </div>

    {/*   <div className="dashboard-item farm-photos">
        <h3>Farm Photos</h3>
        <div className="photo-grid">
          {farmPhotos.map((url, index) => (
            <img key={index} src={url} alt={`Farm ${index}`} className="farm-photo" />
          ))}
        </div>
      </div> */}

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
            {productsData.map((product, index) => (
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
        <LineChart width={350} height={200} data={orderComparisonData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="lastWeek" stroke="#8884d8" />
          <Line type="monotone" dataKey="thisWeek" stroke="#82ca9d" />
        </LineChart>
      </div>
    </div>
  );
};

export default Dashboard;
