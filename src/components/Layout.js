import { Link } from 'react-router-dom';
import { Input, Avatar, Badge } from "@nextui-org/react";
import Logo from '../ohlogo.png'
import Test from './Test';
export default function Layout({ children }) {
  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="w-80 bg-[#f2f3ae] text-[#3c1518] p-6 flex flex-col justify-between">
        <div>
          {/* Logo at the corner with adjustable width and height */}
          <img 
            src={Logo}
            alt="Logo" 
            className="mb-10" 
            style={{ width: '100px', height: '100px' }} // Adjust height and width here
          />
          
          
          <ul>
            <li className="mb-6"><Link to="/" className="hover:text-gray-400">Dashboard</Link></li>
            <li className="mb-6"><Link to="/products" className="hover:text-gray-400">Products</Link></li>
            <li className="mb-6"><Link to="/scheduler" className="hover:text-gray-400">Scheduler</Link></li>
            <li className="mb-6"><Link to="/tasks" className="hover:text-gray-400">Tasks</Link></li>
          </ul>

          <h3 className="text-xl font-semibold mt-10 mb-6">Others</h3>
          <ul>
            <li className="mb-6"><Link to="/settings" className="hover:text-gray-400">Settings</Link></li>
            <li className="mb-6"><Link to="/payments" className="hover:text-gray-400">Payments</Link></li>
            <li className="mb-6"><Link to="/accounts" className="hover:text-gray-400">Accounts</Link></li>
            <li className="mb-6"><Link to="/help" className="hover:text-gray-400">Help</Link></li>
            <Test></Test>
          </ul>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top bar */}
        <div className="flex justify-between items-center bg-black text-[#3c1518] p-6">
          {/* Search bar */}
          <div className="w-1/3">
            <Input 
              placeholder="Search..." 
              clearable
              fullWidth
              className="bg-gray-700 text-[#3c1518] placeholder-[#3c1518]"
            />
          </div>

          {/* Icons */}
          <div className="flex items-center space-x-8">
            {/* Alert Icon */}
            <Badge content={3} color="error">
              <span className="text-2xl cursor-pointer text-[#3c1518]">🔔</span>
            </Badge>
            
            {/* Username */}
            <div className="text-lg">Username</div>
            
            {/* Profile Avatar */}
            <Avatar 
              src="https://i.pravatar.cc/150?u=username" 
              size="lg" 
              bordered 
            />
          </div>
        </div>

        {/* Page Content */}
        <div className="p-8 bg-[#f2f3ae] text-[#3c1518] flex-1">
          {children}
        </div>
      </div>
    </div>
  );
}
