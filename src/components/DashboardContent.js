import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCube, faExclamationTriangle, faTimesCircle, faDollarSign,
  faPlus, faMinus, faExclamation, faFile, faChartBar, faBarcode
} from '@fortawesome/free-solid-svg-icons';
import * as echarts from 'echarts';
import { getDashboardData } from '../services/api';

const DashboardContent = () => {
  const [dashboardData, setDashboardData] = useState({
    total_items: 0,
    total_value: 0,
    low_stock_items: [],
    total_orders: 0,
    pending_orders: 0,
    recent_orders: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDashboardData = async () => {
      const userRole = localStorage.getItem('userRole');
      if (userRole !== 'admin') {
        setError('You must be an admin to view this page. Redirecting to login...');
        setTimeout(() => navigate('/login'), 2000);
        setLoading(false);
        return;
      }

      setLoading(true);
      setError('');
      try {
        const response = await getDashboardData();
        if (response.data.success) {
          setDashboardData(response.data.data);
        } else {
          setError(response.data.message || 'Failed to fetch dashboard data');
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Error fetching dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [navigate]);

  useEffect(() => {
    if (!loading && !error) {
      const inventoryChart = echarts.init(document.getElementById('inventoryChart'));
      const inventoryOption = {
        animation: false,
        tooltip: { trigger: 'axis' },
        grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
        xAxis: { type: 'category', boundaryGap: false, data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] },
        yAxis: { type: 'value' },
        series: [{
          data: [
            dashboardData.total_value * 0.8,
            dashboardData.total_value * 0.9,
            dashboardData.total_value * 0.7,
            dashboardData.total_value,
            dashboardData.total_value * 0.6,
            dashboardData.total_value * 1.2,
            dashboardData.total_value * 1.1,
          ],
          type: 'line',
          areaStyle: { opacity: 0.1 },
          lineStyle: { color: '#4F46E5' },
          itemStyle: { color: '#4F46E5' },
        }],
      };
      inventoryChart.setOption(inventoryOption);

      const categoryChart = echarts.init(document.getElementById('categoryChart'));
      const categoryCounts = {};
      dashboardData.low_stock_items.forEach(item => {
        categoryCounts[item.category] = (categoryCounts[item.category] || 0) + item.quantity;
      });
      const categoryData = Object.entries(categoryCounts).map(([name, value]) => ({ name, value }));
      const categoryOption = {
        animation: false,
        tooltip: { trigger: 'item' },
        series: [{
          type: 'pie',
          radius: ['40%', '70%'],
          data: categoryData.length ? categoryData : [
            { value: 1048, name: 'Electronics' },
            { value: 735, name: 'Clothing' },
            { value: 580, name: 'Food' },
            { value: 484, name: 'Books' },
            { value: 300, name: 'Others' },
          ],
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)',
            },
          },
        }],
      };
      categoryChart.setOption(categoryOption);

      const handleResize = () => {
        inventoryChart.resize();
        categoryChart.resize();
      };
      window.addEventListener('resize', handleResize);

      return () => {
        window.removeEventListener('resize', handleResize);
        inventoryChart.dispose();
        categoryChart.dispose();
      };
    }
  }, [loading, error, dashboardData]);

  if (loading) return <div className="p-4 sm:p-8 text-center">Loading dashboard...</div>;
  if (error) return <div className="p-4 sm:p-8 text-center text-red-600">{error}</div>;

  const outOfStockItems = dashboardData.low_stock_items.filter((item) => item.quantity === 0).length;

  return (
    <main className="p-4 sm:p-8">
      {/* Dashboard Overview */}
      <div className="mb-6 sm:mb-8">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900 text-center sm:text-left">
          Dashboard Overview
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mt-4 sm:mt-6">
          <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-3 bg-black/10 rounded-lg">
                <FontAwesomeIcon icon={faCube} className="text-black text-lg sm:text-xl" />
              </div>
              <div className="ml-3 sm:ml-4">
                <p className="text-xs sm:text-sm font-medium text-gray-600">Total Items</p>
                <p className="text-lg sm:text-2xl font-semibold text-gray-900">
                  {dashboardData.total_items.toLocaleString()}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-3 bg-yellow-100 rounded-lg">
                <FontAwesomeIcon icon={faExclamationTriangle} className="text-yellow-600 text-lg sm:text-xl" />
              </div>
              <div className="ml-3 sm:ml-4">
                <p className="text-xs sm:text-sm font-medium text-gray-600">Low Stock</p>
                <p className="text-lg sm:text-2xl font-semibold text-gray-900">
                  {dashboardData.low_stock_items.length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-3 bg-red-100 rounded-lg">
                <FontAwesomeIcon icon={faTimesCircle} className="text-red-600 text-lg sm:text-xl" />
              </div>
              <div className="ml-3 sm:ml-4">
                <p className="text-xs sm:text-sm font-medium text-gray-600">Out of Stock</p>
                <p className="text-lg sm:text-2xl font-semibold text-gray-900">{outOfStockItems}</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-lg">
                <FontAwesomeIcon icon={faDollarSign} className="text-green-600 text-lg sm:text-xl" />
              </div>
              <div className="ml-3 sm:ml-4">
                <p className="text-xs sm:text-sm font-medium text-gray-600">Total Value</p>
                <p className="text-lg sm:text-2xl font-semibold text-gray-900">
                  ${dashboardData.total_value.toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
        <div className="lg:col-span-2 bg-white p-4 sm:p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4">
            <h2 className="text-base sm:text-lg font-medium text-gray-900">Inventory Value Trend</h2>
            <select className="mt-2 sm:mt-0 w-full sm:w-auto border-gray-200 rounded-lg text-xs sm:text-sm">
              <option>Last 7 days</option>
              <option>Last 30 days</option>
              <option>Last 90 days</option>
            </select>
          </div>
          <div id="inventoryChart" className="h-64 sm:h-80"></div>
        </div>
        <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-base sm:text-lg font-medium text-gray-900 mb-4">Stock by Category</h2>
          <div id="categoryChart" className="h-64 sm:h-80"></div>
        </div>
      </div>

      {/* Recent Activity and Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-4 sm:p-6 border-b border-gray-200">
              <h2 className="text-base sm:text-lg font-medium text-gray-900">Recent Activity</h2>
            </div>
            <div className="p-4 sm:p-6">
              <div className="space-y-4 sm:space-y-6">
                {dashboardData.recent_orders.length > 0 ? (
                  dashboardData.recent_orders.map((order) => (
                    <div key={order.requestId} className="flex items-center">
                      <div className="flex-shrink-0">
                        <span
                          className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            order.status === 'Pending'
                              ? 'bg-yellow-100'
                              : order.status === 'Approved'
                              ? 'bg-green-100'
                              : 'bg-red-100'
                          }`}
                        >
                          <FontAwesomeIcon
                            icon={
                              order.status === 'Pending'
                                ? faExclamation
                                : order.status === 'Approved'
                                ? faPlus
                                : faMinus
                            }
                            className={
                              order.status === 'Pending'
                                ? 'text-yellow-600'
                                : order.status === 'Approved'
                                ? 'text-green-600'
                                : 'text-red-600'
                            }
                          />
                        </span>
                      </div>
                      <div className="ml-3 sm:ml-4">
                        <p className="text-xs sm:text-sm font-medium text-gray-900">
                          {order.status === 'Pending'
                            ? 'Order Requested'
                            : order.status === 'Approved'
                            ? 'Order Approved'
                            : 'Order Rejected'}
                        </p>
                        <p className="text-xs sm:text-sm text-gray-500">
                          {order.requester} requested {order.productName}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          {new Date(order.timestamp).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-xs sm:text-sm text-gray-500">No recent activity.</p>
                )}
              </div>
            </div>
          </div>
        </div>
        <div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-4 sm:p-6 border-b border-gray-200">
              <h2 className="text-base sm:text-lg font-medium text-gray-900">Quick Actions</h2>
            </div>
            <div className="p-4 sm:p-6">
              <div className="space-y-3 sm:space-y-4">
                <button
                  onClick={() => navigate('/admin-dashboard/add-inventory')}
                  className="w-full flex items-center justify-center px-3 sm:px-4 py-2 border border-transparent text-xs sm:text-sm font-medium rounded-lg text-white bg-black hover:bg-black/90"
                >
                  <FontAwesomeIcon icon={faPlus} className="mr-2" />
                  Add New Item
                </button>
                <button className="w-full flex items-center justify-center px-3 sm:px-4 py-2 border border-gray-200 text-xs sm:text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50">
                  <FontAwesomeIcon icon={faFile} className="mr-2" />
                  Create Purchase Order
                </button>
                <button className="w-full flex items-center justify-center px-3 sm:px-4 py-2 border border-gray-200 text-xs sm:text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50">
                  <FontAwesomeIcon icon={faChartBar} className="mr-2" />
                  Generate Report
                </button>
                <button className="w-full flex items-center justify-center px-3 sm:px-4 py-2 border border-gray-200 text-xs sm:text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50">
                  <FontAwesomeIcon icon={faBarcode} className="mr-2" />
                  Scan Barcode
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default DashboardContent;
