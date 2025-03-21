import React, { useState, useEffect, useRef } from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import * as echarts from 'echarts';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBars,
  faSearch,
  faBell,
  faGaugeHigh,
  faBox,
  faClipboardList,
  faClockRotateLeft,
  faCube,              // Added for Total Assets
  faArrowRightFromBracket, // Added for Checked Out
  faCheckCircle,       // Added for Available
  faClock,             // Added for Pending Requests
} from '@fortawesome/free-solid-svg-icons';

const UserDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const usageChartRef = useRef(null);
  const categoryChartRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Only initialize charts if we're on the default dashboard route
    if (window.location.pathname === '/user-dashboard') {
      const usageChart = echarts.init(usageChartRef.current);
      const categoryChart = echarts.init(categoryChartRef.current);

      usageChart.setOption({
        animation: false,
        tooltip: { trigger: 'axis' },
        xAxis: { type: 'category', data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] },
        yAxis: { type: 'value' },
        series: [{
          data: [150, 230, 224, 218, 135, 147, 260],
          type: 'line',
          smooth: true,
          color: '#4F46E5',
        }],
      });

      categoryChart.setOption({
        animation: false,
        tooltip: { trigger: 'item' },
        series: [{
          type: 'pie',
          radius: ['40%', '70%'],
          data: [
            { value: 40, name: 'Electronics' },
            { value: 25, name: 'Furniture' },
            { value: 20, name: 'Vehicles' },
            { value: 15, name: 'Equipment' },
          ],
          color: ['#4F46E5', '#818CF8', '#A5B4FC', '#C7D2FE'],
        }],
      });

      const handleResize = () => {
        usageChart.resize();
        categoryChart.resize();
      };

      window.addEventListener('resize', handleResize);
      return () => {
        window.removeEventListener('resize', handleResize);
        usageChart.dispose();
        categoryChart.dispose();
      };
    }
  }, []);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  return (
    <div className="bg-gray-50 font-['Inter'] min-h-screen">
      {/* Navigation */}
      <nav className="fixed top-0 z-50 w-full bg-white border-b border-gray-200">
        <div className="px-3 py-3 lg:px-5 lg:pl-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center justify-start">
              <button
                onClick={toggleSidebar}
                className="inline-flex items-center p-2 text-sm text-gray-500 rounded-lg lg:hidden hover:bg-gray-100"
              >
                <FontAwesomeIcon icon={faBars} className="text-lg" />
              </button>
              <Link to="/user-dashboard" className="flex ml-2 md:mr-24">
                <img
                  src="https://ai-public.creatie.ai/gen_page/logo_placeholder.png"
                  className="h-8 mr-3"
                  alt="Logo"
                />
              </Link>
            </div>
            <div className="flex items-center w-1/3">
              <div className="relative w-full">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <FontAwesomeIcon icon={faSearch} className="text-gray-400" />
                </div>
                <input
                  type="text"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md block w-full pl-10 p-2.5"
                  placeholder="Search assets..."
                />
              </div>
            </div>
            <div className="flex items-center">
              <button className="relative p-2 text-gray-600 hover:text-black mr-4">
                <FontAwesomeIcon icon={faBell} className="text-xl" />
                <span className="absolute top-1 right-1 inline-flex items-center justify-center w-4 h-4 text-xs font-bold text-white bg-red-500 rounded-full">
                  3
                </span>
              </button>
              <div className="flex items-center ml-3">
                <button className="flex text-sm bg-gray-800 rounded-full focus:ring-4 focus:ring-gray-300">
                  <img
                    className="w-8 h-8 rounded-full"
                    src="https://creatie.ai/ai/api/search-image?query=A professional headshot of a young business person with a warm smile, wearing modern business attire, against a neutral background. The lighting is soft and flattering, creating a welcoming and approachable appearance&width=200&height=200&orientation=squarish&flag=cf30776c-b7ef-400c-be64-253b4f6cc229"
                    alt="user photo"
                  />
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-40 w-64 h-screen pt-20 transition-transform bg-white border-r border-gray-200 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0`}
      >
        <div className="h-full px-3 pb-4 overflow-y-auto bg-white">
          <ul className="space-y-2 font-medium">
            <li>
              <Link
                to="/user-dashboard"
                className="flex items-center p-2 text-gray-900 rounded-lg hover:bg-gray-100 group"
              >
                <FontAwesomeIcon
                  icon={faGaugeHigh}
                  className="w-5 h-5 text-gray-500 transition duration-75 group-hover:text-black"
                />
                <span className="ml-3">Dashboard</span>
              </Link>
            </li>
            <li>
              <Link
                to="/user-dashboard/view-assets"
                className="flex items-center p-2 text-gray-900 rounded-lg hover:bg-gray-100 group"
              >
                <FontAwesomeIcon
                  icon={faBox}
                  className="w-5 h-5 text-gray-500 transition duration-75 group-hover:text-black"
                />
                <span className="ml-3">View Assets</span>
              </Link>
            </li>
            <li>
              <Link
                to="/user-dashboard/requests"
                className="flex items-center p-2 text-gray-900 rounded-lg hover:bg-gray-100 group"
              >
                <FontAwesomeIcon
                  icon={faClipboardList}
                  className="w-5 h-5 text-gray-500 transition duration-75 group-hover:text-black"
                />
                <span className="ml-3">Requests</span>
              </Link>
            </li>
            <li>
              <Link
                to="/user-dashboard/history"
                className="flex items-center p-2 text-gray-900 rounded-lg hover:bg-gray-100 group"
              >
                <FontAwesomeIcon
                  icon={faClockRotateLeft}
                  className="w-5 h-5 text-gray-500 transition duration-75 group-hover:text-black"
                />
                <span className="ml-3">History</span>
              </Link>
            </li>
          </ul>
        </div>
      </aside>

      {/* Main Content */}
      <div className="p-4 lg:ml-64 mt-14">
        {window.location.pathname === '/user-dashboard' ? (
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900">Welcome back, John!</h2>
            <p className="text-gray-600">Here's what's happening with your assets today.</p>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 gap-4 mb-8 sm:grid-cols-2 lg:grid-cols-4">
              <div className="p-4 bg-white border border-gray-200 rounded-md">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Total Assets</p>
                    <h3 className="text-xl font-bold text-gray-900">245</h3>
                  </div>
                  <FontAwesomeIcon icon={faCube} className="text-2xl text-black" />
                </div>
              </div>
              <div className="p-4 bg-white border border-gray-200 rounded-md">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Checked Out</p>
                    <h3 className="text-xl font-bold text-gray-900">45</h3>
                  </div>
                  <FontAwesomeIcon icon={faArrowRightFromBracket} className="text-2xl text-black" />
                </div>
              </div>
              <div className="p-4 bg-white border border-gray-200 rounded-md">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Available</p>
                    <h3 className="text-xl font-bold text-gray-900">200</h3>
                  </div>
                  <FontAwesomeIcon icon={faCheckCircle} className="text-2xl text-black" />
                </div>
              </div>
              <div className="p-4 bg-white border border-gray-200 rounded-md">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Pending Requests</p>
                    <h3 className="text-xl font-bold text-gray-900">12</h3>
                  </div>
                  <FontAwesomeIcon icon={faClock} className="text-2xl text-black" />
                </div>
              </div>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 gap-4 mb-8 lg:grid-cols-2">
              <div className="p-4 bg-white border border-gray-200 rounded-md">
                <h4 className="mb-4 text-lg font-semibold text-gray-900">Asset Usage Trend</h4>
                <div ref={usageChartRef} className="w-full h-64"></div>
              </div>
              <div className="p-4 bg-white border border-gray-200 rounded-md">
                <h4 className="mb-4 text-lg font-semibold text-gray-900">Asset Categories</h4>
                <div ref={categoryChartRef} className="w-full h-64"></div>
              </div>
            </div>
          </div>
        ) : (
          <Outlet /> // Renders nested routes like ViewAssets
        )}
      </div>
    </div>
  );
};

export default UserDashboard;