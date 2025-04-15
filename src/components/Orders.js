import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getRequests, updateRequest } from '../services/api'; // Import from api.js (adjust path if needed)

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(''); // Add success state for feedback
  const [filters, setFilters] = useState({
    requestType: 'All Request Types',
    status: 'All Status',
    search: '',
  });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      const userRole = localStorage.getItem('userRole');
      console.log('User role:', userRole);

      if (!userRole || userRole !== 'admin') {
        setError('You must be an admin to view this page. Redirecting to login...');
        setTimeout(() => navigate('/login'), 2000);
        setLoading(false);
        return;
      }

      setLoading(true);
      setError('');
      try {
        const response = await getRequests(); // Use getRequests from api.js
        console.log('Fetch response:', response.data);
        if (response.data.success) {
          setOrders(response.data.requests);
          console.log('Set orders:', response.data.requests);
        } else {
          setError(response.data.message || 'Failed to fetch orders');
        }
      } catch (err) {
        console.error('Fetch error:', err);
        setError(err.response?.data?.message || 'Error fetching orders');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [navigate]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
  };

  const handleStatusChange = async (requestId, newStatus) => {
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      const response = await updateRequest(requestId, { status: newStatus }); // Use updateRequest from api.js
      console.log('Update response:', response.data);
      if (response.data.success) {
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order.requestId === requestId ? { ...order, status: newStatus } : order
          )
        );
        setSuccess(`Order status updated to ${newStatus} successfully!`);
        setTimeout(() => setSuccess(''), 3000); // Clear success message after 3s
      } else {
        setError(response.data.message || `Failed to update order status`);
      }
    } catch (err) {
      console.error('Error updating order status:', err);
      setError(err.response?.data?.message || 'Error updating order status');
    } finally {
      setLoading(false);
    }
  };

  const filteredOrders = orders.filter((order) => {
    const matchesType = filters.requestType === 'All Request Types' || order.requestType === filters.requestType;
    const matchesStatus = filters.status === 'All Status' || order.status === filters.status;
    const matchesSearch =
      !filters.search ||
      order.requestId.toLowerCase().includes(filters.search.toLowerCase()) ||
      order.requester.toLowerCase().includes(filters.search.toLowerCase());
    return matchesType && matchesStatus && matchesSearch;
  });

  if (loading && !orders.length) return <div className="p-4 lg:ml-64 mt-14">Loading orders...</div>;
  if (error && !orders.length) return <div className="p-4 lg:ml-64 mt-14 text-red-600">{error}</div>;

  return (
    <div className="p-4 lg:ml-64 mt-14">
      <div className="p-4 mb-8">
        <h2 className="text-2xl font-semibold mb-6">All Orders</h2>
        <div className="mb-6 bg-white rounded-lg shadow p-4">
          <div className="flex flex-wrap gap-4 mb-4">
            <div className="flex-1">
              <select
                name="requestType"
                value={filters.requestType}
                onChange={handleFilterChange}
                className="w-full border border-gray-300 rounded-lg p-2.5"
                disabled={loading}
              >
                <option>All Request Types</option>
                <option>New Asset</option>
                <option>Return</option>
                <option>Repair</option>
                <option>Transfer</option>
              </select>
            </div>
            <div className="flex-1">
              <select
                name="status"
                value={filters.status}
                onChange={handleFilterChange}
                className="w-full border border-gray-300 rounded-lg p-2.5"
                disabled={loading}
              >
                <option>All Status</option>
                <option>Pending</option>
                <option>Approved</option>
                <option>Rejected</option>
                <option>Completed</option>
              </select>
            </div>
            <div className="flex-1">
              <input
                type="text"
                name="search"
                value={filters.search}
                onChange={handleFilterChange}
                placeholder="Search by requester or ID..."
                className="w-full border border-gray-300 rounded-lg p-2.5"
                disabled={loading}
              />
            </div>
          </div>
          {/* Display Success/Error Messages */}
          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
          {success && <p className="text-green-500 text-sm mb-4">{success}</p>}
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
              <tr>
                <th className="px-6 py-3"> 
   
Request ID</th>
                <th className="px-6 py-3">Requester</th>
                <th className="px-6 py-3">Asset</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">Date</th>
                <th className="px-6 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order) => (
                <tr key={order.requestId} className="bg-white border-b">
                  <td className="px-6 py-4">{order.requestId}</td>
                  <td className="px-6 py-4">{order.requester}</td>
                  <td className="px-6 py-4">{order.productName}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full ${
                        order.status === 'Pending'
                          ? 'text-yellow-700 bg-yellow-100'
                          : order.status === 'Approved'
                          ? 'text-green-700 bg-green-100'
                          : order.status === 'Rejected'
                          ? 'text-red-700 bg-red-100'
                          : 'text-gray-700 bg-gray-100'
                      }`}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">{new Date(order.timestamp).toLocaleDateString()}</td>
                  <td className="px-6 py-4">
                    {order.status === 'Pending' ? (
                      <>
                        <button
                          onClick={() => handleStatusChange(order.requestId, 'Approved')}
                          className="text-black hover:underline mr-2"
                          disabled={loading}
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleStatusChange(order.requestId, 'Rejected')}
                          className="text-red-600 hover:underline"
                          disabled={loading}
                        >
                          Reject
                        </button>
                      </>
                    ) : (
                      <span className="text-gray-500">No actions available</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredOrders.length === 0 && (
            <div className="text-center py-4 text-gray-500">No orders found.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Orders;
