import { Link } from 'react-router-dom'; 
import { Input, Avatar, Badge } from "@nextui-org/react";
import Logo from '../ohlogo.png';
import Test from './Test';
import background from '../background.jpg';
import './Layout.css'; // Import external CSS file

export default function Layout({ children }) {
  return (
    <div className="layout-background">
      <div className="layout-container">
        {/* Sidebar */}
        <div className="sidebar">
          <div>
            {/* Logo */}
            <img 
              src={Logo} 
              alt="Logo" 
              className="sidebar-logo" 
            />

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
              <Test></Test>
            </ul>
          </div>
        </div>

        {/* Main Content */}
        <div className="main-content">
          {/* Top bar */}
          <div className="top-bar">
            {/* Search bar */}
            <div className="search-bar">
              <Input 
                placeholder="Search..." 
                clearable
                fullWidth
                className="input-field"
              />
            </div>

            {/* Icons */}
            <div className="icons-section">
              {/* Alert Icon */}
              <Badge content={3} color="error">
                <span className="alert-icon">🔔</span>
              </Badge>

              {/* Username */}
              <div className="username">Username</div>

              {/* Profile Avatar */}
              <Avatar 
                src="https://i.pravatar.cc/150?u=username" 
                size="lg" 
                bordered 
              />
            </div>
          </div>

          {/* Page Content */}
          <div className="page-content">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
