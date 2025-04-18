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

  if (loading) return <div className="p-8">Loading dashboard...</div>;
  if (error) return <div className="p-8 text-red-600">{error}</div>;

  const outOfStockItems = dashboardData.low_stock_items.filter(item => item.quantity === 0).length;

  return (
    <main className="p-8">
      {/* Dashboard Overview */}
      {/* ... unchanged code for stats cards ... */}

      {/* Charts */}
      {/* ... unchanged code for charts ... */}

      {/* Recent Activity */}
      {/* ... unchanged code for recent activity ... */}
    </main>
  );
};

export default DashboardContent;
