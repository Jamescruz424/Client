import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import Login from './components/Login';
import Registration from './components/Registration';
import AdminDashboard from './components/AdminDashboard';
import UserDashboard from './components/UserDashboard';
import InventoryList from './components/InventoryList';
import AddInventory from './components/AddInventory';
import DashboardContent from './components/DashboardContent';
import EditInventory from './components/EditInventory';
import ViewAssets from './components/ViewAssets';
import Requests from './components/Requests';
import Orders from './components/Orders'; // New Orders component

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Registration />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />}>
          <Route index element={<DashboardContent />} />
          <Route path="inventory" element={<InventoryList />} />
          <Route path="add-inventory" element={<AddInventory />} />
          <Route path="edit-inventory/:id" element={<EditInventory />} />
          <Route path="orders" element={<Orders />} /> {/* New Orders route */}
        </Route>
        <Route path="/user-dashboard" element={<UserDashboard />}>
          <Route index element={<div>User Dashboard Home</div>} />
          <Route path="view-assets" element={<ViewAssets />} />
          <Route path="requests" element={<Requests />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;