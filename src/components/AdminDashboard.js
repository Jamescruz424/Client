import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChartLine, faBoxesStacked, faShoppingCart, faTags, faTruck, faFileAlt, faSearch, faBell } from '@fortawesome/free-solid-svg-icons';

const AdminDashboard = () => {
  const location = useLocation(); // Get current route

  // Function to determine if a link is active
  const isActive = (path) => location.pathname === path || (path !== '/admin-dashboard' && location.pathname.startsWith(path));

  return (
    <div className="min-h-screen flex bg-gray-50 font-['Inter']">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 fixed h-full">
        <div className="flex items-center justify-center h-16 border-b border-gray-200">
          <img src="https://ai-public.creatie.ai/gen_page/logo_placeholder.png" alt="Logo" className="h-8" />
        </div>
        <nav className="mt-6">
          <div className="px-4 space-y-1">
            <Link
              to="/admin-dashboard"
              className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg ${
                isActive('/admin-dashboard') ? 'text-black bg-black/10' : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <FontAwesomeIcon icon={faChartLine} className="w-5 h-5 mr-3" />
              Dashboard
            </Link>
            <Link
              to="/admin-dashboard/inventory"
              className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg ${
                isActive('/admin-dashboard/inventory') ? 'text-black bg-black/10' : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <FontAwesomeIcon icon={faBoxesStacked} className="w-5 h-5 mr-3" />
              Inventory
            </Link>
            <Link
              to="/admin-dashboard/orders"
              className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg ${
                isActive('/admin-dashboard/orders') ? 'text-black bg-black/10' : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <FontAwesomeIcon icon={faShoppingCart} className="w-5 h-5 mr-3" />
              Orders
            </Link>
            <Link
              to="/admin-dashboard/categories"
              className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg ${
                isActive('/admin-dashboard/categories') ? 'text-black bg-black/10' : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <FontAwesomeIcon icon={faTags} className="w-5 h-5 mr-3" />
              Categories
            </Link>
            <Link
              to="/admin-dashboard/suppliers"
              className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg ${
                isActive('/admin-dashboard/suppliers') ? 'text-black bg-black/10' : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <FontAwesomeIcon icon={faTruck} className="w-5 h-5 mr-3" />
              Suppliers
            </Link>
            <Link
              to="/admin-dashboard/reports"
              className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg ${
                isActive('/admin-dashboard/reports') ? 'text-black bg-black/10' : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <FontAwesomeIcon icon={faFileAlt} className="w-5 h-5 mr-3" />
              Reports
            </Link>
          </div>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 ml-64">
        <header className="bg-white shadow-sm">
          <div className="flex items-center justify-between h-16 px-8">
            <div className="relative w-64">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                <FontAwesomeIcon icon={faSearch} className="text-gray-400" />
              </span>
              <input
                type="text"
                placeholder="Search..."
                className="w-full pl-10 pr-4 py-2 border-gray-200 rounded-lg focus:ring-black focus:border-black"
              />
            </div>
            <div className="flex items-center space-x-4">
              <button className="relative p-2 text-gray-400 hover:text-gray-500">
                <FontAwesomeIcon icon={faBell} className="text-xl" />
                <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-400"></span>
              </button>
              <div className="flex items-center">
                <img
                  src="https://creatie.ai/ai/api/search-image?query=A professional headshot of a business person with a friendly smile, wearing a suit, against a neutral background&width=40&height=40"
                  alt="Admin"
                  className="h-8 w-8 rounded-full"
                />
                <span className="ml-3 font-medium text-sm">{localStorage.getItem('userName') || 'John Smith'}</span>
              </div>
            </div>
          </div>
        </header>
        <Outlet /> {/* Renders DashboardContent, InventoryList, AddInventory, or Orders */}
      </div>
    </div>
  );
};

export default AdminDashboard;