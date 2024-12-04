// App.js
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import EmployeeDashboard from './components/EmployeeDashboard';
import UserDashboard from './components/UserDashboard';
import Products from './components/Products';
import Scheduler from './components/Scheduler';
import Tasks from './components/Tasks';
import Settings from './components/Settings';
import Payments from './components/Payments';
import Accounts from './components/Accounts';
import Help from './components/Help';
import Login from './Pages/Login';
import Register from './components/Register';
import Calendar from './components/Calendar';
import { useState, useEffect } from 'react';
import AccountManagement from './components/AccountManagement';

function App() {
  const [roleID, setRoleID] = useState(null);

  useEffect(() => {
    const storedRoleID = localStorage.getItem('roleID');
    setRoleID(storedRoleID ? parseInt(storedRoleID) : null);
  }, []);

  const renderDashboard = () => {
    if (roleID === 1 || roleID === 2) {
      return <Dashboard />;
    } else if (roleID === 3) {
      return <EmployeeDashboard />;
    } else {
      return <UserDashboard />;
    }
  };

  return (
    <div className="bg-[#f2f3ae] min-h-screen">
      <Router>
        <Layout>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/products" element={<Products />} />
            <Route path="/scheduler" element={<Scheduler />} />
            <Route path="/tasks" element={<Tasks />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/payments" element={<Payments />} />
            <Route path="/accounts" element={<Accounts />} />
            <Route path="/help" element={<Help />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/employee-dashboard" element={<EmployeeDashboard />} />
            <Route path="/user-dashboard" element={<UserDashboard />} />
            <Route path="/calendar" element={<Calendar />} />
            <Route path="/AccountManagement" element={<AccountManagement />} />

            {/* Conditional dashboard route based on role */}
            <Route path="/" element={renderDashboard()} />
          </Routes>
        </Layout>
      </Router>
    </div>
  );
}

export default App;
