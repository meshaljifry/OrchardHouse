// Layout.js
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; 
import { Input, Avatar, Badge, Button } from '@nextui-org/react';
import Logo from '../ohlogo.png';
import Test from './LoginButton';
import './Layout.css';

export default function Layout({ children }) {
  const [username, setUsername] = useState(localStorage.getItem('username'));
  const navigate = useNavigate();

  const fetchUsername = () => {
    const storedUsername = localStorage.getItem('username');
    setUsername(storedUsername);
  };

  useEffect(() => {
    fetchUsername();

    const handleStorageChange = () => {
      fetchUsername();
    };
    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('username');
    setUsername(null);
    navigate('/login');
  };

  return (
    <div className="layout-background">
      <div className="layout-container">
        <div className="sidebar">
          <div>
            <img src={Logo} alt="Logo" className="sidebar-logo" />
            <ul className="sidebar-menu">
              <li><Link to="/" className="sidebar-link">Dashboard</Link></li>
              <li><Link to="/products" className="sidebar-link">Products</Link></li>
              <li><Link to="/scheduler" className="sidebar-link">Scheduler</Link></li>
              <li><Link to="/tasks" className="sidebar-link">Tasks</Link></li>
            </ul>
            <h3 className="sidebar-heading">Others</h3>
            <ul className="sidebar-menu">
              <li><Link to="/settings" className="sidebar-link">Settings</Link></li>
              <li><Link to="/payments" className="sidebar-link">Payments</Link></li>
              <li><Link to="/accounts" className="sidebar-link">Accounts</Link></li>
              <li><Link to="/help" className="sidebar-link">Help</Link></li>
              <Link to="/register" className="sidebar-link">Register</Link>
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
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
