// File: src/components/Dashboard.js
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, PieChart, Pie, Cell, LineChart, Line, CartesianGrid, Legend } from 'recharts';

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
    <div
      className="grid grid-cols-12 gap-4 p-6"
      style={{
        gridTemplateAreas: `
          'revenue pie pie'
          'photos products comparison'
        `,
        gridTemplateColumns: 'repeat(12, 1fr)', // Ensure we have a 12-column grid layout
        gridAutoRows: 'minmax(200px, auto)', // Define row height
      }}
    >
      {/* Part 1: Revenue Chart */}
      <div className="bg-white shadow-md rounded-lg p-4 col-span-6" style={{ gridArea: 'revenue' }}>
        <h3 className="text-xl font-bold mb-4">Revenue</h3>
        <BarChart width={350} height={200} data={mockRevenueData}>
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="revenue" fill="#8884d8" />
        </BarChart>
      </div>

      {/* Part 2: Your Time Pie Chart */}
      <div className="bg-white shadow-md rounded-lg p-4 col-span-6" style={{ gridArea: 'pie' }}>
        <h3 className="text-xl font-bold mb-4">Your Time</h3>
        <PieChart width={350} height={200}>
          <Pie data={mockTimeData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} fill="#8884d8">
            {mockTimeData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </div>

      {/* Part 3: Farm Photos */}
      <div className="bg-white shadow-md rounded-lg p-4 col-span-4" style={{ gridArea: 'photos' }}>
        <h3 className="text-xl font-bold mb-4">Farm Photos</h3>
        <div className="grid grid-cols-2 gap-2">
          {farmPhotos.map((url, index) => (
            <img key={index} src={url} alt={`Farm ${index}`} className="w-full h-24 object-cover rounded-lg" />
          ))}
        </div>
      </div>

      {/* Part 4: Most Ordered Products */}
      <div className="bg-white shadow-md rounded-lg p-4 col-span-4" style={{ gridArea: 'products' }}>
        <h3 className="text-xl font-bold mb-4">Most Ordered Products</h3>
        <table className="min-w-full bg-white">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b">Product</th>
              <th className="py-2 px-4 border-b">Orders</th>
              <th className="py-2 px-4 border-b">Revenue</th>
            </tr>
          </thead>
          <tbody>
            {productsData.map((product, index) => (
              <tr key={index}>
                <td className="py-2 px-4 border-b">{product.product}</td>
                <td className="py-2 px-4 border-b">{product.orders}</td>
                <td className="py-2 px-4 border-b">${product.revenue}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Part 5: Orders Comparison */}
      <div className="bg-white shadow-md rounded-lg p-4 col-span-4" style={{ gridArea: 'comparison' }}>
        <h3 className="text-xl font-bold mb-4">Orders Comparison (This Week vs Last Week)</h3>
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
