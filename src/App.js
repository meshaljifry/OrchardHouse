import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import Products from './components/Products';
import Scheduler from './components/Scheduler';
import Tasks from './components/Tasks';
import Settings from './components/Settings';
import Payments from './components/Payments';
import Accounts from './components/Accounts';
import Help from './components/Help';
import Test from './components/Test';
import Login from './Pages/Login';
import Register from "./components/Register";

function App() {
  return (
    <div className="bg-[#f2f3ae] min-h-screen">
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/products" element={<Products />} />
          <Route path="/scheduler" element={<Scheduler />} />
          <Route path="/tasks" element={<Tasks />} />
          <Route path="/" element={<Test />} />
          <Route path="/login" element={<Login />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/payments" element={<Payments />} />
          <Route path="/accounts" element={<Accounts />} />
          <Route path="/help" element={<Help />} />
          <Route path="/register" element={<Register/>} />
        </Routes>
      </Layout>
    </Router>
    </div>
  );
}

export default App;
