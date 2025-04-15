import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
  <div className="bg-gray-50 font-['Inter'] min-h-screen">
    {/* Navigation */}
    <nav className="fixed top-0 z-50 w-full bg-white border-b border-gray-200">
      <div className="px-3 py-3 lg:px-5 lg:pl-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <button
              onClick={toggleSidebar}
              className="inline-flex items-center p-2 text-sm text-gray-500 rounded-lg lg:hidden hover:bg-gray-100"
            >
              <FontAwesomeIcon icon={faBars} className="text-lg" />
            </button>
            <Link to="/admin-dashboard" className="flex ml-2">
              <img src={logo} className="h-6 sm:h-8 mr-3" alt="Logo" />
            </Link>
          </div>
          <div className="flex items-center space-x-2 sm:space-x-4">
            <Link to="/admin-dashboard/chatbot">
              <button
                className="p-2 text-gray-600 hover:text-indigo-600 focus:outline-none"
                title="Ask AI"
              >
                <FontAwesomeIcon icon={faRobot} className="text-lg sm:text-xl" />
              </button>
            </Link>
            <button
              onClick={handleLogout}
              className="p-2 text-gray-600 hover:text-red-600 focus:outline-none"
              title="Logout"
            >
              <FontAwesomeIcon icon={faArrowRightFromBracket} className="text-lg sm:text-xl" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  </div>
);

};

export default AdminDashboard;
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faRobot, faArrowRightFromBracket } from '@fortawesome/free-solid-svg-icons';
import logo from '../assets/images/logo.png';
<aside
  className={`fixed top-0 left-0 z-40 w-64 h-screen pt-16 transition-transform bg-white border-r border-gray-200 ${
    sidebarOpen ? 'translate-x-0' : '-translate-x-full'
  } lg:translate-x-0`}
>
  <div className="h-full px-3 pb-4 overflow-y-auto bg-white">
    <ul className="space-y-2 font-medium">
      <li>
    <Link
      to="/admin-dashboard"
      className="flex items-center p-2 text-gray-900 rounded-lg hover:bg-gray-100 group"
      onClick={() => setSidebarOpen(false)}
    >
      <FontAwesomeIcon
        icon={faGaugeHigh}
        className="w-5 h-5 text-gray-500 transition duration-75 group-hover:text-black"
      />
      <span className="ml-3">Dashboard</span>
    </Link>
  </li>
    </ul>
  </div>
</aside>
import { faGaugeHigh } from '@fortawesome/free-solid-svg-icons';
import { faBox } from '@fortawesome/free-solid-svg-icons';
<li>
  <Link
    to="/admin-dashboard/inventory"
    className="flex items-center p-2 text-gray-900 rounded-lg hover:bg-gray-100 group"
    onClick={() => setSidebarOpen(false)}
  >
    <FontAwesomeIcon icon={faBox} className="w-5 h-5 text-gray-500 group-hover:text-black" />
    <span className="ml-3">Inventory</span>
  </Link>
</li>
import { faClipboardList } from '@fortawesome/free-solid-svg-icons';
<li>
  <Link
    to="/admin-dashboard/orders"
    className="flex items-center p-2 text-gray-900 rounded-lg hover:bg-gray-100 group"
    onClick={() => setSidebarOpen(false)}
  >
    <FontAwesomeIcon icon={faClipboardList} className="w-5 h-5 text-gray-500 group-hover:text-black" />
    <span className="ml-3">Orders</span>
  </Link>
</li>





