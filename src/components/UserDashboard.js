import React, { useState, useEffect, useRef } from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import * as echarts from 'echarts';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBars,
  faSearch,
  faGaugeHigh,
  faBox,
  faClipboardList,
  faClockRotateLeft,
  faCube,
  faArrowRightFromBracket,
  faCheckCircle,
  faClock,
  faArrowLeft,
  faQrcode,
} from '@fortawesome/free-solid-svg-icons';
import logo from '../assets/images/logo.png';
import { getUserDashboardData } from '../services/api';

const UserDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const usageChartRef = useRef(null);
  const categoryChartRef = useRef(null);
  const [dashboardData, setDashboardData] = useState({
    total_assets: 0,
    checked_out: 0,
    available: 0,
    pending_requests: 0,
    usage: [],
    categories: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (window.location.pathname === '/user-dashboard') {
      const fetchDashboardData = async () => {
        setLoading(true);
        setError('');
        try {
          const userId = localStorage.getItem('userId');
          if (!userId) {
            throw new Error('You must be logged in. Redirecting to login...');
          }

          const response = await getUserDashboardData(userId);
          console.log('User dashboard data:', response.data);
          if (!response.data.success) {
            throw new Error(response.data.message || 'Failed to fetch dashboard data');
          }

          setDashboardData({
            total_assets: response.data.total_assets || 0,
            checked_out: response.data.checked_out || 0,
            available: response.data.available || 0,
            pending_requests: response.data.pending_requests || 0,
            usage: response.data.usage || [],
            categories: response.data.categories || [],
          });
        } catch (err) {
          console.error('Dashboard data error:', err);
          setError(err.message || 'Failed to load dashboard data. Please try again later.');
          if (err.message.includes('logged in')) {
            setTimeout(() => navigate('/login'), 2000);
          }
        } finally {
          setLoading(false);
        }
      };

      fetchDashboardData();
    }
  }, [navigate]);

  useEffect(() => {
    if (!loading && window.location.pathname === '/user-dashboard') {
      if (!usageChartRef.current || !categoryChartRef.current) {
        console.error('Chart refs not ready:', { usage: usageChartRef.current, category: categoryChartRef.current });
        setError('Failed to initialize charts. Please refresh the page.');
        return;
      }

      let usageChart, categoryChart;
      try {
        usageChart = echarts.init(usageChartRef.current);
        categoryChart = echarts.init(categoryChartRef.current);
      } catch (err) {
        console.error('Chart init error:', err);
        setError('Failed to initialize charts. Please refresh the page.');
        return;
      }

      const { usage, categories } = dashboardData;

      usageChart.setOption({
        animation: false,
        tooltip: { trigger: 'axis' },
        xAxis: {
          type: 'category',
          data: usage.length > 0 ? usage.map((item) => item.day) : ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        },
        yAxis: { type: 'value' },
        series: [{
          data: usage.length > 0 ? usage.map((item) => item.count) : [0, 0, 0, 0, 0, 0, 0],
          type: 'line',
          smooth: true,
          color: '#4F46E5',
        }],
        grid: { left: '5%', right: '5%', bottom: '10%' },
      });

      categoryChart.setOption({
        animation: false,
        tooltip: { trigger: 'item' },
        series: [{
          type: 'pie',
          radius: ['40%', '70%'],
          data: categories.length > 0 ? categories : [
            { name: 'Electronics', value: 0 },
            { name: 'Furniture', value: 0 },
            { name: 'Vehicles', value: 0 },
            { name: 'Equipment', value: 0 },
          ],
          color: ['#4F46E5', '#818CF8', '#A5B4FC', '#C7D2FE'],
          label: { show: window.innerWidth >= 640 },
        }],
      });

      const handleResize = () => {
        usageChart.resize();
        categoryChart.resize();
        categoryChart.setOption({
          series: [{ label: { show: window.innerWidth >= 640 } }],
        });
      };

      window.addEventListener('resize', handleResize);
      return () => {
        window.removeEventListener('resize', handleResize);
        if (usageChart) usageChart.dispose();
        if (categoryChart) categoryChart.dispose();
      };
    }
  }, [loading, dashboardData]);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen text-gray-500">Loading dashboard...</div>;
  }

  return (
    <div className="bg-gray-50 font-['Inter'] min-h-screen">
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
              <Link to="/user-dashboard" className="flex ml-2">
                <img src={logo} className="h-6 sm:h-8 mr-3" alt="Logo" />
              </Link>
            </div>
            <div className="hidden sm:flex items-center w-1/3 max-w-md">
              <div className="relative w-full">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <FontAwesomeIcon icon={faSearch} className="text-gray-400" />
                </div>
                <input
                  type="text"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md w-full pl-10 py-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Search assets..."
                />
              </div>
            </div>
            <div className="flex items-center space-x-2 sm:space-x-4">
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

      <aside
        className={`fixed top-0 left-0 z-40 w-64 h-screen pt-16 transition-transform bg-white border-r border-gray-200 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0`}
      >
        <div className="h-full px-3 pb-4 overflow-y-auto bg-white">
          <ul className="space-y-2 font-medium">
            <li>
              <Link
                to="/user-dashboard"
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
            <li>
              <Link
                to="/user-dashboard/view-assets"
                className="flex items-center p-2 text-gray-900 rounded-lg hover:bg-gray-100 group"
                onClick={() => setSidebarOpen(false)}
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
                onClick={() => setSidebarOpen(false)}
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
                onClick={() => setSidebarOpen(false)}
              >
                <FontAwesomeIcon
                  icon={faClockRotateLeft}
                  className="w-5 h-5 text-gray-500 transition duration-75 group-hover:text-black"
                />
                <span className="ml-3">History</span>
              </Link>
            </li>
            <li>
              <Link
                to="/user-dashboard/return"
                className="flex items-center p-2 text-gray-900 rounded-lg hover:bg-gray-100 group"
                onClick={() => setSidebarOpen(false)}
              >
                <FontAwesomeIcon
                  icon={faArrowLeft}
                  className="w-5 h-5 text-gray-500 transition duration-75 group-hover:text-black"
                />
                <span className="ml-3">Return Items</span>
              </Link>
            </li>
            <li>
              <Link
                to="/user-dashboard/scan-qr"
                className="flex items-center p-2 text-gray-900 rounded-lg hover:bg-gray-100 group"
                onClick={() => setSidebarOpen(false)}
              >
                <FontAwesomeIcon
                  icon={faQrcode}
                  className="w-5 h-5 text-gray-500 transition duration-75 group-hover:text-black"
                />
                <span className="ml-3">Scan QR Code</span>
              </Link>
            </li>
          </ul>
        </div>
      </aside>

      <div className="p-4 lg:ml-64 mt-14">
        {window.location.pathname === '/user-dashboard' ? (
          <div className="mb-8">
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-2">
              Welcome back, {localStorage.getItem('userName') || 'User'}!
            </h2>
            <p className="text-sm text-gray-600">Here's what's happening with your assets today.</p>

            {error ? (
              <div className="text-center py-4 text-red-600">{error}</div>
            ) : (
              <>
                <div className="grid grid-cols-1 gap-4 mt-6 sm:grid-cols-2 lg:grid-cols-4">
                  <div className="p-4 bg-white border border-gray-200 rounded-md shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs sm:text-sm text-gray-500">Total Assets</p>
                        <h3 className="text-lg sm:text-xl font-bold text-gray-900">
                          {dashboardData.total_assets.toLocaleString()}
                        </h3>
                      </div>
                      <FontAwesomeIcon icon={faCube} className="text-xl sm:text-2xl text-indigo-600" />
                    </div>
                  </div>
                  <div className="p-4 bg-white border border-gray-200 rounded-md shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs sm:text-sm text-gray-500">Checked Out</p>
                        <h3 className="text-lg sm:text-xl font-bold text-gray-900">
                          {dashboardData.checked_out.toLocaleString()}
                        </h3>
                      </div>
                      <FontAwesomeIcon icon={faArrowRightFromBracket} className="text-xl sm:text-2xl text-indigo-600" />
                    </div>
                  </div>
                  <div className="p-4 bg-white border border-gray-200 rounded-md shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs sm:text-sm text-gray-500">Available</p>
                        <h3 className="text-lg sm:text-xl font-bold text-gray-900">
                          {dashboardData.available.toLocaleString()}
                        </h3>
                      </div>
                      <FontAwesomeIcon icon={faCheckCircle} className="text-xl sm:text-2xl text-indigo-600" />
                    </div>
                  </div>
                  <div className="p-4 bg-white border border-gray-200 rounded-md shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs sm:text-sm text-gray-500">Pending Requests</p>
                        <h3 className="text-lg sm:text-xl font-bold text-gray-900">
                          {dashboardData.pending_requests.toLocaleString()}
                        </h3>
                      </div>
                      <FontAwesomeIcon icon={faClock} className="text-xl sm:text-2xl text-indigo-600" />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 mt-6 lg:grid-cols-2">
                  <div className="p-4 bg-white border border-gray-200 rounded-md shadow-sm">
                    <h4 className="mb-4 text-base sm:text-lg font-semibold text-gray-900">
                      Asset Usage Trend
                    </h4>
                    <div ref={usageChartRef} className="w-full h-48 sm:h-64"></div>
                  </div>
                  <div className="p-4 bg-white border border-gray-200 rounded-md shadow-sm">
                    <h4 className="mb-4 text-base sm:text-lg font-semibold text-gray-900">
                      Asset Categories
                    </h4>
                    <div ref={categoryChartRef} className="w-full h-48 sm:h-64"></div>
                  </div>
                </div>
              </>
            )}
          </div>
        ) : (
          <Outlet />
        )}
      </div>

      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={toggleSidebar}
        />
      )}
    </div>
  );
};

export default UserDashboard;