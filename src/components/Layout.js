// Layout.js
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; 
import { Input, Avatar, Badge, Button } from '@nextui-org/react';
import Logo from '../ohlogo.png';
import Test from './LoginButton';
import Dashboard from './Dashboard';
import EmployeeDashboard from './EmployeeDashboard';
import UserDashboard from './UserDashboard';
import './Layout.css';

export default function Layout({ children }) {
  const [username, setUsername] = useState(localStorage.getItem('username'));
  const [roleID, setRoleID] = useState(localStorage.getItem('roleID'));
  const navigate = useNavigate();

  // Fetch user data on component mount
  const fetchUserData = () => {
    const storedUsername = localStorage.getItem('username');
    const storedRoleID = localStorage.getItem('roleID');
    setUsername(storedUsername);
    setRoleID(storedRoleID);
  };

  // Update user data on component mount and when localStorage changes
  useEffect(() => {
    fetchUserData();

    const handleStorageChange = () => {
      fetchUserData();
    };
    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  // Handle logout by clearing localStorage and navigating to login page
  const handleLogout = () => {
    localStorage.removeItem('username');
    localStorage.removeItem('roleID');
    setUsername(null);
    setRoleID(null);
    navigate('/login');
  };

  // Render the appropriate dashboard based on roleID
  const renderDashboard = () => {
    if (roleID === '1' || roleID === '2') {
      return <Dashboard />;
    } else if (roleID === '3') {
      return <EmployeeDashboard />;
    } else {
      return <UserDashboard />;
    }
  };

  // Render sidebar menu based on roleID
  const renderSidebarMenu = () => {
    if (roleID === '1' || roleID === '2') {
      return (
        <>
          <li><Link to="/" className="sidebar-link">Dashboard</Link></li>
          <li><Link to="/products" className="sidebar-link">Products</Link></li>
          <li><Link to="/scheduler" className="sidebar-link">Scheduler</Link></li>
          <li><Link to="/tasks" className="sidebar-link">Tasks</Link></li>
        </>
      );
    } else if (roleID === '3') {
      return (
        <>
          <li><Link to="/" className="sidebar-link">Dashboard</Link></li>
          <li><Link to="/tasks" className="sidebar-link">Tasks</Link></li>
        </>
      );
    } else {
      return (
        <>
          <li><Link to="/" className="sidebar-link">Dashboard</Link></li>
          <li><Link to="/products" className="sidebar-link">Products</Link></li>
        </>
      );
    }
  };

  return (
    <div className="layout-background">
      <div className="layout-container">
        <div className="sidebar">
          <div>
            <img src={Logo} alt="Logo" className="sidebar-logo" />
            <ul className="sidebar-menu">
              {renderSidebarMenu()}
            </ul>
            <h3 className="sidebar-heading">Others</h3>
            <ul className="sidebar-menu">
              <li><Link to="/help" className="sidebar-link">Help</Link></li>
              {!username && <li><Link to="/login" className="sidebar-link">Login</Link></li>}
              <Test />
            </ul>
          </div>
        </div>

        <div className="main-content">
          <div className="top-bar">
            <div className="search-bar">
              <Input
                placeholder="Search..."
                clearable
                fullWidth
                className="input-field"
              />
            </div>

            <div className="icons-section">
              <Badge content={3} color="error">
                <span className="alert-icon">🔔</span>
              </Badge>

              {username ? (
                <div className="user-section">
                  <div className="username">
                    {username}
                    <Avatar src={`https://i.pravatar.cc/150?u=${username}`} size="lg" bordered />
                  </div>
                  <Button auto color="error" bordered onClick={handleLogout}>
                    Logout
                  </Button>
                </div>
              ) : (
                <Link to="/login">
                  <Button auto color="primary" bordered>
                    Go to Login
                  </Button>
                </Link>
              )}
            </div>
          </div>

          <div className="page-content">
            {children ? children : renderDashboard()}
          </div>
        </div>
      </div>
    </div>
  );
}
