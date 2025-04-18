import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getRequests, updateRequest, deleteRequest } from '../services/api';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [filters, setFilters] = useState({
    requestType: 'All Request Types',
    status: 'All Status',
    search: '',
  });
  const navigate = useNavigate();

  const fetchOrders = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await getRequests();
      console.log('Fetch response:', response.data);
      if (response.data.success) {
        setOrders(response.data.requests.map((order) => ({ ...order, deleting: false })));
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

  useEffect(() => {
    const userRole = localStorage.getItem('userRole');
    console.log('User role:', userRole);

    if (!userRole || userRole !== 'admin') {
      setError('You must be an admin to view this page. Redirecting to login...');
      setTimeout(() => navigate('/login'), 2000);
      setLoading(false);
      return;
    }

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
      const response = await updateRequest(requestId, { status: newStatus });
      console.log('Update response:', response.data);
      if (response.data.success) {
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order.requestId === requestId ? { ...order, status: newStatus } : order
          )
        );
        setSuccess(`Order status updated to ${newStatus} successfully!`);
        setTimeout(() => setSuccess(''), 3000);
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

  const handleDelete = async (requestId) => {
    if (!window.confirm('Are you sure you want to delete this order?')) return;
    setOrders((prevOrders) =>
      prevOrders.map((order) =>
        order.requestId === requestId ? { ...order, deleting: true } : order
      )
    );
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      const userId = localStorage.getItem('userId');
      if (!userId) {
        setError('User ID not found. Please log in again.');
        setLoading(false);
        return;
      }
      console.log(`Sending DELETE request for requestId: ${requestId}, userId: ${userId}`);
      const response = await deleteRequest(requestId, userId);
      console.log('Delete response:', response.data);
      if (response.data.success) {
        await fetchOrders(); // Refresh orders list
        setSuccess('Order deleted successfully!');
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError(response.data.message || 'Failed to delete order');
      }
    } catch (err) {
      console.error('Error deleting order:', err);
      const errorMessage = err.response?.data?.message || 'Error deleting order';
      if (err.response?.status === 404) {
        setError('Order not found. It may have been deleted already.');
        await fetchOrders(); // Refresh orders list
      } else {
        setError(errorMessage);
      }
    } finally {
      setLoading(false);
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.requestId === requestId ? { ...order, deleting: false } : order
        )
      );
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

  if (loading && !orders.length) return <div className="flex items-center justify-center min-h-screen text-gray-500">Loading orders...</div>;
  if (error && !orders.length) return <div className="flex items-center justify-center min-h-screen text-red-600">{error}</div>;

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-4xl p-4 sm:p-6 lg:p-8">
        <h2 className="text-xl sm:text-2xl font-semibold mb-6 text-center">All Orders</h2>
        <div className="bg-white rounded-lg shadow p-4 sm:p-6">
          {/* Filters */}
          <div className="flex flex-col sm:flex-row flex-wrap gap-4 mb-4">
            <div className="flex-1 min-w-[150px]">
              <select
                name="requestType"
                value={filters.requestType}
                onChange={handleFilterChange}
                className="w-full border border-gray-300 rounded-lg p-2 text-sm"
                disabled={loading}
              >
                <option>All Request Types</option>
                <option>New Asset</option>
                <option>Return</option>
                <option>Repair</option>
                <option>Transfer</option>
              </select>
            </div>
            <div className="flex-1 min-w-[150px]">
              <select
                name="status"
                value={filters.status}
                onChange={handleFilterChange}
                className="w-full border border-gray-300 rounded-lg p-2 text-sm"
                disabled={loading}
              >
                <option>All Status</option>
                <option>Pending</option>
                <option>Approved</option>
                <option>Rejected</option>
                <option>Completed</option>
              </select>
            </div>
            <div className="flex-1 min-w-[150px]">
              <input
                type="text"
                name="search"
                value={filters.search}
                onChange={handleFilterChange}
                placeholder="Search by requester or ID..."
                className="w-full border border-gray-300 rounded-lg p-2 text-sm"
                disabled={loading}
              />
            </div>
          </div>

          {/* Messages */}
          {error && <p className="text-red-500 text-sm mb-4 text-center">{error}</p>}
          {success && <p className="text-green-500 text-sm mb-4 text-center">{success}</p>}

          {/* Mobile View: Card Layout */}
          <div className="block md:hidden space-y-4">
            {filteredOrders.map((order) => (
              <div
                key={order.requestId}
                className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 flex flex-col space-y-2"
              >
                <div className="text-sm text-gray-900">
                  <strong>ID:</strong> {order.requestId}
                </div>
                <div className="text-sm text-gray-500">
                  <p><strong>Requester:</strong> {order.requester}</p>
                  <p><strong>Asset:</strong> {order.productName}</p>
                  <p>
                    <strong>Status:</strong>{' '}
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
                  </p>
                  <p><strong>Date:</strong> {new Date(order.timestamp).toLocaleDateString()}</p>
                </div>
                <div className="flex space-x-2">
                  {order.status === 'Pending' ? (
                    <>
                      <button
                        onClick={() => handleStatusChange(order.requestId, 'Approved')}
                        className="px-3 py-1 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700 disabled:bg-green-300"
                        disabled={loading}
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleStatusChange(order.requestId, 'Rejected')}
                        className="px-3 py-1 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700 disabled:bg-red-300"
                        disabled={loading}
                      >
                        Reject
                      </button>
                    </>
                  ) : (
                    <span className="text-gray-500 text-sm">No actions</span>
                  )}
                  <button
                    onClick={() => handleDelete(order.requestId)}
                    className="px-3 py-1 bg-gray-600 text-white rounded-lg text-sm hover:bg-gray-700 disabled:bg-gray-300"
                    disabled={loading || order.deleting}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
            {filteredOrders.length === 0 && (
              <div className="text-center py-4 text-gray-500">No orders found.</div>
            )}
          </div>

          {/* Desktop View: Table Layout */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                <tr>
                  <th className="px-2 sm:px-6 py-3">Request ID</th>
                  <th className="px-2 sm:px-6 py-3">Requester</th>
                  <th className="px-2 sm:px-6 py-3">Asset</th>
                  <th className="px-2 sm:px-6 py-3">Status</th>
                  <th className="px-2 sm:px-6 py-3">Date</th>
                  <th className="px-2 sm:px-6 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order) => (
                  <tr key={order.requestId} className="bg-white border-b">
                    <td className="px-2 sm:px-6 py-4">{order.requestId}</td>
                    <td className="px-2 sm:px-6 py-4">{order.requester}</td>
                    <td className="px-2 sm:px-6 py-4">{order.productName}</td>
                    <td className="px-2 sm:px-6 py-4">
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
                    <td className="px-2 sm:px-6 py-4">{new Date(order.timestamp).toLocaleDateString()}</td>
                    <td className="px-2 sm:px-6 py-4 flex space-x-2">
                      {order.status === 'Pending' ? (
                        <>
                          <button
                            onClick={() => handleStatusChange(order.requestId, 'Approved')}
                            className="px-3 py-1 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700 disabled:bg-green-300"
                            disabled={loading}
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => handleStatusChange(order.requestId, 'Rejected')}
                            className="px-3 py-1 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700 disabled:bg-red-300"
                            disabled={loading}
                          >
                            Reject
                          </button>
                        </>
                      ) : (
                        <span className="text-gray-500">No actions available</span>
                      )}
                      <button
                        onClick={() => handleDelete(order.requestId)}
                        className="px-3 py-1 bg-gray-600 text-white rounded-lg text-sm hover:bg-gray-700 disabled:bg-gray-300"
                        disabled={loading || order.deleting}
                      >
                        Delete
                      </button>
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
    </div>
  );
};

export default Orders;